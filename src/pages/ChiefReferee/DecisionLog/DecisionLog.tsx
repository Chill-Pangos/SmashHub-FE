import { DecisionHistory, DecisionDetail } from "./components";

export default function DecisionLog() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Nhật ký quyết định</h2>
        <p className="text-sm text-muted-foreground">Lịch sử các quyết định và phán quyết</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DecisionHistory />
        </div>
        <div>
          <DecisionDetail />
        </div>
      </div>
    </div>
  );
}
