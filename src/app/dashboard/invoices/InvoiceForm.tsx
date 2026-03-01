"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";

interface Client { id: string; name: string }
interface Project { id: string; name: string; number: string }

interface LineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface Props {
  clients: Client[];
  projects: Project[];
  nextNumber: string;
  defaultProjectId?: string;
  defaultClientId?: string;
  invoice?: {
    id: string;
    number: string;
    status: string;
    clientId: string;
    projectId: string | null;
    issueDate: Date;
    dueDate: Date | null;
    taxRate: number;
    notes: string | null;
    amountPaid: number;
    lineItems: LineItem[];
  };
}

export default function InvoiceForm({ clients, projects, nextNumber, defaultProjectId, defaultClientId, invoice }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [taxRate, setTaxRate] = useState(invoice?.taxRate ?? 0);
  const [items, setItems] = useState<LineItem[]>(
    invoice?.lineItems ?? [{ description: "", quantity: 1, unitPrice: 0, total: 0 }]
  );

  const subtotal = items.reduce((s, i) => s + i.total, 0);
  const taxAmount = subtotal * (taxRate / 100);
  const total = subtotal + taxAmount;

  const fmt = (d: Date | null | undefined) => d ? new Date(d).toISOString().split("T")[0] : "";

  function updateItem(index: number, field: keyof LineItem, value: string | number) {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    if (field === "quantity" || field === "unitPrice") {
      updated[index].total = updated[index].quantity * updated[index].unitPrice;
    }
    setItems(updated);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const data = {
      number: fd.get("number"),
      status: fd.get("status"),
      clientId: fd.get("clientId"),
      projectId: fd.get("projectId") || null,
      issueDate: fd.get("issueDate"),
      dueDate: fd.get("dueDate") || null,
      notes: fd.get("notes") || null,
      amountPaid: parseFloat(fd.get("amountPaid") as string || "0"),
      taxRate,
      subtotal,
      taxAmount,
      total,
      items,
    };
    const url = invoice ? `/api/invoices/${invoice.id}` : "/api/invoices";
    const method = invoice ? "PATCH" : "POST";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    if (res.ok) {
      const result = await res.json();
      router.push(`/dashboard/invoices/${result.id}`);
    } else {
      setError("Something went wrong");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Invoice #</label>
            <input name="number" required defaultValue={invoice?.number ?? nextNumber}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select name="status" defaultValue={invoice?.status ?? "DRAFT"}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500">
              <option value="DRAFT">Draft</option>
              <option value="SENT">Sent</option>
              <option value="PARTIAL">Partial</option>
              <option value="PAID">Paid</option>
              <option value="OVERDUE">Overdue</option>
              <option value="VOID">Void</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Client *</label>
            <select name="clientId" required defaultValue={invoice?.clientId ?? defaultClientId ?? ""}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500">
              <option value="">Select client...</option>
              {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
            <select name="projectId" defaultValue={invoice?.projectId ?? defaultProjectId ?? ""}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500">
              <option value="">No project</option>
              {projects.map((p) => <option key={p.id} value={p.id}>#{p.number} – {p.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Issue Date</label>
            <input name="issueDate" type="date" required defaultValue={fmt(invoice?.issueDate) || new Date().toISOString().split("T")[0]}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
            <input name="dueDate" type="date" defaultValue={fmt(invoice?.dueDate)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tax Rate (%)</label>
            <input type="number" step="0.01" value={taxRate} onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount Paid ($)</label>
            <input name="amountPaid" type="number" step="0.01" defaultValue={invoice?.amountPaid ?? 0}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500" />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea name="notes" rows={2} defaultValue={invoice?.notes ?? ""}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none" />
          </div>
        </div>
      </div>

      {/* Line Items */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 font-semibold text-gray-900">Line Items</div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2.5 text-xs font-semibold text-gray-500 text-left w-1/2">Description</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-gray-500 text-left">Qty</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-gray-500 text-left">Unit Price</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-gray-500 text-left">Total</th>
                <th className="px-4 py-2.5 w-8"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {items.map((item, i) => (
                <tr key={i}>
                  <td className="px-4 py-2">
                    <input value={item.description} onChange={(e) => updateItem(i, "description", e.target.value)}
                      placeholder="Service or item description..."
                      className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
                  </td>
                  <td className="px-4 py-2">
                    <input type="number" step="0.01" value={item.quantity}
                      onChange={(e) => updateItem(i, "quantity", parseFloat(e.target.value) || 0)}
                      className="w-20 px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
                  </td>
                  <td className="px-4 py-2">
                    <input type="number" step="0.01" value={item.unitPrice}
                      onChange={(e) => updateItem(i, "unitPrice", parseFloat(e.target.value) || 0)}
                      className="w-28 px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
                  </td>
                  <td className="px-4 py-2 text-sm font-medium text-gray-900">${item.total.toFixed(2)}</td>
                  <td className="px-4 py-2">
                    <button type="button" onClick={() => setItems(items.filter((_, j) => j !== i))} className="text-gray-300 hover:text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-3 border-t border-gray-100">
          <button type="button" onClick={() => setItems([...items, { description: "", quantity: 1, unitPrice: 0, total: 0 }])}
            className="flex items-center gap-2 text-sm text-orange-600 hover:text-orange-700 font-medium">
            <Plus className="w-4 h-4" /> Add Line Item
          </button>
        </div>
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
          {loading ? "Saving..." : invoice ? "Update Invoice" : "Create Invoice"}
        </button>
        <button type="button" onClick={() => router.back()}
          className="px-6 py-2.5 rounded-xl text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">
          Cancel
        </button>
      </div>
    </form>
  );
}
