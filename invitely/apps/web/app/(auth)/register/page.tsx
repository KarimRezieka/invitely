'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/toast';
import api from '@/lib/api';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters').regex(
    /^(?=.*[A-Z])(?=.*[0-9])/,
    'Password must contain at least one uppercase letter and one number'
  ),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});
type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true);
    try {
      await api.post('/auth/register', {
        name: data.name,
        email: data.email,
        password: data.password,
      });
      setSuccess(true);
    } catch (err: any) {
      toast({
        title: 'Registration failed',
        description: err.response?.data?.message || 'Something went wrong',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ textAlign: 'center', maxWidth: 400 }}>
          <div className="font-display italic" style={{ fontSize: '4rem', color: 'var(--gold)', marginBottom: '1.5rem' }}>✉</div>
          <h2 className="font-display" style={{ fontSize: '2rem', color: 'var(--champagne)', marginBottom: '0.75rem' }}>
            Check your inbox
          </h2>
          <p style={{ color: 'var(--mist)', marginBottom: '2rem', lineHeight: 1.7, fontSize: '0.9rem' }}>
            We&apos;ve sent a verification link to your email. Click it to activate your Invitely account.
          </p>
          <Button onClick={() => router.push('/login')} style={{ padding: '0.75rem 2rem', borderRadius: 10 }}>
            Go to Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--ink)' }}>
      {/* Left decorative */}
      <div className="hidden lg:flex lg:w-[46%] relative overflow-hidden flex-col justify-end"
        style={{ background: 'linear-gradient(160deg, #1A1408, #0C0B0A)', borderRight: '1px solid var(--ink-border)' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 50% at 40% 35%, rgba(201,168,76,0.11), transparent)' }} />
        <div style={{ padding: '3rem', position: 'relative' }}>
          <div className="font-display" style={{ fontSize: '1.75rem', color: 'var(--gold)', marginBottom: '0.5rem' }}>Invitely</div>
          <p style={{ color: 'var(--dust)', fontSize: '0.875rem', lineHeight: 1.6 }}>
            Join thousands of couples creating<br />beautiful digital wedding memories.
          </p>
          <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {['Beautiful templates crafted by designers', 'Real-time RSVP management', 'Detailed analytics and insights'].map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.8rem', color: 'var(--mist)' }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--gold)', flexShrink: 0 }} />
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center px-8 py-16">
        <div style={{ width: '100%', maxWidth: 420 }}>
          <div className="lg:hidden font-display text-2xl mb-10 text-center" style={{ color: 'var(--gold-light)' }}>Invitely</div>

          <div style={{ marginBottom: '2.5rem' }}>
            <h2 className="font-display" style={{ fontSize: '2rem', color: 'var(--champagne)', marginBottom: '0.5rem' }}>
              Create your account
            </h2>
            <p style={{ color: 'var(--mist)', fontSize: '0.9rem' }}>Free forever · No credit card required</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <Label htmlFor="name">Your name</Label>
              <Input id="name" placeholder="Ahmed & Sara" {...register('name')} />
              {errors.name && <p style={{ color: '#E07070', fontSize: '0.78rem', marginTop: '0.35rem' }}>{errors.name.message}</p>}
            </div>

            <div>
              <Label htmlFor="email">Email address</Label>
              <Input id="email" type="email" placeholder="you@example.com" {...register('email')} />
              {errors.email && <p style={{ color: '#E07070', fontSize: '0.78rem', marginTop: '0.35rem' }}>{errors.email.message}</p>}
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div style={{ position: 'relative' }}>
                <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="Min 8 chars, 1 uppercase, 1 number" {...register('password')} />
                <button type="button" style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--dust)', background: 'none', border: 'none', cursor: 'pointer' }}
                  onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && <p style={{ color: '#E07070', fontSize: '0.78rem', marginTop: '0.35rem' }}>{errors.password.message}</p>}
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <Input id="confirmPassword" type="password" placeholder="••••••••" {...register('confirmPassword')} />
              {errors.confirmPassword && <p style={{ color: '#E07070', fontSize: '0.78rem', marginTop: '0.35rem' }}>{errors.confirmPassword.message}</p>}
            </div>

            <Button type="submit" className="w-full" style={{ padding: '0.75rem', borderRadius: '10px', marginTop: '0.25rem' }} disabled={loading}>
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
                  <Loader2 size={15} className="animate-spin" /> Creating account…
                </span>
              ) : 'Create Free Account'}
            </Button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.85rem', color: 'var(--mist)' }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: 'var(--gold)', textDecoration: 'none', fontWeight: 600 }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
