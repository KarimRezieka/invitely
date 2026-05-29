import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email: string, name: string, token: string) {
  const url = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`;
  await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: email,
    subject: 'Verify your Invitely account',
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
        <h1 style="color:#C9A84C;">Welcome to Invitely, ${name}!</h1>
        <p>Please verify your email address to get started.</p>
        <a href="${url}" style="display:inline-block;background:#C9A84C;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;">Verify Email</a>
        <p style="color:#999;font-size:12px;">Link expires in 24 hours.</p>
      </div>
    `
  });
}

export async function sendPasswordResetEmail(email: string, name: string, token: string) {
  const url = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;
  await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: email,
    subject: 'Reset your Invitely password',
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
        <h1 style="color:#C9A84C;">Password Reset</h1>
        <p>Hi ${name}, we received a request to reset your password.</p>
        <a href="${url}" style="display:inline-block;background:#C9A84C;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;">Reset Password</a>
        <p style="color:#999;font-size:12px;">This link expires in 1 hour. If you didn't request this, ignore this email.</p>
      </div>
    `
  });
}

export async function sendRSVPConfirmationEmail(
  email: string,
  guestName: string,
  coupleNames: string,
  eventDate: Date,
  status: 'ACCEPTED' | 'DECLINED'
) {
  await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: email,
    subject: `RSVP Confirmation - ${coupleNames} Wedding`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
        <h1 style="color:#C9A84C;">RSVP Confirmed</h1>
        <p>Dear ${guestName},</p>
        <p>Your RSVP has been ${status === 'ACCEPTED' ? 'accepted' : 'declined'} for the wedding of ${coupleNames}.</p>
        ${status === 'ACCEPTED' ? `<p>We look forward to celebrating with you on ${eventDate.toLocaleDateString()}!</p>` : ''}
        <p style="color:#999;font-size:12px;">Powered by Invitely</p>
      </div>
    `
  });
}
