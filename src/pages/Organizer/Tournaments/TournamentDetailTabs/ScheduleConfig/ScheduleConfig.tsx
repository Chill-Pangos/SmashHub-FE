import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Settings2, Clock, Coffee, Monitor, Hourglass } from "lucide-react";
import { ValidationStats } from "./components/ValidationStats";

interface ScheduleConfigProps {
  tournamentId: number;
}

// Type map từ Backend
export interface ScheduleConfigData {
  id?: number;
  tournamentId: number;
  matchDurationMinutes: number;
  breakDurationMinutes: number;
  dailyStartHour: number;
  dailyStartMinute: number;
  dailyEndHour: number;
  dailyEndMinute: number;
  lunchBreakStartHour: number | null;
  lunchBreakStartMinute: number | null;
  lunchBreakEndHour: number | null;
  lunchBreakEndMinute: number | null;
  lunchBreakDurationMinutes: number | null;
}

export default function ScheduleConfig({ tournamentId }: ScheduleConfigProps) {
  // 👉 CALL REACT QUERY HERE:
  // const { data: configData, isLoading } = useQuery(['schedule-config', tournamentId], fetchScheduleConfig);
  // const saveMutation = useMutation({ mutationFn: saveScheduleConfig });

  // State quản lý Form (Khởi tạo giá trị mặc định khớp với ảnh UI)
  const [tables, setTables] = useState(12);
  const [matchDuration, setMatchDuration] = useState(45);
  
  // Thời gian mở/đóng cửa (dạng string HH:mm AM/PM cho Input type="time" hoặc text)
  const [facilityOpen, setFacilityOpen] = useState("08:00"); // 8 AM
  const [facilityClose, setFacilityClose] = useState("22:00"); // 10 PM
  
  // Trạng thái giờ nghỉ
  const [hasBreaks, setHasBreaks] = useState(true);
  const [breakStartTime, setBreakStartTime] = useState("13:00"); // 1 PM
  const [breakDuration, setBreakDuration] = useState(60);

  // Parse time ra số giờ để truyền vào ValidationStats tính toán
  const openHour = parseInt(facilityOpen.split(":")[0]) || 8;
  const closeHour = parseInt(facilityClose.split(":")[0]) || 22;

  const handleSave = () => {
    // Chuẩn bị payload khớp với type Backend yêu cầu
    const payload: ScheduleConfigData = {
      tournamentId,
      matchDurationMinutes: matchDuration,
      breakDurationMinutes: 10, // Default break between matches
      dailyStartHour: openHour,
      dailyStartMinute: parseInt(facilityOpen.split(":")[1]) || 0,
      dailyEndHour: closeHour,
      dailyEndMinute: parseInt(facilityClose.split(":")[1]) || 0,
      lunchBreakStartHour: hasBreaks ? parseInt(breakStartTime.split(":")[0]) : null,
      lunchBreakStartMinute: hasBreaks ? parseInt(breakStartTime.split(":")[1]) : null,
      lunchBreakEndHour: null, // Có thể tính bằng start + duration nếu backend cần
      lunchBreakEndMinute: null,
      lunchBreakDurationMinutes: hasBreaks ? breakDuration : null,
    };
    
    console.log("Saving Configuration:", payload);
    // saveMutation.mutate(payload);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Schedule Configuration</h2>
          <p className="text-sm text-muted-foreground">
            Manage global timing parameters and table allocations.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-border text-foreground hover:bg-muted">
            Reset to Defaults
          </Button>
          <Button 
            className="bg-primary text-primary-foreground font-bold hover:bg-primary/90 shadow-auth-primary-glow"
            onClick={handleSave}
          >
            Save Configuration
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Forms */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* 1. Global Parameters */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <Settings2 className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-bold text-foreground">Global Parameters</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Number of Tables</label>
                <div className="relative">
                  <Monitor className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    type="number" 
                    value={tables}
                    onChange={(e) => setTables(Number(e.target.value))}
                    className="pl-9 bg-input border-border focus-visible:ring-primary text-foreground" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Base Match Duration (mins)</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    type="number" 
                    value={matchDuration}
                    onChange={(e) => setMatchDuration(Number(e.target.value))}
                    className="pl-9 bg-input border-border focus-visible:ring-primary text-foreground" 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 2. Operating Hours */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <Clock className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-bold text-foreground">Operating Hours</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Facility Open</label>
                <div className="relative">
                  <Input 
                    type="time" 
                    value={facilityOpen}
                    onChange={(e) => setFacilityOpen(e.target.value)}
                    className="pl-3 bg-input border-border focus-visible:ring-primary text-foreground" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Facility Close</label>
                <div className="relative">
                  <Input 
                    type="time" 
                    value={facilityClose}
                    onChange={(e) => setFacilityClose(e.target.value)}
                    className="pl-3 bg-input border-border focus-visible:ring-primary text-foreground" 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 3. Scheduled Breaks */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Coffee className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-bold text-foreground">Scheduled Breaks</h3>
              </div>
              <Switch 
                checked={hasBreaks} 
                onCheckedChange={setHasBreaks}
                className="data-[state=checked]:bg-primary"
              />
            </div>
            
            <div className={`grid grid-cols-1 sm:grid-cols-2 gap-6 transition-opacity duration-300 ${hasBreaks ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Start Time</label>
                <div className="relative">
                  <Input 
                    type="time" 
                    value={breakStartTime}
                    onChange={(e) => setBreakStartTime(e.target.value)}
                    className="pl-3 bg-input border-border focus-visible:ring-primary text-foreground" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Duration (mins)</label>
                <div className="relative">
                  <Hourglass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    type="number" 
                    value={breakDuration}
                    onChange={(e) => setBreakDuration(Number(e.target.value))}
                    className="pl-9 bg-input border-border focus-visible:ring-primary text-foreground" 
                  />
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Validation Stats */}
        <div>
          <ValidationStats 
            tables={tables}
            matchDuration={matchDuration}
            openHour={openHour}
            closeHour={closeHour}
            hasBreaks={hasBreaks}
            breakDuration={breakDuration}
          />
        </div>

      </div>
    </div>
  );
}