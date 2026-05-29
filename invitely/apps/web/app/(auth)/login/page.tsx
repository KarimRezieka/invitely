'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/toast';
import { useAuthStore } from '@/store/auth.store';
import api from '@/lib/api';

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});
type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { setAuth } = useAuthStore();
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', data);
      setAuth(res.data.user, res.data.accessToken);
      toast({ title: 'Welcome back!', description: `Good to see you, ${res.data.user.name}` });
      router.push('/dashboard');
    } catch (err: any) {
      toast({
        title: 'Login failed',
        description: err.response?.data?.message || 'Something went wrong',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--ink)' }}>
      {/* ── Left panel — decorative ── */}
      <div
        className="hidden lg:flex lg:w-[46%] relative overflow-hidden items-end"
        style={{
          background: 'linear-gradient(160deg, #1A1408 0%, #0C0B0A 60%)',
          borderRight: '1px solid var(--ink-border)',
        }}
      >
        {/* Radial glow */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 70% 50% at 40% 35%, rgba(201,168,76,0.13), transparent)',
        }} />

        {/* Floating invitation card */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
          <div
            className="animate-float atelier-card"
            style={{
              width: 300,
              boxShadow: '0 32px 80px rgba(0,0,0,0.7), 0 0 60px var(--gold-glow-lg)',
            }}
          >
            <div style={{
              background: 'linear-gradient(160deg, #231C0F, #1A1508)',
              padding: '2.5rem 2rem',
              textAlign: 'center',
              position: 'relative',
            }}>
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(201,168,76,0.1), transparent)' }} />
              <div className="relative">
                <div style={{ fontSize: '0.6rem', letterSpacing: '0.2em', color: 'var(--gold-dim)', marginBottom: '1.25rem', textTransform: 'uppercase' }}>
                  Wedding Invitation
                </div>
                <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, var(--gold-dim), transparent)', marginBottom: '1.5rem' }} />
                <div className="font-display italic" style={{ fontSize: '2.5rem', color: 'var(--gold-light)', lineHeight: 1.1 }}>
                  Layla<br />&amp;<br />Karim
                </div>
                <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, var(--gold-dim), transparent)', marginTop: '1.5rem', marginBottom: '1.25rem' }} />
                <div style={{ fontSize: '0.7rem', letterSpacing: '0.12em', color: 'var(--mist)', textTransform: 'uppercase' }}>
                  14 June 2025 · Dubai
                </div>
              </div>
            </div>
            <div style={{ padding: '1.25rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.6rem', color: 'var(--dust)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Venue</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--champagne)', marginTop: '2px' }}>Atlantis The Palm</div>
              </div>
              <div className="btn-gold" style={{ padding: '5px 14px', borderRadius: 6, fontSize: '0.7rem' }}>RSVP</div>
            </div>
          </div>
        </div>

        {/* Bottom brand */}
        <div style={{ padding: '2.5rem', position: 'relative', width: '100%' }}>
          <div className="font-display" style={{ color: 'var(--gold)', fontSize: '1.75rem', marginBottom: '0.5rem' }}>Invitely</div>
          <p style={{ color: 'var(--dust)', fontSize: '0.85rem' }}>
            Every great love deserves a great invitation.
          </p>
        </div>
      </div>

      {/* ── Right panel — form ── */}
      <div className="flex-1 flex items-center justify-center px-8 py-16">
        <div style={{ width: '100%', maxWidth: 420 }}>
          {/* Mobile logo */}
          <div className="lg:hidden font-display text-2xl mb-10 text-center" style={{ color: 'var(--gold-light)' }}>
            Invitely
          </div>

          <div style={{ marginBottom: '2.5rem' }}>
            <h2 className="font-display" style={{ fontSize: '2rem', color: 'var(--champagne)', marginBottom: '0.5rem' }}>
              Welcome back
            </h2>
            <p style={{ color: 'var(--mist)', fontSize: '0.9rem' }}>
              Sign in to your atelier account
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <Label htmlFor="email">Email address</Label>
              <Input id="email" type="email" placeholder="you@example.com" {...register('email')} />
              {errors.email && <p style={{ color: '#E07070', fontSize: '0.78rem', marginTop: '0.35rem' }}>{errors.email.message}</p>}
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div style={{ position: 'relative' }}>
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('password')}
                />
                <button
                  type="button"
                  style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--dust)', background: 'none', border: 'none', cursor: 'pointer' }}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && <p style={{ color: '#E07070', fontSize: '0.78rem', marginTop: '0.35rem' }}>{errors.password.message}</p>}
            </div>

            <div style={{ textAlign: 'right' }}>
              <Link href="/forgot-password" style={{ fontSize: '0.8rem', color: 'var(--gold)', textDecoration: 'none' }}>
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="w-full" style={{ padding: '0.75rem', borderRadius: '10px' }} disabled={loading}>
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
                  <Loader2 size={15} className="animate-spin" /> Signing in…
                </span>
              ) : 'Sign In'}
            </Button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.85rem', color: 'var(--mist)' }}>
            No account?{' '}
            <Link href="/register" style={{ color: 'var(--gold)', textDecoration: 'none', fontWeight: 600 }}>
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
