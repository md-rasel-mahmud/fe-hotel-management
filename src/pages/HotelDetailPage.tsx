
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { hotels, rooms } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const HotelDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const hotel = hotels.find((h) => h.id === id);
  const hotelRooms = rooms.filter((r) => r.hotelId === id);
  
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [guests, setGuests] = useState('2');
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  
  useEffect(() => {
    if (!hotel) {
      navigate('/hotels');
      toast({
        title: 'Hotel not found',
        description: 'The hotel you are looking for does not exist.',
        variant: 'destructive',
      });
    }
  }, [hotel, navigate, toast]);
  
  if (!hotel) {
    return null;
  }
  
  const selectedRoom = selectedRoomId 
    ? hotelRooms.find((room) => room.id === selectedRoomId) 
    : null;
  
  const totalNights = checkIn && checkOut 
    ? Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 3600 * 24))
    : 0;
  
  const totalPrice = selectedRoom && totalNights 
    ? selectedRoom.price * totalNights
    : 0;
  
  const handleBookNow = () => {
    if (!user) {
      toast({
        title: 'Login Required',
        description: 'Please log in to book a room',
        variant: 'destructive',
      });
      navigate('/login');
      return;
    }
    
    if (!checkIn || !checkOut || !selectedRoomId) {
      toast({
        title: 'Booking Error',
        description: 'Please select check-in/check-out dates and a room',
        variant: 'destructive',
      });
      return;
    }
    
    // In a real app, this would redirect to a checkout page or process the booking
    toast({
      title: 'Booking Successful',
      description: 'Your booking has been confirmed!',
    });
    navigate('/dashboard');
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hotel Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <h1 className="text-3xl font-bold">{hotel.name}</h1>
          <div className="flex items-center mt-2 md:mt-0">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="ml-1 font-semibold">{hotel.rating}</span>
              <span className="ml-1 text-gray-500">({hotel.reviewCount} reviews)</span>
            </div>
            <span className="mx-2">•</span>
            <span className="text-gray-600">{hotel.address}, {hotel.city}, {hotel.country}</span>
          </div>
        </div>
      </div>
      
      {/* Image Gallery */}
      <div className="mb-12">
        <Carousel className="w-full">
          <CarouselContent>
            {hotel.images.map((image, index) => (
              <CarouselItem key={index}>
                <div className="p-1">
                  <img 
                    src={image} 
                    alt={`${hotel.name} - Image ${index + 1}`} 
                    className="w-full h-[400px] object-cover rounded-lg"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2" />
          <CarouselNext className="right-2" />
        </Carousel>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Hotel Details */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-lg border mb-8">
            <h2 className="text-2xl font-semibold mb-4">About This Hotel</h2>
            <p className="text-gray-700 mb-6">{hotel.description}</p>
            
            <h3 className="text-lg font-semibold mb-2">Amenities</h3>
            <div className="flex flex-wrap gap-2 mb-6">
              {hotel.amenities.map((amenity) => (
                <Badge key={amenity} variant="outline">
                  {amenity}
                </Badge>
              ))}
            </div>
          </div>
          
          {/* Room Options */}
          <div className="bg-white p-6 rounded-lg border">
            <h2 className="text-2xl font-semibold mb-6">Available Rooms</h2>
            <div className="space-y-6">
              {hotelRooms.map((room) => (
                <div 
                  key={room.id}
                  className={cn(
                    "border rounded-lg p-4 transition-colors",
                    selectedRoomId === room.id ? "border-hotel-primary bg-blue-50" : "hover:border-gray-300"
                  )}
                  onClick={() => setSelectedRoomId(room.id)}
                >
                  <div className="flex flex-col md:flex-row gap-4">
                    <img 
                      src={room.images[0]} 
                      alt={room.name} 
                      className="w-full md:w-48 h-32 object-cover rounded-md"
                    />
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:justify-between">
                        <h3 className="text-lg font-semibold">{room.name}</h3>
                        <div className="flex items-baseline mt-1 sm:mt-0">
                          <span className="text-lg font-bold text-hotel-primary">${room.price}</span>
                          <span className="text-sm text-gray-500 ml-1">/night</span>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mt-1 mb-2">{room.description}</p>
                      <div className="flex flex-wrap gap-1 mb-2">
                        <Badge variant="outline" className="text-xs">
                          {room.capacity} guests
                        </Badge>
                        {room.amenities.slice(0, 3).map((amenity, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {amenity}
                          </Badge>
                        ))}
                        {room.amenities.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{room.amenities.length - 3} more
                          </Badge>
                        )}
                      </div>
                      <Button
                        variant={selectedRoomId === room.id ? "default" : "outline"} 
                        size="sm"
                        onClick={() => setSelectedRoomId(room.id)}
                      >
                        {selectedRoomId === room.id ? 'Selected' : 'Select Room'}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Booking Box */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg border sticky top-4">
            <h2 className="text-xl font-semibold mb-4">Book Your Stay</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Check-in</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !checkIn && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {checkIn ? format(checkIn, 'MMM dd, yyyy') : <span>Select date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={checkIn}
                      onSelect={setCheckIn}
                      disabled={(date) => date < new Date()}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Check-out</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !checkOut && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {checkOut ? format(checkOut, 'MMM dd, yyyy') : <span>Select date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={checkOut}
                      onSelect={setCheckOut}
                      disabled={(date) => 
                        (checkIn ? date <= checkIn : false) || 
                        date <= new Date()
                      }
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Guests</label>
                <Select 
                  value={guests}
                  onValueChange={setGuests}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Number of guests" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Guest</SelectItem>
                    <SelectItem value="2">2 Guests</SelectItem>
                    <SelectItem value="3">3 Guests</SelectItem>
                    <SelectItem value="4">4 Guests</SelectItem>
                    <SelectItem value="5">5 Guests</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between mb-2">
                  <span>Room:</span>
                  <span>{selectedRoom?.name || 'Not selected'}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Price per night:</span>
                  <span>${selectedRoom?.price || 0}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Nights:</span>
                  <span>{totalNights}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t border-dashed pt-2 mt-2">
                  <span>Total:</span>
                  <span>${totalPrice}</span>
                </div>
              </div>
              
              <Button 
                className="w-full" 
                size="lg"
                disabled={!checkIn || !checkOut || !selectedRoomId}
                onClick={handleBookNow}
              >
                Book Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelDetailPage;
