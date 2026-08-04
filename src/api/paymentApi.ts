import { apiClient } from './axios';
import { ApiResponse, SaasPayment } from '../types';

export interface PaymentReportFormData {
  plan_id: number;
  payment_method: string;
  reference_number: string;
  proof_file: File;
}

export const paymentApi = {
  getPayments: async (): Promise<SaasPayment[]> => {
    const res = await apiClient.get<any>('/payments');
    const data = res.data;
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.data)) return data.data;
    if (Array.isArray(data.data?.data)) return data.data.data;
    return [];
  },

  reportPayment: async (data: PaymentReportFormData): Promise<SaasPayment> => {
    const formData = new FormData();
    formData.append('saas_plan_id', data.plan_id.toString());
    formData.append('plan_id', data.plan_id.toString());
    formData.append('payment_method', data.payment_method);
    formData.append('reference_number', data.reference_number);
    formData.append('voucher', data.proof_file);
    formData.append('proof', data.proof_file);

    const res = await apiClient.post<any>('/payments/request', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data.payment || res.data.data || res.data;
  },
};
