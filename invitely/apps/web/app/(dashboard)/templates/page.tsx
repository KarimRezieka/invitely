'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Crown, Eye, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';

interface Template {
  id: string;
  name: string;
  slug: string;
  description?: string;
  category: string;
  thumbnailUrl?: string;
  isPremium: boolean;
}

const CATEGORIES = ['All', 'LUXURY', 'MINIMAL', 'FLORAL', 'ARABIC', 'DARK', 'MODERN', 'RUSTIC', 'BEACH'];

export default function TemplatesPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (debouncedSearch) params.set('search', debouncedSearch);
    if (category !== 'All') params.set('category', category);

    api.get(`/templates?${params}`).then((res) => {
      setTemplates(res.data);
    }).catch(console.error).finally(() => setLoading(false));
  }, [debouncedSearch, category]);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Choose Your Template</h1>
        <p className="text-zinc-500 mt-1">Select a beautiful design to start building your invitation</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <Input
            placeholder="Search templates..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                category === cat
                  ? 'bg-amber-600 text-white'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700'
              }`}
            >
              {cat.charAt(0) + cat.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden animate-pulse">
              <div className="aspect-[3/4] bg-zinc-200 dark:bg-zinc-800" />
              <div className="p-3 space-y-2">
                <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4" />
                <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : templates.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">No templates found</h3>
          <p className="text-zinc-500">Try a different search or category</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <div
              key={template.id}
              className="group relative rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              {/* Thumbnail */}
              <div className="relative aspect-[3/4] overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                {template.thumbnailUrl ? (
                  <img
                    src={template.thumbnailUrl}
                    alt={template.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-6xl opacity-30">💍</span>
                  </div>
                )}

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-white border-white hover:bg-white hover:text-black"
                    onClick={() => router.push(`/inv/preview?template=${template.slug}`)}
                  >
                    <Eye size={14} className="mr-1" /> Preview
                  </Button>
                  <Button
                    size="sm"
                    className="bg-amber-500 hover:bg-amber-600"
                    onClick={() => router.push(`/invitations/new?template=${template.id}`)}
                  >
                    Use This
                  </Button>
                </div>

                {template.isPremium && (
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-amber-500 text-white gap-1 text-xs">
                      <Crown size={10} /> Premium
                    </Badge>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-3">
                <h3 className="font-semibold text-sm truncate text-zinc-900 dark:text-white">{template.name}</h3>
                <Badge variant="outline" className="text-xs mt-1 capitalize">
                  {template.category.toLowerCase()}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
