'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Edit, Trash2, Users, Award } from 'lucide-react';

interface LoyaltyTier {
  id: string;
  name: string;
  pointsRequired: number;
  color: string;
  icon: string | null;
  benefitsDescription: string;
  earlyAccessEnabled: boolean;
  earlyAccessHours: number;
  discountPercentage: number;
  pointsMultiplier: number;
  freeShippingThreshold: number | null;
  displayOrder: number;
  _count: {
    accounts: number;
  };
}

export default function LoyaltyTiersPage() {
  const [tiers, setTiers] = useState<LoyaltyTier[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTier, setEditingTier] = useState<LoyaltyTier | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    pointsRequired: 0,
    color: '#000000',
    icon: '',
    benefitsDescription: '',
    earlyAccessEnabled: false,
    earlyAccessHours: 24,
    discountPercentage: 0,
    pointsMultiplier: 1.0,
    freeShippingThreshold: '',
    displayOrder: 0,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchTiers();
  }, []);

  const fetchTiers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/loyalty/tiers');
      if (response.ok) {
        const data = await response.json();
        setTiers(data.tiers);
      }
    } catch (error) {
      console.error('Error fetching tiers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingTier(null);
    setFormData({
      name: '',
      pointsRequired: 0,
      color: '#000000',
      icon: '',
      benefitsDescription: '',
      earlyAccessEnabled: false,
      earlyAccessHours: 24,
      discountPercentage: 0,
      pointsMultiplier: 1.0,
      freeShippingThreshold: '',
      displayOrder: tiers.length,
    });
    setDialogOpen(true);
  };

  const handleEdit = (tier: LoyaltyTier) => {
    setEditingTier(tier);
    setFormData({
      name: tier.name,
      pointsRequired: tier.pointsRequired,
      color: tier.color,
      icon: tier.icon || '',
      benefitsDescription: tier.benefitsDescription,
      earlyAccessEnabled: tier.earlyAccessEnabled,
      earlyAccessHours: tier.earlyAccessHours,
      discountPercentage: Number(tier.discountPercentage),
      pointsMultiplier: Number(tier.pointsMultiplier),
      freeShippingThreshold: tier.freeShippingThreshold?.toString() || '',
      displayOrder: tier.displayOrder,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const url = editingTier
        ? `/api/admin/loyalty/tiers/${editingTier.id}`
        : '/api/admin/loyalty/tiers';

      const response = await fetch(url, {
        method: editingTier ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          freeShippingThreshold: formData.freeShippingThreshold
            ? parseFloat(formData.freeShippingThreshold)
            : null,
        }),
      });

      if (response.ok) {
        setDialogOpen(false);
        fetchTiers();
      }
    } catch (error) {
      console.error('Error saving tier:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (tierId: string) => {
    if (!confirm('Are you sure you want to delete this tier?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/loyalty/tiers/${tierId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchTiers();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete tier');
      }
    } catch (error) {
      console.error('Error deleting tier:', error);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Loyalty Tiers</h1>
          <p className="text-gray-600 mt-1">Manage tier structure and benefits</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Create Tier
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Tiers</CardTitle>
            <Award className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tiers.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tiers.reduce((sum, t) => sum + t._count.accounts, 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tiers Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Tiers</CardTitle>
          <CardDescription>Configure tier requirements and benefits</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tier</TableHead>
                  <TableHead>Points Required</TableHead>
                  <TableHead>Members</TableHead>
                  <TableHead>Early Access</TableHead>
                  <TableHead>Points Multiplier</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tiers.map((tier) => (
                  <TableRow key={tier.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge
                          style={{
                            backgroundColor: tier.color,
                            color: '#fff',
                          }}
                        >
                          {tier.name}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>{tier.pointsRequired.toLocaleString()}</TableCell>
                    <TableCell>{tier._count.accounts.toLocaleString()}</TableCell>
                    <TableCell>
                      {tier.earlyAccessEnabled ? (
                        <Badge variant="outline">{tier.earlyAccessHours}h</Badge>
                      ) : (
                        <span className="text-gray-400">Disabled</span>
                      )}
                    </TableCell>
                    <TableCell>{tier.pointsMultiplier}x</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(tier)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(tier.id)}
                          disabled={tier._count.accounts > 0}
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

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingTier ? 'Edit Tier' : 'Create Tier'}</DialogTitle>
            <DialogDescription>
              Configure tier requirements and benefits
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Tier Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Bronze, Silver, Gold"
                />
              </div>

              <div>
                <Label htmlFor="pointsRequired">Points Required</Label>
                <Input
                  id="pointsRequired"
                  type="number"
                  value={formData.pointsRequired}
                  onChange={(e) =>
                    setFormData({ ...formData, pointsRequired: parseInt(e.target.value) || 0 })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="color">Tier Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="color"
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-20"
                  />
                  <Input
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    placeholder="#000000"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="displayOrder">Display Order</Label>
                <Input
                  id="displayOrder"
                  type="number"
                  value={formData.displayOrder}
                  onChange={(e) =>
                    setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })
                  }
                />
              </div>
            </div>

            <div>
              <Label htmlFor="benefits">Benefits Description</Label>
              <Textarea
                id="benefits"
                value={formData.benefitsDescription}
                onChange={(e) =>
                  setFormData({ ...formData, benefitsDescription: e.target.value })
                }
                rows={3}
                placeholder="Describe the benefits of this tier..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="multiplier">Points Multiplier</Label>
                <Input
                  id="multiplier"
                  type="number"
                  step="0.1"
                  value={formData.pointsMultiplier}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      pointsMultiplier: parseFloat(e.target.value) || 1.0,
                    })
                  }
                />
                <p className="text-sm text-gray-500 mt-1">e.g., 1.5x points earned</p>
              </div>

              <div>
                <Label htmlFor="discount">Discount Percentage</Label>
                <Input
                  id="discount"
                  type="number"
                  value={formData.discountPercentage}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      discountPercentage: parseFloat(e.target.value) || 0,
                    })
                  }
                />
                <p className="text-sm text-gray-500 mt-1">% off all orders</p>
              </div>
            </div>

            <div className="flex items-center justify-between border rounded-lg p-4">
              <div className="space-y-0.5">
                <Label>Early Access</Label>
                <p className="text-sm text-gray-500">
                  Grant early access to flash sales and product launches
                </p>
              </div>
              <Switch
                checked={formData.earlyAccessEnabled}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, earlyAccessEnabled: checked })
                }
              />
            </div>

            {formData.earlyAccessEnabled && (
              <div>
                <Label htmlFor="earlyAccessHours">Early Access Hours</Label>
                <Input
                  id="earlyAccessHours"
                  type="number"
                  value={formData.earlyAccessHours}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      earlyAccessHours: parseInt(e.target.value) || 24,
                    })
                  }
                />
                <p className="text-sm text-gray-500 mt-1">
                  Hours before public launch
                </p>
              </div>
            )}

            <div>
              <Label htmlFor="freeShipping">Free Shipping Threshold ($)</Label>
              <Input
                id="freeShipping"
                type="number"
                step="0.01"
                value={formData.freeShippingThreshold}
                onChange={(e) =>
                  setFormData({ ...formData, freeShippingThreshold: e.target.value })
                }
                placeholder="Leave empty for no free shipping"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving || !formData.name}>
              {saving ? 'Saving...' : editingTier ? 'Update Tier' : 'Create Tier'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
