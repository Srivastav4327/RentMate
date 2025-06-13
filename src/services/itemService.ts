import { Item } from '../types';

// Sample data for demonstration
const ITEMS_DB: Record<string, Item> = {
  'item1': {
    id: 'item1',
    title: 'Sony Alpha A7III Mirrorless Camera',
    description: 'Professional full-frame mirrorless camera with 24.2MP sensor. Perfect for photography enthusiasts and professionals. Includes 28-70mm kit lens, extra battery, and 64GB SD card.',
    category: 'electronics',
    price: 1200,
    deposit: 5000,
    location: 'Powai',
    city: 'Mumbai',
    state: 'Maharashtra',
    images: [
      'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/243757/pexels-photo-243757.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    ownerId: 'user456',
    ownerName: 'Raj Sharma',
    ownerPhoto: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=200',
    createdAt: '2023-04-15T10:30:00Z',
    updatedAt: '2023-04-15T10:30:00Z',
    status: 'available',
    featured: true
  },
  'item2': {
    id: 'item2',
    title: 'PlayStation 5 Console with 2 Controllers',
    description: 'Latest PS5 console with 825GB SSD storage. Includes 2 DualSense controllers and 3 popular games: FIFA 23, God of War, and Spider-Man.',
    category: 'gaming',
    price: 500,
    deposit: 10000,
    location: 'Koramangala',
    city: 'Bangalore',
    state: 'Karnataka',
    images: [
      'https://images.pexels.com/photos/275033/pexels-photo-275033.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    ownerId: 'user789',
    ownerName: 'Priya Patel',
    createdAt: '2023-04-16T14:20:00Z',
    updatedAt: '2023-04-16T14:20:00Z',
    status: 'available'
  },
  'item3': {
    id: 'item3',
    title: 'MacBook Pro 16" (2023) - M2 Pro',
    description: 'Latest MacBook Pro with M2 Pro chip, 16GB RAM, 512GB SSD. AppleCare+ included until 2025. Comes with original box and charger.',
    category: 'electronics',
    price: 1500,
    deposit: 20000,
    location: 'Hauz Khas',
    city: 'Delhi',
    state: 'Delhi',
    images: [
      'https://images.pexels.com/photos/303383/pexels-photo-303383.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    ownerId: 'user123',
    ownerName: 'Amit Kumar',
    ownerPhoto: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200',
    createdAt: '2023-04-17T09:15:00Z',
    updatedAt: '2023-04-17T09:15:00Z',
    status: 'available',
    featured: true
  },
  'item4': {
    id: 'item4',
    title: 'Premium Study Desk and Chair Set',
    description: 'Ergonomic study desk and chair perfect for students. Desk has built-in shelves and drawer. Chair is adjustable with lumbar support.',
    category: 'furniture',
    price: 300,
    location: 'Anna Nagar',
    city: 'Chennai',
    state: 'Tamil Nadu',
    images: [
      'https://images.pexels.com/photos/1957477/pexels-photo-1957477.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/1957478/pexels-photo-1957478.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    ownerId: 'user345',
    ownerName: 'Arun Vijay',
    createdAt: '2023-04-18T16:45:00Z',
    updatedAt: '2023-04-18T16:45:00Z',
    status: 'available'
  },
  'item5': {
    id: 'item5',
    title: 'Complete UPSC Study Material Set',
    description: 'Comprehensive study material for UPSC preparation. Includes all NCERTs, standard textbooks, previous year papers, and handwritten notes from a successful candidate.',
    category: 'books',
    price: 200,
    location: 'Banjara Hills',
    city: 'Hyderabad',
    state: 'Telangana',
    images: [
      'https://images.pexels.com/photos/3747468/pexels-photo-3747468.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    ownerId: 'user567',
    ownerName: 'Lakshmi Reddy',
    createdAt: '2023-04-19T11:30:00Z',
    updatedAt: '2023-04-19T11:30:00Z',
    status: 'available'
  }
};

// Get all items with optional filters
export const getItems = async (filters?: {
  category?: string;
  city?: string;
  search?: string;
  maxPrice?: number;
  ownerId?: string;
}): Promise<Item[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  let items = Object.values(ITEMS_DB);
  
  // Apply filters if provided
  if (filters) {
    if (filters.category) {
      items = items.filter(item => item.category === filters.category);
    }
    
    if (filters.city) {
      items = items.filter(item => item.city.toLowerCase() === filters.city?.toLowerCase());
    }
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      items = items.filter(item => 
        item.title.toLowerCase().includes(searchLower) || 
        item.description.toLowerCase().includes(searchLower)
      );
    }
    
    if (filters.maxPrice) {
      items = items.filter(item => item.price <= filters.maxPrice!);
    }
    
    if (filters.ownerId) {
      items = items.filter(item => item.ownerId === filters.ownerId);
    }
  }
  
  return items;
};

// Get featured items
export const getFeaturedItems = async (): Promise<Item[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  return Object.values(ITEMS_DB).filter(item => item.featured);
};

// Get item by ID
export const getItemById = async (id: string): Promise<Item | null> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return ITEMS_DB[id] || null;
};

// Create a new item
export const createItem = async (itemData: Omit<Item, 'id' | 'createdAt' | 'updatedAt'>): Promise<Item> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 900));
  
  const now = new Date().toISOString();
  const id = 'item' + Math.floor(Math.random() * 10000);
  
  const newItem: Item = {
    id,
    ...itemData,
    createdAt: now,
    updatedAt: now
  };
  
  // Add to simulated database
  ITEMS_DB[id] = newItem;
  
  return newItem;
};

// Update an item
export const updateItem = async (id: string, data: Partial<Item>): Promise<Item> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  if (!ITEMS_DB[id]) {
    throw new Error('Item not found');
  }
  
  ITEMS_DB[id] = { 
    ...ITEMS_DB[id], 
    ...data,
    updatedAt: new Date().toISOString()
  };
  
  return ITEMS_DB[id];
};

// Delete an item
export const deleteItem = async (id: string): Promise<boolean> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  if (!ITEMS_DB[id]) {
    return false;
  }
  
  delete ITEMS_DB[id];
  return true;
};

// Get categories
export const getCategories = async (): Promise<{id: string, name: string}[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 400));
  
  return [
    { id: 'electronics', name: 'Electronics' },
    { id: 'gaming', name: 'Gaming' },
    { id: 'furniture', name: 'Furniture' },
    { id: 'books', name: 'Books & Study Materials' },
    { id: 'sports', name: 'Sports Equipment' },
    { id: 'instruments', name: 'Musical Instruments' },
    { id: 'clothing', name: 'Clothing & Accessories' },
    { id: 'tools', name: 'Tools & Equipment' }
  ];
};

// Get cities
export const getCities = async (): Promise<{id: string, name: string, state: string}[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 400));
  
  return [
    { id: 'mumbai', name: 'Mumbai', state: 'Maharashtra' },
    { id: 'delhi', name: 'Delhi', state: 'Delhi' },
    { id: 'bangalore', name: 'Bangalore', state: 'Karnataka' },
    { id: 'hyderabad', name: 'Hyderabad', state: 'Telangana' },
    { id: 'chennai', name: 'Chennai', state: 'Tamil Nadu' },
    { id: 'pune', name: 'Pune', state: 'Maharashtra' },
    { id: 'kolkata', name: 'Kolkata', state: 'West Bengal' },
    { id: 'ahmedabad', name: 'Ahmedabad', state: 'Gujarat' }
  ];
};