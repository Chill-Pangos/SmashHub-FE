import { Save } from "lucide-react";
import { useState } from "react";

export default function TournamentSettings() {
  const [settings, setSettings] = useState({
    autoNotifications: true,
    sendEmails: true,
    allowRegistrationChanges: true,
    showPublicLeaderboard: true,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-card-foreground">
          Tournament Settings
        </h2>
      </div>

      <div className="bg-card border border-border rounded-lg p-6 max-w-2xl space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-card-foreground">
            Notifications
          </h3>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.autoNotifications}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  autoNotifications: e.target.checked,
                }))
              }
              className="w-4 h-4 rounded border-border"
            />
            <span className="text-card-foreground">
              Enable automatic notifications
            </span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.sendEmails}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  sendEmails: e.target.checked,
                }))
              }
              className="w-4 h-4 rounded border-border"
            />
            <span className="text-card-foreground">
              Send email notifications
            </span>
          </label>
        </div>

        <div className="border-t border-border pt-6 space-y-4">
          <h3 className="text-lg font-semibold text-card-foreground">
            Registration
          </h3>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.allowRegistrationChanges}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  allowRegistrationChanges: e.target.checked,
                }))
              }
              className="w-4 h-4 rounded border-border"
            />
            <span className="text-card-foreground">
              Allow registration changes after signup
            </span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.showPublicLeaderboard}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  showPublicLeaderboard: e.target.checked,
                }))
              }
              className="w-4 h-4 rounded border-border"
            />
            <span className="text-card-foreground">
              Show public leaderboard
            </span>
          </label>
        </div>

        <button className="w-full bg-primary text-primary-foreground font-medium py-2 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
          <Save size={20} />
          Save Settings
        </button>
      </div>
    </div>
  );
}
