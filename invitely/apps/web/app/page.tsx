import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-serif text-amber-700">Invitely</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors">
            Sign In
          </Link>
          <Link
            href="/register"
            className="bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors"
          >
            Get Started Free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-8 py-24 text-center">
        <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-sm font-medium mb-8 dark:bg-amber-900/20 dark:text-amber-400">
          <span>✨</span>
          <span>Premium Digital Wedding Invitations</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-serif text-zinc-900 dark:text-white mb-6 leading-tight">
          Craft Your Perfect
          <br />
          <span className="text-amber-600">Love Story</span>
        </h1>
        <p className="text-xl text-zinc-500 dark:text-zinc-400 mb-10 max-w-2xl mx-auto">
          Create stunning digital wedding invitations in minutes. Beautiful templates, RSVP management, and real-time analytics — all in one place.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/register"
            className="bg-amber-600 text-white px-8 py-4 rounded-xl text-base font-semibold hover:bg-amber-700 transition-colors shadow-lg shadow-amber-200 dark:shadow-amber-900/20"
          >
            Start Free — No Credit Card
          </Link>
          <Link
            href="/templates"
            className="border border-zinc-200 text-zinc-700 px-8 py-4 rounded-xl text-base font-medium hover:border-zinc-400 transition-colors dark:border-zinc-700 dark:text-zinc-300"
          >
            Browse Templates
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-8 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: '🎨',
              title: 'Beautiful Templates',
              desc: '20+ stunning designs — Luxury, Minimal, Floral, Arabic, and more.',
            },
            {
              icon: '📱',
              title: 'Mobile-First Design',
              desc: 'Your invitations look stunning on every device, guaranteed.',
            },
            {
              icon: '📊',
              title: 'RSVP & Analytics',
              desc: 'Manage guest responses in real-time with live analytics.',
            },
          ].map((f) => (
            <div key={f.title} className="p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800 hover:border-amber-200 dark:hover:border-amber-800 transition-colors">
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">{f.title}</h3>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-6xl mx-auto px-8 py-16">
        <h2 className="text-3xl font-serif text-center text-zinc-900 dark:text-white mb-12">Simple, Transparent Pricing</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { name: 'Free', price: '$0', features: ['1 invitation', '50 guests', 'Free templates', 'Basic RSVP'], cta: 'Start Free', href: '/register', highlight: false },
            { name: 'Basic', price: '$9/mo', features: ['3 invitations', '200 guests', 'All templates', 'CSV export'], cta: 'Get Basic', href: '/register', highlight: true },
            { name: 'Premium', price: '$19/mo', features: ['Unlimited invitations', 'Unlimited guests', 'Custom domain', 'Priority support'], cta: 'Get Premium', href: '/register', highlight: false },
          ].map((plan) => (
            <div
              key={plan.name}
              className={`p-6 rounded-2xl border-2 ${plan.highlight ? 'border-amber-500 shadow-lg shadow-amber-100 dark:shadow-amber-900/20' : 'border-zinc-100 dark:border-zinc-800'}`}
            >
              {plan.highlight && (
                <div className="text-xs font-bold text-amber-600 uppercase tracking-wide mb-2">Most Popular</div>
              )}
              <div className="text-2xl font-bold text-zinc-900 dark:text-white mb-1">{plan.name}</div>
              <div className="text-3xl font-serif text-amber-600 mb-6">{plan.price}</div>
              <ul className="space-y-2 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                    <span className="text-green-500">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link
                href={plan.href}
                className={`block text-center py-2.5 rounded-lg text-sm font-semibold transition-colors ${plan.highlight ? 'bg-amber-600 text-white hover:bg-amber-700' : 'border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-amber-400'}`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-100 dark:border-zinc-800 py-8 text-center text-sm text-zinc-400">
        <p>© 2025 Invitely. All rights reserved.</p>
      </footer>
    </main>
  );
}
