
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export const SearchForm = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState('');
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [guests, setGuests] = useState('2');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    
    if (location) params.append('location', location);
    if (checkIn) params.append('checkIn', format(checkIn, 'yyyy-MM-dd'));
    if (checkOut) params.append('checkOut', format(checkOut, 'yyyy-MM-dd'));
    if (guests) params.append('guests', guests);
    
    navigate({
      pathname: '/hotels',
      search: params.toString()
    });
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="bg-white p-4 md:p-6 rounded-lg shadow-md border animate-slide-up"
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            placeholder="Where are you going?"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="check-in">Check-in</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="check-in"
                variant="outline"
                className={cn(
                  "w-full mt-1 justify-start text-left font-normal",
                  !checkIn && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {checkIn ? format(checkIn, 'MMM dd, yyyy') : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={checkIn}
                onSelect={setCheckIn}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div>
          <Label htmlFor="check-out">Check-out</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="check-out"
                variant="outline"
                className={cn(
                  "w-full mt-1 justify-start text-left font-normal",
                  !checkOut && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {checkOut ? format(checkOut, 'MMM dd, yyyy') : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={checkOut}
                onSelect={setCheckOut}
                disabled={(date) => 
                  (checkIn ? date < checkIn : false) || 
                  date < new Date()
                }
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div>
          <Label htmlFor="guests">Guests</Label>
          <Select 
            value={guests}
            onValueChange={setGuests}
          >
            <SelectTrigger className="w-full mt-1">
              <SelectValue placeholder="Number of guests" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 Guest</SelectItem>
              <SelectItem value="2">2 Guests</SelectItem>
              <SelectItem value="3">3 Guests</SelectItem>
              <SelectItem value="4">4 Guests</SelectItem>
              <SelectItem value="5">5 Guests</SelectItem>
              <SelectItem value="6">6+ Guests</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Button type="submit" className="w-full mt-4" size="lg">
        Search Hotels
      </Button>
    </form>
  );
};
