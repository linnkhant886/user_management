// prisma/seed.ts

import { prisma } from '../lib/prisma';

async function main() {
  await prisma.role.createMany({
    data: [
      { name: 'Super Admin' },
      { name: 'Accountant' },
      { name: 'Manager' },
      { name: 'Staff' },
    ],
    skipDuplicates: true,
  });

  await prisma.feature.createMany({
    data: [
      { name: 'product' },
      { name: 'supplier' },
      { name: 'Reports' },
    ],
    skipDuplicates: true,
  });

  await prisma.adminUser.create({
    data: {
      name: 'Test Admin',
      username: 'admin',
      email: 'admin@example.com',
      password: '123456',
      role: {
        connect: { name: 'Super Admin' },
      },
      isActive: true,
    },
  });

  console.log('Seed data inserted successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
