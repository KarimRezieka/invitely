'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Monitor, Smartphone, Save, Send, Loader2, ArrowLeft, Eye, EyeOff, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBuilderStore } from '@/store/builder.store';
import { useToast } from '@/components/ui/toast';
import { cn } from '@/lib/utils';
import api from '@/lib/api';

interface Section {
  id: string;
  type: string;
  enabled: boolean;
  order: number;
  content: Record<string, any>;
}

function SectionEditor({ section, onUpdate }: { section: Section; onUpdate: (id: string, content: any) => void }) {
  const { content } = section;

  const handleChange = (key: string, value: any) => {
    onUpdate(section.id, { [key]: value });
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-zinc-900 dark:text-white capitalize">
        {section.type.replace(/([A-Z])/g, ' $1').trim()} Settings
      </h3>
      {section.type === 'hero' && (
        <>
          <div>
            <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1">Couple Quote</label>
            <input
              type="text"
              className="w-full border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm dark:bg-zinc-800 dark:text-white"
              value={content.quote || ''}
              onChange={(e) => handleChange('quote', e.target.value)}
              placeholder="&quot;Two souls, one heart&quot;"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1">Background Image URL</label>
            <input
              type="url"
              className="w-full border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm dark:bg-zinc-800 dark:text-white"
              value={content.backgroundUrl || ''}
              onChange={(e) => handleChange('backgroundUrl', e.target.value)}
              placeholder="https://..."
            />
          </div>
        </>
      )}
      {section.type === 'eventDetails' && (
        <>
          <div>
            <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1">Ceremony Time</label>
            <input
              type="time"
              className="w-full border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm dark:bg-zinc-800 dark:text-white"
              value={content.ceremonyTime || ''}
              onChange={(e) => handleChange('ceremonyTime', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1">Dress Code</label>
            <input
              type="text"
              className="w-full border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm dark:bg-zinc-800 dark:text-white"
              value={content.dressCode || ''}
              onChange={(e) => handleChange('dressCode', e.target.value)}
              placeholder="Black Tie Optional"
            />
          </div>
        </>
      )}
      {section.type === 'story' && (
        <div>
          <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1">Our Story</label>
          <textarea
            className="w-full border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm dark:bg-zinc-800 dark:text-white"
            rows={5}
            value={content.story || ''}
            onChange={(e) => handleChange('story', e.target.value)}
            placeholder="Share your love story..."
          />
        </div>
      )}
      {section.type === 'rsvp' && (
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={content.requireEmail !== false}
              onChange={(e) => handleChange('requireEmail', e.target.checked)}
              className="rounded"
            />
            <span>Require email address</span>
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={content.enableMealChoice !== false}
              onChange={(e) => handleChange('enableMealChoice', e.target.checked)}
              className="rounded"
            />
            <span>Enable meal preference selection</span>
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={content.enablePlusOne !== false}
              onChange={(e) => handleChange('enablePlusOne', e.target.checked)}
              className="rounded"
            />
            <span>Allow plus-one</span>
          </label>
        </div>
      )}
      {!['hero', 'eventDetails', 'story', 'rsvp'].includes(section.type) && (
        <p className="text-sm text-zinc-400">Click sections in the preview to configure them.</p>
      )}
    </div>
  );
}

function InvitationPreview({ invitation, previewMode }: { invitation: any; previewMode: 'desktop' | 'mobile' }) {
  if (!invitation) return null;
  const theme = invitation.content?.theme || {};
  const sections: Section[] = invitation.content?.sections || [];

  return (
    <div className={cn(
      'mx-auto bg-white shadow-2xl overflow-y-auto rounded-lg',
      previewMode === 'mobile' ? 'w-80 h-[640px]' : 'w-full max-w-2xl h-full'
    )}>
      <div style={{ fontFamily: theme.font || 'sans-serif', color: theme.secondary === '#FFFFFF' ? '#333' : '#fff' }}>
        {/* Hero */}
        <div
          className="min-h-64 flex flex-col items-center justify-center text-center p-8"
          style={{ background: `linear-gradient(135deg, ${theme.primary || '#C9A84C'}, ${theme.primary || '#C9A84C'}aa)` }}
        >
          <div className="text-3xl font-serif text-white mb-2">
            {invitation.groomName} & {invitation.brideName}
          </div>
          <div className="text-white/80 text-sm">
            {new Date(invitation.eventDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
          {invitation.venue && <div className="text-white/70 text-xs mt-1">{invitation.venue}</div>}
        </div>

        {/* Sections */}
        {sections.filter((s) => s.enabled).map((section) => (
          <div key={section.id} className="p-6 border-b border-zinc-100">
            <h4 className="text-lg font-semibold mb-2 capitalize" style={{ color: theme.primary || '#C9A84C' }}>
              {section.type.replace(/([A-Z])/g, ' $1').trim()}
            </h4>
            {section.type === 'story' && section.content.story && (
              <p className="text-zinc-600 text-sm leading-relaxed">{section.content.story}</p>
            )}
            {section.type === 'rsvp' && (
              <div className="bg-zinc-50 rounded-lg p-4 text-center">
                <p className="text-sm text-zinc-600 mb-3">Will you join us on our special day?</p>
                <div className="flex gap-3 justify-center">
                  <button className="px-4 py-2 rounded-lg text-white text-sm font-medium" style={{ background: theme.primary || '#C9A84C' }}>Accept</button>
                  <button className="px-4 py-2 rounded-lg border border-zinc-300 text-zinc-600 text-sm">Decline</button>
                </div>
              </div>
            )}
            {!['hero', 'rsvp', 'story'].includes(section.type) && (
              <div className="text-zinc-400 text-sm italic">[{section.type} section]</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function BuilderPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [invitation, setInvitation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null);
  const { sections, activeSection, previewMode, isSaving, isDirty, setInvitation: setStore, updateSection, toggleSection, setActiveSection, setPreviewMode, setSaving, markSaved } = useBuilderStore();
  const saveTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const id = params.id as string;
    api.get(`/invitations/${id}`).then((res) => {
      setInvitation(res.data);
      setStore(id, res.data);
    }).catch(() => {
      toast({ title: 'Error', description: 'Invitation not found', variant: 'destructive' });
      router.push('/invitations');
    }).finally(() => setLoading(false));
  }, [params.id]);

  useEffect(() => {
    if (!isDirty || !invitation) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      setSaving(true);
      try {
        const updatedContent = { ...invitation.content, sections, theme: useBuilderStore.getState().theme };
        await api.patch(`/invitations/${invitation.id}`, { content: updatedContent });
        setInvitation((prev: any) => ({ ...prev, content: updatedContent }));
        markSaved();
      } catch {
        setSaving(false);
      }
    }, 3000);
    return () => { if (saveTimer.current) clearTimeout(saveTimer.current); };
  }, [isDirty, sections]);

  const handlePublish = async () => {
    setPublishing(true);
    try {
      const res = await api.post(`/invitations/${invitation.id}/publish`);
      setPublishedUrl(res.data.publicUrl);
      toast({ title: 'Published!', description: 'Your invitation is now live.' });
    } catch (err: any) {
      toast({ title: 'Error', description: err.response?.data?.message, variant: 'destructive' });
    } finally {
      setPublishing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin text-amber-600" size={32} />
      </div>
    );
  }

  const previewInvitation = invitation ? {
    ...invitation,
    content: { ...invitation.content, sections, theme: useBuilderStore.getState().theme },
  } : null;

  return (
    <div className="h-screen flex flex-col bg-zinc-950">
      {/* Top Bar */}
      <div className="h-14 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="text-zinc-400" onClick={() => router.push('/invitations')}>
            <ArrowLeft size={16} className="mr-1" /> Back
          </Button>
          <span className="text-white font-medium truncate max-w-48">{invitation?.title}</span>
          {isSaving && <span className="text-zinc-400 text-xs flex items-center gap-1"><Loader2 size={12} className="animate-spin" /> Saving...</span>}
          {!isSaving && !isDirty && <span className="text-zinc-500 text-xs">Saved</span>}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-zinc-800 rounded-lg p-1">
            <button
              onClick={() => setPreviewMode('desktop')}
              className={cn('p-1.5 rounded text-zinc-400', previewMode === 'desktop' && 'bg-zinc-700 text-white')}
            >
              <Monitor size={14} />
            </button>
            <button
              onClick={() => setPreviewMode('mobile')}
              className={cn('p-1.5 rounded text-zinc-400', previewMode === 'mobile' && 'bg-zinc-700 text-white')}
            >
              <Smartphone size={14} />
            </button>
          </div>
          {publishedUrl ? (
            <a href={publishedUrl} target="_blank" rel="noopener noreferrer">
              <Button size="sm" className="bg-green-600 hover:bg-green-700">View Live</Button>
            </a>
          ) : (
            <Button size="sm" className="bg-amber-600 hover:bg-amber-700" onClick={handlePublish} disabled={publishing}>
              {publishing ? <Loader2 size={14} className="animate-spin mr-1" /> : <Send size={14} className="mr-1" />}
              Publish
            </Button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar — Sections */}
        <div className="w-52 bg-zinc-900 border-r border-zinc-800 overflow-y-auto">
          <div className="p-3 text-xs text-zinc-500 font-medium uppercase tracking-wider">Sections</div>
          {sections.map((section) => (
            <div
              key={section.id}
              className={cn(
                'flex items-center justify-between px-3 py-2.5 cursor-pointer transition-colors',
                activeSection === section.id
                  ? 'bg-zinc-800 text-white'
                  : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-300'
              )}
              onClick={() => setActiveSection(section.id)}
            >
              <span className="text-sm capitalize">{section.type.replace(/([A-Z])/g, ' $1').trim()}</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={(e) => { e.stopPropagation(); toggleSection(section.id); }}
                  className={cn('w-5 h-5 rounded text-xs', section.enabled ? 'text-amber-500' : 'text-zinc-600')}
                >
                  {section.enabled ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>
                <ChevronRight size={12} className="text-zinc-600" />
              </div>
            </div>
          ))}
        </div>

        {/* Center — Preview */}
        <div className="flex-1 overflow-y-auto flex items-start justify-center p-6 bg-zinc-950">
          <InvitationPreview invitation={previewInvitation} previewMode={previewMode} />
        </div>

        {/* Right Panel — Editor */}
        <div className="w-64 bg-zinc-900 border-l border-zinc-800 overflow-y-auto p-4">
          {activeSection ? (
            (() => {
              const section = sections.find((s) => s.id === activeSection);
              return section ? (
                <SectionEditor section={section} onUpdate={updateSection} />
              ) : null;
            })()
          ) : (
            <div className="text-zinc-500 text-sm text-center py-8">
              <p>Select a section from the left to edit it</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
