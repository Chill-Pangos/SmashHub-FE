import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { paymentService } from "@/services";
import { queryKeys } from "./queryKeys";
import type {
  ConfirmPaymentRequest,
  CreateCashPaymentRequest,
  CreateOnlinePaymentRequest,
  CreatePaymentRequest,
  UpdatePaymentProofRequest,
} from "@/types/payment.types";

export const usePaymentsByEntry = (
  entryId: number,
  page = 1,
  limit = 10,
  status?: string,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: queryKeys.payments.byEntry(entryId, { page, limit, status }),
    queryFn: () =>
      paymentService.getPaymentsByEntry(entryId, page, limit, status),
    enabled: (options?.enabled ?? true) && entryId > 0,
  });
};

export const usePaymentsByCategory = (
  categoryId: number,
  page = 1,
  limit = 10,
  status?: string,
  method?: string,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: queryKeys.payments.byCategory(categoryId, {
      page,
      limit,
      status,
      method,
    }),
    queryFn: () =>
      paymentService.getPaymentsByCategory(
        categoryId,
        page,
        limit,
        status,
        method,
      ),
    enabled: (options?.enabled ?? true) && categoryId > 0,
  });
};

export const usePaymentStatistics = (
  categoryId: number,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: queryKeys.payments.stats(categoryId),
    queryFn: () => paymentService.getPaymentStatistics(categoryId),
    enabled: (options?.enabled ?? true) && categoryId > 0,
  });
};

export const usePendingPayments = (
  categoryId: number,
  page = 1,
  limit = 10,
  method?: string,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: queryKeys.payments.pending(categoryId, { page, limit, method }),
    queryFn: () =>
      paymentService.getPendingPaymentsByCategory(
        categoryId,
        page,
        limit,
        method,
      ),
    enabled: (options?.enabled ?? true) && categoryId > 0,
  });
};

export const usePayment = (
  paymentId: number,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: queryKeys.payments.detail(paymentId),
    queryFn: () => paymentService.getPaymentById(paymentId),
    enabled: (options?.enabled ?? true) && paymentId > 0,
  });
};

export const useCreatePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePaymentRequest) =>
      paymentService.createPayment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.payments.all });
    },
  });
};

export const useCreateCashPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCashPaymentRequest) =>
      paymentService.createCashPayment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.payments.all });
    },
  });
};

export const useCreateOnlinePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOnlinePaymentRequest) =>
      paymentService.createOnlinePayment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.payments.all });
    },
  });
};

export const useConfirmPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      paymentId,
      data,
    }: {
      paymentId: number;
      data: ConfirmPaymentRequest;
    }) => paymentService.confirmPayment(paymentId, data),
    onSuccess: (_result, { paymentId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.payments.detail(paymentId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.payments.all });
    },
  });
};

export const useRejectPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (paymentId: number) => paymentService.rejectPayment(paymentId),
    onSuccess: (_result, paymentId) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.payments.detail(paymentId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.payments.all });
    },
  });
};

export const useRefundPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (paymentId: number) => paymentService.refundPayment(paymentId),
    onSuccess: (_result, paymentId) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.payments.detail(paymentId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.payments.all });
    },
  });
};

export const useUpdatePaymentProof = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      paymentId,
      data,
    }: {
      paymentId: number;
      data: UpdatePaymentProofRequest;
    }) => paymentService.updatePaymentProof(paymentId, data),
    onSuccess: (_result, { paymentId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.payments.detail(paymentId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.payments.all });
    },
  });
};

