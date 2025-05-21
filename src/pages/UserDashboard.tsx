
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { bookings, hotels, rooms } from '@/data/mockData';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

const UserDashboard = () => {
  const { user } = useAuth();
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);
  
  // Filter bookings for the current user
  const userBookings = bookings.filter((booking) => booking.userId === user?.id);
  
  // Get booking details for the dialog
  const bookingDetails = userBookings.find((booking) => booking.id === selectedBooking);
  const bookingHotel = bookingDetails 
    ? hotels.find((hotel) => hotel.id === bookingDetails.hotelId)
    : null;
  const bookingRoom = bookingDetails
    ? rooms.find((room) => room.id === bookingDetails.roomId)
    : null;
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, {user?.name}</p>
        </div>
        <Button asChild className="mt-4 md:mt-0">
          <Link to="/hotels">Book New Stay</Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Bookings</CardTitle>
            <CardDescription>Your booking history</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{userBookings.length}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Upcoming Stays</CardTitle>
            <CardDescription>Bookings in the future</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {userBookings.filter(b => new Date(b.checkIn) > new Date()).length}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Spent</CardTitle>
            <CardDescription>Your total bookings value</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              ${userBookings.reduce((sum, booking) => sum + booking.totalPrice, 0)}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>My Bookings</CardTitle>
          <CardDescription>View and manage your bookings</CardDescription>
        </CardHeader>
        <CardContent>
          {userBookings.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold text-gray-700">No bookings yet</h3>
              <p className="text-gray-500 mb-4">You haven't made any bookings yet</p>
              <Button asChild>
                <Link to="/hotels">Browse Hotels</Link>
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Hotel</TableHead>
                  <TableHead>Check-in</TableHead>
                  <TableHead>Check-out</TableHead>
                  <TableHead>Guests</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userBookings.map((booking) => {
                  const hotel = hotels.find((h) => h.id === booking.hotelId);
                  return (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium">{hotel?.name}</TableCell>
                      <TableCell>{format(new Date(booking.checkIn), 'MMM dd, yyyy')}</TableCell>
                      <TableCell>{format(new Date(booking.checkOut), 'MMM dd, yyyy')}</TableCell>
                      <TableCell>{booking.guests}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(booking.status)} variant="outline">
                          {booking.status}
                        </Badge>
                      </TableCell>
                      <TableCell>${booking.totalPrice}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => setSelectedBooking(booking.id)}>
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      
      <Dialog open={selectedBooking !== null} onOpenChange={() => setSelectedBooking(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
            <DialogDescription>
              Booking reference: {selectedBooking}
            </DialogDescription>
          </DialogHeader>
          
          {bookingDetails && bookingHotel && bookingRoom && (
            <div className="mt-4 space-y-4">
              <div className="flex items-start gap-4">
                <img 
                  src={bookingHotel.images[0]} 
                  alt={bookingHotel.name}
                  className="w-20 h-20 rounded-md object-cover" 
                />
                <div>
                  <h3 className="font-semibold text-lg">{bookingHotel.name}</h3>
                  <p className="text-sm text-gray-500">{bookingHotel.address}, {bookingHotel.city}, {bookingHotel.country}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Room Type</p>
                  <p className="font-medium">{bookingRoom.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Guests</p>
                  <p className="font-medium">{bookingDetails.guests}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Check-in</p>
                  <p className="font-medium">{format(new Date(bookingDetails.checkIn), 'MMM dd, yyyy')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Check-out</p>
                  <p className="font-medium">{format(new Date(bookingDetails.checkOut), 'MMM dd, yyyy')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <Badge className={getStatusColor(bookingDetails.status)} variant="outline">
                    {bookingDetails.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Price</p>
                  <p className="font-medium">${bookingDetails.totalPrice}</p>
                </div>
              </div>
              
              <div className="flex justify-between border-t pt-4">
                <Button variant="outline" onClick={() => setSelectedBooking(null)}>
                  Close
                </Button>
                {bookingDetails.status === 'confirmed' && (
                  <Button variant="destructive">
                    Cancel Booking
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserDashboard;
