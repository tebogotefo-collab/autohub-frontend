import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/select';
import { ArrowLeft, Car } from 'lucide-react';

const VehicleForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: '',
    variant: '',
    vin: '',
    registrationNumber: '',
    engineSize: '',
    transmission: '',
    fuelType: ''
  });
  
  // Load vehicle data if editing
  useEffect(() => {
    const fetchVehicle = async () => {
      if (!id) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        
        // This would be replaced with an actual API call
        // const response = await VehicleService.getVehicle(id);
        
        // Simulated API response
        const mockVehicle = {
          id: parseInt(id),
          make: 'Toyota',
          model: 'Camry',
          year: 2020,
          variant: 'SE',
          vin: 'ABC123XYZ456789',
          registrationNumber: 'CA123456',
          engineSize: '2.5L',
          transmission: 'Automatic',
          fuelType: 'Petrol'
        };
        
        setFormData(mockVehicle);
        setLoading(false);
      } catch (err) {
        setError('Failed to load vehicle details. Please try again later.');
        setLoading(false);
        console.error('Error fetching vehicle:', err);
      }
    };
    
    fetchVehicle();
  }, [id]);
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      
      // This would be replaced with actual API calls
      // if (id) {
      //   await VehicleService.updateVehicle(id, formData);
      // } else {
      //   await VehicleService.createVehicle(formData);
      // }
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      navigate('/my-garage');
    } catch (err) {
      setError('Failed to save vehicle. Please try again.');
      setSaving(false);
      console.error('Error saving vehicle:', err);
    }
  };
  
  // Handle form field changes
  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
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
        onClick={() => navigate('/my-garage')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Garage
      </Button>
      
      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>{id ? 'Edit Vehicle' : 'Add New Vehicle'}</CardTitle>
            <CardDescription>
              {id ? 'Update your vehicle details' : 'Enter your vehicle details'}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {error && (
              <div className="p-4 mb-4 text-sm rounded-lg bg-destructive/20 text-destructive">
                {error}
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Make</label>
                <Input
                  required
                  value={formData.make}
                  onChange={(e) => handleChange('make', e.target.value)}
                  placeholder="e.g. Toyota"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Model</label>
                <Input
                  required
                  value={formData.model}
                  onChange={(e) => handleChange('model', e.target.value)}
                  placeholder="e.g. Camry"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Year</label>
                <Input
                  required
                  type="number"
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  value={formData.year}
                  onChange={(e) => handleChange('year', e.target.value)}
                  placeholder="e.g. 2020"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Variant</label>
                <Input
                  value={formData.variant}
                  onChange={(e) => handleChange('variant', e.target.value)}
                  placeholder="e.g. SE"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">VIN</label>
                <Input
                  required
                  value={formData.vin}
                  onChange={(e) => handleChange('vin', e.target.value.toUpperCase())}
                  placeholder="Vehicle Identification Number"
                  className="font-mono"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Registration Number</label>
                <Input
                  required
                  value={formData.registrationNumber}
                  onChange={(e) => handleChange('registrationNumber', e.target.value.toUpperCase())}
                  placeholder="e.g. CA123456"
                  className="font-mono"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Engine Size</label>
                <Input
                  value={formData.engineSize}
                  onChange={(e) => handleChange('engineSize', e.target.value)}
                  placeholder="e.g. 2.5L"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Transmission</label>
                <Select
                  value={formData.transmission}
                  onValueChange={(value) => handleChange('transmission', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select transmission type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Automatic">Automatic</SelectItem>
                    <SelectItem value="Manual">Manual</SelectItem>
                    <SelectItem value="CVT">CVT</SelectItem>
                    <SelectItem value="DCT">Dual-Clutch (DCT)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Fuel Type</label>
                <Select
                  value={formData.fuelType}
                  onValueChange={(value) => handleChange('fuelType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select fuel type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Petrol">Petrol</SelectItem>
                    <SelectItem value="Diesel">Diesel</SelectItem>
                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                    <SelectItem value="Electric">Electric</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/my-garage')}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              <Car className="mr-2 h-4 w-4" />
              {saving ? 'Saving...' : id ? 'Update Vehicle' : 'Add Vehicle'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default VehicleForm;
