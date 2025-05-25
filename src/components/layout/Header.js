import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthService from '../../services/authService';
import { Button } from '../ui/button';
import { Search, ShoppingCart, User, ChevronDown, LogOut, Package, Settings } from 'lucide-react';

const Header = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Load user and cart data on component mount
  useEffect(() => {
    // Check if user is logged in
    const currentUser = AuthService.getCurrentUser();
    setUser(currentUser);
    
    // Get cart items count
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const cartItems = JSON.parse(savedCart);
        setCartItemCount(cartItems.reduce((count, item) => count + item.quantity, 0));
      } catch (err) {
        console.error('Error parsing cart:', err);
      }
    }
    
    // Add event listener for cart updates
    window.addEventListener('cartUpdated', updateCartCount);
    
    return () => {
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, []);
  
  // Update cart count when cart is updated
  const updateCartCount = () => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const cartItems = JSON.parse(savedCart);
        setCartItemCount(cartItems.reduce((count, item) => count + item.quantity, 0));
      } catch (err) {
        console.error('Error parsing cart:', err);
      }
    } else {
      setCartItemCount(0);
    }
  };
  
  // Handle logout
  const handleLogout = () => {
    AuthService.logout();
    setUser(null);
    navigate('/login');
  };
  
  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 font-bold text-xl text-primary">
              <span className="sr-only">AutoParts Hub</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                <circle cx="12" cy="12" r="10" />
                <path d="M9 12h6" />
                <path d="M12 9v6" />
              </svg>
              <span className="hidden sm:inline-block">AutoParts Hub</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
            <Link to="/" className="text-sm font-medium transition-colors hover:text-primary">
              Home
            </Link>
            <Link to="/products" className="text-sm font-medium transition-colors hover:text-primary">
              Products
            </Link>
            <div className="relative group">
              <button className="flex items-center text-sm font-medium transition-colors hover:text-primary">
                Categories
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              <div className="absolute left-0 top-full hidden group-hover:block w-48 p-2 bg-background shadow-md border rounded-md">
                <Link to="/products?category=engine-parts" className="block px-3 py-2 text-sm hover:bg-accent rounded-sm">
                  Engine Parts
                </Link>
                <Link to="/products?category=brake-system" className="block px-3 py-2 text-sm hover:bg-accent rounded-sm">
                  Brake System
                </Link>
                <Link to="/products?category=suspension" className="block px-3 py-2 text-sm hover:bg-accent rounded-sm">
                  Suspension
                </Link>
                <div className="h-px my-2 bg-muted"></div>
                <Link to="/categories" className="block px-3 py-2 text-sm hover:bg-accent rounded-sm">
                  All Categories
                </Link>
              </div>
            </div>
            {user && user.role === 'SELLER' && (
              <Link to="/seller/dashboard" className="text-sm font-medium transition-colors hover:text-primary">
                Seller Dashboard
              </Link>
            )}
          </nav>
          
          {/* Search, Cart and User Menu */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="hidden sm:flex relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search parts..."
                className="h-9 w-[180px] sm:w-[250px] rounded-md border border-input bg-background px-3 py-1 pl-8 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
            
            {/* Cart */}
            <Link to="/cart" className="relative">
              <ShoppingCart className="h-6 w-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive flex items-center justify-center text-xs font-medium text-white">
                  {cartItemCount}
                </span>
              )}
              <span className="sr-only">Cart</span>
            </Link>
            
            {/* User Menu */}
            {user ? (
              <div className="relative">
                <div className="group">
                  <button className="flex items-center space-x-1 text-sm font-medium transition-colors">
                    <User className="h-5 w-5" />
                    <span className="hidden md:inline-block">{user.firstName}</span>
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  <div className="absolute right-0 top-full hidden group-hover:block w-48 p-2 bg-background shadow-md border rounded-md">
                    <Link to="/profile" className="flex items-center px-3 py-2 text-sm hover:bg-accent rounded-sm">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                    <Link to="/orders" className="flex items-center px-3 py-2 text-sm hover:bg-accent rounded-sm">
                      <Package className="mr-2 h-4 w-4" />
                      My Orders
                    </Link>
                    {user.role === 'SELLER' && (
                      <Link to="/seller/listings" className="flex items-center px-3 py-2 text-sm hover:bg-accent rounded-sm">
                        <Settings className="mr-2 h-4 w-4" />
                        My Listings
                      </Link>
                    )}
                    <div className="h-px my-2 bg-muted"></div>
                    <button 
                      onClick={handleLogout}
                      className="flex w-full items-center px-3 py-2 text-sm hover:bg-accent rounded-sm"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link to="/login">
                <Button variant="outline" size="sm" className="px-3">
                  Login
                </Button>
              </Link>
            )}
            
            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden flex items-center justify-center h-9 w-9 rounded-md border border-input hover:bg-accent"
              onClick={toggleMobileMenu}
              aria-label="Toggle Menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container mx-auto px-4 py-3 space-y-3">
            <div className="flex items-center">
              <Search className="h-4 w-4 mr-2 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search parts..."
                className="flex-1 h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
            <Link to="/" className="block py-2 text-sm font-medium hover:text-primary">
              Home
            </Link>
            <Link to="/products" className="block py-2 text-sm font-medium hover:text-primary">
              Products
            </Link>
            <div className="py-2">
              <button className="flex items-center text-sm font-medium hover:text-primary">
                Categories
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              <div className="pl-4 mt-1 space-y-1">
                <Link to="/products?category=engine-parts" className="block py-1 text-sm hover:text-primary">
                  Engine Parts
                </Link>
                <Link to="/products?category=brake-system" className="block py-1 text-sm hover:text-primary">
                  Brake System
                </Link>
                <Link to="/products?category=suspension" className="block py-1 text-sm hover:text-primary">
                  Suspension
                </Link>
                <Link to="/products" className="block py-1 text-sm hover:text-primary">
                  All Products
                </Link>
              </div>
            </div>
            {user && user.role === 'SELLER' && (
              <Link to="/seller/dashboard" className="block py-2 text-sm font-medium hover:text-primary">
                Seller Dashboard
              </Link>
            )}
            <div className="h-px my-2 bg-muted"></div>
            {user ? (
              <>
                <Link to="/profile" className="flex items-center py-2 text-sm hover:text-primary">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
                <Link to="/orders" className="flex items-center py-2 text-sm hover:text-primary">
                  <Package className="mr-2 h-4 w-4" />
                  My Orders
                </Link>
                <button 
                  onClick={handleLogout}
                  className="flex items-center py-2 text-sm hover:text-primary"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="block py-2 text-sm font-medium hover:text-primary">
                Login / Register
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
