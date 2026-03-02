// ─── Demo data for Construct-All Corporation ──────────────────────────────────
// Pre-joined to match the include shapes used by all dashboard pages.
// Dates are stored as ISO strings; pages that pass them to formatDate() handle both.

// ─── Users ────────────────────────────────────────────────────────────────────

export const USERS = [
  {
    id: "user-admin",
    name: "Mike Johnson",
    email: "admin@constructall.com",
    // bcrypt hash of "admin123"
    password: "$2b$10$vHluzKpUR7GkqJmmd7TQAuRCqAHsZuv./WWvusiz9oToBbuOAPEue",
    role: "ADMIN",
    image: null,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "user-pm1",
    name: "Sarah Peterson",
    email: "sarah@constructall.com",
    // bcrypt hash of "pm123"
    password: "$2b$10$TxKDTxIUQF9GHNXdEUzAI.ZDwhBKwlvgLaT8KNeX/lrWGLR/B9RuS",
    role: "PM",
    image: null,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "user-pm2",
    name: "Tom Anderson",
    email: "tom@constructall.com",
    // bcrypt hash of "pm123"
    password: "$2b$10$TxKDTxIUQF9GHNXdEUzAI.ZDwhBKwlvgLaT8KNeX/lrWGLR/B9RuS",
    role: "PM",
    image: null,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
] as const;

// ─── Plain user refs (for relations) ─────────────────────────────────────────

const adminUser = { id: "user-admin", name: "Mike Johnson", email: "admin@constructall.com", role: "ADMIN" };
const pm1User   = { id: "user-pm1",   name: "Sarah Peterson", email: "sarah@constructall.com", role: "PM" };
const pm2User   = { id: "user-pm2",   name: "Tom Anderson",   email: "tom@constructall.com",  role: "PM" };

// ─── Clients ──────────────────────────────────────────────────────────────────

export const CLIENTS = [
  {
    id: "client-1",
    name: "Lakewood Commons HOA",
    type: "HOA",
    contactName: "Barbara Mitchell",
    email: "bmitchell@lakewoodcommons.org",
    phone: "(651) 555-0142",
    address: "4400 Lakewood Dr",
    city: "Saint Paul",
    state: "MN",
    zip: "55110",
    notes: null,
    active: true,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
    _count: { projects: 2, workOrders: 2 },
  },
  {
    id: "client-2",
    name: "Northland Medical Group",
    type: "COMMERCIAL",
    contactName: "David Chen",
    email: "dchen@northlandmedical.com",
    phone: "(612) 555-0271",
    address: "3100 Hennepin Ave",
    city: "Minneapolis",
    state: "MN",
    zip: "55408",
    notes: null,
    active: true,
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-01"),
    _count: { projects: 1, workOrders: 1 },
  },
  {
    id: "client-3",
    name: "Riverside Office Partners",
    type: "COMMERCIAL",
    contactName: "Janet Kowalski",
    email: "janet@riversideofficepartners.com",
    phone: "(952) 555-0388",
    address: "7200 France Ave S",
    city: "Edina",
    state: "MN",
    zip: "55435",
    notes: null,
    active: true,
    createdAt: new Date("2024-03-01"),
    updatedAt: new Date("2024-03-01"),
    _count: { projects: 1, workOrders: 1 },
  },
  {
    id: "client-4",
    name: "Maple Creek Condo Association",
    type: "HOA",
    contactName: "Robert Nguyen",
    email: "rnguyen@maplecreekcondo.com",
    phone: "(763) 555-0519",
    address: "800 Maple Creek Blvd",
    city: "Plymouth",
    state: "MN",
    zip: "55441",
    notes: null,
    active: true,
    createdAt: new Date("2024-04-01"),
    updatedAt: new Date("2024-04-01"),
    _count: { projects: 1, workOrders: 1 },
  },
  {
    id: "client-5",
    name: "Downtown Retail LLC",
    type: "COMMERCIAL",
    contactName: "Lisa Hoffman",
    email: "lisa@downtownretail.com",
    phone: "(612) 555-0634",
    address: "50 S 6th St, Ste 1400",
    city: "Minneapolis",
    state: "MN",
    zip: "55402",
    notes: null,
    active: true,
    createdAt: new Date("2024-05-01"),
    updatedAt: new Date("2024-05-01"),
    _count: { projects: 1, workOrders: 0 },
  },
];

// ─── Plain client refs ────────────────────────────────────────────────────────

const client1 = { id: "client-1", name: "Lakewood Commons HOA", type: "HOA" };
const client2 = { id: "client-2", name: "Northland Medical Group", type: "COMMERCIAL" };
const client3 = { id: "client-3", name: "Riverside Office Partners", type: "COMMERCIAL" };
const client4 = { id: "client-4", name: "Maple Creek Condo Association", type: "HOA" };
const client5 = { id: "client-5", name: "Downtown Retail LLC", type: "COMMERCIAL" };

// ─── Milestones ───────────────────────────────────────────────────────────────

const proj1Milestones = [
  { id: "ms-1", projectId: "proj-1", name: "Demo & Rough-In",                  status: "COMPLETED",   dueDate: new Date("2026-02-01"), completedAt: new Date("2026-01-28"), description: null, order: 1 },
  { id: "ms-2", projectId: "proj-1", name: "MEP Rough Inspections",             status: "COMPLETED",   dueDate: new Date("2026-02-15"), completedAt: new Date("2026-02-12"), description: null, order: 2 },
  { id: "ms-3", projectId: "proj-1", name: "Drywall & Finishes",                status: "IN_PROGRESS", dueDate: new Date("2026-03-15"), completedAt: null,                  description: null, order: 3 },
  { id: "ms-4", projectId: "proj-1", name: "Millwork & Casework",               status: "PENDING",     dueDate: new Date("2026-03-31"), completedAt: null,                  description: null, order: 4 },
  { id: "ms-5", projectId: "proj-1", name: "Final Inspections & Punch List",    status: "PENDING",     dueDate: new Date("2026-04-20"), completedAt: null,                  description: null, order: 5 },
];

const proj2Milestones = [
  { id: "ms-6", projectId: "proj-2", name: "Phase 1 – Buildings A-D Siding",   status: "COMPLETED",   dueDate: new Date("2025-12-15"), completedAt: new Date("2025-12-18"), description: null, order: 1 },
  { id: "ms-7", projectId: "proj-2", name: "Phase 2 – Buildings E-H Siding",   status: "IN_PROGRESS", dueDate: new Date("2026-03-31"), completedAt: null,                  description: null, order: 2 },
  { id: "ms-8", projectId: "proj-2", name: "Window Replacement – All Buildings",status: "PENDING",     dueDate: new Date("2026-05-15"), completedAt: null,                  description: null, order: 3 },
];

// ─── Estimate line items ──────────────────────────────────────────────────────

const est1Items = [
  { id: "eli-1",  estimateId: "est-1", description: "Demo existing finishes",                    category: "LABOR",          quantity: 40,   unit: "hrs",  unitPrice: 85,    total: 3400,   order: 1 },
  { id: "eli-2",  estimateId: "est-1", description: "Framing – interior partitions",             category: "LABOR",          quantity: 120,  unit: "hrs",  unitPrice: 78,    total: 9360,   order: 2 },
  { id: "eli-3",  estimateId: "est-1", description: "Rough electrical",                          category: "SUBCONTRACTOR",  quantity: 1,    unit: "lot",  unitPrice: 28000, total: 28000,  order: 3 },
  { id: "eli-4",  estimateId: "est-1", description: "Rough plumbing",                            category: "SUBCONTRACTOR",  quantity: 1,    unit: "lot",  unitPrice: 22500, total: 22500,  order: 4 },
  { id: "eli-5",  estimateId: "est-1", description: "Commercial kitchen hood & suppression",     category: "SUBCONTRACTOR",  quantity: 1,    unit: "lot",  unitPrice: 18500, total: 18500,  order: 5 },
  { id: "eli-6",  estimateId: "est-1", description: "Insulation",                                category: "MATERIAL",       quantity: 1,    unit: "lot",  unitPrice: 4200,  total: 4200,   order: 6 },
  { id: "eli-7",  estimateId: "est-1", description: "Drywall & finishes",                        category: "LABOR",          quantity: 200,  unit: "hrs",  unitPrice: 72,    total: 14400,  order: 7 },
  { id: "eli-8",  estimateId: "est-1", description: "Polished concrete floors",                  category: "SUBCONTRACTOR",  quantity: 3200, unit: "sqft", unitPrice: 6.5,   total: 20800,  order: 8 },
  { id: "eli-9",  estimateId: "est-1", description: "Custom millwork bar",                       category: "SUBCONTRACTOR",  quantity: 1,    unit: "lot",  unitPrice: 24000, total: 24000,  order: 9 },
  { id: "eli-10", estimateId: "est-1", description: "Paint – all areas",                         category: "LABOR",          quantity: 80,   unit: "hrs",  unitPrice: 65,    total: 5200,   order: 10 },
  { id: "eli-11", estimateId: "est-1", description: "Project management & supervision",          category: "LABOR",          quantity: 80,   unit: "hrs",  unitPrice: 95,    total: 7600,   order: 11 },
  { id: "eli-12", estimateId: "est-1", description: "Miscellaneous materials & hardware",        category: "MATERIAL",       quantity: 1,    unit: "lot",  unitPrice: 6540,  total: 6540,   order: 12 },
];

const est2Items = [
  { id: "eli-13", estimateId: "est-2", description: "Crack filling – entire lot",                          category: "LABOR",         quantity: 1, unit: "lot", unitPrice: 4500,  total: 4500,  order: 1 },
  { id: "eli-14", estimateId: "est-2", description: "Remove and replace deteriorated asphalt sections",    category: "SUBCONTRACTOR", quantity: 1, unit: "lot", unitPrice: 28000, total: 28000, order: 2 },
  { id: "eli-15", estimateId: "est-2", description: "Sealcoat and restripe",                               category: "SUBCONTRACTOR", quantity: 1, unit: "lot", unitPrice: 9500,  total: 9500,  order: 3 },
];

// ─── Invoice line items ───────────────────────────────────────────────────────

const inv1Items = [
  { id: "ili-1", invoiceId: "inv-1", description: "Progress billing – Phase 1 (Demo & Rough-In)", quantity: 1, unitPrice: 85000, total: 85000, order: 1 },
  { id: "ili-2", invoiceId: "inv-1", description: "MEP rough-in (partial)",                       quantity: 1, unitPrice: 10000, total: 10000, order: 2 },
];
const inv2Items = [
  { id: "ili-3", invoiceId: "inv-2", description: "Progress billing – Phase 2 (MEP & Framing)",   quantity: 1, unitPrice: 47500, total: 47500, order: 1 },
];
const inv3Items = [
  { id: "ili-4", invoiceId: "inv-3", description: "Phase 1 – Siding, Buildings A-D",              quantity: 1, unitPrice: 260000, total: 260000, order: 1 },
  { id: "ili-5", invoiceId: "inv-3", description: "Scaffolding and equipment",                    quantity: 1, unitPrice: 15000,  total: 15000,  order: 2 },
];
const inv4Items = [
  { id: "ili-6", invoiceId: "inv-4", description: "Balcony deck restoration – all 48 units",      quantity: 1, unitPrice: 185000, total: 185000, order: 1 },
  { id: "ili-7", invoiceId: "inv-4", description: "Additional framing repairs (change order #2)", quantity: 1, unitPrice: 13500,  total: 13500,  order: 2 },
];

// ─── Invoices ─────────────────────────────────────────────────────────────────

export const INVOICES = [
  {
    id: "inv-1", number: "INV-0001", status: "PAID",
    clientId: "client-2", projectId: "proj-1",
    client: client2, project: { id: "proj-1", name: "Northland Medical – Suite 200 Remodel", number: "PROJ-0001" },
    issueDate: new Date("2026-01-31"), dueDate: new Date("2026-02-28"), paidDate: new Date("2026-02-15"),
    subtotal: 95000, taxRate: 0, taxAmount: 0, total: 95000, amountPaid: 95000,
    notes: "Progress billing – 33% of contract. Phase 1 (Demo & Rough-In) complete.",
    lineItems: inv1Items,
    createdAt: new Date("2026-01-31"), updatedAt: new Date("2026-02-15"),
  },
  {
    id: "inv-2", number: "INV-0002", status: "SENT",
    clientId: "client-2", projectId: "proj-1",
    client: client2, project: { id: "proj-1", name: "Northland Medical – Suite 200 Remodel", number: "PROJ-0001" },
    issueDate: new Date("2026-02-28"), dueDate: new Date("2026-03-28"), paidDate: null,
    subtotal: 47500, taxRate: 0, taxAmount: 0, total: 47500, amountPaid: 0,
    notes: "Progress billing – Phase 2 (MEP & Framing) complete.",
    lineItems: inv2Items,
    createdAt: new Date("2026-02-28"), updatedAt: new Date("2026-02-28"),
  },
  {
    id: "inv-3", number: "INV-0003", status: "PARTIAL",
    clientId: "client-1", projectId: "proj-2",
    client: client1, project: { id: "proj-2", name: "Lakewood Commons – Siding & Window Replacement", number: "PROJ-0002" },
    issueDate: new Date("2026-01-15"), dueDate: new Date("2026-02-14"), paidDate: null,
    subtotal: 275000, taxRate: 0, taxAmount: 0, total: 275000, amountPaid: 137500,
    notes: "Phase 1 billing – Buildings A-D siding complete.",
    lineItems: inv3Items,
    createdAt: new Date("2026-01-15"), updatedAt: new Date("2026-01-15"),
  },
  {
    id: "inv-4", number: "INV-0004", status: "OVERDUE",
    clientId: "client-4", projectId: "proj-5",
    client: client4, project: { id: "proj-5", name: "Maple Creek – Balcony Deck Restoration", number: "PROJ-0005" },
    issueDate: new Date("2025-11-01"), dueDate: new Date("2025-11-30"), paidDate: null,
    subtotal: 198500, taxRate: 0, taxAmount: 0, total: 198500, amountPaid: 160000,
    notes: "Final billing – Maple Creek balcony restoration complete.",
    lineItems: inv4Items,
    createdAt: new Date("2025-11-01"), updatedAt: new Date("2025-11-01"),
  },
];

// ─── Estimates ────────────────────────────────────────────────────────────────

export const ESTIMATES = [
  {
    id: "est-1", number: "EST-0001",
    title: "Downtown Retail – Unit B Restaurant Buildout",
    status: "SENT",
    clientId: "client-5", projectId: "proj-4",
    client: client5, project: { id: "proj-4", name: "Downtown Retail – Tenant Buildout Unit B", number: "PROJ-0004" },
    validUntil: new Date("2026-04-01"),
    notes: "Includes all labor, materials, and supervision. Permit fees not included. Assumes tenant provides all FF&E.",
    subtotal: 168500, taxRate: 0, total: 168500,
    lineItems: est1Items,
    createdAt: new Date("2026-02-01"), updatedAt: new Date("2026-02-01"),
  },
  {
    id: "est-2", number: "EST-0002",
    title: "Lakewood Commons – Phase 3 Parking Lot Repairs",
    status: "DRAFT",
    clientId: "client-1", projectId: null,
    client: client1, project: null,
    validUntil: null,
    notes: null,
    subtotal: 42000, taxRate: 0, total: 42000,
    lineItems: est2Items,
    createdAt: new Date("2026-02-15"), updatedAt: new Date("2026-02-15"),
  },
];

// ─── Work Orders ──────────────────────────────────────────────────────────────

export const WORK_ORDERS = [
  {
    id: "wo-1", number: "WO-0001",
    title: "Unit 14A – Water Damage Drywall Repair",
    description: "Ceiling and wall drywall repair in bedroom and bathroom following roof leak. Approximately 60 sq ft affected. Tape, float, texture, and paint to match.",
    status: "IN_PROGRESS", priority: "HIGH",
    clientId: "client-1", projectId: "proj-2",
    client: client1, project: { id: "proj-2", name: "Lakewood Commons – Siding & Window Replacement", number: "PROJ-0002" },
    scheduledAt: new Date("2026-03-03"), completedAt: null,
    laborCost: 850, materialCost: 225,
    notes: [],
    createdAt: new Date("2026-02-25"), updatedAt: new Date("2026-02-25"),
  },
  {
    id: "wo-2", number: "WO-0002",
    title: "Maple Creek Bldg 3 – Sliding Door Repair",
    description: "Sliding patio door in unit 308 will not lock. Inspect hardware, replace mortise lock and strike plate if needed.",
    status: "OPEN", priority: "NORMAL",
    clientId: "client-4", projectId: null,
    client: client4, project: null,
    scheduledAt: new Date("2026-03-05"), completedAt: null,
    laborCost: 280, materialCost: 85,
    notes: [],
    createdAt: new Date("2026-02-26"), updatedAt: new Date("2026-02-26"),
  },
  {
    id: "wo-3", number: "WO-0003",
    title: "Riverside Office – Stair Handrail Repair",
    description: "East stairwell handrail loose at 3rd floor landing. Weld and reinforce bracket. Safety hazard – urgent.",
    status: "COMPLETED", priority: "URGENT",
    clientId: "client-3", projectId: null,
    client: client3, project: null,
    scheduledAt: new Date("2026-02-20"), completedAt: new Date("2026-02-20"),
    laborCost: 320, materialCost: 40,
    notes: [],
    createdAt: new Date("2026-02-19"), updatedAt: new Date("2026-02-20"),
  },
  {
    id: "wo-4", number: "WO-0004",
    title: "Northland Medical – ADA Restroom Grab Bar Install",
    description: "Install 3 ADA-compliant grab bars in accessible restroom per drawings. Blocking already in walls from renovation.",
    status: "OPEN", priority: "NORMAL",
    clientId: "client-2", projectId: "proj-1",
    client: client2, project: { id: "proj-1", name: "Northland Medical – Suite 200 Remodel", number: "PROJ-0001" },
    scheduledAt: new Date("2026-03-10"), completedAt: null,
    laborCost: 420, materialCost: 180,
    notes: [],
    createdAt: new Date("2026-02-27"), updatedAt: new Date("2026-02-27"),
  },
];

// ─── Field Reports ────────────────────────────────────────────────────────────

export const FIELD_REPORTS = [
  {
    id: "fr-1", projectId: "proj-1", authorId: "user-pm1",
    project: { id: "proj-1", name: "Northland Medical – Suite 200 Remodel" },
    author: pm1User,
    date: new Date("2026-02-28"), weather: "Cloudy, 28°F", crewCount: 6, hoursWorked: 48,
    workPerformed: "Continued drywall hanging in exam rooms 3-6. Started taping and bedding in corridor. Electricians completed rough-in trim in rooms 1-2.",
    issues: "Delayed delivery of drywall screws – 2hr delay in AM. Will not impact schedule.",
    safetyNotes: "All crew wearing proper PPE. Toolbox talk on fall protection.",
    createdAt: new Date("2026-02-28"),
  },
  {
    id: "fr-2", projectId: "proj-1", authorId: "user-pm1",
    project: { id: "proj-1", name: "Northland Medical – Suite 200 Remodel" },
    author: pm1User,
    date: new Date("2026-02-27"), weather: "Clear, 22°F", crewCount: 7, hoursWorked: 56,
    workPerformed: "Completed all drywall hang in Phase 1 area (reception and waiting room). Started hang in exam rooms 1-4. Plumber installed lavatories in restrooms.",
    issues: null,
    safetyNotes: "Reviewed winter work protocols – no incidents.",
    createdAt: new Date("2026-02-27"),
  },
  {
    id: "fr-3", projectId: "proj-2", authorId: "user-pm2",
    project: { id: "proj-2", name: "Lakewood Commons – Siding & Window Replacement" },
    author: pm2User,
    date: new Date("2026-02-28"), weather: "Snow, 18°F", crewCount: 8, hoursWorked: 64,
    workPerformed: "Scaffolding set on Buildings E and F. Demo of existing siding Buildings E-F started. Approximately 40% of siding removed.",
    issues: "Snow slowed morning work by approximately 1.5 hours. Scaffolding required snow removal before crew could work safely.",
    safetyNotes: "Full cold weather PPE enforced. Two workers sent back to truck for additional layers.",
    createdAt: new Date("2026-02-28"),
  },
  {
    id: "fr-4", projectId: "proj-3", authorId: "user-pm1",
    project: { id: "proj-3", name: "Riverside Office – Lobby Renovation" },
    author: pm1User,
    date: new Date("2026-02-28"), weather: "Clear, 34°F", crewCount: 4, hoursWorked: 32,
    workPerformed: "Completed demo of existing tile flooring in lobby. Concrete floor prep and self-leveling compound poured in east lobby zone. Feature wall framing started.",
    issues: null,
    safetyNotes: "Dust control measures in place for adjacent tenant areas. Air scrubbers running continuously.",
    createdAt: new Date("2026-02-28"),
  },
];

// ─── Projects (fully pre-joined) ──────────────────────────────────────────────

export const PROJECTS = [
  {
    id: "proj-1", name: "Northland Medical – Suite 200 Remodel",
    number: "PROJ-0001", status: "ACTIVE", type: "COMMERCIAL",
    description: "Full gut renovation of 4,200 sq ft medical office suite. New exam rooms, reception, breakroom, and ADA-compliant restrooms. Phased to allow partial occupancy.",
    address: "3100 Hennepin Ave, Suite 200", city: "Minneapolis",
    startDate: new Date("2026-01-15"), endDate: new Date("2026-04-30"),
    budget: 285000, spent: 142500,
    clientId: "client-2", managerId: "user-pm1",
    client: client2, manager: pm1User,
    milestones: proj1Milestones,
    workOrders: [WORK_ORDERS[0], WORK_ORDERS[3]].map(w => ({ ...w, client: client2 })),
    estimates: [{ ...ESTIMATES[0], client: client5 }],
    invoices: [INVOICES[0], INVOICES[1]],
    fieldReports: [FIELD_REPORTS[0], FIELD_REPORTS[1]],
    notes: [],
    lineItems: [],
    _count: { workOrders: 2, milestones: 5 },
    createdAt: new Date("2026-01-10"), updatedAt: new Date("2026-02-28"),
  },
  {
    id: "proj-2", name: "Lakewood Commons – Siding & Window Replacement",
    number: "PROJ-0002", status: "ACTIVE", type: "HOA",
    description: "Replace deteriorated LP siding on 8 buildings (Buildings A–H) with James Hardie fiber cement. Replace 340 windows throughout. Phase 1 complete, Phase 2 in progress.",
    address: "4400 Lakewood Dr", city: "Saint Paul",
    startDate: new Date("2025-09-01"), endDate: new Date("2026-05-31"),
    budget: 520000, spent: 275000,
    clientId: "client-1", managerId: "user-pm2",
    client: client1, manager: pm2User,
    milestones: proj2Milestones,
    workOrders: [WORK_ORDERS[0]].map(w => ({ ...w, client: client1 })),
    estimates: [],
    invoices: [INVOICES[2]],
    fieldReports: [FIELD_REPORTS[2]],
    notes: [],
    lineItems: [],
    _count: { workOrders: 1, milestones: 3 },
    createdAt: new Date("2025-08-15"), updatedAt: new Date("2026-02-28"),
  },
  {
    id: "proj-3", name: "Riverside Office – Lobby Renovation",
    number: "PROJ-0003", status: "ACTIVE", type: "COMMERCIAL",
    description: "Modernize building lobby and common areas. New flooring, lighting, signage, and feature wall. Work occurs nights and weekends to minimize tenant disruption.",
    address: "7200 France Ave S", city: "Edina",
    startDate: new Date("2026-02-01"), endDate: new Date("2026-03-31"),
    budget: 95000, spent: 18000,
    clientId: "client-3", managerId: "user-pm1",
    client: client3, manager: pm1User,
    milestones: [],
    workOrders: [],
    estimates: [],
    invoices: [],
    fieldReports: [FIELD_REPORTS[3]],
    notes: [],
    lineItems: [],
    _count: { workOrders: 0, milestones: 0 },
    createdAt: new Date("2026-01-20"), updatedAt: new Date("2026-02-28"),
  },
  {
    id: "proj-4", name: "Downtown Retail – Tenant Buildout Unit B",
    number: "PROJ-0004", status: "BIDDING", type: "COMMERCIAL",
    description: "New tenant buildout for restaurant space. Full MEP rough-in, commercial kitchen hood, custom millwork bar, polished concrete floors.",
    address: null, city: "Minneapolis",
    startDate: null, endDate: null,
    budget: 180000, spent: 0,
    clientId: "client-5", managerId: "user-pm2",
    client: client5, manager: pm2User,
    milestones: [],
    workOrders: [],
    estimates: [ESTIMATES[0]],
    invoices: [],
    fieldReports: [],
    notes: [],
    lineItems: [],
    _count: { workOrders: 0, milestones: 0 },
    createdAt: new Date("2026-02-01"), updatedAt: new Date("2026-02-15"),
  },
  {
    id: "proj-5", name: "Maple Creek – Balcony Deck Restoration",
    number: "PROJ-0005", status: "COMPLETED", type: "HOA",
    description: "Repair and waterproof 48 balcony decks across 4 buildings. Replace damaged framing members, install new Trex decking, and apply elastomeric coating.",
    address: "800 Maple Creek Blvd", city: "Plymouth",
    startDate: new Date("2025-05-01"), endDate: new Date("2025-10-15"),
    budget: 210000, spent: 198500,
    clientId: "client-4", managerId: "user-pm1",
    client: client4, manager: pm1User,
    milestones: [],
    workOrders: [],
    estimates: [],
    invoices: [INVOICES[3]],
    fieldReports: [],
    notes: [],
    lineItems: [],
    _count: { workOrders: 0, milestones: 0 },
    createdAt: new Date("2025-04-20"), updatedAt: new Date("2025-10-20"),
  },
];
