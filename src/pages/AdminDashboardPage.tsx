import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  Settings, 
  AlertCircle, 
  CheckCircle, 
  XCircle, 
  Edit, 
  Trash2, 
  Search
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getAllUsers } from '../services/userService';
import { getItems } from '../services/itemService';
import { User, Item } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';

// Admin tabs
type Tab = 'overview' | 'users' | 'items' | 'settings';

const AdminDashboardPage = () => {
  const { currentUser, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [users, setUsers] = useState<User[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    const fetchAdminData = async () => {
      setIsLoading(true);
      try {
        // Fetch users and items in parallel
        const [usersData, itemsData] = await Promise.all([
          getAllUsers(),
          getItems()
        ]);
        
        setUsers(usersData);
        setItems(itemsData);
      } catch (error) {
        console.error('Error fetching admin data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAdminData();
  }, []);
  
  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Filter items based on search term
  const filteredItems = items.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.ownerName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Handle user ban/unban
  const handleToggleUserStatus = (userId: string, currentRole: string) => {
    // In a real app, you would call an API to update the user's status
    console.log(`Toggling status for user ${userId}, current role: ${currentRole}`);
    
    // Update local state for demonstration
    setUsers(prev => 
      prev.map(user => 
        user.uid === userId 
          ? { ...user, role: user.role === 'user' ? 'admin' : 'user' }
          : user
      )
    );
  };
  
  // Handle item approval/rejection
  const handleToggleItemStatus = (itemId: string, currentStatus: string) => {
    // In a real app, you would call an API to update the item's status
    console.log(`Toggling status for item ${itemId}, current status: ${currentStatus}`);
    
    // Update local state for demonstration
    setItems(prev => 
      prev.map(item => 
        item.id === itemId 
          ? { 
              ...item, 
              status: item.status === 'available' 
                ? 'unavailable' 
                : 'available' 
            }
          : item
      )
    );
  };
  
  // Handle item deletion
  const handleDeleteItem = (itemId: string) => {
    // In a real app, you would call an API to delete the item
    console.log(`Deleting item ${itemId}`);
    
    // Update local state for demonstration
    setItems(prev => prev.filter(item => item.id !== itemId));
  };
  
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
                <h3 className="text-lg font-semibold mb-1">Total Users</h3>
                <p className="text-3xl font-bold text-primary-500">{users.length}</p>
                <div className="flex items-center text-sm text-green-600 mt-2">
                  <CheckCircle size={16} className="mr-1" />
                  {users.filter(user => user.role === 'user').length} Active users
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold mb-1">Total Items</h3>
                <p className="text-3xl font-bold text-primary-500">{items.length}</p>
                <div className="flex items-center text-sm text-green-600 mt-2">
                  <CheckCircle size={16} className="mr-1" />
                  {items.filter(item => item.status === 'available').length} Available items
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold mb-1">Featured Items</h3>
                <p className="text-3xl font-bold text-primary-500">
                  {items.filter(item => item.featured).length}
                </p>
                <p className="text-slate-500 text-sm mt-2">Items highlighted on homepage</p>
              </div>
            </div>
            
            {/* Recent Items */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Recent Items</h3>
                <button 
                  className="text-primary-500 text-sm hover:text-primary-600"
                  onClick={() => setActiveTab('items')}
                >
                  View All
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead>
                    <tr>
                      <th className="py-3 px-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Item</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Owner</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Price</th>
                      <th className="py-3 px-4 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {items.slice(0, 5).map(item => (
                      <tr key={item.id} className="hover:bg-slate-50">
                        <td className="py-4 px-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img 
                              src={item.images[0]} 
                              alt={item.title} 
                              className="w-10 h-10 rounded object-cover mr-3"
                            />
                            <div className="truncate max-w-[200px]">
                              <p className="font-medium text-slate-900">{item.title}</p>
                              <p className="text-xs text-slate-500">{item.category}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {item.ownerPhoto ? (
                              <img 
                                src={item.ownerPhoto} 
                                alt={item.ownerName} 
                                className="w-6 h-6 rounded-full mr-2"
                              />
                            ) : (
                              <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center text-primary-500 text-xs mr-2">
                                {item.ownerName.charAt(0)}
                              </div>
                            )}
                            <span className="text-slate-900">{item.ownerName}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs rounded-full font-medium ${
                            item.status === 'available' ? 'bg-green-100 text-green-800' : 
                            item.status === 'rented' ? 'bg-orange-100 text-orange-800' : 
                            'bg-red-100 text-red-800'
                          }`}>
                            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap text-slate-900">
                          ₹{item.price}/day
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap text-right text-sm font-medium">
                          <button 
                            onClick={() => handleToggleItemStatus(item.id, item.status)}
                            className={`mr-2 ${
                              item.status === 'available' ? 'text-red-500 hover:text-red-700' : 'text-green-500 hover:text-green-700'
                            }`}
                          >
                            {item.status === 'available' ? <XCircle size={18} /> : <CheckCircle size={18} />}
                          </button>
                          <button className="text-slate-500 hover:text-slate-700 mr-2">
                            <Edit size={18} />
                          </button>
                          <button 
                            onClick={() => handleDeleteItem(item.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Recent Users */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Recent Users</h3>
                <button 
                  className="text-primary-500 text-sm hover:text-primary-600"
                  onClick={() => setActiveTab('users')}
                >
                  View All
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead>
                    <tr>
                      <th className="py-3 px-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">User</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Email</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Role</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Joined</th>
                      <th className="py-3 px-4 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {users.slice(0, 5).map(user => (
                      <tr key={user.uid} className="hover:bg-slate-50">
                        <td className="py-4 px-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {user.photoURL ? (
                              <img 
                                src={user.photoURL} 
                                alt={user.displayName} 
                                className="w-8 h-8 rounded-full mr-3"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-500 font-medium mr-3">
                                {user.displayName.charAt(0)}
                              </div>
                            )}
                            <span className="font-medium text-slate-900">{user.displayName}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap text-slate-900">
                          {user.email}
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs rounded-full font-medium ${
                            user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          </span>
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap text-slate-500">
                          Apr 15, 2023
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap text-right text-sm font-medium">
                          <button 
                            onClick={() => handleToggleUserStatus(user.uid, user.role)}
                            className={`${
                              user.role === 'admin' ? 'text-orange-500 hover:text-orange-700' : 'text-primary-500 hover:text-primary-700'
                            }`}
                          >
                            {user.role === 'admin' ? 'Revoke Admin' : 'Make Admin'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
        
      case 'users':
        return (
          <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <h2 className="text-xl font-semibold">Manage Users</h2>
              
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search users..."
                  className="input pl-10 w-full md:w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead>
                    <tr>
                      <th className="py-3 px-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">User</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Email</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Role</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Joined</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Items</th>
                      <th className="py-3 px-4 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredUsers.map(user => (
                      <tr key={user.uid} className="hover:bg-slate-50">
                        <td className="py-4 px-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {user.photoURL ? (
                              <img 
                                src={user.photoURL} 
                                alt={user.displayName} 
                                className="w-10 h-10 rounded-full mr-3"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-500 font-medium mr-3">
                                {user.displayName.charAt(0)}
                              </div>
                            )}
                            <span className="font-medium text-slate-900">{user.displayName}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap text-slate-900">
                          {user.email}
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs rounded-full font-medium ${
                            user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          </span>
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap text-slate-500">
                          Apr 15, 2023
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap text-slate-900">
                          {items.filter(item => item.ownerId === user.uid).length}
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-slate-500 hover:text-slate-700 mr-3">
                            <Edit size={18} />
                          </button>
                          <button 
                            onClick={() => handleToggleUserStatus(user.uid, user.role)}
                            className={`${
                              user.role === 'admin' ? 'text-orange-500 hover:text-orange-700' : 'text-primary-500 hover:text-primary-700'
                            }`}
                          >
                            {user.role === 'admin' ? 'Revoke Admin' : 'Make Admin'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {filteredUsers.length === 0 && (
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                  <p className="text-slate-500">No users match your search criteria</p>
                </div>
              )}
            </div>
          </div>
        );
        
      case 'items':
        return (
          <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <h2 className="text-xl font-semibold">Manage Items</h2>
              
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search items..."
                  className="input pl-10 w-full md:w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead>
                    <tr>
                      <th className="py-3 px-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Item</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Owner</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Category</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Location</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Price</th>
                      <th className="py-3 px-4 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredItems.map(item => (
                      <tr key={item.id} className="hover:bg-slate-50">
                        <td className="py-4 px-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img 
                              src={item.images[0]} 
                              alt={item.title} 
                              className="w-10 h-10 rounded object-cover mr-3"
                            />
                            <div>
                              <p className="font-medium text-slate-900 truncate max-w-[150px]">{item.title}</p>
                              <p className="text-xs text-slate-500">ID: {item.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {item.ownerPhoto ? (
                              <img 
                                src={item.ownerPhoto} 
                                alt={item.ownerName} 
                                className="w-6 h-6 rounded-full mr-2"
                              />
                            ) : (
                              <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center text-primary-500 text-xs mr-2">
                                {item.ownerName.charAt(0)}
                              </div>
                            )}
                            <span className="text-slate-900">{item.ownerName}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap text-slate-900 capitalize">
                          {item.category}
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs rounded-full font-medium ${
                            item.status === 'available' ? 'bg-green-100 text-green-800' : 
                            item.status === 'rented' ? 'bg-orange-100 text-orange-800' : 
                            'bg-red-100 text-red-800'
                          }`}>
                            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap text-slate-900">
                          {item.city}
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap text-slate-900">
                          ₹{item.price}/day
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap text-right text-sm font-medium">
                          <button 
                            onClick={() => handleToggleItemStatus(item.id, item.status)}
                            className={`mr-2 ${
                              item.status === 'available' ? 'text-red-500 hover:text-red-700' : 'text-green-500 hover:text-green-700'
                            }`}
                            title={item.status === 'available' ? 'Mark as Unavailable' : 'Mark as Available'}
                          >
                            {item.status === 'available' ? <XCircle size={18} /> : <CheckCircle size={18} />}
                          </button>
                          <button 
                            className="text-slate-500 hover:text-slate-700 mr-2"
                            title="Edit Item"
                          >
                            <Edit size={18} />
                          </button>
                          <button 
                            onClick={() => handleDeleteItem(item.id)}
                            className="text-red-500 hover:text-red-700"
                            title="Delete Item"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {filteredItems.length === 0 && (
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                  <p className="text-slate-500">No items match your search criteria</p>
                </div>
              )}
            </div>
          </div>
        );
        
      case 'settings':
        return (
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6">Platform Settings</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">General Settings</h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b border-slate-100">
                      <div>
                        <h4 className="font-medium">Maintenance Mode</h4>
                        <p className="text-sm text-slate-500">Temporarily disable the platform for maintenance</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                      </label>
                    </div>
                    
                    <div className="flex justify-between items-center py-3 border-b border-slate-100">
                      <div>
                        <h4 className="font-medium">New User Registration</h4>
                        <p className="text-sm text-slate-500">Allow new users to register</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                      </label>
                    </div>
                    
                    <div className="flex justify-between items-center py-3 border-b border-slate-100">
                      <div>
                        <h4 className="font-medium">Commission Rate</h4>
                        <p className="text-sm text-slate-500">Platform fee percentage on rentals</p>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="number"
                          className="input w-20 py-1"
                          defaultValue="10"
                          min="0"
                          max="100"
                        />
                        <span className="ml-2">%</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Content Moderation</h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b border-slate-100">
                      <div>
                        <h4 className="font-medium">Auto-approve New Listings</h4>
                        <p className="text-sm text-slate-500">Automatically approve new item listings</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                      </label>
                    </div>
                    
                    <div className="flex justify-between items-center py-3 border-b border-slate-100">
                      <div>
                        <h4 className="font-medium">Content Filtering</h4>
                        <p className="text-sm text-slate-500">Filter inappropriate content using AI</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                      </label>
                    </div>
                    
                    <div className="flex justify-between items-center py-3 border-b border-slate-100">
                      <div>
                        <h4 className="font-medium">Maximum Images Per Listing</h4>
                        <p className="text-sm text-slate-500">Limit the number of images per item</p>
                      </div>
                      <input
                        type="number"
                        className="input w-20 py-1"
                        defaultValue="5"
                        min="1"
                        max="10"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Payment Settings</h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b border-slate-100">
                      <div>
                        <h4 className="font-medium">Razorpay Test Mode</h4>
                        <p className="text-sm text-slate-500">Use Razorpay test environment</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                      </label>
                    </div>
                    
                    <div className="flex justify-between items-center py-3 border-b border-slate-100">
                      <div>
                        <h4 className="font-medium">Minimum Transaction Amount</h4>
                        <p className="text-sm text-slate-500">Minimum amount for rental transactions</p>
                      </div>
                      <div className="flex items-center">
                        <span className="mr-2">₹</span>
                        <input
                          type="number"
                          className="input w-24 py-1"
                          defaultValue="100"
                          min="0"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 flex justify-end">
                  <button className="btn btn-primary">
                    Save Settings
                  </button>
                </div>
              </div>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
              <div className="flex items-start">
                <AlertCircle className="w-6 h-6 text-yellow-600 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-lg font-medium text-yellow-800 mb-2">Admin Actions</h3>
                  <p className="text-yellow-700 mb-4">
                    The following actions are irreversible and should be used with caution.
                  </p>
                  
                  <div className="space-y-3">
                    <button className="btn bg-slate-200 text-slate-700 hover:bg-slate-300">
                      Export All Data
                    </button>
                    <button className="btn bg-orange-100 text-orange-700 hover:bg-orange-200 ml-3">
                      Reset Platform Statistics
                    </button>
                    <button className="btn bg-red-100 text-red-700 hover:bg-red-200 ml-3">
                      Clear Test Data
                    </button>
                  </div>
                </div>
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
        {/* Admin Header */}
        <div className="bg-primary-900 text-white p-6 rounded-xl mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-primary-100 mt-1">Manage all aspects of the rental platform</p>
            </div>
            
            <div className="mt-4 md:mt-0">
              <span className="bg-primary-700 text-primary-100 px-3 py-1 rounded text-sm">
                Version 1.0.0
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar Navigation */}
          <div className="md:w-64 flex-shrink-0">
            <nav className="bg-white rounded-xl shadow-sm overflow-hidden sticky top-24">
              <div className="p-6">
                <ul className="space-y-2">
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
                      onClick={() => setActiveTab('users')}
                      className={`w-full flex items-center p-3 rounded-lg ${
                        activeTab === 'users' 
                          ? 'bg-primary-50 text-primary-600 font-medium' 
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Users className="w-5 h-5 mr-3" />
                      Users
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveTab('items')}
                      className={`w-full flex items-center p-3 rounded-lg ${
                        activeTab === 'items' 
                          ? 'bg-primary-50 text-primary-600 font-medium' 
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Package className="w-5 h-5 mr-3" />
                      Items
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

export default AdminDashboardPage;