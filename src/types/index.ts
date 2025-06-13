export interface User {
  uid: string;
  displayName: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
  photoURL?: string;
}

export interface Item {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  deposit?: number;
  location: string;
  city: string;
  state: string;
  images: string[];
  ownerId: string;
  ownerName: string;
  ownerPhoto?: string;
  createdAt: string;
  updatedAt: string;
  status: 'available' | 'rented' | 'unavailable';
  featured?: boolean;
}

export interface Rental {
  id: string;
  itemId: string;
  itemTitle: string;
  itemImage: string;
  renterId: string;
  renterName: string;
  ownerId: string;
  ownerName: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  commissionFee: number;
  securityDeposit?: number;
  status: 'pending' | 'approved' | 'rejected' | 'active' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded' | 'failed';
  paymentId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  itemId: string;
  reviewerId: string;
  reviewerName: string;
  reviewerPhoto?: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface City {
  id: string;
  name: string;
  state: string;
  featured: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  featured: boolean;
}

export interface PaymentDetails {
  id: string;
  orderId: string;
  amount: number;
  currency: string;
  status: string;
  method: string;
  createdAt: string;
}