import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate, getStatusColor } from "@/lib/utils";
import { FolderOpen, ClipboardList, FileText, Receipt, TrendingUp, Clock, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const [
    activeProjects,
    openWorkOrders,
    pendingEstimates,
    unpaidInvoices,
    recentProjects,
    urgentWorkOrders,
    overdueInvoices,
  ] = await Promise.all([
    prisma.project.count({ where: { status: "ACTIVE" } }),
    prisma.workOrder.count({ where: { status: { in: ["OPEN", "IN_PROGRESS"] } } }),
    prisma.estimate.count({ where: { status: { in: ["DRAFT", "SENT"] } } }),
    prisma.invoice.aggregate({
      where: { status: { in: ["SENT", "PARTIAL", "OVERDUE"] } },
      _sum: { total: true },
    }),
    prisma.project.findMany({
      take: 5,
      orderBy: { updatedAt: "desc" },
      include: { client: true },
    }),
    prisma.workOrder.findMany({
      where: { priority: { in: ["HIGH", "URGENT"] }, status: { in: ["OPEN", "IN_PROGRESS"] } },
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { client: true },
    }),
    prisma.invoice.count({ where: { status: "OVERDUE" } }),
  ]);

  const totalRevenue = await prisma.invoice.aggregate({
    where: { status: "PAID" },
    _sum: { total: true },
  });

  const stats = [
    {
      label: "Active Projects",
      value: activeProjects,
      icon: FolderOpen,
      color: "bg-blue-500",
      href: "/dashboard/projects",
    },
    {
      label: "Open Work Orders",
      value: openWorkOrders,
      icon: ClipboardList,
      color: "bg-orange-500",
      href: "/dashboard/work-orders",
    },
    {
      label: "Pending Estimates",
      value: pendingEstimates,
      icon: FileText,
      color: "bg-purple-500",
      href: "/dashboard/estimates",
    },
    {
      label: "Outstanding AR",
      value: formatCurrency(unpaidInvoices._sum.total ?? 0),
      icon: Receipt,
      color: "bg-green-500",
      href: "/dashboard/invoices",
    },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back — here's what's happening at Construct-All.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.label} href={stat.href}>
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-500 mt-0.5">{stat.label}</div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Alerts */}
      {overdueInvoices > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-4 mb-6 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <div>
            <span className="font-semibold text-red-800">{overdueInvoices} overdue invoice{overdueInvoices > 1 ? "s" : ""}</span>
            <span className="text-red-600 text-sm ml-2">— follow up with clients</span>
          </div>
          <Link href="/dashboard/invoices?status=OVERDUE" className="ml-auto text-sm font-medium text-red-700 hover:text-red-900">
            View →
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Recent Projects</h2>
            <Link href="/dashboard/projects" className="text-sm text-orange-600 hover:text-orange-700 font-medium">
              View all
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentProjects.length === 0 && (
              <p className="text-gray-400 text-sm px-6 py-8 text-center">No projects yet</p>
            )}
            {recentProjects.map((project) => (
              <Link key={project.id} href={`/dashboard/projects/${project.id}`}>
                <div className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 text-sm truncate">{project.name}</div>
                    <div className="text-gray-400 text-xs mt-0.5">{project.client.name} · #{project.number}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    {project.budget && (
                      <span className="text-sm text-gray-600 font-medium">{formatCurrency(project.budget)}</span>
                    )}
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getStatusColor(project.status)}`}>
                      {project.status.replace("_", " ")}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Urgent Work Orders */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">High Priority Work Orders</h2>
            <Link href="/dashboard/work-orders" className="text-sm text-orange-600 hover:text-orange-700 font-medium">
              View all
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {urgentWorkOrders.length === 0 && (
              <p className="text-gray-400 text-sm px-6 py-8 text-center">No urgent items</p>
            )}
            {urgentWorkOrders.map((wo) => (
              <Link key={wo.id} href={`/dashboard/work-orders/${wo.id}`}>
                <div className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 text-sm truncate">{wo.title}</div>
                    <div className="text-gray-400 text-xs mt-0.5">{wo.client.name} · #{wo.number}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getStatusColor(wo.priority)}`}>
                      {wo.priority}
                    </span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getStatusColor(wo.status)}`}>
                      {wo.status.replace("_", " ")}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-5">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-green-600" />
          <h3 className="font-semibold text-gray-900 text-sm">Year-to-Date Revenue</h3>
        </div>
        <div className="flex items-end gap-1">
          <span className="text-3xl font-bold text-gray-900">{formatCurrency(totalRevenue._sum.total ?? 0)}</span>
          <span className="text-gray-400 text-sm mb-1 ml-2">collected from paid invoices</span>
        </div>
      </div>
    </div>
  );
}
