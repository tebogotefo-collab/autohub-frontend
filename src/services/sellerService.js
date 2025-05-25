import apiClient from './apiClient';

class SellerService {
  // Dashboard
  async getDashboardMetrics() {
    const response = await apiClient.get('/api/seller/dashboard');
    return response.data;
  }
  
  // Products
  async getProducts(params = {}) {
    const response = await apiClient.get('/api/seller/products', { params });
    return response.data;
  }
  
  async getProduct(id) {
    const response = await apiClient.get(`/api/seller/products/${id}`);
    return response.data;
  }
  
  async createProduct(productData) {
    const formData = new FormData();
    
    // Add basic product data
    Object.keys(productData).forEach(key => {
      if (key !== 'images') {
        formData.append(key, typeof productData[key] === 'object' 
          ? JSON.stringify(productData[key]) 
          : productData[key]
        );
      }
    });
    
    // Add images
    if (productData.images) {
      productData.images.forEach((image, index) => {
        // If image is a File object, add it to formData
        if (image instanceof File) {
          formData.append(`images`, image);
        }
        // If image is a URL (existing image), add it to formData
        else if (typeof image === 'string') {
          formData.append('existingImages', image);
        }
      });
    }
    
    const response = await apiClient.post('/api/seller/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  }
  
  async updateProduct(id, productData) {
    const formData = new FormData();
    
    // Add basic product data
    Object.keys(productData).forEach(key => {
      if (key !== 'images') {
        formData.append(key, typeof productData[key] === 'object' 
          ? JSON.stringify(productData[key]) 
          : productData[key]
        );
      }
    });
    
    // Add images
    if (productData.images) {
      productData.images.forEach((image, index) => {
        // If image is a File object, add it to formData
        if (image instanceof File) {
          formData.append(`images`, image);
        }
        // If image is a URL (existing image), add it to formData
        else if (typeof image === 'string') {
          formData.append('existingImages', image);
        }
      });
    }
    
    const response = await apiClient.put(`/api/seller/products/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  }
  
  async deleteProduct(id) {
    const response = await apiClient.delete(`/api/seller/products/${id}`);
    return response.data;
  }
  
  // Orders
  async getOrders(params = {}) {
    const response = await apiClient.get('/api/seller/orders', { params });
    return response.data;
  }
  
  async getOrder(id) {
    const response = await apiClient.get(`/api/seller/orders/${id}`);
    return response.data;
  }
  
  async updateOrderStatus(id, status) {
    const response = await apiClient.patch(`/api/seller/orders/${id}/status`, { status });
    return response.data;
  }
  
  // Analytics
  async getAnalytics(params = {}) {
    const response = await apiClient.get('/api/seller/analytics', { params });
    return response.data;
  }
}

export default new SellerService();
