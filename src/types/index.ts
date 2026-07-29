export type Role = 'gym_owner' | 'super_admin';

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  gym_name?: string;
  phone?: string;
  created_at?: string;
}

export type SubscriptionStatus = 'active' | 'pending' | 'expired' | 'trial';

export interface SaasPlan {
  id: number;
  name: string;
  price: number;
  currency: string;
  billing_cycle: 'monthly' | 'yearly';
  features: string[];
  is_active: boolean;
}

export interface SaasSubscription {
  id: number;
  user_id: number;
  plan_id?: number;
  license_key: string;
  status: SubscriptionStatus;
  starts_at: string;
  ends_at: string;
  trial_days_left?: number;
  plan?: SaasPlan;
}

export type PaymentStatus = 'pending' | 'approved' | 'rejected';

export interface SaasPayment {
  id: number;
  user_id: number;
  plan_id: number;
  amount: number;
  payment_method: string;
  reference_number: string;
  proof_url: string;
  status: PaymentStatus;
  notes?: string;
  created_at: string;
  plan?: SaasPlan;
}

export interface Backup {
  id: number;
  user_id: number;
  file_name: string;
  file_size: number;
  created_at: string;
  download_url?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface AuthResponse {
  token: string;
  user: User;
  subscription?: SaasSubscription;
}
