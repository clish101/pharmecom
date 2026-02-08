import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Package, ChevronDown, Copy, CheckCircle, Clock, Truck, FileText, X } from 'lucide-react';
import { format } from 'date-fns';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { toast } from '@/hooks/use-toast';

interface OrderItem {
  id: number;
  product_name: string;
  quantity: number;
  doses: number;
  unit_price: number;
  requested_delivery_date: string;
  special_instructions?: string;
}

interface Order {
  id: string;
  orderNumber: string;
  items: OrderItem[];
  status: string;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  notes: string;
}

export default function OrderTracking() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchOrder, setSearchOrder] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setLoading(false);
      return;
    }

    fetch('/api/orders/', { headers: { 'Authorization': `Token ${token}` } })
      .then(r => r.json())
      .then(data => {
        const list = Array.isArray(data) ? data : [];
        const mapped = list.map((o: any) => ({
          id: String(o.id),
          orderNumber: o.order_number,
          items: (o.items || []).map((it: any) => ({
            id: it.id,
            product_name: it.product_name,
            quantity: it.quantity,
            doses: it.doses,
            unit_price: Number(it.unit_price),
            requested_delivery_date: it.requested_delivery_date,
            special_instructions: it.special_instructions,
          })),
          status: o.status,
          totalAmount: Number(o.total_amount),
          createdAt: o.created_at,
          updatedAt: o.updated_at,
          notes: o.notes,
        }));
        setOrders(mapped);
        setLoading(false);
      })
      .catch(e => {
        console.error('Error loading orders:', e);
        setLoading(false);
      });
  }, []);

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.orderNumber.toLowerCase().includes(searchOrder.toLowerCase());
    let matchesStatus = true;
    if (statusFilter) {
      if (statusFilter === 'pending') {
        matchesStatus = ['requested', 'confirmed', 'prepared'].includes(o.status);
      } else {
        matchesStatus = o.status === statusFilter;
      }
    }
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'requested': 'bg-blue-100 text-blue-800 hover:bg-blue-100',
      'confirmed': 'bg-green-100 text-green-800 hover:bg-green-100',
      'prepared': 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
      'dispatched': 'bg-orange-100 text-orange-800 hover:bg-orange-100',
      'delivered': 'bg-green-100 text-green-800 hover:bg-green-100',
      'cancelled': 'bg-red-100 text-red-800 hover:bg-red-100',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, any> = {
      'requested': <Clock className="h-4 w-4" />,
      'confirmed': <CheckCircle className="h-4 w-4" />,
      'prepared': <Package className="h-4 w-4" />,
      'dispatched': <Truck className="h-4 w-4" />,
      'delivered': <CheckCircle className="h-4 w-4" />,
      'cancelled': <FileText className="h-4 w-4" />,
    };
    return icons[status];
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Copied', description: 'Order number copied to clipboard' });
  };

  if (loading) {
    return (
      <Layout>
        <div className="container-main py-8">
          <p>Loading orders...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container-main py-8 lg:py-12">
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold text-foreground mb-2">
            Order Tracking
          </h1>
          <p className="text-muted-foreground">
            Track the status of your vaccine orders in real-time
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setStatusFilter(null)}
          >
            <CardContent className="p-4">
              <p className={`text-sm ${!statusFilter ? 'text-foreground font-semibold' : 'text-muted-foreground'}`}>Total Orders</p>
              <p className={`text-2xl font-bold ${!statusFilter ? 'text-blue-600' : ''}`}>{orders.length}</p>
            </CardContent>
          </Card>
          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setStatusFilter('pending')}
          >
            <CardContent className="p-4">
              <p className={`text-sm ${statusFilter === 'pending' ? 'text-foreground font-semibold' : 'text-muted-foreground'}`}>Pending</p>
              <p className={`text-2xl font-bold ${statusFilter === 'pending' ? 'text-yellow-600' : ''}`}>{orders.filter(o => ['requested', 'confirmed', 'prepared'].includes(o.status)).length}</p>
            </CardContent>
          </Card>
          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setStatusFilter('confirmed')}
          >
            <CardContent className="p-4">
              <p className={`text-sm ${statusFilter === 'confirmed' ? 'text-foreground font-semibold' : 'text-muted-foreground'}`}>Confirmed</p>
              <p className={`text-2xl font-bold ${statusFilter === 'confirmed' ? 'text-green-600' : ''}`}>{orders.filter(o => o.status === 'confirmed').length}</p>
            </CardContent>
          </Card>
          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setStatusFilter('dispatched')}
          >
            <CardContent className="p-4">
              <p className={`text-sm ${statusFilter === 'dispatched' ? 'text-foreground font-semibold' : 'text-muted-foreground'}`}>In Transit</p>
              <p className={`text-2xl font-bold ${statusFilter === 'dispatched' ? 'text-orange-600' : ''}`}>{orders.filter(o => o.status === 'dispatched').length}</p>
            </CardContent>
          </Card>
          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setStatusFilter('delivered')}
          >
            <CardContent className="p-4">
              <p className={`text-sm ${statusFilter === 'delivered' ? 'text-foreground font-semibold' : 'text-muted-foreground'}`}>Delivered</p>
              <p className={`text-2xl font-bold ${statusFilter === 'delivered' ? 'text-green-600' : ''}`}>{orders.filter(o => o.status === 'delivered').length}</p>
            </CardContent>
          </Card>
          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setStatusFilter('cancelled')}
          >
            <CardContent className="p-4">
              <p className={`text-sm ${statusFilter === 'cancelled' ? 'text-foreground font-semibold' : 'text-muted-foreground'}`}>Cancelled</p>
              <p className={`text-2xl font-bold ${statusFilter === 'cancelled' ? 'text-red-600' : ''}`}>{orders.filter(o => o.status === 'cancelled').length}</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="mb-6 flex items-center gap-4">
          <Input
            placeholder="Search by order number..."
            value={searchOrder}
            onChange={(e) => setSearchOrder(e.target.value)}
            className="max-w-md"
          />
          {statusFilter && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setStatusFilter(null)}
              className="gap-2"
            >
              <X className="h-4 w-4" />
              Clear Filter ({statusFilter})
            </Button>
          )}
        </div>

        {/* Orders */}
        {filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Package className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">No orders found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <Collapsible key={order.id} defaultOpen={filteredOrders.length === 1}>
                <Card>
                  <CollapsibleTrigger asChild>
                    <button className="w-full text-left">
                      <CardContent className="p-6 flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-heading font-semibold text-foreground">
                              Order {order.orderNumber}
                            </h3>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                copyToClipboard(order.orderNumber);
                              }}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            {format(new Date(order.createdAt), 'MMM dd, yyyy')} • {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                          </p>
                          <Badge className={getStatusColor(order.status)}>
                            {getStatusIcon(order.status)}
                            <span className="ml-1 capitalize">{order.status}</span>
                          </Badge>
                        </div>
                        <div className="text-right">
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </CardContent>
                    </button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="border-t border-border px-6 py-4 space-y-4">
                      {/* Timeline */}
                      <div className="space-y-2">
                        {[
                          { status: 'requested', label: 'Order Requested', icon: Clock },
                          { status: 'confirmed', label: 'Confirmed', icon: CheckCircle },
                          { status: 'prepared', label: 'Prepared', icon: Package },
                          { status: 'dispatched', label: 'Dispatched', icon: Truck },
                          { status: 'delivered', label: 'Delivered', icon: CheckCircle },
                        ].map((step, idx) => {
                          const isCompleted = ['requested', 'confirmed', 'prepared', 'dispatched', 'delivered'].indexOf(step.status) <=
                            ['requested', 'confirmed', 'prepared', 'dispatched', 'delivered'].indexOf(order.status);
                          const isCurrent = step.status === order.status;
                          const Icon = step.icon;

                          return (
                            <div key={idx} className="flex gap-4">
                              <div className="flex flex-col items-center">
                                <div className={`rounded-full p-2 ${isCompleted ? 'bg-green-100 text-green-600' : isCurrent ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
                                  <Icon className="h-4 w-4" />
                                </div>
                                {idx < 4 && <div className={`w-0.5 h-8 ${isCompleted ? 'bg-green-200' : 'bg-gray-200'}`} />}
                              </div>
                              <div className="pt-1 pb-4">
                                <p className={`font-medium ${isCompleted || isCurrent ? 'text-foreground' : 'text-muted-foreground'}`}>
                                  {step.label}
                                </p>
                                {isCurrent && (
                                  <p className="text-sm text-blue-600">{format(new Date(order.updatedAt), 'MMM dd, yyyy hh:mm a')}</p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Items */}
                      <div className="pt-4 border-t border-border">
                        <h4 className="font-semibold text-foreground mb-3">Items Ordered</h4>
                        <div className="space-y-2">
                          {order.items.map((item) => (
                            <div key={item.id} className="p-3 bg-muted/50 rounded">
                              <div className="flex justify-between text-sm mb-2">
                                <div>
                                  <p className="font-medium">{item.product_name}</p>
                                  <p className="text-xs text-muted-foreground">{item.doses} doses • Qty: {item.quantity}</p>
                                </div>
                              </div>
                              {item.special_instructions && (
                                <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-sm text-blue-900">
                                  <p className="font-medium text-blue-800 mb-1">Special Instructions:</p>
                                  <p>{item.special_instructions}</p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Delivery Date */}
                      {order.items.length > 0 && (
                        <div className="pt-4 border-t border-border">
                          <h4 className="font-semibold text-foreground mb-2">Requested Delivery</h4>
                          <p className="text-sm">
                            {format(new Date(order.items[0].requested_delivery_date), 'MMM dd, yyyy')}
                          </p>
                        </div>
                      )}

                      {/* Notes */}
                      {order.notes && (
                        <div className="pt-4 border-t border-border">
                          <h4 className="font-semibold text-foreground mb-2">Notes</h4>
                          <p className="text-sm text-muted-foreground">{order.notes}</p>
                        </div>
                      )}
                    </div>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
