import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ShoppingBag, Shield, TrendingUp, Award } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-black text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Premium Refurbished Mobile Devices
            </h1>
            <p className="text-xl mb-8 text-gray-300">
              Get the latest smartphones, tablets, and accessories at unbeatable prices. 
              All devices come with quality guarantee.
            </p>
            <div className="flex gap-4">
              <Link to="/shop">
                <Button size="lg" className="text-lg">
                  Shop Now
                </Button>
              </Link>
              <Link to="/auth">
                <Button size="lg" variant="outline" className="text-lg border-white text-white hover:bg-white hover:text-black">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="font-bold mb-2">Quality Guaranteed</h3>
              <p className="text-sm text-muted-foreground">All devices thoroughly tested</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="font-bold mb-2">Top Brands</h3>
              <p className="text-sm text-muted-foreground">Apple, Samsung, Google & more</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="font-bold mb-2">Best Prices</h3>
              <p className="text-sm text-muted-foreground">Save up to 40% on retail</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="font-bold mb-2">Easy Shopping</h3>
              <p className="text-sm text-muted-foreground">Simple checkout process</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Shop by Category</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Link to="/shop" className="bg-card p-6 rounded-lg text-center hover:shadow-lg transition-shadow">
              <div className="text-6xl mb-4">📱</div>
              <h3 className="font-semibold">Mobile Phones</h3>
            </Link>

            <Link to="/shop" className="bg-card p-6 rounded-lg text-center hover:shadow-lg transition-shadow">
              <div className="text-6xl mb-4">💻</div>
              <h3 className="font-semibold">Tablets</h3>
            </Link>

            <Link to="/shop" className="bg-card p-6 rounded-lg text-center hover:shadow-lg transition-shadow">
              <div className="text-6xl mb-4">⌚</div>
              <h3 className="font-semibold">Watches</h3>
            </Link>

            <Link to="/shop" className="bg-card p-6 rounded-lg text-center hover:shadow-lg transition-shadow">
              <div className="text-6xl mb-4">🎧</div>
              <h3 className="font-semibold">Earphones</h3>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-black text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Find Your Perfect Device?</h2>
          <p className="text-xl mb-8 text-gray-300">Browse our collection of premium refurbished devices today</p>
          <Link to="/shop">
            <Button size="lg" className="text-lg">
              Browse All Products
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
