'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/toast';
import api from '@/lib/api';

const schema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  groomName: z.string().min(1, 'Required').max(100),
  brideName: z.string().min(1, 'Required').max(100),
  eventDate: z.string().min(1, 'Event date is required'),
  venue: z.string().optional(),
  venueAddress: z.string().optional(),
});
type Form = z.infer<typeof schema>;

export default function NewInvitationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const templateId = searchParams.get('template');
  const [loading, setLoading] = useState(false);
  const [template, setTemplate] = useState<any>(null);

  useEffect(() => {
    if (templateId) {
      api.get(`/templates/${templateId}`).then((res) => setTemplate(res.data)).catch(console.error);
    }
  }, [templateId]);

  const { register, handleSubmit, formState: { errors } } = useForm<Form>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: Form) => {
    if (!templateId) {
      toast({ title: 'Error', description: 'No template selected', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/invitations', {
        ...data,
        templateId,
        eventDate: new Date(data.eventDate).toISOString(),
      });
      router.push(`/builder/${res.data.id}`);
    } catch (err: any) {
      toast({ title: 'Error', description: err.response?.data?.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Create New Invitation</h1>
        {template && (
          <p className="text-zinc-500 mt-1">Using template: <span className="font-medium text-amber-600">{template.name}</span></p>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Wedding Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <Label htmlFor="title">Invitation Title</Label>
              <Input id="title" placeholder="Ahmed & Sara's Wedding" {...register('title')} />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="groomName">Groom's Name</Label>
                <Input id="groomName" placeholder="Ahmed" {...register('groomName')} />
                {errors.groomName && <p className="text-red-500 text-sm mt-1">{errors.groomName.message}</p>}
              </div>
              <div>
                <Label htmlFor="brideName">Bride's Name</Label>
                <Input id="brideName" placeholder="Sara" {...register('brideName')} />
                {errors.brideName && <p className="text-red-500 text-sm mt-1">{errors.brideName.message}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="eventDate">Wedding Date</Label>
              <Input id="eventDate" type="datetime-local" {...register('eventDate')} />
              {errors.eventDate && <p className="text-red-500 text-sm mt-1">{errors.eventDate.message}</p>}
            </div>

            <div>
              <Label htmlFor="venue">Venue Name</Label>
              <Input id="venue" placeholder="Grand Ballroom at The Ritz" {...register('venue')} />
            </div>

            <div>
              <Label htmlFor="venueAddress">Venue Address</Label>
              <Input id="venueAddress" placeholder="123 Wedding Lane, Dubai, UAE" {...register('venueAddress')} />
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/templates')}
              >
                Back to Templates
              </Button>
              <Button type="submit" className="flex-1 bg-amber-600 hover:bg-amber-700" disabled={loading}>
                {loading ? (
                  <><Loader2 size={16} className="animate-spin mr-2" /> Creating...</>
                ) : (
                  'Create & Open Builder'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
