import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import OrderService from '../../services/orderService';
import AuthService from '../../services/authService';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { ArrowLeft, Package, Calendar, Truck, CreditCard, FileText, CircleDollarSign, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from '../ui/dropdown-menu';

const OrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingAction, setProcessingAction] = useState(false);
  
  const user = AuthService.getCurrentUser();
  const isSeller = user && user.role === 'SELLER';
  
  // Fetch order details
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const orderData = await OrderService.getOrder(orderId);
        setOrder(orderData);
        setLoading(false);
      } catch (err) {
        setError('Failed to load order details. Please try again later.');
        setLoading(false);
        console.error('Error fetching order details:', err);
      }
    };
    
    fetchOrderDetails();
  }, [orderId]);
  
  // Handle order status update (for sellers)
  const handleStatusUpdate = async (newStatus) => {
    if (!window.confirm(`Are you sure you want to mark this order as ${newStatus.replace('_', ' ')}?`)) {
      return;
    }
    
    try {
      setProcessingAction(true);
      await OrderService.updateOrderStatus(orderId, newStatus);
      // Refresh order data
      const updatedOrder = await OrderService.getOrder(orderId);
      setOrder(updatedOrder);
      setProcessingAction(false);
    } catch (err) {
      alert('Failed to update order status. Please try again.');
      setProcessingAction(false);
      console.error('Error updating order status:', err);
    }
  };
  
  // Handle payment initiation (for buyers)
  const handlePaymentInitiate = async () => {
    try {
      setProcessingAction(true);
      const paymentResult = await OrderService.processPayment(orderId, {
        amount: order.total,
        currency: 'ZAR',
        description: `Payment for Order #${order.orderNumber}`
      });
      
      // Redirect to payment provider if URL is provided
      if (paymentResult.redirectUrl) {
        window.location.href = paymentResult.redirectUrl;
      } else {
        // Refresh order data
        const updatedOrder = await OrderService.getOrder(orderId);
        setOrder(updatedOrder);
        setProcessingAction(false);
      }
    } catch (err) {
      alert('Failed to initiate payment. Please try again.');
      setProcessingAction(false);
      console.error('Error initiating payment:', err);
    }
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-ZA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  if (loading) return (
    <div className="flex justify-center items-center py-12">
      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
    </div>
  );
  
  if (error) return (
    <div className="p-4 mb-4 text-sm rounded-lg bg-destructive/20 text-destructive">
      {error}
    </div>
  );
  
  if (!order) return (
    <div className="p-4 mb-4 text-sm rounded-lg bg-amber-100 text-amber-800">Order not found</div>
  );
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="mb-2"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Button>
          <h1 className="text-2xl font-bold">Order #{order.orderNumber}</h1>
        </div>
        
        {/* Order Actions for Buyer/Seller */}
        <div>
          {isSeller && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="w-full sm:w-auto" disabled={processingAction}>
                  Update Status
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {getAvailableStatusTransitions(order.status).map(status => (
                  <DropdownMenuItem 
                    key={status} 
                    onClick={() => handleStatusUpdate(status)}
                  >
                    {formatStatus(status)}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          
          {!isSeller && order.status === 'PENDING_PAYMENT' && (
            <Button 
              variant="default" 
              onClick={handlePaymentInitiate}
              disabled={processingAction}
            >
              Proceed to Payment
            </Button>
          )}
        </div>
      </div>
      
      {/* Order Status Banner */}
      <div className={`p-4 mb-6 rounded-lg bg-${getStatusBgColor(order.status)} flex flex-col sm:flex-row justify-between sm:items-center gap-3`}>
        <div className="flex items-center">
          <Badge variant={getStatusVariant(order.status)} className="mr-2 px-3 py-1">
            {formatStatus(order.status)}
          </Badge>
          {order.status === 'SHIPPED' && order.trackingNumber && (
            <span className="text-sm font-medium ml-4">
              Tracking: <span className="font-semibold">{order.trackingNumber}</span>
            </span>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Order Info */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Calendar className="mr-2 h-5 w-5" /> Order Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-3 gap-1">
              <div className="text-sm font-medium">Order Date:</div>
              <div className="text-sm col-span-2">{formatDate(order.createdAt)}</div>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <div className="text-sm font-medium">Last Updated:</div>
              <div className="text-sm col-span-2">{formatDate(order.updatedAt)}</div>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <div className="text-sm font-medium">Payment:</div>
              <div className="text-sm col-span-2">{order.paymentMethod || 'Not specified'}</div>
            </div>
            {order.notes && (
              <div className="mt-4 pt-4 border-t border-border">
                <div className="text-sm font-medium mb-1">Order Notes:</div>
                <div className="text-sm text-muted-foreground">{order.notes}</div>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Shipping Info */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Truck className="mr-2 h-5 w-5" /> Shipping Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-3 gap-1">
              <div className="text-sm font-medium">Method:</div>
              <div className="text-sm col-span-2">{order.shippingMethod}</div>
            </div>
            <div className="mt-4">
              <div className="text-sm font-medium mb-2">Delivery Address:</div>
              <div className="text-sm">
                {order.shippingAddress}<br />
                {order.shippingCity}, {order.shippingState} {order.shippingZip}<br />
                {order.shippingCountry}
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Price Summary */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <CreditCard className="mr-2 h-5 w-5" /> Order Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1.5 mb-4">
              <div className="flex justify-between">
                <span className="text-sm">Subtotal:</span>
                <span className="text-sm">R {order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Shipping:</span>
                <span className="text-sm">R {order.shippingCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Tax:</span>
                <span className="text-sm">R {(order.total - order.subtotal - order.shippingCost).toFixed(2)}</span>
              </div>
            </div>
            <div className="flex justify-between pt-3 border-t border-border">
              <span className="font-semibold">Total:</span>
              <span className="font-semibold">R {order.total.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Order Items */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <Package className="mr-2 h-5 w-5" /> Order Items ({order.items.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-medium text-muted-foreground">Product</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-muted-foreground">Seller</th>
                  <th className="py-3 px-4 text-center text-sm font-medium text-muted-foreground">Price</th>
                  <th className="py-3 px-4 text-center text-sm font-medium text-muted-foreground">Qty</th>
                  <th className="py-3 px-4 text-right text-sm font-medium text-muted-foreground">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {order.items.map(item => (
                  <tr key={item.id}>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        {item.listingImage && (
                          <div className="w-12 h-12 rounded border overflow-hidden mr-3 flex-shrink-0">
                            <img 
                              src={item.listingImage} 
                              alt={item.listingTitle} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div>
                          <div className="font-medium">{item.listingTitle}</div>
                          <div className="text-sm text-muted-foreground">{item.sku || 'No SKU'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm">{item.sellerName}</td>
                    <td className="py-3 px-4 text-center text-sm">R {item.price.toFixed(2)}</td>
                    <td className="py-3 px-4 text-center text-sm">{item.quantity}</td>
                    <td className="py-3 px-4 text-right text-sm font-medium">R {(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Helper function to get status background color
const getStatusBgColor = (status) => {
  switch (status) {
    case 'PENDING_PAYMENT': return 'amber-100 text-amber-800';
    case 'PAYMENT_COMPLETED': return 'blue-100 text-blue-800';
    case 'PROCESSING': return 'primary/10 text-primary';
    case 'SHIPPED': return 'blue-100 text-blue-800';
    case 'DELIVERED': return 'green-100 text-green-800';
    case 'CANCELLED': return 'destructive/10 text-destructive';
    case 'REFUNDED': return 'muted text-muted-foreground';
    default: return 'muted text-muted-foreground';
  }
};

// Helper to get badge variant based on status
const getStatusVariant = (status) => {
  switch (status) {
    case 'PENDING_PAYMENT': return 'warning';
    case 'PAYMENT_COMPLETED': return 'info';
    case 'PROCESSING': return 'default';
    case 'SHIPPED': return 'info';
    case 'DELIVERED': return 'success';
    case 'CANCELLED': return 'destructive';
    case 'REFUNDED': return 'secondary';
    default: return 'secondary';
  }
};

// Format status for display
const formatStatus = (status) => {
  return status.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase());
};

// Helper function to get available status transitions
const getAvailableStatusTransitions = (currentStatus) => {
  switch (currentStatus) {
    case 'PENDING_PAYMENT':
      return ['PAYMENT_COMPLETED', 'CANCELLED'];
    case 'PAYMENT_COMPLETED':
      return ['PROCESSING', 'REFUNDED', 'CANCELLED'];
    case 'PROCESSING':
      return ['SHIPPED', 'CANCELLED', 'REFUNDED'];
    case 'SHIPPED':
      return ['DELIVERED', 'CANCELLED', 'REFUNDED'];
    case 'DELIVERED':
      return ['REFUNDED'];
    default:
      return [];
  }
};

export default OrderDetail;
