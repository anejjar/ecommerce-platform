'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Plus, MoreVertical, Edit, Trash2, Eye, BarChart3 } from 'lucide-react';

interface Popup {
  id: string;
  name: string;
  type: string;
  target: string;
  isActive: boolean;
  position: string;
  createdAt: string;
  _count: {
    analytics: number;
  };
}

export default function PopupsPage() {
  const router = useRouter();
  const [popups, setPopups] = useState<Popup[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetchPopups();
  }, []);

  const fetchPopups = async () => {
    try {
      const response = await fetch('/api/admin/popups');
      if (!response.ok) throw new Error('Failed to fetch popups');
      const data = await response.json();
      setPopups(data);
    } catch (error) {
      console.error('Error fetching popups:', error);
      toast.error('Failed to load popups');
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (id: string, currentState: boolean) => {
    setUpdating(id);
    try {
      const response = await fetch(`/api/admin/popups/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentState }),
      });

      if (!response.ok) throw new Error('Failed to update popup');

      toast.success(`Popup ${!currentState ? 'activated' : 'deactivated'}`);
      fetchPopups();
    } catch (error) {
      console.error('Error updating popup:', error);
      toast.error('Failed to update popup');
    } finally {
      setUpdating(null);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/popups/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete popup');

      toast.success('Popup deleted successfully');
      fetchPopups();
    } catch (error) {
      console.error('Error deleting popup:', error);
      toast.error('Failed to delete popup');
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      EXIT_INTENT: 'Exit Intent',
      TIMED: 'Timed',
      SCROLL_BASED: 'Scroll Based',
      PAGE_LOAD: 'Page Load',
      CLICK_TRIGGER: 'Click Trigger',
    };
    return labels[type] || type;
  };

  const getTargetLabel = (target: string) => {
    const labels: Record<string, string> = {
      ALL_PAGES: 'All Pages',
      HOMEPAGE: 'Homepage',
      PRODUCT_PAGES: 'Products',
      CART_PAGE: 'Cart',
      CHECKOUT: 'Checkout',
      BLOG: 'Blog',
      CUSTOM_URL: 'Custom',
    };
    return labels[target] || target;
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Exit-Intent Popups</h1>
          <p className="text-muted-foreground mt-2">
            Create and manage popup overlays to capture leads and promote offers
          </p>
        </div>
        <Link href="/admin/popups/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Popup
          </Button>
        </Link>
      </div>

      {popups.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="space-y-4">
              <p className="text-muted-foreground">No popups created yet</p>
              <Link href="/admin/popups/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Popup
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>All Popups ({popups.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {popups.map((popup) => (
                  <TableRow key={popup.id}>
                    <TableCell className="font-medium">{popup.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{getTypeLabel(popup.type)}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{getTargetLabel(popup.target)}</Badge>
                    </TableCell>
                    <TableCell className="capitalize">{popup.position.toLowerCase().replace('_', ' ')}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={popup.isActive}
                          onCheckedChange={() => toggleActive(popup.id, popup.isActive)}
                          disabled={updating === popup.id}
                        />
                        <span className="text-sm text-muted-foreground">
                          {popup.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => router.push(`/admin/popups/${popup.id}`)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => router.push(`/admin/popups/${popup.id}/analytics`)}>
                            <BarChart3 className="w-4 h-4 mr-2" />
                            Analytics
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(popup.id, popup.name)}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
