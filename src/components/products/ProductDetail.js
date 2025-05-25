import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ArrowLeft, Plus, Minus, ShoppingCart, Package2, Star } from 'lucide-react';

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  
  // Fetch product details
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        
        // This would be replaced with an actual API call
        // const response = await ProductService.getProduct(productId);
        
        // Simulated API response
        const mockProduct = {
          id: productId,
          title: 'Premium Brake Pad Set',
          description: 'High-performance brake pads designed for optimal stopping power and durability.',
          price: 599.99,
          brand: 'Bosch',
          category: 'Brakes & Brake Parts',
          sku: 'BP-2023-001',
          inStock: true,
          stockQuantity: 25,
          rating: 4.5,
          reviewCount: 128,
          image: 'https://placehold.co/600x400?text=Brake+Pad+Set',
          additionalImages: [
            'https://placehold.co/600x400?text=Image+1',
            'https://placehold.co/600x400?text=Image+2',
            'https://placehold.co/600x400?text=Image+3'
          ],
          specifications: [
            { name: 'Material', value: 'Ceramic Composite' },
            { name: 'Position', value: 'Front' },
            { name: 'Fitment Type', value: 'Direct Replacement' },
            { name: 'Warranty', value: '2 Years' }
          ],
          features: [
            'Advanced ceramic formula for superior braking performance',
            'Low dust production to keep wheels clean',
            'Engineered for reduced noise and vibration',
            'Includes hardware kit for complete installation',
            'Meets or exceeds OEM specifications'
          ],
          compatibleVehicles: [
            'Toyota Camry (2018-2023)',
            'Honda Accord (2018-2023)',
            'Mazda 6 (2018-2023)',
            'Hyundai Sonata (2019-2023)'
          ]
        };
        
        setProduct(mockProduct);
        setLoading(false);
      } catch (err) {
        setError('Failed to load product details. Please try again later.');
        setLoading(false);
        console.error('Error fetching product details:', err);
      }
    };
    
    fetchProductDetails();
  }, [productId]);
  
  // Handle quantity change
  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= (product?.stockQuantity || 1)) {
      setQuantity(newQuantity);
    }
  };
  
  // Handle add to cart
  const handleAddToCart = () => {
    try {
      setAddingToCart(true);
      
      // Get existing cart from localStorage
      const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
      
      // Check if item already exists in cart
      const existingItemIndex = existingCart.findIndex(item => item.id === product.id);
      
      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        existingCart[existingItemIndex].quantity += quantity;
      } else {
        // Add new item if it doesn't exist
        existingCart.push({
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
          quantity: quantity
        });
      }
      
      // Save updated cart back to localStorage
      localStorage.setItem('cart', JSON.stringify(existingCart));
      
      // Dispatch custom event for cart updates (for header cart indicator)
      window.dispatchEvent(new Event('cartUpdated'));
      
      // Navigate to cart
      navigate('/cart');
    } catch (err) {
      console.error('Error adding to cart:', err);
      alert('Failed to add item to cart. Please try again.');
    } finally {
      setAddingToCart(false);
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
  
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6 flex items-center justify-center py-10">
            <div className="text-center">
              <Package2 className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <h3 className="text-lg font-medium mb-2">Product not found</h3>
              <p className="text-muted-foreground mb-6">
                The product you're looking for doesn't exist or has been removed.
              </p>
              <Button onClick={() => navigate('/products')} variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Button 
        variant="ghost" 
        className="mb-6"
        onClick={() => navigate('/products')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
      </Button>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div>
          <Card>
            <CardContent className="p-4">
              <div className="aspect-[4/3] relative overflow-hidden rounded-lg mb-4">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
                {!product.inStock && (
                  <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                    <Badge variant="destructive" className="text-lg">Out of Stock</Badge>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                {product.additionalImages.map((image, index) => (
                  <div key={index} className="aspect-[4/3] overflow-hidden rounded-lg">
                    <img
                      src={image}
                      alt={`${product.title} - Image ${index + 2}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Product Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start gap-4">
                <div>
                  <CardTitle className="text-2xl">{product.title}</CardTitle>
                  <CardDescription className="mt-2">{product.description}</CardDescription>
                </div>
                <div className="flex items-center">
                  <Star className="h-4 w-4 fill-primary text-primary mr-1" />
                  <span className="font-medium">{product.rating}</span>
                  <span className="text-muted-foreground ml-1">({product.reviewCount})</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                <Badge variant="secondary">{product.category}</Badge>
                <Badge variant="outline">{product.brand}</Badge>
                {product.inStock ? (
                  <Badge variant="default">{product.stockQuantity} in stock</Badge>
                ) : (
                  <Badge variant="destructive">Out of Stock</Badge>
                )}
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="text-3xl font-bold mb-6">R {product.price.toFixed(2)}</div>
              
              {product.inStock && (
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center border rounded-md">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-10 w-10 rounded-none"
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      type="number"
                      min="1"
                      max={product.stockQuantity}
                      value={quantity}
                      onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                      className="w-16 text-center border-0"
                    />
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-10 w-10 rounded-none"
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={quantity >= product.stockQuantity}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <Button 
                    className="flex-1"
                    onClick={handleAddToCart}
                    disabled={addingToCart}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    {addingToCart ? 'Adding...' : 'Add to Cart'}
                  </Button>
                </div>
              )}
              
              <div className="text-sm text-muted-foreground">
                SKU: {product.sku}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <Tabs defaultValue="specifications">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="specifications">Specifications</TabsTrigger>
                  <TabsTrigger value="features">Features</TabsTrigger>
                  <TabsTrigger value="compatibility">Compatibility</TabsTrigger>
                </TabsList>
                
                <TabsContent value="specifications" className="mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    {product.specifications.map((spec, index) => (
                      <div key={index} className="border-b pb-2">
                        <div className="text-sm text-muted-foreground">{spec.name}</div>
                        <div className="font-medium">{spec.value}</div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="features" className="mt-4">
                  <ul className="list-disc list-inside space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </TabsContent>
                
                <TabsContent value="compatibility" className="mt-4">
                  <div className="grid gap-2">
                    {product.compatibleVehicles.map((vehicle, index) => (
                      <div key={index} className="p-2 bg-muted rounded-md">
                        {vehicle}
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
