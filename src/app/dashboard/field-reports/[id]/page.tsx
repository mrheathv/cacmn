import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Cloud, Users, Clock, Edit } from "lucide-react";

export default async function FieldReportDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const report = await prisma.fieldReport.findUnique({
    where: { id },
    include: { project: true, author: true },
  });
  if (!report) notFound();

  return (
    <div className="p-8 max-w-3xl">
      <Link href="/dashboard/field-reports" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Field Reports
      </Link>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Field Report</h1>
          <p className="text-gray-500 text-sm mt-1">{report.project.name} · {formatDate(report.date)}</p>
        </div>
        <Link href={`/dashboard/field-reports/${id}/edit`}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50">
          <Edit className="w-4 h-4" /> Edit
        </Link>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-3">
          <Users className="w-5 h-5 text-blue-500" />
          <div>
            <div className="text-xl font-bold text-gray-900">{report.crewCount}</div>
            <div className="text-xs text-gray-400">Crew on Site</div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-3">
          <Clock className="w-5 h-5 text-orange-500" />
          <div>
            <div className="text-xl font-bold text-gray-900">{report.hoursWorked}</div>
            <div className="text-xs text-gray-400">Hours Worked</div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-3">
          <Cloud className="w-5 h-5 text-sky-500" />
          <div>
            <div className="text-sm font-semibold text-gray-900">{report.weather || "—"}</div>
            <div className="text-xs text-gray-400">Weather</div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Work Performed</h3>
          <p className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">{report.workPerformed || "—"}</p>
        </div>

        {report.issues && (
          <div className="bg-red-50 rounded-2xl p-5 border border-red-100">
            <h3 className="text-sm font-semibold text-red-800 mb-2">Issues / Delays</h3>
            <p className="text-sm text-red-700 whitespace-pre-wrap">{report.issues}</p>
          </div>
        )}

        {report.safetyNotes && (
          <div className="bg-yellow-50 rounded-2xl p-5 border border-yellow-100">
            <h3 className="text-sm font-semibold text-yellow-800 mb-2">Safety Notes</h3>
            <p className="text-sm text-yellow-700 whitespace-pre-wrap">{report.safetyNotes}</p>
          </div>
        )}

        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <p className="text-xs text-gray-400">Submitted by <span className="text-gray-600 font-medium">{report.author.name}</span> on {formatDate(report.createdAt)}</p>
        </div>
      </div>
    </div>
  );
}
