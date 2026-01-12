import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { day: "T2", complaints: 5, resolved: 4 },
  { day: "T3", complaints: 8, resolved: 6 },
  { day: "T4", complaints: 6, resolved: 5 },
  { day: "T5", complaints: 10, resolved: 8 },
  { day: "T6", complaints: 12, resolved: 10 },
  { day: "T7", complaints: 9, resolved: 7 },
  { day: "CN", complaints: 7, resolved: 6 },
];

export default function ActivityChart() {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Hoạt động 7 ngày</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="complaints" fill="#f97316" name="Khiếu nại" radius={[4, 4, 0, 0]} />
          <Bar dataKey="resolved" fill="#22c55e" name="Đã giải quyết" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
      
      <div className="flex items-center justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-orange-500 rounded"></div>
          <span className="text-sm text-muted-foreground">Khiếu nại</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span className="text-sm text-muted-foreground">Đã giải quyết</span>
        </div>
      </div>
    </Card>
  );
}
