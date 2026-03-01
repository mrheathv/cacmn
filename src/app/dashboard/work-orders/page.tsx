import { prisma } from "@/lib/prisma";
import { formatDate, formatCurrency, getStatusColor } from "@/lib/utils";
import Link from "next/link";
import { Plus, ClipboardList } from "lucide-react";

export default async function WorkOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; projectId?: string }>;
}) {
  const params = await searchParams;
  const where: Record<string, unknown> = {};
  if (params.status) where.status = params.status;
  if (params.projectId) where.projectId = params.projectId;

  const workOrders = await prisma.workOrder.findMany({
    where,
    include: { client: true, project: true },
    orderBy: { createdAt: "desc" },
  });

  const statuses = ["", "OPEN", "IN_PROGRESS", "COMPLETED", "CANCELLED"];

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Work Orders</h1>
          <p className="text-gray-500 text-sm mt-1">{workOrders.length} work order{workOrders.length !== 1 ? "s" : ""}</p>
        </div>
        <Link href="/dashboard/work-orders/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-opacity"
          style={{ background: "#f97316" }}>
          <Plus className="w-4 h-4" /> New Work Order
        </Link>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {statuses.map((s) => (
          <Link key={s}
            href={s ? `/dashboard/work-orders?status=${s}` : "/dashboard/work-orders"}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              params.status === s || (!params.status && s === "")
                ? "text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
            style={params.status === s || (!params.status && s === "") ? { background: "#0f2a4a" } : {}}>
            {s ? s.replace("_", " ") : "All"}
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {workOrders.length === 0 ? (
          <div className="text-center py-16">
            <ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400 font-medium">No work orders found</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Work Order</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Client</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Scheduled</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Cost</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Priority</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {workOrders.map((wo) => (
                <tr key={wo.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <Link href={`/dashboard/work-orders/${wo.id}`} className="block">
                      <div className="font-medium text-gray-900 text-sm hover:text-orange-600">{wo.title}</div>
                      <div className="text-gray-400 text-xs mt-0.5">#{wo.number}</div>
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{wo.client.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{formatDate(wo.scheduledAt)}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                    {formatCurrency(wo.laborCost + wo.materialCost)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getStatusColor(wo.priority)}`}>
                      {wo.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getStatusColor(wo.status)}`}>
                      {wo.status.replace("_", " ")}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
