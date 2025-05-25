import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Search, Car, Shield, Truck, Star } from 'lucide-react';

const Homepage = () => {
  // Featured categories
  const categories = [
    { id: 1, name: 'Engine Parts', image: 'https://placehold.co/200x200?text=Engine+Parts', slug: 'engine-parts' },
    { id: 2, name: 'Brake System', image: 'https://placehold.co/200x200?text=Brake+System', slug: 'brake-system' },
    { id: 3, name: 'Suspension', image: 'https://placehold.co/200x200?text=Suspension', slug: 'suspension' },
    { id: 4, name: 'Electrical', image: 'https://placehold.co/200x200?text=Electrical', slug: 'electrical' },
  ];
  
  // Featured brands
  const brands = [
    { id: 1, name: 'Toyota', logo: 'https://placehold.co/150x80?text=Toyota' },
    { id: 2, name: 'Honda', logo: 'https://placehold.co/150x80?text=Honda' },
    { id: 3, name: 'Ford', logo: 'https://placehold.co/150x80?text=Ford' },
    { id: 4, name: 'BMW', logo: 'https://placehold.co/150x80?text=BMW' },
    { id: 5, name: 'Mercedes', logo: 'https://placehold.co/150x80?text=Mercedes' },
    { id: 6, name: 'Volkswagen', logo: 'https://placehold.co/150x80?text=VW' },
  ];
  
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-muted py-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold mb-6">
            Find the Perfect Parts for Your Vehicle
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Browse our extensive collection of quality auto parts from trusted sellers.
          </p>
          
          <div className="flex justify-center space-x-4">
            <Button asChild size="lg">
              <Link to="/products">
                <Search className="mr-2 h-5 w-5" /> Browse Parts
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/my-garage">
                <Car className="mr-2 h-5 w-5" /> My Garage
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <Shield className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-lg font-medium mb-2">Quality Guaranteed</h3>
              <p className="text-muted-foreground">
                All parts are verified for quality and authenticity.
              </p>
            </div>
            
            <div className="text-center">
              <Truck className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-lg font-medium mb-2">Fast Shipping</h3>
              <p className="text-muted-foreground">
                Quick delivery with real-time tracking.
              </p>
            </div>
            
            <div className="text-center">
              <Star className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-lg font-medium mb-2">Trusted Sellers</h3>
              <p className="text-muted-foreground">
                Shop with confidence from verified sellers.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Categories Section */}
      <section className="py-16 px-4 bg-muted">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Popular Categories
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map(category => (
              <Link 
                key={category.id} 
                to={`/products?category=${category.slug}`}
                className="block group"
              >
                <Card className="overflow-hidden transition-all hover:border-primary">
                  <CardContent className="p-0">
                    <img 
                      src={category.image} 
                      alt={category.name}
                      className="w-full aspect-square object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="p-4">
                      <h3 className="font-medium text-center">{category.name}</h3>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* Brands Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Featured Brands
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {brands.map(brand => (
              <Link 
                key={brand.id} 
                to={`/products?brand=${brand.name.toLowerCase()}`}
                className="block group"
              >
                <div className="bg-muted rounded-lg p-4 flex items-center justify-center h-24 transition-colors hover:bg-muted/80">
                  <img 
                    src={brand.logo} 
                    alt={brand.name}
                    className="max-h-12 max-w-[120px] opacity-80 group-hover:opacity-100 transition-opacity"
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Start Selling with Us
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            Join our marketplace and reach thousands of customers looking for quality auto parts.
          </p>
          <Button asChild size="lg" variant="secondary">
            <Link to="/register?type=seller">
              Become a Seller
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Homepage;
