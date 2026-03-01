import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate, getStatusColor } from "@/lib/utils";
import Link from "next/link";
import { Plus, FolderOpen } from "lucide-react";

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  const where = params.status ? { status: params.status } : {};

  const projects = await prisma.project.findMany({
    where,
    include: { client: true, manager: true, _count: { select: { workOrders: true, milestones: true } } },
    orderBy: { updatedAt: "desc" },
  });

  const statuses = ["", "BIDDING", "ACTIVE", "ON_HOLD", "COMPLETED", "CANCELLED"];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-500 text-sm mt-1">{projects.length} project{projects.length !== 1 ? "s" : ""}</p>
        </div>
        <Link
          href="/dashboard/projects/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition-opacity hover:opacity-90"
          style={{ background: "#f97316" }}
        >
          <Plus className="w-4 h-4" />
          New Project
        </Link>
      </div>

      {/* Status Filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {statuses.map((s) => (
          <Link
            key={s}
            href={s ? `/dashboard/projects?status=${s}` : "/dashboard/projects"}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              params.status === s || (!params.status && s === "")
                ? "text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
            style={params.status === s || (!params.status && s === "") ? { background: "#0f2a4a" } : {}}
          >
            {s || "All"}
          </Link>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {projects.length === 0 ? (
          <div className="text-center py-16">
            <FolderOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400 font-medium">No projects found</p>
            <Link href="/dashboard/projects/new" className="text-orange-600 text-sm mt-2 inline-block hover:underline">
              Create your first project →
            </Link>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Project</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Client</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Type</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Budget</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">End Date</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {projects.map((project) => (
                <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <Link href={`/dashboard/projects/${project.id}`} className="block">
                      <div className="font-medium text-gray-900 text-sm hover:text-orange-600">{project.name}</div>
                      <div className="text-gray-400 text-xs mt-0.5">#{project.number}</div>
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{project.client.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{project.type}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                    {project.budget ? formatCurrency(project.budget) : "—"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{formatDate(project.endDate)}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getStatusColor(project.status)}`}>
                      {project.status.replace("_", " ")}
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
