import { Link } from 'react-router-dom';
import { Snowflake, Package, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Product } from '@/data/products';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const getStockStatus = () => {
    if (product.availableStock === 0) return 'destructive';
    if (product.availableStock < 10) return 'warning';
    return 'success';
  };

  const getDoseDisplay = () => {
    if (product.dosePacks && product.dosePacks.length > 0) {
      return product.dosePacks.map(pack => `${pack.doses} doses`).join(', ');
    }
    return `${product.availableStock} in stock`;
  };

  return (
    <Card className={cn("card-hover group overflow-hidden h-full flex flex-col", className)}>
      <CardContent className="p-0 flex flex-col h-full">
        {/* Image placeholder */}
        <div className="relative aspect-[4/3] bg-gradient-to-br from-muted to-secondary overflow-hidden flex-shrink-0">
          {product.image || (product.image_url && product.image_url !== '/placeholder.svg') ? (
            <img 
              src={product.image || product.image_url} 
              alt={product.image_alt || product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Package className="h-16 w-16 text-muted-foreground/30" />
            </div>
          )}
          
          {/* Badges overlay */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            {product.coldChainRequired && (
              <Badge variant="cold-chain" className="gap-1">
                <Snowflake className="h-3 w-3" />
                {product.storageTempRange}
              </Badge>
            )}
          </div>
          
          <div className="absolute top-3 right-3">
            <Badge variant={product.species}>{product.species}</Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          <div className="space-y-3 flex-1">
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">{product.brand}</p>
              <h3 className="font-heading font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                {product.name}
              </h3>
            </div>

            <p className="text-sm text-muted-foreground line-clamp-2">
              {product.description}
            </p>

            <div className="flex items-center gap-2">
              <Badge variant={product.type}>{product.type}</Badge>
              <Badge 
                variant="success"
                className="ml-auto"
              >
                {getDoseDisplay()}
              </Badge>
            </div>
          </div>

          <div className="flex items-center justify-end pt-2 border-t border-border mt-auto">
            <Link to={`/product/${product.id}`}>
              <Button size="sm" className="group/btn">
                View Details
                <ChevronRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" />
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
