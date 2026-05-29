'use client';

/**
 * SectionEditors — one editor component per invitation section.
 * Each gives the client direct control over that section's content.
 */

import { useState } from 'react';
import { Plus, Trash2, GripVertical, Image, Upload } from 'lucide-react';

interface SectionEditorProps {
  content: Record<string, any>;
  onChange: (updates: Record<string, any>) => void;
  invitationData?: {
    groomName: string;
    brideName: string;
    eventDate: string;
    venue?: string;
    venueAddress?: string;
  };
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '0.625rem 0.75rem', borderRadius: 8,
  background: 'var(--ink-surface)', border: '1px solid var(--ink-border-strong)',
  color: 'var(--champagne)', fontSize: '0.82rem',
  transition: 'border-color 0.2s', outline: 'none',
};

const labelStyle: React.CSSProperties = {
  fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase',
  color: 'var(--dust)', display: 'block', marginBottom: '0.4rem', fontWeight: 600,
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <span style={labelStyle}>{label}</span>
      {children}
    </div>
  );
}

// ── Hero Section ──────────────────────────────────────────────────────────────
export function HeroEditor({ content, onChange, invitationData }: SectionEditorProps) {
  return (
    <div>
      <Field label="Couple Quote / Tagline">
        <textarea
          style={{ ...inputStyle, resize: 'none' }}
          rows={2}
          value={content.quote || ''}
          onChange={e => onChange({ quote: e.target.value })}
          placeholder='"Two souls, one heart"'
          onFocus={e => (e.target.style.borderColor = 'var(--gold)')}
          onBlur={e => (e.target.style.borderColor = 'var(--ink-border-strong)')}
        />
      </Field>

      <Field label="Sub-headline">
        <input
          style={inputStyle}
          value={content.subheadline || ''}
          onChange={e => onChange({ subheadline: e.target.value })}
          placeholder="Together with their families…"
          onFocus={e => (e.target.style.borderColor = 'var(--gold)')}
          onBlur={e => (e.target.style.borderColor = 'var(--ink-border-strong)')}
        />
      </Field>

      <Field label="Hero Background Image URL">
        <input
          type="url"
          style={inputStyle}
          value={content.backgroundUrl || ''}
          onChange={e => onChange({ backgroundUrl: e.target.value })}
          placeholder="https://your-photo.jpg"
          onFocus={e => (e.target.style.borderColor = 'var(--gold)')}
          onBlur={e => (e.target.style.borderColor = 'var(--ink-border-strong)')}
        />
        {content.backgroundUrl && (
          <div style={{ marginTop: '0.5rem', borderRadius: 8, overflow: 'hidden', height: 80, position: 'relative' }}>
            <img src={content.backgroundUrl} alt="hero bg" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => (e.currentTarget.style.display = 'none')} />
          </div>
        )}
      </Field>

      <Field label="Hero Layout">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.375rem' }}>
          {['centered', 'split', 'fullscreen', 'minimal'].map(layout => (
            <button
              key={layout}
              onClick={() => onChange({ layout })}
              style={{
                padding: '0.5rem', borderRadius: 8, fontSize: '0.72rem', cursor: 'pointer',
                border: `1px solid ${content.layout === layout ? 'var(--gold)' : 'var(--ink-border)'}`,
                background: content.layout === layout ? 'var(--gold-glow)' : 'transparent',
                color: content.layout === layout ? 'var(--gold-light)' : 'var(--mist)',
                textTransform: 'capitalize',
              }}
            >
              {layout}
            </button>
          ))}
        </div>
      </Field>

      <Field label="Overlay Opacity">
        <input
          type="range" min="0" max="100" step="5"
          value={content.overlayOpacity ?? 40}
          onChange={e => onChange({ overlayOpacity: parseInt(e.target.value) })}
          style={{ width: '100%', accentColor: 'var(--gold)' }}
        />
        <div style={{ fontSize: '0.7rem', color: 'var(--dust)', textAlign: 'right' }}>{content.overlayOpacity ?? 40}%</div>
      </Field>
    </div>
  );
}

// ── Countdown Section ─────────────────────────────────────────────────────────
export function CountdownEditor({ content, onChange, invitationData }: SectionEditorProps) {
  return (
    <div>
      <Field label="Countdown Title">
        <input
          style={inputStyle}
          value={content.title || ''}
          onChange={e => onChange({ title: e.target.value })}
          placeholder="Counting Down To Our Special Day"
          onFocus={e => (e.target.style.borderColor = 'var(--gold)')}
          onBlur={e => (e.target.style.borderColor = 'var(--ink-border-strong)')}
        />
      </Field>

      <Field label="Countdown Style">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.375rem' }}>
          {['flip', 'rings', 'minimal', 'bold'].map(s => (
            <button
              key={s}
              onClick={() => onChange({ style: s })}
              style={{
                padding: '0.5rem', borderRadius: 8, fontSize: '0.72rem', cursor: 'pointer',
                border: `1px solid ${content.style === s ? 'var(--gold)' : 'var(--ink-border)'}`,
                background: content.style === s ? 'var(--gold-glow)' : 'transparent',
                color: content.style === s ? 'var(--gold-light)' : 'var(--mist)',
                textTransform: 'capitalize',
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </Field>

      <Field label="Show Labels">
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.8rem', color: 'var(--mist)' }}>
          <input
            type="checkbox"
            checked={content.showLabels !== false}
            onChange={e => onChange({ showLabels: e.target.checked })}
            style={{ accentColor: 'var(--gold)' }}
          />
          Show days / hours / minutes / seconds labels
        </label>
      </Field>
    </div>
  );
}

// ── Story Section ─────────────────────────────────────────────────────────────
export function StoryEditor({ content, onChange }: SectionEditorProps) {
  const milestones: Array<{ title: string; date: string; description: string }> = content.milestones || [
    { title: 'How We Met', date: '', description: '' },
    { title: 'The Proposal', date: '', description: '' },
  ];

  const updateMilestone = (idx: number, field: string, value: string) => {
    const updated = [...milestones];
    updated[idx] = { ...updated[idx], [field]: value };
    onChange({ milestones: updated });
  };

  const addMilestone = () => onChange({
    milestones: [...milestones, { title: 'New Chapter', date: '', description: '' }]
  });

  const removeMilestone = (idx: number) => onChange({
    milestones: milestones.filter((_, i) => i !== idx)
  });

  return (
    <div>
      <Field label="Section Title">
        <input style={inputStyle} value={content.sectionTitle || 'Our Story'} onChange={e => onChange({ sectionTitle: e.target.value })}
          onFocus={e => (e.target.style.borderColor = 'var(--gold)')} onBlur={e => (e.target.style.borderColor = 'var(--ink-border-strong)')} />
      </Field>

      <Field label="Story Intro">
        <textarea style={{ ...inputStyle, resize: 'none' }} rows={3}
          value={content.intro || ''}
          onChange={e => onChange({ intro: e.target.value })}
          placeholder="How your love story began…"
          onFocus={e => (e.target.style.borderColor = 'var(--gold)')} onBlur={e => (e.target.style.borderColor = 'var(--ink-border-strong)')}
        />
      </Field>

      <div style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={labelStyle}>Timeline Milestones</span>
        <button onClick={addMilestone} style={{ background: 'var(--gold-glow)', border: '1px solid var(--gold-dim)', borderRadius: 6, padding: '3px 8px', fontSize: '0.7rem', color: 'var(--gold)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3 }}>
          <Plus size={10} /> Add
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {milestones.map((m, i) => (
          <div key={i} style={{ background: 'var(--ink-surface)', border: '1px solid var(--ink-border)', borderRadius: 10, padding: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <GripVertical size={12} style={{ color: 'var(--dust)', cursor: 'grab' }} />
              <input style={{ ...inputStyle, flex: 1, padding: '0.4rem 0.625rem', fontSize: '0.78rem' }}
                value={m.title} placeholder="Chapter title"
                onChange={e => updateMilestone(i, 'title', e.target.value)}
                onFocus={e => (e.target.style.borderColor = 'var(--gold)')} onBlur={e => (e.target.style.borderColor = 'var(--ink-border-strong)')}
              />
              <button onClick={() => removeMilestone(i)} style={{ background: 'none', border: 'none', color: 'var(--dust)', cursor: 'pointer' }}>
                <Trash2 size={12} />
              </button>
            </div>
            <input style={{ ...inputStyle, padding: '0.4rem 0.625rem', fontSize: '0.75rem', marginBottom: '0.4rem' }}
              value={m.date} placeholder="Date (e.g. Summer 2022)"
              onChange={e => updateMilestone(i, 'date', e.target.value)}
              onFocus={e => (e.target.style.borderColor = 'var(--gold)')} onBlur={e => (e.target.style.borderColor = 'var(--ink-border-strong)')}
            />
            <textarea style={{ ...inputStyle, padding: '0.4rem 0.625rem', fontSize: '0.75rem', resize: 'none' }} rows={2}
              value={m.description} placeholder="What happened…"
              onChange={e => updateMilestone(i, 'description', e.target.value)}
              onFocus={e => (e.target.style.borderColor = 'var(--gold)')} onBlur={e => (e.target.style.borderColor = 'var(--ink-border-strong)')}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Event Details Section ─────────────────────────────────────────────────────
export function EventDetailsEditor({ content, onChange, invitationData }: SectionEditorProps) {
  const events: Array<{ name: string; date: string; time: string; venue: string; address: string; dressCode: string }> =
    content.events || [{ name: 'Wedding Ceremony', date: invitationData?.eventDate?.split('T')[0] || '', time: '16:00', venue: invitationData?.venue || '', address: invitationData?.venueAddress || '', dressCode: '' }];

  const updateEvent = (idx: number, field: string, value: string) => {
    const updated = [...events];
    updated[idx] = { ...updated[idx], [field]: value };
    onChange({ events: updated });
  };

  const addEvent = () => onChange({
    events: [...events, { name: 'Reception', date: '', time: '', venue: '', address: '', dressCode: '' }]
  });

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.875rem' }}>
        <span style={{ ...labelStyle, marginBottom: 0 }}>Events</span>
        <button onClick={addEvent} style={{ background: 'var(--gold-glow)', border: '1px solid var(--gold-dim)', borderRadius: 6, padding: '3px 8px', fontSize: '0.7rem', color: 'var(--gold)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3 }}>
          <Plus size={10} /> Add Event
        </button>
      </div>

      {events.map((ev, i) => (
        <div key={i} style={{ background: 'var(--ink-surface)', border: '1px solid var(--ink-border)', borderRadius: 10, padding: '0.875rem', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.625rem' }}>
            <input style={{ ...inputStyle, flex: 1, fontWeight: 600, fontSize: '0.82rem' }}
              value={ev.name} placeholder="Event Name"
              onChange={e => updateEvent(i, 'name', e.target.value)}
              onFocus={e => (e.target.style.borderColor = 'var(--gold)')} onBlur={e => (e.target.style.borderColor = 'var(--ink-border-strong)')}
            />
            {events.length > 1 && (
              <button onClick={() => onChange({ events: events.filter((_, j) => j !== i) })}
                style={{ background: 'none', border: 'none', color: 'var(--dust)', cursor: 'pointer', marginLeft: '0.5rem' }}>
                <Trash2 size={12} />
              </button>
            )}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <div>
              <span style={labelStyle}>Date</span>
              <input type="date" style={inputStyle} value={ev.date} onChange={e => updateEvent(i, 'date', e.target.value)}
                onFocus={e => (e.target.style.borderColor = 'var(--gold)')} onBlur={e => (e.target.style.borderColor = 'var(--ink-border-strong)')} />
            </div>
            <div>
              <span style={labelStyle}>Time</span>
              <input type="time" style={inputStyle} value={ev.time} onChange={e => updateEvent(i, 'time', e.target.value)}
                onFocus={e => (e.target.style.borderColor = 'var(--gold)')} onBlur={e => (e.target.style.borderColor = 'var(--ink-border-strong)')} />
            </div>
          </div>
          <div style={{ marginBottom: '0.5rem' }}>
            <span style={labelStyle}>Venue Name</span>
            <input style={inputStyle} value={ev.venue} placeholder="Venue name" onChange={e => updateEvent(i, 'venue', e.target.value)}
              onFocus={e => (e.target.style.borderColor = 'var(--gold)')} onBlur={e => (e.target.style.borderColor = 'var(--ink-border-strong)')} />
          </div>
          <div style={{ marginBottom: '0.5rem' }}>
            <span style={labelStyle}>Full Address</span>
            <input style={inputStyle} value={ev.address} placeholder="123 Main St, City, Country" onChange={e => updateEvent(i, 'address', e.target.value)}
              onFocus={e => (e.target.style.borderColor = 'var(--gold)')} onBlur={e => (e.target.style.borderColor = 'var(--ink-border-strong)')} />
          </div>
          <div>
            <span style={labelStyle}>Dress Code</span>
            <input style={inputStyle} value={ev.dressCode} placeholder="Black Tie / Formal / Smart Casual…" onChange={e => updateEvent(i, 'dressCode', e.target.value)}
              onFocus={e => (e.target.style.borderColor = 'var(--gold)')} onBlur={e => (e.target.style.borderColor = 'var(--ink-border-strong)')} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Gallery Section ───────────────────────────────────────────────────────────
export function GalleryEditor({ content, onChange }: SectionEditorProps) {
  const photos: string[] = content.photos || [];

  const addPhoto = () => onChange({ photos: [...photos, ''] });
  const updatePhoto = (idx: number, url: string) => {
    const updated = [...photos];
    updated[idx] = url;
    onChange({ photos: updated });
  };

  return (
    <div>
      <Field label="Gallery Title">
        <input style={inputStyle} value={content.title || 'Our Gallery'} onChange={e => onChange({ title: e.target.value })}
          onFocus={e => (e.target.style.borderColor = 'var(--gold)')} onBlur={e => (e.target.style.borderColor = 'var(--ink-border-strong)')} />
      </Field>

      <Field label="Layout">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.375rem' }}>
          {['grid', 'masonry', 'carousel', 'polaroid'].map(l => (
            <button key={l} onClick={() => onChange({ layout: l })} style={{
              padding: '0.45rem', borderRadius: 8, fontSize: '0.72rem', cursor: 'pointer', textTransform: 'capitalize',
              border: `1px solid ${content.layout === l ? 'var(--gold)' : 'var(--ink-border)'}`,
              background: content.layout === l ? 'var(--gold-glow)' : 'transparent',
              color: content.layout === l ? 'var(--gold-light)' : 'var(--mist)',
            }}>
              {l}
            </button>
          ))}
        </div>
      </Field>

      <div style={{ marginBottom: '0.625rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={labelStyle}>Photos ({photos.length}/12)</span>
        {photos.length < 12 && (
          <button onClick={addPhoto} style={{ background: 'var(--gold-glow)', border: '1px solid var(--gold-dim)', borderRadius: 6, padding: '3px 8px', fontSize: '0.7rem', color: 'var(--gold)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3 }}>
            <Plus size={10} /> Add Photo
          </button>
        )}
      </div>

      {photos.length === 0 && (
        <div style={{ textAlign: 'center', padding: '1.5rem', background: 'var(--ink-surface)', borderRadius: 8, border: '1px dashed var(--ink-border-strong)', marginBottom: '0.75rem' }}>
          <Image size={24} style={{ color: 'var(--dust)', margin: '0 auto 0.5rem' }} />
          <p style={{ fontSize: '0.78rem', color: 'var(--mist)' }}>Add photo URLs to build your gallery</p>
          <button onClick={addPhoto} style={{ marginTop: '0.625rem', background: 'var(--gold-glow)', border: '1px solid var(--gold-dim)', borderRadius: 6, padding: '5px 12px', fontSize: '0.72rem', color: 'var(--gold)', cursor: 'pointer' }}>
            Add First Photo
          </button>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
        {photos.map((url, idx) => (
          <div key={idx} style={{ position: 'relative' }}>
            <div style={{ aspectRatio: '1', borderRadius: 8, overflow: 'hidden', background: 'var(--ink-surface)', border: '1px solid var(--ink-border)', marginBottom: '0.25rem' }}>
              {url ? (
                <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => (e.currentTarget.style.display = 'none')} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Image size={16} style={{ color: 'var(--dust)' }} />
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: '0.25rem' }}>
              <input style={{ ...inputStyle, flex: 1, padding: '0.3rem 0.5rem', fontSize: '0.65rem' }}
                value={url} placeholder="Image URL"
                onChange={e => updatePhoto(idx, e.target.value)}
                onFocus={e => (e.target.style.borderColor = 'var(--gold)')} onBlur={e => (e.target.style.borderColor = 'var(--ink-border-strong)')}
              />
              <button onClick={() => onChange({ photos: photos.filter((_, i) => i !== idx) })}
                style={{ background: 'var(--ink-surface)', border: '1px solid var(--ink-border)', borderRadius: 6, padding: '0 0.375rem', color: 'var(--dust)', cursor: 'pointer' }}>
                <Trash2 size={10} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── RSVP Section ──────────────────────────────────────────────────────────────
export function RSVPSectionEditor({ content, onChange }: SectionEditorProps) {
  const customQuestions: Array<{ id: string; question: string; type: string; required: boolean }> =
    content.customQuestions || [];

  const addQuestion = () => onChange({
    customQuestions: [...customQuestions, { id: Date.now().toString(), question: '', type: 'text', required: false }]
  });

  return (
    <div>
      <Field label="RSVP Deadline">
        <input type="date" style={inputStyle} value={content.deadline || ''}
          onChange={e => onChange({ deadline: e.target.value })}
          onFocus={e => (e.target.style.borderColor = 'var(--gold)')} onBlur={e => (e.target.style.borderColor = 'var(--ink-border-strong)')} />
      </Field>

      <Field label="Confirmation Message">
        <textarea style={{ ...inputStyle, resize: 'none' }} rows={2}
          value={content.confirmationMessage || ''}
          onChange={e => onChange({ confirmationMessage: e.target.value })}
          placeholder="We can't wait to celebrate with you!"
          onFocus={e => (e.target.style.borderColor = 'var(--gold)')} onBlur={e => (e.target.style.borderColor = 'var(--ink-border-strong)')} />
      </Field>

      {/* Toggles */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', marginBottom: '1rem' }}>
        {[
          { key: 'requireEmail', label: 'Require email address' },
          { key: 'requirePhone', label: 'Ask for phone number' },
          { key: 'enablePlusOne', label: 'Allow plus-one' },
          { key: 'enableMealChoice', label: 'Meal preference selection' },
          { key: 'enableNotes', label: 'Personal message field' },
          { key: 'enableGuestCount', label: 'Number of guests' },
        ].map(({ key, label }) => (
          <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', cursor: 'pointer', fontSize: '0.8rem', color: 'var(--mist)' }}>
            <input type="checkbox" checked={content[key] !== false}
              onChange={e => onChange({ [key]: e.target.checked })}
              style={{ accentColor: 'var(--gold)', width: 14, height: 14 }} />
            {label}
          </label>
        ))}
      </div>

      {/* Meal options */}
      {content.enableMealChoice !== false && (
        <Field label="Meal Options">
          <input style={inputStyle} value={content.mealOptions?.join(', ') || 'Standard, Vegetarian, Vegan, Halal, Gluten-Free'}
            onChange={e => onChange({ mealOptions: e.target.value.split(',').map((s: string) => s.trim()) })}
            placeholder="Standard, Vegetarian, Vegan…"
            onFocus={e => (e.target.style.borderColor = 'var(--gold)')} onBlur={e => (e.target.style.borderColor = 'var(--ink-border-strong)')} />
          <p style={{ fontSize: '0.65rem', color: 'var(--dust)', marginTop: '0.3rem' }}>Comma-separated values</p>
        </Field>
      )}

      {/* Custom questions */}
      <div style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={labelStyle}>Custom Questions</span>
        <button onClick={addQuestion} style={{ background: 'var(--gold-glow)', border: '1px solid var(--gold-dim)', borderRadius: 6, padding: '3px 8px', fontSize: '0.7rem', color: 'var(--gold)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3 }}>
          <Plus size={10} /> Add
        </button>
      </div>
      {customQuestions.map((q, i) => (
        <div key={q.id} style={{ background: 'var(--ink-surface)', border: '1px solid var(--ink-border)', borderRadius: 8, padding: '0.625rem', marginBottom: '0.5rem', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <input style={{ ...inputStyle, marginBottom: '0.375rem', fontSize: '0.78rem' }}
              value={q.question} placeholder="Your question…"
              onChange={e => {
                const updated = [...customQuestions];
                updated[i] = { ...updated[i], question: e.target.value };
                onChange({ customQuestions: updated });
              }}
              onFocus={e => (e.target.style.borderColor = 'var(--gold)')} onBlur={e => (e.target.style.borderColor = 'var(--ink-border-strong)')} />
            <div style={{ display: 'flex', gap: '0.375rem' }}>
              {['text', 'select', 'checkbox'].map(type => (
                <button key={type} onClick={() => { const updated = [...customQuestions]; updated[i] = { ...updated[i], type }; onChange({ customQuestions: updated }); }}
                  style={{ padding: '2px 8px', borderRadius: 4, fontSize: '0.65rem', cursor: 'pointer',
                    border: `1px solid ${q.type === type ? 'var(--gold)' : 'var(--ink-border)'}`,
                    background: q.type === type ? 'var(--gold-glow)' : 'transparent',
                    color: q.type === type ? 'var(--gold-light)' : 'var(--dust)' }}>
                  {type}
                </button>
              ))}
            </div>
          </div>
          <button onClick={() => onChange({ customQuestions: customQuestions.filter((_, j) => j !== i) })}
            style={{ background: 'none', border: 'none', color: 'var(--dust)', cursor: 'pointer', paddingTop: 4 }}>
            <Trash2 size={12} />
          </button>
        </div>
      ))}
    </div>
  );
}

// ── Guestbook Section ─────────────────────────────────────────────────────────
export function GuestbookEditor({ content, onChange }: SectionEditorProps) {
  return (
    <div>
      <Field label="Section Title">
        <input style={inputStyle} value={content.title || 'Leave a Wish'} onChange={e => onChange({ title: e.target.value })}
          onFocus={e => (e.target.style.borderColor = 'var(--gold)')} onBlur={e => (e.target.style.borderColor = 'var(--ink-border-strong)')} />
      </Field>

      <Field label="Placeholder Prompt">
        <input style={inputStyle} value={content.placeholder || 'Share your wishes with the couple…'} onChange={e => onChange({ placeholder: e.target.value })}
          onFocus={e => (e.target.style.borderColor = 'var(--gold)')} onBlur={e => (e.target.style.borderColor = 'var(--ink-border-strong)')} />
      </Field>

      {[
        { key: 'requireApproval', label: 'Require approval before showing messages' },
        { key: 'allowAnonymous', label: 'Allow anonymous messages' },
        { key: 'showAvatars', label: 'Show guest avatars' },
      ].map(({ key, label }) => (
        <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', cursor: 'pointer', fontSize: '0.8rem', color: 'var(--mist)', marginBottom: '0.625rem' }}>
          <input type="checkbox" checked={content[key] === true}
            onChange={e => onChange({ [key]: e.target.checked })}
            style={{ accentColor: 'var(--gold)', width: 14, height: 14 }} />
          {label}
        </label>
      ))}
    </div>
  );
}

// ── Section dispatcher ────────────────────────────────────────────────────────
export function SectionEditorDispatcher({ section, onChange, invitationData }: {
  section: { id: string; type: string; content: Record<string, any> };
  onChange: (id: string, content: Record<string, any>) => void;
  invitationData?: any;
}) {
  const update = (updates: Record<string, any>) => onChange(section.id, updates);

  switch (section.type) {
    case 'hero':         return <HeroEditor content={section.content} onChange={update} invitationData={invitationData} />;
    case 'countdown':   return <CountdownEditor content={section.content} onChange={update} invitationData={invitationData} />;
    case 'story':       return <StoryEditor content={section.content} onChange={update} />;
    case 'eventDetails':return <EventDetailsEditor content={section.content} onChange={update} invitationData={invitationData} />;
    case 'gallery':     return <GalleryEditor content={section.content} onChange={update} />;
    case 'rsvp':        return <RSVPSectionEditor content={section.content} onChange={update} />;
    case 'guestbook':   return <GuestbookEditor content={section.content} onChange={update} />;
    default:
      return (
        <div style={{ padding: '1rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--mist)', lineHeight: 1.6 }}>
            Click on sections in the preview to edit their content, or use the section list on the left to toggle sections on/off.
          </p>
        </div>
      );
  }
}
