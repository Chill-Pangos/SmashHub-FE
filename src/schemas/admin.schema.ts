import { z } from "zod";
import { subYears } from "date-fns";

type TFunction = (key: string, options?: any) => string;

const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;

export const getAdminUserSchema = (t: TFunction, isEdit: boolean) =>
  z.object({
    firstName: z.string().min(1, t("validation.auth.firstNameRequired", "First name is required")),
    lastName: z.string().min(1, t("validation.auth.lastNameRequired", "Last name is required")),
    email: z.string().email(t("validation.auth.emailInvalid", "Invalid email")),
    password: isEdit 
      ? z.string().optional() 
      : z.string()
          .min(8, t("validation.auth.passwordMinLength", "Password must be at least 8 characters"))
          .regex(passwordRegex, t("validation.auth.passwordTooWeak", "Password must contain at least 1 letter and 1 number")),
    gender: z.string().optional().or(z.literal("")),
    phoneNumber: z.string()
      .regex(/^\+?[0-9]{10,15}$/, t("validation.phoneNumber", "Invalid phone number"))
      .optional()
      .or(z.literal("")),
    dob: z.union([z.string(), z.date()]).optional().refine((val) => {
      if (!val) return true;
      const date = new Date(val);
      return date <= subYears(new Date(), 18);
    }, { message: t("validation.dobUnder18", "Must be at least 18 years old") })
  });
