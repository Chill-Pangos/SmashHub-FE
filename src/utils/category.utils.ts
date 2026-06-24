import type { TFunction } from "i18next";
import type { TournamentContent } from "@/types";

export const formatCategoryName = (category: TournamentContent | any, t: TFunction) => {
  if (!category) return "";
  
  const typeText = t(`constants.format.${category.type}`, category.type) as string;
  let genderText = category.gender ? (t(`constants.gender.${category.gender}`, category.gender) as string) : "";
  
  let ageText = "";
  if (category.minAge && category.maxAge) {
    ageText = `U${category.maxAge}`;
  } else if (category.minAge) {
    ageText = `${category.minAge}+`;
  } else if (category.maxAge) {
    ageText = `U${category.maxAge}`;
  }

  const lang = t("common.language", { defaultValue: "en" });
  
  if (lang === "vi") {
    // Đơn Nam U18
    return [typeText, genderText, ageText].filter(Boolean).join(" ");
  } else {
    // U18 Men's Singles
    if (typeof genderText === "string") {
      if (genderText.toLowerCase() === "male") genderText = "Men's";
      if (genderText.toLowerCase() === "female") genderText = "Women's";
      if (genderText.toLowerCase() === "mixed") genderText = "Mixed";
    }
    
    // Add 's' to type for english if not present
    let typeEng = typeText;
    if (typeof typeEng === "string") {
      if (typeEng.toLowerCase() === "single") typeEng = "Singles";
      if (typeEng.toLowerCase() === "double") typeEng = "Doubles";
    }
    
    return [ageText, genderText, typeEng].filter(Boolean).join(" ");
  }
};
