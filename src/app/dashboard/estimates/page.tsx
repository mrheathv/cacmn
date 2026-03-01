import { db as prisma } from "@/lib/db";
import { formatCurrency, formatDate, getStatusColor } from "@/lib/utils";
import Link from "next/link";
import { Plus, FileText } from "lucide-react";

export default async function EstimatesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  const where = params.status ? { status: params.status } : {};

  const estimates = await prisma.estimate.findMany({
    where,
    include: { client: true, project: true },
    orderBy: { createdAt: "desc" },
  });

  const statuses = ["", "DRAFT", "SENT", "APPROVED", "REJECTED"];

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Estimates</h1>
          <p className="text-gray-500 text-sm mt-1">{estimates.length} estimate{estimates.length !== 1 ? "s" : ""}</p>
        </div>
        <Link href="/dashboard/estimates/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-opacity"
          style={{ background: "#f97316" }}>
          <Plus className="w-4 h-4" /> New Estimate
        </Link>
      </div>

      <div className="flex gap-2 mb-6">
        {statuses.map((s) => (
          <Link key={s}
            href={s ? `/dashboard/estimates?status=${s}` : "/dashboard/estimates"}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              params.status === s || (!params.status && s === "")
                ? "text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
            style={params.status === s || (!params.status && s === "") ? { background: "#0f2a4a" } : {}}>
            {s || "All"}
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {estimates.length === 0 ? (
          <div className="text-center py-16">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400 font-medium">No estimates found</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Estimate</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Client</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Project</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Valid Until</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Total</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {estimates.map((est) => (
                <tr key={est.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <Link href={`/dashboard/estimates/${est.id}`} className="block">
                      <div className="font-medium text-gray-900 text-sm hover:text-orange-600">{est.title}</div>
                      <div className="text-gray-400 text-xs mt-0.5">#{est.number}</div>
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{est.client.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{est.project?.name ?? "—"}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{formatDate(est.validUntil)}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">{formatCurrency(est.total)}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getStatusColor(est.status)}`}>{est.status}</span>
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
