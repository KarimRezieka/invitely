'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Mail,
  Palette,
  Settings,
  CreditCard,
  LogOut,
  ShieldCheck,
  BarChart2,
  HelpCircle,
  ChevronRight,
} from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import api from '@/lib/api';

const NAV_SECTIONS = [
  {
    label: 'Main',
    items: [
      { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { href: '/invitations', icon: Mail, label: 'Invitations' },
      { href: '/templates', icon: Palette, label: 'Templates' },
    ],
  },
  {
    label: 'Insights',
    items: [
      { href: '/analytics', icon: BarChart2, label: 'Analytics' },
      { href: '/billing', icon: CreditCard, label: 'Billing' },
    ],
  },
  {
    label: 'Account',
    items: [
      { href: '/settings', icon: Settings, label: 'Settings' },
      { href: '/support', icon: HelpCircle, label: 'Support' },
    ],
  },
];

const PLAN_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  FREE: { bg: 'rgba(255,255,255,0.05)', text: 'var(--mist)', border: 'rgba(255,255,255,0.08)' },
  BASIC: { bg: 'rgba(201,168,76,0.1)', text: 'var(--gold-light)', border: 'rgba(201,168,76,0.2)' },
  PREMIUM: { bg: 'rgba(201,168,76,0.18)', text: 'var(--gold-light)', border: 'rgba(201,168,76,0.35)' },
};

function NavLink({
  href,
  icon: Icon,
  label,
  active,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`sidebar-link ${active ? 'active' : ''}`}
      style={{ justifyContent: 'space-between' }}
    >
      <span style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
        <Icon size={15} strokeWidth={active ? 2 : 1.7} />
        <span style={{ fontSize: '0.845rem' }}>{label}</span>
      </span>
      {active && <ChevronRight size={12} style={{ color: 'var(--gold-dim)', flexShrink: 0 }} />}
    </Link>
  );
}

export default function DashboardNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, clearAuth } = useAuthStore();

  const handleLogout = async () => {
    try { await api.post('/auth/logout'); } catch {}
    clearAuth();
    router.push('/login');
  };

  const plan = user?.subscription?.plan || 'FREE';
  const planStyle = PLAN_COLORS[plan] || PLAN_COLORS.FREE;
  const initials = user?.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || '?';
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';

  const isActive = (href: string) =>
    pathname === href || (href !== '/dashboard' && pathname.startsWith(href + '/'));

  return (
    <aside
      className="sidebar"
      style={{ width: 240, minWidth: 240, height: '100vh', display: 'flex', flexDirection: 'column', position: 'sticky', top: 0 }}
    >
      {/* Logo */}
      <div
        style={{
          padding: '1.375rem 1.5rem',
          borderBottom: '1px solid var(--ink-border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}
      >
        <Link href="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <div
            style={{
              width: 28, height: 28, borderRadius: 7,
              background: 'linear-gradient(135deg, var(--gold-dim), var(--gold))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--ink)', letterSpacing: '-0.02em' }}>I</span>
          </div>
          <span className="font-display" style={{ color: 'var(--gold-light)', fontSize: '1.2rem', letterSpacing: '-0.01em' }}>
            Invitely
          </span>
        </Link>
      </div>

      {/* Nav sections */}
      <nav style={{ flex: 1, padding: '1rem 0.75rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        {NAV_SECTIONS.map((section, si) => (
          <div key={section.label} style={{ marginBottom: si < NAV_SECTIONS.length - 1 ? '0.5rem' : 0 }}>
            <div style={{
              fontSize: '0.58rem', letterSpacing: '0.16em', textTransform: 'uppercase',
              color: 'var(--dust)', fontWeight: 600,
              padding: '0.5rem 0.625rem 0.375rem',
            }}>
              {section.label}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {section.items.map(({ href, icon, label }) => (
                <NavLink
                  key={href}
                  href={href}
                  icon={icon}
                  label={label}
                  active={isActive(href)}
                />
              ))}
            </div>
          </div>
        ))}

        {/* Admin section */}
        {isAdmin && (
          <div style={{ marginTop: 'auto' }}>
            <div style={{ height: 1, background: 'var(--ink-border)', margin: '0.75rem 0.5rem' }} />
            <NavLink href="/admin" icon={ShieldCheck} label="Admin Panel" active={pathname.startsWith('/admin')} />
          </div>
        )}
      </nav>

      {/* User profile card */}
      <div style={{ padding: '0.75rem' }}>
        <div
          style={{
            background: 'var(--ink-surface)',
            border: '1px solid var(--ink-border)',
            borderRadius: 10,
            padding: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          {/* Avatar */}
          <div
            style={{
              width: 36, height: 36, borderRadius: 9, flexShrink: 0,
              background: 'linear-gradient(135deg, var(--gold-dim), var(--gold))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.8rem', fontWeight: 700, color: 'var(--ink)',
              boxShadow: '0 0 0 2px rgba(201,168,76,0.2)',
            }}
          >
            {initials}
          </div>

          {/* Name + plan */}
          <div style={{ minWidth: 0, flex: 1 }}>
            <div
              style={{
                fontSize: '0.82rem', color: 'var(--champagne)', fontWeight: 500,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}
            >
              {user?.name || 'Guest'}
            </div>
            <span
              style={{
                display: 'inline-block', marginTop: 3,
                fontSize: '0.6rem', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600,
                background: planStyle.bg, color: planStyle.text, border: `1px solid ${planStyle.border}`,
                borderRadius: 999, padding: '1px 7px',
              }}
            >
              {plan}
            </span>
          </div>
        </div>
      </div>

      {/* Logout */}
      <div style={{ padding: '0 0.75rem 1rem' }}>
        <button
          onClick={handleLogout}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.625rem',
            width: '100%', padding: '0.575rem 0.75rem',
            background: 'none', border: '1px solid transparent',
            borderRadius: 8, cursor: 'pointer',
            fontSize: '0.8rem', color: 'var(--dust)',
            transition: 'color 0.2s, border-color 0.2s, background 0.2s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.color = '#E07070';
            e.currentTarget.style.borderColor = 'rgba(224,112,112,0.18)';
            e.currentTarget.style.background = 'rgba(224,112,112,0.05)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = 'var(--dust)';
            e.currentTarget.style.borderColor = 'transparent';
            e.currentTarget.style.background = 'none';
          }}
        >
          <LogOut size={14} strokeWidth={1.7} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
