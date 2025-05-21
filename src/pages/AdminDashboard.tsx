
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Hotel } from '@/types';
import { HotelForm } from '@/components/HotelForm';
import { StaffForm } from '@/components/StaffForm';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  
  // CRUD state management
  const [hotelList, setHotelList] = useState([...hotels]);
  const [staffList, setStaffList] = useState([]);
  const [isHotelFormOpen, setIsHotelFormOpen] = useState(false);
  const [isStaffFormOpen, setIsStaffFormOpen] = useState(false);
  const [editingHotel, setEditingHotel] = useState<Hotel | null>(null);
  const [editingStaff, setEditingStaff] = useState<any | null>(null);
  const [hotelToDelete, setHotelToDelete] = useState<string | null>(null);
  const [staffToDelete, setStaffToDelete] = useState<string | null>(null);
  
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
  
  // Hotel CRUD operations
  const handleAddHotel = () => {
    setEditingHotel(null);
    setIsHotelFormOpen(true);
  };
  
  const handleEditHotel = (hotel: Hotel) => {
    setEditingHotel(hotel);
    setIsHotelFormOpen(true);
  };
  
  const handleDeleteHotel = (id: string) => {
    setHotelToDelete(id);
  };
  
  const confirmDeleteHotel = () => {
    if (hotelToDelete) {
      setHotelList(hotelList.filter(hotel => hotel.id !== hotelToDelete));
      toast({
        title: "Hotel deleted",
        description: "The hotel has been successfully deleted.",
      });
      setHotelToDelete(null);
    }
  };
  
  const handleSubmitHotel = (data: any) => {
    if (editingHotel) {
      // Update existing hotel
      setHotelList(hotelList.map(hotel => 
        hotel.id === editingHotel.id ? { ...hotel, ...data, reviewCount: hotel.reviewCount } : hotel
      ));
      toast({
        title: "Hotel updated",
        description: `${data.name} has been updated successfully.`,
      });
    } else {
      // Add new hotel
      const newHotel = {
        ...data,
        id: `hotel_${Date.now()}`,
        reviewCount: 0,
      };
      setHotelList([...hotelList, newHotel]);
      toast({
        title: "Hotel created",
        description: `${data.name} has been added successfully.`,
      });
    }
    setIsHotelFormOpen(false);
  };
  
  // Staff CRUD operations
  const handleAddStaff = () => {
    setEditingStaff(null);
    setIsStaffFormOpen(true);
  };
  
  const handleEditStaff = (staff: any) => {
    setEditingStaff(staff);
    setIsStaffFormOpen(true);
  };
  
  const handleDeleteStaff = (id: string) => {
    setStaffToDelete(id);
  };
  
  const confirmDeleteStaff = () => {
    if (staffToDelete) {
      setStaffList(staffList.filter(staff => staff.id !== staffToDelete));
      toast({
        title: "Staff deleted",
        description: "The staff member has been successfully deleted.",
      });
      setStaffToDelete(null);
    }
  };
  
  const handleSubmitStaff = (data: any) => {
    if (editingStaff) {
      // Update existing staff
      setStaffList(staffList.map(staff => 
        staff.id === editingStaff.id ? { ...staff, ...data } : staff
      ));
      toast({
        title: "Staff updated",
        description: `${data.name} has been updated successfully.`,
      });
    } else {
      // Add new staff
      const newStaff = {
        ...data,
        id: `staff_${Date.now()}`,
      };
      setStaffList([...staffList, newStaff]);
      toast({
        title: "Staff created",
        description: `${data.name} has been added successfully.`,
      });
    }
    setIsStaffFormOpen(false);
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your hotel system</p>
        </div>
        <div className="mt-4 md:mt-0 space-x-2">
          <Button onClick={handleAddHotel} variant="outline">Add Hotel</Button>
          <Button onClick={handleAddStaff}>Add Staff</Button>
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
        <TabsList className="grid grid-cols-5 mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="hotels">Hotels</TabsTrigger>
          <TabsTrigger value="rooms">Rooms</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="staff">Staff</TabsTrigger>
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
                      const hotel = hotelList.find(h => h.id === booking.hotelId);
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
                    {hotelList.map((hotel) => {
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
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Hotels Management</CardTitle>
                <CardDescription>Manage your hotel properties</CardDescription>
              </div>
              <Button onClick={handleAddHotel}>Add Hotel</Button>
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
                  {hotelList.map((hotel) => {
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
                            <Button size="sm" variant="outline" onClick={() => handleEditHotel(hotel)}>Edit</Button>
                            <Button size="sm" variant="ghost" className="text-red-500" onClick={() => handleDeleteHotel(hotel.id)}>Delete</Button>
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
        
        <TabsContent value="rooms">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Rooms Management</CardTitle>
                <CardDescription>Manage rooms across your properties</CardDescription>
              </div>
              <Button>Add Room</Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Room</TableHead>
                    <TableHead>Hotel</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rooms.map((room) => {
                    const hotel = hotelList.find(h => h.id === room.hotelId);
                    
                    return (
                      <TableRow key={room.id}>
                        <TableCell className="font-medium">{room.name}</TableCell>
                        <TableCell>{hotel?.name}</TableCell>
                        <TableCell>{room.capacity} persons</TableCell>
                        <TableCell>${room.price}/night</TableCell>
                        <TableCell>
                          {room.available ? (
                            <Badge variant="outline" className="bg-green-100 text-green-800">Available</Badge>
                          ) : (
                            <Badge variant="outline" className="bg-red-100 text-red-800">Booked</Badge>
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
                    const hotel = hotelList.find(h => h.id === booking.hotelId);
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
        
        <TabsContent value="staff">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Staff Management</CardTitle>
                <CardDescription>Manage your hotel staff</CardDescription>
              </div>
              <Button onClick={handleAddStaff}>Add Staff</Button>
            </CardHeader>
            <CardContent>
              {staffList.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <p className="text-gray-500 mb-4">No staff members yet</p>
                  <Button onClick={handleAddStaff}>Add your first staff member</Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Hotel</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {staffList.map((staff) => {
                      const hotel = hotelList.find(h => h.id === staff.hotelId);
                      
                      return (
                        <TableRow key={staff.id}>
                          <TableCell className="font-medium">{staff.name}</TableCell>
                          <TableCell>{staff.email}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">{staff.role}</Badge>
                          </TableCell>
                          <TableCell>{hotel?.name || 'Unassigned'}</TableCell>
                          <TableCell>{staff.phone}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline" onClick={() => handleEditStaff(staff)}>Edit</Button>
                              <Button size="sm" variant="ghost" className="text-red-500" onClick={() => handleDeleteStaff(staff.id)}>Delete</Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Hotel Form Dialog */}
      <Dialog open={isHotelFormOpen} onOpenChange={setIsHotelFormOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingHotel ? 'Edit Hotel' : 'Add New Hotel'}</DialogTitle>
            <DialogDescription>
              {editingHotel 
                ? 'Update the details of this hotel property.' 
                : 'Fill out the form below to add a new hotel to your system.'}
            </DialogDescription>
          </DialogHeader>
          <HotelForm 
            initialData={editingHotel} 
            onSubmit={handleSubmitHotel} 
            onCancel={() => setIsHotelFormOpen(false)} 
          />
        </DialogContent>
      </Dialog>
      
      {/* Staff Form Dialog */}
      <Dialog open={isStaffFormOpen} onOpenChange={setIsStaffFormOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingStaff ? 'Edit Staff' : 'Add New Staff'}</DialogTitle>
            <DialogDescription>
              {editingStaff 
                ? 'Update the details of this staff member.' 
                : 'Fill out the form below to add a new staff to your system.'}
            </DialogDescription>
          </DialogHeader>
          <StaffForm 
            initialData={editingStaff} 
            hotels={hotelList}
            onSubmit={handleSubmitStaff} 
            onCancel={() => setIsStaffFormOpen(false)} 
          />
        </DialogContent>
      </Dialog>
      
      {/* Delete Hotel Alert */}
      <AlertDialog open={Boolean(hotelToDelete)} onOpenChange={(open) => !open && setHotelToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the hotel
              and all associated data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteHotel} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Delete Staff Alert */}
      <AlertDialog open={Boolean(staffToDelete)} onOpenChange={(open) => !open && setStaffToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this staff member
              from your system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteStaff} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminDashboard;
