import apiClient from './api';

// Order Service - handles all order-related API calls
const OrderService = {
  // Get orders with pagination and optional filter by status
  getOrders: async (page = 0, size = 10, status = null, role = 'BUYER') => {
    const endpoint = role === 'SELLER' ? '/orders/seller' : '/orders/buyer';
    const params = { page, size, sortBy: 'createdAt', sortDir: 'DESC' };
    
    if (status) {
      params.status = status;
    }
    
    const response = await apiClient.get(endpoint, { params });
    return response.data;
  },
  
  // Get order details by ID
  getOrder: async (orderId) => {
    const response = await apiClient.get(`/orders/${orderId}`);
    return response.data;
  },
  
  // Create a new order
  createOrder: async (orderData) => {
    const response = await apiClient.post('/orders', orderData);
    return response.data;
  },
  
  // Update order status
  updateOrderStatus: async (orderId, status) => {
    const response = await apiClient.patch(`/orders/${orderId}/status`, { status });
    return response.data;
  },
  
  // Process payment for an order
  processPayment: async (orderId, paymentData) => {
    const response = await apiClient.post('/payments/initiate', {
      orderId,
      returnUrl: `${window.location.origin}/orders/${orderId}?status=success`,
      cancelUrl: `${window.location.origin}/orders/${orderId}?status=cancel`,
      ...paymentData
    });
    return response.data;
  }
};

export default OrderService;
