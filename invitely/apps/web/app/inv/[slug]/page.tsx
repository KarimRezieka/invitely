'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { MapPin, Calendar, Music, Volume2, VolumeX, ChevronDown, Heart, X } from 'lucide-react';
import api from '@/lib/api';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Invitation {
  id: string;
  groomName: string;
  brideName: string;
  eventDate: string;
  venue?: string;
  venueAddress?: string;
  slug: string;
  content: {
    theme?: {
      primary?: string;
      secondary?: string;
      font?: string;
      dark?: boolean;
      rtl?: boolean;
      backgroundType?: string;
      backgroundImage?: string;
      pattern?: string;
      musicUrl?: string;
      musicAutoplay?: boolean;
    };
    sections?: Array<{
      id: string;
      type: string;
      enabled: boolean;
      order: number;
      content: Record<string, any>;
    }>;
  };
  guestMessages: Array<{ id: string; authorName: string; message: string; createdAt: string }>;
}

// ─── Confetti ─────────────────────────────────────────────────────────────────
function launchConfetti(primary: string) {
  const canvas = document.getElementById('confetti-canvas') as HTMLCanvasElement;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const pieces: Array<{ x: number; y: number; vx: number; vy: number; color: string; size: number; rotation: number; rotSpeed: number }> = [];
  const colors = [primary, '#E4C47A', '#F5EDD9', '#FFFFFF', primary + '88'];

  for (let i = 0; i < 120; i++) {
    pieces.push({
      x: Math.random() * canvas.width,
      y: -20,
      vx: (Math.random() - 0.5) * 4,
      vy: Math.random() * 3 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 8 + 4,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.15,
    });
  }

  let frame: number;
  let startTime = Date.now();

  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const elapsed = Date.now() - startTime;

    pieces.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.08;
      p.rotation += p.rotSpeed;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0, 1 - elapsed / 4000);
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      ctx.restore();
    });

    if (elapsed < 4000) frame = requestAnimationFrame(animate);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  };
  animate();
}

// ─── Countdown ────────────────────────────────────────────────────────────────
function CountdownTimer({ targetDate, primary, style: countdownStyle }: { targetDate: string; primary: string; style?: string }) {
  const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    const tick = () => {
      const diff = new Date(targetDate).getTime() - Date.now();
      if (diff <= 0) return;
      setTime({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [targetDate]);

  const units = [
    { label: 'Days', value: time.d },
    { label: 'Hours', value: time.h },
    { label: 'Mins', value: time.m },
    { label: 'Secs', value: time.s },
  ];

  if (countdownStyle === 'rings') {
    return (
      <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        {units.map(u => (
          <div key={u.label} style={{ textAlign: 'center' }}>
            <div style={{ position: 'relative', width: 70, height: 70 }}>
              <svg viewBox="0 0 70 70" style={{ width: 70, height: 70, transform: 'rotate(-90deg)' }}>
                <circle cx="35" cy="35" r="30" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="4" />
                <circle cx="35" cy="35" r="30" fill="none" stroke={primary} strokeWidth="4"
                  strokeDasharray={`${2 * Math.PI * 30}`}
                  strokeDashoffset={`${2 * Math.PI * 30 * (1 - u.value / (u.label === 'Days' ? 365 : u.label === 'Hours' ? 24 : 60))}`}
                  strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="countdown-number" style={{ fontSize: '1.1rem', fontWeight: 700, color: primary }}>
                  {String(u.value).padStart(2, '0')}
                </span>
              </div>
            </div>
            <div style={{ fontSize: '0.55rem', letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.5, marginTop: '0.4rem' }}>
              {u.label}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Bold style
  if (countdownStyle === 'bold') {
    return (
      <div style={{ display: 'flex', gap: '0', justifyContent: 'center' }}>
        {units.map((u, i) => (
          <div key={u.label} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ textAlign: 'center', padding: '0 1.25rem' }}>
              <div className="countdown-number" style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 900, color: primary, lineHeight: 1 }}>
                {String(u.value).padStart(2, '0')}
              </div>
              <div style={{ fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.5 }}>{u.label}</div>
            </div>
            {i < 3 && <div style={{ fontSize: '2rem', opacity: 0.3, alignSelf: 'flex-start', paddingTop: '0.2rem', color: primary }}>:</div>}
          </div>
        ))}
      </div>
    );
  }

  // Default minimal
  return (
    <div style={{ display: 'flex', gap: '2.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
      {units.map(u => (
        <div key={u.label} style={{ textAlign: 'center' }}>
          <div className="countdown-number" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 700, fontFamily: 'inherit', color: primary, lineHeight: 1 }}>
            {String(u.value).padStart(2, '0')}
          </div>
          <div style={{ fontSize: '0.55rem', letterSpacing: '0.14em', textTransform: 'uppercase', opacity: 0.5, marginTop: '0.35rem' }}>
            {u.label}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── RSVP Form ────────────────────────────────────────────────────────────────
function RSVPForm({ invitationSlug, sectionContent, primary, isDark }: {
  invitationSlug: string;
  sectionContent: Record<string, any>;
  primary: string;
  isDark: boolean;
}) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    guestName: '', guestEmail: '', guestPhone: '',
    status: '', guestCount: 1, plusOneName: '',
    mealPreference: 'STANDARD', notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const textColor = isDark ? '#F5EDD9' : '#1A1510';
  const mutedColor = isDark ? '#9E9188' : '#6B5F52';
  const inputBg = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)';
  const inputBorder = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)';

  const inp: React.CSSProperties = {
    width: '100%', padding: '0.75rem 1rem', borderRadius: 10,
    background: inputBg, border: `1px solid ${inputBorder}`,
    color: textColor, fontSize: '0.9rem', outline: 'none',
    transition: 'border-color 0.2s',
  };

  const handleSubmit = async () => {
    if (!form.guestName) return;
    setLoading(true);
    setError('');
    try {
      await api.post(`/rsvp/${invitationSlug}`, { ...form, status: form.status || 'ACCEPTED' });
      setDone(true);
      if (form.status === 'ACCEPTED') {
        setTimeout(() => launchConfetti(primary), 300);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem 0' }}>
        <div style={{ fontSize: '3.5rem', marginBottom: '1rem', animation: 'scaleIn 0.5s ease forwards' }}>
          {form.status === 'ACCEPTED' ? '🥂' : '💌'}
        </div>
        <h3 style={{ fontFamily: 'inherit', fontSize: '1.75rem', fontStyle: 'italic', color: primary, marginBottom: '0.75rem' }}>
          {form.status === 'ACCEPTED' ? "We cannot wait to see you!" : "You will be missed."}
        </h3>
        <p style={{ color: mutedColor, fontSize: '0.9rem' }}>
          Thank you, <strong style={{ color: textColor }}>{form.guestName}</strong>.
          {form.status === 'ACCEPTED' && ' Your seat is saved.'}
        </p>
      </div>
    );
  }

  const stepDots = sectionContent.enablePlusOne !== false ? 4 : 3;

  return (
    <div style={{ maxWidth: 440, margin: '0 auto' }}>
      {/* Step indicators */}
      <div style={{ display: 'flex', gap: '0.375rem', justifyContent: 'center', marginBottom: '2rem' }}>
        {Array.from({ length: stepDots }, (_, i) => (
          <div key={i} style={{
            width: i + 1 === step ? 20 : 8, height: 8, borderRadius: 4,
            background: i + 1 <= step ? primary : (isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)'),
            transition: 'all 0.3s ease',
          }} />
        ))}
      </div>

      {/* Step 1: Contact info */}
      {step === 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', animation: 'fadeUp 0.4s ease forwards' }}>
          <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
            <div style={{ fontStyle: 'italic', fontSize: '1.25rem', color: textColor, marginBottom: '0.25rem' }}>Your Details</div>
            <div style={{ fontSize: '0.8rem', color: mutedColor }}>Let us know who you are</div>
          </div>
          <input style={inp} placeholder="Full name *" value={form.guestName}
            onChange={e => setForm(f => ({ ...f, guestName: e.target.value }))}
            onFocus={e => (e.target.style.borderColor = primary)} onBlur={e => (e.target.style.borderColor = inputBorder)} />
          {sectionContent.requireEmail !== false && (
            <input type="email" style={inp} placeholder="Email address" value={form.guestEmail}
              onChange={e => setForm(f => ({ ...f, guestEmail: e.target.value }))}
              onFocus={e => (e.target.style.borderColor = primary)} onBlur={e => (e.target.style.borderColor = inputBorder)} />
          )}
          {sectionContent.requirePhone && (
            <input type="tel" style={inp} placeholder="Phone number" value={form.guestPhone}
              onChange={e => setForm(f => ({ ...f, guestPhone: e.target.value }))}
              onFocus={e => (e.target.style.borderColor = primary)} onBlur={e => (e.target.style.borderColor = inputBorder)} />
          )}
          <button
            onClick={() => form.guestName && setStep(2)}
            disabled={!form.guestName}
            style={{ padding: '0.875rem', borderRadius: 10, background: primary, color: '#0C0B0A', fontWeight: 700, fontSize: '0.9rem', border: 'none', cursor: form.guestName ? 'pointer' : 'not-allowed', opacity: form.guestName ? 1 : 0.4 }}>
            Continue →
          </button>
        </div>
      )}

      {/* Step 2: Accept / Decline */}
      {step === 2 && (
        <div style={{ animation: 'fadeUp 0.4s ease forwards' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div style={{ fontStyle: 'italic', fontSize: '1.25rem', color: textColor, marginBottom: '0.25rem' }}>Will you join us?</div>
            <div style={{ fontSize: '0.8rem', color: mutedColor }}>Hello, {form.guestName} ♡</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem', marginBottom: '1rem' }}>
            <button
              onClick={() => { setForm(f => ({ ...f, status: 'ACCEPTED' })); setStep(3); }}
              style={{
                padding: '1.75rem 1rem', borderRadius: 14,
                border: `2px solid ${primary}`,
                background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                color: textColor, cursor: 'pointer', textAlign: 'center',
                transition: 'background 0.2s, transform 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = `${primary}18`; e.currentTarget.style.transform = 'scale(1.02)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'; e.currentTarget.style.transform = 'scale(1)'; }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✓</div>
              <div style={{ fontStyle: 'italic', fontFamily: 'inherit', fontSize: '1.1rem' }}>Attending</div>
            </button>
            <button
              onClick={() => { setForm(f => ({ ...f, status: 'DECLINED' })); setStep(sectionContent.enableNotes !== false ? stepDots : stepDots); handleSubmit(); }}
              style={{
                padding: '1.75rem 1rem', borderRadius: 14,
                border: `2px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)'}`,
                background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)',
                color: mutedColor, cursor: 'pointer', textAlign: 'center',
                transition: 'background 0.2s, transform 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'; e.currentTarget.style.transform = 'scale(1.02)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)'; e.currentTarget.style.transform = 'scale(1)'; }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✗</div>
              <div style={{ fontStyle: 'italic', fontFamily: 'inherit', fontSize: '1.1rem' }}>Declining</div>
            </button>
          </div>
          <button onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: mutedColor, cursor: 'pointer', fontSize: '0.8rem', display: 'block', margin: '0 auto', opacity: 0.7 }}>
            ← Go back
          </button>
        </div>
      )}

      {/* Step 3: Guest details */}
      {step === 3 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', animation: 'fadeUp 0.4s ease forwards' }}>
          <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
            <div style={{ fontStyle: 'italic', fontSize: '1.25rem', color: textColor, marginBottom: '0.25rem' }}>Guest Details</div>
            <div style={{ fontSize: '0.8rem', color: mutedColor }}>Help us prepare for you</div>
          </div>

          {sectionContent.enableGuestCount !== false && (
            <div>
              <label style={{ fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: mutedColor, display: 'block', marginBottom: '0.4rem' }}>
                Number of guests attending
              </label>
              <div style={{ display: 'flex', gap: '0.375rem' }}>
                {[1, 2, 3, 4, 5].map(n => (
                  <button key={n} onClick={() => setForm(f => ({ ...f, guestCount: n }))} style={{
                    flex: 1, padding: '0.625rem', borderRadius: 8, fontSize: '0.9rem',
                    border: `1px solid ${form.guestCount === n ? primary : inputBorder}`,
                    background: form.guestCount === n ? `${primary}20` : inputBg,
                    color: form.guestCount === n ? primary : mutedColor, cursor: 'pointer',
                  }}>
                    {n}
                  </button>
                ))}
              </div>
            </div>
          )}

          {sectionContent.enablePlusOne !== false && (
            <input style={inp} placeholder="Plus-one name (optional)" value={form.plusOneName}
              onChange={e => setForm(f => ({ ...f, plusOneName: e.target.value }))}
              onFocus={e => (e.target.style.borderColor = primary)} onBlur={e => (e.target.style.borderColor = inputBorder)} />
          )}

          {sectionContent.enableMealChoice !== false && (
            <div>
              <label style={{ fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: mutedColor, display: 'block', marginBottom: '0.4rem' }}>
                Meal preference
              </label>
              <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
                {(sectionContent.mealOptions || ['Standard', 'Vegetarian', 'Vegan', 'Halal']).map((opt: string) => (
                  <button key={opt} onClick={() => setForm(f => ({ ...f, mealPreference: opt.toUpperCase().replace(/\s/g, '_') }))} style={{
                    padding: '0.5rem 0.875rem', borderRadius: 8, fontSize: '0.78rem',
                    border: `1px solid ${form.mealPreference === opt.toUpperCase().replace(/\s/g, '_') ? primary : inputBorder}`,
                    background: form.mealPreference === opt.toUpperCase().replace(/\s/g, '_') ? `${primary}20` : inputBg,
                    color: form.mealPreference === opt.toUpperCase().replace(/\s/g, '_') ? primary : mutedColor, cursor: 'pointer',
                  }}>
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button onClick={() => sectionContent.enableNotes !== false ? setStep(4) : handleSubmit()}
            style={{ padding: '0.875rem', borderRadius: 10, background: primary, color: '#0C0B0A', fontWeight: 700, fontSize: '0.9rem', border: 'none', cursor: 'pointer' }}>
            {sectionContent.enableNotes !== false ? 'Next →' : (loading ? 'Sending…' : 'Confirm RSVP')}
          </button>
          <button onClick={() => setStep(2)} style={{ background: 'none', border: 'none', color: mutedColor, cursor: 'pointer', fontSize: '0.8rem', opacity: 0.7 }}>
            ← Back
          </button>
        </div>
      )}

      {/* Step 4: Personal message */}
      {step === 4 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', animation: 'fadeUp 0.4s ease forwards' }}>
          <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
            <div style={{ fontStyle: 'italic', fontSize: '1.25rem', color: textColor, marginBottom: '0.25rem' }}>Leave a Message</div>
            <div style={{ fontSize: '0.8rem', color: mutedColor }}>Share your wishes (optional)</div>
          </div>
          <textarea style={{ ...inp, resize: 'none' }} rows={4} value={form.notes}
            onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
            placeholder={sectionContent.placeholder || "Share your wishes with the couple…"}
            onFocus={e => (e.target.style.borderColor = primary)} onBlur={e => (e.target.style.borderColor = inputBorder)} />
          {error && <div style={{ fontSize: '0.8rem', color: '#E07070', textAlign: 'center' }}>{error}</div>}
          <button onClick={handleSubmit} disabled={loading} style={{
            padding: '0.875rem', borderRadius: 10, background: primary, color: '#0C0B0A',
            fontWeight: 700, fontSize: '0.9rem', border: 'none', cursor: 'pointer', opacity: loading ? 0.7 : 1,
          }}>
            {loading ? 'Sending…' : 'Confirm RSVP 💌'}
          </button>
          <button onClick={() => setStep(3)} style={{ background: 'none', border: 'none', color: mutedColor, cursor: 'pointer', fontSize: '0.8rem', opacity: 0.7 }}>
            ← Back
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Scroll-reveal hook ───────────────────────────────────────────────────────
function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.section-reveal');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in-view'); });
    }, { threshold: 0.12 });
    els.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

// ─── Gallery Lightbox ─────────────────────────────────────────────────────────
function GallerySection({ photos, layout, primary, isDark }: { photos: string[]; layout?: string; primary: string; isDark: boolean }) {
  const [lightbox, setLightbox] = useState<number | null>(null);

  if (!photos?.length) return null;

  const cols = layout === 'masonry' ? 3 : layout === 'carousel' ? 1 : 3;

  return (
    <div>
      {layout === 'carousel' ? (
        <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem', scrollSnapType: 'x mandatory' }}>
          {photos.map((url, i) => (
            <div key={i} style={{ flexShrink: 0, width: '80vw', maxWidth: 400, aspectRatio: '4/3', borderRadius: 14, overflow: 'hidden', scrollSnapAlign: 'center', cursor: 'pointer' }}
              onClick={() => setLightbox(i)}>
              <img src={url} alt="" className="gallery-photo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          ))}
        </div>
      ) : layout === 'polaroid' ? (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
          {photos.map((url, i) => (
            <div key={i} onClick={() => setLightbox(i)} style={{
              background: '#fff', padding: '0.625rem 0.625rem 2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
              transform: `rotate(${(i % 3 - 1) * 3}deg)`, cursor: 'pointer', transition: 'transform 0.2s',
            }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'rotate(0) scale(1.05)')}
              onMouseLeave={e => (e.currentTarget.style.transform = `rotate(${(i % 3 - 1) * 3}deg)`)}>
              <img src={url} alt="" style={{ width: 140, height: 140, objectFit: 'cover', display: 'block' }} />
            </div>
          ))}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: '0.5rem' }}>
          {photos.map((url, i) => (
            <div key={i} style={{ aspectRatio: layout === 'masonry' && i % 5 === 0 ? 'auto' : '1', overflow: 'hidden', borderRadius: 10, cursor: 'pointer' }}
              onClick={() => setLightbox(i)}>
              <img src={url} alt="" className="gallery-photo" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={e => (e.currentTarget.parentElement!.style.display = 'none')} />
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox !== null && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', zIndex: 9996, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={() => setLightbox(null)}>
          <button onClick={() => setLightbox(null)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: '#fff', cursor: 'pointer', opacity: 0.7 }}>
            <X size={24} />
          </button>
          <img src={photos[lightbox]} alt="" style={{ maxWidth: '92vw', maxHeight: '90vh', objectFit: 'contain', borderRadius: 8 }} onClick={e => e.stopPropagation()} />
          {lightbox > 0 && (
            <button onClick={e => { e.stopPropagation(); setLightbox(l => (l !== null ? l - 1 : null)); }}
              style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '0.75rem', borderRadius: '50%', cursor: 'pointer', fontSize: '1.25rem' }}>
              ‹
            </button>
          )}
          {lightbox < photos.length - 1 && (
            <button onClick={e => { e.stopPropagation(); setLightbox(l => (l !== null ? l + 1 : null)); }}
              style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '0.75rem', borderRadius: '50%', cursor: 'pointer', fontSize: '1.25rem' }}>
              ›
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Music Player ─────────────────────────────────────────────────────────────
function MusicPlayer({ url, autoplay }: { url: string; autoplay?: boolean }) {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (autoplay && audioRef.current) {
      audioRef.current.play().then(() => setPlaying(true)).catch(() => {});
    }
  }, [autoplay]);

  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) { audioRef.current.pause(); setPlaying(false); }
    else { audioRef.current.play(); setPlaying(true); }
  };

  if (!url) return null;

  return (
    <>
      <audio ref={audioRef} src={url} loop />
      <div className="music-player" onClick={toggle}>
        {playing ? <div className="music-player-dot" /> : <Music size={13} style={{ color: 'var(--gold-dim)' }} />}
        <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', letterSpacing: '0.06em' }}>
          {playing ? 'Playing' : 'Music'}
        </span>
        {playing ? <VolumeX size={12} style={{ color: 'rgba(255,255,255,0.4)' }} /> : <Volume2 size={12} style={{ color: 'rgba(255,255,255,0.4)' }} />}
      </div>
    </>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function PublicInvitationPage() {
  const params = useParams();
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  useScrollReveal();

  useEffect(() => {
    api.get(`/inv/${params.slug}`)
      .then(res => setInvitation(res.data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [params.slug]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#0C0B0A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner" />
      </div>
    );
  }

  if (notFound || !invitation) {
    return (
      <div style={{ minHeight: '100vh', background: '#0C0B0A', color: '#F5EDD9', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' }}>
        <div style={{ fontFamily: '"Playfair Display", serif', fontSize: '3.5rem', opacity: 0.15, marginBottom: '1.5rem' }}>♡</div>
        <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: '2.25rem', marginBottom: '0.75rem' }}>Invitation Not Found</h1>
        <p style={{ color: '#9E9188' }}>This invitation may have been removed or the link is incorrect.</p>
      </div>
    );
  }

  const th = invitation.content?.theme || {};
  const primary = th.primary || '#C9A84C';
  const secondary = th.secondary || '#F5EDD9';
  const font = th.font || 'Playfair Display';
  const isDark = th.dark === true;
  const isRTL = th.rtl === true;

  const bg = isDark ? '#0C0B0A' : secondary;
  const textColor = isDark ? '#F5EDD9' : '#1A1510';
  const mutedColor = isDark ? '#9E9188' : '#6B5F52';
  const borderColor = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)';
  const cardBg = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.8)';

  const sections = (invitation.content?.sections || []).filter(s => s.enabled !== false);
  const getSection = (type: string) => sections.find(s => s.type === type);

  const heroContent = getSection('hero')?.content || {};
  const heroBackground = heroContent.backgroundUrl
    ? `linear-gradient(rgba(0,0,0,${(heroContent.overlayOpacity ?? 40) / 100}), rgba(0,0,0,0.2)), url(${heroContent.backgroundUrl}) center/cover no-repeat`
    : `radial-gradient(ellipse 80% 60% at 50% 40%, ${primary}28, ${isDark ? '#0C0B0A' : secondary})`;

  return (
    <div className="inv-page" style={{ minHeight: '100vh', background: bg, color: textColor, fontFamily: `"${font}", serif`, direction: isRTL ? 'rtl' : 'ltr' }}>

      {/* Confetti canvas */}
      <canvas id="confetti-canvas" />

      {/* Floating petals for floral theme */}
      {(primary === '#C2607A' || primary.toLowerCase().includes('c26')) && (
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 5, overflow: 'hidden' }}>
          {[...Array(8)].map((_, i) => (
            <div key={i} style={{
              position: 'absolute', top: '-20px', left: `${10 + i * 12}%`,
              fontSize: '1rem', opacity: 0.4,
              animation: `fall ${5 + i}s linear infinite`,
              animationDelay: `${i * 1.5}s`,
            }}>🌸</div>
          ))}
        </div>
      )}

      {/* Music player */}
      {th.musicUrl && <MusicPlayer url={th.musicUrl} autoplay={th.musicAutoplay} />}

      {/* ── Hero ── */}
      <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem', textAlign: 'center', position: 'relative', overflow: 'hidden', background: heroBackground }}>
        {/* Pattern overlay */}
        {th.pattern && th.pattern !== 'none' && (
          <div style={{ position: 'absolute', inset: 0, opacity: 0.06, pointerEvents: 'none',
            backgroundImage: th.pattern === 'geometric'
              ? 'repeating-linear-gradient(45deg, currentColor 0px, currentColor 1px, transparent 1px, transparent 10px), repeating-linear-gradient(-45deg, currentColor 0px, currentColor 1px, transparent 1px, transparent 10px)'
              : th.pattern === 'dots'
              ? 'radial-gradient(circle, currentColor 1px, transparent 1px)'
              : 'none',
            backgroundSize: th.pattern === 'dots' ? '20px 20px' : undefined,
          }} />
        )}
        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse 90% 70% at 50% 40%, ${primary}18, transparent)`, pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 640 }}>
          {/* Ornamental divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'center', marginBottom: '2rem' }}>
            <div style={{ height: 1, flex: 1, maxWidth: 80, background: `linear-gradient(${isRTL ? '270deg' : '90deg'}, transparent, ${primary})` }} />
            <span style={{ fontSize: '0.6rem', letterSpacing: '0.22em', color: primary, opacity: 0.85, textTransform: 'uppercase' }}>
              {isDark ? '✦ Wedding Invitation ✦' : '♡ Wedding Invitation ♡'}
            </span>
            <div style={{ height: 1, flex: 1, maxWidth: 80, background: `linear-gradient(${isRTL ? '90deg' : '270deg'}, transparent, ${primary})` }} />
          </div>

          {heroContent.subheadline && (
            <div style={{ fontSize: '0.75rem', letterSpacing: '0.1em', color: mutedColor, marginBottom: '1rem', fontStyle: 'italic' }}>
              {heroContent.subheadline}
            </div>
          )}

          <h1 style={{ fontStyle: 'italic', fontSize: 'clamp(3rem, 10vw, 7rem)', color: primary, lineHeight: 0.95, marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
            {invitation.groomName}
            <br />
            <span style={{ fontSize: '0.4em', fontStyle: 'normal', opacity: 0.5, letterSpacing: '0.2em', display: 'inline-block', margin: '0.2em 0' }}>
              {isRTL ? 'و' : '&'}
            </span>
            <br />
            {invitation.brideName}
          </h1>

          {heroContent.quote && (
            <div style={{ fontSize: '0.85rem', color: mutedColor, fontStyle: 'italic', maxWidth: 400, margin: '0 auto 1.5rem' }}>
              &ldquo;{heroContent.quote}&rdquo;
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', alignItems: 'center', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: mutedColor, letterSpacing: '0.06em' }}>
              <Calendar size={13} style={{ color: primary, opacity: 0.7 }} />
              {new Date(invitation.eventDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            {invitation.venue && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: mutedColor }}>
                <MapPin size={13} style={{ color: primary, opacity: 0.7 }} />
                {invitation.venue}
              </div>
            )}
          </div>

          <div style={{ animation: 'float 3s ease-in-out infinite', display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', opacity: 0.4 }}>
            <span style={{ fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Scroll</span>
            <ChevronDown size={16} />
          </div>
        </div>
      </section>

      {/* ── Countdown ── */}
      {getSection('countdown') && (
        <section className="section-reveal" style={{ padding: '5rem 2rem', textAlign: 'center', borderTop: `1px solid ${borderColor}` }}>
          <div style={{ maxWidth: 640, margin: '0 auto' }}>
            <div style={{ fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: primary, opacity: 0.8, marginBottom: '1rem' }}>
              {getSection('countdown')?.content.title || 'Counting Down'}
            </div>
            <CountdownTimer
              targetDate={invitation.eventDate}
              primary={primary}
              style={getSection('countdown')?.content.style}
            />
          </div>
        </section>
      )}

      {/* ── Story ── */}
      {getSection('story') && (
        <section className="section-reveal" style={{ padding: '5rem 2rem', borderTop: `1px solid ${borderColor}` }}>
          <div style={{ maxWidth: 680, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <div style={{ fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: primary, opacity: 0.8, marginBottom: '0.75rem' }}>Our Story</div>
              <h2 style={{ fontStyle: 'italic', fontSize: 'clamp(1.75rem, 4vw, 3rem)', color: textColor, marginBottom: '0.75rem' }}>
                {getSection('story')?.content.sectionTitle || 'How It All Began'}
              </h2>
              {getSection('story')?.content.intro && (
                <p style={{ fontSize: '0.9rem', color: mutedColor, lineHeight: 1.8, maxWidth: 520, margin: '0 auto' }}>
                  {getSection('story')?.content.intro}
                </p>
              )}
            </div>
            {(getSection('story')?.content.milestones || []).map((m: any, i: number) => (
              <div key={i} className="section-reveal" style={{ display: 'flex', gap: '2rem', marginBottom: '2.5rem', alignItems: 'flex-start' }}>
                <div style={{ flexShrink: 0, width: 2, background: `linear-gradient(180deg, ${primary}, ${primary}00)`, alignSelf: 'stretch', minHeight: 60 }} />
                <div>
                  <div style={{ fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: primary, marginBottom: '0.35rem' }}>
                    {m.date}
                  </div>
                  <h3 style={{ fontStyle: 'italic', fontSize: '1.25rem', color: textColor, marginBottom: '0.5rem' }}>{m.title}</h3>
                  {m.description && <p style={{ fontSize: '0.88rem', color: mutedColor, lineHeight: 1.7 }}>{m.description}</p>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Event Details ── */}
      {getSection('eventDetails') && (
        <section className="section-reveal" style={{ padding: '5rem 2rem', borderTop: `1px solid ${borderColor}` }}>
          <div style={{ maxWidth: 680, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <div style={{ fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: primary, opacity: 0.8, marginBottom: '0.75rem' }}>Details</div>
              <h2 style={{ fontStyle: 'italic', fontSize: 'clamp(1.75rem, 4vw, 3rem)', color: textColor }}>
                Event Details
              </h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              {(getSection('eventDetails')?.content.events || [{ name: 'Wedding', venue: invitation.venue, address: invitation.venueAddress }]).map((ev: any, i: number) => (
                <div key={i} style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 16, padding: '2rem', textAlign: 'center', backdropFilter: 'blur(8px)' }}>
                  <div style={{ fontStyle: 'italic', fontSize: '1.1rem', color: primary, marginBottom: '0.75rem', fontFamily: `"${font}", serif` }}>{ev.name}</div>
                  <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${primary}50, transparent)`, marginBottom: '1rem' }} />
                  {ev.date && <div style={{ fontSize: '0.8rem', color: mutedColor, marginBottom: '0.25rem' }}>📅 {ev.date}{ev.time && ` · ${ev.time}`}</div>}
                  {ev.venue && <div style={{ fontSize: '0.8rem', color: mutedColor, marginBottom: '0.25rem' }}>📍 {ev.venue}</div>}
                  {ev.address && <div style={{ fontSize: '0.72rem', color: mutedColor, opacity: 0.7, marginBottom: '0.25rem' }}>{ev.address}</div>}
                  {ev.dressCode && (
                    <div style={{ marginTop: '0.75rem', padding: '0.375rem 0.75rem', background: `${primary}15`, borderRadius: 999, fontSize: '0.7rem', color: primary, display: 'inline-block' }}>
                      Dress: {ev.dressCode}
                    </div>
                  )}
                  {ev.address && (
                    <a href={`https://maps.google.com/?q=${encodeURIComponent(ev.address)}`} target="_blank" rel="noopener noreferrer"
                      style={{ display: 'block', marginTop: '1rem', fontSize: '0.72rem', color: primary, textDecoration: 'none', letterSpacing: '0.06em', textTransform: 'uppercase', opacity: 0.8 }}>
                      View on Map →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Gallery ── */}
      {getSection('gallery') && getSection('gallery')?.content.photos?.length > 0 && (
        <section className="section-reveal" style={{ padding: '5rem 2rem', borderTop: `1px solid ${borderColor}` }}>
          <div style={{ maxWidth: 760, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <div style={{ fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: primary, opacity: 0.8, marginBottom: '0.75rem' }}>Memories</div>
              <h2 style={{ fontStyle: 'italic', fontSize: 'clamp(1.75rem, 4vw, 3rem)', color: textColor }}>
                {getSection('gallery')?.content.title || 'Our Gallery'}
              </h2>
            </div>
            <GallerySection photos={getSection('gallery')?.content.photos || []} layout={getSection('gallery')?.content.layout} primary={primary} isDark={isDark} />
          </div>
        </section>
      )}

      {/* ── RSVP ── */}
      {getSection('rsvp') && (
        <section className="section-reveal" style={{ padding: '5rem 2rem', borderTop: `1px solid ${borderColor}` }}>
          <div style={{ maxWidth: 520, margin: '0 auto', textAlign: 'center' }}>
            <div style={{ fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: primary, opacity: 0.8, marginBottom: '0.75rem' }}>Kindly Respond</div>
            <h2 style={{ fontStyle: 'italic', fontSize: 'clamp(1.75rem, 4vw, 3rem)', color: textColor, marginBottom: '0.75rem' }}>RSVP</h2>
            {getSection('rsvp')?.content.deadline && (
              <p style={{ color: mutedColor, fontSize: '0.85rem', marginBottom: '2.5rem' }}>
                Please respond by {getSection('rsvp')?.content.deadline}
              </p>
            )}
            <RSVPForm
              invitationSlug={params.slug as string}
              sectionContent={getSection('rsvp')?.content || {}}
              primary={primary}
              isDark={isDark}
            />
          </div>
        </section>
      )}

      {/* ── Guestbook ── */}
      {(getSection('guestbook') || invitation.guestMessages.length > 0) && (
        <section className="section-reveal" style={{ padding: '5rem 2rem', borderTop: `1px solid ${borderColor}` }}>
          <div style={{ maxWidth: 640, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <div style={{ fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: primary, opacity: 0.8, marginBottom: '0.75rem' }}>Wishes</div>
              <h2 style={{ fontStyle: 'italic', fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', color: textColor }}>
                {getSection('guestbook')?.content.title || 'Guest Wishes'}
              </h2>
            </div>
            {invitation.guestMessages.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {invitation.guestMessages.map(msg => (
                  <div key={msg.id} style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: 14, padding: '1.5rem', backdropFilter: 'blur(8px)' }}>
                    <p style={{ fontStyle: 'italic', fontSize: '1.02rem', color: textColor, lineHeight: 1.7, marginBottom: '0.75rem' }}>&ldquo;{msg.message}&rdquo;</p>
                    <p style={{ fontSize: '0.78rem', color: mutedColor }}>— {msg.authorName}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem', background: cardBg, borderRadius: 14, border: `1px solid ${borderColor}` }}>
                <Heart size={24} style={{ color: primary, opacity: 0.4, margin: '0 auto 0.75rem' }} />
                <p style={{ fontSize: '0.85rem', color: mutedColor }}>Guest wishes will appear here</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── Footer ── */}
      <footer style={{ padding: '2.5rem 2rem', borderTop: `1px solid ${borderColor}`, textAlign: 'center' }}>
        <div style={{ fontStyle: 'italic', fontSize: '1.5rem', color: primary, marginBottom: '0.5rem' }}>
          {invitation.groomName} &amp; {invitation.brideName}
        </div>
        <p style={{ fontSize: '0.72rem', color: mutedColor, opacity: 0.6, letterSpacing: '0.08em' }}>
          Created with <a href="/" style={{ color: primary, textDecoration: 'none' }}>Invitely</a>
        </p>
      </footer>
    </div>
  );
}
