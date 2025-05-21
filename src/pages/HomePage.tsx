
import { SearchForm } from '@/components/SearchForm';
import { HotelCard } from '@/components/HotelCard';
import { hotels } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const HomePage = () => {
  // Get featured hotels
  const featuredHotels = hotels.filter(hotel => hotel.featured);
  
  // Get a few hotels to display in different sections
  const popularHotels = hotels.slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="relative flex items-center justify-center h-[600px] bg-gradient-to-r from-blue-500 to-blue-700">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=2049&auto=format&fit=crop" 
            alt="Luxury Hotel" 
            className="w-full h-full object-cover opacity-40"
          />
        </div>
        <div className="text-center text-white z-10 px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">Find Your Perfect Stay</h1>
          <p className="text-xl md:text-2xl mb-8">Search deals on hotels, homes, and much more...</p>
          <div className="max-w-4xl mx-auto">
            <SearchForm />
          </div>
        </div>
      </div>
      
      {/* Featured Hotels Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">Featured Hotels</h2>
          <Link to="/hotels">
            <Button variant="outline">View All</Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredHotels.map((hotel) => (
            <HotelCard key={hotel.id} hotel={hotel} />
          ))}
        </div>
      </section>
      
      {/* Popular Destinations */}
      <section className="py-16 bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-8 text-center">Popular Destinations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'New York', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=2070&auto=format&fit=crop' },
              { name: 'Miami', image: 'https://images.unsplash.com/photo-1514214246283-d427a95c5d2f?q=80&w=2080&auto=format&fit=crop' },
              { name: 'Denver', image: 'https://images.unsplash.com/photo-1572204097183-e1ab140342ed?q=80&w=2070&auto=format&fit=crop' },
              { name: 'Chicago', image: 'https://images.unsplash.com/photo-1494522855154-9297ac14b55f?q=80&w=2070&auto=format&fit=crop' },
            ].map((destination, index) => (
              <div key={index} className="relative rounded-lg overflow-hidden h-64 group">
                <img 
                  src={destination.image} 
                  alt={destination.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                  <div>
                    <h3 className="text-white text-xl font-bold">{destination.name}</h3>
                    <Link to={`/hotels?location=${destination.name}`} className="text-white hover:underline text-sm">
                      Explore hotels
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Popular Hotels Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-8">Popular Hotels</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularHotels.map((hotel) => (
            <HotelCard key={hotel.id} hotel={hotel} />
          ))}
        </div>
      </section>
      
      {/* Promotional Banner */}
      <section className="bg-hotel-primary py-16 px-4">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Get the Best Deals First!</h2>
          <p className="text-lg mb-6">Subscribe to our newsletter and get exclusive offers directly in your inbox.</p>
          <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <Input 
              type="email" 
              placeholder="Your email address" 
              className="bg-white text-gray-800"
            />
            <Button variant="secondary">Subscribe</Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
