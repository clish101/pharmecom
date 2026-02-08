import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Calendar, Package, Thermometer } from 'lucide-react';
import { format } from 'date-fns';
import { Order } from '@/data/orders';
import { getProductById } from '@/data/products';

interface OrderDetailDialogProps {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OrderDetailDialog({ order, open, onOpenChange }: OrderDetailDialogProps) {
  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span>{order.orderNumber}</span>
            <Badge variant={order.status}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Info */}
          <div className="grid sm:grid-cols-2 gap-4 p-4 rounded-lg bg-secondary/50">
            <div>
              <p className="text-sm text-muted-foreground">Order Date</p>
              <p className="font-medium">{format(new Date(order.createdAt), 'PPP')}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Last Updated</p>
              <p className="font-medium">{format(new Date(order.updatedAt), 'PPP')}</p>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Package className="h-4 w-4" />
              Order Items ({order.items.length})
            </h3>
            <div className="space-y-4">
              {order.items.map((item, index) => {
                const product = getProductById(item.productId);
                return (
                  <div 
                    key={index} 
                    className="p-4 rounded-lg border border-border bg-card"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium">{item.productName}</h4>
                        <p className="text-sm text-muted-foreground">
                          {item.doses.toLocaleString()} doses × {item.quantity} units
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          Delivery: {format(new Date(item.requestedDeliveryDate), 'MMM d, yyyy')}
                        </div>
                      </div>
                    </div>
                    
                    {product && (
                      <div className="grid sm:grid-cols-2 gap-3 pt-3 border-t border-border">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Brand</p>
                          <p className="text-sm">{product.brand}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Batch Number</p>
                          <p className="text-sm">{product.batchNumber}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Manufacturer</p>
                          <p className="text-sm">{product.manufacturer}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Species / Type</p>
                          <p className="text-sm capitalize">{product.species} / {product.type}</p>
                        </div>
                        <div className="sm:col-span-2">
                          <p className="text-xs text-muted-foreground mb-1">Active Ingredients</p>
                          <p className="text-sm">{product.activeIngredients}</p>
                        </div>
                        {product.coldChainRequired && (
                          <div className="sm:col-span-2 flex items-center gap-2 text-cold-chain">
                            <Thermometer className="h-4 w-4" />
                            <span className="text-sm">Cold Chain Required ({product.storageTempRange})</span>
                          </div>
                        )}
                        {product.administrationNotes && (
                          <div className="sm:col-span-2">
                            <p className="text-xs text-muted-foreground mb-1">Administration Notes</p>
                            <p className="text-sm">{product.administrationNotes}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="p-4 rounded-lg bg-secondary/50">
              <p className="text-sm font-medium mb-1">Order Notes</p>
              <p className="text-sm text-muted-foreground">{order.notes}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}