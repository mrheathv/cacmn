import { prisma } from "@/lib/prisma";
import { getStatusColor } from "@/lib/utils";
import Link from "next/link";
import { Plus, Users, Phone, Mail, MapPin } from "lucide-react";

export default async function ClientsPage() {
  const clients = await prisma.client.findMany({
    include: {
      _count: { select: { projects: true, workOrders: true } },
    },
    orderBy: { name: "asc" },
  });

  const typeColors: Record<string, string> = {
    COMMERCIAL: "bg-blue-100 text-blue-800",
    HOA: "bg-purple-100 text-purple-800",
    RESIDENTIAL: "bg-green-100 text-green-800",
    OTHER: "bg-gray-100 text-gray-600",
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
          <p className="text-gray-500 text-sm mt-1">{clients.length} client{clients.length !== 1 ? "s" : ""}</p>
        </div>
        <Link
          href="/dashboard/clients/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-opacity"
          style={{ background: "#f97316" }}
        >
          <Plus className="w-4 h-4" />
          New Client
        </Link>
      </div>

      {clients.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400 font-medium">No clients yet</p>
          <Link href="/dashboard/clients/new" className="text-orange-600 text-sm mt-2 inline-block hover:underline">
            Add your first client →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {clients.map((client) => (
            <Link key={client.id} href={`/dashboard/clients/${client.id}`}>
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{client.name}</h3>
                    {client.contactName && (
                      <p className="text-sm text-gray-500 mt-0.5">{client.contactName}</p>
                    )}
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${typeColors[client.type] ?? "bg-gray-100 text-gray-600"}`}>
                    {client.type}
                  </span>
                </div>

                <div className="space-y-1.5 mb-4">
                  {client.phone && (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Phone className="w-3.5 h-3.5" />
                      {client.phone}
                    </div>
                  )}
                  {client.email && (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Mail className="w-3.5 h-3.5" />
                      {client.email}
                    </div>
                  )}
                  {client.city && (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <MapPin className="w-3.5 h-3.5" />
                      {client.city}, {client.state}
                    </div>
                  )}
                </div>

                <div className="flex gap-4 pt-3 border-t border-gray-100">
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">{client._count.projects}</div>
                    <div className="text-xs text-gray-400">Projects</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">{client._count.workOrders}</div>
                    <div className="text-xs text-gray-400">Work Orders</div>
                  </div>
                  <div className="ml-auto flex items-center">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${client.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {client.active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
