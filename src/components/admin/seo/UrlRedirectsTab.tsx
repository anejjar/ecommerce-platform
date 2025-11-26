'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'react-hot-toast';
import { Plus, Edit, Trash2, ExternalLink, Loader2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

interface UrlRedirect {
  id: string;
  fromPath: string;
  toPath: string;
  type: 'PERMANENT_301' | 'TEMPORARY_302';
  isActive: boolean;
  hitCount: number;
  notes?: string;
  createdAt: string;
}

export function UrlRedirectsTab() {
  const [redirects, setRedirects] = useState<UrlRedirect[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRedirect, setEditingRedirect] = useState<UrlRedirect | null>(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    fromPath: '',
    toPath: '',
    type: 'PERMANENT_301' as 'PERMANENT_301' | 'TEMPORARY_302',
    isActive: true,
    notes: '',
  });

  useEffect(() => {
    fetchRedirects();
  }, []);

  const fetchRedirects = async () => {
    try {
      const response = await fetch('/api/admin/seo/redirects');
      if (!response.ok) throw new Error('Failed to fetch redirects');
      const data = await response.json();
      setRedirects(data);
    } catch (error) {
      console.error('Error fetching redirects:', error);
      toast.error('Failed to load redirects');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = editingRedirect
        ? `/api/admin/seo/redirects/${editingRedirect.id}`
        : '/api/admin/seo/redirects';

      const method = editingRedirect ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save redirect');
      }

      toast.success(editingRedirect ? 'Redirect updated' : 'Redirect created');
      setDialogOpen(false);
      resetForm();
      fetchRedirects();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (redirect: UrlRedirect) => {
    setEditingRedirect(redirect);
    setFormData({
      fromPath: redirect.fromPath,
      toPath: redirect.toPath,
      type: redirect.type,
      isActive: redirect.isActive,
      notes: redirect.notes || '',
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this redirect?')) return;

    try {
      const response = await fetch(`/api/admin/seo/redirects/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete redirect');

      toast.success('Redirect deleted');
      fetchRedirects();
    } catch (error) {
      toast.error('Failed to delete redirect');
    }
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/seo/redirects/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive }),
      });

      if (!response.ok) throw new Error('Failed to update redirect');

      toast.success('Redirect updated');
      fetchRedirects();
    } catch (error) {
      toast.error('Failed to update redirect');
    }
  };

  const resetForm = () => {
    setFormData({
      fromPath: '',
      toPath: '',
      type: 'PERMANENT_301',
      isActive: true,
      notes: '',
    });
    setEditingRedirect(null);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>URL Redirects</CardTitle>
            <CardDescription>
              Manage 301 and 302 redirects for SEO and site restructuring
            </CardDescription>
          </div>
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Redirect
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingRedirect ? 'Edit Redirect' : 'Create Redirect'}
                </DialogTitle>
                <DialogDescription>
                  Create a URL redirect to preserve SEO when changing URLs
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="fromPath">From Path</Label>
                  <Input
                    id="fromPath"
                    value={formData.fromPath}
                    onChange={(e) => setFormData({ ...formData, fromPath: e.target.value })}
                    placeholder="/old-url"
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    The old URL path to redirect from
                  </p>
                </div>

                <div>
                  <Label htmlFor="toPath">To Path</Label>
                  <Input
                    id="toPath"
                    value={formData.toPath}
                    onChange={(e) => setFormData({ ...formData, toPath: e.target.value })}
                    placeholder="/new-url"
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    The new URL to redirect to
                  </p>
                </div>

                <div>
                  <Label htmlFor="type">Redirect Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: 'PERMANENT_301' | 'TEMPORARY_302') =>
                      setFormData({ ...formData, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PERMANENT_301">
                        301 - Permanent Redirect
                      </SelectItem>
                      <SelectItem value="TEMPORARY_302">
                        302 - Temporary Redirect
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    Use 301 for permanent changes, 302 for temporary
                  </p>
                </div>

                <div>
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Why this redirect was created..."
                    rows={2}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                  />
                  <Label htmlFor="isActive">Active</Label>
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={saving}>
                    {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    {editingRedirect ? 'Update' : 'Create'} Redirect
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {redirects.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <LinkIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No redirects configured yet</p>
            <p className="text-sm">Create your first redirect to get started</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>From</TableHead>
                <TableHead>To</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Hits</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {redirects.map((redirect) => (
                <TableRow key={redirect.id}>
                  <TableCell className="font-mono text-sm">{redirect.fromPath}</TableCell>
                  <TableCell className="font-mono text-sm max-w-xs truncate">
                    {redirect.toPath}
                  </TableCell>
                  <TableCell>
                    <Badge variant={redirect.type === 'PERMANENT_301' ? 'default' : 'secondary'}>
                      {redirect.type === 'PERMANENT_301' ? '301' : '302'}
                    </Badge>
                  </TableCell>
                  <TableCell>{redirect.hitCount}</TableCell>
                  <TableCell>
                    <Switch
                      checked={redirect.isActive}
                      onCheckedChange={() => toggleActive(redirect.id, redirect.isActive)}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(redirect)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(redirect.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
