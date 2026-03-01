import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import bcrypt from "bcryptjs";

const adapter = new PrismaLibSql({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding Construction OS for Construct-All Corporation...");

  // ─── Users ──────────────────────────────────────────────────────────────────
  const adminPassword = await bcrypt.hash("admin123", 10);
  const pmPassword = await bcrypt.hash("pm123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@constructall.com" },
    update: {},
    create: {
      email: "admin@constructall.com",
      name: "Mike Johnson",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  const pm1 = await prisma.user.upsert({
    where: { email: "sarah@constructall.com" },
    update: {},
    create: {
      email: "sarah@constructall.com",
      name: "Sarah Peterson",
      password: pmPassword,
      role: "PM",
    },
  });

  const pm2 = await prisma.user.upsert({
    where: { email: "tom@constructall.com" },
    update: {},
    create: {
      email: "tom@constructall.com",
      name: "Tom Anderson",
      password: pmPassword,
      role: "PM",
    },
  });

  console.log("✅ Users created");

  // ─── Clients ─────────────────────────────────────────────────────────────────
  const client1 = await prisma.client.create({
    data: {
      name: "Lakewood Commons HOA",
      type: "HOA",
      contactName: "Barbara Mitchell",
      email: "bmitchell@lakewoodcommons.org",
      phone: "(651) 555-0142",
      address: "4400 Lakewood Dr",
      city: "Saint Paul",
      state: "MN",
      zip: "55110",
    },
  });

  const client2 = await prisma.client.create({
    data: {
      name: "Northland Medical Group",
      type: "COMMERCIAL",
      contactName: "David Chen",
      email: "dchen@northlandmedical.com",
      phone: "(612) 555-0271",
      address: "3100 Hennepin Ave",
      city: "Minneapolis",
      state: "MN",
      zip: "55408",
    },
  });

  const client3 = await prisma.client.create({
    data: {
      name: "Riverside Office Partners",
      type: "COMMERCIAL",
      contactName: "Janet Kowalski",
      email: "janet@riversideofficepartners.com",
      phone: "(952) 555-0388",
      address: "7200 France Ave S",
      city: "Edina",
      state: "MN",
      zip: "55435",
    },
  });

  const client4 = await prisma.client.create({
    data: {
      name: "Maple Creek Condo Association",
      type: "HOA",
      contactName: "Robert Nguyen",
      email: "rnguyen@maplecreekcondo.com",
      phone: "(763) 555-0519",
      address: "800 Maple Creek Blvd",
      city: "Plymouth",
      state: "MN",
      zip: "55441",
    },
  });

  const client5 = await prisma.client.create({
    data: {
      name: "Downtown Retail LLC",
      type: "COMMERCIAL",
      contactName: "Lisa Hoffman",
      email: "lisa@downtownretail.com",
      phone: "(612) 555-0634",
      address: "50 S 6th St, Ste 1400",
      city: "Minneapolis",
      state: "MN",
      zip: "55402",
    },
  });

  console.log("✅ Clients created");

  // ─── Projects ─────────────────────────────────────────────────────────────────
  const project1 = await prisma.project.create({
    data: {
      name: "Northland Medical – Suite 200 Remodel",
      number: "PROJ-0001",
      status: "ACTIVE",
      type: "COMMERCIAL",
      description: "Full gut renovation of 4,200 sq ft medical office suite. New exam rooms, reception, breakroom, and ADA-compliant restrooms. Phased to allow partial occupancy.",
      address: "3100 Hennepin Ave, Suite 200",
      city: "Minneapolis",
      budget: 285000,
      spent: 142500,
      startDate: new Date("2026-01-15"),
      endDate: new Date("2026-04-30"),
      clientId: client2.id,
      managerId: pm1.id,
    },
  });

  const project2 = await prisma.project.create({
    data: {
      name: "Lakewood Commons – Siding & Window Replacement",
      number: "PROJ-0002",
      status: "ACTIVE",
      type: "HOA",
      description: "Replace deteriorated LP siding on 8 buildings (Buildings A–H) with James Hardie fiber cement. Replace 340 windows throughout. Phase 1 complete, Phase 2 in progress.",
      address: "4400 Lakewood Dr",
      city: "Saint Paul",
      budget: 520000,
      spent: 275000,
      startDate: new Date("2025-09-01"),
      endDate: new Date("2026-05-31"),
      clientId: client1.id,
      managerId: pm2.id,
    },
  });

  const project3 = await prisma.project.create({
    data: {
      name: "Riverside Office – Lobby Renovation",
      number: "PROJ-0003",
      status: "ACTIVE",
      type: "COMMERCIAL",
      description: "Modernize building lobby and common areas. New flooring, lighting, signage, and feature wall. Work occurs nights and weekends to minimize tenant disruption.",
      address: "7200 France Ave S",
      city: "Edina",
      budget: 95000,
      spent: 18000,
      startDate: new Date("2026-02-01"),
      endDate: new Date("2026-03-31"),
      clientId: client3.id,
      managerId: pm1.id,
    },
  });

  const project4 = await prisma.project.create({
    data: {
      name: "Downtown Retail – Tenant Buildout Unit B",
      number: "PROJ-0004",
      status: "BIDDING",
      type: "COMMERCIAL",
      description: "New tenant buildout for restaurant space. Full MEP rough-in, commercial kitchen hood, custom millwork bar, polished concrete floors.",
      city: "Minneapolis",
      budget: 180000,
      clientId: client5.id,
      managerId: pm2.id,
    },
  });

  const project5 = await prisma.project.create({
    data: {
      name: "Maple Creek – Balcony Deck Restoration",
      number: "PROJ-0005",
      status: "COMPLETED",
      type: "HOA",
      description: "Repair and waterproof 48 balcony decks across 4 buildings. Replace damaged framing members, install new Trex decking, and apply elastomeric coating.",
      address: "800 Maple Creek Blvd",
      city: "Plymouth",
      budget: 210000,
      spent: 198500,
      startDate: new Date("2025-05-01"),
      endDate: new Date("2025-10-15"),
      clientId: client4.id,
      managerId: pm1.id,
    },
  });

  console.log("✅ Projects created");

  // ─── Milestones ───────────────────────────────────────────────────────────────
  await prisma.milestone.createMany({
    data: [
      { projectId: project1.id, name: "Demo & Rough-In", status: "COMPLETED", dueDate: new Date("2026-02-01"), completedAt: new Date("2026-01-28"), order: 1 },
      { projectId: project1.id, name: "MEP Rough Inspections", status: "COMPLETED", dueDate: new Date("2026-02-15"), completedAt: new Date("2026-02-12"), order: 2 },
      { projectId: project1.id, name: "Drywall & Finishes", status: "IN_PROGRESS", dueDate: new Date("2026-03-15"), order: 3 },
      { projectId: project1.id, name: "Millwork & Casework", status: "PENDING", dueDate: new Date("2026-03-31"), order: 4 },
      { projectId: project1.id, name: "Final Inspections & Punch List", status: "PENDING", dueDate: new Date("2026-04-20"), order: 5 },
      { projectId: project2.id, name: "Phase 1 – Buildings A-D Siding", status: "COMPLETED", dueDate: new Date("2025-12-15"), completedAt: new Date("2025-12-18"), order: 1 },
      { projectId: project2.id, name: "Phase 2 – Buildings E-H Siding", status: "IN_PROGRESS", dueDate: new Date("2026-03-31"), order: 2 },
      { projectId: project2.id, name: "Window Replacement – All Buildings", status: "PENDING", dueDate: new Date("2026-05-15"), order: 3 },
    ],
  });

  console.log("✅ Milestones created");

  // ─── Work Orders ──────────────────────────────────────────────────────────────
  const wo1 = await prisma.workOrder.create({
    data: {
      number: "WO-0001",
      title: "Unit 14A – Water Damage Drywall Repair",
      description: "Ceiling and wall drywall repair in bedroom and bathroom following roof leak. Approximately 60 sq ft affected. Tape, float, texture, and paint to match.",
      status: "IN_PROGRESS",
      priority: "HIGH",
      clientId: client1.id,
      projectId: project2.id,
      scheduledAt: new Date("2026-03-03"),
      laborCost: 850,
      materialCost: 225,
    },
  });

  const wo2 = await prisma.workOrder.create({
    data: {
      number: "WO-0002",
      title: "Maple Creek Bldg 3 – Sliding Door Repair",
      description: "Sliding patio door in unit 308 will not lock. Inspect hardware, replace mortise lock and strike plate if needed.",
      status: "OPEN",
      priority: "NORMAL",
      clientId: client4.id,
      scheduledAt: new Date("2026-03-05"),
      laborCost: 280,
      materialCost: 85,
    },
  });

  const wo3 = await prisma.workOrder.create({
    data: {
      number: "WO-0003",
      title: "Riverside Office – Stair Handrail Repair",
      description: "East stairwell handrail loose at 3rd floor landing. Weld and reinforce bracket. Safety hazard – urgent.",
      status: "COMPLETED",
      priority: "URGENT",
      clientId: client3.id,
      scheduledAt: new Date("2026-02-20"),
      completedAt: new Date("2026-02-20"),
      laborCost: 320,
      materialCost: 40,
    },
  });

  const wo4 = await prisma.workOrder.create({
    data: {
      number: "WO-0004",
      title: "Northland Medical – ADA Restroom Grab Bar Install",
      description: "Install 3 ADA-compliant grab bars in accessible restroom per drawings. Blocking already in walls from renovation.",
      status: "OPEN",
      priority: "NORMAL",
      clientId: client2.id,
      projectId: project1.id,
      scheduledAt: new Date("2026-03-10"),
      laborCost: 420,
      materialCost: 180,
    },
  });

  console.log("✅ Work Orders created");

  // ─── Estimates ────────────────────────────────────────────────────────────────
  const estimate1 = await prisma.estimate.create({
    data: {
      number: "EST-0001",
      title: "Downtown Retail – Unit B Restaurant Buildout",
      status: "SENT",
      clientId: client5.id,
      projectId: project4.id,
      validUntil: new Date("2026-04-01"),
      subtotal: 168500,
      taxRate: 0,
      total: 168500,
      notes: "Includes all labor, materials, and supervision. Permit fees not included. Assumes tenant provides all FF&E.",
      lineItems: {
        create: [
          { description: "Demo existing finishes", category: "LABOR", quantity: 40, unit: "hrs", unitPrice: 85, total: 3400, order: 1 },
          { description: "Framing – interior partitions", category: "LABOR", quantity: 120, unit: "hrs", unitPrice: 78, total: 9360, order: 2 },
          { description: "Rough electrical", category: "SUBCONTRACTOR", quantity: 1, unit: "lot", unitPrice: 28000, total: 28000, order: 3 },
          { description: "Rough plumbing", category: "SUBCONTRACTOR", quantity: 1, unit: "lot", unitPrice: 22500, total: 22500, order: 4 },
          { description: "Commercial kitchen hood & suppression", category: "SUBCONTRACTOR", quantity: 1, unit: "lot", unitPrice: 18500, total: 18500, order: 5 },
          { description: "Insulation", category: "MATERIAL", quantity: 1, unit: "lot", unitPrice: 4200, total: 4200, order: 6 },
          { description: "Drywall & finishes", category: "LABOR", quantity: 200, unit: "hrs", unitPrice: 72, total: 14400, order: 7 },
          { description: "Polished concrete floors", category: "SUBCONTRACTOR", quantity: 3200, unit: "sqft", unitPrice: 6.5, total: 20800, order: 8 },
          { description: "Custom millwork bar", category: "SUBCONTRACTOR", quantity: 1, unit: "lot", unitPrice: 24000, total: 24000, order: 9 },
          { description: "Paint – all areas", category: "LABOR", quantity: 80, unit: "hrs", unitPrice: 65, total: 5200, order: 10 },
          { description: "Project management & supervision", category: "LABOR", quantity: 80, unit: "hrs", unitPrice: 95, total: 7600, order: 11 },
          { description: "Miscellaneous materials & hardware", category: "MATERIAL", quantity: 1, unit: "lot", unitPrice: 6540, total: 6540, order: 12 },
        ],
      },
    },
  });

  const estimate2 = await prisma.estimate.create({
    data: {
      number: "EST-0002",
      title: "Lakewood Commons – Phase 3 Parking Lot Repairs",
      status: "DRAFT",
      clientId: client1.id,
      subtotal: 42000,
      taxRate: 0,
      total: 42000,
      lineItems: {
        create: [
          { description: "Crack filling – entire lot", category: "LABOR", quantity: 1, unit: "lot", unitPrice: 4500, total: 4500, order: 1 },
          { description: "Remove and replace deteriorated asphalt sections", category: "SUBCONTRACTOR", quantity: 1, unit: "lot", unitPrice: 28000, total: 28000, order: 2 },
          { description: "Sealcoat and restripe", category: "SUBCONTRACTOR", quantity: 1, unit: "lot", unitPrice: 9500, total: 9500, order: 3 },
        ],
      },
    },
  });

  console.log("✅ Estimates created");

  // ─── Invoices ─────────────────────────────────────────────────────────────────
  await prisma.invoice.create({
    data: {
      number: "INV-0001",
      status: "PAID",
      clientId: client2.id,
      projectId: project1.id,
      issueDate: new Date("2026-01-31"),
      dueDate: new Date("2026-02-28"),
      paidDate: new Date("2026-02-15"),
      subtotal: 95000,
      taxRate: 0,
      taxAmount: 0,
      total: 95000,
      amountPaid: 95000,
      notes: "Progress billing – 33% of contract. Phase 1 (Demo & Rough-In) complete.",
      lineItems: {
        create: [
          { description: "Progress billing – Phase 1 (Demo & Rough-In)", quantity: 1, unitPrice: 85000, total: 85000, order: 1 },
          { description: "MEP rough-in (partial)", quantity: 1, unitPrice: 10000, total: 10000, order: 2 },
        ],
      },
    },
  });

  await prisma.invoice.create({
    data: {
      number: "INV-0002",
      status: "SENT",
      clientId: client2.id,
      projectId: project1.id,
      issueDate: new Date("2026-02-28"),
      dueDate: new Date("2026-03-28"),
      subtotal: 47500,
      taxRate: 0,
      taxAmount: 0,
      total: 47500,
      amountPaid: 0,
      notes: "Progress billing – Phase 2 (MEP & Framing) complete.",
      lineItems: {
        create: [
          { description: "Progress billing – Phase 2 (MEP & Framing)", quantity: 1, unitPrice: 47500, total: 47500, order: 1 },
        ],
      },
    },
  });

  await prisma.invoice.create({
    data: {
      number: "INV-0003",
      status: "PARTIAL",
      clientId: client1.id,
      projectId: project2.id,
      issueDate: new Date("2026-01-15"),
      dueDate: new Date("2026-02-14"),
      subtotal: 275000,
      taxRate: 0,
      taxAmount: 0,
      total: 275000,
      amountPaid: 137500,
      notes: "Phase 1 billing – Buildings A-D siding complete.",
      lineItems: {
        create: [
          { description: "Phase 1 – Siding, Buildings A-D", quantity: 1, unitPrice: 260000, total: 260000, order: 1 },
          { description: "Scaffolding and equipment", quantity: 1, unitPrice: 15000, total: 15000, order: 2 },
        ],
      },
    },
  });

  await prisma.invoice.create({
    data: {
      number: "INV-0004",
      status: "OVERDUE",
      clientId: client4.id,
      projectId: project5.id,
      issueDate: new Date("2025-11-01"),
      dueDate: new Date("2025-11-30"),
      subtotal: 198500,
      taxRate: 0,
      taxAmount: 0,
      total: 198500,
      amountPaid: 160000,
      notes: "Final billing – Maple Creek balcony restoration complete.",
      lineItems: {
        create: [
          { description: "Balcony deck restoration – all 48 units", quantity: 1, unitPrice: 185000, total: 185000, order: 1 },
          { description: "Additional framing repairs (change order #2)", quantity: 1, unitPrice: 13500, total: 13500, order: 2 },
        ],
      },
    },
  });

  console.log("✅ Invoices created");

  // ─── Field Reports ────────────────────────────────────────────────────────────
  await prisma.fieldReport.createMany({
    data: [
      {
        projectId: project1.id,
        authorId: pm1.id,
        date: new Date("2026-02-28"),
        weather: "Cloudy, 28°F",
        crewCount: 6,
        hoursWorked: 48,
        workPerformed: "Continued drywall hanging in exam rooms 3-6. Started taping and bedding in corridor. Electricians completed rough-in trim in rooms 1-2.",
        issues: "Delayed delivery of drywall screws – 2hr delay in AM. Will not impact schedule.",
        safetyNotes: "All crew wearing proper PPE. Toolbox talk on fall protection.",
      },
      {
        projectId: project1.id,
        authorId: pm1.id,
        date: new Date("2026-02-27"),
        weather: "Clear, 22°F",
        crewCount: 7,
        hoursWorked: 56,
        workPerformed: "Completed all drywall hang in Phase 1 area (reception and waiting room). Started hang in exam rooms 1-4. Plumber installed lavatories in restrooms.",
        issues: null,
        safetyNotes: "Reviewed winter work protocols – no incidents.",
      },
      {
        projectId: project2.id,
        authorId: pm2.id,
        date: new Date("2026-02-28"),
        weather: "Snow, 18°F",
        crewCount: 8,
        hoursWorked: 64,
        workPerformed: "Scaffolding set on Buildings E and F. Demo of existing siding Buildings E-F started. Approximately 40% of siding removed.",
        issues: "Snow slowed morning work by approximately 1.5 hours. Scaffolding required snow removal before crew could work safely.",
        safetyNotes: "Full cold weather PPE enforced. Two workers sent back to truck for additional layers.",
      },
      {
        projectId: project3.id,
        authorId: pm1.id,
        date: new Date("2026-02-28"),
        weather: "Clear, 34°F",
        crewCount: 4,
        hoursWorked: 32,
        workPerformed: "Completed demo of existing tile flooring in lobby. Concrete floor prep and self-leveling compound poured in east lobby zone. Feature wall framing started.",
        issues: null,
        safetyNotes: "Dust control measures in place for adjacent tenant areas. Air scrubbers running continuously.",
      },
    ],
  });

  console.log("✅ Field Reports created");

  console.log("\n🏗️  Construction OS seed complete!");
  console.log("─────────────────────────────────────");
  console.log("👤 Admin login: admin@constructall.com / admin123");
  console.log("👤 PM login:    sarah@constructall.com / pm123");
  console.log("─────────────────────────────────────\n");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
