
import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Hotel } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage 
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';

const hotelFormSchema = z.object({
  name: z.string().min(2, "Hotel name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  country: z.string().min(2, "Country must be at least 2 characters"),
  price: z.coerce.number().min(1, "Price must be at least 1"),
  rating: z.coerce.number().min(0).max(5, "Rating must be between 0 and 5"),
  featured: z.boolean().default(false),
});

type HotelFormValues = z.infer<typeof hotelFormSchema>;

interface HotelFormProps {
  initialData?: Hotel;
  onSubmit: (data: HotelFormValues) => void;
  onCancel: () => void;
}

export const HotelForm = ({ initialData, onSubmit, onCancel }: HotelFormProps) => {
  const { toast } = useToast();
  
  const defaultValues = initialData ? {
    ...initialData,
    price: initialData.price
  } : {
    name: '',
    description: '',
    address: '',
    city: '',
    country: '',
    price: 0,
    rating: 0,
    featured: false,
  };

  const form = useForm<HotelFormValues>({
    resolver: zodResolver(hotelFormSchema),
    defaultValues
  });

  const [images, setImages] = useState<string[]>(initialData?.images || []);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [amenities, setAmenities] = useState<string[]>(initialData?.amenities || []);
  const [amenityInput, setAmenityInput] = useState<string>('');
  
  const addImage = () => {
    if (imageUrl && !images.includes(imageUrl)) {
      setImages([...images, imageUrl]);
      setImageUrl('');
    } else {
      toast({
        title: "Error",
        description: "Please provide a valid image URL that hasn't been added",
        variant: "destructive"
      });
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const addAmenity = () => {
    if (amenityInput && !amenities.includes(amenityInput)) {
      setAmenities([...amenities, amenityInput]);
      setAmenityInput('');
    } else {
      toast({
        title: "Error",
        description: "Please provide a valid amenity that hasn't been added",
        variant: "destructive"
      });
    }
  };

  const removeAmenity = (index: number) => {
    const newAmenities = [...amenities];
    newAmenities.splice(index, 1);
    setAmenities(newAmenities);
  };

  const handleSubmit = (data: HotelFormValues) => {
    // Combine form data with images and amenities
    const formData = {
      ...data,
      images,
      amenities,
    };
    onSubmit(formData as any);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hotel Name</FormLabel>
              <FormControl>
                <Input placeholder="Hotel name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Hotel description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input placeholder="Address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input placeholder="City" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input placeholder="Country" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input type="number" min="0" placeholder="Price per night" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rating (0-5)</FormLabel>
                <FormControl>
                  <Input type="number" min="0" max="5" step="0.1" placeholder="Rating" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="featured"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center space-x-2 mt-8">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={field.value}
                    onChange={field.onChange}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <FormLabel htmlFor="featured">Featured Hotel</FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        {/* Images */}
        <div className="space-y-2">
          <h3 className="font-medium">Images</h3>
          <div className="flex gap-2">
            <Input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Enter image URL"
            />
            <Button type="button" onClick={addImage} variant="outline">Add</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
            {images.map((img, idx) => (
              <div key={idx} className="border rounded-md p-2 flex items-center justify-between">
                <div className="flex items-center">
                  <img src={img} alt="Hotel preview" className="w-12 h-12 object-cover rounded mr-2" />
                  <span className="text-sm truncate max-w-[160px]">{img}</span>
                </div>
                <Button 
                  type="button" 
                  onClick={() => removeImage(idx)}
                  variant="ghost"
                  size="sm"
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        </div>
        
        {/* Amenities */}
        <div className="space-y-2">
          <h3 className="font-medium">Amenities</h3>
          <div className="flex gap-2">
            <Input
              value={amenityInput}
              onChange={(e) => setAmenityInput(e.target.value)}
              placeholder="Enter amenity"
            />
            <Button type="button" onClick={addAmenity} variant="outline">Add</Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {amenities.map((amenity, idx) => (
              <div key={idx} className="bg-gray-100 rounded-md px-2 py-1 flex items-center gap-1">
                <span className="text-sm">{amenity}</span>
                <button 
                  type="button"
                  onClick={() => removeAmenity(idx)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit">{initialData ? 'Update' : 'Create'} Hotel</Button>
        </div>
      </form>
    </Form>
  );
};
