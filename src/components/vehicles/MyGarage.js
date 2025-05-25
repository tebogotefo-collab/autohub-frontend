import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Car, Plus, Pencil, Trash2, AlertCircle } from 'lucide-react';

const MyGarage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch user's vehicles
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        
        // This would be replaced with an actual API call
        // const response = await VehicleService.getUserVehicles();
        
        // Simulated API response
        const mockVehicles = [
          {
            id: 1,
            make: 'Toyota',
            model: 'Camry',
            year: 2020,
            variant: 'SE',
            vin: 'ABC123XYZ456789',
            registrationNumber: 'CA123456',
            engineSize: '2.5L',
            transmission: 'Automatic',
            fuelType: 'Petrol'
          },
          {
            id: 2,
            make: 'Honda',
            model: 'Accord',
            year: 2019,
            variant: 'Sport',
            vin: 'DEF456UVW789012',
            registrationNumber: 'CA789012',
            engineSize: '2.0L',
            transmission: 'Automatic',
            fuelType: 'Petrol'
          }
        ];
        
        setVehicles(mockVehicles);
        setLoading(false);
      } catch (err) {
        setError('Failed to load vehicles. Please try again later.');
        setLoading(false);
        console.error('Error fetching vehicles:', err);
      }
    };
    
    fetchVehicles();
  }, []);
  
  // Handle vehicle deletion
  const handleDeleteVehicle = async (vehicleId) => {
    if (!window.confirm('Are you sure you want to remove this vehicle from your garage?')) {
      return;
    }
    
    try {
      // This would be replaced with an actual API call
      // await VehicleService.deleteVehicle(vehicleId);
      
      // Update local state
      setVehicles(prevVehicles => prevVehicles.filter(vehicle => vehicle.id !== vehicleId));
    } catch (err) {
      alert('Failed to delete vehicle. Please try again.');
      console.error('Error deleting vehicle:', err);
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
        <h1 className="text-2xl font-bold">My Garage</h1>
        <Button asChild>
          <Link to="/my-garage/add">
            <Plus className="mr-2 h-4 w-4" /> Add Vehicle
          </Link>
        </Button>
      </div>
      
      {vehicles.length === 0 ? (
        <Card>
          <CardContent className="pt-6 flex items-center justify-center py-10">
            <div className="text-center">
              <Car className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <h3 className="text-lg font-medium mb-2">No vehicles added yet</h3>
              <p className="text-muted-foreground mb-6">
                Add your vehicles to find compatible parts and track maintenance.
              </p>
              <Button asChild>
                <Link to="/my-garage/add">
                  <Plus className="mr-2 h-4 w-4" /> Add Your First Vehicle
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map(vehicle => (
            <Card key={vehicle.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{vehicle.year} {vehicle.make} {vehicle.model}</CardTitle>
                    <CardDescription>{vehicle.variant}</CardDescription>
                  </div>
                  <Badge variant="outline">{vehicle.registrationNumber}</Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                <dl className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <dt className="text-muted-foreground">Engine</dt>
                    <dd className="font-medium">{vehicle.engineSize}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Transmission</dt>
                    <dd className="font-medium">{vehicle.transmission}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Fuel Type</dt>
                    <dd className="font-medium">{vehicle.fuelType}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">VIN</dt>
                    <dd className="font-medium font-mono">{vehicle.vin}</dd>
                  </div>
                </dl>
              </CardContent>
              
              <CardFooter className="flex justify-between">
                <Button asChild variant="outline">
                  <Link to={`/my-garage/edit/${vehicle.id}`}>
                    <Pencil className="mr-2 h-4 w-4" /> Edit
                  </Link>
                </Button>
                <Button 
                  variant="ghost" 
                  className="text-muted-foreground hover:text-destructive"
                  onClick={() => handleDeleteVehicle(vehicle.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Remove
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      
      <div className="mt-8 p-4 bg-muted rounded-lg">
        <div className="flex gap-2">
          <AlertCircle className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
          <div className="text-sm text-muted-foreground">
            <p className="font-medium mb-1">Why add your vehicles?</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Find parts that are guaranteed to fit your vehicle</li>
              <li>Track maintenance history and upcoming service needs</li>
              <li>Receive notifications about recalls and important updates</li>
              <li>Quick access to vehicle specifications when needed</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyGarage;
