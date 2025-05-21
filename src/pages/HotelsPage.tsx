
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { HotelCard } from '@/components/HotelCard';
import { hotels } from '@/data/mockData';
import { Hotel } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';

const HotelsPage = () => {
  const [searchParams] = useSearchParams();
  const [filteredHotels, setFilteredHotels] = useState<Hotel[]>(hotels);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  
  // Get all unique amenities from hotels
  const allAmenities = Array.from(
    new Set(hotels.flatMap((hotel) => hotel.amenities))
  );
  
  // Get location from search params
  useEffect(() => {
    const location = searchParams.get('location');
    if (location) {
      setSearchTerm(location);
    }
  }, [searchParams]);
  
  // Filter hotels based on filters
  useEffect(() => {
    let result = hotels;
    
    // Filter by search term (city, country, or hotel name)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (hotel) =>
          hotel.name.toLowerCase().includes(term) ||
          hotel.city.toLowerCase().includes(term) ||
          hotel.country.toLowerCase().includes(term)
      );
    }
    
    // Filter by price range
    result = result.filter(
      (hotel) => hotel.price >= priceRange[0] && hotel.price <= priceRange[1]
    );
    
    // Filter by amenities
    if (selectedAmenities.length > 0) {
      result = result.filter((hotel) =>
        selectedAmenities.every((amenity) => hotel.amenities.includes(amenity))
      );
    }
    
    setFilteredHotels(result);
  }, [searchTerm, priceRange, selectedAmenities]);
  
  const handleAmenityChange = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((item) => item !== amenity)
        : [...prev, amenity]
    );
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">Hotels & Resorts</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <div className="sticky top-4 bg-white p-4 rounded-lg border shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Filters</h2>
            
            <div className="mb-6">
              <Label htmlFor="search" className="text-sm font-medium mb-2 block">
                Search
              </Label>
              <Input
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="City, country, or hotel name"
              />
            </div>
            
            <div className="mb-6">
              <Label className="text-sm font-medium mb-2 block">
                Price Range (${priceRange[0]} - ${priceRange[1]})
              </Label>
              <Slider
                defaultValue={[0, 1000]}
                min={0}
                max={1000}
                step={50}
                value={priceRange}
                onValueChange={(value) => setPriceRange(value)}
                className="my-4"
              />
            </div>
            
            <div className="mb-6">
              <Label className="text-sm font-medium mb-2 block">
                Amenities
              </Label>
              <div className="space-y-2">
                {allAmenities.map((amenity) => (
                  <div key={amenity} className="flex items-center">
                    <Checkbox
                      id={`amenity-${amenity}`}
                      checked={selectedAmenities.includes(amenity)}
                      onCheckedChange={() => handleAmenityChange(amenity)}
                    />
                    <label
                      htmlFor={`amenity-${amenity}`}
                      className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {amenity}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setPriceRange([0, 1000]);
                setSelectedAmenities([]);
              }}
              className="w-full"
            >
              Reset Filters
            </Button>
          </div>
        </div>
        
        {/* Hotel Listings */}
        <div className="flex-grow">
          {filteredHotels.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold text-gray-700 mb-2">No hotels found</h2>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredHotels.map((hotel) => (
                <HotelCard key={hotel.id} hotel={hotel} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HotelsPage;
