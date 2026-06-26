import { z } from "zod";

type TFunction = (key: string, options?: any) => string;

// Common patterns
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/;

export const getLoginSchema = (t: TFunction) => 
  z.object({
    email: z.string()
      .min(1, t("validation.auth.emailRequired"))
      .email(t("validation.auth.emailInvalid")),
    password: z.string()
      .min(1, t("validation.auth.passwordRequired")),
  });

export const getRegisterSchema = (t: TFunction) =>
  z.object({
    firstName: z.string().min(2, t("validation.auth.nameMinLength", { field: t("validation.fields.firstName") })),
    lastName: z.string().min(2, t("validation.auth.nameMinLength", { field: t("validation.fields.lastName") })),
    email: z.string()
      .min(1, t("validation.auth.emailRequired"))
      .email(t("validation.auth.emailInvalid")),
    password: z.string()
      .min(8, t("validation.auth.passwordMinLength"))
      .regex(passwordRegex, t("validation.auth.passwordTooWeak")),
    confirmPassword: z.string()
      .min(1, t("validation.auth.confirmPasswordRequired"))
  }).refine((data) => data.password === data.confirmPassword, {
    message: t("validation.auth.confirmPasswordMismatch"),
    path: ["confirmPassword"],
  });

export const getForgotPasswordSchema = (t: TFunction) =>
  z.object({
    email: z.string()
      .min(1, t("validation.auth.emailRequired"))
      .email(t("validation.auth.emailInvalid")),
  });

export const getResetPasswordSchema = (t: TFunction) =>
  z.object({
    otpCode: z.string()
      .min(6, t("validation.auth.otpInvalid"))
      .max(6, t("validation.auth.otpInvalid"))
      .regex(/^\d+$/, t("validation.auth.otpInvalid")),
    newPassword: z.string()
      .min(8, t("validation.auth.passwordMinLength"))
      .regex(passwordRegex, t("validation.auth.passwordTooWeak")),
    confirmPassword: z.string()
      .min(1, t("validation.auth.confirmPasswordRequired"))
  }).refine((data) => data.newPassword === data.confirmPassword, {
    message: t("validation.auth.confirmPasswordMismatch"),
    path: ["confirmPassword"],
  });

export const getChangePasswordSchema = (t: TFunction) =>
  z.object({
    oldPassword: z.string().min(1, t("validation.auth.oldPasswordRequired")),
    newPassword: z.string()
      .min(8, t("validation.auth.passwordMinLength"))
      .regex(passwordRegex, t("validation.auth.passwordTooWeak")),
    confirmPassword: z.string()
      .min(1, t("validation.auth.confirmPasswordRequired"))
  }).refine((data) => data.newPassword === data.confirmPassword, {
    message: t("validation.auth.confirmPasswordMismatch"),
    path: ["confirmPassword"],
  }).refine((data) => data.oldPassword !== data.newPassword, {
    message: t("validation.auth.newPasswordMustDiffer"),
    path: ["newPassword"],
  });

export const getVerifyOtpSchema = (t: TFunction) =>
  z.object({
    otp: z.string()
      .min(6, t("validation.auth.otpInvalid"))
      .max(6, t("validation.auth.otpInvalid"))
      .regex(/^\d+$/, t("validation.auth.otpInvalid")),
  });
