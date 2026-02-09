// prisma/seed.ts

import { prisma } from "../lib/prisma";

const ROLES = ["Super Admin", "Accountant", "Manager", "Staff"];

const FEATURES = ["Supplier", "Customer", "Product", "Variation", "Purchase", "Sale", "Reports"];

const ACTIONS = ["View", "Create", "Update", "Delete", "Import", "Export", "Print"];

async function main() {
  // 1) Roles
  await prisma.role.createMany({
    data: ROLES.map((name) => ({ name })),
    skipDuplicates: true,
  });

  // 2) Features
  await prisma.feature.createMany({
    data: FEATURES.map((name) => ({ name })),
    skipDuplicates: true,
  });

  // 3) Permissions (ACTIONS x FEATURES)
  const features = await prisma.feature.findMany({ select: { id: true } });

  await prisma.permission.createMany({
    data: features.flatMap((f) =>
      ACTIONS.map((a) => ({
        name: a,
        featureId: f.id,
      })),
    ),
    skipDuplicates: true,
  });

  

  await prisma.adminUser.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      name: "Test Admin",
      username: "admin",
      email: "admin@example.com",
      password: "123456", 
      role: { connect: { name: "Super Admin" } },
      isActive: true,
    },
  });

  console.log("Data inserted successfully!");
}

main()
  .catch((e) => {
    console.error("Error seeding data:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
