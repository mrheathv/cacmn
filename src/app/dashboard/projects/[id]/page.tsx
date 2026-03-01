import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate, getStatusColor } from "@/lib/utils";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Edit, MapPin, Calendar, DollarSign, User, ClipboardList } from "lucide-react";

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      client: true,
      manager: true,
      milestones: { orderBy: { order: "asc" } },
      workOrders: { include: { client: true }, orderBy: { createdAt: "desc" }, take: 5 },
      estimates: { orderBy: { createdAt: "desc" }, take: 3 },
      invoices: { orderBy: { createdAt: "desc" }, take: 3 },
      fieldReports: { include: { author: true }, orderBy: { date: "desc" }, take: 5 },
      notes: { include: { author: true }, orderBy: { createdAt: "desc" }, take: 5 },
    },
  });

  if (!project) notFound();

  const budgetUsed = project.budget ? (project.spent / project.budget) * 100 : 0;

  return (
    <div className="p-8">
      {/* Back */}
      <Link href="/dashboard/projects" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Projects
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getStatusColor(project.status)}`}>
              {project.status.replace("_", " ")}
            </span>
          </div>
          <p className="text-gray-500 text-sm">#{project.number} · {project.type} · {project.client.name}</p>
        </div>
        <Link
          href={`/dashboard/projects/${id}/edit`}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <Edit className="w-4 h-4" /> Edit
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Info Cards */}
          <div className="grid grid-cols-2 gap-4">
            {project.budget && (
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2 text-gray-500 text-xs mb-2">
                  <DollarSign className="w-3.5 h-3.5" /> Budget
                </div>
                <div className="text-2xl font-bold text-gray-900">{formatCurrency(project.budget)}</div>
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Spent: {formatCurrency(project.spent)}</span>
                    <span>{budgetUsed.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full ${budgetUsed > 90 ? "bg-red-500" : budgetUsed > 70 ? "bg-yellow-500" : "bg-green-500"}`}
                      style={{ width: `${Math.min(budgetUsed, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            )}
            {(project.startDate || project.endDate) && (
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2 text-gray-500 text-xs mb-2">
                  <Calendar className="w-3.5 h-3.5" /> Schedule
                </div>
                <div className="text-sm text-gray-700">
                  <div className="mb-1"><span className="text-gray-400">Start:</span> {formatDate(project.startDate)}</div>
                  <div><span className="text-gray-400">End:</span> {formatDate(project.endDate)}</div>
                </div>
              </div>
            )}
            {(project.address || project.city) && (
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2 text-gray-500 text-xs mb-2">
                  <MapPin className="w-3.5 h-3.5" /> Location
                </div>
                <div className="text-sm text-gray-700">
                  {project.address && <div>{project.address}</div>}
                  {project.city && <div>{project.city}, MN</div>}
                </div>
              </div>
            )}
            {project.manager && (
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2 text-gray-500 text-xs mb-2">
                  <User className="w-3.5 h-3.5" /> Project Manager
                </div>
                <div className="text-sm font-medium text-gray-900">{project.manager.name}</div>
                <div className="text-xs text-gray-400">{project.manager.email}</div>
              </div>
            )}
          </div>

          {/* Description */}
          {project.description && (
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Description</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{project.description}</p>
            </div>
          )}

          {/* Milestones */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900 text-sm">Milestones</h3>
              <span className="text-xs text-gray-400">{project.milestones.filter(m => m.status === "COMPLETED").length}/{project.milestones.length} done</span>
            </div>
            <div className="divide-y divide-gray-50">
              {project.milestones.length === 0 && (
                <p className="text-gray-400 text-sm px-5 py-6">No milestones added</p>
              )}
              {project.milestones.map((m) => (
                <div key={m.id} className="flex items-center gap-4 px-5 py-3.5">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${m.status === "COMPLETED" ? "bg-green-500" : m.status === "DELAYED" ? "bg-red-500" : m.status === "IN_PROGRESS" ? "bg-orange-500" : "bg-gray-300"}`} />
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm ${m.status === "COMPLETED" ? "line-through text-gray-400" : "text-gray-900"}`}>{m.name}</div>
                    {m.dueDate && <div className="text-xs text-gray-400">{formatDate(m.dueDate)}</div>}
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getStatusColor(m.status)}`}>{m.status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Field Reports */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900 text-sm">Recent Field Reports</h3>
              <Link href={`/dashboard/field-reports?projectId=${id}`} className="text-xs text-orange-600 hover:underline">View all</Link>
            </div>
            <div className="divide-y divide-gray-50">
              {project.fieldReports.length === 0 && (
                <p className="text-gray-400 text-sm px-5 py-6">No field reports yet</p>
              )}
              {project.fieldReports.map((fr) => (
                <div key={fr.id} className="px-5 py-3.5">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900">{formatDate(fr.date)}</span>
                    <span className="text-xs text-gray-400">{fr.author.name} · {fr.crewCount} crew · {fr.hoursWorked}h</span>
                  </div>
                  {fr.workPerformed && <p className="text-xs text-gray-500 line-clamp-2">{fr.workPerformed}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Related Work Orders */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900 text-sm">Work Orders</h3>
              <Link href={`/dashboard/work-orders?projectId=${id}`} className="text-xs text-orange-600 hover:underline">All</Link>
            </div>
            <div className="divide-y divide-gray-50">
              {project.workOrders.length === 0 && (
                <p className="text-gray-400 text-xs px-5 py-4">None</p>
              )}
              {project.workOrders.map((wo) => (
                <Link key={wo.id} href={`/dashboard/work-orders/${wo.id}`} className="block px-5 py-3 hover:bg-gray-50">
                  <div className="text-sm text-gray-900 font-medium truncate">{wo.title}</div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${getStatusColor(wo.status)}`}>{wo.status.replace("_", " ")}</span>
                    <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${getStatusColor(wo.priority)}`}>{wo.priority}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Estimates */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900 text-sm">Estimates</h3>
              <Link href={`/dashboard/estimates/new?projectId=${id}`} className="text-xs text-orange-600 hover:underline">+ New</Link>
            </div>
            <div className="divide-y divide-gray-50">
              {project.estimates.length === 0 && (
                <p className="text-gray-400 text-xs px-5 py-4">None</p>
              )}
              {project.estimates.map((est) => (
                <Link key={est.id} href={`/dashboard/estimates/${est.id}`} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50">
                  <div>
                    <div className="text-sm text-gray-900 font-medium truncate">{est.title}</div>
                    <div className="text-xs text-gray-400">#{est.number}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900">{formatCurrency(est.total)}</div>
                    <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${getStatusColor(est.status)}`}>{est.status}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Invoices */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900 text-sm">Invoices</h3>
              <Link href={`/dashboard/invoices/new?projectId=${id}`} className="text-xs text-orange-600 hover:underline">+ New</Link>
            </div>
            <div className="divide-y divide-gray-50">
              {project.invoices.length === 0 && (
                <p className="text-gray-400 text-xs px-5 py-4">None</p>
              )}
              {project.invoices.map((inv) => (
                <Link key={inv.id} href={`/dashboard/invoices/${inv.id}`} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50">
                  <div>
                    <div className="text-sm text-gray-900 font-medium">#{inv.number}</div>
                    <div className="text-xs text-gray-400">{formatDate(inv.issueDate)}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900">{formatCurrency(inv.total)}</div>
                    <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${getStatusColor(inv.status)}`}>{inv.status}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
