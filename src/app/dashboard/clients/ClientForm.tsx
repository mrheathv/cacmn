"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  client?: {
    id: string;
    name: string;
    type: string;
    contactName: string | null;
    email: string | null;
    phone: string | null;
    address: string | null;
    city: string | null;
    state: string;
    zip: string | null;
    notes: string | null;
    active: boolean;
  };
}

export default function ClientForm({ client }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const url = client ? `/api/clients/${client.id}` : "/api/clients";
    const method = client ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, active: data.active === "on" || data.active === "true" }),
    });

    if (res.ok) {
      const result = await res.json();
      router.push(`/dashboard/clients/${result.id}`);
    } else {
      setError("Something went wrong");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Company / Client Name *</label>
          <input name="name" required defaultValue={client?.name} placeholder="ABC Property Management"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
          <select name="type" defaultValue={client?.type ?? "COMMERCIAL"}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500">
            <option value="COMMERCIAL">Commercial</option>
            <option value="HOA">HOA / Condo Association</option>
            <option value="RESIDENTIAL">Residential</option>
            <option value="OTHER">Other</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Primary Contact</label>
          <input name="contactName" defaultValue={client?.contactName ?? ""} placeholder="John Smith"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input name="email" type="email" defaultValue={client?.email ?? ""} placeholder="contact@company.com"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input name="phone" type="tel" defaultValue={client?.phone ?? ""} placeholder="(612) 555-0100"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500" />
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
          <input name="address" defaultValue={client?.address ?? ""} placeholder="123 Main St"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
          <input name="city" defaultValue={client?.city ?? ""} placeholder="Minneapolis"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
            <input name="state" defaultValue={client?.state ?? "MN"}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ZIP</label>
            <input name="zip" defaultValue={client?.zip ?? ""} placeholder="55401"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500" />
          </div>
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
          <textarea name="notes" rows={3} defaultValue={client?.notes ?? ""}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none" />
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="active" name="active" defaultChecked={client?.active ?? true} className="w-4 h-4 text-orange-500 rounded" />
          <label htmlFor="active" className="text-sm text-gray-700">Active client</label>
        </div>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>}

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading}
          className="px-6 py-2.5 rounded-xl text-white text-sm font-semibold disabled:opacity-70 hover:opacity-90 transition-opacity"
          style={{ background: "#f97316" }}>
          {loading ? "Saving..." : client ? "Update Client" : "Create Client"}
        </button>
        <button type="button" onClick={() => router.back()}
          className="px-6 py-2.5 rounded-xl text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">
          Cancel
        </button>
      </div>
    </form>
  );
}
