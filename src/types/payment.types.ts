/**
 * Payment Types
 * Type definitions for payment and payout endpoints
 */

import type { PaginationParams } from "./pagination.types";

export type PaymentMethod = "cash" | "bank_transfer" | "online";
export type PaymentStatus = "pending" | "completed" | "failed" | "refunded";

export interface Payment {
  id: number;
  entryId?: number;
  categoryId?: number;
  amount?: number;
  method?: PaymentMethod;
  status?: PaymentStatus;
  transactionRef?: string | null;
  proofImageUrl?: string | null;
  paidAt?: string | Date | null;
  confirmedAt?: string | Date | null;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  [key: string]: unknown;
}

export interface PaymentStatistics {
  totalPayments?: number;
  totalAmount?: number;
  pendingCount?: number;
  completedCount?: number;
  failedCount?: number;
  refundedCount?: number;
  byMethod?: Record<string, number>;
  [key: string]: unknown;
}

export interface CreatePaymentRequest {
  entryId: number;
  amount: number;
  method: PaymentMethod;
}

export interface CreateCashPaymentRequest {
  entryId: number;
  amount: number;
}

export interface CreateOnlinePaymentRequest {
  entryId: number;
  amount: number;
  transactionRef: string;
}

export interface ConfirmPaymentRequest {
  proofImageUrl?: string;
  transactionRef?: string;
}

export interface UpdatePaymentProofRequest {
  proofImageUrl: string;
}

export interface PaymentListParams extends PaginationParams {
  page?: number;
  status?: PaymentStatus;
  method?: PaymentMethod;
}

export interface GetPaymentsResponse {
  success: boolean;
  data: {
    rows: Payment[];
    count: number;
  };
}

export interface PaymentResponse {
  success: boolean;
  data: Payment;
  message?: string;
}

export interface PaymentStatisticsResponse {
  success: boolean;
  data: PaymentStatistics;
}
