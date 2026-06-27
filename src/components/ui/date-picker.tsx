"use client"

import { format } from "date-fns"
import { vi, enUS } from "date-fns/locale"
import { Calendar as CalendarIcon } from "lucide-react"
import { useTranslation } from "@/hooks/useTranslation"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function DatePicker({
  date,
  setDate,
  placeholder = "Chọn ngày",
  className,
}: {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
  placeholder?: string
  className?: string
}) {
  const { currentLanguage } = useTranslation()
  const locale = currentLanguage === "vi" ? vi : enUS

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal bg-input/50",
            !date && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "dd/MM/yyyy", { locale }) : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
          captionLayout="dropdown-buttons"
          fromYear={1900}
          toYear={new Date().getFullYear()}
          locale={locale}
        />
      </PopoverContent>
    </Popover>
  )
}
