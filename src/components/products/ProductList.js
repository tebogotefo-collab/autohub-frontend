import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/select';
import { ChevronLeft, ChevronRight, Search, Package2, Filter } from 'lucide-react';
import { Badge } from '../ui/badge';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  
  // Categories and brands would typically come from an API
  const categories = [
    { id: 'brakes', name: 'Brakes & Brake Parts' },
    { id: 'engine', name: 'Engine Parts' },
    { id: 'suspension', name: 'Suspension & Steering' },
    { id: 'electrical', name: 'Electrical Parts' },
    { id: 'transmission', name: 'Transmission Parts' }
  ];
  
  const brands = [
    { id: 'bosch', name: 'Bosch' },
    { id: 'denso', name: 'Denso' },
    { id: 'continental', name: 'Continental' },
    { id: 'valeo', name: 'Valeo' },
    { id: 'ngk', name: 'NGK' }
  ];
  
  // Fetch products based on current filters and pagination
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        // This would be replaced with an actual API call
        // const response = await ProductService.getProducts({
        //   page: currentPage,
        //   pageSize: 12,
        //   search: searchQuery,
        //   category: selectedCategory,
        //   brand: selectedBrand
        // });
        
        // Simulated API response
        const mockProducts = Array.from({ length: 12 }, (_, i) => ({
          id: i + 1 + (currentPage * 12),
          title: `Auto Part ${i + 1}`,
          description: 'High-quality automotive part for optimal performance',
          price: Math.floor(Math.random() * 1000) + 100,
          brand: brands[Math.floor(Math.random() * brands.length)].name,
          category: categories[Math.floor(Math.random() * categories.length)].name,
          image: `https://placehold.co/300x200?text=Part+${i + 1}`,
          inStock: Math.random() > 0.3
        }));
        
        setProducts(mockProducts);
        setTotalPages(5); // Mock total pages
        setLoading(false);
      } catch (err) {
        setError('Failed to load products. Please try again later.');
        setLoading(false);
        console.error('Error fetching products:', err);
      }
    };
    
    fetchProducts();
  }, [currentPage, searchQuery, selectedCategory, selectedBrand]);
  
  // Handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  
  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(0); // Reset to first page when searching
  };
  
  // Handle filter changes
  const handleCategoryChange = (value) => {
    setSelectedCategory(value === 'all' ? '' : value);
    setCurrentPage(0);
  };
  
  const handleBrandChange = (value) => {
    setSelectedBrand(value === 'all' ? '' : value);
    setCurrentPage(0);
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-4 mb-4 text-sm rounded-lg bg-destructive/20 text-destructive">
        {error}
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <h1 className="text-2xl font-bold">Auto Parts</h1>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search parts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </form>
          
          <div className="flex gap-4">
            <Select value={selectedCategory} onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedBrand} onValueChange={handleBrandChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Brand" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Brands</SelectItem>
                {brands.map(brand => (
                  <SelectItem key={brand.id} value={brand.id}>
                    {brand.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      {/* Product Grid */}
      {products.length === 0 ? (
        <Card>
          <CardContent className="pt-6 flex items-center justify-center py-10">
            <div className="text-center">
              <Package2 className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <h3 className="text-lg font-medium mb-2">No products found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter criteria
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map(product => (
              <Card key={product.id} className="flex flex-col">
                <CardHeader className="p-0">
                  <div className="aspect-[4/3] relative overflow-hidden rounded-t-lg">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                    {!product.inStock && (
                      <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                        <Badge variant="destructive">Out of Stock</Badge>
                      </div>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="flex-grow p-4">
                  <CardTitle className="text-lg mb-2">{product.title}</CardTitle>
                  <CardDescription className="mb-2">{product.description}</CardDescription>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="secondary">{product.category}</Badge>
                    <Badge variant="outline">{product.brand}</Badge>
                  </div>
                  <div className="text-xl font-bold">R {product.price.toFixed(2)}</div>
                </CardContent>
                
                <CardFooter className="p-4 pt-0">
                  <Button asChild className="w-full" disabled={!product.inStock}>
                    <Link to={`/products/${product.id}`}>
                      {product.inStock ? 'View Details' : 'Out of Stock'}
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-8">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <div className="flex items-center space-x-2">
                {[...Array(totalPages).keys()].map(page => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                    className="h-8 w-8 p-0"
                  >
                    {page + 1}
                  </Button>
                ))}
              </div>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages - 1}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductList;
