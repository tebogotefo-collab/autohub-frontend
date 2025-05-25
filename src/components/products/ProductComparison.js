import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { X, ChevronLeft, Trash2 } from 'lucide-react';
import { Badge } from '../ui/badge';

const ProductComparison = () => {
  const [comparisonItems, setComparisonItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Load comparison items
    const loadComparisonItems = () => {
      setLoading(true);
      const savedItems = localStorage.getItem('comparisonItems');
      
      if (savedItems) {
        try {
          const items = JSON.parse(savedItems);
          setComparisonItems(items);
        } catch (err) {
          console.error('Error parsing comparison items:', err);
        }
      }
      
      setLoading(false);
    };
    
    loadComparisonItems();
  }, []);
  
  const removeFromComparison = (productId) => {
    const updatedItems = comparisonItems.filter(item => item.id !== productId);
    setComparisonItems(updatedItems);
    localStorage.setItem('comparisonItems', JSON.stringify(updatedItems));
    
    // Dispatch event to update floating button
    window.dispatchEvent(new Event('comparisonUpdated'));
    
    // Navigate back if no items left
    if (updatedItems.length === 0) {
      navigate('/products');
    }
  };
  
  const clearComparison = () => {
    setComparisonItems([]);
    localStorage.removeItem('comparisonItems');
    
    // Dispatch event to update floating button
    window.dispatchEvent(new Event('comparisonUpdated'));
    
    navigate('/products');
  };
  
  // Generate comparison table with specs
  const renderComparisonTable = () => {
    if (comparisonItems.length === 0) {
      return (
        <div className="text-center py-10">
          <p className="text-muted-foreground mb-4">No products to compare.</p>
          <Button asChild variant="outline">
            <Link to="/products">Browse Products</Link>
          </Button>
        </div>
      );
    }
    
    // Get all unique specs from all products
    const allSpecs = new Set();
    comparisonItems.forEach(item => {
      if (item.specifications) {
        Object.keys(item.specifications).forEach(spec => allSpecs.add(spec));
      }
    });
    
    // Sort specs for consistent display
    const sortedSpecs = Array.from(allSpecs).sort();
    
    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse min-w-[800px]">
          <thead>
            <tr className="border-b">
              <th className="text-left py-4 px-6 font-medium w-1/4">Product</th>
              {comparisonItems.map(item => (
                <th key={item.id} className="text-center py-4 px-6 relative">
                  <button 
                    onClick={() => removeFromComparison(item.id)}
                    className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
                    aria-label="Remove from comparison"
                  >
                    <X size={16} />
                  </button>
                  <div className="flex flex-col items-center">
                    <img 
                      src={item.imageUrl || 'https://placehold.co/80x80?text=No+Image'} 
                      alt={item.title}
                      className="w-20 h-20 object-contain mb-2"
                    />
                    <Link to={`/products/${item.id}`} className="font-medium hover:text-primary text-center">
                      {item.title}
                    </Link>
                    <Badge variant="outline" className="mt-2">${item.price.toFixed(2)}</Badge>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Basic Info */}
            <tr className="border-b">
              <td className="py-3 px-6 font-medium">Brand</td>
              {comparisonItems.map(item => (
                <td key={item.id} className="py-3 px-6 text-center">
                  {item.brandName || 'N/A'}
                </td>
              ))}
            </tr>
            <tr className="border-b">
              <td className="py-3 px-6 font-medium">Condition</td>
              {comparisonItems.map(item => (
                <td key={item.id} className="py-3 px-6 text-center">
                  {item.condition || 'N/A'}
                </td>
              ))}
            </tr>
            <tr className="border-b">
              <td className="py-3 px-6 font-medium">Rating</td>
              {comparisonItems.map(item => (
                <td key={item.id} className="py-3 px-6 text-center">
                  {item.averageRating ? `${item.averageRating.toFixed(1)} ⭐ (${item.totalRatings})` : 'No ratings'}
                </td>
              ))}
            </tr>
            
            {/* Specifications */}
            {sortedSpecs.map(spec => (
              <tr key={spec} className="border-b">
                <td className="py-3 px-6 font-medium">{spec}</td>
                {comparisonItems.map(item => (
                  <td key={item.id} className="py-3 px-6 text-center">
                    {item.specifications && item.specifications[spec] ? item.specifications[spec] : 'N/A'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-10 text-center">
        <div className="animate-pulse">Loading comparison...</div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate(-1)}
            className="mr-2"
          >
            <ChevronLeft size={16} className="mr-1" /> Back
          </Button>
          <h1 className="text-2xl font-bold">Product Comparison</h1>
        </div>
        
        {comparisonItems.length > 0 && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={clearComparison}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 size={16} className="mr-1" /> Clear All
          </Button>
        )}
      </div>
      
      <Separator className="mb-6" />
      
      {renderComparisonTable()}
    </div>
  );
};

export default ProductComparison;
