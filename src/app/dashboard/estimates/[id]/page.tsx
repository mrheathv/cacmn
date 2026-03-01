import { db as prisma } from "@/lib/db";
import { formatCurrency, formatDate, getStatusColor } from "@/lib/utils";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Edit } from "lucide-react";

export default async function EstimateDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const estimate = await prisma.estimate.findUnique({
    where: { id },
    include: { client: true, project: true, lineItems: { orderBy: { order: "asc" } } },
  });
  if (!estimate) notFound();

  const categoryColors: Record<string, string> = {
    LABOR: "bg-blue-100 text-blue-700",
    MATERIAL: "bg-green-100 text-green-700",
    SUBCONTRACTOR: "bg-purple-100 text-purple-700",
    OTHER: "bg-gray-100 text-gray-600",
  };

  return (
    <div className="p-8 max-w-4xl">
      <Link href="/dashboard/estimates" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Estimates
      </Link>

      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-gray-900">{estimate.title}</h1>
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getStatusColor(estimate.status)}`}>{estimate.status}</span>
          </div>
          <p className="text-gray-500 text-sm">#{estimate.number} · {estimate.client.name}</p>
        </div>
        <Link href={`/dashboard/estimates/${id}/edit`}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50">
          <Edit className="w-4 h-4" /> Edit
        </Link>
      </div>

      {/* Meta */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Client", value: estimate.client.name },
          { label: "Project", value: estimate.project?.name ?? "—" },
          { label: "Created", value: formatDate(estimate.createdAt) },
          { label: "Valid Until", value: formatDate(estimate.validUntil) },
        ].map((m) => (
          <div key={m.label} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <div className="text-xs text-gray-400 mb-1">{m.label}</div>
            <div className="text-sm font-semibold text-gray-900">{m.value}</div>
          </div>
        ))}
      </div>

      {/* Line Items */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-100 font-semibold text-gray-900">Line Items</div>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="px-6 py-3 text-xs font-semibold text-gray-500">Description</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500">Category</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500">Qty</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500">Unit</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500">Unit Price</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {estimate.lineItems.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-3.5 text-sm text-gray-900">{item.description}</td>
                <td className="px-6 py-3.5">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded ${categoryColors[item.category] ?? "bg-gray-100 text-gray-600"}`}>
                    {item.category}
                  </span>
                </td>
                <td className="px-6 py-3.5 text-sm text-gray-600">{item.quantity}</td>
                <td className="px-6 py-3.5 text-sm text-gray-600">{item.unit}</td>
                <td className="px-6 py-3.5 text-sm text-gray-600">{formatCurrency(item.unitPrice)}</td>
                <td className="px-6 py-3.5 text-sm font-semibold text-gray-900 text-right">{formatCurrency(item.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
          <div className="ml-auto w-64 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span className="font-medium">{formatCurrency(estimate.subtotal)}</span>
            </div>
            {estimate.taxRate > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Tax ({estimate.taxRate}%)</span>
                <span className="font-medium">{formatCurrency(estimate.subtotal * (estimate.taxRate / 100))}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-bold border-t border-gray-200 pt-2">
              <span>Total</span>
              <span>{formatCurrency(estimate.total)}</span>
            </div>
          </div>
        </div>
      </div>

      {estimate.notes && (
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Notes</h3>
          <p className="text-sm text-gray-600">{estimate.notes}</p>
        </div>
      )}
    </div>
  );
}
