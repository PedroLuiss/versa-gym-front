import { apiClient } from './axios';
import { GymPublicInfo, MemberPayment } from '../types';

export interface ReportMemberPaymentFormData {
  public_token: string;
  member_name: string;
  member_dni: string;
  amount?: number;
  reference: string;
  voucher: File;
  notes?: string;
}

export interface MemberPaymentsResponse {
  payments: MemberPayment[];
  public_token?: string;
}

export const memberPaymentApi = {
  // GET /api/payment-info/{token} (Público)
  getPublicInfo: async (token: string): Promise<GymPublicInfo> => {
    const res = await apiClient.get<any>(`/payment-info/${token}`);
    const data = res.data;
    return data.data || data;
  },

  // POST /api/report-payment (Público)
  reportPayment: async (formDataPayload: ReportMemberPaymentFormData): Promise<MemberPayment> => {
    const formData = new FormData();
    formData.append('public_token', formDataPayload.public_token);
    formData.append('member_name', formDataPayload.member_name);
    formData.append('member_dni', formDataPayload.member_dni);
    if (formDataPayload.amount !== undefined) {
      formData.append('amount', formDataPayload.amount.toString());
    }
    formData.append('reference', formDataPayload.reference);
    formData.append('voucher', formDataPayload.voucher);
    if (formDataPayload.notes) {
      formData.append('notes', formDataPayload.notes);
    }

    const res = await apiClient.post<any>('/report-payment', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return res.data.data || res.data;
  },

  // GET /api/member-payments (Gym Owner)
  getPayments: async (status?: string): Promise<MemberPaymentsResponse> => {
    const res = await apiClient.get<any>('/member-payments', { params: { status } });
    const data = res.data;

    let paymentsList: MemberPayment[] = [];
    if (Array.isArray(data.data)) {
      paymentsList = data.data;
    } else if (Array.isArray(data)) {
      paymentsList = data;
    }

    return {
      payments: paymentsList,
      public_token: data.public_token || data.data?.public_token,
    };
  },

  // POST /api/member-payments/{id}/approve (Gym Owner)
  approvePayment: async (id: number): Promise<MemberPayment> => {
    const res = await apiClient.post<any>(`/member-payments/${id}/approve`);
    return res.data.data || res.data;
  },

  // POST /api/member-payments/{id}/reject (Gym Owner)
  rejectPayment: async (id: number, notes?: string): Promise<MemberPayment> => {
    const res = await apiClient.post<any>(`/member-payments/${id}/reject`, { notes });
    return res.data.data || res.data;
  },
};
