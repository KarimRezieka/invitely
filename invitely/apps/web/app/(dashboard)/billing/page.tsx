'use client';

import { useEffect, useState } from 'react';
import { Crown, Loader2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast';
import { useAuthStore } from '@/store/auth.store';
import api from '@/lib/api';

const PLANS = [
  {
    name: 'Free',
    key: 'FREE',
    price: '$0',
    features: ['1 invitation', '50 guests', 'Free templates only', 'Basic RSVP'],
  },
  {
    name: 'Basic',
    key: 'BASIC',
    price: '$9/mo',
    features: ['3 invitations', '200 guests', 'All templates', 'CSV export', 'Email notifications'],
    highlight: false,
  },
  {
    name: 'Premium',
    key: 'PREMIUM',
    price: '$19/mo',
    features: ['Unlimited invitations', 'Unlimited guests', 'All templates', 'Custom domain', 'Priority support', 'Advanced analytics'],
    highlight: true,
  },
];

export default function BillingPage() {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState<string | null>(null);

  useEffect(() => {
    api.get('/payments/subscription').then((res) => {
      setSubscription(res.data);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleUpgrade = async (plan: 'BASIC' | 'PREMIUM') => {
    setUpgrading(plan);
    try {
      const res = await api.post('/payments/checkout', { plan });
      window.location.href = res.data.url;
    } catch (err: any) {
      toast({ title: 'Error', description: err.response?.data?.message, variant: 'destructive' });
    } finally {
      setUpgrading(null);
    }
  };

  const handleManageBilling = async () => {
    try {
      const res = await api.post('/payments/portal');
      window.location.href = res.data.url;
    } catch (err: any) {
      toast({ title: 'Error', description: err.response?.data?.message, variant: 'destructive' });
    }
  };

  const currentPlan = subscription?.plan || 'FREE';

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Billing & Plans</h1>
        <p className="text-zinc-500 mt-1">Manage your subscription</p>
      </div>

      {/* Current Plan */}
      {!loading && subscription && (
        <Card className="mb-8 border-amber-200 dark:border-amber-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="text-amber-500" size={20} />
              Current Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-zinc-900 dark:text-white">{currentPlan}</span>
                  <Badge variant={subscription.status === 'ACTIVE' ? 'default' : 'secondary'} className="bg-green-500">
                    {subscription.status}
                  </Badge>
                </div>
                {subscription.currentPeriodEnd && (
                  <p className="text-sm text-zinc-500 mt-1">
                    Renews on {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                  </p>
                )}
              </div>
              {currentPlan !== 'FREE' && (
                <Button variant="outline" onClick={handleManageBilling}>Manage Billing</Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Plan Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {PLANS.map((plan) => {
          const isCurrent = currentPlan === plan.key;
          const isUpgrade = ['FREE', 'BASIC', 'PREMIUM', 'ENTERPRISE'].indexOf(plan.key) >
            ['FREE', 'BASIC', 'PREMIUM', 'ENTERPRISE'].indexOf(currentPlan);

          return (
            <Card key={plan.key} className={plan.highlight ? 'border-amber-500 shadow-lg' : ''}>
              <CardHeader>
                {plan.highlight && (
                  <div className="text-xs font-bold text-amber-600 uppercase tracking-wide mb-1">Most Popular</div>
                )}
                <CardTitle>{plan.name}</CardTitle>
                <div className="text-3xl font-serif text-amber-600">{plan.price}</div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                      <Check size={14} className="text-green-500 flex-shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                {isCurrent ? (
                  <Button variant="outline" className="w-full" disabled>Current Plan</Button>
                ) : isUpgrade && plan.key !== 'FREE' ? (
                  <Button
                    className="w-full bg-amber-600 hover:bg-amber-700"
                    onClick={() => handleUpgrade(plan.key as 'BASIC' | 'PREMIUM')}
                    disabled={upgrading === plan.key}
                  >
                    {upgrading === plan.key ? (
                      <><Loader2 size={14} className="animate-spin mr-1" /> Redirecting...</>
                    ) : (
                      `Upgrade to ${plan.name}`
                    )}
                  </Button>
                ) : (
                  <Button variant="outline" className="w-full" onClick={handleManageBilling}>
                    Downgrade
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
