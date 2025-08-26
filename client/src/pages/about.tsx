import { Card, CardContent } from '@/components/ui/card';
import { Users, Award, Leaf, Heart } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-warm-beige py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-charcoal mb-6">About Innovora</h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Enhancing lives through carefully curated, premium products that meet the diverse needs of modern families.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
                alt="Our team working together in a modern office"
                className="rounded-2xl shadow-lg w-full h-auto"
                data-testid="img-mission"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-charcoal">Our Mission</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                At Innovora, we believe that quality products should be accessible to everyone. Our mission is to 
                curate and provide premium lifestyle products that enhance daily life while maintaining the highest 
                standards of quality, sustainability, and customer satisfaction.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                From organic feminine care products to educational toys, gaming accessories, and fitness gear, 
                we carefully select each item in our catalog to ensure it meets our rigorous standards for 
                excellence and reliability.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-charcoal mb-4">Our Values</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do at Innovora
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center p-6">
              <CardContent className="space-y-4">
                <div className="bg-warm-beige rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                  <Award className="h-8 w-8 text-charcoal" />
                </div>
                <h3 className="text-xl font-semibold text-charcoal">Quality First</h3>
                <p className="text-gray-600">
                  We never compromise on quality. Every product is carefully selected and tested to meet our high standards.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="space-y-4">
                <div className="bg-soft-beige rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                  <Leaf className="h-8 w-8 text-charcoal" />
                </div>
                <h3 className="text-xl font-semibold text-charcoal">Sustainability</h3>
                <p className="text-gray-600">
                  We prioritize eco-friendly products and sustainable practices in everything we do.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="space-y-4">
                <div className="bg-warm-beige rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                  <Heart className="h-8 w-8 text-charcoal" />
                </div>
                <h3 className="text-xl font-semibold text-charcoal">Customer Care</h3>
                <p className="text-gray-600">
                  Our customers are at the heart of everything we do. We're committed to exceptional service.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="space-y-4">
                <div className="bg-soft-beige rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                  <Users className="h-8 w-8 text-charcoal" />
                </div>
                <h3 className="text-xl font-semibold text-charcoal">Community</h3>
                <p className="text-gray-600">
                  We believe in building strong communities and supporting causes that matter to our customers.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-charcoal mb-4">Our Impact</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Numbers that reflect our commitment to excellence and customer satisfaction
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-charcoal mb-2" data-testid="text-stat-customers">10,000+</div>
              <div className="text-gray-600">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-charcoal mb-2" data-testid="text-stat-products">500+</div>
              <div className="text-gray-600">Premium Products</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-charcoal mb-2" data-testid="text-stat-countries">25+</div>
              <div className="text-gray-600">Countries Served</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-charcoal mb-2" data-testid="text-stat-satisfaction">99%</div>
              <div className="text-gray-600">Customer Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-charcoal mb-6">Our Story</h2>
            </div>
            
            <div className="space-y-8 text-lg text-gray-600 leading-relaxed">
              <p>
                Innovora was founded in 2020 with a simple yet powerful vision: to make premium lifestyle products 
                accessible to families everywhere. What started as a small e-commerce venture has grown into a 
                trusted brand serving thousands of customers across multiple countries.
              </p>
              
              <p>
                Our founder recognized a gap in the market for truly diverse, high-quality products that could meet 
                the varied needs of modern families. From organic feminine care products to educational toys, gaming 
                accessories, and fitness equipment, we saw an opportunity to curate a collection that would serve 
                every member of the family.
              </p>
              
              <p>
                Today, we continue to expand our catalog while maintaining our commitment to quality, sustainability, 
                and customer satisfaction. Every product we add goes through rigorous testing and evaluation to ensure 
                it meets our high standards and provides real value to our customers.
              </p>
              
              <p>
                As we look to the future, we remain committed to our core values and our mission to enhance lives 
                through exceptional products and service. Thank you for being part of the Innovora family.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
