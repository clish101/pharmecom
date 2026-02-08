import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Edit2, Trash2, Plus } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface DosePack {
  id: number;
  product: number;
  doses: number;
  units_per_pack: number;
  product_name?: string;
}

interface Product {
  id: number;
  name: string;
}

export default function AdminDosePacks() {
  const navigate = useNavigate();
  const [dosePacks, setDosePacks] = useState<DosePack[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editDoses, setEditDoses] = useState('');
  const [editUnitsPerPack, setEditUnitsPerPack] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/');
      return;
    }

    Promise.all([
      fetch('/api/dosepacks/', { headers: { 'Authorization': `Token ${token}` } }).then(r => r.json()),
      fetch('/api/products/', { headers: { 'Authorization': `Token ${token}` } }).then(r => r.json()),
    ])
      .then(([dosesData, productsData]) => {
        setDosePacks(Array.isArray(dosesData) ? dosesData : []);
        setProducts(Array.isArray(productsData) ? productsData : []);
        setLoading(false);
      })
      .catch((e) => {
        console.error('Error loading data:', e);
        setLoading(false);
      });
  }, [navigate]);

  const getProductName = (productId: number) => {
    return products.find(p => p.id === productId)?.name || 'Unknown Product';
  };

  const startEdit = (pack: DosePack) => {
    setEditingId(pack.id);
    setEditDoses(String(pack.doses));
    setEditUnitsPerPack(String(pack.units_per_pack));
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditDoses('');
    setEditUnitsPerPack('');
  };

  const saveEdit = async (packId: number) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/');
      return;
    }

    const doses = parseInt(editDoses);
    const units = parseInt(editUnitsPerPack);

    if (!doses || !units || doses <= 0 || units <= 0) {
      toast({
        title: 'Invalid input',
        description: 'Both doses and units must be greater than 0.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const res = await fetch(`/api/dosepacks/${packId}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
        body: JSON.stringify({
          doses,
          units_per_pack: units,
        }),
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error('Failed to update dose pack');
      }

      const updated = await res.json();
      setDosePacks(dosePacks.map(p => p.id === packId ? updated : p));
      setEditingId(null);
      toast({
        title: 'Success',
        description: 'Dose pack updated successfully.',
      });
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to update dose pack.',
        variant: 'destructive',
      });
    }
  };

  const deletePack = async (packId: number) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/');
      return;
    }

    if (!confirm('Are you sure you want to delete this dose pack?')) {
      return;
    }

    try {
      const res = await fetch(`/api/dosepacks/${packId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${token}`,
        },
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error('Failed to delete dose pack');
      }

      setDosePacks(dosePacks.filter(p => p.id !== packId));
      toast({
        title: 'Success',
        description: 'Dose pack deleted successfully.',
      });
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to delete dose pack.',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container-main py-8">
          <p>Loading dose packs...</p>
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
            <h1 className="font-heading text-3xl font-bold text-foreground">
              Manage Dose Packs
            </h1>
            <p className="text-muted-foreground">Edit and manage dose packs for all products</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Dose Packs ({dosePacks.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {dosePacks.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No dose packs found</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Doses</TableHead>
                      <TableHead>Units Per Pack</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dosePacks.map((pack) => (
                      <TableRow key={pack.id}>
                        <TableCell className="font-medium">
                          {getProductName(pack.product)}
                        </TableCell>
                        <TableCell>
                          {editingId === pack.id ? (
                            <Input
                              type="number"
                              value={editDoses}
                              onChange={(e) => setEditDoses(e.target.value)}
                              className="w-20"
                              min="1"
                            />
                          ) : (
                            pack.doses.toLocaleString()
                          )}
                        </TableCell>
                        <TableCell>
                          {editingId === pack.id ? (
                            <Input
                              type="number"
                              value={editUnitsPerPack}
                              onChange={(e) => setEditUnitsPerPack(e.target.value)}
                              className="w-20"
                              min="1"
                            />
                          ) : (
                            pack.units_per_pack.toLocaleString()
                          )}
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          {editingId === pack.id ? (
                            <>
                              <Button
                                size="sm"
                                variant="default"
                                onClick={() => saveEdit(pack.id)}
                              >
                                Save
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={cancelEdit}
                              >
                                Cancel
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => startEdit(pack)}
                                className="gap-2"
                              >
                                <Edit2 className="h-4 w-4" />
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => deletePack(pack.id)}
                                className="gap-2"
                              >
                                <Trash2 className="h-4 w-4" />
                                Delete
                              </Button>
                            </>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
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
