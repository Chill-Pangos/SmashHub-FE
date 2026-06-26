import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { UseFormProps, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { showToast } from "@/utils/toast.utils";

interface UseZodFormProps<T extends z.ZodType<any, any>> extends Omit<UseFormProps<z.infer<T>>, "resolver"> {
  schema: T;
  showErrorToast?: boolean;
}

export function useZodForm<T extends z.ZodType<any, any>>({
  schema,
  showErrorToast = true,
  ...formProps
}: UseZodFormProps<T>): UseFormReturn<z.infer<T>> {
  const form = useForm<z.infer<T>>({
    ...formProps,
    resolver: zodResolver(schema) as any,
  });

  const { errors } = form.formState;

  useEffect(() => {
    if (showErrorToast && Object.keys(errors).length > 0 && form.formState.submitCount > 0) {
      // Get the first error message
      const firstErrorKey = Object.keys(errors)[0];
      const errorMsg = (errors as any)[firstErrorKey]?.message as string;
      if (errorMsg) {
        showToast.error(errorMsg);
      }
    }
  }, [errors, form.formState.submitCount, showErrorToast]);

  return form;
}

