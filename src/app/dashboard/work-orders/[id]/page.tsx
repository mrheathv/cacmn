import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate, getStatusColor } from "@/lib/utils";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Edit } from "lucide-react";

export default async function WorkOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const wo = await prisma.workOrder.findUnique({
    where: { id },
    include: { client: true, project: true, notes: { include: { author: true }, orderBy: { createdAt: "desc" } } },
  });
  if (!wo) notFound();

  return (
    <div className="p-8 max-w-4xl">
      <Link href="/dashboard/work-orders" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Work Orders
      </Link>

      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-gray-900">{wo.title}</h1>
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getStatusColor(wo.status)}`}>{wo.status.replace("_", " ")}</span>
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getStatusColor(wo.priority)}`}>{wo.priority}</span>
          </div>
          <p className="text-gray-500 text-sm">#{wo.number} · {wo.client.name}</p>
        </div>
        <Link href={`/dashboard/work-orders/${id}/edit`}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50">
          <Edit className="w-4 h-4" /> Edit
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {wo.description && (
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Description</h3>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">{wo.description}</p>
            </div>
          )}

          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Notes</h3>
            {wo.notes.length === 0 && <p className="text-sm text-gray-400">No notes yet</p>}
            {wo.notes.map((note) => (
              <div key={note.id} className="border-b border-gray-100 pb-3 mb-3 last:border-0 last:mb-0 last:pb-0">
                <p className="text-sm text-gray-700">{note.content}</p>
                <p className="text-xs text-gray-400 mt-1">{note.author.name} · {formatDate(note.createdAt)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Client</span>
              <Link href={`/dashboard/clients/${wo.clientId}`} className="font-medium text-gray-900 hover:text-orange-600">{wo.client.name}</Link>
            </div>
            {wo.project && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Project</span>
                <Link href={`/dashboard/projects/${wo.projectId}`} className="font-medium text-gray-900 hover:text-orange-600">{wo.project.name}</Link>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Scheduled</span>
              <span className="font-medium text-gray-900">{formatDate(wo.scheduledAt)}</span>
            </div>
            {wo.completedAt && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Completed</span>
                <span className="font-medium text-gray-900">{formatDate(wo.completedAt)}</span>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-3">
            <h3 className="text-sm font-semibold text-gray-700">Costs</h3>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Labor</span>
              <span className="font-medium text-gray-900">{formatCurrency(wo.laborCost)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Materials</span>
              <span className="font-medium text-gray-900">{formatCurrency(wo.materialCost)}</span>
            </div>
            <div className="flex justify-between text-sm border-t border-gray-100 pt-2">
              <span className="font-semibold text-gray-700">Total</span>
              <span className="font-bold text-gray-900">{formatCurrency(wo.laborCost + wo.materialCost)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
