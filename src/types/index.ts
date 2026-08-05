export type Role = 'gym_owner' | 'super_admin';

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  gym_name?: string;
  phone?: string;
  license_key?: string;
  public_token?: string;
  hardware_id?: string | null;
  activated_at?: string | null;
  status?: SubscriptionStatus;
  created_at?: string;
}

export type SubscriptionStatus = 'active' | 'pending' | 'expired' | 'trial';

export interface SaasPlan {
  id: number;
  name: string;
  price: number;
  currency?: string;
  duration_days?: number;
  billing_cycle?: string;
  features?: string[];
  is_active?: boolean;
  active?: boolean;
  description?: string;
}

export interface SaasSubscription {
  id?: number;
  user_id?: number;
  plan_id?: number;
  license_key?: string;
  status: SubscriptionStatus;
  starts_at?: string;
  ends_at?: string;
  start_date?: string;
  end_date?: string;
  trial_ends_at?: string;
  days_left?: number;
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

export interface MemberPayment {
  id: number;
  gym_owner_id: number;
  member_name: string;
  member_dni: string;
  amount: number;
  reference: string;
  voucher_path: string;
  status: PaymentStatus;
  public_token: string;
  notes?: string;
  created_at: string;
  updated_at?: string;
}

export interface GymPublicInfo {
  gym_owner_id: number;
  gym_name: string;
  owner_name: string;
  public_token: string;
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

export interface CompanyPaymentSetting {
  id: number;
  bank_name: string;
  payment_type: 'bank_transfer' | 'pago_movil' | 'zelle' | 'paypal' | 'cash' | 'other' | string;
  account_number?: string;
  account_holder: string;
  id_number?: string;
  email_or_phone?: string;
  notes?: string;
  is_active: boolean;
  created_at?: string;
}
