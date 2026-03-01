import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import FieldReportForm from "../FieldReportForm";

export default async function NewFieldReportPage({
  searchParams,
}: {
  searchParams: Promise<{ projectId?: string }>;
}) {
  const params = await searchParams;
  const session = await auth();

  const [projects, users] = await Promise.all([
    prisma.project.findMany({ where: { status: "ACTIVE" }, orderBy: { name: "asc" } }),
    prisma.user.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">New Field Report</h1>
        <p className="text-gray-500 text-sm mt-1">Log today's site activity</p>
      </div>
      <FieldReportForm projects={projects} users={users} defaultProjectId={params.projectId} currentUserId={(session?.user as { id?: string })?.id} />
    </div>
  );
}
