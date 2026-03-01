import ClientForm from "../ClientForm";

export default function NewClientPage() {
  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">New Client</h1>
        <p className="text-gray-500 text-sm mt-1">Add a new client to your CRM</p>
      </div>
      <ClientForm />
    </div>
  );
}
