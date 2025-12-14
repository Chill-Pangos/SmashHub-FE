import type React from "react";

import { useState } from "react";
import { Plus } from "lucide-react";

export default function TournamentCreate() {
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    location: "",
    format: "single-elimination",
    maxParticipants: "",
    description: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-card-foreground">
          Create New Tournament
        </h2>
      </div>

      <div className="bg-card border border-border rounded-lg p-6 max-w-2xl">
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">
              Tournament Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Spring Championship 2024"
              className="w-full px-4 py-2 rounded-lg border border-border bg-background text-card-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-2">
                Start Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-2">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., City Arena"
                className="w-full px-4 py-2 rounded-lg border border-border bg-background text-card-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-2">
                Tournament Format
              </label>
              <select
                name="format"
                value={formData.format}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="single-elimination">Single Elimination</option>
                <option value="double-elimination">Double Elimination</option>
                <option value="round-robin">Round Robin</option>
                <option value="swiss">Swiss System</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-2">
                Max Participants
              </label>
              <input
                type="number"
                name="maxParticipants"
                value={formData.maxParticipants}
                onChange={handleChange}
                placeholder="e.g., 32"
                className="w-full px-4 py-2 rounded-lg border border-border bg-background text-card-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Tournament details and rules..."
              rows={4}
              className="w-full px-4 py-2 rounded-lg border border-border bg-background text-card-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground font-medium py-2 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            Create Tournament
          </button>
        </form>
      </div>
    </div>
  );
}
