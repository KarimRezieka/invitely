'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/toast';
import api from '@/lib/api';

const schema = z.object({ email: z.string().email('Invalid email') });
type Form = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { toast } = useToast();

  const { register, handleSubmit, formState: { errors } } = useForm<Form>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: Form) => {
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', data);
      setSent(true);
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.response?.data?.message || 'Something went wrong',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950 px-8">
        <div className="text-center max-w-md">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-3">Email sent!</h2>
          <p className="text-zinc-500 mb-6">
            If that email is registered, you'll receive a reset link shortly. Check your spam folder too.
          </p>
          <Link href="/login" className="text-amber-600 hover:underline font-medium">
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950 px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="text-3xl font-serif text-amber-700 mb-6">Invitely</div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Forgot your password?</h2>
          <p className="text-zinc-500 mt-2">Enter your email and we'll send you a reset link</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <Label htmlFor="email">Email address</Label>
            <Input id="email" type="email" placeholder="you@example.com" {...register('email')} />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700" disabled={loading}>
            {loading ? (
              <><Loader2 size={16} className="animate-spin mr-2" /> Sending...</>
            ) : (
              'Send Reset Link'
            )}
          </Button>
        </form>

        <p className="text-center text-zinc-500 text-sm">
          Remember your password?{' '}
          <Link href="/login" className="text-amber-600 hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
