export interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN' | 'SUPER_ADMIN';
  avatarUrl?: string;
  emailVerified: boolean;
  createdAt: string;
  subscription?: Subscription;
}

export interface Subscription {
  id: string;
  userId: string;
  plan: 'FREE' | 'BASIC' | 'PREMIUM' | 'ENTERPRISE';
  status: 'ACTIVE' | 'CANCELED' | 'PAST_DUE' | 'TRIALING' | 'INCOMPLETE';
  currentPeriodEnd?: string;
  cancelAtPeriodEnd: boolean;
}

export interface Template {
  id: string;
  name: string;
  slug: string;
  description?: string;
  category: string;
  thumbnailUrl?: string;
  previewUrl?: string;
  isPremium: boolean;
  isActive: boolean;
  schema: Record<string, any>;
}

export interface Invitation {
  id: string;
  userId: string;
  templateId: string;
  slug: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  title: string;
  groomName: string;
  brideName: string;
  eventDate: string;
  venue?: string;
  venueAddress?: string;
  venueLat?: number;
  venueLng?: number;
  content: Record<string, any>;
  settings?: Record<string, any>;
  viewCount: number;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  template?: Template;
}

export interface RSVPResponse {
  id: string;
  invitationId: string;
  guestName: string;
  guestEmail?: string;
  guestPhone?: string;
  status: 'ACCEPTED' | 'DECLINED' | 'PENDING';
  guestCount: number;
  plusOneName?: string;
  mealPreference: string;
  notes?: string;
  isConfirmed: boolean;
  createdAt: string;
}

export interface RSVPStats {
  total: number;
  accepted: number;
  declined: number;
  pending: number;
  totalGuests: number;
}

export interface MediaAsset {
  id: string;
  userId: string;
  invitationId?: string;
  type: 'IMAGE' | 'VIDEO' | 'AUDIO';
  url: string;
  publicId: string;
  filename: string;
  size: number;
  mimeType: string;
  width?: number;
  height?: number;
  duration?: number;
  createdAt: string;
}
