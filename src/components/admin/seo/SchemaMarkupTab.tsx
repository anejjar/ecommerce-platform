'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'react-hot-toast';
import { Plus, Edit, Trash2, Code2, Loader2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface SchemaMarkup {
  id: string;
  name: string;
  type: string;
  isActive: boolean;
  schemaData: string;
  applyToAll: boolean;
  targetPages?: string;
  priority: number;
  createdAt: string;
}

export function SchemaMarkupTab() {
  const [schemas, setSchemas] = useState<SchemaMarkup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSchemas();
  }, []);

  const fetchSchemas = async () => {
    try {
      const response = await fetch('/api/admin/seo/schema-markup');
      if (!response.ok) throw new Error('Failed to fetch schemas');
      const data = await response.json();
      setSchemas(data);
    } catch (error) {
      console.error('Error fetching schemas:', error);
      toast.error('Failed to load schema markups');
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/seo/schema-markup/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive }),
      });

      if (!response.ok) throw new Error('Failed to update schema');

      toast.success('Schema updated');
      fetchSchemas();
    } catch (error) {
      toast.error('Failed to update schema');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this schema markup?')) return;

    try {
      const response = await fetch(`/api/admin/seo/schema-markup/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete schema');

      toast.success('Schema deleted');
      fetchSchemas();
    } catch (error) {
      toast.error('Failed to delete schema');
    }
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
            <CardTitle>Structured Data (Schema.org)</CardTitle>
            <CardDescription>
              Add JSON-LD structured data to improve search engine understanding
            </CardDescription>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Schema
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg">
          <h4 className="font-semibold mb-2 text-blue-900 dark:text-blue-100">
            Schema Markup Templates
          </h4>
          <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
            Use these pre-built templates to quickly add structured data:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <Badge variant="outline">Organization</Badge>
            <Badge variant="outline">Product</Badge>
            <Badge variant="outline">Breadcrumb</Badge>
            <Badge variant="outline">FAQ</Badge>
            <Badge variant="outline">Article</Badge>
            <Badge variant="outline">Review</Badge>
            <Badge variant="outline">Local Business</Badge>
            <Badge variant="outline">Event</Badge>
          </div>
        </div>

        {schemas.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Code2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No schema markups configured yet</p>
            <p className="text-sm">Add structured data to help search engines understand your content</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Scope</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schemas.map((schema) => (
                <TableRow key={schema.id}>
                  <TableCell className="font-medium">{schema.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{schema.type.replace(/_/g, ' ')}</Badge>
                  </TableCell>
                  <TableCell>
                    {schema.applyToAll ? (
                      <Badge variant="default">All Pages</Badge>
                    ) : (
                      <Badge variant="outline">Specific Pages</Badge>
                    )}
                  </TableCell>
                  <TableCell>{schema.priority}</TableCell>
                  <TableCell>
                    <Switch
                      checked={schema.isActive}
                      onCheckedChange={() => toggleActive(schema.id, schema.isActive)}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(schema.id)}
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
