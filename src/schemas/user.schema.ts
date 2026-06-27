import { z } from "zod";
import { subYears } from "date-fns";

type TFunction = (key: string, options?: any) => string;

export const getUserProfileSchema = (t: TFunction) =>
  z.object({
    phoneNumber: z.string()
      .regex(/^\+?[0-9]{10,15}$/, t("validation.phoneNumber"))
      .optional()
      .or(z.literal("")),
    dob: z.date({
      message: t("validation.dobRequired"),
    }).max(subYears(new Date(), 18), t("validation.dobUnder18")),
    gender: z.string().optional().or(z.literal("")),
  });

