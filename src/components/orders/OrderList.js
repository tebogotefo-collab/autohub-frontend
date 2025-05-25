import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import OrderService from '../../services/orderService';
import AuthService from '../../services/authService';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/select';
import { Button } from '../ui/button';
import { ChevronLeft, ChevronRight, Package, Calendar, Tag } from 'lucide-react';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState(null);
  
  const user = AuthService.getCurrentUser();
  const isSeller = user && user.role === 'SELLER';
  
  // Status options for filtering
  const statusOptions = [
    { value: null, label: 'All Orders' },
    { value: 'PENDING_PAYMENT', label: 'Pending Payment' },
    { value: 'PAYMENT_COMPLETED', label: 'Payment Completed' },
    { value: 'PROCESSING', label: 'Processing' },
    { value: 'SHIPPED', label: 'Shipped' },
    { value: 'DELIVERED', label: 'Delivered' },
    { value: 'CANCELLED', label: 'Cancelled' },
    { value: 'REFUNDED', label: 'Refunded' }
  ];
  
  // Fetch orders based on current filters and pagination
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const role = isSeller ? 'SELLER' : 'BUYER';
        const response = await OrderService.getOrders(currentPage, 10, selectedStatus, role);
        
        setOrders(response.content);
        setTotalPages(response.totalPages);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch orders. Please try again later.');
        setLoading(false);
        console.error('Error fetching orders:', err);
      }
    };
    
    fetchOrders();
  }, [currentPage, selectedStatus, isSeller]);
  
  // Handle status filter change
  const handleStatusChange = (value) => {
    setSelectedStatus(value === 'all' ? null : value);
    setCurrentPage(0); // Reset to first page when changing filters
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Pagination controls
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
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
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-2xl font-bold">{isSeller ? 'Seller Orders' : 'My Orders'}</h1>
        <div className="w-full sm:w-[240px]">
          <Select
            value={selectedStatus || ''}
            onValueChange={handleStatusChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map(option => (
                <SelectItem key={option.value || 'all'} value={option.value || 'all'}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {orders.length === 0 ? (
        <Card>
          <CardContent className="pt-6 flex items-center justify-center py-10">
            <div className="text-center">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <h3 className="text-lg font-medium mb-2">No orders found</h3>
              <p className="text-muted-foreground">
                {!selectedStatus ? 'You have no orders yet.' : 'Try changing your filter.'}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4">
            {orders.map(order => (
              <Card key={order.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg flex items-center">
                        Order #{order.orderNumber}
                      </CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        <Calendar className="h-3.5 w-3.5 mr-1.5" />
                        {formatDate(order.createdAt)}
                      </CardDescription>
                    </div>
                    <Badge variant={getStatusVariant(order.status)}>
                      {formatStatus(order.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-2">
                    <div className="flex items-center mb-3 sm:mb-0">
                      <Tag className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-xl font-semibold">R {order.total.toFixed(2)}</span>
                    </div>
                    <Link to={`/orders/${order.id}`}>
                      <Button variant="default" size="sm">View Details</Button>
                    </Link>
                  </div>
                </CardContent>
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

export default OrderList;
