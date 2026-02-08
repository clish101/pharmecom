import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart3, Package, Users, Calendar,
  AlertTriangle, ChevronRight, Download, Droplet
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AddProductForm } from '@/components/admin/AddProductForm';
import { sampleOrders } from '@/data/orders';
import { products } from '@/data/products';
import { format, startOfMonth, endOfMonth, eachMonthOfInterval, addMonths, isWithinInterval } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['hsl(210, 100%, 45%)', 'hsl(210, 80%, 55%)', 'hsl(210, 60%, 65%)', 'hsl(210, 40%, 75%)'];
export default function Admin() {
  const navigate = useNavigate();
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // Try twice with a short delay to avoid transient failures causing a redirect/flicker
        const attempt = async () => {
          const res = await fetch('/api/auth/user/', { credentials: 'include' });
          if (!mounted) return { ok: false, data: null };
          if (!res.ok) return { ok: false, data: null };
          const data = await res.json().catch(() => null);
          return { ok: true, data };
        };

        let result = await attempt();
        if (!result.ok || !result.data) {
          // wait and retry once
          await new Promise(r => setTimeout(r, 200));
          result = await attempt();
        }

        if (!mounted) return;
        if (!result.ok || !result.data || !result.data.is_staff) {
          setAuthorized(false);
          navigate('/', { replace: true });
          return;
        }
        setAuthorized(true);
      } catch (e) {
        if (!mounted) return;
        setAuthorized(false);
        navigate('/', { replace: true });
      }
    })();
    return () => { mounted = false; };
  }, [navigate]);

  if (authorized === null) {
    return (
      <Layout>
        <div className="container-main py-24 text-center">
          <p className="text-sm text-muted-foreground">Checking permissions…</p>
        </div>
      </Layout>
    );
  }
  const [forecastRange, setForecastRange] = useState('3');

  // Calculate forecast data
  const months = eachMonthOfInterval({
    start: new Date(),
    end: addMonths(new Date(), parseInt(forecastRange)),
  });

  const forecastData = months.map(month => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);
    
    const monthOrders = sampleOrders.flatMap(order => 
      order.items.filter(item => 
        isWithinInterval(new Date(item.requestedDeliveryDate), { start: monthStart, end: monthEnd })
      )
    );

    const totalQuantity = monthOrders.reduce((sum, item) => sum + item.quantity, 0);

    return {
      month: format(month, 'MMM yyyy'),
      orders: monthOrders.length,
      quantity: totalQuantity,
    };
  });

  // Product demand data
  const productDemand = products.slice(0, 5).map(product => {
    const orders = sampleOrders.flatMap(o => o.items.filter(i => i.productId === product.id));
    const totalQuantity = orders.reduce((sum, i) => sum + i.quantity, 0);
    return {
      name: product.name.split(' ').slice(0, 2).join(' '),
      quantity: totalQuantity,
    };
  });

  // Order status summary
  const statusSummary = [
    { name: 'Requested', value: sampleOrders.filter(o => o.status === 'requested').length, color: 'hsl(210, 100%, 50%)' },
    { name: 'Confirmed', value: sampleOrders.filter(o => o.status === 'confirmed').length, color: 'hsl(210, 80%, 45%)' },
    { name: 'Prepared', value: sampleOrders.filter(o => o.status === 'prepared').length, color: 'hsl(45, 93%, 47%)' },
    { name: 'Dispatched', value: sampleOrders.filter(o => o.status === 'dispatched').length, color: 'hsl(152, 69%, 40%)' },
  ];

  // Low stock products
  const lowStockProducts = products.filter(p => p.availableStock < 1000);

  // Expiring batches
  const expiringBatches = products.flatMap(p => 
    p.batches
      .filter(b => new Date(b.expiryDate) < addMonths(new Date(), 2))
      .map(b => ({ ...b, productName: p.name }))
  );

  return (
    <Layout>
      <div className="container-main py-8 lg:py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-heading text-3xl font-bold text-foreground mb-2">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">
              Order management and demand forecasting
            </p>
          </div>
          <div className="flex gap-3">
            <AddProductForm />
            <Button 
              variant="outline"
              onClick={() => navigate('/admin/dose-packs')}
              className="gap-2"
            >
              <Droplet className="h-4 w-4" />
              Manage Dose Packs
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="animate-slide-up">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Orders</p>
                  <p className="font-heading text-3xl font-bold">{sampleOrders.length}</p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Package className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-slide-up delay-100">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Pending Review</p>
                  <p className="font-heading text-3xl font-bold">
                    {sampleOrders.filter(o => o.status === 'requested').length}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-warning/10 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-slide-up delay-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Active Clients</p>
                  <p className="font-heading text-3xl font-bold">5</p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-success/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-slide-up delay-300">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Products</p>
                  <p className="font-heading text-3xl font-bold">
                    {products.length}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Package className="h-6 w-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="forecast" className="space-y-6">
          <TabsList>
            <TabsTrigger value="forecast" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Forecast
            </TabsTrigger>
            <TabsTrigger value="orders" className="gap-2">
              <Package className="h-4 w-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="inventory" className="gap-2">
              <AlertTriangle className="h-4 w-4" />
              Alerts
            </TabsTrigger>
          </TabsList>

          {/* Forecast Tab */}
          <TabsContent value="forecast" className="space-y-6">
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">Forecast range:</span>
              <Select value={forecastRange} onValueChange={setForecastRange}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 months</SelectItem>
                  <SelectItem value="6">6 months</SelectItem>
                  <SelectItem value="12">12 months</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Forecast Chart */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Demand Forecast by Month</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={forecastData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                        <XAxis dataKey="month" className="text-xs" />
                        <YAxis className="text-xs" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))', 
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }}
                        />
                          <Bar dataKey="quantity" fill="hsl(210, 100%, 50%)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Order Status Pie */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={statusSummary}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={80}
                          dataKey="value"
                        >
                          {statusSummary.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {statusSummary.map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <div 
                          className="h-3 w-3 rounded-full" 
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-muted-foreground">{item.name}</span>
                        <span className="font-medium ml-auto">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Product Demand Table */}
            <Card>
              <CardHeader>
                <CardTitle>Product Demand Forecast</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Product</th>
                        <th className="text-right py-3 px-4 font-medium text-muted-foreground">Ordered Qty</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productDemand.map((product, i) => (
                        <tr key={i} className="border-b border-border/50">
                          <td className="py-3 px-4 font-medium">{product.name}</td>
                          <td className="py-3 px-4 text-right">{product.quantity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-4">
            {sampleOrders.map((order) => (
              <Card key={order.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="font-heading font-semibold text-lg">
                          {order.orderNumber}
                        </h3>
                        <Badge variant={order.status}>{order.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {order.clientName} • {format(new Date(order.createdAt), 'MMM d, yyyy')}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {order.items.map((item, i) => (
                          <Badge key={i} variant="secondary" className="font-normal">
                            {item.productName} ({item.quantity}x)
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Button variant="outline" size="sm">
                        Manage
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Alerts Tab */}
          <TabsContent value="inventory" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Low Stock Alert */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-warning">
                    <AlertTriangle className="h-5 w-5" />
                    Low Stock Products
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {lowStockProducts.length > 0 ? (
                    <div className="space-y-3">
                      {lowStockProducts.map((product) => (
                        <div key={product.id} className="flex items-center justify-between p-3 rounded-lg bg-warning/5 border border-warning/20">
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-muted-foreground">{product.brand}</p>
                          </div>
                          <Badge variant="warning">{product.availableStock} units</Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">All products adequately stocked</p>
                  )}
                </CardContent>
              </Card>

              {/* Expiring Batches Alert */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-destructive">
                    <AlertTriangle className="h-5 w-5" />
                    Expiring Batches (60 days)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {expiringBatches.length > 0 ? (
                    <div className="space-y-3">
                      {expiringBatches.map((batch, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-destructive/5 border border-destructive/20">
                          <div>
                            <p className="font-medium">{batch.productName}</p>
                            <p className="text-sm text-muted-foreground">Batch: {batch.batchNumber}</p>
                          </div>
                          <div className="text-right">
                            <Badge variant="destructive">{format(new Date(batch.expiryDate), 'MMM d, yyyy')}</Badge>
                            <p className="text-xs text-muted-foreground mt-1">{batch.quantity} units</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">No batches expiring soon</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
