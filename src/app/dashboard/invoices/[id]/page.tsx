import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate, getStatusColor } from "@/lib/utils";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Edit } from "lucide-react";

export default async function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const invoice = await prisma.invoice.findUnique({
    where: { id },
    include: { client: true, project: true, lineItems: { orderBy: { order: "asc" } } },
  });
  if (!invoice) notFound();

  const balance = invoice.total - invoice.amountPaid;

  return (
    <div className="p-8 max-w-4xl">
      <Link href="/dashboard/invoices" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Invoices
      </Link>

      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-gray-900">Invoice #{invoice.number}</h1>
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getStatusColor(invoice.status)}`}>{invoice.status}</span>
          </div>
          <p className="text-gray-500 text-sm">{invoice.client.name}{invoice.project && ` · ${invoice.project.name}`}</p>
        </div>
        <Link href={`/dashboard/invoices/${id}/edit`}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50">
          <Edit className="w-4 h-4" /> Edit
        </Link>
      </div>

      {/* Key Financials */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="text-xs text-gray-400 mb-1">Invoice Total</div>
          <div className="text-2xl font-bold text-gray-900">{formatCurrency(invoice.total)}</div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="text-xs text-gray-400 mb-1">Amount Paid</div>
          <div className="text-2xl font-bold text-green-700">{formatCurrency(invoice.amountPaid)}</div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="text-xs text-gray-400 mb-1">Balance Due</div>
          <div className={`text-2xl font-bold ${balance > 0 ? "text-red-600" : "text-gray-400"}`}>{formatCurrency(balance)}</div>
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Issue Date", value: formatDate(invoice.issueDate) },
          { label: "Due Date", value: formatDate(invoice.dueDate) },
          { label: "Paid Date", value: formatDate(invoice.paidDate) },
          { label: "Client", value: invoice.client.name },
        ].map((m) => (
          <div key={m.label} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <div className="text-xs text-gray-400 mb-1">{m.label}</div>
            <div className="text-sm font-semibold text-gray-900">{m.value}</div>
          </div>
        ))}
      </div>

      {/* Line Items */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 font-semibold text-gray-900">Line Items</div>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="px-6 py-3 text-xs font-semibold text-gray-500">Description</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500">Qty</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500">Unit Price</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {invoice.lineItems.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-3.5 text-sm text-gray-900">{item.description}</td>
                <td className="px-6 py-3.5 text-sm text-gray-600">{item.quantity}</td>
                <td className="px-6 py-3.5 text-sm text-gray-600">{formatCurrency(item.unitPrice)}</td>
                <td className="px-6 py-3.5 text-sm font-semibold text-gray-900 text-right">{formatCurrency(item.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
          <div className="ml-auto w-64 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span className="font-medium">{formatCurrency(invoice.subtotal)}</span>
            </div>
            {invoice.taxRate > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Tax ({invoice.taxRate}%)</span>
                <span className="font-medium">{formatCurrency(invoice.taxAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Amount Paid</span>
              <span className="font-medium text-green-700">-{formatCurrency(invoice.amountPaid)}</span>
            </div>
            <div className="flex justify-between text-base font-bold border-t border-gray-200 pt-2">
              <span>Balance Due</span>
              <span className={balance > 0 ? "text-red-600" : "text-gray-400"}>{formatCurrency(balance)}</span>
            </div>
          </div>
        </div>
      </div>

      {invoice.notes && (
        <div className="mt-6 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Notes</h3>
          <p className="text-sm text-gray-600">{invoice.notes}</p>
        </div>
      )}
    </div>
  );
}
