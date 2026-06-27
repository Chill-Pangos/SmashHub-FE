import { z } from "zod";

type TFunction = (key: string, options?: any) => string;

export const getCategorySchema = (t: TFunction) =>
  z.object({
    name: z.string().min(1, t("validation.tournament.categoryNameRequired", "Category name is required")),
    type: z.enum(["single", "double", "team"]),
    maxEntries: z.number().min(2, t("validation.tournament.minEntries2", "Minimum 2 entries required")),
    maxSets: z.number().min(1).max(7),
    teamFormat: z.string().nullable(),
    minAge: z.number().nullable(),
    maxAge: z.number().nullable(),
    minElo: z.number().nullable(),
    maxElo: z.number().nullable(),
    maxMembersPerEntry: z.number().nullable(),
    gender: z.enum(["male", "female", "mixed"]),
    isGroupStage: z.boolean(),
    entryFee: z.union([z.number(), z.string()]).nullable(),
    numberOfSingles: z.number().min(0),
    numberOfDoubles: z.number().min(0),
  });

export const getTournamentSchema = (t: TFunction) =>
  z.object({
    name: z.string().min(3, t("validation.tournament.nameMinLength", "Name must be at least 3 characters")),
    tier: z.number().min(1).max(3),
    location: z.string().min(3, t("validation.tournament.locationRequired", "Location is required")),
    startDate: z.string().min(1, t("validation.tournament.startDateRequired", "Start date is required")),
    endDate: z.string().min(1, t("validation.tournament.endDateRequired", "End date is required")),
    registrationStartDate: z.string().min(1, t("validation.tournament.registrationStartDateRequired", "Registration start date is required")),
    registrationEndDate: z.string().min(1, t("validation.tournament.registrationEndDateRequired", "Registration end date is required")),
    bracketGenerationDate: z.string().min(1, t("validation.tournament.bracketGenerationDateRequired", "Bracket generation date is required")),
    categories: z.array(getCategorySchema(t)).min(1, t("validation.tournament.minOneCategory", "At least one category is required")),
    schedule: z.object({
      activeTables: z.number().min(1, t("validation.tournament.minOneTable", "At least one table is required")),
      matchDurationMinutes: z.number().min(1, t("validation.tournament.minMatchDuration", "Match duration must be at least 1 minute")),
      dailyStartTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, t("validation.tournament.invalidTime", "Invalid time format")),
      dailyEndTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, t("validation.tournament.invalidTime", "Invalid time format")),
      hasBreak: z.boolean(),
      breakStartTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, t("validation.tournament.invalidTime", "Invalid time format")),
      breakDurationMinutes: z.number().min(0),
      notes: z.string().optional(),
    }),
  });
