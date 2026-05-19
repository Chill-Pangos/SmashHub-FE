import React from "react";
import type { StepProps } from "./types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Info, Users, Trash2 } from "lucide-react";

export const StepGeneral: React.FC<StepProps> = ({ data, updateData, onNext }) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Tournament Details */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-primary">
          <Info className="w-5 h-5" />
          <h3 className="font-semibold text-lg">Tournament Details</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-muted-foreground uppercase">Tournament Name</Label>
            <Input 
              placeholder="e.g. Binh Duong Open 2026" 
              value={data.name}
              onChange={(e) => updateData({ name: e.target.value })}
              className="bg-input/50"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-muted-foreground uppercase">Event Tier</Label>
            <Select value={data.tier} onValueChange={(val) => updateData({ tier: val })}>
              <SelectTrigger className="bg-input/50">
                <SelectValue placeholder="Select tier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pro">Pro Circuit (Tier 1)</SelectItem>
                <SelectItem value="challenger">Challenger (Tier 2)</SelectItem>
                <SelectItem value="local">Local Open (Tier 3)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2 md:col-span-1">
            <Label className="text-xs font-semibold text-muted-foreground uppercase">Location / Venue</Label>
            <Input 
              placeholder="Search venues..." 
              value={data.location}
              onChange={(e) => updateData({ location: e.target.value })}
              className="bg-input/50"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-muted-foreground uppercase">Start Date</Label>
            <Input 
              type="date" 
              value={data.startDate}
              onChange={(e) => updateData({ startDate: e.target.value })}
              className="bg-input/50"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-muted-foreground uppercase">End Date</Label>
            <Input 
              type="date" 
              value={data.endDate}
              onChange={(e) => updateData({ endDate: e.target.value })}
              className="bg-input/50"
            />
          </div>
        </div>
      </section>

      {/* Category Definition */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary">
            <Users className="w-5 h-5" />
            <h3 className="font-semibold text-lg">Category Definition</h3>
          </div>
          <Button variant="outline" size="sm" className="border-border text-primary" disabled>
            + Add Category
          </Button>
        </div>

        <div className="p-4 rounded-lg border border-border bg-card space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            <div className="space-y-2 md:col-span-4">
              <Label className="text-xs font-semibold text-muted-foreground uppercase">Format</Label>
              <Select 
                value={data.category.format} 
                onValueChange={(val) => updateData({ category: { ...data.category, format: val }})}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mens_singles">Men's Singles</SelectItem>
                  <SelectItem value="womens_singles">Women's Singles</SelectItem>
                  <SelectItem value="mixed_doubles">Mixed Doubles</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 md:col-span-3">
              <Label className="text-xs font-semibold text-muted-foreground uppercase">Max Entries</Label>
              <Input 
                type="number" 
                value={data.category.maxEntries}
                onChange={(e) => updateData({ category: { ...data.category, maxEntries: Number(e.target.value) }})}
                className="bg-background"
              />
            </div>
            <div className="space-y-2 md:col-span-4">
              <Label className="text-xs font-semibold text-muted-foreground uppercase">Point System</Label>
              <Select 
                value={data.category.pointSystem} 
                onValueChange={(val) => updateData({ category: { ...data.category, pointSystem: val }})}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select system" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard_11">Standard (Best of 5, 11 pts)</SelectItem>
                  <SelectItem value="pro_1000">Pro Circuit (1000 pts base)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-1 flex justify-center pb-2">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="flex justify-end pt-4">
        <Button onClick={onNext} className="bg-primary text-primary-foreground hover:bg-primary/90 px-8">
          NEXT: SCHEDULE SETUP →
        </Button>
      </div>
    </div>
  );
};