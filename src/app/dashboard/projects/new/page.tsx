import { db as prisma } from "@/lib/db";
import ProjectForm from "../ProjectForm";

export default async function NewProjectPage() {
  const clients = await prisma.client.findMany({ where: { active: true }, orderBy: { name: "asc" } });
  const users = await prisma.user.findMany({ orderBy: { name: "asc" } });
  const count = await prisma.project.count();

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">New Project</h1>
        <p className="text-gray-500 text-sm mt-1">Create a new construction project</p>
      </div>
      <ProjectForm clients={clients} users={users} nextNumber={`PROJ-${String(count + 1).padStart(4, "0")}`} />
    </div>
  );
}
