import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { BarChart2 } from 'lucide-react';

const FloatingComparisonButton = () => {
  const navigate = useNavigate();
  const [comparisonCount, setComparisonCount] = useState(0);
  
  useEffect(() => {
    // Load comparison items on component mount
    const loadComparisonItems = () => {
      const savedItems = localStorage.getItem('comparisonItems');
      if (savedItems) {
        try {
          const items = JSON.parse(savedItems);
          setComparisonCount(items.length);
        } catch (err) {
          console.error('Error parsing comparison items:', err);
        }
      }
    };
    
    loadComparisonItems();
    
    // Listen for comparison updates
    window.addEventListener('comparisonUpdated', loadComparisonItems);
    
    return () => {
      window.removeEventListener('comparisonUpdated', loadComparisonItems);
    };
  }, []);
  
  // Only show button if there are items to compare
  if (comparisonCount === 0) return null;
  
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button 
        onClick={() => navigate('/products/compare')} 
        className="rounded-full shadow-lg hover:shadow-xl transition-all"
      >
        <BarChart2 className="mr-2 h-4 w-4" />
        Compare ({comparisonCount})
      </Button>
    </div>
  );
};

export default FloatingComparisonButton;
