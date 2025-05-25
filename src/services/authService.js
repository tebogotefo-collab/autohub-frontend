import apiClient from './api';

const AuthService = {
  // User login
  login: async (email, password) => {
    const response = await apiClient.post('/auth/login', { email, password });
    const { token, user } = response.data;
    
    // Save token and user info to localStorage
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    return response.data;
  },
  
  // User registration
  register: async (userData) => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },
  
  // User logout
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },
  
  // Get current authenticated user
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    if (!user || user === 'undefined') {
      return null;
    }
    try {
      return JSON.parse(user);
    } catch (error) {
      console.error('Error parsing user data:', error);
      localStorage.removeItem('user'); // Clear invalid data
      return null;
    }
  },
  
  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  },
  
  // Check if user has a specific role
  hasRole: (role) => {
    const user = AuthService.getCurrentUser();
    return user && user.role === role;
  }
};

export default AuthService;
