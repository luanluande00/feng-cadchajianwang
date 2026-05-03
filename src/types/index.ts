export type UserRole = 'USER' | 'DEVELOPER' | 'ADMIN';
export type PluginStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type TransactionType = 'RECHARGE' | 'SPEND' | 'EARN' | 'BONUS' | 'WITHDRAW';
export type PaymentStatus = 'PENDING' | 'PAID' | 'CANCELLED';

export interface User {
  id: string;
  email: string;
  username: string;
  avatar?: string;
  points: number;
  totalEarned: number;
  role: UserRole;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  parentUserId?: string;
}

export interface Plugin {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  fileUrl: string;
  price: number;
  category: string;
  status: PluginStatus;
  downloads: number;
  userId: string;
  user?: User;
  createdAt: Date;
  updatedAt: Date;
}

export interface Download {
  id: string;
  userId: string;
  pluginId: string;
  pointsSpent: number;
  createdAt: Date;
  user?: User;
  plugin?: Plugin;
}

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  description: string;
  createdAt: Date;
  user?: User;
}

export interface PaymentOrder {
  id: string;
  userId: string;
  amount: number;
  points: number;
  status: PaymentStatus;
  paymentUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any;
}

export interface PaginationResult<T = any> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
