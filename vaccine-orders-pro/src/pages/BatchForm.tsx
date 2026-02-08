import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';

export default function BatchForm(){
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const [form, setForm] = useState({ batch_number: '', product: '', expiry_date: '', quantity: 0, storage_location: '', image_url: '', image_alt: '' });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(()=>{
    const token = localStorage.getItem('authToken');
    if(!token){ navigate('/'); return; }

    Promise.all([
      fetch('/api/products/').then(r=>r.json()),
      id ? fetch(`/api/batches/${id}/`).then(r=>r.json()) : Promise.resolve(null)
    ])
    .then(([prods, batch])=>{
      setProducts(Array.isArray(prods)?prods:[]);
      if(batch){
        setForm({
          batch_number: batch.batch_number || '',
          product: String(batch.product || ''),
          expiry_date: batch.expiry_date ? batch.expiry_date.split('T')[0] : '',
          quantity: batch.quantity || 0,
          storage_location: batch.storage_location || '',
          image_url: batch.image_url || '',
          image_alt: batch.image_alt || ''
        });
        if(batch.image){
          setPreview(batch.image);
        } else if(batch.image_url){
          setPreview(batch.image_url);
        }
      }
      setLoading(false);
    })
    .catch(e=>{ console.error(e); toast({ title: 'Error', description: 'Failed loading data' }); setLoading(false); });
  }, [id, navigate]);

  async function handleSubmit(e: any){
    e.preventDefault();
    const token = localStorage.getItem('authToken');
    if(!token){ navigate('/'); return; }

    try{
      let res: Response;
      if(file){
        const fd = new FormData();
        fd.append('batch_number', form.batch_number);
        fd.append('product', String(Number(form.product)));
        fd.append('expiry_date', form.expiry_date);
        fd.append('quantity', String(Number(form.quantity)));
        fd.append('storage_location', form.storage_location);
        fd.append('image_alt', form.image_alt || '');
        fd.append('image', file);

        res = await fetch(id ? `/api/batches/${id}/` : `/api/batches/`, {
          method: id ? 'PUT' : 'POST',
          headers: { 'Authorization': `Token ${token}` },
          body: fd,
          credentials: 'include'
        });
      } else {
        const payload = { batch_number: form.batch_number, product: Number(form.product), expiry_date: form.expiry_date, quantity: Number(form.quantity), storage_location: form.storage_location, image_url: form.image_url, image_alt: form.image_alt };
        res = await fetch(id ? `/api/batches/${id}/` : `/api/batches/`, {
          method: id ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Token ${token}` },
          body: JSON.stringify(payload),
          credentials: 'include'
        });
      }

      if(!res.ok){
        const txt = await res.text();
        throw new Error(txt || 'Failed to save batch');
      }

      toast({ title: 'Saved', description: 'Batch saved successfully' });
      navigate('/inventory');
    }catch(err:any){
      console.error(err);
      toast({ title: 'Error', description: err?.message || 'Failed to save batch' });
    }
  }

  if(loading) return (
    <Layout><div className="container-main py-8">Loading...</div></Layout>
  );

  return (
    <Layout>
      <div className="container-main py-8">
        <Card>
          <CardHeader>
            <CardTitle>{id ? 'Edit Batch' : 'Add Batch'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 max-w-lg">
              <label>
                <div className="text-sm mb-1">Batch Number</div>
                <Input value={form.batch_number} onChange={e=>setForm({...form, batch_number: e.target.value})} />
              </label>

              <label>
                <div className="text-sm mb-1">Product</div>
                <Select value={form.product} onValueChange={v=>setForm({...form, product: v})}>
                  <SelectTrigger className="w-full"><SelectValue placeholder="Select product" /></SelectTrigger>
                  <SelectContent>
                    {products.map(p=> <SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </label>

              <label>
                <div className="text-sm mb-1">Expiry Date</div>
                <Input type="date" value={form.expiry_date} onChange={e=>setForm({...form, expiry_date: e.target.value})} />
              </label>

              <label>
                <div className="text-sm mb-1">Quantity</div>
                <Input type="number" value={String(form.quantity)} onChange={e=>setForm({...form, quantity: Number(e.target.value)})} />
              </label>

              <label>
                <div className="text-sm mb-1">Storage Location</div>
                <Input value={form.storage_location} onChange={e=>setForm({...form, storage_location: e.target.value})} />
              </label>

              <label>
                <div className="text-sm mb-1">Image URL (optional)</div>
                <Input value={form.image_url} placeholder="/images/batch.jpg or https://..." onChange={e=>setForm({...form, image_url: e.target.value})} />
              </label>

              <label>
                <div className="text-sm mb-1">Upload image (from device)</div>
                <input type="file" accept="image/*" onChange={(e:any)=>{ const f = e.target.files?.[0]; setFile(f||null); if(f){ setPreview(URL.createObjectURL(f)); } }} />
                {preview && <img src={preview} alt={form.image_alt || ''} className="h-24 w-24 object-cover mt-2 rounded" />}
              </label>

              <label>
                <div className="text-sm mb-1">Image alt text</div>
                <Input value={form.image_alt} onChange={e=>setForm({...form, image_alt: e.target.value})} />
              </label>

              <div className="flex gap-2">
                <Button type="submit">Save</Button>
                <Button variant="ghost" onClick={()=>navigate('/inventory')}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
