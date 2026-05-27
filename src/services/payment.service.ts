import axiosInstance from "@/config/axiosConfig";
import { parsePaginatedResponse } from "@/utils/pagination.utils";
import type {
  ConfirmPaymentRequest,
  CreateCashPaymentRequest,
  CreateOnlinePaymentRequest,
  CreatePaymentRequest,
  DeletePaymentResponse,
  PaginatedPaymentsResult,
  Payment,
  PaymentResponse,
  PaymentStatisticsResponse,
  UpdatePaymentProofRequest,
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

  async createCashPayment(
    data: CreateCashPaymentRequest,
  ): Promise<PaymentResponse> {
    const response = await axiosInstance.post<PaymentResponse>(
      `${this.baseURL}/cash`,
      data,
    );
    return response.data;
  }

  async createOnlinePayment(
    data: CreateOnlinePaymentRequest,
  ): Promise<PaymentResponse> {
    const response = await axiosInstance.post<PaymentResponse>(
      `${this.baseURL}/online`,
      data,
    );
    return response.data;
  }

  async getPaymentsByEntry(
    entryId: number,
    page: number = 1,
    limit: number = 10,
    status?: string,
  ): Promise<PaginatedPaymentsResult> {
    const response = await axiosInstance.get<unknown>(
      `${this.baseURL}/entry/${entryId}`,
      { params: { page, limit, status } },
    );

    return parsePaginatedResponse<Payment>(response.data, {
      page,
      limit,
    });
  }

  async getPaymentsByCategory(
    categoryId: number,
    page: number = 1,
    limit: number = 10,
    status?: string,
    method?: string,
  ): Promise<PaginatedPaymentsResult> {
    const response = await axiosInstance.get<unknown>(
      `${this.baseURL}/category/${categoryId}`,
      { params: { page, limit, status, method } },
    );

    return parsePaginatedResponse<Payment>(response.data, {
      page,
      limit,
    });
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
  ): Promise<PaginatedPaymentsResult> {
    const response = await axiosInstance.get<unknown>(
      `${this.baseURL}/pending/${categoryId}`,
      { params: { page, limit, method } },
    );

    return parsePaginatedResponse<Payment>(response.data, {
      page,
      limit,
    });
  }

  async getPaymentById(paymentId: number): Promise<PaymentResponse> {
    const response = await axiosInstance.get<PaymentResponse>(
      `${this.baseURL}/${paymentId}`,
    );
    return response.data;
  }

  async confirmPayment(
    paymentId: number,
    data: ConfirmPaymentRequest,
  ): Promise<PaymentResponse> {
    const response = await axiosInstance.post<PaymentResponse>(
      `${this.baseURL}/${paymentId}/confirm`,
      data,
    );
    return response.data;
  }

  async rejectPayment(paymentId: number): Promise<PaymentResponse> {
    const response = await axiosInstance.post<PaymentResponse>(
      `${this.baseURL}/${paymentId}/reject`,
    );
    return response.data;
  }

  async refundPayment(paymentId: number): Promise<PaymentResponse> {
    const response = await axiosInstance.post<PaymentResponse>(
      `${this.baseURL}/${paymentId}/refund`,
    );
    return response.data;
  }

  async updatePaymentProof(
    paymentId: number,
    data: UpdatePaymentProofRequest,
  ): Promise<PaymentResponse> {
    const response = await axiosInstance.put<PaymentResponse>(
      `${this.baseURL}/${paymentId}/proof`,
      data,
    );
    return response.data;
  }

  async deletePayment(paymentId: number): Promise<DeletePaymentResponse> {
    await axiosInstance.delete(`${this.baseURL}/${paymentId}`);
    return {
      success: true,
      message: "Payment deleted successfully",
      data: undefined,
    };
  }
}

export default new PaymentService();
