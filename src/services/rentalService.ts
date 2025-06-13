import { Rental } from '../types';

// Sample data for demonstration
const RENTALS_DB: Record<string, Rental> = {
  'rental1': {
    id: 'rental1',
    itemId: 'item1',
    itemTitle: 'Sony Alpha A7III Mirrorless Camera',
    itemImage: 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=600',
    renterId: 'user123',
    renterName: 'Amit Kumar',
    ownerId: 'user456',
    ownerName: 'Raj Sharma',
    startDate: '2023-05-10T00:00:00Z',
    endDate: '2023-05-15T00:00:00Z',
    totalPrice: 6000,
    commissionFee: 600,
    securityDeposit: 5000,
    status: 'completed',
    paymentStatus: 'paid',
    paymentId: 'pay_123456',
    createdAt: '2023-05-08T14:30:00Z',
    updatedAt: '2023-05-16T10:00:00Z'
  },
  'rental2': {
    id: 'rental2',
    itemId: 'item3',
    itemTitle: 'MacBook Pro 16" (2023) - M2 Pro',
    itemImage: 'https://images.pexels.com/photos/303383/pexels-photo-303383.jpeg?auto=compress&cs=tinysrgb&w=600',
    renterId: 'user456',
    renterName: 'Raj Sharma',
    ownerId: 'user123',
    ownerName: 'Amit Kumar',
    startDate: '2023-06-05T00:00:00Z',
    endDate: '2023-06-12T00:00:00Z',
    totalPrice: 10500,
    commissionFee: 1050,
    securityDeposit: 20000,
    status: 'active',
    paymentStatus: 'paid',
    paymentId: 'pay_789012',
    createdAt: '2023-06-01T09:15:00Z',
    updatedAt: '2023-06-05T12:00:00Z'
  },
  'rental3': {
    id: 'rental3',
    itemId: 'item2',
    itemTitle: 'PlayStation 5 Console with 2 Controllers',
    itemImage: 'https://images.pexels.com/photos/275033/pexels-photo-275033.jpeg?auto=compress&cs=tinysrgb&w=600',
    renterId: 'user123',
    renterName: 'Amit Kumar',
    ownerId: 'user789',
    ownerName: 'Priya Patel',
    startDate: '2023-07-20T00:00:00Z',
    endDate: '2023-07-27T00:00:00Z',
    totalPrice: 3500,
    commissionFee: 350,
    securityDeposit: 10000,
    status: 'pending',
    paymentStatus: 'pending',
    createdAt: '2023-07-15T16:45:00Z',
    updatedAt: '2023-07-15T16:45:00Z'
  }
};

// Get rentals by user ID (either as renter or owner)
export const getRentalsByUserId = async (userId: string, role: 'renter' | 'owner'): Promise<Rental[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const rentals = Object.values(RENTALS_DB);
  
  if (role === 'renter') {
    return rentals.filter(rental => rental.renterId === userId);
  } else {
    return rentals.filter(rental => rental.ownerId === userId);
  }
};

// Get rental by ID
export const getRentalById = async (id: string): Promise<Rental | null> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return RENTALS_DB[id] || null;
};

// Create a new rental
export const createRental = async (rentalData: Omit<Rental, 'id' | 'createdAt' | 'updatedAt'>): Promise<Rental> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 900));
  
  const now = new Date().toISOString();
  const id = 'rental' + Math.floor(Math.random() * 10000);
  
  const newRental: Rental = {
    id,
    ...rentalData,
    createdAt: now,
    updatedAt: now
  };
  
  // Add to simulated database
  RENTALS_DB[id] = newRental;
  
  return newRental;
};

// Update a rental
export const updateRental = async (id: string, data: Partial<Rental>): Promise<Rental> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  if (!RENTALS_DB[id]) {
    throw new Error('Rental not found');
  }
  
  RENTALS_DB[id] = { 
    ...RENTALS_DB[id], 
    ...data,
    updatedAt: new Date().toISOString()
  };
  
  return RENTALS_DB[id];
};

// Calculate rental price
export const calculateRentalPrice = (
  pricePerDay: number, 
  startDate: string, 
  endDate: string
): { totalDays: number; totalPrice: number; commissionFee: number } => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  const totalPrice = pricePerDay * totalDays;
  const commissionFee = totalPrice * 0.1; // 10% commission
  
  return {
    totalDays,
    totalPrice,
    commissionFee
  };
};