import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Package, DollarSign, TrendingUp, ShoppingBag, Plus, ChevronRight } from 'lucide-react';

const SellerDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [metrics, setMetrics] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
    recentOrders: [],
    topProducts: []
  });
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // This would be replaced with actual API calls
        // const response = await SellerService.getDashboardMetrics();
        
        // Simulated API response
        const mockData = {
          totalSales: 15750.50,
          totalOrders: 45,
          totalProducts: 128,
          recentOrders: [
            {
              id: 1,
              orderNumber: 'ORD-2025-001',
              customerName: 'John Smith',
              total: 299.99,
              status: 'PROCESSING',
              date: '2025-05-15T10:30:00Z'
            },
            {
              id: 2,
              orderNumber: 'ORD-2025-002',
              customerName: 'Sarah Johnson',
              total: 549.99,
              status: 'PENDING_PAYMENT',
              date: '2025-05-15T09:15:00Z'
            },
            {
              id: 3,
              orderNumber: 'ORD-2025-003',
              customerName: 'Mike Brown',
              total: 199.99,
              status: 'SHIPPED',
              date: '2025-05-14T16:45:00Z'
            }
          ],
          topProducts: [
            {
              id: 1,
              name: 'Brake Pad Set',
              sku: 'BRK-001',
              sales: 24,
              revenue: 1199.76
            },
            {
              id: 2,
              name: 'Oil Filter',
              sku: 'FLT-002',
              sales: 42,
              revenue: 839.58
            },
            {
              id: 3,
              name: 'Spark Plug Set',
              sku: 'SPK-003',
              sales: 36,
              revenue: 719.64
            }
          ]
        };
        
        setMetrics(mockData);
        setLoading(false);
      } catch (err) {
        setError('Failed to load dashboard data');
        setLoading(false);
        console.error('Error fetching dashboard data:', err);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'PROCESSING':
        return 'default';
      case 'SHIPPED':
        return 'success';
      case 'PENDING_PAYMENT':
        return 'warning';
      case 'CANCELLED':
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
        <h1 className="text-2xl font-bold">Seller Dashboard</h1>
        <Button asChild>
          <Link to="/seller/products/new">
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </Link>
        </Button>
      </div>
      
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${metrics.totalSales.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.recentOrders.length} new today
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Products</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.topProducts.length} top sellers
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="orders" className="space-y-4">
        <TabsList>
          <TabsTrigger value="orders">Recent Orders</TabsTrigger>
          <TabsTrigger value="products">Top Products</TabsTrigger>
        </TabsList>
        
        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>
                Overview of your latest orders and their status.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics.recentOrders.map(order => (
                  <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <Link 
                        to={`/seller/orders/${order.id}`}
                        className="font-medium hover:underline"
                      >
                        {order.orderNumber}
                      </Link>
                      <div className="text-sm text-muted-foreground">
                        {order.customerName}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <Badge variant={getStatusBadgeVariant(order.status)}>
                        {order.status.replace('_', ' ')}
                      </Badge>
                      <div className="text-right">
                        <div className="font-medium">
                          ${order.total.toFixed(2)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(order.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <Button 
                asChild 
                variant="outline" 
                className="w-full mt-4"
              >
                <Link to="/seller/orders">
                  View All Orders
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Products</CardTitle>
              <CardDescription>
                Your best performing products by sales volume.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics.topProducts.map(product => (
                  <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <Link 
                        to={`/seller/products/${product.id}/edit`}
                        className="font-medium hover:underline"
                      >
                        {product.name}
                      </Link>
                      <div className="text-sm text-muted-foreground">
                        SKU: {product.sku}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-medium">
                        ${product.revenue.toFixed(2)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {product.sales} units sold
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <Button 
                asChild 
                variant="outline" 
                className="w-full mt-4"
              >
                <Link to="/seller/products">
                  Manage Products
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SellerDashboard;
