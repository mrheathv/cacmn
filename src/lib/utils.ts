import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return inputs.filter(Boolean).join(" ");
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "—";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    // Project statuses
    BIDDING: "bg-blue-100 text-blue-800",
    ACTIVE: "bg-green-100 text-green-800",
    ON_HOLD: "bg-yellow-100 text-yellow-800",
    COMPLETED: "bg-gray-100 text-gray-800",
    CANCELLED: "bg-red-100 text-red-800",
    // Work order
    OPEN: "bg-blue-100 text-blue-800",
    IN_PROGRESS: "bg-orange-100 text-orange-800",
    // Estimate
    DRAFT: "bg-gray-100 text-gray-700",
    SENT: "bg-blue-100 text-blue-800",
    APPROVED: "bg-green-100 text-green-800",
    REJECTED: "bg-red-100 text-red-800",
    REVISED: "bg-purple-100 text-purple-800",
    // Invoice
    PARTIAL: "bg-yellow-100 text-yellow-800",
    PAID: "bg-green-100 text-green-800",
    OVERDUE: "bg-red-100 text-red-800",
    VOID: "bg-gray-100 text-gray-500",
    // Priority
    LOW: "bg-gray-100 text-gray-600",
    NORMAL: "bg-blue-100 text-blue-700",
    HIGH: "bg-orange-100 text-orange-700",
    URGENT: "bg-red-100 text-red-700",
    // Milestone
    PENDING: "bg-gray-100 text-gray-700",
    DELAYED: "bg-red-100 text-red-700",
  };
  return map[status] ?? "bg-gray-100 text-gray-700";
}

export function generateNumber(prefix: string, count: number): string {
  return `${prefix}-${String(count).padStart(4, "0")}`;
}
