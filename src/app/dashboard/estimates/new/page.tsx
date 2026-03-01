import { db as prisma } from "@/lib/db";
import EstimateForm from "../EstimateForm";

export default async function NewEstimatePage({
  searchParams,
}: {
  searchParams: Promise<{ projectId?: string; clientId?: string }>;
}) {
  const params = await searchParams;
  const [clients, projects, count] = await Promise.all([
    prisma.client.findMany({ where: { active: true }, orderBy: { name: "asc" } }),
    prisma.project.findMany({ orderBy: { name: "asc" } }),
    prisma.estimate.count(),
  ]);

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">New Estimate</h1>
      </div>
      <EstimateForm
        clients={clients}
        projects={projects}
        nextNumber={`EST-${String(count + 1).padStart(4, "0")}`}
        defaultProjectId={params.projectId}
        defaultClientId={params.clientId}
      />
    </div>
  );
}
