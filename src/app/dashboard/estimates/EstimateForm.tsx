"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";

interface Client { id: string; name: string }
interface Project { id: string; name: string; number: string }

interface LineItem {
  id?: string;
  description: string;
  category: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
}

interface Props {
  clients: Client[];
  projects: Project[];
  nextNumber: string;
  defaultProjectId?: string;
  defaultClientId?: string;
  estimate?: {
    id: string;
    number: string;
    title: string;
    status: string;
    clientId: string;
    projectId: string | null;
    validUntil: Date | null;
    notes: string | null;
    taxRate: number;
    lineItems: LineItem[];
  };
}

export default function EstimateForm({ clients, projects, nextNumber, defaultProjectId, defaultClientId, estimate }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [taxRate, setTaxRate] = useState(estimate?.taxRate ?? 0);
  const [items, setItems] = useState<LineItem[]>(
    estimate?.lineItems ?? [{ description: "", category: "LABOR", quantity: 1, unit: "hrs", unitPrice: 0, total: 0 }]
  );

  const subtotal = items.reduce((s, i) => s + i.total, 0);
  const taxAmount = subtotal * (taxRate / 100);
  const total = subtotal + taxAmount;

  function updateItem(index: number, field: keyof LineItem, value: string | number) {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    if (field === "quantity" || field === "unitPrice") {
      updated[index].total = updated[index].quantity * updated[index].unitPrice;
    }
    setItems(updated);
  }

  function addItem() {
    setItems([...items, { description: "", category: "LABOR", quantity: 1, unit: "hrs", unitPrice: 0, total: 0 }]);
  }

  function removeItem(index: number) {
    setItems(items.filter((_, i) => i !== index));
  }

  const fmt = (d: Date | null | undefined) => d ? new Date(d).toISOString().split("T")[0] : "";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = e.currentTarget;
    const fd = new FormData(form);
    const data = {
      number: fd.get("number"),
      title: fd.get("title"),
      status: fd.get("status"),
      clientId: fd.get("clientId"),
      projectId: fd.get("projectId") || null,
      validUntil: fd.get("validUntil") || null,
      notes: fd.get("notes") || null,
      taxRate,
      subtotal,
      total,
      items,
    };
    const url = estimate ? `/api/estimates/${estimate.id}` : "/api/estimates";
    const method = estimate ? "PATCH" : "POST";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    if (res.ok) {
      const result = await res.json();
      router.push(`/dashboard/estimates/${result.id}`);
    } else {
      setError("Something went wrong");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header fields */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Estimate #</label>
            <input name="number" required defaultValue={estimate?.number ?? nextNumber}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select name="status" defaultValue={estimate?.status ?? "DRAFT"}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500">
              <option value="DRAFT">Draft</option>
              <option value="SENT">Sent</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              <option value="REVISED">Revised</option>
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input name="title" required defaultValue={estimate?.title} placeholder="e.g. Office Renovation – Phase 1"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Client *</label>
            <select name="clientId" required defaultValue={estimate?.clientId ?? defaultClientId ?? ""}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500">
              <option value="">Select client...</option>
              {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
            <select name="projectId" defaultValue={estimate?.projectId ?? defaultProjectId ?? ""}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500">
              <option value="">No project</option>
              {projects.map((p) => <option key={p.id} value={p.id}>#{p.number} – {p.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Valid Until</label>
            <input name="validUntil" type="date" defaultValue={fmt(estimate?.validUntil)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tax Rate (%)</label>
            <input type="number" step="0.01" value={taxRate} onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500" />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea name="notes" rows={2} defaultValue={estimate?.notes ?? ""}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none" />
          </div>
        </div>
      </div>

      {/* Line Items */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Line Items</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-4 py-2.5 text-xs font-semibold text-gray-500 w-1/2">Description</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-gray-500">Category</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-gray-500">Qty</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-gray-500">Unit</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-gray-500">Price</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-gray-500">Total</th>
                <th className="px-4 py-2.5 w-8"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {items.map((item, i) => (
                <tr key={i}>
                  <td className="px-4 py-2">
                    <input value={item.description} onChange={(e) => updateItem(i, "description", e.target.value)}
                      placeholder="Description..."
                      className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
                  </td>
                  <td className="px-4 py-2">
                    <select value={item.category} onChange={(e) => updateItem(i, "category", e.target.value)}
                      className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
                      <option value="LABOR">Labor</option>
                      <option value="MATERIAL">Material</option>
                      <option value="SUBCONTRACTOR">Sub</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </td>
                  <td className="px-4 py-2">
                    <input type="number" step="0.01" value={item.quantity}
                      onChange={(e) => updateItem(i, "quantity", parseFloat(e.target.value) || 0)}
                      className="w-20 px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
                  </td>
                  <td className="px-4 py-2">
                    <input value={item.unit} onChange={(e) => updateItem(i, "unit", e.target.value)}
                      className="w-16 px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
                  </td>
                  <td className="px-4 py-2">
                    <input type="number" step="0.01" value={item.unitPrice}
                      onChange={(e) => updateItem(i, "unitPrice", parseFloat(e.target.value) || 0)}
                      className="w-24 px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
                  </td>
                  <td className="px-4 py-2 text-sm font-medium text-gray-900 whitespace-nowrap">
                    ${item.total.toFixed(2)}
                  </td>
                  <td className="px-4 py-2">
                    <button type="button" onClick={() => removeItem(i)} className="text-gray-300 hover:text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-3 border-t border-gray-100">
          <button type="button" onClick={addItem}
            className="flex items-center gap-2 text-sm text-orange-600 hover:text-orange-700 font-medium">
            <Plus className="w-4 h-4" /> Add Line Item
          </button>
        </div>

        {/* Totals */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
          <div className="ml-auto w-64 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span className="font-medium">${subtotal.toFixed(2)}</span>
            </div>
            {taxRate > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Tax ({taxRate}%)</span>
                <span className="font-medium">${taxAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-bold border-t border-gray-200 pt-2">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>}

      <div className="flex gap-3">
        <button type="submit" disabled={loading}
          className="px-6 py-2.5 rounded-xl text-white text-sm font-semibold disabled:opacity-70 hover:opacity-90 transition-opacity"
          style={{ background: "#f97316" }}>
          {loading ? "Saving..." : estimate ? "Update Estimate" : "Create Estimate"}
        </button>
        <button type="button" onClick={() => router.back()}
          className="px-6 py-2.5 rounded-xl text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">
          Cancel
        </button>
      </div>
    </form>
  );
}
