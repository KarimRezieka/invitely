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
    <div className="min-h-screen flex">
      {/* Left — Decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-amber-900 via-amber-700 to-amber-500 relative overflow-hidden items-center justify-center">
        <div className="text-center text-white z-10 px-12">
          <h1 className="text-5xl font-serif mb-4">Invitely</h1>
          <p className="text-xl opacity-80">Craft your perfect love story, one invite at a time.</p>
          <div className="mt-12 grid grid-cols-3 gap-3 opacity-30">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="h-16 rounded-lg bg-white/20" />
            ))}
          </div>
        </div>
      </div>

      {/* Right — Form */}
      <div className="flex-1 flex items-center justify-center px-8 py-12 bg-white dark:bg-zinc-950">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <div className="lg:hidden text-3xl font-serif text-amber-700 mb-2">Invitely</div>
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Welcome back</h2>
            <p className="text-zinc-500 mt-2">Sign in to continue to Invitely</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" {...register('email')} />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('password')}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>

            <div className="text-right">
              <Link href="/forgot-password" className="text-sm text-amber-600 hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700" disabled={loading}>
              {loading ? (
                <><Loader2 size={16} className="animate-spin mr-2" /> Signing in...</>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          <p className="text-center text-zinc-500 text-sm">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-amber-600 hover:underline font-medium">
              Sign up free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
