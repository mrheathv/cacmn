"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Client { id: string; name: string }
interface Project { id: string; name: string; number: string }

interface Props {
  clients: Client[];
  projects: Project[];
  nextNumber: string;
  defaultClientId?: string;
  workOrder?: {
    id: string;
    number: string;
    title: string;
    description: string | null;
    status: string;
    priority: string;
    clientId: string;
    projectId: string | null;
    scheduledAt: Date | null;
    laborCost: number;
    materialCost: number;
  };
}

export default function WorkOrderForm({ clients, projects, nextNumber, defaultClientId, workOrder }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fmt = (d: Date | null | undefined) => d ? new Date(d).toISOString().split("T")[0] : "";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const url = workOrder ? `/api/work-orders/${workOrder.id}` : "/api/work-orders";
    const method = workOrder ? "PATCH" : "POST";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    if (res.ok) {
      const result = await res.json();
      router.push(`/dashboard/work-orders/${result.id}`);
    } else {
      setError("Something went wrong");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
          <input name="title" required defaultValue={workOrder?.title} placeholder="e.g. Unit 14 - Drywall Repair"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Work Order #</label>
          <input name="number" required defaultValue={workOrder?.number ?? nextNumber}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
          <select name="priority" defaultValue={workOrder?.priority ?? "NORMAL"}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500">
            <option value="LOW">Low</option>
            <option value="NORMAL">Normal</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Client *</label>
          <select name="clientId" required defaultValue={workOrder?.clientId ?? defaultClientId ?? ""}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500">
            <option value="">Select client...</option>
            {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Project (optional)</label>
          <select name="projectId" defaultValue={workOrder?.projectId ?? ""}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500">
            <option value="">No project</option>
            {projects.map((p) => <option key={p.id} value={p.id}>#{p.number} – {p.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select name="status" defaultValue={workOrder?.status ?? "OPEN"}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500">
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Scheduled Date</label>
          <input name="scheduledAt" type="date" defaultValue={fmt(workOrder?.scheduledAt)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Labor Cost ($)</label>
          <input name="laborCost" type="number" step="0.01" defaultValue={workOrder?.laborCost ?? 0}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Material Cost ($)</label>
          <input name="materialCost" type="number" step="0.01" defaultValue={workOrder?.materialCost ?? 0}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500" />
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea name="description" rows={3} defaultValue={workOrder?.description ?? ""}
            placeholder="Describe the work to be performed..."
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none" />
        </div>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>}

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading}
          className="px-6 py-2.5 rounded-xl text-white text-sm font-semibold disabled:opacity-70 hover:opacity-90 transition-opacity"
          style={{ background: "#f97316" }}>
          {loading ? "Saving..." : workOrder ? "Update" : "Create Work Order"}
        </button>
        <button type="button" onClick={() => router.back()}
          className="px-6 py-2.5 rounded-xl text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">
          Cancel
        </button>
      </div>
    </form>
  );
}
