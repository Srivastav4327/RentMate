import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Calendar, 
  Circle, 
  ArrowLeft, 
  Share2, 
  Heart, 
  Shield, 
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getItemById } from '../services/itemService';
import { calculateRentalPrice, createRental } from '../services/rentalService';
import { Item } from '../types';
import { format, addDays } from 'date-fns';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';

const ItemDetailsPage = () => {
  const { itemId } = useParams<{ itemId: string }>();
  const [item, setItem] = useState<Item | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [startDate, setStartDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState<string>(format(addDays(new Date(), 3), 'yyyy-MM-dd'));
  const [rentalCalculation, setRentalCalculation] = useState<{
    totalDays: number;
    totalPrice: number;
    commissionFee: number;
  }>({ totalDays: 3, totalPrice: 0, commissionFee: 0 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchItem = async () => {
      setIsLoading(true);
      try {
        if (itemId) {
          const data = await getItemById(itemId);
          setItem(data);
          
          // Calculate initial rental price
          if (data) {
            const calc = calculateRentalPrice(
              data.price,
              new Date(startDate).toISOString(),
              new Date(endDate).toISOString()
            );
            setRentalCalculation(calc);
          }
        }
      } catch (error) {
        console.error('Error fetching item:', error);
        toast.error('Failed to load item details');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchItem();
  }, [itemId]);
  
  // Update calculation when dates change
  useEffect(() => {
    if (item) {
      const calc = calculateRentalPrice(
        item.price,
        new Date(startDate).toISOString(),
        new Date(endDate).toISOString()
      );
      setRentalCalculation(calc);
    }
  }, [startDate, endDate, item]);
  
  const nextImage = () => {
    if (item?.images) {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === item.images.length - 1 ? 0 : prevIndex + 1
      );
    }
  };
  
  const prevImage = () => {
    if (item?.images) {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === 0 ? item.images.length - 1 : prevIndex - 1
      );
    }
  };
  
  const handleRentNow = async () => {
    if (!currentUser) {
      toast.error('Please log in to rent this item');
      navigate('/login', { state: { from: `/items/${itemId}` } });
      return;
    }
    
    if (currentUser.uid === item?.ownerId) {
      toast.error('You cannot rent your own item');
      return;
    }
    
    if (item?.status !== 'available') {
      toast.error('This item is currently not available for rent');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create rental record
      await createRental({
        itemId: item.id,
        itemTitle: item.title,
        itemImage: item.images[0],
        renterId: currentUser.uid,
        renterName: currentUser.displayName || 'User',
        ownerId: item.ownerId,
        ownerName: item.ownerName,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        totalPrice: rentalCalculation.totalPrice,
        commissionFee: rentalCalculation.commissionFee,
        securityDeposit: item.deposit,
        status: 'pending',
        paymentStatus: 'pending'
      });
      
      toast.success('Rental request submitted successfully!');
      navigate('/dashboard/my-rentals');
    } catch (error) {
      console.error('Error creating rental:', error);
      toast.error('Failed to submit rental request');
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
  
  if (!item) {
    return (
      <div className="min-h-screen py-16 px-4 text-center">
        <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-red-500" />
        <h1 className="text-3xl font-bold mb-4">Item Not Found</h1>
        <p className="text-slate-600 mb-8">The item you're looking for doesn't exist or has been removed.</p>
        <Link to="/browse" className="btn btn-primary">
          Browse Other Items
        </Link>
      </div>
    );
  }
  
  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="container-custom">
        {/* Breadcrumb and Back Button */}
        <div className="mb-6">
          <Link to="/browse" className="inline-flex items-center text-primary-600 hover:text-primary-700">
            <ArrowLeft size={18} className="mr-1" />
            Back to Browse
          </Link>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Images and Details */}
          <div className="lg:w-2/3">
            {/* Image Gallery */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
              <div className="relative aspect-video">
                <img 
                  src={item.images[currentImageIndex]} 
                  alt={item.title} 
                  className="w-full h-full object-contain"
                />
                
                {item.images.length > 1 && (
                  <>
                    <button 
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                      aria-label="Previous image"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button 
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                      aria-label="Next image"
                    >
                      <ChevronRight size={24} />
                    </button>
                  </>
                )}
                
                {/* Image Navigation Dots */}
                {item.images.length > 1 && (
                  <div className="absolute bottom-3 left-0 right-0 flex justify-center space-x-2">
                    {item.images.map((_, index) => (
                      <button 
                        key={index}
                        className={`w-2.5 h-2.5 rounded-full transition-colors ${
                          currentImageIndex === index ? 'bg-primary-500' : 'bg-white/50 hover:bg-white'
                        }`}
                        onClick={() => setCurrentImageIndex(index)}
                        aria-label={`Go to image ${index + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Item Details */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-2xl font-bold mb-2">{item.title}</h1>
                  <div className="flex items-center text-slate-600">
                    <MapPin size={16} className="mr-1" />
                    <span>{item.location}, {item.city}, {item.state}</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 text-slate-500 hover:text-primary-500 hover:bg-slate-50 rounded-full">
                    <Share2 size={20} />
                  </button>
                  <button className="p-2 text-slate-500 hover:text-red-500 hover:bg-slate-50 rounded-full">
                    <Heart size={20} />
                  </button>
                </div>
              </div>
              
              <div className="border-t border-slate-100 pt-4">
                <h2 className="text-lg font-semibold mb-3">Description</h2>
                <p className="text-slate-600 whitespace-pre-line">{item.description}</p>
              </div>
              
              <div className="border-t border-slate-100 mt-6 pt-4">
                <h2 className="text-lg font-semibold mb-3">Item Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm text-slate-500">Category</h3>
                    <p className="font-medium capitalize">{item.category}</p>
                  </div>
                  <div>
                    <h3 className="text-sm text-slate-500">Status</h3>
                    <p className={`font-medium ${
                      item.status === 'available' ? 'text-green-600' : 
                      item.status === 'rented' ? 'text-orange-600' : 'text-red-600'
                    }`}>
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm text-slate-500">Daily Rate</h3>
                    <p className="font-medium">₹{item.price}/day</p>
                  </div>
                  {item.deposit && (
                    <div>
                      <h3 className="text-sm text-slate-500">Security Deposit</h3>
                      <p className="font-medium">₹{item.deposit}</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="border-t border-slate-100 mt-6 pt-4">
                <h2 className="text-lg font-semibold mb-3">Owner</h2>
                <div className="flex items-center">
                  {item.ownerPhoto ? (
                    <img 
                      src={item.ownerPhoto} 
                      alt={item.ownerName} 
                      className="w-12 h-12 rounded-full mr-4"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-primary-100 text-primary-500 flex items-center justify-center font-bold text-lg mr-4">
                      {item.ownerName.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h3 className="font-medium">{item.ownerName}</h3>
                    <p className="text-sm text-slate-500">Member since Apr 2023</p>
                  </div>
                  <button className="ml-auto btn btn-secondary">
                    <MessageCircle size={18} className="mr-1" />
                    Contact
                  </button>
                </div>
              </div>
            </div>
            
            {/* Safety Information */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-start">
                <Shield className="w-10 h-10 text-primary-500 mr-4 flex-shrink-0" />
                <div>
                  <h2 className="text-lg font-semibold mb-2">Safety & Guidelines</h2>
                  <ul className="text-slate-600 space-y-2">
                    <li className="flex items-start">
                      <Circle size={8} className="mr-2 mt-1.5" />
                      Always meet in a public place for item handovers
                    </li>
                    <li className="flex items-start">
                      <Circle size={8} className="mr-2 mt-1.5" />
                      Verify the condition of the item before renting
                    </li>
                    <li className="flex items-start">
                      <Circle size={8} className="mr-2 mt-1.5" />
                      Keep all communication within the platform
                    </li>
                    <li className="flex items-start">
                      <Circle size={8} className="mr-2 mt-1.5" />
                      Return the item in the same condition you received it
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Rental Form */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-4">Rent This Item</h2>
              
              <div className="mb-4">
                <p className="flex justify-between mb-1">
                  <span className="text-slate-600">Price</span>
                  <span className="font-medium">₹{item.price}/day</span>
                </p>
                {item.deposit && (
                  <p className="flex justify-between text-slate-600">
                    <span>Security Deposit</span>
                    <span className="font-medium">₹{item.deposit}</span>
                  </p>
                )}
              </div>
              
              <div className="border-t border-slate-100 py-4">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="startDate" className="label">Start Date</label>
                    <input
                      type="date"
                      id="startDate"
                      className="input"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      min={format(new Date(), 'yyyy-MM-dd')}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="endDate" className="label">End Date</label>
                    <input
                      type="date"
                      id="endDate"
                      className="input"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      min={startDate}
                    />
                  </div>
                </div>
              </div>
              
              <div className="border-t border-slate-100 py-4">
                <div className="space-y-2">
                  <p className="flex justify-between">
                    <span className="text-slate-600">Rental Period</span>
                    <span className="font-medium">{rentalCalculation.totalDays} days</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-slate-600">Subtotal</span>
                    <span className="font-medium">₹{rentalCalculation.totalPrice}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-slate-600">Service Fee (10%)</span>
                    <span className="font-medium">₹{rentalCalculation.commissionFee}</span>
                  </p>
                  {item.deposit && (
                    <p className="flex justify-between">
                      <span className="text-slate-600">Security Deposit (Refundable)</span>
                      <span className="font-medium">₹{item.deposit}</span>
                    </p>
                  )}
                </div>
                
                <div className="border-t border-slate-100 mt-2 pt-2">
                  <p className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>₹{rentalCalculation.totalPrice + rentalCalculation.commissionFee + (item.deposit || 0)}</span>
                  </p>
                </div>
              </div>
              
              <button
                onClick={handleRentNow}
                disabled={isSubmitting || item.status !== 'available' || currentUser?.uid === item.ownerId}
                className={`w-full btn py-3 ${
                  item.status !== 'available' 
                    ? 'bg-slate-400 text-white cursor-not-allowed' 
                    : currentUser?.uid === item.ownerId
                    ? 'bg-slate-400 text-white cursor-not-allowed'
                    : 'btn-primary'
                }`}
              >
                {isSubmitting ? (
                  <LoadingSpinner size="small" />
                ) : item.status !== 'available' ? (
                  'Not Available'
                ) : currentUser?.uid === item.ownerId ? (
                  'This is Your Item'
                ) : (
                  'Rent Now'
                )}
              </button>
              
              {!currentUser && (
                <p className="text-center mt-2 text-sm text-slate-500">
                  <Link to="/login" className="text-primary-500 hover:text-primary-600">Log in</Link> to continue with rental
                </p>
              )}
              
              <div className="mt-4 flex items-center justify-center text-sm text-slate-500">
                <Shield size={16} className="mr-1" />
                <span>Secure payment process</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetailsPage;