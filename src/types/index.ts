
export type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  avatar?: string;
};

export type Hotel = {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  country: string;
  rating: number;
  reviewCount: number;
  price: number;
  images: string[];
  amenities: string[];
  featured?: boolean;
};

export type Room = {
  id: string;
  hotelId: string;
  name: string;
  description: string;
  price: number;
  capacity: number;
  images: string[];
  amenities: string[];
  available: boolean;
};

export type Booking = {
  id: string;
  userId: string;
  hotelId: string;
  roomId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  totalPrice: number;
  createdAt: string;
};
