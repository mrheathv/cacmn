import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { Plus, BookOpen, Cloud, Users } from "lucide-react";

export default async function FieldReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ projectId?: string }>;
}) {
  const params = await searchParams;
  const where = params.projectId ? { projectId: params.projectId } : {};

  const reports = await prisma.fieldReport.findMany({
    where,
    include: { project: true, author: true },
    orderBy: { date: "desc" },
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Field Reports</h1>
          <p className="text-gray-500 text-sm mt-1">Daily logs and site reports</p>
        </div>
        <Link href="/dashboard/field-reports/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-opacity"
          style={{ background: "#f97316" }}>
          <Plus className="w-4 h-4" /> New Report
        </Link>
      </div>

      {reports.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400 font-medium">No field reports yet</p>
          <Link href="/dashboard/field-reports/new" className="text-orange-600 text-sm mt-2 inline-block hover:underline">
            Log today's report →
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <Link key={report.id} href={`/dashboard/field-reports/${report.id}`}>
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="font-semibold text-gray-900">{report.project.name}</div>
                    <div className="text-sm text-gray-500 mt-0.5">{formatDate(report.date)} · {report.author.name}</div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    {report.crewCount > 0 && (
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5" />
                        {report.crewCount} crew
                      </div>
                    )}
                    {report.weather && (
                      <div className="flex items-center gap-1.5">
                        <Cloud className="w-3.5 h-3.5" />
                        {report.weather}
                      </div>
                    )}
                    <div className="font-medium text-gray-700">{report.hoursWorked}h worked</div>
                  </div>
                </div>
                {report.workPerformed && (
                  <p className="text-sm text-gray-600 line-clamp-2">{report.workPerformed}</p>
                )}
                {report.issues && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-red-100 text-red-700">Issues noted</span>
                    <span className="text-xs text-gray-500 truncate">{report.issues}</span>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
