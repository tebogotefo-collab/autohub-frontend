import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import './App.css';

// Layout Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// UI Components
import { Button } from './components/ui/button';

// Auth Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// Order Components
import OrderList from './components/orders/OrderList';
import OrderDetail from './components/orders/OrderDetail';
import Checkout from './components/checkout/Checkout';
import Cart from './components/cart/Cart';

// Product Components
import ProductList from './components/products/ProductList';
import ProductDetail from './components/products/ProductDetail';
import ProductComparison from './components/products/ProductComparison';
import FloatingComparisonButton from './components/products/FloatingComparisonButton';

// Vehicle Components
import MyGarage from './components/vehicles/MyGarage';
import VehicleForm from './components/vehicles/VehicleForm';

// Home Components
import Homepage from './components/home/Homepage';

// Seller Components
import SellerDashboard from './components/seller/SellerDashboard';
import ProductManagement from './components/seller/ProductManagement';
import ProductForm from './components/seller/ProductForm';

// Profile Components
import UserProfile from './components/profile/UserProfile';

// Auth Guard for protected routes
import AuthService from './services/authService';

// Protected route component
const ProtectedRoute = ({ children }) => {
  if (!AuthService.isAuthenticated()) {
    // Redirect to login if not authenticated
    return <Navigate to='/login' replace />;
  }
  return children;
};

// Role-specific protected route
const RoleProtectedRoute = ({ children, role }) => {
  if (!AuthService.isAuthenticated()) {
    return <Navigate to='/login' replace />;
  }
  
  if (role && !AuthService.hasRole(role)) {
    // Redirect to home if user doesn't have required role
    return <Navigate to='/' replace />;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <FloatingComparisonButton />
          <Routes>
            {/* Public Routes */}
            <Route path='/' element={<Homepage />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/cart' element={<Cart />} />
            <Route path='/products' element={<ProductList />} />
            <Route path='/products/:productId' element={<ProductDetail />} />
            <Route path='/products/compare' element={<ProductComparison />} />
            
            {/* Protected Routes - Order Management */}
            <Route 
              path='/orders' 
              element={
                <ProtectedRoute>
                  <OrderList />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path='/orders/:orderId' 
              element={
                <ProtectedRoute>
                  <OrderDetail />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path='/checkout' 
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              } 
            />
            
            {/* Seller-specific Routes */}
            <Route 
              path='/seller/dashboard' 
              element={
                <RoleProtectedRoute role="SELLER">
                  <SellerDashboard />
                </RoleProtectedRoute>
              } 
            />

            <Route 
              path='/seller/orders' 
              element={
                <RoleProtectedRoute role="SELLER">
                  <OrderList />
                </RoleProtectedRoute>
              } 
            />

            <Route 
              path='/seller/products' 
              element={
                <RoleProtectedRoute role="SELLER">
                  <ProductManagement />
                </RoleProtectedRoute>
              } 
            />

            <Route 
              path='/seller/products/new' 
              element={
                <RoleProtectedRoute role="SELLER">
                  <ProductForm />
                </RoleProtectedRoute>
              } 
            />

            <Route 
              path='/seller/products/:productId/edit' 
              element={
                <RoleProtectedRoute role="SELLER">
                  <ProductForm />
                </RoleProtectedRoute>
              } 
            />

            {/* User Profile Routes */}
            <Route 
              path='/profile' 
              element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              } 
            />
            
            {/* Vehicle Management Routes */}
            <Route 
              path='/my-garage' 
              element={
                <ProtectedRoute>
                  <MyGarage />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path='/my-garage/add' 
              element={
                <ProtectedRoute>
                  <VehicleForm />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path='/my-garage/edit/:id' 
              element={
                <ProtectedRoute>
                  <VehicleForm />
                </ProtectedRoute>
              } 
            />
            
            {/* Fallback Route */}
            <Route path='*' element={
              <div className="container mx-auto px-4 py-16 text-center">
                <h2 className="text-3xl font-bold mb-4">Page Not Found</h2>
                <p className="text-muted-foreground mb-6">The page you're looking for doesn't exist or has been moved.</p>
                <Button asChild variant="outline">
                  <Link to="/">Return to Homepage</Link>
                </Button>
              </div>
            } />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;
