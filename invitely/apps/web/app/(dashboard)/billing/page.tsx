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
  const planOrder = ['FREE', 'BASIC', 'PREMIUM', 'ENTERPRISE'];

  return (
    <div style={{ padding: '2.5rem', minHeight: '100%', background: 'var(--ink)', maxWidth: 900 }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ fontSize: '0.65rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--gold-dim)', marginBottom: '0.4rem' }}>
          Subscription
        </div>
        <h1 className="font-display" style={{ fontSize: '2rem', color: 'var(--champagne)' }}>
          Billing &amp; Plans
        </h1>
      </div>

      {/* Current plan summary */}
      {!loading && subscription && (
        <div style={{
          background: 'var(--ink-raised)', border: '1px solid var(--ink-border-strong)',
          borderRadius: 12, padding: '1.5rem', marginBottom: '2rem',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, var(--gold), transparent)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{ width: 48, height: 48, borderRadius: 10, background: 'linear-gradient(135deg, var(--gold-dim), var(--gold))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Crown size={20} style={{ color: 'var(--ink)' }} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span className="font-display" style={{ fontSize: '1.5rem', color: 'var(--champagne)' }}>{currentPlan}</span>
                <span className="badge-published">{subscription.status}</span>
              </div>
              {subscription.currentPeriodEnd && (
                <div style={{ fontSize: '0.78rem', color: 'var(--mist)', marginTop: '0.2rem' }}>
                  Renews {new Date(subscription.currentPeriodEnd).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </div>
              )}
            </div>
          </div>
          {currentPlan !== 'FREE' && (
            <button onClick={handleManageBilling} className="btn-ghost" style={{ padding: '0.5rem 1rem', borderRadius: 8, fontSize: '0.8rem', border: '1px solid var(--ink-border-strong)', cursor: 'pointer' }}>
              Manage Billing
            </button>
          )}
        </div>
      )}

      {/* Plan cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
        {PLANS.map((plan) => {
          const isCurrent = currentPlan === plan.key;
          const isUpgrade = planOrder.indexOf(plan.key) > planOrder.indexOf(currentPlan);

          return (
            <div
              key={plan.key}
              style={{
                background: 'var(--ink-raised)',
                border: `1px solid ${plan.highlight ? 'rgba(201,168,76,0.35)' : 'var(--ink-border)'}`,
                borderRadius: 12, overflow: 'hidden',
                display: 'flex', flexDirection: 'column',
                boxShadow: plan.highlight ? '0 0 30px var(--gold-glow-lg)' : 'none',
                position: 'relative',
              }}
            >
              {plan.highlight && (
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, var(--gold), transparent)' }} />
              )}
              <div style={{ padding: '1.75rem 1.75rem 1.25rem' }}>
                {plan.highlight && <div className="badge-gold" style={{ display: 'inline-block', marginBottom: '0.75rem' }}>Most chosen</div>}
                <div style={{ fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--dust)', marginBottom: '0.5rem' }}>
                  {plan.name}
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem' }}>
                  <span className="font-display" style={{ fontSize: '2.75rem', color: isCurrent || plan.highlight ? 'var(--gold-light)' : 'var(--champagne)', lineHeight: 1 }}>
                    {plan.price}
                  </span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--dust)' }}>/ mo</span>
                </div>
              </div>

              <div style={{ height: '1px', background: 'var(--ink-border)', margin: '0 1.75rem' }} />

              <ul style={{ padding: '1.25rem 1.75rem', flex: 1, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                {plan.features.map((f) => (
                  <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', fontSize: '0.82rem', color: 'var(--mist)' }}>
                    <Check size={13} style={{ color: 'var(--gold-dim)', flexShrink: 0 }} />
                    {f}
                  </li>
                ))}
              </ul>

              <div style={{ padding: '0 1.75rem 1.75rem' }}>
                {isCurrent ? (
                  <button disabled style={{ width: '100%', padding: '0.625rem', borderRadius: 8, background: 'var(--ink-surface)', border: '1px solid var(--ink-border)', color: 'var(--dust)', fontSize: '0.8rem', cursor: 'not-allowed' }}>
                    Current Plan
                  </button>
                ) : isUpgrade && plan.key !== 'FREE' ? (
                  <button
                    className="btn-gold"
                    style={{ width: '100%', padding: '0.625rem', borderRadius: 8, fontSize: '0.8rem', letterSpacing: '0.03em', cursor: 'pointer', border: 'none' }}
                    onClick={() => handleUpgrade(plan.key as 'BASIC' | 'PREMIUM')}
                    disabled={upgrading === plan.key}
                  >
                    {upgrading === plan.key ? 'Redirecting…' : `Upgrade to ${plan.name}`}
                  </button>
                ) : (
                  <button
                    className="btn-ghost"
                    style={{ width: '100%', padding: '0.625rem', borderRadius: 8, fontSize: '0.8rem', cursor: 'pointer' }}
                    onClick={handleManageBilling}
                  >
                    Downgrade
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
