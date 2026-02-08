import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';
import { formatDate } from 'date-fns';
import { Plus, ArrowLeft, Trash2, Edit2 } from 'lucide-react';
import api from '@/lib/api';

interface Batch {
  id: number;
  batch_number: string;
  product: number;
  expiry_date: string;
  quantity: number;
  quantity_reserved: number;
  available_quantity: number;
  storage_location: string;
  image_url?: string;
  image_alt?: string;
  created_at: string;
}

interface Product {
  id: number;
  name: string;
  brand: string;
  species: string;
}

interface EditingBatch {
  id: number;
  expiry_date: string;
  available_quantity: number;
}

export default function AdminProductBatches() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBatch, setEditingBatch] = useState<EditingBatch | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/');
      return;
    }

    Promise.all([
      fetch(`/api/products/${id}/`, { headers: { 'Authorization': `Token ${token}` } }).then(r => r.json()),
      fetch(`/api/batches/?product=${id}`, { headers: { 'Authorization': `Token ${token}` } }).then(r => r.json()),
    ])
      .then(([productData, batchesData]) => {
        setProduct(productData);
        const batchesList = Array.isArray(batchesData) ? batchesData : [];
        setBatches(batchesList);
        setLoading(false);
      })
      .catch((e) => {
        console.error('Error loading data:', e);
        toast({
          title: 'Error',
          description: 'Failed to load product and batches',
          variant: 'destructive',
        });
        setLoading(false);
      });
  }, [id, navigate]);

  const handleEditClick = (batch: Batch) => {
    setEditingBatch({
      id: batch.id,
      expiry_date: batch.expiry_date.split('T')[0],
      available_quantity: batch.available_quantity,
    });
  };

  const handleSaveEdit = async () => {
    if (!editingBatch) return;

    setSaving(true);
    const token = localStorage.getItem('authToken');

    try {
      // Update batch with new expiry date and recalculate quantity based on available_quantity
      const batch = batches.find(b => b.id === editingBatch.id);
      if (!batch) throw new Error('Batch not found');

      // Calculate new total quantity: available_quantity + reserved
      const newQuantity = editingBatch.available_quantity + batch.quantity_reserved;

      const res = await fetch(`/api/batches/${editingBatch.id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
        body: JSON.stringify({
          expiry_date: editingBatch.expiry_date,
          quantity: newQuantity,
        }),
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error('Failed to update batch');
      }

      // Update local state
      setBatches(
        batches.map(b =>
          b.id === editingBatch.id
            ? {
              ...b,
              expiry_date: editingBatch.expiry_date,
              quantity: newQuantity,
              available_quantity: editingBatch.available_quantity,
            }
            : b
        )
      );

      toast({
        title: 'Success',
        description: 'Batch updated successfully',
      });
      setEditingBatch(null);
    } catch (err: any) {
      console.error('Error saving batch:', err);
      toast({
        title: 'Error',
        description: err?.message || 'Failed to update batch',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteBatch = async (batchId: number) => {
    if (!confirm('Are you sure you want to delete this batch?')) return;

    const token = localStorage.getItem('authToken');

    try {
      const res = await fetch(`/api/batches/${batchId}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Token ${token}` },
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error('Failed to delete batch');
      }

      setBatches(batches.filter(b => b.id !== batchId));
      toast({
        title: 'Success',
        description: 'Batch deleted successfully',
      });
    } catch (err: any) {
      console.error('Error deleting batch:', err);
      toast({
        title: 'Error',
        description: err?.message || 'Failed to delete batch',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container-main py-8">
          <p>Loading...</p>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="container-main py-8">
          <p className="text-destructive">Product not found</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container-main py-8 lg:py-12">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate('/inventory')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="font-heading text-3xl font-bold text-foreground mb-2">
              Manage Batches
            </h1>
            <p className="text-muted-foreground">
              {product.name} ({product.brand})
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Batches ({batches.length})</CardTitle>
              <Button onClick={() => navigate(`/batch/new?product=${product.id}`)} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Batch
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {batches.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No batches found. Add one to get started.</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Batch #</TableHead>
                      <TableHead>Expiry Date</TableHead>
                      <TableHead className="text-right">Available Stock</TableHead>
                      <TableHead className="text-right">Reserved</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {batches.map((batch) => {
                      const isEditing = editingBatch?.id === batch.id;
                      const daysUntilExpiry = Math.floor(
                        (new Date(batch.expiry_date).getTime() - new Date().getTime()) /
                        (1000 * 60 * 60 * 24)
                      );

                      return (
                        <TableRow key={batch.id}>
                          <TableCell className="font-mono text-sm font-medium">
                            {batch.batch_number}
                          </TableCell>
                          <TableCell>
                            {isEditing ? (
                              <Input
                                type="date"
                                value={editingBatch!.expiry_date}
                                onChange={(e) =>
                                  setEditingBatch({
                                    ...editingBatch!,
                                    expiry_date: e.target.value,
                                  })
                                }
                                className="w-40"
                              />
                            ) : (
                              <div className="flex items-center gap-2">
                                {new Date(batch.expiry_date).toLocaleDateString()}
                                {daysUntilExpiry < 0 && (
                                  <Badge variant="destructive">Expired</Badge>
                                )}
                                {daysUntilExpiry < 180 && daysUntilExpiry >= 0 && (
                                  <Badge className="bg-orange-500">Expiring soon</Badge>
                                )}
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            {isEditing ? (
                              <Input
                                type="number"
                                value={editingBatch!.available_quantity}
                                onChange={(e) =>
                                  setEditingBatch({
                                    ...editingBatch!,
                                    available_quantity: Math.max(0, parseInt(e.target.value) || 0),
                                  })
                                }
                                className="w-32 text-right"
                                min="0"
                              />
                            ) : (
                              <div className="text-right font-semibold">
                                {batch.available_quantity}
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="text-right text-orange-600">
                            {batch.quantity_reserved}
                          </TableCell>
                          <TableCell className="text-right">{batch.quantity}</TableCell>
                          <TableCell>
                            {batch.available_quantity === 0 && (
                              <Badge variant="destructive">Out of Stock</Badge>
                            )}
                            {batch.available_quantity < 10 && batch.available_quantity > 0 && (
                              <Badge className="bg-orange-500">Low Stock</Badge>
                            )}
                            {batch.available_quantity >= 10 && (
                              <Badge variant="success">In Stock</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {batch.storage_location || '-'}
                          </TableCell>
                          <TableCell className="text-right">
                            {isEditing ? (
                              <div className="flex gap-2 justify-end">
                                <Button
                                  size="sm"
                                  variant="default"
                                  onClick={handleSaveEdit}
                                  disabled={saving}
                                >
                                  Save
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setEditingBatch(null)}
                                  disabled={saving}
                                >
                                  Cancel
                                </Button>
                              </div>
                            ) : (
                              <div className="flex gap-2 justify-end">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleEditClick(batch)}
                                >
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleDeleteBatch(batch.id)}
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
