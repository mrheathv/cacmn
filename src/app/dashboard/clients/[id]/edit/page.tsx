import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ClientForm from "../../ClientForm";

export default async function EditClientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const client = await prisma.client.findUnique({ where: { id } });
  if (!client) notFound();

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Edit Client</h1>
        <p className="text-gray-500 text-sm mt-1">{client.name}</p>
      </div>
      <ClientForm client={client} />
    </div>
  );
}
