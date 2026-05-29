import { create } from 'zustand';

interface Invitation {
  id: string;
  title: string;
  slug: string;
  status: string;
  groomName: string;
  brideName: string;
  eventDate: string;
  viewCount: number;
  template?: { name: string; thumbnailUrl?: string };
  _count?: { rsvpResponses: number };
}

interface InvitationState {
  invitations: Invitation[];
  setInvitations: (invitations: Invitation[]) => void;
  addInvitation: (invitation: Invitation) => void;
  updateInvitation: (id: string, data: Partial<Invitation>) => void;
  removeInvitation: (id: string) => void;
}

export const useInvitationStore = create<InvitationState>((set) => ({
  invitations: [],
  setInvitations: (invitations) => set({ invitations }),
  addInvitation: (invitation) =>
    set((state) => ({ invitations: [invitation, ...state.invitations] })),
  updateInvitation: (id, data) =>
    set((state) => ({
      invitations: state.invitations.map((inv) =>
        inv.id === id ? { ...inv, ...data } : inv
      ),
    })),
  removeInvitation: (id) =>
    set((state) => ({ invitations: state.invitations.filter((inv) => inv.id !== id) })),
}));
