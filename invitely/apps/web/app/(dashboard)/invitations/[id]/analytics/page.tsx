'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Loader2, Eye, Users, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import api from '@/lib/api';

interface AnalyticsData {
  totalViews: number;
  uniqueViews: number;
  rsvpConversionRate: number;
  avgDailyViews: string;
  viewsByDay: Array<{ date: string; views: number }>;
  topSources: Array<{ source: string; count: number }>;
  deviceBreakdown: Array<{ device: string; count: number }>;
}

export default function AnalyticsPage() {
  const params = useParams();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('30d');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get(`/analytics/${params.id}?period=${period}`)
      .then((res) => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [params.id, period]);

  const maxViews = data ? Math.max(...data.viewsByDay.map((d) => d.views), 1) : 1;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Analytics</h1>
          <p className="text-zinc-500 mt-1">Invitation performance insights</p>
        </div>
        <div className="flex gap-2">
          {(['7d', '30d', '90d'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                period === p ? 'bg-amber-600 text-white' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="animate-spin text-amber-600" size={32} />
        </div>
      ) : data ? (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Views', value: data.totalViews, icon: Eye },
              { label: 'Unique Views', value: data.uniqueViews, icon: Users },
              { label: 'RSVP Rate', value: `${data.rsvpConversionRate}%`, icon: TrendingUp },
              { label: 'Avg Daily Views', value: data.avgDailyViews, icon: Eye },
            ].map((kpi) => (
              <Card key={kpi.label}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-zinc-500">{kpi.label}</p>
                      <p className="text-2xl font-bold text-zinc-900 dark:text-white mt-1">{kpi.value}</p>
                    </div>
                    <kpi.icon className="text-amber-500 opacity-80" size={20} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Views by Day */}
            <Card>
              <CardHeader>
                <CardTitle>Views Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                {data.viewsByDay.length === 0 ? (
                  <p className="text-zinc-400 text-center py-8">No data yet</p>
                ) : (
                  <div className="flex items-end gap-1 h-32">
                    {data.viewsByDay.slice(-20).map((d) => (
                      <div key={d.date} className="flex flex-col items-center gap-1 flex-1">
                        <div
                          className="w-full rounded-t bg-amber-500 opacity-80 min-h-0.5"
                          style={{ height: `${(d.views / maxViews) * 100}%` }}
                          title={`${d.date}: ${d.views} views`}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Traffic Sources */}
            <Card>
              <CardHeader>
                <CardTitle>Traffic Sources</CardTitle>
              </CardHeader>
              <CardContent>
                {data.topSources.length === 0 ? (
                  <p className="text-zinc-400 text-center py-8">No data yet</p>
                ) : (
                  <div className="space-y-3">
                    {data.topSources.map(({ source, count }) => {
                      const pct = data.totalViews > 0 ? (count / data.totalViews) * 100 : 0;
                      return (
                        <div key={source}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="capitalize font-medium">{source}</span>
                            <span className="text-zinc-500">{count} ({pct.toFixed(0)}%)</span>
                          </div>
                          <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
                            <div className="h-full bg-amber-500 rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Device Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Device Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                {data.deviceBreakdown.length === 0 ? (
                  <p className="text-zinc-400 text-center py-8">No data yet</p>
                ) : (
                  <div className="space-y-3">
                    {data.deviceBreakdown.map(({ device, count }) => {
                      const pct = data.totalViews > 0 ? (count / data.totalViews) * 100 : 0;
                      return (
                        <div key={device}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="capitalize font-medium">{device}</span>
                            <span className="text-zinc-500">{count} ({pct.toFixed(0)}%)</span>
                          </div>
                          <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      ) : null}
    </div>
  );
}
