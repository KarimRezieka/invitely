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
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950 px-8">
        <div className="text-center max-w-md">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-3">Check your email!</h2>
          <p className="text-zinc-500 mb-6">
            We've sent a verification link to your email address. Please click the link to activate your account.
          </p>
          <Button onClick={() => router.push('/login')} className="bg-amber-600 hover:bg-amber-700">
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-amber-900 via-amber-700 to-amber-500 items-center justify-center">
        <div className="text-center text-white px-12">
          <h1 className="text-5xl font-serif mb-4">Invitely</h1>
          <p className="text-xl opacity-80">Your wedding, beautifully digital.</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-8 py-12 bg-white dark:bg-zinc-950">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <div className="lg:hidden text-3xl font-serif text-amber-700 mb-2">Invitely</div>
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Create your account</h2>
            <p className="text-zinc-500 mt-2">Start with a free account, no credit card required</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="Ahmed & Sara" {...register('name')} />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>

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
                  placeholder="Min. 8 chars, 1 uppercase, 1 number"
                  {...register('password')}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700" disabled={loading}>
              {loading ? (
                <><Loader2 size={16} className="animate-spin mr-2" /> Creating account...</>
              ) : (
                'Create Free Account'
              )}
            </Button>
          </form>

          <p className="text-center text-zinc-500 text-sm">
            Already have an account?{' '}
            <Link href="/login" className="text-amber-600 hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
