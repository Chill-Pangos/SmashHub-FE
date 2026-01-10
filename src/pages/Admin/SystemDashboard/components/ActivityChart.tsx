import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

interface ActivityData {
  date: string;
  users: number;
  matches: number;
  tournaments: number;
}

const mockActivityData: ActivityData[] = [
  { date: "01/01", users: 120, matches: 45, tournaments: 3 },
  { date: "02/01", users: 145, matches: 52, tournaments: 4 },
  { date: "03/01", users: 132, matches: 48, tournaments: 3 },
  { date: "04/01", users: 168, matches: 61, tournaments: 5 },
  { date: "05/01", users: 195, matches: 73, tournaments: 6 },
  { date: "06/01", users: 178, matches: 68, tournaments: 5 },
  { date: "07/01", users: 210, matches: 82, tournaments: 7 },
];

export default function ActivityChart() {
  const maxUsers = Math.max(...mockActivityData.map((d) => d.users));
  const maxMatches = Math.max(...mockActivityData.map((d) => d.matches));

  const lastWeekUsers = mockActivityData[mockActivityData.length - 2].users;
  const currentUsers = mockActivityData[mockActivityData.length - 1].users;
  const userGrowth = (
    ((currentUsers - lastWeekUsers) / lastWeekUsers) *
    100
  ).toFixed(1);
  const isGrowthPositive = parseFloat(userGrowth) > 0;

  return (
    <Card className="p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-semibold">Hoạt động hệ thống</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Thống kê 7 ngày gần nhất
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isGrowthPositive ? (
            <TrendingUp className="h-5 w-5 text-green-500" />
          ) : (
            <TrendingDown className="h-5 w-5 text-red-500" />
          )}
          <span
            className={`text-sm font-semibold ${
              isGrowthPositive ? "text-green-500" : "text-red-500"
            }`}
          >
            {userGrowth}%
          </span>
        </div>
      </div>

      <div className="space-y-6">
        {/* Simple Bar Chart */}
        <div className="space-y-4">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span>Người dùng</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>Trận đấu</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500"></div>
              <span>Giải đấu</span>
            </div>
          </div>

          <div className="h-64 flex items-end justify-between gap-2">
            {mockActivityData.map((data, index) => {
              const userHeight = (data.users / maxUsers) * 100;
              const matchHeight = (data.matches / maxMatches) * 100;

              return (
                <div
                  key={index}
                  className="flex-1 flex flex-col items-center gap-2"
                >
                  <div className="w-full flex items-end justify-center gap-1 h-48">
                    <div
                      className="w-full bg-blue-500 rounded-t transition-all hover:bg-blue-600 cursor-pointer"
                      style={{ height: `${userHeight}%` }}
                      title={`${data.users} người dùng`}
                    ></div>
                    <div
                      className="w-full bg-green-500 rounded-t transition-all hover:bg-green-600 cursor-pointer"
                      style={{ height: `${matchHeight}%` }}
                      title={`${data.matches} trận đấu`}
                    ></div>
                    <div
                      className="w-full bg-purple-500 rounded-t transition-all hover:bg-purple-600 cursor-pointer"
                      style={{ height: `${data.tournaments * 10}%` }}
                      title={`${data.tournaments} giải đấu`}
                    ></div>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {data.date}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-500">{currentUsers}</p>
            <p className="text-xs text-muted-foreground">
              Người dùng hoạt động
            </p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-500">
              {mockActivityData[mockActivityData.length - 1].matches}
            </p>
            <p className="text-xs text-muted-foreground">Trận đấu hôm nay</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-500">
              {mockActivityData[mockActivityData.length - 1].tournaments}
            </p>
            <p className="text-xs text-muted-foreground">
              Giải đấu đang diễn ra
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
