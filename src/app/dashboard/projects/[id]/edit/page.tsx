import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProjectForm from "../../ProjectForm";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [project, clients, users] = await Promise.all([
    prisma.project.findUnique({ where: { id } }),
    prisma.client.findMany({ where: { active: true }, orderBy: { name: "asc" } }),
    prisma.user.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!project) notFound();

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Edit Project</h1>
        <p className="text-gray-500 text-sm mt-1">{project.name}</p>
      </div>
      <ProjectForm clients={clients} users={users} nextNumber={project.number} project={project} />
    </div>
  );
}
