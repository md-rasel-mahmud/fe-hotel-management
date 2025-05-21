
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { bookings, hotels, rooms, users } from '@/data/mockData';
import {
  Card,
  CardContent,
  CardDescription,
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  
  if (!user || user.role !== 'admin') {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="mb-4">You do not have permission to view this page.</p>
          <Button asChild>
            <Link to="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    );
  }
  
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
  
  const totalRevenue = bookings.reduce((sum, booking) => sum + booking.totalPrice, 0);
  const pendingBookings = bookings.filter(b => b.status === 'pending').length;
  const availableRooms = rooms.filter(r => r.available).length;
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your hotel system</p>
        </div>
        <div className="mt-4 md:mt-0 space-x-2">
          <Button asChild variant="outline">
            <Link to="/admin/hotels/new">Add Hotel</Link>
          </Button>
          <Button asChild>
            <Link to="/admin/rooms/new">Add Room</Link>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Bookings</CardTitle>
            <CardDescription>All time bookings</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{bookings.length}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Revenue</CardTitle>
            <CardDescription>Total earnings</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">${totalRevenue}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Pending</CardTitle>
            <CardDescription>Bookings needing approval</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{pendingBookings}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Available Rooms</CardTitle>
            <CardDescription>Ready to book</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{availableRooms}</p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="hotels">Hotels</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
                <CardDescription>Latest activity across your properties</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Hotel</TableHead>
                      <TableHead>Guest</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.slice(0, 5).map((booking) => {
                      const hotel = hotels.find(h => h.id === booking.hotelId);
                      const guest = users.find(u => u.id === booking.userId);
                      return (
                        <TableRow key={booking.id}>
                          <TableCell>{hotel?.name}</TableCell>
                          <TableCell>{guest?.name}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(booking.status)} variant="outline">
                              {booking.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{format(new Date(booking.createdAt), 'MMM dd, yyyy')}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Property Overview</CardTitle>
                <CardDescription>Your hotel portfolio at a glance</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Hotel</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Rooms</TableHead>
                      <TableHead>Avg. Price</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {hotels.map((hotel) => {
                      const hotelRooms = rooms.filter(r => r.hotelId === hotel.id);
                      const avgPrice = hotelRooms.length > 0
                        ? Math.round(hotelRooms.reduce((sum, r) => sum + r.price, 0) / hotelRooms.length)
                        : 0;
                      
                      return (
                        <TableRow key={hotel.id}>
                          <TableCell className="font-medium">{hotel.name}</TableCell>
                          <TableCell>{hotel.city}, {hotel.country}</TableCell>
                          <TableCell>{hotelRooms.length}</TableCell>
                          <TableCell>${avgPrice}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="hotels">
          <Card>
            <CardHeader>
              <CardTitle>Hotels Management</CardTitle>
              <CardDescription>Manage your hotel properties</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Hotel Name</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Rooms</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Featured</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {hotels.map((hotel) => {
                    const hotelRooms = rooms.filter(r => r.hotelId === hotel.id);
                    
                    return (
                      <TableRow key={hotel.id}>
                        <TableCell className="font-medium">{hotel.name}</TableCell>
                        <TableCell>{hotel.city}, {hotel.country}</TableCell>
                        <TableCell>{hotelRooms.length}</TableCell>
                        <TableCell>{hotel.rating}</TableCell>
                        <TableCell>
                          {hotel.featured ? (
                            <Badge variant="outline" className="bg-green-100 text-green-800">Yes</Badge>
                          ) : (
                            <Badge variant="outline" className="bg-gray-100 text-gray-800">No</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">Edit</Button>
                            <Button size="sm" variant="ghost" className="text-red-500">Delete</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="bookings">
          <Card>
            <CardHeader>
              <CardTitle>Bookings Management</CardTitle>
              <CardDescription>View and manage all bookings</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Booking ID</TableHead>
                    <TableHead>Hotel</TableHead>
                    <TableHead>Guest</TableHead>
                    <TableHead>Check-in</TableHead>
                    <TableHead>Check-out</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking) => {
                    const hotel = hotels.find(h => h.id === booking.hotelId);
                    const guest = users.find(u => u.id === booking.userId);
                    
                    return (
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium">{booking.id}</TableCell>
                        <TableCell>{hotel?.name}</TableCell>
                        <TableCell>{guest?.name}</TableCell>
                        <TableCell>{format(new Date(booking.checkIn), 'MMM dd, yyyy')}</TableCell>
                        <TableCell>{format(new Date(booking.checkOut), 'MMM dd, yyyy')}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(booking.status)} variant="outline">
                            {booking.status}
                          </Badge>
                        </TableCell>
                        <TableCell>${booking.totalPrice}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">View</Button>
                            {booking.status !== 'confirmed' && (
                              <Button size="sm" variant="default">Confirm</Button>
                            )}
                            {booking.status !== 'cancelled' && (
                              <Button size="sm" variant="ghost" className="text-red-500">Cancel</Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage system users</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Bookings</TableHead>
                    <TableHead>Total Spent</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => {
                    const userBookings = bookings.filter(b => b.userId === user.id);
                    const totalSpent = userBookings.reduce((sum, b) => sum + b.totalPrice, 0);
                    
                    return (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <img 
                              src={user.avatar} 
                              alt={user.name}
                              className="w-8 h-8 rounded-full mr-2" 
                            />
                            {user.name}
                          </div>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={
                            user.role === 'admin' 
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-blue-100 text-blue-800'
                          }>
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>{userBookings.length}</TableCell>
                        <TableCell>${totalSpent}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">View</Button>
                            <Button size="sm" variant="ghost" className="text-red-500">Disable</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
