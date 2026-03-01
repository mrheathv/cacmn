"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Project { id: string; name: string }
interface UserItem { id: string; name: string | null }

interface Props {
  projects: Project[];
  users: UserItem[];
  defaultProjectId?: string;
  currentUserId?: string;
  report?: {
    id: string;
    projectId: string;
    authorId: string;
    date: Date;
    weather: string | null;
    crewCount: number;
    hoursWorked: number;
    workPerformed: string | null;
    issues: string | null;
    safetyNotes: string | null;
  };
}

export default function FieldReportForm({ projects, users, defaultProjectId, currentUserId, report }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fmt = (d: Date | null | undefined) => d ? new Date(d).toISOString().split("T")[0] : new Date().toISOString().split("T")[0];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const url = report ? `/api/field-reports/${report.id}` : "/api/field-reports";
    const method = report ? "PATCH" : "POST";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    if (res.ok) {
      router.push("/dashboard/field-reports");
    } else {
      setError("Something went wrong");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Project *</label>
          <select name="projectId" required defaultValue={report?.projectId ?? defaultProjectId ?? ""}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500">
            <option value="">Select project...</option>
            {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Report Author</label>
          <select name="authorId" defaultValue={report?.authorId ?? currentUserId ?? ""}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500">
            <option value="">Select author...</option>
            {users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <input name="date" type="date" defaultValue={fmt(report?.date)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Weather</label>
          <input name="weather" defaultValue={report?.weather ?? ""} placeholder="e.g. Sunny, 45°F"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Crew Count</label>
          <input name="crewCount" type="number" min="0" defaultValue={report?.crewCount ?? 0}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Hours Worked</label>
          <input name="hoursWorked" type="number" step="0.5" min="0" defaultValue={report?.hoursWorked ?? 0}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500" />
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Work Performed *</label>
          <textarea name="workPerformed" rows={4} required defaultValue={report?.workPerformed ?? ""}
            placeholder="Describe the work completed today..."
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none" />
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Issues / Delays</label>
          <textarea name="issues" rows={2} defaultValue={report?.issues ?? ""}
            placeholder="Any problems, delays, or items needing attention..."
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none" />
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Safety Notes</label>
          <textarea name="safetyNotes" rows={2} defaultValue={report?.safetyNotes ?? ""}
            placeholder="Safety observations, incidents, or toolbox topics..."
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none" />
        </div>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>}

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading}
          className="px-6 py-2.5 rounded-xl text-white text-sm font-semibold disabled:opacity-70 hover:opacity-90 transition-opacity"
          style={{ background: "#f97316" }}>
          {loading ? "Saving..." : report ? "Update Report" : "Submit Report"}
        </button>
        <button type="button" onClick={() => router.back()}
          className="px-6 py-2.5 rounded-xl text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">
          Cancel
        </button>
      </div>
    </form>
  );
}
