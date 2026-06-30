"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon, Clock } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { useTranslation } from "@/hooks/useTranslation"
import { toLocalDisplay, toUtcString } from "@/utils/timezone.utils"

export function DateTimePicker({
  date,
  setDate,
  placeholder,
  className,
}: {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
  placeholder?: string
  className?: string
}) {
  const { t } = useTranslation()
  const displayPlaceholder = placeholder || t("components.dateTimePicker.selectDateTime")

  const displayDate = date ? toLocalDisplay(date) : undefined;

  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(displayDate)
  const [time, setTime] = React.useState<string>(
    displayDate ? format(displayDate, "HH:mm") : "00:00"
  )

  React.useEffect(() => {
    const d = date ? toLocalDisplay(date) : undefined;
    setSelectedDate(d)
    if (d) {
      setTime(format(d, "HH:mm"))
    }
  }, [date])

  const handleDateSelect = (newDate: Date | undefined) => {
    setSelectedDate(newDate)
    if (newDate) {
      const [hours, minutes] = time.split(":").map(Number)
      const updatedDate = new Date(newDate)
      updatedDate.setHours(hours || 0, minutes || 0, 0, 0)
      setDate(new Date(toUtcString(updatedDate)))
    } else {
      setDate(undefined)
    }
  }

  const handleTimeChange = (type: "hour" | "minute" | "ampm", value: number | string) => {
    const [currentHour, currentMinute] = time.split(":")
    let newHourStr = currentHour
    let newMinuteStr = currentMinute

    if (type === "hour") {
      const h = value as number
      const isPM = parseInt(currentHour, 10) >= 12
      const newHour = (h % 12) + (isPM ? 12 : 0)
      newHourStr = newHour.toString().padStart(2, "0")
    } else if (type === "minute") {
      newMinuteStr = (value as number).toString().padStart(2, "0")
    } else if (type === "ampm") {
      const h = parseInt(currentHour, 10)
      if (value === "AM" && h >= 12) {
        newHourStr = (h - 12).toString().padStart(2, "0")
      } else if (value === "PM" && h < 12) {
        newHourStr = (h + 12).toString().padStart(2, "0")
      }
    }

    const newTime = `${newHourStr}:${newMinuteStr}`
    setTime(newTime)
    
    if (selectedDate) {
      const updatedDate = new Date(selectedDate)
      const [hours, minutes] = newTime.split(":").map(Number)
      updatedDate.setHours(hours || 0, minutes || 0, 0, 0)
      setDate(new Date(toUtcString(updatedDate)))
    }
  }

  const handleManualTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value
    setTime(newTime)
    if (selectedDate && newTime) {
      const [hours, minutes] = newTime.split(":").map(Number)
      const updatedDate = new Date(selectedDate)
      updatedDate.setHours(hours || 0, minutes || 0, 0, 0)
      setDate(new Date(toUtcString(updatedDate)))
    }
  }

  const [currentHourStr, currentMinuteStr] = time.split(":")
  const currentHour = parseInt(currentHourStr, 10) || 0
  const currentMinute = parseInt(currentMinuteStr, 10) || 0

  const isPM = currentHour >= 12
  const displayHour = currentHour % 12 || 12

  const cx = 110
  const cy = 110
  const rHour = 85
  const rMinute = 45

  const hours = Array.from({ length: 12 }, (_, i) => i === 0 ? 12 : i)
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5)

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
          {displayDate ? format(displayDate, "dd/MM/yyyy HH:mm") : <span>{displayPlaceholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 flex flex-col sm:flex-row" align="start">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          initialFocus
        />
        <div className="border-t sm:border-t-0 sm:border-l border-border p-4 flex flex-col items-center bg-card">
          <div className="flex items-center justify-between w-full mb-4">
            <div className="font-medium text-sm text-muted-foreground">{t("components.dateTimePicker.selectTime")}</div>
            <div className="flex bg-muted rounded-md p-0.5">
              <button
                onClick={() => handleTimeChange("ampm", "AM")}
                className={cn("px-2 py-0.5 text-xs rounded-sm font-medium transition-colors", !isPM ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground")}
              >
                AM
              </button>
              <button
                onClick={() => handleTimeChange("ampm", "PM")}
                className={cn("px-2 py-0.5 text-xs rounded-sm font-medium transition-colors", isPM ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground")}
              >
                PM
              </button>
            </div>
          </div>
          <div className="relative w-[220px] h-[220px] rounded-full bg-muted/30 flex items-center justify-center">
            {/* Center dot */}
            <div className="absolute w-2 h-2 rounded-full bg-primary z-10" />
            
            {/* Hour hand */}
            <div 
              className="absolute w-[2px] bg-primary origin-bottom rounded-full z-10"
              style={{ 
                height: rHour - 10, 
                bottom: "50%", 
                left: "calc(50% - 1px)", 
                transform: `rotate(${(currentHour % 12) * 30}deg)`,
                transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)" 
              }} 
            />

            {/* Minute hand */}
            <div 
              className="absolute w-[2px] bg-primary/50 origin-bottom rounded-full z-10"
              style={{ 
                height: rMinute - 10, 
                bottom: "50%", 
                left: "calc(50% - 1px)", 
                transform: `rotate(${currentMinute * 6}deg)`,
                transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)" 
              }} 
            />

            {/* Hours (Outer ring) */}
            {hours.map(h => {
              const angle = ((h % 12) * 30 - 90) * (Math.PI / 180)
              const x = cx + rHour * Math.cos(angle)
              const y = cy + rHour * Math.sin(angle)
              const isSelected = h === displayHour

              return (
                <button
                  key={`h-${h}`}
                  onClick={() => handleTimeChange("hour", h)}
                  className={cn(
                    "absolute w-7 h-7 -ml-3.5 -mt-3.5 rounded-full flex items-center justify-center text-[12px] hover:bg-primary/20 transition-colors z-20",
                    isSelected ? "bg-primary text-primary-foreground font-bold" : "text-foreground bg-background/30 backdrop-blur-[1px]"
                  )}
                  style={{ left: x, top: y }}
                >
                  {h}
                </button>
              )
            })}

            {/* Minutes (Inner ring) */}
            {minutes.map(m => {
              const angle = (m * 6 - 90) * (Math.PI / 180)
              const x = cx + rMinute * Math.cos(angle)
              const y = cy + rMinute * Math.sin(angle)
              const isSelected = m === currentMinute

              return (
                <button
                  key={`m-${m}`}
                  onClick={() => handleTimeChange("minute", m)}
                  className={cn(
                    "absolute w-6 h-6 -ml-3 -mt-3 rounded-full flex items-center justify-center text-[10px] hover:bg-primary/30 transition-colors z-20",
                    isSelected ? "bg-primary text-primary-foreground font-bold ring-2 ring-background" : "text-muted-foreground bg-background/50 backdrop-blur-sm"
                  )}
                  style={{ left: x, top: y }}
                >
                  {m.toString().padStart(2, "0")}
                </button>
              )
            })}
          </div>

          <div className="mt-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <Input 
              type="time" 
              value={time}
              onChange={handleManualTimeChange}
              className="h-8 w-[100px] text-center"
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
