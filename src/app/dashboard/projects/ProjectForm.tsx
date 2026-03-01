"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Client { id: string; name: string }
interface UserItem { id: string; name: string | null }

interface Props {
  clients: Client[];
  users: UserItem[];
  nextNumber: string;
  project?: {
    id: string;
    name: string;
    number: string;
    status: string;
    type: string;
    description: string | null;
    address: string | null;
    city: string | null;
    startDate: Date | null;
    endDate: Date | null;
    budget: number | null;
    clientId: string;
    managerId: string | null;
  };
}

export default function ProjectForm({ clients, users, nextNumber, project }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    const url = project ? `/api/projects/${project.id}` : "/api/projects";
    const method = project ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      const result = await res.json();
      router.push(`/dashboard/projects/${result.id}`);
    } else {
      const err = await res.json();
      setError(err.error ?? "Something went wrong");
      setLoading(false);
    }
  }

  const fmt = (d: Date | null | undefined) =>
    d ? new Date(d).toISOString().split("T")[0] : "";

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Project Name *</label>
          <input
            name="name"
            required
            defaultValue={project?.name}
            placeholder="e.g. Downtown Office Remodel"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Project Number</label>
          <input
            name="number"
            required
            defaultValue={project?.number ?? nextNumber}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
          <select
            name="type"
            defaultValue={project?.type ?? "COMMERCIAL"}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="COMMERCIAL">Commercial</option>
            <option value="HOA">HOA / Condo Association</option>
            <option value="SPECIAL">Special Projects</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Client *</label>
          <select
            name="clientId"
            required
            defaultValue={project?.clientId}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="">Select client...</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Project Manager</label>
          <select
            name="managerId"
            defaultValue={project?.managerId ?? ""}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="">Unassigned</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            name="status"
            defaultValue={project?.status ?? "BIDDING"}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="BIDDING">Bidding</option>
            <option value="ACTIVE">Active</option>
            <option value="ON_HOLD">On Hold</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Budget ($)</label>
          <input
            name="budget"
            type="number"
            step="0.01"
            defaultValue={project?.budget ?? ""}
            placeholder="0.00"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
          <input
            name="startDate"
            type="date"
            defaultValue={fmt(project?.startDate)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
          <input
            name="endDate"
            type="date"
            defaultValue={fmt(project?.endDate)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Site Address</label>
          <input
            name="address"
            defaultValue={project?.address ?? ""}
            placeholder="123 Main St"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
          <input
            name="city"
            defaultValue={project?.city ?? ""}
            placeholder="Minneapolis"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            rows={3}
            defaultValue={project?.description ?? ""}
            placeholder="Project scope, special notes..."
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 rounded-xl text-white text-sm font-semibold disabled:opacity-70 hover:opacity-90 transition-opacity"
          style={{ background: "#f97316" }}
        >
          {loading ? "Saving..." : project ? "Update Project" : "Create Project"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2.5 rounded-xl text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
