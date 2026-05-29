import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { prisma } from '../../lib/prisma';
import { sendVerificationEmail, sendPasswordResetEmail } from '../../lib/mailer';
import { RegisterDTO, LoginDTO, TokenPayload } from './auth.types';

export class AuthService {
  private generateTokens(payload: TokenPayload) {
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: (process.env.JWT_EXPIRES_IN || '15m') as any,
    });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {
      expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || '7d') as any,
    });
    return { accessToken, refreshToken };
  }

  async register(dto: RegisterDTO) {
    const existing = await prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new Error('Email already registered');

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const emailVerifyToken = crypto.randomBytes(32).toString('hex');

    const user = await prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        passwordHash,
        emailVerifyToken,
        subscription: { create: { plan: 'FREE', status: 'ACTIVE' } }
      }
    });

    await sendVerificationEmail(user.email, user.name, emailVerifyToken);
    return { message: 'Registration successful. Please check your email to verify your account.' };
  }

  async login(dto: LoginDTO, ipAddress?: string, userAgent?: string) {
    const user = await prisma.user.findUnique({ where: { email: dto.email } });
    if (!user || !user.passwordHash) throw new Error('Invalid credentials');
    if (!user.emailVerified) throw new Error('Please verify your email before logging in');

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) throw new Error('Invalid credentials');

    const payload: TokenPayload = { sub: user.id, email: user.email, role: user.role };
    const { accessToken, refreshToken } = this.generateTokens(payload);

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await prisma.session.create({
      data: { userId: user.id, refreshToken, expiresAt, ipAddress, userAgent }
    });

    return {
      accessToken,
      refreshToken,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, avatarUrl: user.avatarUrl }
    };
  }

  async verifyEmail(token: string) {
    const user = await prisma.user.findUnique({ where: { emailVerifyToken: token } });
    if (!user) throw new Error('Invalid or expired verification token');

    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: true, emailVerifyToken: null }
    });

    return { message: 'Email verified successfully' };
  }

  async refreshTokens(refreshToken: string) {
    const session = await prisma.session.findUnique({ where: { refreshToken } });
    if (!session || session.expiresAt < new Date()) throw new Error('Invalid refresh token');

    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as TokenPayload;
    const newPayload: TokenPayload = { sub: payload.sub, email: payload.email, role: payload.role };
    const tokens = this.generateTokens(newPayload);

    await prisma.session.update({
      where: { id: session.id },
      data: {
        refreshToken: tokens.refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    });

    return tokens;
  }

  async logout(refreshToken: string) {
    await prisma.session.deleteMany({ where: { refreshToken } });
    return { message: 'Logged out successfully' };
  }

  async forgotPassword(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return { message: 'If that email is registered, a reset link has been sent.' };

    const token = crypto.randomBytes(32).toString('hex');
    const expiry = new Date(Date.now() + 60 * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: { resetPasswordToken: token, resetPasswordExpiry: expiry }
    });

    await sendPasswordResetEmail(user.email, user.name, token);
    return { message: 'If that email is registered, a reset link has been sent.' };
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordExpiry: { gt: new Date() }
      }
    });
    if (!user) throw new Error('Invalid or expired reset token');

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash, resetPasswordToken: null, resetPasswordExpiry: null }
    });

    await prisma.session.deleteMany({ where: { userId: user.id } });
    return { message: 'Password reset successfully. Please log in.' };
  }

  async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { subscription: true }
    });
    if (!user) throw new Error('User not found');
    const { passwordHash, emailVerifyToken, resetPasswordToken, ...safeUser } = user;
    return safeUser;
  }
}
