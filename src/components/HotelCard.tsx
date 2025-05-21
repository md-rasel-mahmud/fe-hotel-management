
import { Hotel } from '@/types';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface HotelCardProps {
  hotel: Hotel;
}

export const HotelCard = ({ hotel }: HotelCardProps) => {
  return (
    <Card className="hotel-card overflow-hidden h-full flex flex-col">
      <div className="relative">
        <img 
          src={hotel.images[0]} 
          alt={hotel.name} 
          className="hotel-card-image object-cover w-full h-48"
        />
        {hotel.featured && (
          <Badge className="absolute top-2 right-2 bg-hotel-accent text-white">
            Featured
          </Badge>
        )}
      </div>
      <CardContent className="flex-grow p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold line-clamp-1">{hotel.name}</h3>
          <div className="flex items-center">
            <span className="text-sm font-bold text-hotel-primary">${hotel.price}</span>
            <span className="text-xs text-gray-500 ml-1">/night</span>
          </div>
        </div>
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <span>{hotel.city}, {hotel.country}</span>
        </div>
        <div className="flex items-center mb-4">
          <div className="flex items-center">
            <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="ml-1 text-sm font-semibold">{hotel.rating}</span>
            <span className="ml-1 text-xs text-gray-500">({hotel.reviewCount} reviews)</span>
          </div>
        </div>
        <p className="text-gray-600 text-sm line-clamp-2">{hotel.description}</p>
        <div className="mt-4 flex flex-wrap gap-1">
          {hotel.amenities.slice(0, 3).map((amenity, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {amenity}
            </Badge>
          ))}
          {hotel.amenities.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{hotel.amenities.length - 3} more
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full">
          <Link to={`/hotels/${hotel.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
