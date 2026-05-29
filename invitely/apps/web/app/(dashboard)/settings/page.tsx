'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/toast';
import { useAuthStore } from '@/store/auth.store';
import api from '@/lib/api';

export default function SettingsPage() {
  const { user, updateUser } = useAuthStore();
  const { toast } = useToast();
  const [name, setName] = useState(user?.name || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await api.patch('/auth/me', { name });
      updateUser({ name: res.data.name });
      toast({ title: 'Settings saved!' });
    } catch (err: any) {
      toast({ title: 'Error', description: err.response?.data?.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Account Settings</h1>
        <p className="text-zinc-500 mt-1">Manage your profile information</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <Label>Email</Label>
            <Input value={user?.email || ''} disabled className="opacity-60" />
            <p className="text-xs text-zinc-400 mt-1">Email cannot be changed</p>
          </div>
          <Button onClick={handleSave} disabled={saving} className="bg-amber-600 hover:bg-amber-700">
            {saving ? <><Loader2 size={14} className="animate-spin mr-1" /> Saving...</> : 'Save Changes'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
