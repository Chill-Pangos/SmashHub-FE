import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSendNotification } from "@/hooks/queries/useNotificationQueries";
import { toast } from "sonner";
import { Send } from "lucide-react";

export default function SendNotificationForm() {
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    type: "system",
    broadcast: true,
    userId: "",
    roomId: "",
  });

  const sendNotification = useSendNotification();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.message) {
      toast.error("Title and Message are required");
      return;
    }

    sendNotification.mutate(formData, {
      onSuccess: () => {
        toast.success("Notification sent successfully");
        setFormData({
          title: "",
          message: "",
          type: "system",
          broadcast: true,
          userId: "",
          roomId: "",
        });
      },
      onError: (err: any) => {
        toast.error(err.message || "Failed to send notification");
      },
    });
  };

  return (
    <div className="bg-card border rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <Send className="h-5 w-5 text-primary" />
        Send Live Notification
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title <span className="text-destructive">*</span></Label>
              <Input
                id="title"
                name="title"
                placeholder="Notification Title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Notification Type</Label>
              <Select
                value={formData.type}
                onValueChange={(val) => setFormData({ ...formData, type: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="system">System</SelectItem>
                  <SelectItem value="match_update">Match Update</SelectItem>
                  <SelectItem value="tournament_start">Tournament Start</SelectItem>
                  <SelectItem value="alert">Alert</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message <span className="text-destructive">*</span></Label>
            <Textarea
              id="message"
              name="message"
              placeholder="Enter your notification message here..."
              value={formData.message}
              onChange={handleChange}
              rows={4}
              required
            />
          </div>

          <div className="p-4 border rounded-md bg-muted/30 space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Broadcast to all connected users</Label>
                <p className="text-sm text-muted-foreground">
                  If disabled, you must provide a Target User ID or Room ID.
                </p>
              </div>
              <Switch
                checked={formData.broadcast}
                onCheckedChange={(val) => setFormData({ ...formData, broadcast: val })}
              />
            </div>

            {!formData.broadcast && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                <div className="space-y-2">
                  <Label htmlFor="userId">Target User ID</Label>
                  <Input
                    id="userId"
                    name="userId"
                    placeholder="e.g. 123"
                    value={formData.userId}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="roomId">Target Room ID</Label>
                  <Input
                    id="roomId"
                    name="roomId"
                    placeholder="e.g. match-456"
                    value={formData.roomId}
                    onChange={handleChange}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={sendNotification.isPending}>
            {sendNotification.isPending ? "Sending..." : "Send Notification"}
          </Button>
        </div>
      </form>
    </div>
  );
}
