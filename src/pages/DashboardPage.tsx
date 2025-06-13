import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  ListFilter, 
  User, 
  Settings, 
  Plus,
  Info,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getItems } from '../services/itemService';
import { getRentalsByUserId } from '../services/rentalService';
import { Item, Rental } from '../types';
import { format } from 'date-fns';
import LoadingSpinner from '../components/LoadingSpinner';

// Dashboard tabs
type Tab = 'overview' | 'my-listings' | 'my-rentals' | 'profile' | 'settings';

const DashboardPage = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [myListings, setMyListings] = useState<Item[]>([]);
  const [myRentals, setMyRentals] = useState<Rental[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        if (currentUser?.uid) {
          // Fetch user's listings and rentals in parallel
          const [listingsData, rentalsData] = await Promise.all([
            getItems({ ownerId: currentUser.uid }),
            getRentalsByUserId(currentUser.uid, 'renter')
          ]);
          
          setMyListings(listingsData);
          setMyRentals(rentalsData);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [currentUser]);
  
  // Render different content based on active tab
  const renderTabContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center py-20">
          <LoadingSpinner size="large" />
        </div>
      );
    }
    
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold mb-1">My Listings</h3>
                <p className="text-3xl font-bold text-primary-500">{myListings.length}</p>
                <p className="text-slate-500 text-sm mt-2">Total items you're currently renting out</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold mb-1">My Rentals</h3>
                <p className="text-3xl font-bold text-primary-500">{myRentals.length}</p>
                <p className="text-slate-500 text-sm mt-2">Total items you've rented from others</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold mb-1">Active Rentals</h3>
                <p className="text-3xl font-bold text-primary-500">
                  {myRentals.filter(rental => rental.status === 'active').length}
                </p>
                <p className="text-slate-500 text-sm mt-2">Items you're currently renting</p>
              </div>
            </div>
            
            {/* Recent Activity */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Recent Activity</h3>
                <Link to="/dashboard/activity" className="text-primary-500 text-sm hover:text-primary-600">
                  View All
                </Link>
              </div>
              
              {myRentals.length > 0 ? (
                <div className="space-y-4">
                  {myRentals.slice(0, 3).map(rental => (
                    <div key={rental.id} className="flex items-center p-3 rounded-lg hover:bg-slate-50">
                      <img 
                        src={rental.itemImage} 
                        alt={rental.itemTitle} 
                        className="w-12 h-12 object-cover rounded-md mr-4"
                      />
                      <div className="flex-grow">
                        <h4 className="font-medium text-slate-900">{rental.itemTitle}</h4>
                        <p className="text-sm text-slate-500">
                          {format(new Date(rental.startDate), 'MMM d')} - {format(new Date(rental.endDate), 'MMM d, yyyy')}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          rental.status === 'active' ? 'bg-green-100 text-green-800' :
                          rental.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          rental.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {rental.status.charAt(0).toUpperCase() + rental.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-slate-500">
                  <ShoppingBag className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p>You haven't rented any items yet</p>
                  <Link to="/browse" className="btn btn-primary mt-4">
                    Browse Items
                  </Link>
                </div>
              )}
            </div>
            
            {/* Quick Actions */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link to="/list-item" className="flex items-center p-4 rounded-lg border border-slate-200 hover:border-primary-500 hover:shadow-sm transition-all">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center mr-3">
                    <Plus className="w-5 h-5 text-primary-500" />
                  </div>
                  <div>
                    <h4 className="font-medium">List an Item</h4>
                    <p className="text-sm text-slate-500">Rent out your unused items</p>
                  </div>
                </Link>
                
                <Link to="/browse" className="flex items-center p-4 rounded-lg border border-slate-200 hover:border-primary-500 hover:shadow-sm transition-all">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center mr-3">
                    <ShoppingBag className="w-5 h-5 text-primary-500" />
                  </div>
                  <div>
                    <h4 className="font-medium">Rent an Item</h4>
                    <p className="text-sm text-slate-500">Browse items to rent</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        );
        
      case 'my-listings':
        return (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">My Listings</h2>
              <Link to="/list-item" className="btn btn-primary">
                <Plus size={18} className="mr-1" />
                New Listing
              </Link>
            </div>
            
            {myListings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {myListings.map(item => (
                  <div key={item.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="relative aspect-video">
                      <img 
                        src={item.images[0]} 
                        alt={item.title} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          item.status === 'available' ? 'bg-green-100 text-green-800' :
                          item.status === 'rented' ? 'bg-orange-100 text-orange-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                      <p className="text-slate-600 text-sm mb-3 line-clamp-2">{item.description}</p>
                      
                      <div className="flex justify-between items-center border-t border-slate-100 pt-3 mt-3">
                        <div>
                          <p className="text-primary-500 font-semibold">₹{item.price}/day</p>
                        </div>
                        <Link to={`/items/${item.id}`} className="text-primary-500 hover:text-primary-600 text-sm font-medium">
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-xl shadow-sm">
                <Package className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                <h3 className="text-xl font-semibold mb-2">No Listings Yet</h3>
                <p className="text-slate-500 mb-6">Start sharing your items and earn passive income</p>
                <Link to="/list-item" className="btn btn-primary">
                  <Plus size={18} className="mr-1" />
                  List Your First Item
                </Link>
              </div>
            )}
          </div>
        );
        
      case 'my-rentals':
        return (
          <div>
            <h2 className="text-xl font-semibold mb-6">My Rentals</h2>
            
            {myRentals.length > 0 ? (
              <div className="space-y-4">
                {myRentals.map(rental => (
                  <div key={rental.id} className="bg-white p-4 rounded-xl shadow-sm">
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-1/4 mb-4 md:mb-0 md:mr-4">
                        <img 
                          src={rental.itemImage} 
                          alt={rental.itemTitle} 
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      </div>
                      
                      <div className="md:w-3/4">
                        <div className="flex justify-between items-start">
                          <h3 className="font-semibold text-lg">{rental.itemTitle}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            rental.status === 'active' ? 'bg-green-100 text-green-800' :
                            rental.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            rental.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                            rental.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            rental.status === 'cancelled' ? 'bg-gray-100 text-gray-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {rental.status.charAt(0).toUpperCase() + rental.status.slice(1)}
                          </span>
                        </div>
                        
                        <div className="mt-2 space-y-2">
                          <div className="flex justify-between">
                            <p className="text-slate-500 text-sm">Rental Period</p>
                            <p className="text-sm font-medium">
                              {format(new Date(rental.startDate), 'MMM d')} - {format(new Date(rental.endDate), 'MMM d, yyyy')}
                            </p>
                          </div>
                          
                          <div className="flex justify-between">
                            <p className="text-slate-500 text-sm">Owner</p>
                            <p className="text-sm font-medium">{rental.ownerName}</p>
                          </div>
                          
                          <div className="flex justify-between">
                            <p className="text-slate-500 text-sm">Total Cost</p>
                            <p className="text-sm font-medium">₹{rental.totalPrice}</p>
                          </div>
                        </div>
                        
                        <div className="mt-4 border-t border-slate-100 pt-4 flex justify-between items-center">
                          <p className={`text-sm ${
                            rental.paymentStatus === 'paid' ? 'text-green-600' :
                            rental.paymentStatus === 'pending' ? 'text-yellow-600' :
                            'text-red-600'
                          }`}>
                            Payment: {rental.paymentStatus.charAt(0).toUpperCase() + rental.paymentStatus.slice(1)}
                          </p>
                          
                          <Link to={`/rentals/${rental.id}`} className="text-primary-500 hover:text-primary-600 text-sm font-medium">
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-xl shadow-sm">
                <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                <h3 className="text-xl font-semibold mb-2">No Rentals Yet</h3>
                <p className="text-slate-500 mb-6">Browse items and start renting today</p>
                <Link to="/browse" className="btn btn-primary">
                  Browse Items
                </Link>
              </div>
            )}
          </div>
        );
        
      case 'profile':
        return (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="flex-shrink-0">
                {currentUser?.photoURL ? (
                  <img 
                    src={currentUser.photoURL} 
                    alt={currentUser.displayName || 'User'} 
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center text-primary-500 text-2xl font-bold">
                    {currentUser?.displayName?.charAt(0) || currentUser?.email?.charAt(0) || 'U'}
                  </div>
                )}
              </div>
              
              <div className="flex-grow text-center md:text-left">
                <h2 className="text-2xl font-bold mb-1">{currentUser?.displayName || 'User'}</h2>
                <p className="text-slate-500 mb-4">{currentUser?.email}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <h4 className="text-sm text-slate-500 mb-1">Member Since</h4>
                    <p className="font-medium">April 2023</p>
                  </div>
                  <div>
                    <h4 className="text-sm text-slate-500 mb-1">Last Login</h4>
                    <p className="font-medium">Today</p>
                  </div>
                </div>
                
                <button className="btn btn-secondary">
                  Edit Profile
                </button>
              </div>
            </div>
            
            <div className="mt-8 border-t border-slate-100 pt-6">
              <h3 className="text-lg font-semibold mb-4">Account Information</h3>
              
              <div className="space-y-4">
                <div className="p-4 border border-slate-200 rounded-lg">
                  <h4 className="text-sm text-slate-500 mb-1">Full Name</h4>
                  <p className="font-medium">{currentUser?.displayName || 'Not provided'}</p>
                </div>
                
                <div className="p-4 border border-slate-200 rounded-lg">
                  <h4 className="text-sm text-slate-500 mb-1">Email Address</h4>
                  <p className="font-medium">{currentUser?.email}</p>
                </div>
                
                <div className="p-4 border border-slate-200 rounded-lg">
                  <h4 className="text-sm text-slate-500 mb-1">Phone Number</h4>
                  <p className="font-medium">Not provided</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 border-t border-slate-100 pt-6">
              <h3 className="text-lg font-semibold mb-4">Account Security</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 border border-slate-200 rounded-lg">
                  <div>
                    <h4 className="font-medium">Password</h4>
                    <p className="text-sm text-slate-500">Last updated: Never</p>
                  </div>
                  <button className="text-primary-500 hover:text-primary-600 font-medium">
                    Change
                  </button>
                </div>
                
                <div className="flex justify-between items-center p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
                  <div className="flex items-start">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Two-Factor Authentication</h4>
                      <p className="text-sm text-slate-500">Secure your account with 2FA</p>
                    </div>
                  </div>
                  <button className="text-primary-500 hover:text-primary-600 font-medium">
                    Enable
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'settings':
        return (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6">Account Settings</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Notifications</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-slate-100">
                    <div>
                      <h4 className="font-medium">Email Notifications</h4>
                      <p className="text-sm text-slate-500">Receive emails about your account activity</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                    </label>
                  </div>
                  
                  <div className="flex justify-between items-center py-3 border-b border-slate-100">
                    <div>
                      <h4 className="font-medium">New Rental Requests</h4>
                      <p className="text-sm text-slate-500">Get notified when someone wants to rent your item</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                    </label>
                  </div>
                  
                  <div className="flex justify-between items-center py-3 border-b border-slate-100">
                    <div>
                      <h4 className="font-medium">Marketing Emails</h4>
                      <p className="text-sm text-slate-500">Receive emails about promotions and updates</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                    </label>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Payment Methods</h3>
                
                <div className="p-4 bg-slate-50 rounded-lg flex items-center justify-between">
                  <div className="flex items-center">
                    <Info className="w-5 h-5 text-primary-500 mr-2" />
                    <p className="text-slate-600">No payment methods added yet</p>
                  </div>
                  <button className="btn btn-primary btn-sm">Add Method</button>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Privacy</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-slate-100">
                    <div>
                      <h4 className="font-medium">Profile Visibility</h4>
                      <p className="text-sm text-slate-500">Control who can see your profile information</p>
                    </div>
                    <select className="input py-1 w-auto">
                      <option>Everyone</option>
                      <option>Only Verified Users</option>
                      <option>Private</option>
                    </select>
                  </div>
                  
                  <div className="flex justify-between items-center py-3 border-b border-slate-100">
                    <div>
                      <h4 className="font-medium">Data Collection</h4>
                      <p className="text-sm text-slate-500">Allow us to collect usage data to improve services</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-slate-200">
                <button className="text-red-500 hover:text-red-700 font-medium">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="container-custom">
        <div className="text-center md:text-left mb-8">
          <h1 className="text-3xl font-bold">My Dashboard</h1>
          <p className="text-slate-600">Manage your listings, rentals and account settings</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar Navigation */}
          <div className="md:w-64 flex-shrink-0">
            <nav className="bg-white rounded-xl shadow-sm overflow-hidden sticky top-24">
              <div className="p-4 bg-primary-500 text-white">
                <h2 className="font-semibold">
                  Hello, {currentUser?.displayName?.split(' ')[0] || 'User'}
                </h2>
              </div>
              
              <div className="p-4">
                <ul className="space-y-1">
                  <li>
                    <button
                      onClick={() => setActiveTab('overview')}
                      className={`w-full flex items-center p-3 rounded-lg ${
                        activeTab === 'overview' 
                          ? 'bg-primary-50 text-primary-600 font-medium' 
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <LayoutDashboard className="w-5 h-5 mr-3" />
                      Overview
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveTab('my-listings')}
                      className={`w-full flex items-center p-3 rounded-lg ${
                        activeTab === 'my-listings' 
                          ? 'bg-primary-50 text-primary-600 font-medium' 
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Package className="w-5 h-5 mr-3" />
                      My Listings
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveTab('my-rentals')}
                      className={`w-full flex items-center p-3 rounded-lg ${
                        activeTab === 'my-rentals' 
                          ? 'bg-primary-50 text-primary-600 font-medium' 
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <ShoppingBag className="w-5 h-5 mr-3" />
                      My Rentals
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveTab('profile')}
                      className={`w-full flex items-center p-3 rounded-lg ${
                        activeTab === 'profile' 
                          ? 'bg-primary-50 text-primary-600 font-medium' 
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <User className="w-5 h-5 mr-3" />
                      Profile
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveTab('settings')}
                      className={`w-full flex items-center p-3 rounded-lg ${
                        activeTab === 'settings' 
                          ? 'bg-primary-50 text-primary-600 font-medium' 
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Settings className="w-5 h-5 mr-3" />
                      Settings
                    </button>
                  </li>
                </ul>
              </div>
              
              <div className="p-4 border-t border-slate-100">
                <Link to="/list-item" className="btn btn-primary w-full justify-center">
                  <Plus size={18} className="mr-1" />
                  List an Item
                </Link>
              </div>
            </nav>
          </div>
          
          {/* Main Content */}
          <div className="flex-grow">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;