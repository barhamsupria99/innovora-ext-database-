import { Link } from 'wouter';
import { Facebook, Instagram, Twitter } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-16" style={{ backgroundColor: 'hsl(210 25% 7.8431%)' }}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-6 text-white">Innovora</h3>
            <p className="text-gray-200 mb-6 leading-relaxed">
              Premium lifestyle products for modern living. Quality, sustainability, and innovation in every product.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-200 hover:text-white transition-colors duration-200"
                data-testid="link-facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-200 hover:text-white transition-colors duration-200"
                data-testid="link-instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-200 hover:text-white transition-colors duration-200"
                data-testid="link-twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">Products</h4>
            <ul className="space-y-3 text-gray-200">
              <li>
                <Link href="/products?category=feminine-care" className="hover:text-white transition-colors duration-200">
                  Feminine Care
                </Link>
              </li>
              <li>
                <Link href="/products?category=gaming-tech" className="hover:text-white transition-colors duration-200">
                  Gaming & Tech
                </Link>
              </li>
              <li>
                <Link href="/products?category=kids-learning" className="hover:text-white transition-colors duration-200">
                  Kids Learning
                </Link>
              </li>
              <li>
                <Link href="/products?category=fitness-gear" className="hover:text-white transition-colors duration-200">
                  Fitness Gear
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">Company</h4>
            <ul className="space-y-3 text-gray-200">
              <li>
                <Link href="/about" className="hover:text-white transition-colors duration-200">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors duration-200">
                  Contact
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors duration-200">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors duration-200">
                  Press
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">Support</h4>
            <ul className="space-y-3 text-gray-200">
              <li>
                <a href="#" className="hover:text-white transition-colors duration-200">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors duration-200">
                  Shipping Info
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors duration-200">
                  Returns
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors duration-200">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-600 mt-12 pt-8 text-center">
          <p className="text-gray-200">&copy; 2024 Innovora. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
