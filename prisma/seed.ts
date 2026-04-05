import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const SALT_ROUNDS = 10;

async function main() {
  console.log("Seeding database...\n");

  // ── Users ──────────────────────────────────────────

  const adminHash = await bcrypt.hash("admin123", SALT_ROUNDS);
  const analystHash = await bcrypt.hash("analyst123", SALT_ROUNDS);
  const viewerHash = await bcrypt.hash("viewer123", SALT_ROUNDS);

  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@example.com",
      passwordHash: adminHash,
      role: "ADMIN",
      status: "ACTIVE",
    },
  });

  const analyst = await prisma.user.upsert({
    where: { email: "analyst@example.com" },
    update: {},
    create: {
      name: "Analyst User",
      email: "analyst@example.com",
      passwordHash: analystHash,
      role: "ANALYST",
      status: "ACTIVE",
    },
  });

  await prisma.user.upsert({
    where: { email: "viewer@example.com" },
    update: {},
    create: {
      name: "Viewer User",
      email: "viewer@example.com",
      passwordHash: viewerHash,
      role: "VIEWER",
      status: "ACTIVE",
    },
  });

  console.log("Users seeded:");
  console.log("  admin@example.com   / admin123   (ADMIN)");
  console.log("  analyst@example.com / analyst123 (ANALYST)");
  console.log("  viewer@example.com  / viewer123  (VIEWER)\n");

  // ── Financial Records ──────────────────────────────

  const existingCount = await prisma.financialRecord.count();
  if (existingCount > 0) {
    console.log(`Skipping records — ${existingCount} already exist.\n`);
  } else {
    const records = [
      { amount: 8500, type: "INCOME" as const, category: "Salary", date: "2026-01-15", notes: "January salary", createdById: admin.id },
      { amount: 8500, type: "INCOME" as const, category: "Salary", date: "2026-02-15", notes: "February salary", createdById: admin.id },
      { amount: 8500, type: "INCOME" as const, category: "Salary", date: "2026-03-15", notes: "March salary", createdById: admin.id },
      { amount: 2200, type: "INCOME" as const, category: "Freelance", date: "2026-01-20", notes: "Website project", createdById: admin.id },
      { amount: 1800, type: "INCOME" as const, category: "Freelance", date: "2026-03-05", notes: "Consulting work", createdById: admin.id },
      { amount: 3500, type: "INCOME" as const, category: "Sales", date: "2026-02-28", notes: "Product sales Q1", createdById: admin.id },
      { amount: 2500, type: "EXPENSE" as const, category: "Rent", date: "2026-01-01", notes: "Office rent January", createdById: admin.id },
      { amount: 2500, type: "EXPENSE" as const, category: "Rent", date: "2026-02-01", notes: "Office rent February", createdById: admin.id },
      { amount: 2500, type: "EXPENSE" as const, category: "Rent", date: "2026-03-01", notes: "Office rent March", createdById: admin.id },
      { amount: 450, type: "EXPENSE" as const, category: "Utilities", date: "2026-01-10", notes: "Electricity and internet", createdById: admin.id },
      { amount: 480, type: "EXPENSE" as const, category: "Utilities", date: "2026-02-10", notes: "Electricity and internet", createdById: admin.id },
      { amount: 520, type: "EXPENSE" as const, category: "Utilities", date: "2026-03-10", notes: "Electricity and internet", createdById: admin.id },
      { amount: 1200, type: "EXPENSE" as const, category: "Marketing", date: "2026-02-14", notes: "Social media campaign", createdById: admin.id },
      { amount: 350, type: "EXPENSE" as const, category: "Office Supplies", date: "2026-01-25", notes: "Stationery and printer ink", createdById: admin.id },
      { amount: 275, type: "EXPENSE" as const, category: "Office Supplies", date: "2026-03-18", notes: "Desk accessories", createdById: admin.id },
      { amount: 950, type: "EXPENSE" as const, category: "Travel", date: "2026-03-22", notes: "Client meeting travel", createdById: admin.id },
    ];

    for (const r of records) {
      await prisma.financialRecord.create({
        data: {
          amount: r.amount,
          type: r.type,
          category: r.category,
          date: new Date(r.date),
          notes: r.notes,
          createdById: r.createdById,
        },
      });
    }

    console.log(`${records.length} financial records seeded.\n`);
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
