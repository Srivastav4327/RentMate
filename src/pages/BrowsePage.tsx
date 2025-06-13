import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, MapPin, X } from 'lucide-react';
import { getItems, getCategories, getCities } from '../services/itemService';
import { Item } from '../types';
import ItemCard from '../components/ItemCard';
import LoadingSpinner from '../components/LoadingSpinner';

const BrowsePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);
  const [cities, setCities] = useState<{id: string, name: string, state: string}[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedCity, setSelectedCity] = useState(searchParams.get('city') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  
  // Load items based on filters
  useEffect(() => {
    const fetchItems = async () => {
      setIsLoading(true);
      try {
        // Build filters object
        const filters: Record<string, any> = {};
        if (searchParams.get('search')) filters.search = searchParams.get('search');
        if (searchParams.get('category')) filters.category = searchParams.get('category');
        if (searchParams.get('city')) filters.city = searchParams.get('city');
        if (searchParams.get('maxPrice')) filters.maxPrice = parseInt(searchParams.get('maxPrice') || '0');
        
        const data = await getItems(filters);
        setItems(data);
      } catch (error) {
        console.error('Error fetching items:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Load categories and cities
    const fetchFilters = async () => {
      try {
        const [categoriesData, citiesData] = await Promise.all([
          getCategories(),
          getCities()
        ]);
        setCategories(categoriesData);
        setCities(citiesData);
      } catch (error) {
        console.error('Error fetching filter data:', error);
      }
    };
    
    fetchItems();
    fetchFilters();
  }, [searchParams]);
  
  // Apply filters
  const applyFilters = () => {
    const params: Record<string, string> = {};
    if (searchQuery) params.search = searchQuery;
    if (selectedCategory) params.category = selectedCategory;
    if (selectedCity) params.city = selectedCity;
    if (maxPrice) params.maxPrice = maxPrice;
    
    setSearchParams(params);
    setShowFilters(false);
  };
  
  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedCity('');
    setMaxPrice('');
    setSearchParams({});
  };
  
  // Handle search form submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters();
  };
  
  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="container-custom">
        <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search Form */}
            <div className="w-full md:w-1/2">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  placeholder="Search items..."
                  className="input pr-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-primary-500"
                >
                  <Search size={20} />
                </button>
              </form>
            </div>
            
            {/* Filter Button & Active Filters */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="btn btn-secondary"
              >
                <Filter size={18} className="mr-1" />
                Filters
                {(selectedCategory || selectedCity || maxPrice) && (
                  <span className="ml-1 bg-primary-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {[selectedCategory, selectedCity, maxPrice].filter(Boolean).length}
                  </span>
                )}
              </button>
              
              {/* Active Filters Pills */}
              {selectedCategory && (
                <div className="bg-primary-100 text-primary-700 text-sm px-3 py-1 rounded-full flex items-center">
                  {categories.find(c => c.id === selectedCategory)?.name || selectedCategory}
                  <button
                    onClick={() => {
                      setSelectedCategory('');
                      setSearchParams(prev => {
                        const newParams = new URLSearchParams(prev);
                        newParams.delete('category');
                        return newParams;
                      });
                    }}
                    className="ml-1 text-primary-500 hover:text-primary-700"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
              
              {selectedCity && (
                <div className="bg-primary-100 text-primary-700 text-sm px-3 py-1 rounded-full flex items-center">
                  <MapPin size={14} className="mr-1" />
                  {cities.find(c => c.id === selectedCity)?.name || selectedCity}
                  <button
                    onClick={() => {
                      setSelectedCity('');
                      setSearchParams(prev => {
                        const newParams = new URLSearchParams(prev);
                        newParams.delete('city');
                        return newParams;
                      });
                    }}
                    className="ml-1 text-primary-500 hover:text-primary-700"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
              
              {maxPrice && (
                <div className="bg-primary-100 text-primary-700 text-sm px-3 py-1 rounded-full flex items-center">
                  ₹{maxPrice}/day or less
                  <button
                    onClick={() => {
                      setMaxPrice('');
                      setSearchParams(prev => {
                        const newParams = new URLSearchParams(prev);
                        newParams.delete('maxPrice');
                        return newParams;
                      });
                    }}
                    className="ml-1 text-primary-500 hover:text-primary-700"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
              
              {(selectedCategory || selectedCity || maxPrice) && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-slate-500 hover:text-red-500"
                >
                  Clear all
                </button>
              )}
            </div>
          </div>
          
          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Category Filter */}
              <div>
                <label className="label">Category</label>
                <select
                  className="input"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* City Filter */}
              <div>
                <label className="label">City</label>
                <select
                  className="input"
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                >
                  <option value="">All Cities</option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}, {city.state}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Price Filter */}
              <div>
                <label className="label">Max Price per Day (₹)</label>
                <input
                  type="number"
                  className="input"
                  placeholder="Any price"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  min="0"
                />
              </div>
              
              {/* Apply Filters Button */}
              <div className="md:col-span-3 flex justify-end space-x-2">
                <button
                  onClick={clearFilters}
                  className="btn border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                >
                  Clear All
                </button>
                <button
                  onClick={applyFilters}
                  className="btn btn-primary"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Results */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">
              {isLoading ? 'Searching items...' : `${items.length} item${items.length !== 1 ? 's' : ''} found`}
            </h1>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-20">
              <LoadingSpinner size="large" />
            </div>
          ) : items.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <h3 className="text-xl font-semibold mb-2">No items found</h3>
              <p className="text-slate-600 mb-6">
                Try adjusting your search or filter criteria
              </p>
              <button
                onClick={clearFilters}
                className="btn btn-primary"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrowsePage;