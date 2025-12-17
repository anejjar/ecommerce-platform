'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit, Trash2, User, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

interface Cashier {
  id: string;
  employeeId: string | null;
  isActive: boolean;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
  location: {
    id: string;
    name: string;
  };
}

interface Location {
  id: string;
  name: string;
}

interface User {
  id: string;
  name: string | null;
  email: string;
  role: string;
}

export default function CashiersPage() {
  const [cashiers, setCashiers] = useState<Cashier[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCashier, setEditingCashier] = useState<Cashier | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    userId: '',
    locationId: '',
    employeeId: '',
    pin: '',
    isActive: true,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [cashiersRes, locationsRes, usersRes] = await Promise.all([
        fetch('/api/pos/cashiers'),
        fetch('/api/pos/locations'),
        fetch('/api/pos/users?role=ADMIN,SUPERADMIN,MANAGER'),
      ]);

      if (cashiersRes.ok) {
        const cashiersData = await cashiersRes.json();
        setCashiers(cashiersData || []);
      }

      if (locationsRes.ok) {
        const locationsData = await locationsRes.json();
        setLocations(locationsData || []);
      }

      if (usersRes.ok) {
        const usersData = await usersRes.json();
        // Handle both array response and object with users property
        setUsers(Array.isArray(usersData) ? usersData : usersData?.users || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDialog = (cashier?: Cashier) => {
    if (cashier) {
      setEditingCashier(cashier);
      setFormData({
        userId: cashier.user.id,
        locationId: cashier.location.id,
        employeeId: cashier.employeeId || '',
        pin: '',
        isActive: cashier.isActive,
      });
    } else {
      setEditingCashier(null);
      setFormData({
        userId: '',
        locationId: '',
        employeeId: '',
        pin: '',
        isActive: true,
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingCashier(null);
    setFormData({
      userId: '',
      locationId: '',
      employeeId: '',
      pin: '',
      isActive: true,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.userId || !formData.locationId) {
      toast.error('Please select a user and location');
      return;
    }

    setIsSubmitting(true);

    try {
      const url = editingCashier
        ? `/api/pos/cashiers/${editingCashier.id}`
        : '/api/pos/cashiers';
      const method = editingCashier ? 'PATCH' : 'POST';

      const body: any = {
        userId: formData.userId,
        locationId: formData.locationId,
        employeeId: formData.employeeId || null,
        isActive: formData.isActive,
      };

      if (formData.pin) {
        body.pin = formData.pin;
      }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        toast.success(
          editingCashier ? 'Cashier updated successfully' : 'Cashier created successfully'
        );
        fetchData();
        handleCloseDialog();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to save cashier');
      }
    } catch (error) {
      console.error('Error saving cashier:', error);
      toast.error('An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this cashier?')) {
      return;
    }

    try {
      const response = await fetch(`/api/pos/cashiers/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Cashier deleted successfully');
        fetchData();
      } else {
        toast.error('Failed to delete cashier');
      }
    } catch (error) {
      console.error('Error deleting cashier:', error);
      toast.error('An error occurred');
    }
  };

  // Filter out users who are already cashiers
  const availableUsers = users.filter(
    (user) => !cashiers.some((cashier) => cashier.user.id === user.id) || editingCashier?.user.id === user.id
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Cashiers</h1>
          <p className="text-muted-foreground mt-2">
            Manage cashier accounts for POS system
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="h-4 w-4 mr-2" />
          Add Cashier
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee ID</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  Loading...
                </TableCell>
              </TableRow>
            ) : cashiers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No cashiers found. Create your first cashier to get started.
                </TableCell>
              </TableRow>
            ) : (
              cashiers.map((cashier) => (
                <TableRow key={cashier.id}>
                  <TableCell className="font-medium">
                    {cashier.employeeId || 'N/A'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{cashier.user.name || 'N/A'}</div>
                        <div className="text-sm text-muted-foreground">{cashier.user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      {cashier.location.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={cashier.isActive ? 'default' : 'secondary'}>
                      {cashier.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {format(new Date(cashier.createdAt), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenDialog(cashier)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(cashier.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingCashier ? 'Edit Cashier' : 'Create New Cashier'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="userId">User *</Label>
                <Select
                  value={formData.userId}
                  onValueChange={(value) => setFormData({ ...formData, userId: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a user" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableUsers.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name || user.email} ({user.role})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  Select an admin or manager user to assign as cashier
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="locationId">Location *</Label>
                <Select
                  value={formData.locationId}
                  onValueChange={(value) => setFormData({ ...formData, locationId: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location.id} value={location.id}>
                        {location.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="employeeId">Employee ID</Label>
                <Input
                  id="employeeId"
                  value={formData.employeeId}
                  onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                  placeholder="EMP001"
                />
                <p className="text-sm text-muted-foreground">
                  Optional employee identification number
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pin">PIN</Label>
                <Input
                  id="pin"
                  type="password"
                  value={formData.pin}
                  onChange={(e) => setFormData({ ...formData, pin: e.target.value })}
                  placeholder="Leave empty to keep current PIN"
                />
                <p className="text-sm text-muted-foreground">
                  {editingCashier
                    ? 'Enter new PIN to update, or leave empty to keep current PIN'
                    : 'PIN for quick cashier login (4-6 digits recommended)'}
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isActive: checked })
                  }
                />
                <Label htmlFor="isActive" className="cursor-pointer">
                  Active Cashier
                </Label>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? 'Saving...'
                  : editingCashier
                  ? 'Update Cashier'
                  : 'Create Cashier'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

