import { Link } from 'wouter';
import { ShoppingCart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/components/cart-provider';
import { useToast } from '@/hooks/use-toast';
import type { Product } from '@shared/schema';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <Link href={`/products/${product.id}`}>
        <div className="aspect-square overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            data-testid={`img-product-${product.id}`}
          />
        </div>
        <CardContent className="p-6">
          <div className="mb-2">
            <Badge variant="secondary" className="mb-2">
              {product.category.split('-').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
              ).join(' ')}
            </Badge>
          </div>
          <h3 
            className="text-xl font-semibold text-charcoal mb-2 group-hover:text-gray-600 transition-colors"
            data-testid={`text-product-name-${product.id}`}
          >
            {product.name}
          </h3>
          <p 
            className="text-gray-600 mb-4 line-clamp-2"
            data-testid={`text-product-description-${product.id}`}
          >
            {product.description}
          </p>
          <div className="flex justify-between items-center">
            <span 
              className="text-2xl font-bold text-charcoal"
              data-testid={`text-product-price-${product.id}`}
            >
              ${product.price}
            </span>
            <Button
              onClick={handleAddToCart}
              className="bg-charcoal hover:bg-deep-charcoal"
              data-testid={`button-add-to-cart-${product.id}`}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
          </div>
          {product.inStock <= 5 && product.inStock > 0 && (
            <p className="text-sm text-orange-600 mt-2">
              Only {product.inStock} left in stock
            </p>
          )}
          {product.inStock === 0 && (
            <p className="text-sm text-red-600 mt-2">Out of stock</p>
          )}
        </CardContent>
      </Link>
    </Card>
  );
}
