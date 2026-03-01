import { db as prisma } from "@/lib/db";
import { formatCurrency, formatDate, getStatusColor } from "@/lib/utils";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Edit, Phone, Mail, MapPin, Building2 } from "lucide-react";

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const client = await prisma.client.findUnique({
    where: { id },
    include: {
      projects: { orderBy: { updatedAt: "desc" } },
      workOrders: { orderBy: { createdAt: "desc" }, take: 5 },
      estimates: { orderBy: { createdAt: "desc" }, take: 5 },
      invoices: { orderBy: { createdAt: "desc" }, take: 5 },
    },
  });

  if (!client) notFound();

  const totalBilled = client.invoices.reduce((s, i) => s + i.total, 0);
  const totalPaid = client.invoices.filter(i => i.status === "PAID").reduce((s, i) => s + i.total, 0);

  return (
    <div className="p-8">
      <Link href="/dashboard/clients" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Clients
      </Link>

      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{client.name}</h1>
          <p className="text-gray-500 text-sm mt-1">
            {client.type} Client
            {client.contactName && ` · ${client.contactName}`}
          </p>
        </div>
        <Link href={`/dashboard/clients/${id}/edit`}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50">
          <Edit className="w-4 h-4" /> Edit
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Info */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-3">
            {client.phone && (
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-gray-400" />
                <a href={`tel:${client.phone}`} className="text-gray-700 hover:text-orange-600">{client.phone}</a>
              </div>
            )}
            {client.email && (
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-gray-400" />
                <a href={`mailto:${client.email}`} className="text-gray-700 hover:text-orange-600">{client.email}</a>
              </div>
            )}
            {(client.address || client.city) && (
              <div className="flex items-start gap-3 text-sm">
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                <div className="text-gray-700">
                  {client.address && <div>{client.address}</div>}
                  {client.city && <div>{client.city}, {client.state} {client.zip}</div>}
                </div>
              </div>
            )}
          </div>

          {/* Financial summary */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Financials</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Total Billed</span>
                <span className="font-semibold text-gray-900">{formatCurrency(totalBilled)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Total Paid</span>
                <span className="font-semibold text-green-700">{formatCurrency(totalPaid)}</span>
              </div>
              <div className="flex justify-between text-sm border-t border-gray-100 pt-2">
                <span className="text-gray-500">Outstanding</span>
                <span className="font-semibold text-red-600">{formatCurrency(totalBilled - totalPaid)}</span>
              </div>
            </div>
          </div>

          {client.notes && (
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Notes</h3>
              <p className="text-sm text-gray-600">{client.notes}</p>
            </div>
          )}
        </div>

        {/* Right - Projects, Work Orders, etc. */}
        <div className="lg:col-span-2 space-y-6">
          {/* Projects */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">Projects ({client.projects.length})</h3>
              <Link href={`/dashboard/projects/new`} className="text-xs text-orange-600 hover:underline">+ New</Link>
            </div>
            <div className="divide-y divide-gray-50">
              {client.projects.length === 0 && <p className="text-gray-400 text-sm px-5 py-6">No projects</p>}
              {client.projects.map((p) => (
                <Link key={p.id} href={`/dashboard/projects/${p.id}`} className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{p.name}</div>
                    <div className="text-xs text-gray-400">#{p.number}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    {p.budget && <span className="text-sm text-gray-600">{formatCurrency(p.budget)}</span>}
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getStatusColor(p.status)}`}>{p.status.replace("_", " ")}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Work Orders */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">Work Orders</h3>
              <Link href={`/dashboard/work-orders/new?clientId=${id}`} className="text-xs text-orange-600 hover:underline">+ New</Link>
            </div>
            <div className="divide-y divide-gray-50">
              {client.workOrders.length === 0 && <p className="text-gray-400 text-sm px-5 py-4">None</p>}
              {client.workOrders.map((wo) => (
                <Link key={wo.id} href={`/dashboard/work-orders/${wo.id}`} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{wo.title}</div>
                    <div className="text-xs text-gray-400">#{wo.number} · {formatDate(wo.createdAt)}</div>
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getStatusColor(wo.status)}`}>{wo.status.replace("_", " ")}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
