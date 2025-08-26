import { Link } from 'wouter';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/components/cart-provider';
import { useToast } from '@/hooks/use-toast';

export default function Cart() {
  const { items, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart();
  const { toast } = useToast();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-charcoal mb-8">Shopping Cart</h1>
          
          <Card>
            <CardContent className="text-center py-12">
              <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Your cart is empty</h3>
              <p className="text-gray-500 mb-6">Add some amazing products to get started!</p>
              <Link href="/products">
                <Button className="bg-charcoal hover:bg-deep-charcoal" data-testid="button-start-shopping">
                  Start Shopping
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const handleCheckout = () => {
    toast({
      title: "Checkout initiated",
      description: "Redirecting to checkout page...",
    });
    // In a real app, this would redirect to a payment processor
  };

  const handleClearCart = () => {
    clearCart();
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-charcoal">Shopping Cart</h1>
          <Button 
            variant="outline" 
            onClick={handleClearCart}
            data-testid="button-clear-cart"
          >
            Clear Cart
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.product.id}>
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-4 gap-4 items-center">
                    {/* Product Image & Info */}
                    <div className="md:col-span-2 flex gap-4">
                      <Link href={`/products/${item.product.id}`}>
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-20 h-20 object-cover rounded-lg"
                          data-testid={`img-cart-item-${item.product.id}`}
                        />
                      </Link>
                      <div>
                        <Link 
                          href={`/products/${item.product.id}`} 
                          className="font-semibold text-charcoal hover:text-gray-600"
                          data-testid={`link-cart-item-${item.product.id}`}
                        >
                          {item.product.name}
                        </Link>
                        <p className="text-sm text-gray-600 mt-1">
                          ${item.product.price} each
                        </p>
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        data-testid={`button-decrease-${item.product.id}`}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span 
                        className="w-12 text-center font-medium"
                        data-testid={`text-quantity-${item.product.id}`}
                      >
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        data-testid={`button-increase-${item.product.id}`}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Price & Remove */}
                    <div className="flex items-center justify-between">
                      <span 
                        className="font-bold text-charcoal"
                        data-testid={`text-item-total-${item.product.id}`}
                      >
                        ${(parseFloat(item.product.price) * item.quantity).toFixed(2)}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        data-testid={`button-remove-${item.product.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span data-testid="text-subtotal">${getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-600">
                    {getTotalPrice() >= 50 ? 'Free' : '$9.99'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span data-testid="text-tax">${(getTotalPrice() * 0.08).toFixed(2)}</span>
                </div>
                
                <Separator />
                
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span data-testid="text-total">
                    ${(getTotalPrice() + (getTotalPrice() >= 50 ? 0 : 9.99) + (getTotalPrice() * 0.08)).toFixed(2)}
                  </span>
                </div>

                {getTotalPrice() < 50 && (
                  <p className="text-sm text-gray-600">
                    Add ${(50 - getTotalPrice()).toFixed(2)} more for free shipping!
                  </p>
                )}

                <Button 
                  className="w-full bg-charcoal hover:bg-deep-charcoal"
                  size="lg"
                  onClick={handleCheckout}
                  data-testid="button-checkout"
                >
                  Proceed to Checkout
                </Button>

                <Link href="/products" className="block">
                  <Button variant="outline" className="w-full" data-testid="button-continue-shopping">
                    Continue Shopping
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
