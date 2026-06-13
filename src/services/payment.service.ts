import axiosInstance from "@/config/axiosConfig";
import type {
  CreatePaymentRequest,
  GetPaymentsResponse,
  PaymentResponse,
  PaymentStatisticsResponse,
} from "@/types/payment.types";

class PaymentService {
  private readonly baseURL = "/payments";

  async createPayment(data: CreatePaymentRequest): Promise<PaymentResponse> {
    const response = await axiosInstance.post<PaymentResponse>(
      this.baseURL,
      data,
    );
    return response.data;
  }

  async getPaymentsByEntry(
    entryId: number,
    page: number = 1,
    limit: number = 10,
    status?: string,
  ): Promise<GetPaymentsResponse> {
    const response = await axiosInstance.get<GetPaymentsResponse>(
      `${this.baseURL}/entry/${entryId}`,
      { params: { page, limit, status } },
    );
    return response.data;
  }

  async getPaymentsByCategory(
    categoryId: number,
    page: number = 1,
    limit: number = 10,
    status?: string,
    method?: string,
  ): Promise<GetPaymentsResponse> {
    const response = await axiosInstance.get<GetPaymentsResponse>(
      `${this.baseURL}/category/${categoryId}`,
      { params: { page, limit, status, method } },
    );
    return response.data;
  }

  async getPaymentStatistics(
    categoryId: number,
  ): Promise<PaymentStatisticsResponse> {
    const response = await axiosInstance.get<PaymentStatisticsResponse>(
      `${this.baseURL}/category/${categoryId}/stats`,
    );
    return response.data;
  }

  async getPendingPaymentsByCategory(
    categoryId: number,
    page: number = 1,
    limit: number = 10,
    method?: string,
  ): Promise<GetPaymentsResponse> {
    const response = await axiosInstance.get<GetPaymentsResponse>(
      `${this.baseURL}/pending/${categoryId}`,
      { params: { page, limit, method } },
    );
    return response.data;
  }

  async getPaymentById(paymentId: number): Promise<PaymentResponse> {
    const response = await axiosInstance.get<PaymentResponse>(
      `${this.baseURL}/${paymentId}`,
    );
    return response.data;
  }

  async confirmPayment(
    paymentId: number,
  ): Promise<PaymentResponse> {
    const response = await axiosInstance.post<PaymentResponse>(
      `${this.baseURL}/${paymentId}/confirm`,
    );
    return response.data;
  }

  async rejectPayment(paymentId: number): Promise<PaymentResponse> {
    const response = await axiosInstance.post<PaymentResponse>(
      `${this.baseURL}/${paymentId}/reject`,
    );
    return response.data;
  }

  async refundPayment(paymentId: number, refundProof: File): Promise<PaymentResponse> {
    const formData = new FormData();
    formData.append("refundProof", refundProof);

    const response = await axiosInstance.post<PaymentResponse>(
      `${this.baseURL}/${paymentId}/refund`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  }

  async updatePaymentProof(
    paymentId: number,
    file: File,
  ): Promise<PaymentResponse> {
    const formData = new FormData();
    formData.append("proof", file);

    const response = await axiosInstance.put<PaymentResponse>(
      `${this.baseURL}/${paymentId}/proof`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  }


}

export default new PaymentService();
