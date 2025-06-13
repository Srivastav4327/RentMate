import { useState, FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, Check, AlertTriangle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getCategories, getCities, createItem } from '../services/itemService';
import { Item } from '../types';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';

const ListingPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [deposit, setDeposit] = useState('');
  const [location, setLocation] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);
  const [cities, setCities] = useState<{id: string, name: string, state: string}[]>([]);
  
  // UI states
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Load categories and cities
  useState(() => {
    const fetchOptions = async () => {
      setIsLoading(true);
      try {
        const [categoriesData, citiesData] = await Promise.all([
          getCategories(),
          getCities()
        ]);
        setCategories(categoriesData);
        setCities(citiesData);
      } catch (error) {
        console.error('Error fetching options:', error);
        toast.error('Failed to load form options');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOptions();
  });
  
  // Handle image upload
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      
      // Limit to 5 images
      if (images.length + fileArray.length > 5) {
        toast.error('You can only upload up to 5 images');
        return;
      }
      
      // Create preview URLs and add to state
      const newImageUrls = fileArray.map(file => URL.createObjectURL(file));
      
      setImages(prev => [...prev, ...fileArray]);
      setImageUrls(prev => [...prev, ...newImageUrls]);
    }
  };
  
  // Remove image
  const removeImage = (index: number) => {
    const newImages = [...images];
    const newImageUrls = [...imageUrls];
    
    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(newImageUrls[index]);
    
    newImages.splice(index, 1);
    newImageUrls.splice(index, 1);
    
    setImages(newImages);
    setImageUrls(newImageUrls);
  };
  
  // Handle city selection
  const handleCityChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedCity = e.target.value;
    setCity(selectedCity);
    
    // Set state based on selected city
    const cityData = cities.find(c => c.id === selectedCity);
    if (cityData) {
      setState(cityData.state);
    }
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!description.trim()) newErrors.description = 'Description is required';
    if (!category) newErrors.category = 'Category is required';
    if (!price) newErrors.price = 'Price is required';
    else if (isNaN(Number(price)) || Number(price) <= 0) newErrors.price = 'Please enter a valid price';
    if (deposit && (isNaN(Number(deposit)) || Number(deposit) <= 0)) newErrors.deposit = 'Please enter a valid deposit amount';
    if (!location.trim()) newErrors.location = 'Location is required';
    if (!city) newErrors.city = 'City is required';
    if (images.length === 0) newErrors.images = 'At least one image is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Mock function to simulate image upload to Cloudinary
  const uploadImagesToCloudinary = async (images: File[]): Promise<string[]> => {
    // In a real app, you would upload images to Cloudinary here
    // For this example, we'll just use the local URLs
    return imageUrls;
  };
  
  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Upload images (mock)
      const uploadedImageUrls = await uploadImagesToCloudinary(images);
      
      // Create item
      const itemData: Omit<Item, 'id' | 'createdAt' | 'updatedAt'> = {
        title,
        description,
        category,
        price: Number(price),
        deposit: deposit ? Number(deposit) : undefined,
        location,
        city,
        state,
        images: uploadedImageUrls,
        ownerId: currentUser!.uid,
        ownerName: currentUser!.displayName || 'User',
        ownerPhoto: currentUser!.photoURL || undefined,
        status: 'available'
      };
      
      const newItem = await createItem(itemData);
      
      toast.success('Item listed successfully!');
      navigate(`/items/${newItem.id}`);
    } catch (error) {
      console.error('Error creating listing:', error);
      toast.error('Failed to create listing. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }
  
  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8 text-center md:text-left">
            <h1 className="text-3xl font-bold mb-2">List Your Item</h1>
            <p className="text-slate-600">Share your items with others and earn money</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Item Information */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Item Information</h2>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="title" className="label">Item Title <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      id="title"
                      className={`input ${errors.title ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                      placeholder="e.g., Sony Alpha A7III Camera with 28-70mm Lens"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                    {errors.title && (
                      <p className="mt-1 text-sm text-red-500">{errors.title}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="description" className="label">Description <span className="text-red-500">*</span></label>
                    <textarea
                      id="description"
                      rows={4}
                      className={`input ${errors.description ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                      placeholder="Provide a detailed description of your item, including condition, features, and any other relevant information."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-500">{errors.description}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="category" className="label">Category <span className="text-red-500">*</span></label>
                    <select
                      id="category"
                      className={`input ${errors.category ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option value="">Select a category</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="mt-1 text-sm text-red-500">{errors.category}</p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Pricing */}
              <div className="border-t border-slate-100 pt-6">
                <h2 className="text-xl font-semibold mb-4">Pricing</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="price" className="label">Price per Day (₹) <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">₹</span>
                      <input
                        type="number"
                        id="price"
                        className={`input pl-8 ${errors.price ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                        placeholder="0"
                        min="0"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                      />
                    </div>
                    {errors.price && (
                      <p className="mt-1 text-sm text-red-500">{errors.price}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="deposit" className="label">Security Deposit (₹) <span className="text-slate-500 font-normal">(Optional)</span></label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">₹</span>
                      <input
                        type="number"
                        id="deposit"
                        className={`input pl-8 ${errors.deposit ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                        placeholder="0"
                        min="0"
                        value={deposit}
                        onChange={(e) => setDeposit(e.target.value)}
                      />
                    </div>
                    {errors.deposit && (
                      <p className="mt-1 text-sm text-red-500">{errors.deposit}</p>
                    )}
                    <p className="mt-1 text-sm text-slate-500">Recommended for high-value items</p>
                  </div>
                </div>
              </div>
              
              {/* Location */}
              <div className="border-t border-slate-100 pt-6">
                <h2 className="text-xl font-semibold mb-4">Location</h2>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="location" className="label">Area/Neighborhood <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      id="location"
                      className={`input ${errors.location ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                      placeholder="e.g., Koramangala, Indiranagar"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                    {errors.location && (
                      <p className="mt-1 text-sm text-red-500">{errors.location}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="city" className="label">City <span className="text-red-500">*</span></label>
                    <select
                      id="city"
                      className={`input ${errors.city ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                      value={city}
                      onChange={handleCityChange}
                    >
                      <option value="">Select a city</option>
                      {cities.map(city => (
                        <option key={city.id} value={city.id}>{city.name}, {city.state}</option>
                      ))}
                    </select>
                    {errors.city && (
                      <p className="mt-1 text-sm text-red-500">{errors.city}</p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Images */}
              <div className="border-t border-slate-100 pt-6">
                <h2 className="text-xl font-semibold mb-4">Images</h2>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="images" className="label">Item Images <span className="text-red-500">*</span></label>
                    <div className={`border-2 border-dashed p-4 rounded-lg text-center ${
                      errors.images ? 'border-red-500' : 'border-slate-300 hover:border-primary-500'
                    }`}>
                      <label htmlFor="imageUpload" className="cursor-pointer block">
                        <Upload className="w-10 h-10 mx-auto mb-2 text-slate-400" />
                        <p className="text-slate-600 mb-1">Click to upload images</p>
                        <p className="text-sm text-slate-500">(Max 5 images, JPEG or PNG)</p>
                        <input
                          type="file"
                          id="imageUpload"
                          accept="image/jpeg, image/png"
                          multiple
                          className="hidden"
                          onChange={handleImageChange}
                        />
                      </label>
                    </div>
                    {errors.images && (
                      <p className="mt-1 text-sm text-red-500">{errors.images}</p>
                    )}
                  </div>
                  
                  {/* Image Previews */}
                  {imageUrls.length > 0 && (
                    <div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                        {imageUrls.map((url, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={url}
                              alt={`Preview ${index}`}
                              className="w-full h-24 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                              onClick={() => removeImage(index)}
                            >
                              <X size={16} />
                            </button>
                            {index === 0 && (
                              <div className="absolute bottom-0 left-0 right-0 bg-primary-500 text-white text-xs text-center py-1 rounded-b-lg">
                                Cover Image
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      <p className="text-sm text-slate-500 mt-2">
                        {imageUrls.length} of 5 images uploaded
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Terms and Conditions */}
              <div className="border-t border-slate-100 pt-6">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-yellow-800">Please Note</h3>
                      <p className="text-sm text-yellow-700">
                        By listing your item, you agree to our Terms of Service and are responsible for the accuracy of the information provided. All rentals are covered by our Rental Protection Plan, but you are encouraged to document the condition of your item before and after each rental.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start mb-6">
                  <input
                    type="checkbox"
                    id="terms"
                    className="mt-1 mr-2"
                    required
                  />
                  <label htmlFor="terms" className="text-sm text-slate-600">
                    I agree to the <a href="/terms" className="text-primary-500 hover:text-primary-600">Terms of Service</a> and <a href="/privacy" className="text-primary-500 hover:text-primary-600">Privacy Policy</a>. I confirm that the information provided is accurate and that I am the rightful owner of this item.
                  </label>
                </div>
              </div>
              
              {/* Submit Button */}
              <div className="border-t border-slate-100 pt-6 flex justify-end">
                <button
                  type="submit"
                  className="btn btn-primary py-3 px-6"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <LoadingSpinner size="small" />
                  ) : (
                    <>
                      <Check size={18} className="mr-1" />
                      List Item
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingPage;