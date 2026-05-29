'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Monitor, Smartphone, Send, Loader2, ArrowLeft, Eye, EyeOff,
  GripVertical, Palette, Settings2, ChevronRight, Copy, Check,
  Undo, Redo, ExternalLink,
} from 'lucide-react';
import { useBuilderStore } from '@/store/builder.store';
import { useToast } from '@/components/ui/toast';
import ThemeEditor from '@/components/builder/ThemeEditor';
import { SectionEditorDispatcher } from '@/components/builder/SectionEditors';
import api from '@/lib/api';

// ─── Live Preview ─────────────────────────────────────────────────────────────
function InvitationPreview({ invitation, sections, theme, previewMode }: {
  invitation: any;
  sections: any[];
  theme: any;
  previewMode: 'desktop' | 'mobile';
}) {
  if (!invitation) return null;
  const primary = theme?.primary || '#C9A84C';
  const secondary = theme?.secondary || '#F5EDD9';
  const font = theme?.font || 'Playfair Display';
  const isDark = theme?.dark === true;
  const bg = isDark ? '#0C0B0A' : secondary;
  const textColor = isDark ? '#F5EDD9' : '#1A1510';
  const mutedColor = isDark ? '#9E9188' : '#6B5F52';

  const enabledSections = sections.filter(s => s.enabled !== false);

  return (
    <div
      style={{
        width: previewMode === 'mobile' ? 360 : '100%',
        maxWidth: previewMode === 'mobile' ? 360 : 680,
        margin: '0 auto',
        height: '100%',
        overflowY: 'auto',
        borderRadius: previewMode === 'mobile' ? 24 : 0,
        border: previewMode === 'mobile' ? '8px solid #1C1916' : 'none',
        boxShadow: previewMode === 'mobile' ? '0 20px 60px rgba(0,0,0,0.7)' : 'none',
        background: bg,
        color: textColor,
        fontFamily: `"${font}", serif`,
        transition: 'all 0.4s ease',
      }}
    >
      {/* Hero always first */}
      <div style={{
        minHeight: previewMode === 'mobile' ? 320 : 400,
        background: enabledSections.find(s => s.type === 'hero')?.content?.backgroundUrl
          ? `linear-gradient(rgba(0,0,0,${(enabledSections.find(s => s.type === 'hero')?.content?.overlayOpacity ?? 40) / 100}), rgba(0,0,0,0.3)), url(${enabledSections.find(s => s.type === 'hero')?.content?.backgroundUrl}) center/cover`
          : `linear-gradient(160deg, ${primary}22, ${primary}11)`,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '2.5rem 1.5rem', textAlign: 'center', position: 'relative',
      }}>
        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse 80% 60% at 50% 40%, ${primary}20, transparent)` }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: 'center', marginBottom: '1.25rem' }}>
            <div style={{ height: 1, width: 30, background: `linear-gradient(90deg, transparent, ${primary})` }} />
            <span style={{ fontSize: '0.55rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: primary, opacity: 0.8 }}>
              {isDark ? '★' : '♡'} Wedding Invitation {isDark ? '★' : '♡'}
            </span>
            <div style={{ height: 1, width: 30, background: `linear-gradient(90deg, ${primary}, transparent)` }} />
          </div>
          {enabledSections.find(s => s.type === 'hero')?.content?.subheadline && (
            <div style={{ fontSize: '0.65rem', letterSpacing: '0.1em', color: isDark ? '#9E9188' : '#8B7355', marginBottom: '0.75rem' }}>
              {enabledSections.find(s => s.type === 'hero')?.content?.subheadline}
            </div>
          )}
          <div style={{ fontStyle: 'italic', fontSize: previewMode === 'mobile' ? '2rem' : '2.5rem', color: primary, lineHeight: 1.1, marginBottom: '0.5rem' }}>
            {invitation.groomName}
            <br /><span style={{ fontSize: '0.45em', fontStyle: 'normal', opacity: 0.5 }}>&amp;</span><br />
            {invitation.brideName}
          </div>
          {enabledSections.find(s => s.type === 'hero')?.content?.quote && (
            <div style={{ fontSize: '0.7rem', color: mutedColor, fontStyle: 'italic', marginTop: '0.75rem', maxWidth: 280 }}>
              "{enabledSections.find(s => s.type === 'hero')?.content?.quote}"
            </div>
          )}
          <div style={{ marginTop: '1rem', fontSize: '0.65rem', color: mutedColor, letterSpacing: '0.08em' }}>
            {new Date(invitation.eventDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
          {invitation.venue && (
            <div style={{ fontSize: '0.6rem', color: mutedColor, opacity: 0.7, marginTop: '0.25rem' }}>
              📍 {invitation.venue}
            </div>
          )}
        </div>
      </div>

      {/* Render enabled sections */}
      {enabledSections.filter(s => s.type !== 'hero').map(section => (
        <div key={section.id} style={{ padding: '2rem 1.5rem', borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}>
          {section.type === 'countdown' && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.55rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: primary, marginBottom: '0.5rem', opacity: 0.8 }}>
                {section.content.title || 'Counting Down'}
              </div>
              <div style={{ display: 'flex', gap: '1.25rem', justifyContent: 'center' }}>
                {['00', '00', '00', '00'].map((v, i) => (
                  <div key={i} style={{ textAlign: 'center' }}>
                    <div style={{ fontStyle: 'italic', fontSize: '1.75rem', color: primary, lineHeight: 1 }}>{v}</div>
                    <div style={{ fontSize: '0.5rem', color: mutedColor, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '0.25rem' }}>
                      {['Days', 'Hours', 'Mins', 'Secs'][i]}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {section.type === 'story' && (
            <div>
              <div style={{ fontSize: '0.55rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: primary, marginBottom: '0.5rem', opacity: 0.8 }}>
                Our Story
              </div>
              <div style={{ fontStyle: 'italic', fontSize: '1.1rem', color: isDark ? '#E8DCC8' : '#3A2A1A', marginBottom: '0.75rem' }}>
                {section.content.sectionTitle || 'How It All Began'}
              </div>
              {section.content.intro && (
                <p style={{ fontSize: '0.75rem', color: mutedColor, lineHeight: 1.7 }}>{section.content.intro}</p>
              )}
              {section.content.milestones?.slice(0, 2).map((m: any, i: number) => (
                <div key={i} style={{ marginTop: '1rem', paddingLeft: '1rem', borderLeft: `2px solid ${primary}40` }}>
                  <div style={{ fontSize: '0.65rem', fontWeight: 600, color: primary }}>{m.title}</div>
                  {m.date && <div style={{ fontSize: '0.6rem', color: mutedColor }}>{m.date}</div>}
                  {m.description && <div style={{ fontSize: '0.65rem', color: mutedColor, marginTop: '0.25rem', lineHeight: 1.5 }}>{m.description}</div>}
                </div>
              ))}
            </div>
          )}

          {section.type === 'eventDetails' && (
            <div>
              <div style={{ fontSize: '0.55rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: primary, marginBottom: '0.75rem', opacity: 0.8 }}>
                Event Details
              </div>
              {(section.content.events || [{ name: 'Wedding Ceremony', venue: invitation.venue, address: invitation.venueAddress }]).map((ev: any, i: number) => (
                <div key={i} style={{ marginBottom: '0.75rem', padding: '0.75rem', background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)', borderRadius: 8, border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}>
                  <div style={{ fontWeight: 600, fontSize: '0.8rem', color: isDark ? '#F5EDD9' : '#1A1510', marginBottom: '0.25rem' }}>{ev.name}</div>
                  {(ev.date || ev.time) && <div style={{ fontSize: '0.65rem', color: mutedColor }}>{ev.date} {ev.time && `· ${ev.time}`}</div>}
                  {ev.venue && <div style={{ fontSize: '0.65rem', color: mutedColor, marginTop: '0.15rem' }}>📍 {ev.venue}</div>}
                  {ev.dressCode && <div style={{ fontSize: '0.6rem', color: mutedColor, marginTop: '0.15rem', fontStyle: 'italic' }}>Dress: {ev.dressCode}</div>}
                </div>
              ))}
            </div>
          )}

          {section.type === 'gallery' && (
            <div>
              <div style={{ fontSize: '0.55rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: primary, marginBottom: '0.75rem', opacity: 0.8 }}>
                {section.content.title || 'Gallery'}
              </div>
              {section.content.photos?.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.375rem' }}>
                  {section.content.photos.slice(0, 6).map((url: string, i: number) => (
                    <div key={i} style={{ aspectRatio: '1', borderRadius: 6, overflow: 'hidden', background: isDark ? '#1C1916' : '#f0ece4' }}>
                      <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => (e.currentTarget.style.display = 'none')} />
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '1.5rem', background: isDark ? '#1C1916' : '#F5F0E8', borderRadius: 8, fontSize: '0.72rem', color: mutedColor }}>
                  Gallery photos will appear here
                </div>
              )}
            </div>
          )}

          {section.type === 'rsvp' && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.55rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: primary, marginBottom: '0.5rem', opacity: 0.8 }}>
                Kindly Respond
              </div>
              <div style={{ fontStyle: 'italic', fontSize: '1.5rem', color: isDark ? '#F5EDD9' : '#1A1510', marginBottom: '0.75rem' }}>
                RSVP
              </div>
              {section.content.deadline && (
                <div style={{ fontSize: '0.65rem', color: mutedColor, marginBottom: '1rem' }}>
                  Please respond by {section.content.deadline}
                </div>
              )}
              <div style={{ display: 'flex', gap: '0.625rem', justifyContent: 'center' }}>
                <div style={{ padding: '0.625rem 1.5rem', borderRadius: 8, background: primary, color: isDark ? '#0C0B0A' : '#fff', fontSize: '0.75rem', fontWeight: 700 }}>
                  ✓ Attending
                </div>
                <div style={{ padding: '0.625rem 1.5rem', borderRadius: 8, border: `1px solid ${isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)'}`, fontSize: '0.75rem', color: mutedColor }}>
                  ✗ Declining
                </div>
              </div>
            </div>
          )}

          {section.type === 'guestbook' && (
            <div>
              <div style={{ fontSize: '0.55rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: primary, marginBottom: '0.5rem', opacity: 0.8 }}>
                {section.content.title || 'Wishes'}
              </div>
              <div style={{ padding: '0.75rem', background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)', borderRadius: 8, border: `1px dashed ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}` }}>
                <div style={{ fontSize: '0.7rem', color: mutedColor, fontStyle: 'italic' }}>
                  {section.content.placeholder || 'Share your wishes with the couple…'}
                </div>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Preview footer */}
      <div style={{ padding: '1.5rem', borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`, textAlign: 'center' }}>
        <div style={{ fontSize: '0.55rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: mutedColor, opacity: 0.5 }}>
          Created with Invitely
        </div>
      </div>
    </div>
  );
}

// ─── Main Builder ─────────────────────────────────────────────────────────────
export default function BuilderPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();

  const [invitation, setInvitation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [rightTab, setRightTab] = useState<'section' | 'theme'>('section');

  const {
    sections, activeSection, previewMode, isSaving, isDirty,
    setInvitation: setStore, updateSection, toggleSection,
    setActiveSection, setPreviewMode, updateTheme, setSaving, markSaved,
  } = useBuilderStore();

  const theme = useBuilderStore(s => s.theme);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load invitation
  useEffect(() => {
    const id = params.id as string;
    api.get(`/invitations/${id}`)
      .then(res => {
        setInvitation(res.data);
        setStore(id, res.data);
        if (res.data.status === 'PUBLISHED') {
          const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
          setPublishedUrl(`${appUrl}/inv/${res.data.slug}`);
        }
      })
      .catch(() => {
        toast({ title: 'Invitation not found', variant: 'destructive' });
        router.push('/invitations');
      })
      .finally(() => setLoading(false));
  }, [params.id]);

  // Autosave — 3 second debounce
  useEffect(() => {
    if (!isDirty || !invitation) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      setSaving(true);
      try {
        const updatedContent = {
          ...invitation.content,
          sections,
          theme,
        };
        await api.patch(`/invitations/${invitation.id}`, { content: updatedContent });
        setInvitation((prev: any) => ({ ...prev, content: updatedContent }));
        markSaved();
      } catch {
        setSaving(false);
      }
    }, 3000);
    return () => { if (saveTimer.current) clearTimeout(saveTimer.current); };
  }, [isDirty, sections, theme]);

  const handlePublish = async () => {
    setPublishing(true);
    try {
      // Save first
      const updatedContent = { ...invitation.content, sections, theme };
      await api.patch(`/invitations/${invitation.id}`, { content: updatedContent });
      const res = await api.post(`/invitations/${invitation.id}/publish`);
      setPublishedUrl(res.data.publicUrl);
      toast({ title: 'Published!', description: 'Your invitation is live.' });
    } catch (err: any) {
      toast({ title: 'Error', description: err.response?.data?.message, variant: 'destructive' });
    } finally {
      setPublishing(false);
    }
  };

  const handleCopyLink = () => {
    if (!publishedUrl) return;
    navigator.clipboard.writeText(publishedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--ink)' }}>
        <div className="spinner" />
      </div>
    );
  }

  const activeS = sections.find(s => s.id === activeSection);

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#0C0B0A', overflow: 'hidden' }}>

      {/* ── Top bar ── */}
      <div style={{
        height: 52, background: '#141210', borderBottom: '1px solid rgba(201,168,76,0.1)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 1rem',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={() => router.push('/invitations')}
            style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'none', border: 'none', color: 'var(--mist)', cursor: 'pointer', fontSize: '0.78rem', padding: '4px 8px', borderRadius: 6 }}
          >
            <ArrowLeft size={14} /> Back
          </button>
          <div style={{ width: 1, height: 16, background: 'var(--ink-border)' }} />
          <span style={{ fontSize: '0.82rem', color: 'var(--champagne)', fontWeight: 500, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {invitation?.title}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.7rem' }}>
            {isSaving && (
              <span style={{ color: 'var(--dust)', display: 'flex', alignItems: 'center', gap: 4 }}>
                <Loader2 size={11} className="animate-spin" /> Saving…
              </span>
            )}
            {!isSaving && !isDirty && invitation && (
              <span style={{ color: 'var(--dust)' }}>Saved</span>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {/* Preview mode toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 1, background: '#1C1916', borderRadius: 8, padding: 2, border: '1px solid var(--ink-border)' }}>
            {[
              { mode: 'desktop', icon: Monitor },
              { mode: 'mobile', icon: Smartphone },
            ].map(({ mode, icon: Icon }) => (
              <button
                key={mode}
                onClick={() => setPreviewMode(mode as 'desktop' | 'mobile')}
                style={{
                  padding: '5px 8px', borderRadius: 6, border: 'none', cursor: 'pointer',
                  background: previewMode === mode ? 'var(--ink-border-strong)' : 'transparent',
                  color: previewMode === mode ? 'var(--champagne)' : 'var(--dust)',
                  transition: 'background 0.15s',
                }}
              >
                <Icon size={13} />
              </button>
            ))}
          </div>

          {publishedUrl ? (
            <div style={{ display: 'flex', gap: '0.375rem' }}>
              <a href={publishedUrl} target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px', borderRadius: 8, background: 'rgba(61,122,90,0.2)', border: '1px solid rgba(61,122,90,0.35)', color: '#6ECFA0', fontSize: '0.75rem', textDecoration: 'none' }}>
                <ExternalLink size={12} /> Live
              </a>
              <button
                onClick={handleCopyLink}
                style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px', borderRadius: 8, background: 'var(--ink-surface)', border: '1px solid var(--ink-border-strong)', color: 'var(--champagne)', fontSize: '0.75rem', cursor: 'pointer' }}>
                {copied ? <><Check size={12} /> Copied!</> : <><Copy size={12} /> Copy Link</>}
              </button>
            </div>
          ) : (
            <button
              onClick={handlePublish}
              disabled={publishing}
              style={{
                display: 'flex', alignItems: 'center', gap: 5, padding: '6px 14px', borderRadius: 8,
                background: 'linear-gradient(135deg, var(--gold-light), var(--gold))',
                border: 'none', color: '#0C0B0A', fontWeight: 700, fontSize: '0.78rem',
                cursor: 'pointer', opacity: publishing ? 0.7 : 1,
              }}>
              {publishing ? <><Loader2 size={12} className="animate-spin" /> Publishing…</> : <><Send size={12} /> Publish</>}
            </button>
          )}
        </div>
      </div>

      {/* ── Three-panel layout ── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* Left — Section list */}
        <div style={{
          width: 200, flexShrink: 0,
          background: '#0F0E0C', borderRight: '1px solid rgba(201,168,76,0.08)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}>
          <div style={{ padding: '0.75rem 1rem 0.5rem', borderBottom: '1px solid rgba(201,168,76,0.08)' }}>
            <div style={{ fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--dust)' }}>
              Sections
            </div>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '0.375rem 0.5rem' }}>
            {sections.map((section) => {
              const isActive = activeSection === section.id;
              return (
                <div
                  key={section.id}
                  onClick={() => { setActiveSection(section.id); setRightTab('section'); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    padding: '0.5rem 0.625rem', borderRadius: 8, cursor: 'pointer',
                    background: isActive ? 'rgba(201,168,76,0.1)' : 'transparent',
                    border: `1px solid ${isActive ? 'rgba(201,168,76,0.25)' : 'transparent'}`,
                    marginBottom: 2, transition: 'all 0.15s',
                    opacity: section.enabled === false ? 0.4 : 1,
                  }}
                >
                  <GripVertical size={10} style={{ color: 'var(--dust)', cursor: 'grab', flexShrink: 0 }} />
                  <span style={{ flex: 1, fontSize: '0.78rem', color: isActive ? 'var(--gold-light)' : 'var(--mist)', textTransform: 'capitalize', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {section.type === 'eventDetails' ? 'Event Details' : section.type}
                  </span>
                  <button
                    onClick={e => { e.stopPropagation(); toggleSection(section.id); }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: section.enabled !== false ? 'var(--gold-dim)' : 'var(--dust)', flexShrink: 0, padding: 2 }}
                  >
                    {section.enabled !== false ? <Eye size={11} /> : <EyeOff size={11} />}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Center — Live preview */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', background: '#0A0908' }}>
          <div style={{ flex: 1, overflow: 'auto', padding: previewMode === 'mobile' ? '1.5rem' : '1.5rem 2rem', display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
            <InvitationPreview
              invitation={invitation}
              sections={sections}
              theme={theme}
              previewMode={previewMode}
            />
          </div>
        </div>

        {/* Right — Editor panel */}
        <div style={{
          width: 280, flexShrink: 0,
          background: '#0F0E0C', borderLeft: '1px solid rgba(201,168,76,0.08)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}>
          {/* Tab switcher */}
          <div style={{ display: 'flex', borderBottom: '1px solid rgba(201,168,76,0.08)' }}>
            {[
              { id: 'section', label: 'Content', icon: Settings2 },
              { id: 'theme', label: 'Design', icon: Palette },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setRightTab(tab.id as 'section' | 'theme')}
                style={{
                  flex: 1, padding: '0.75rem 0.5rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: '0.75rem', fontWeight: 500,
                  color: rightTab === tab.id ? 'var(--gold-light)' : 'var(--dust)',
                  borderBottom: rightTab === tab.id ? '2px solid var(--gold)' : '2px solid transparent',
                  transition: 'color 0.15s',
                }}
              >
                <tab.icon size={13} /> {tab.label}
              </button>
            ))}
          </div>

          {/* Panel content */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {rightTab === 'theme' ? (
              <ThemeEditor
                theme={theme}
                onChange={updates => updateTheme(updates as any)}
              />
            ) : (
              <div style={{ padding: activeS ? 0 : '1.5rem' }}>
                {activeS ? (
                  <>
                    <div style={{ padding: '0.875rem 1rem', borderBottom: '1px solid rgba(201,168,76,0.08)' }}>
                      <div style={{ fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--dust)', marginBottom: '0.2rem' }}>
                        Editing Section
                      </div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--champagne)', textTransform: 'capitalize' }}>
                        {activeS.type === 'eventDetails' ? 'Event Details' : activeS.type}
                      </div>
                    </div>
                    <div style={{ padding: '1rem' }}>
                      <SectionEditorDispatcher
                        section={activeS}
                        onChange={updateSection}
                        invitationData={invitation}
                      />
                    </div>
                  </>
                ) : (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.75rem', opacity: 0.2 }}>✦</div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--mist)', lineHeight: 1.7, marginBottom: '0.75rem' }}>
                      Select a section from the left panel to edit its content here.
                    </p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--dust)', lineHeight: 1.6 }}>
                      Switch to the <strong style={{ color: 'var(--gold-dim)' }}>Design</strong> tab to customize colors, fonts, and music.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
