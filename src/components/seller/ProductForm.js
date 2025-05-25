import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/select';
import { AlertCircle, ArrowLeft, Plus, X } from 'lucide-react';

const ProductForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    sku: '',
    description: '',
    category: '',
    price: '',
    stock: '',
    status: 'ACTIVE',
    images: [],
    compatibleVehicles: [{ make: '', model: '', year: '' }]
  });
  
  // Load product data if editing
  useEffect(() => {
    const fetchProduct = async () => {
      if (!isEditing) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        
        // This would be replaced with actual API calls
        // const response = await SellerService.getProduct(id);
        
        // Simulated API response
        const mockProduct = {
          id: 1,
          title: 'Brake Pad Set',
          sku: 'BRK-001',
          description: 'High-performance brake pads for optimal stopping power.',
          category: 'Brake System',
          price: 49.99,
          stock: 45,
          status: 'ACTIVE',
          images: [
            'https://placehold.co/300x300?text=Brake+Pads+1',
            'https://placehold.co/300x300?text=Brake+Pads+2'
          ],
          compatibleVehicles: [
            { make: 'Toyota', model: 'Camry', year: '2020' },
            { make: 'Honda', model: 'Accord', year: '2019' }
          ]
        };
        
        setFormData(mockProduct);
        setLoading(false);
      } catch (err) {
        setError('Failed to load product');
        setLoading(false);
        console.error('Error fetching product:', err);
      }
    };
    
    fetchProduct();
  }, [id, isEditing]);
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      
      // This would be replaced with actual API calls
      // if (isEditing) {
      //   await SellerService.updateProduct(id, formData);
      // } else {
      //   await SellerService.createProduct(formData);
      // }
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      navigate('/seller/products');
    } catch (err) {
      setError('Failed to save product');
      setSaving(false);
      console.error('Error saving product:', err);
    }
  };
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle compatible vehicle changes
  const handleVehicleChange = (index, field, value) => {
    setFormData(prev => {
      const vehicles = [...prev.compatibleVehicles];
      vehicles[index] = { ...vehicles[index], [field]: value };
      return { ...prev, compatibleVehicles: vehicles };
    });
  };
  
  // Add new compatible vehicle
  const addCompatibleVehicle = () => {
    setFormData(prev => ({
      ...prev,
      compatibleVehicles: [
        ...prev.compatibleVehicles,
        { make: '', model: '', year: '' }
      ]
    }));
  };
  
  // Remove compatible vehicle
  const removeCompatibleVehicle = (index) => {
    setFormData(prev => ({
      ...prev,
      compatibleVehicles: prev.compatibleVehicles.filter((_, i) => i !== index)
    }));
  };
  
  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    // Convert files to URLs (in a real app, these would be uploaded to a server)
    const imageUrls = files.map(file => URL.createObjectURL(file));
    
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...imageUrls]
    }));
  };
  
  // Remove image
  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Button 
        variant="ghost" 
        className="mb-6"
        onClick={() => navigate('/seller/products')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Products
      </Button>
      
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? 'Edit Product' : 'Add New Product'}</CardTitle>
          <CardDescription>
            Fill in the product details below. All fields marked with * are required.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {error && (
            <div className="p-4 mb-4 text-sm rounded-lg bg-destructive/20 text-destructive">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Product Title *</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sku">SKU *</Label>
                <Input
                  id="sku"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Brake System">Brake System</SelectItem>
                    <SelectItem value="Engine Parts">Engine Parts</SelectItem>
                    <SelectItem value="Suspension">Suspension</SelectItem>
                    <SelectItem value="Electrical">Electrical</SelectItem>
                    <SelectItem value="Body Parts">Body Parts</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="price">Price ($) *</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="stock">Stock *</Label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            {/* Product Images */}
            <div className="space-y-4">
              <Label>Product Images</Label>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative aspect-square">
                    <img
                      src={image}
                      alt={`Product ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                
                <div className="aspect-square border-2 border-dashed rounded-lg flex items-center justify-center">
                  <label className="cursor-pointer p-4 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Plus className="mx-auto h-8 w-8 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground block mt-2">
                      Add Images
                    </span>
                  </label>
                </div>
              </div>
            </div>
            
            {/* Compatible Vehicles */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Compatible Vehicles</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addCompatibleVehicle}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Vehicle
                </Button>
              </div>
              
              <div className="space-y-4">
                {formData.compatibleVehicles.map((vehicle, index) => (
                  <Card key={index}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <span className="text-sm font-medium">
                          Vehicle {index + 1}
                        </span>
                        {formData.compatibleVehicles.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground hover:text-destructive"
                            onClick={() => removeCompatibleVehicle(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Make</Label>
                          <Input
                            value={vehicle.make}
                            onChange={(e) => handleVehicleChange(index, 'make', e.target.value)}
                            placeholder="e.g., Toyota"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Model</Label>
                          <Input
                            value={vehicle.model}
                            onChange={(e) => handleVehicleChange(index, 'model', e.target.value)}
                            placeholder="e.g., Camry"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Year</Label>
                          <Input
                            value={vehicle.year}
                            onChange={(e) => handleVehicleChange(index, 'year', e.target.value)}
                            placeholder="e.g., 2020"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/seller/products')}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                    {isEditing ? 'Saving...' : 'Creating...'}
                  </>
                ) : (
                  isEditing ? 'Save Changes' : 'Create Product'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductForm;
