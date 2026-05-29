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
} from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import api from '@/lib/api';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/invitations', icon: Mail, label: 'Invitations' },
  { href: '/templates', icon: Palette, label: 'Templates' },
  { href: '/billing', icon: CreditCard, label: 'Billing' },
  { href: '/settings', icon: Settings, label: 'Settings' },
];

function NavLink({ href, icon: Icon, label, active }: { href: string; icon: any; label: string; active: boolean }) {
  return (
    <Link href={href} className={`sidebar-link ${active ? 'active' : ''}`}>
      <Icon size={16} strokeWidth={1.8} />
      <span>{label}</span>
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

  const planLabel = user?.subscription?.plan || 'FREE';

  return (
    <aside className="sidebar" style={{ width: 232, minWidth: 232, height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Logo */}
      <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--ink-border)', display: 'flex', alignItems: 'center' }}>
        <Link href="/dashboard" style={{ textDecoration: 'none' }}>
          <span className="font-display" style={{ color: 'var(--gold-light)', fontSize: '1.35rem', letterSpacing: '-0.01em' }}>
            Invitely
          </span>
        </Link>
      </div>

      {/* Nav section label */}
      <div style={{ padding: '1.5rem 1rem 0.5rem' }}>
        <div style={{ fontSize: '0.6rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--dust)', fontWeight: 600, padding: '0 0.5rem' }}>
          Navigation
        </div>
      </div>

      {/* Nav links */}
      <nav style={{ flex: 1, padding: '0.25rem 0.75rem', overflowY: 'auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {navItems.map(({ href, icon, label }) => (
            <NavLink
              key={href}
              href={href}
              icon={icon}
              label={label}
              active={pathname === href || (href !== '/dashboard' && pathname.startsWith(href + '/'))}
            />
          ))}

          {(user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') && (
            <>
              <div style={{ height: '1px', background: 'var(--ink-border)', margin: '0.75rem 0.5rem' }} />
              <NavLink href="/admin" icon={ShieldCheck} label="Admin Panel" active={pathname.startsWith('/admin')} />
            </>
          )}
        </div>
      </nav>

      {/* Plan badge */}
      <div style={{ padding: '0.75rem 1rem' }}>
        <div style={{
          background: 'var(--ink-surface)',
          border: '1px solid var(--ink-border)',
          borderRadius: 8,
          padding: '0.75rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
        }}>
          <div style={{
            width: 34, height: 34, borderRadius: 8,
            background: 'linear-gradient(135deg, var(--gold-dim), var(--gold))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.85rem', fontWeight: 700, color: 'var(--ink)',
            flexShrink: 0,
          }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--champagne)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.name}
            </div>
            <div style={{ fontSize: '0.65rem', color: 'var(--gold-dim)', letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: 1 }}>
              {planLabel}
            </div>
          </div>
        </div>
      </div>

      {/* Logout */}
      <div style={{ padding: '0 0.75rem 1rem' }}>
        <button
          onClick={handleLogout}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.6rem',
            width: '100%', padding: '0.6rem 0.75rem',
            background: 'none', border: '1px solid transparent',
            borderRadius: 8, cursor: 'pointer',
            fontSize: '0.8rem', color: 'var(--dust)',
            transition: 'color 0.2s, border-color 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = '#E07070'; e.currentTarget.style.borderColor = 'rgba(224,112,112,0.2)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--dust)'; e.currentTarget.style.borderColor = 'transparent'; }}
        >
          <LogOut size={14} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
