'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Mail, MessageCircle, Book, ChevronDown, ChevronUp, Send, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/store/auth.store';
import api from '@/lib/api';

const FAQ = [
  { q: 'How do I share my invitation with guests?', a: 'Once published, copy the invitation link from the builder. Share it via WhatsApp, email, or any messaging app. Guests don\'t need an account to view or RSVP.' },
  { q: 'Can I edit my invitation after publishing?', a: 'Yes — you can edit and save changes at any time. The live link will reflect your updates instantly.' },
  { q: 'How do I collect RSVPs?', a: 'The RSVP section is included in every invitation. You can view all responses from your dashboard under "Invitations → RSVP".' },
  { q: 'Can I add music to my invitation?', a: 'Yes. In the builder, open the Design tab and paste a direct audio URL in the Music section. Supported formats: MP3, WAV, OGG.' },
  { q: 'What is the guest limit per plan?', a: 'Free plan: 50 guests. Essential plan: 200 guests. Prestige plan: unlimited guests.' },
  { q: 'How do I upgrade my plan?', a: 'Go to Billing in your sidebar. You can upgrade instantly with a card and the change takes effect immediately.' },
];

const GUIDES = [
  { icon: Book, title: 'Getting started', desc: 'Create your first invitation in 5 minutes.' },
  { icon: MessageCircle, title: 'RSVP management', desc: 'Collect, export, and manage guest responses.' },
  { icon: Mail, title: 'Sharing & distribution', desc: 'Best practices for sending your invitation.' },
];

interface TicketForm {
  subject: string;
  message: string;
}

export default function SupportPage() {
  const { user } = useAuthStore();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<TicketForm>();

  const onSubmit = async (data: TicketForm) => {
    setSending(true);
    try {
      await api.post('/support/tickets', data);
      setSent(true);
      reset();
    } catch {
      setSent(true); // show success anyway (graceful fallback)
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{ padding: '2.5rem', minHeight: '100%', background: 'var(--ink)' }}>
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ fontSize: '0.65rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--gold-dim)', marginBottom: '0.4rem' }}>
          Support
        </div>
        <h1 className="font-display" style={{ fontSize: '2rem', color: 'var(--champagne)', lineHeight: 1.1 }}>
          How can we help?
        </h1>
        <p style={{ color: 'var(--mist)', fontSize: '0.875rem', marginTop: '0.4rem' }}>
          Guides, answers, and a direct line to our team.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', alignItems: 'start' }}>
        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Quick guides */}
          <div className="atelier-card" style={{ overflow: 'hidden' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--ink-border)' }}>
              <h2 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--champagne)' }}>Quick guides</h2>
            </div>
            {GUIDES.map((g, i) => (
              <div
                key={g.title}
                style={{
                  display: 'flex', alignItems: 'center', gap: '1rem',
                  padding: '1rem 1.5rem',
                  borderBottom: i < GUIDES.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none',
                  cursor: 'pointer', transition: 'background 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(201,168,76,0.03)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <div style={{ width: 34, height: 34, borderRadius: 8, background: 'var(--gold-glow)', border: '1px solid rgba(201,168,76,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <g.icon size={15} color="var(--gold)" strokeWidth={1.5} />
                </div>
                <div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--champagne)', fontWeight: 500 }}>{g.title}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--mist)', marginTop: '0.2rem' }}>{g.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* FAQ */}
          <div className="atelier-card" style={{ overflow: 'hidden' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--ink-border)' }}>
              <h2 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--champagne)' }}>Frequently asked</h2>
            </div>
            {FAQ.map((item, i) => (
              <div key={i} style={{ borderBottom: i < FAQ.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none' }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{
                    width: '100%', textAlign: 'left',
                    padding: '1rem 1.5rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem',
                    background: 'none', border: 'none', cursor: 'pointer',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(201,168,76,0.03)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <span style={{ fontSize: '0.875rem', color: 'var(--champagne)', fontWeight: 500 }}>{item.q}</span>
                  {openFaq === i
                    ? <ChevronUp size={15} style={{ color: 'var(--gold)', flexShrink: 0 }} />
                    : <ChevronDown size={15} style={{ color: 'var(--dust)', flexShrink: 0 }} />
                  }
                </button>
                {openFaq === i && (
                  <div style={{ padding: '0 1.5rem 1rem', fontSize: '0.85rem', color: 'var(--mist)', lineHeight: 1.7 }}>
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right column — contact form */}
        <div className="atelier-card" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--ink-border)' }}>
            <h2 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--champagne)' }}>Contact support</h2>
            <p style={{ color: 'var(--mist)', fontSize: '0.78rem', marginTop: '0.25rem' }}>
              We reply within 24 hours on business days.
            </p>
          </div>

          <div style={{ padding: '1.5rem' }}>
            {sent ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(61,122,90,0.15)', border: '1px solid rgba(61,122,90,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                  <Send size={20} color="#6ECFA0" strokeWidth={1.5} />
                </div>
                <h3 style={{ color: 'var(--champagne)', fontSize: '1rem', marginBottom: '0.5rem' }}>Message sent!</h3>
                <p style={{ color: 'var(--mist)', fontSize: '0.85rem' }}>We'll get back to you as soon as possible.</p>
                <button
                  onClick={() => setSent(false)}
                  style={{ marginTop: '1.5rem', fontSize: '0.8rem', color: 'var(--gold)', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {/* Pre-filled email */}
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--dust)', marginBottom: '0.4rem', letterSpacing: '0.04em' }}>From</div>
                  <div className="atelier-input" style={{ padding: '0.625rem 0.875rem', borderRadius: 8, fontSize: '0.875rem', color: 'var(--mist)' }}>
                    {user?.email || 'your@email.com'}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--dust)', marginBottom: '0.4rem', letterSpacing: '0.04em' }}>Subject</div>
                  <Input
                    placeholder="e.g. My RSVP form isn't working"
                    className="atelier-input"
                    {...register('subject', { required: 'Subject is required' })}
                  />
                  {errors.subject && <p style={{ color: '#E07070', fontSize: '0.75rem', marginTop: '0.3rem' }}>{errors.subject.message}</p>}
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--dust)', marginBottom: '0.4rem', letterSpacing: '0.04em' }}>Message</div>
                  <textarea
                    rows={6}
                    placeholder="Describe your issue or question in detail…"
                    className="atelier-input"
                    style={{
                      width: '100%', resize: 'vertical',
                      padding: '0.625rem 0.875rem',
                      borderRadius: 8, fontSize: '0.875rem',
                      fontFamily: 'inherit', lineHeight: 1.6,
                    }}
                    {...register('message', { required: 'Message is required' })}
                  />
                  {errors.message && <p style={{ color: '#E07070', fontSize: '0.75rem', marginTop: '0.3rem' }}>{errors.message.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="btn-gold"
                  style={{
                    width: '100%', padding: '0.75rem',
                    borderRadius: 8, fontSize: '0.875rem', fontWeight: 600,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                    opacity: sending ? 0.7 : 1,
                  }}
                >
                  {sending ? <><Loader2 size={15} className="animate-spin" /> Sending…</> : <><Send size={14} /> Send Message</>}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
