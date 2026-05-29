'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { MapPin, Calendar, Clock, Loader2, Heart } from 'lucide-react';
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

function CountdownTimer({ targetDate }: { targetDate: string }) {
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
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="flex gap-4 justify-center">
      {Object.entries(timeLeft).map(([unit, value]) => (
        <div key={unit} className="text-center">
          <div className="text-4xl font-bold tabular-nums">{String(value).padStart(2, '0')}</div>
          <div className="text-xs uppercase tracking-wider opacity-70 mt-1">{unit}</div>
        </div>
      ))}
    </div>
  );
}

function RSVPForm({ invitationSlug, primaryColor }: { invitationSlug: string; primaryColor: string }) {
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

  if (done) {
    return (
      <div className="text-center py-8">
        <div className="text-5xl mb-4">🎉</div>
        <h3 className="text-xl font-bold mb-2">Thank you, {form.guestName}!</h3>
        <p className="opacity-70">
          {form.status === 'ACCEPTED' ? "We can't wait to celebrate with you!" : "We'll miss you on our special day."}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-sm mx-auto">
      {step === 1 && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Your Name *</label>
            <input
              type="text"
              className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-zinc-900"
              value={form.guestName}
              onChange={(e) => setForm({ ...form, guestName: e.target.value })}
              placeholder="Full name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-zinc-900"
              value={form.guestEmail}
              onChange={(e) => setForm({ ...form, guestEmail: e.target.value })}
              placeholder="your@email.com"
            />
          </div>
          <button
            onClick={() => form.guestName && setStep(2)}
            className="w-full py-3 rounded-xl text-white font-semibold transition-opacity hover:opacity-90"
            style={{ background: primaryColor }}
          >
            Continue
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <p className="text-center font-medium">Will you be joining us?</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => { setForm({ ...form, status: 'ACCEPTED' }); setStep(3); }}
              className="py-4 rounded-xl border-2 transition-all hover:scale-105 font-semibold text-white"
              style={{ background: primaryColor, borderColor: primaryColor }}
            >
              ✓ Attending
            </button>
            <button
              onClick={() => { setForm({ ...form, status: 'DECLINED' }); handleSubmit(); }}
              className="py-4 rounded-xl border-2 border-zinc-300 text-zinc-600 transition-all hover:scale-105 font-semibold"
            >
              ✗ Declining
            </button>
          </div>
          <button onClick={() => setStep(1)} className="text-sm opacity-60 w-full text-center">Back</button>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Number of guests</label>
            <select
              className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-zinc-900"
              value={form.guestCount}
              onChange={(e) => setForm({ ...form, guestCount: parseInt(e.target.value) })}
            >
              {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">A message for the couple (optional)</label>
            <textarea
              className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-zinc-900"
              rows={3}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Share your wishes..."
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 rounded-xl text-white font-semibold disabled:opacity-50"
            style={{ background: primaryColor }}
          >
            {loading ? 'Submitting...' : 'Confirm RSVP'}
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
    api.get(`/inv/${params.slug}`).then((res) => {
      setInvitation(res.data);
    }).catch(() => setNotFound(true)).finally(() => setLoading(false));
  }, [params.slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-amber-600" size={32} />
      </div>
    );
  }

  if (notFound || !invitation) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-8">
        <div className="text-6xl mb-4">💍</div>
        <h1 className="text-2xl font-bold text-zinc-900 mb-2">Invitation Not Found</h1>
        <p className="text-zinc-500">This invitation may have been removed or the link is incorrect.</p>
      </div>
    );
  }

  const theme = invitation.content?.theme || {};
  const primaryColor = theme.primary || '#C9A84C';
  const sections: any[] = invitation.content?.sections || [];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section
        className="min-h-screen flex flex-col items-center justify-center text-center p-8 relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${primaryColor}ee, ${primaryColor}99)` }}
      >
        <div className="relative z-10 text-white">
          <div className="flex items-center gap-3 justify-center mb-6">
            <div className="h-px w-16 bg-white/50" />
            <Heart size={20} className="opacity-70" fill="currentColor" />
            <div className="h-px w-16 bg-white/50" />
          </div>
          <div className="text-sm uppercase tracking-widest opacity-80 mb-4">You are cordially invited to</div>
          <h1 className="text-5xl md:text-7xl font-serif mb-4">
            {invitation.groomName}
            <span className="block text-3xl md:text-5xl opacity-70 my-2">&</span>
            {invitation.brideName}
          </h1>
          <div className="flex items-center justify-center gap-6 mt-6 text-white/80">
            <span className="flex items-center gap-2">
              <Calendar size={16} />
              {new Date(invitation.eventDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
            {invitation.venue && (
              <span className="flex items-center gap-2">
                <MapPin size={16} />
                {invitation.venue}
              </span>
            )}
          </div>
        </div>
        <div className="absolute inset-0 opacity-5">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="absolute text-6xl" style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, transform: 'rotate(-45deg)' }}>💍</div>
          ))}
        </div>
      </section>

      {/* Countdown */}
      {sections.some((s) => s.type === 'countdown' && s.enabled) && (
        <section className="py-16 text-center px-8" style={{ background: `${primaryColor}11` }}>
          <h2 className="text-2xl font-serif mb-8" style={{ color: primaryColor }}>Counting Down</h2>
          <CountdownTimer targetDate={invitation.eventDate} />
        </section>
      )}

      {/* Event Details */}
      {sections.some((s) => s.type === 'eventDetails' && s.enabled) && (
        <section className="py-16 px-8 max-w-2xl mx-auto">
          <h2 className="text-3xl font-serif text-center mb-8" style={{ color: primaryColor }}>Event Details</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="text-center p-6 rounded-2xl border border-zinc-100">
              <Calendar className="mx-auto mb-3" style={{ color: primaryColor }} />
              <h3 className="font-semibold mb-1">Date & Time</h3>
              <p className="text-zinc-500 text-sm">
                {new Date(invitation.eventDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            {invitation.venue && (
              <div className="text-center p-6 rounded-2xl border border-zinc-100">
                <MapPin className="mx-auto mb-3" style={{ color: primaryColor }} />
                <h3 className="font-semibold mb-1">Venue</h3>
                <p className="text-zinc-500 text-sm">{invitation.venue}</p>
                {invitation.venueAddress && <p className="text-zinc-400 text-xs mt-1">{invitation.venueAddress}</p>}
              </div>
            )}
          </div>
        </section>
      )}

      {/* RSVP */}
      {sections.some((s) => s.type === 'rsvp' && s.enabled) && (
        <section className="py-16 px-8" style={{ background: `${primaryColor}11` }}>
          <div className="max-w-lg mx-auto text-center">
            <h2 className="text-3xl font-serif mb-3" style={{ color: primaryColor }}>RSVP</h2>
            <p className="text-zinc-500 mb-8">Kindly respond by {new Date(invitation.eventDate).toLocaleDateString()}</p>
            <RSVPForm invitationSlug={params.slug as string} primaryColor={primaryColor} />
          </div>
        </section>
      )}

      {/* Guestbook */}
      {invitation.guestMessages.length > 0 && (
        <section className="py-16 px-8 max-w-2xl mx-auto">
          <h2 className="text-3xl font-serif text-center mb-8" style={{ color: primaryColor }}>Wishes</h2>
          <div className="space-y-4">
            {invitation.guestMessages.map((msg) => (
              <div key={msg.id} className="p-4 rounded-xl border border-zinc-100">
                <p className="text-zinc-700 mb-2">"{msg.message}"</p>
                <p className="text-sm font-medium text-zinc-400">— {msg.authorName}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-8 text-center text-sm text-zinc-400 border-t border-zinc-100">
        <p>Created with <a href="/" className="text-amber-600 hover:underline">Invitely</a></p>
      </footer>
    </div>
  );
}
