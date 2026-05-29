'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { MapPin, Calendar, Loader2 } from 'lucide-react';
import api from '@/lib/api';

interface Invitation {
  id: string;
  title: string;
  groomName: string;
  brideName: string;
  eventDate: string;
  venue?: string;
  venueAddress?: string;
  content: { theme?: any; sections?: any[] };
  guestMessages: Array<{ id: string; authorName: string; message: string; createdAt: string }>;
}

function CountdownTimer({ targetDate, primary }: { targetDate: string; primary: string }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const tick = () => {
      const diff = new Date(targetDate).getTime() - Date.now();
      if (diff <= 0) return;
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [targetDate]);

  return (
    <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center' }}>
      {Object.entries(timeLeft).map(([unit, value]) => (
        <div key={unit} style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: '3.5rem', fontFamily: '"Playfair Display", serif', fontWeight: 700,
            color: primary, lineHeight: 1, marginBottom: '0.35rem',
          }}>
            {String(value).padStart(2, '0')}
          </div>
          <div style={{ fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.5 }}>{unit}</div>
        </div>
      ))}
    </div>
  );
}

function RSVPForm({ invitationSlug, primary }: { invitationSlug: string; primary: string }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ guestName: '', guestEmail: '', status: '', guestCount: 1, notes: '' });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async () => {
    if (!form.guestName || !form.status) return;
    setLoading(true);
    try {
      await api.post(`/rsvp/${invitationSlug}`, form);
      setDone(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '0.75rem 1rem', borderRadius: 8,
    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
    color: 'inherit', fontSize: '0.9rem', outline: 'none',
    transition: 'border-color 0.2s',
  };

  if (done) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem 0' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>{form.status === 'ACCEPTED' ? '🥂' : '💌'}</div>
        <h3 style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.75rem', marginBottom: '0.75rem', color: primary }}>
          {form.status === 'ACCEPTED' ? 'We cannot wait to see you!' : 'You will be missed.'}
        </h3>
        <p style={{ opacity: 0.7, fontSize: '0.9rem' }}>
          Thank you, {form.guestName}. Your response has been recorded.
        </p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 400, margin: '0 auto' }}>
      {step === 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input
            style={inputStyle}
            placeholder="Your full name *"
            value={form.guestName}
            onChange={e => setForm({ ...form, guestName: e.target.value })}
            onFocus={e => (e.target.style.borderColor = primary)}
            onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.12)')}
          />
          <input
            type="email"
            style={inputStyle}
            placeholder="Email address (optional)"
            value={form.guestEmail}
            onChange={e => setForm({ ...form, guestEmail: e.target.value })}
            onFocus={e => (e.target.style.borderColor = primary)}
            onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.12)')}
          />
          <button
            onClick={() => form.guestName && setStep(2)}
            disabled={!form.guestName}
            style={{
              padding: '0.875rem', borderRadius: 8, border: 'none',
              background: primary, color: '#0C0B0A', fontWeight: 700,
              fontSize: '0.875rem', cursor: 'pointer', letterSpacing: '0.04em',
              opacity: form.guestName ? 1 : 0.5, transition: 'opacity 0.2s',
            }}
          >
            Continue →
          </button>
        </div>
      )}

      {step === 2 && (
        <div>
          <p style={{ textAlign: 'center', marginBottom: '1.5rem', fontFamily: '"Playfair Display", serif', fontSize: '1.25rem' }}>
            Will you join us?
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
            <button
              onClick={() => { setForm({ ...form, status: 'ACCEPTED' }); setStep(3); }}
              style={{
                padding: '1.5rem', borderRadius: 12, border: `2px solid ${primary}`,
                background: 'rgba(255,255,255,0.04)', color: 'inherit', cursor: 'pointer',
                fontFamily: '"Playfair Display", serif', fontSize: '1.1rem', transition: 'background 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
            >
              <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>✓</div>
              <div>Attending</div>
            </button>
            <button
              onClick={() => { setForm({ ...form, status: 'DECLINED' }); handleSubmit(); }}
              style={{
                padding: '1.5rem', borderRadius: 12, border: '2px solid rgba(255,255,255,0.15)',
                background: 'rgba(255,255,255,0.02)', color: 'inherit', cursor: 'pointer',
                fontFamily: '"Playfair Display", serif', fontSize: '1.1rem', transition: 'background 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
            >
              <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>✗</div>
              <div>Declining</div>
            </button>
          </div>
          <button onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: 'inherit', opacity: 0.5, cursor: 'pointer', fontSize: '0.8rem', display: 'block', margin: '0 auto' }}>
            ← Back
          </button>
        </div>
      )}

      {step === 3 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.6, display: 'block', marginBottom: '0.5rem' }}>
              Number of guests
            </label>
            <select
              style={{ ...inputStyle }}
              value={form.guestCount}
              onChange={e => setForm({ ...form, guestCount: parseInt(e.target.value) })}
            >
              {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} guest{n > 1 ? 's' : ''}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.6, display: 'block', marginBottom: '0.5rem' }}>
              A message (optional)
            </label>
            <textarea
              style={{ ...inputStyle, resize: 'none' }}
              rows={3}
              value={form.notes}
              onChange={e => setForm({ ...form, notes: e.target.value })}
              placeholder="Share your wishes with the couple…"
              onFocus={e => (e.target.style.borderColor = primary)}
              onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.12)')}
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              padding: '0.875rem', borderRadius: 8, border: 'none',
              background: primary, color: '#0C0B0A', fontWeight: 700,
              fontSize: '0.875rem', cursor: 'pointer', letterSpacing: '0.04em',
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? 'Sending…' : 'Confirm RSVP'}
          </button>
        </div>
      )}
    </div>
  );
}

export default function PublicInvitationPage() {
  const params = useParams();
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    api.get(`/inv/${params.slug}`)
      .then(res => setInvitation(res.data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [params.slug]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0C0B0A' }}>
        <div className="spinner" />
      </div>
    );
  }

  if (notFound || !invitation) {
    return (
      <div style={{ minHeight: '100vh', background: '#0C0B0A', color: '#F5EDD9', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem' }}>
        <div style={{ fontFamily: '"Playfair Display", serif', fontSize: '4rem', opacity: 0.2, marginBottom: '1.5rem' }}>♡</div>
        <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: '2rem', marginBottom: '0.75rem' }}>Invitation Not Found</h1>
        <p style={{ color: '#9E9188', fontSize: '0.9rem' }}>This invitation may have been removed or the link is incorrect.</p>
      </div>
    );
  }

  const theme = invitation.content?.theme || {};
  const primary = theme.primary || '#C9A84C';
  const isDark = theme.dark !== false;

  const bg = isDark ? '#0C0B0A' : '#FAF7F2';
  const textColor = isDark ? '#F5EDD9' : '#1A1510';
  const mutedColor = isDark ? '#9E9188' : '#6B5F52';
  const cardBg = isDark ? '#141210' : '#FFFFFF';
  const cardBorder = isDark ? 'rgba(201,168,76,0.12)' : 'rgba(0,0,0,0.08)';

  const sections: any[] = invitation.content?.sections || [];
  const hasSection = (type: string) => sections.some(s => s.type === type && s.enabled !== false);

  return (
    <div style={{ minHeight: '100vh', background: bg, color: textColor, fontFamily: '"DM Sans", sans-serif' }}>

      {/* ── Hero ── */}
      <section style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', textAlign: 'center',
        padding: '4rem 2rem', position: 'relative', overflow: 'hidden',
      }}>
        {/* Background glow */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: `radial-gradient(ellipse 80% 60% at 50% 40%, ${primary}1A, transparent)`,
        }} />
        {/* Grain */}
        {isDark && (
          <div style={{
            position: 'absolute', inset: 0, opacity: 0.03, pointerEvents: 'none',
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }} />
        )}

        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Eyebrow rule */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'center', marginBottom: '2rem' }}>
            <div style={{ height: '1px', width: 60, background: `linear-gradient(90deg, transparent, ${primary})` }} />
            <span style={{ fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: primary, opacity: 0.8 }}>
              Wedding Invitation
            </span>
            <div style={{ height: '1px', width: 60, background: `linear-gradient(90deg, ${primary}, transparent)` }} />
          </div>

          {/* Names */}
          <h1 style={{
            fontFamily: '"Playfair Display", serif', fontStyle: 'italic',
            fontSize: 'clamp(3.5rem, 10vw, 7rem)', lineHeight: 0.95,
            color: primary, marginBottom: '1.5rem', letterSpacing: '-0.02em',
          }}>
            {invitation.groomName}
            <br />
            <span style={{ fontSize: '0.45em', fontStyle: 'normal', color: isDark ? '#4A3F30' : '#C0A870', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              &amp;
            </span>
            <br />
            {invitation.brideName}
          </h1>

          {/* Date + venue */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: mutedColor, letterSpacing: '0.06em' }}>
              <Calendar size={13} style={{ color: primary, opacity: 0.7 }} />
              {new Date(invitation.eventDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            {invitation.venue && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: mutedColor }}>
                <MapPin size={13} style={{ color: primary, opacity: 0.7 }} />
                {invitation.venue}
              </div>
            )}
          </div>

          {/* Scroll hint */}
          <div style={{ fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: mutedColor, opacity: 0.5 }}>
            Scroll to explore ↓
          </div>
        </div>
      </section>

      {/* ── Countdown ── */}
      {hasSection('countdown') && (
        <section style={{ padding: '5rem 2rem', textAlign: 'center', borderTop: `1px solid ${cardBorder}` }}>
          <div style={{ marginBottom: '3rem' }}>
            <div style={{ fontSize: '0.65rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: primary, marginBottom: '0.75rem', opacity: 0.8 }}>
              Counting Down To
            </div>
            <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: '2rem', color: textColor }}>
              The Celebration
            </h2>
          </div>
          <CountdownTimer targetDate={invitation.eventDate} primary={primary} />
        </section>
      )}

      {/* ── Event Details ── */}
      {hasSection('eventDetails') && (
        <section style={{ padding: '5rem 2rem', borderTop: `1px solid ${cardBorder}` }}>
          <div style={{ maxWidth: 640, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <div style={{ fontSize: '0.65rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: primary, marginBottom: '0.75rem', opacity: 0.8 }}>
                Details
              </div>
              <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: '2.5rem', color: textColor }}>
                Event Details
              </h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              {[
                {
                  icon: Calendar,
                  label: 'Date',
                  value: new Date(invitation.eventDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
                },
                ...(invitation.venue ? [{
                  icon: MapPin,
                  label: 'Venue',
                  value: invitation.venue + (invitation.venueAddress ? `\n${invitation.venueAddress}` : ''),
                }] : []),
              ].map((item, i) => (
                <div key={i} style={{
                  background: cardBg, border: `1px solid ${cardBorder}`,
                  borderRadius: 12, padding: '1.75rem',
                  textAlign: 'center',
                }}>
                  <item.icon size={20} style={{ color: primary, opacity: 0.7, marginBottom: '0.75rem' }} />
                  <div style={{ fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: mutedColor, marginBottom: '0.5rem' }}>
                    {item.label}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: textColor, whiteSpace: 'pre-line', lineHeight: 1.6 }}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── RSVP ── */}
      {hasSection('rsvp') && (
        <section style={{ padding: '5rem 2rem', borderTop: `1px solid ${cardBorder}` }}>
          <div style={{ maxWidth: 480, margin: '0 auto', textAlign: 'center' }}>
            <div style={{ fontSize: '0.65rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: primary, marginBottom: '0.75rem', opacity: 0.8 }}>
              Kindly Respond
            </div>
            <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: '2.5rem', color: textColor, marginBottom: '0.75rem' }}>
              RSVP
            </h2>
            <p style={{ color: mutedColor, fontSize: '0.9rem', marginBottom: '2.5rem' }}>
              Please respond by{' '}
              {new Date(new Date(invitation.eventDate).getTime() - 7 * 86400000).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
            <RSVPForm invitationSlug={params.slug as string} primary={primary} />
          </div>
        </section>
      )}

      {/* ── Guestbook messages ── */}
      {invitation.guestMessages.length > 0 && (
        <section style={{ padding: '5rem 2rem', borderTop: `1px solid ${cardBorder}` }}>
          <div style={{ maxWidth: 640, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: '2.5rem', color: textColor }}>
                Wishes
              </h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {invitation.guestMessages.map(msg => (
                <div key={msg.id} style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: 12, padding: '1.5rem' }}>
                  <p style={{ fontFamily: '"Playfair Display", serif', fontStyle: 'italic', fontSize: '1.05rem', color: textColor, marginBottom: '0.75rem', lineHeight: 1.6 }}>
                    &ldquo;{msg.message}&rdquo;
                  </p>
                  <p style={{ fontSize: '0.8rem', color: mutedColor }}>— {msg.authorName}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Footer ── */}
      <footer style={{ padding: '2rem', textAlign: 'center', borderTop: `1px solid ${cardBorder}` }}>
        <p style={{ fontSize: '0.75rem', color: mutedColor, letterSpacing: '0.06em' }}>
          Created with{' '}
          <a href="/" style={{ color: primary, textDecoration: 'none' }}>Invitely</a>
          {' '}· The luxury invitation platform
        </p>
      </footer>
    </div>
  );
}
