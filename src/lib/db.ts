// ─── In-memory data layer for demo/Cloudflare Pages deployment ────────────────
// Implements the subset of Prisma's query API actually used by this app.

import {
  USERS,
  CLIENTS,
  PROJECTS,
  WORK_ORDERS,
  ESTIMATES,
  INVOICES,
  FIELD_REPORTS,
} from "./demo-data";

type WhereClause = Record<string, unknown>;
type OrderBy = Record<string, "asc" | "desc">;

function matchesWhere(record: Record<string, unknown>, where: WhereClause): boolean {
  for (const [key, value] of Object.entries(where)) {
    const recordVal = record[key];
    if (value === null || value === undefined) {
      if (recordVal !== null && recordVal !== undefined) return false;
    } else if (
      typeof value === "object" &&
      !Array.isArray(value) &&
      !(value instanceof Date) &&
      value !== null
    ) {
      const op = value as Record<string, unknown>;
      if ("in" in op) {
        if (!(op.in as unknown[]).includes(recordVal)) return false;
      }
    } else {
      if (recordVal !== value) return false;
    }
  }
  return true;
}

function applyOrderBy<T extends Record<string, unknown>>(arr: T[], orderBy?: OrderBy | OrderBy[]): T[] {
  if (!orderBy) return arr;
  const orders = Array.isArray(orderBy) ? orderBy : [orderBy];
  return [...arr].sort((a, b) => {
    for (const order of orders) {
      for (const [key, dir] of Object.entries(order)) {
        const av = a[key];
        const bv = b[key];
        if (av === bv) continue;
        if (av == null) return 1;
        if (bv == null) return -1;
        const cmp = av < bv ? -1 : 1;
        return dir === "asc" ? cmp : -cmp;
      }
    }
    return 0;
  });
}

function makeRepo<T extends Record<string, unknown>>(data: T[]) {
  return {
    async findMany(args?: {
      where?: WhereClause;
      orderBy?: OrderBy | OrderBy[];
      take?: number;
      include?: unknown;
    }): Promise<T[]> {
      let result = args?.where
        ? data.filter((r) => matchesWhere(r, args.where!))
        : [...data];
      if (args?.orderBy) result = applyOrderBy(result, args.orderBy);
      if (args?.take) result = result.slice(0, args.take);
      return result;
    },
    async findUnique(args: { where: WhereClause; include?: unknown }): Promise<T | null> {
      return data.find((r) => matchesWhere(r, args.where)) ?? null;
    },
    async count(args?: { where?: WhereClause }): Promise<number> {
      if (!args?.where) return data.length;
      return data.filter((r) => matchesWhere(r, args.where!)).length;
    },
  };
}

function makeAggregateRepo<T extends Record<string, unknown>>(data: T[]) {
  const base = makeRepo(data);
  return {
    ...base,
    async aggregate(args: {
      where?: WhereClause;
      _sum: Record<string, boolean>;
    }): Promise<{ _sum: Record<string, number | null> }> {
      const subset = args.where
        ? data.filter((r) => matchesWhere(r, args.where!))
        : data;
      const result: Record<string, number | null> = {};
      for (const field of Object.keys(args._sum)) {
        result[field] = subset.reduce(
          (acc, r) => acc + ((r[field] as number) ?? 0),
          0
        );
      }
      return { _sum: result };
    },
  };
}

// Cast each repo to `any` at the boundary so pages can use the data
// exactly as they did with Prisma — all runtime values are correctly shaped.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function typed<T>(repo: T): any { return repo; }

export const db = {
  user:        typed(makeRepo(USERS        as unknown as Record<string, unknown>[])),
  client:      typed(makeRepo(CLIENTS      as unknown as Record<string, unknown>[])),
  project:     typed(makeRepo(PROJECTS     as unknown as Record<string, unknown>[])),
  workOrder:   typed(makeRepo(WORK_ORDERS  as unknown as Record<string, unknown>[])),
  estimate:    typed(makeRepo(ESTIMATES    as unknown as Record<string, unknown>[])),
  invoice:     typed(makeAggregateRepo(INVOICES as unknown as Record<string, unknown>[])),
  fieldReport: typed(makeRepo(FIELD_REPORTS as unknown as Record<string, unknown>[])),
  milestone:   typed(makeRepo([] as Record<string, unknown>[])),
};
