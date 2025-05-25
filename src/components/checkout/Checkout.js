import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OrderService from '../../services/orderService';
import AuthService from '../../services/authService';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { ShoppingCart, PackageCheck, Truck, CreditCard, AlertCircle } from 'lucide-react';

const Checkout = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [formData, setFormData] = useState({
    shippingAddress: '',
    shippingCity: '',
    shippingState: '',
    shippingZip: '',
    shippingCountry: 'South Africa',
    shippingMethod: 'Standard',
    paymentMethod: 'Credit Card',
    notes: ''
  });
  
  // Shipping method options
  const shippingMethods = [
    { value: 'Standard', label: 'Standard Shipping (3-5 days) - R75.00' },
    { value: 'Express', label: 'Express Shipping (1-2 days) - R150.00' },
    { value: 'Pickup', label: 'Store Pickup - Free' }
  ];
  
  // Payment method options
  const paymentMethods = [
    { value: 'Credit Card', label: 'Credit/Debit Card' },
    { value: 'EFT', label: 'EFT Bank Transfer' }
  ];
  
  // Load cart items from localStorage
  useEffect(() => {
    const loadCartItems = () => {
      try {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart);
          setCartItems(parsedCart);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error loading cart data:', err);
        setCartItems([]);
        setLoading(false);
      }
    };
    
    // Check if user is authenticated
    if (!AuthService.isAuthenticated()) {
      navigate('/login?redirect=checkout');
      return;
    }
    
    loadCartItems();
  }, [navigate]);
  
  // Calculate order summary values
  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };
  
  const getShippingCost = () => {
    switch (formData.shippingMethod) {
      case 'Express': return 150.00;
      case 'Pickup': return 0.00;
      default: return 75.00;
    }
  };
  
  const calculateTax = () => {
    // Calculate 15% VAT on subtotal
    return calculateSubtotal() * 0.15;
  };
  
  const calculateTotal = () => {
    return calculateSubtotal() + getShippingCost() + calculateTax();
  };
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (cartItems.length === 0) {
      alert('Your cart is empty');
      return;
    }
    
    try {
      setProcessing(true);
      
      // Create order request object
      const orderData = {
        items: cartItems.map(item => ({
          listingId: item.id,
          quantity: item.quantity
        })),
        shippingAddress: formData.shippingAddress,
        shippingCity: formData.shippingCity,
        shippingState: formData.shippingState,
        shippingZip: formData.shippingZip,
        shippingCountry: formData.shippingCountry,
        shippingMethod: formData.shippingMethod,
        paymentMethod: formData.paymentMethod,
        notes: formData.notes
      };
      
      // Call API to create order
      const createdOrder = await OrderService.createOrder(orderData);
      
      // Clear cart
      localStorage.removeItem('cart');
      
      // If payment method is Credit Card, redirect to payment page
      if (formData.paymentMethod === 'Credit Card') {
        const paymentResult = await OrderService.processPayment(createdOrder.id, {
          amount: createdOrder.total,
          currency: 'ZAR',
          description: `Payment for Order #${createdOrder.orderNumber}`
        });
        
        // Redirect to payment provider if URL is provided
        if (paymentResult.redirectUrl) {
          window.location.href = paymentResult.redirectUrl;
        } else {
          navigate(`/orders/${createdOrder.id}?status=success`);
        }
      } else {
        // For other payment methods, just redirect to order detail
        navigate(`/orders/${createdOrder.id}`);
      }
      
    } catch (err) {
      setProcessing(false);
      alert('Failed to create order. Please try again.');
      console.error('Error creating order:', err);
    }
  };
  
  if (loading) return (
    <div className="flex justify-center items-center py-12">
      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
    </div>
  );
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      
      {cartItems.length === 0 ? (
        <Card>
          <CardContent className="pt-6 py-10">
            <div className="text-center">
              <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Your cart is empty</h3>
              <p className="text-muted-foreground mb-4">
                Add some items to your cart to proceed with checkout.
              </p>
              <Button asChild>
                <a href="/shop">Browse Products</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-1 lg:col-span-2">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <Truck className="h-5 w-5 mr-2" /> 
                  Shipping Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="shippingAddress" className="text-sm font-medium">
                      Address *
                    </label>
                    <Input
                      id="shippingAddress"
                      name="shippingAddress"
                      value={formData.shippingAddress}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="shippingCity" className="text-sm font-medium">
                        City *
                      </label>
                      <Input
                        id="shippingCity"
                        name="shippingCity"
                        value={formData.shippingCity}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="shippingState" className="text-sm font-medium">
                        Province *
                      </label>
                      <Input
                        id="shippingState"
                        name="shippingState"
                        value={formData.shippingState}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="shippingZip" className="text-sm font-medium">
                        Postal Code *
                      </label>
                      <Input
                        id="shippingZip"
                        name="shippingZip"
                        value={formData.shippingZip}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="shippingCountry" className="text-sm font-medium">
                        Country *
                      </label>
                      <Input
                        id="shippingCountry"
                        name="shippingCountry"
                        value={formData.shippingCountry}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="shippingMethod" className="text-sm font-medium">
                      Shipping Method *
                    </label>
                    <Select
                      value={formData.shippingMethod}
                      onValueChange={(value) => handleInputChange({ target: { name: 'shippingMethod', value } })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select shipping method" />
                      </SelectTrigger>
                      <SelectContent>
                        {shippingMethods.map(method => (
                          <SelectItem key={method.value} value={method.value}>
                            {method.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="paymentMethod" className="text-sm font-medium">
                      Payment Method *
                    </label>
                    <Select
                      value={formData.paymentMethod}
                      onValueChange={(value) => handleInputChange({ target: { name: 'paymentMethod', value } })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        {paymentMethods.map(method => (
                          <SelectItem key={method.value} value={method.value}>
                            {method.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="notes" className="text-sm font-medium">
                      Order Notes (Optional)
                    </label>
                    <Textarea
                      id="notes"
                      name="notes"
                      rows="3"
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="Special instructions for delivery or other notes"
                    />
                    <p className="text-sm text-muted-foreground">
                      Special instructions for delivery or other notes.
                    </p>
                  </div>
                  
                  <Button
                    type="submit"
                    className="mt-4 w-full sm:w-auto"
                    size="lg"
                    disabled={processing}
                  >
                    {processing ? (
                      <>
                        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></span>
                        Processing...
                      </>
                    ) : (
                      <>Place Order<PackageCheck className="ml-2 h-4 w-4" /></>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items):</span>
                    <span className="text-sm font-medium">R {calculateSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Shipping:</span>
                    <span className="text-sm font-medium">R {getShippingCost().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Tax (15% VAT):</span>
                    <span className="text-sm font-medium">R {calculateTax().toFixed(2)}</span>
                  </div>
                  <div className="h-px my-3 bg-border"></div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total:</span>
                    <span className="font-semibold">R {calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Items in Cart ({cartItems.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {cartItems.map(item => (
                    <div key={item.id} className="py-3 px-6 flex justify-between items-center">
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-muted-foreground">
                          Qty: {item.quantity} × R {item.price.toFixed(2)}
                        </div>
                      </div>
                      <span className="font-medium">R {(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
