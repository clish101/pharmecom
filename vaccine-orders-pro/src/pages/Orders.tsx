import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Calendar, ChevronRight, Filter } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Order as FrontOrder, OrderStatus } from '@/data/orders';
import api from '@/lib/api';
import { OrderDetailDialog } from '@/components/orders/OrderDetailDialog';
import { format } from 'date-fns';

const statusOptions: { value: OrderStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All Orders' },
  { value: 'requested', label: 'Requested' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'prepared', label: 'Prepared' },
  { value: 'dispatched', label: 'Dispatched' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];

export default function Orders() {
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [selectedOrder, setSelectedOrder] = useState<FrontOrder | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [orders, setOrders] = useState<FrontOrder[]>([]);

  // load orders from backend
  useEffect(() => {
    api.fetchOrders()
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        // map backend order shape to frontend Order shape expected by OrderDetailDialog
        const mapped = list.map((o: any) => ({
          id: String(o.id),
          orderNumber: o.order_number,
          clientId: String(o.user || ''),
          clientName: (o.user && o.user.username) || 'You',
          items: (o.items || []).map((it: any) => ({
            productId: String(it.product || ''),
            productName: it.product_name || '',
            dosePackId: String(it.dose_pack || ''),
            doses: it.doses || 0,
            quantity: it.quantity || 0,
            unitPrice: Number(it.unit_price || 0),
            requestedDeliveryDate: it.requested_delivery_date,
          })),
          status: o.status,
          totalAmount: Number(o.total_amount || 0),
          createdAt: o.created_at,
          updatedAt: o.updated_at,
          notes: o.notes,
          internalNotes: o.internal_notes,
        }));
        setOrders(mapped as any);
      })
      .catch((e) => console.error('fetchOrders', e));
  }, []);

  const filteredOrders = statusFilter === 'all' ? orders : orders.filter(o => o.status === statusFilter);

  const handleViewDetails = (order: FrontOrder) => {
    setSelectedOrder(order);
    setDialogOpen(true);
  };

  return (
    <Layout>
      <div className="container-main py-8 lg:py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-heading text-3xl font-bold text-foreground mb-2">
              My Orders
            </h1>
            <p className="text-muted-foreground">
              Track and manage your vaccine orders
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as OrderStatus | 'all')}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length > 0 ? (
          <div className="space-y-4">
            {filteredOrders.map((order, index) => (
              <Card 
                key={order.id} 
                className="card-hover animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Order Info */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="font-heading font-semibold text-lg">
                          {order.orderNumber}
                        </h3>
                        <Badge variant={order.status}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Ordered: {format(new Date(order.createdAt), 'MMM d, yyyy')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Package className="h-4 w-4" />
                          {order.items.length} item{order.items.length > 1 ? 's' : ''}
                        </span>
                      </div>

                      {/* Items preview */}
                      <div className="flex flex-wrap gap-2 pt-1">
                        {order.items.slice(0, 3).map((item, i) => (
                          <Badge key={i} variant="secondary" className="font-normal">
                            {item.productName} ({item.quantity}x)
                          </Badge>
                        ))}
                        {order.items.length > 3 && (
                          <Badge variant="secondary" className="font-normal">
                            +{order.items.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Action */}
                    <Button variant="outline" size="sm" onClick={() => handleViewDetails(order)}>
                      View Details
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Delivery dates */}
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-sm font-medium text-foreground mb-2">Requested Delivery Dates</p>
                    <div className="flex flex-wrap gap-2">
                      {[...new Set(order.items.map(i => i.requestedDeliveryDate))].map((date, i) => (
                        <Badge key={i} variant="outline" className="gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(date), 'MMM d, yyyy')}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Package className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
              No orders found
            </h3>
            <p className="text-muted-foreground mb-4">
              {statusFilter === 'all' 
                ? "You haven't placed any orders yet."
                : `No orders with status "${statusFilter}" found.`}
            </p>
            <Link to="/catalog">
              <Button>Browse Catalog</Button>
            </Link>
          </div>
        )}

        {/* Order Detail Dialog */}
        <OrderDetailDialog 
          order={selectedOrder} 
          open={dialogOpen} 
          onOpenChange={setDialogOpen} 
        />
      </div>
    </Layout>
  );
}
