import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import WorkOrderForm from "../../WorkOrderForm";

export default async function EditWorkOrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [wo, clients, projects] = await Promise.all([
    prisma.workOrder.findUnique({ where: { id } }),
    prisma.client.findMany({ where: { active: true }, orderBy: { name: "asc" } }),
    prisma.project.findMany({ orderBy: { name: "asc" } }),
  ]);
  if (!wo) notFound();

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Edit Work Order</h1>
      </div>
      <WorkOrderForm clients={clients} projects={projects} nextNumber={wo.number} workOrder={wo} />
    </div>
  );
}
