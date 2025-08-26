import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ProductCard } from '@/components/product-card';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import type { Product, Category } from '@shared/schema';
import { useState } from 'react';

export default function Home() {
  const [email, setEmail] = useState('');
  const { toast } = useToast();

  const { data: products = [], isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });

  const { data: categories = [], isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  const featuredProducts = products.slice(0, 6);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      await apiRequest('POST', '/api/newsletter', { email });
      toast({
        title: "Success!",
        description: "You've been subscribed to our newsletter.",
      });
      setEmail('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to subscribe. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-warm-beige py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-charcoal leading-tight">
                Premium Lifestyle Products for{' '}
                <span className="text-gray-600">Every Need</span>
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                Discover our carefully curated collection of organic feminine care, gaming accessories, 
                educational toys, and fitness gear designed for modern living.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/products">
                  <Button 
                    size="lg" 
                    className="bg-charcoal hover:bg-deep-charcoal w-full sm:w-auto"
                    data-testid="button-shop-now"
                  >
                    Shop Now
                  </Button>
                </Link>
                <Link href="/about">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="border-charcoal text-charcoal hover:bg-charcoal hover:text-white w-full sm:w-auto"
                    data-testid="button-learn-more"
                  >
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
                alt="Modern business showcase with premium products"
                className="rounded-2xl shadow-2xl w-full h-auto"
                data-testid="img-hero"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-charcoal mb-4">Our Product Categories</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our diverse range of premium products designed to enhance your lifestyle
            </p>
          </div>
          
          {categoriesLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-2xl h-80 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {categories.map((category) => (
                <Link 
                  key={category.id} 
                  href={`/products?category=${category.slug}`}
                  data-testid={`link-category-${category.slug}`}
                >
                  <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300">
                    <CardContent className={`p-8 text-center ${category.slug === 'feminine-care' || category.slug === 'kids-learning' ? 'bg-soft-beige' : 'bg-gray-100'}`}>
                      <img
                        src={category.image}
                        alt={category.description}
                        className="w-full h-48 object-cover rounded-xl mb-6"
                        data-testid={`img-category-${category.slug}`}
                      />
                      <h3 className="text-xl font-semibold text-charcoal mb-2">{category.name}</h3>
                      <p className="text-gray-600 mb-4">{category.description}</p>
                      <span className="inline-flex items-center text-charcoal font-medium group-hover:text-gray-600 transition-colors">
                        Shop Now <ArrowRight className="ml-2 h-4 w-4" />
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-charcoal mb-4">Featured Products</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Handpicked favorites from our collection
            </p>
          </div>
          
          {productsLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl h-96 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
          
          <div className="text-center mt-12">
            <Link href="/products">
              <Button 
                size="lg" 
                className="bg-charcoal hover:bg-deep-charcoal"
                data-testid="button-view-all-products"
              >
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
                alt="Professional modern office space with team collaboration and innovation"
                className="rounded-2xl shadow-lg w-full h-auto"
                data-testid="img-about"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-charcoal">About Innovora</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                At Innovora, we believe in enhancing lives through carefully curated, premium products. 
                Our diverse range spans from organic feminine care to cutting-edge gaming accessories, 
                educational toys, and fitness gear.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Founded on principles of quality, sustainability, and innovation, we're committed to 
                providing products that meet the diverse needs of modern families while maintaining 
                the highest standards of excellence.
              </p>
              <div className="grid grid-cols-2 gap-6 pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-charcoal mb-2" data-testid="text-stat-customers">10,000+</div>
                  <div className="text-gray-600">Happy Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-charcoal mb-2" data-testid="text-stat-products">500+</div>
                  <div className="text-gray-600">Premium Products</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-20 bg-soft-beige">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-charcoal mb-4">Stay Updated</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Get the latest updates on new products, exclusive offers, and wellness tips delivered to your inbox.
          </p>
          <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto flex gap-4">
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1"
              required
              data-testid="input-newsletter-email"
            />
            <Button 
              type="submit" 
              className="bg-charcoal hover:bg-deep-charcoal"
              data-testid="button-newsletter-submit"
            >
              Subscribe
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}
