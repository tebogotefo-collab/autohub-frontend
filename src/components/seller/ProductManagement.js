import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/select';
import { Badge } from '../ui/badge';
import { Plus, Search, Filter, Pencil, Trash2, AlertCircle } from 'lucide-react';

const ProductManagement = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Load products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        // This would be replaced with actual API calls
        // const response = await SellerService.getProducts();
        
        // Simulated API response
        const mockProducts = [
          {
            id: 1,
            title: 'Brake Pad Set',
            sku: 'BRK-001',
            category: 'Brake System',
            price: 49.99,
            stock: 45,
            status: 'ACTIVE',
            imageUrl: 'https://placehold.co/100x100?text=Brake+Pads'
          },
          {
            id: 2,
            title: 'Oil Filter',
            sku: 'FLT-002',
            category: 'Engine Parts',
            price: 19.99,
            stock: 120,
            status: 'ACTIVE',
            imageUrl: 'https://placehold.co/100x100?text=Oil+Filter'
          },
          {
            id: 3,
            title: 'Spark Plug Set',
            sku: 'SPK-003',
            category: 'Engine Parts',
            price: 19.99,
            stock: 0,
            status: 'OUT_OF_STOCK',
            imageUrl: 'https://placehold.co/100x100?text=Spark+Plugs'
          },
          {
            id: 4,
            title: 'Suspension Kit',
            sku: 'SUS-004',
            category: 'Suspension',
            price: 299.99,
            stock: 8,
            status: 'ACTIVE',
            imageUrl: 'https://placehold.co/100x100?text=Suspension+Kit'
          },
          {
            id: 5,
            title: 'Timing Belt Kit',
            sku: 'TBK-005',
            category: 'Engine Parts',
            price: 89.99,
            stock: 0,
            status: 'DISCONTINUED',
            imageUrl: 'https://placehold.co/100x100?text=Timing+Belt'
          }
        ];
        
        setProducts(mockProducts);
        setLoading(false);
      } catch (err) {
        setError('Failed to load products');
        setLoading(false);
        console.error('Error fetching products:', err);
      }
    };
    
    fetchProducts();
  }, []);
  
  // Handle product deletion
  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }
    
    try {
      // This would be replaced with an actual API call
      // await SellerService.deleteProduct(productId);
      
      // Update local state
      setProducts(prevProducts => prevProducts.filter(product => product.id !== productId));
    } catch (err) {
      alert('Failed to delete product. Please try again.');
      console.error('Error deleting product:', err);
    }
  };
  
  // Filter products based on search term and filters
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });
  
  // Get unique categories from products
  const categories = [...new Set(products.map(product => product.category))];
  
  // Get status badge variant
  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'success';
      case 'OUT_OF_STOCK':
        return 'warning';
      case 'DISCONTINUED':
        return 'destructive';
      default:
        return 'secondary';
    }
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Product Management</h1>
        <Button asChild>
          <Link to="/seller/products/new">
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </Link>
        </Button>
      </div>
      
      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or SKU"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            
            <Select
              value={categoryFilter}
              onValueChange={setCategoryFilter}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="OUT_OF_STOCK">Out of Stock</SelectItem>
                <SelectItem value="DISCONTINUED">Discontinued</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      
      {/* Products List */}
      {filteredProducts.length === 0 ? (
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-lg font-medium">No products found</h3>
              <p className="text-muted-foreground">
                {products.length === 0
                  ? 'Start by adding your first product'
                  : 'Try adjusting your search or filters'}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredProducts.map(product => (
            <Card key={product.id}>
              <CardContent className="p-4 flex items-center">
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className="w-16 h-16 object-cover rounded-lg mr-4"
                />
                
                <div className="flex-grow">
                  <div className="flex items-start justify-between">
                    <div>
                      <Link 
                        to={`/seller/products/${product.id}/edit`}
                        className="font-medium hover:underline"
                      >
                        {product.title}
                      </Link>
                      <div className="text-sm text-muted-foreground">
                        SKU: {product.sku}
                      </div>
                    </div>
                    
                    <Badge variant={getStatusBadgeVariant(product.status)}>
                      {product.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  
                  <div className="mt-2 flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      Category: {product.category} • Stock: {product.stock} units
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="font-medium">
                        ${product.price.toFixed(2)}
                      </div>
                      <Button 
                        asChild
                        variant="outline" 
                        size="sm"
                      >
                        <Link to={`/seller/products/${product.id}/edit`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
