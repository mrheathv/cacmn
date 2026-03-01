import { prisma } from "@/lib/prisma";
import WorkOrderForm from "../WorkOrderForm";

export default async function NewWorkOrderPage({
  searchParams,
}: {
  searchParams: Promise<{ clientId?: string; projectId?: string }>;
}) {
  const params = await searchParams;
  const [clients, projects, count] = await Promise.all([
    prisma.client.findMany({ where: { active: true }, orderBy: { name: "asc" } }),
    prisma.project.findMany({ where: { status: "ACTIVE" }, orderBy: { name: "asc" } }),
    prisma.workOrder.count(),
  ]);

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">New Work Order</h1>
      </div>
      <WorkOrderForm
        clients={clients}
        projects={projects}
        nextNumber={`WO-${String(count + 1).padStart(4, "0")}`}
        defaultClientId={params.clientId}
      />
    </div>
  );
}
