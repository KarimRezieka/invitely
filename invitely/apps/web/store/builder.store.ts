import { create } from 'zustand';

interface Section {
  id: string;
  type: string;
  enabled: boolean;
  order: number;
  content: Record<string, any>;
}

interface BuilderState {
  invitationId: string | null;
  templateSchema: any | null;
  sections: Section[];
  activeSection: string | null;
  theme: {
    primary: string;
    secondary: string;
    font: string;
  };
  settings: {
    musicUrl?: string;
    musicAutoplay: boolean;
    passwordProtected: boolean;
    password?: string;
  };
  isSaving: boolean;
  lastSaved: Date | null;
  isDirty: boolean;
  previewMode: 'desktop' | 'mobile';

  setInvitation: (id: string, data: any) => void;
  updateSection: (sectionId: string, content: Partial<Record<string, any>>) => void;
  toggleSection: (sectionId: string) => void;
  reorderSections: (sections: Section[]) => void;
  setActiveSection: (sectionId: string | null) => void;
  updateTheme: (theme: Partial<BuilderState['theme']>) => void;
  updateSettings: (settings: Partial<BuilderState['settings']>) => void;
  setPreviewMode: (mode: 'desktop' | 'mobile') => void;
  setSaving: (status: boolean) => void;
  markSaved: () => void;
}

export const useBuilderStore = create<BuilderState>((set) => ({
  invitationId: null,
  templateSchema: null,
  sections: [],
  activeSection: null,
  theme: { primary: '#C9A84C', secondary: '#F5F0E8', font: 'Playfair Display' },
  settings: { musicAutoplay: false, passwordProtected: false },
  isSaving: false,
  lastSaved: null,
  isDirty: false,
  previewMode: 'desktop',

  setInvitation: (id, data) => {
    const content = data.content || {};
    set({
      invitationId: id,
      templateSchema: data.template?.schema,
      sections: content.sections || [],
      theme: content.theme || { primary: '#C9A84C', secondary: '#F5F0E8', font: 'Playfair Display' },
      settings: data.settings || {},
      isDirty: false,
    });
  },

  updateSection: (sectionId, content) =>
    set((state) => ({
      sections: state.sections.map((s) =>
        s.id === sectionId ? { ...s, content: { ...s.content, ...content } } : s
      ),
      isDirty: true,
    })),

  toggleSection: (sectionId) =>
    set((state) => ({
      sections: state.sections.map((s) =>
        s.id === sectionId ? { ...s, enabled: !s.enabled } : s
      ),
      isDirty: true,
    })),

  reorderSections: (sections) => set({ sections, isDirty: true }),
  setActiveSection: (sectionId) => set({ activeSection: sectionId }),
  updateTheme: (theme) => set((state) => ({ theme: { ...state.theme, ...theme }, isDirty: true })),
  updateSettings: (settings) =>
    set((state) => ({ settings: { ...state.settings, ...settings }, isDirty: true })),
  setPreviewMode: (mode) => set({ previewMode: mode }),
  setSaving: (status) => set({ isSaving: status }),
  markSaved: () => set({ isSaving: false, lastSaved: new Date(), isDirty: false }),
}));
