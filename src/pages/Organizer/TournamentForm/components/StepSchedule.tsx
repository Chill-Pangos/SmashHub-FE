import React, { useState } from "react";
import type { StepProps } from "./types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Settings, Clock, Utensils, CheckCircle2, AlertTriangle, ArrowLeft } from "lucide-react";

export const StepSchedule: React.FC<StepProps> = ({ data, updateData, onNext, onBack }) => {
  const [isValidated, setIsValidated] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const handleValidate = () => {
    setIsChecking(true);
    // Mock API validation delay
    setTimeout(() => {
      setIsChecking(false);
      setIsValidated(true);
    }, 1000);
  };

  const schedule = data.schedule;
  const updateSchedule = (fields: Partial<typeof schedule>) => {
    updateData({ schedule: { ...schedule, ...fields } });
    setIsValidated(false); // Re-validate if data changes
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Inputs */}
        <div className="lg:col-span-2 space-y-6">
          {/* Global Parameters */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-primary">
              <Settings className="w-5 h-5" />
              <h3 className="font-semibold">Global Parameters</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground uppercase">Active Tables</Label>
                <Input 
                  type="number" 
                  value={schedule.activeTables}
                  onChange={(e) => updateSchedule({ activeTables: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground uppercase">Base Match Duration (Min)</Label>
                <Input 
                  type="number" 
                  value={schedule.matchDurationMinutes}
                  onChange={(e) => updateSchedule({ matchDurationMinutes: Number(e.target.value) })}
                />
              </div>
            </div>
          </section>

          {/* Operating Hours */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-primary">
              <Clock className="w-5 h-5" />
              <h3 className="font-semibold">Operating Hours</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground uppercase">Facility Open</Label>
                <Input 
                  type="time" 
                  value={schedule.dailyStartTime}
                  onChange={(e) => updateSchedule({ dailyStartTime: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground uppercase">Facility Close</Label>
                <Input 
                  type="time" 
                  value={schedule.dailyEndTime}
                  onChange={(e) => updateSchedule({ dailyEndTime: e.target.value })}
                />
              </div>
            </div>
          </section>

          {/* Scheduled Breaks */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-primary">
                <Utensils className="w-5 h-5" />
                <h3 className="font-semibold">Scheduled Breaks</h3>
              </div>
              <Switch 
                checked={schedule.hasBreak} 
                onCheckedChange={(val: boolean) => updateSchedule({ hasBreak: val })} 
              />
            </div>
            {schedule.hasBreak && (
              <div className="grid grid-cols-2 gap-4 animate-in fade-in">
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground uppercase">Break Start Time</Label>
                  <Input 
                    type="time" 
                    value={schedule.breakStartTime}
                    onChange={(e) => updateSchedule({ breakStartTime: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground uppercase">Duration (Min)</Label>
                  <Input 
                    type="number" 
                    value={schedule.breakDurationMinutes}
                    onChange={(e) => updateSchedule({ breakDurationMinutes: Number(e.target.value) })}
                  />
                </div>
              </div>
            )}
            
            <div className="pt-2">
              <Button 
                variant="outline" 
                className="w-full border-primary/50 text-primary hover:bg-primary/10"
                onClick={handleValidate}
                disabled={isChecking}
              >
                {isChecking ? "Validating..." : "Validate Configuration"}
              </Button>
            </div>
          </section>
        </div>

        {/* Right Col: Validation Engine */}
        <div className="lg:col-span-1">
          <div className="p-5 rounded-xl border border-border bg-card/50 h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-sm">Validation Engine</h3>
              <span className={`text-[10px] uppercase px-2 py-1 rounded-full font-semibold ${isValidated ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                {isValidated ? "System Ready" : "Pending"}
              </span>
            </div>

            {isValidated ? (
              <div className="flex-1 space-y-6">
                <div className="flex flex-col items-center justify-center text-center p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <CheckCircle2 className="w-12 h-12 text-primary mb-2" />
                  <h4 className="font-bold text-lg text-foreground">Configuration Valid</h4>
                  <p className="text-xs text-muted-foreground mt-1">Capacity, timing constraints, and table allocations have passed simulation.</p>
                </div>
                
                <ul className="space-y-3 text-sm">
                  <li className="flex gap-2 text-foreground">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Capacity Resolution</p>
                      <p className="text-xs text-muted-foreground">{schedule.activeTables} tables support requested match volume.</p>
                    </div>
                  </li>
                  <li className="flex gap-2 text-foreground">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Time Constraints</p>
                      <p className="text-xs text-muted-foreground">Matches fit within {schedule.dailyStartTime} - {schedule.dailyEndTime} window.</p>
                    </div>
                  </li>
                  <li className="flex gap-2 text-warning">
                    <AlertTriangle className="w-4 h-4 text-chart-4 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-chart-4">Margin Warning</p>
                      <p className="text-xs text-muted-foreground">Only 5 min buffer between knockout stages.</p>
                    </div>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-center p-4">
                <p className="text-sm text-muted-foreground">Run validation to check if the schedule supports the requested category entries.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border/50">
        <Button variant="ghost" onClick={onBack} className="text-muted-foreground">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button 
          onClick={onNext} 
          disabled={!isValidated}
          className="bg-primary text-primary-foreground px-8"
        >
          {isValidated ? "NEXT: REVIEW" : "VALIDATE TO CONTINUE"}
        </Button>
      </div>
    </div>
  );
};