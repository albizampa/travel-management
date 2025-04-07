// User types
export interface User {
  id: number;
  username: string;
  email: string;
  role: UserRole;
}

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

// Travel types
export interface Travel {
  id: number;
  name: string;
  description: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  location: string;
  travelAgency: string;
  commission: number;
  totalFee: number;
  status: TravelStatus;
  participants?: Participant[];
  createdAt: string;
  updatedAt: string;
}

export enum TravelStatus {
  PLANNED = 'planned',
  ONGOING = 'ongoing',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

// Participant types
export interface Participant {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  travelId: number;
  amountPaid: number;
  status: ParticipantStatus;
  createdAt: string;
  updatedAt: string;
}

export enum ParticipantStatus {
  REGISTERED = 'registered',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
}

// Finance types
export interface FinanceRecord {
  id: number;
  type: FinanceType;
  category: string;
  amount: number;
  date: string; // ISO date string
  description: string;
  travelId?: number;
  createdAt: string;
  updatedAt: string;
}

export enum FinanceType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

// Contact types
export interface Contact {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  organization: string;
  role: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  message: string;
  error?: any;
} 