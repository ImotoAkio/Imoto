import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = 'avitorakio@outlook.com';
  const password = 'admin'; // Desired password
  const name = 'Henrique Atsushi (Admin)';

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      role: 'ADMIN',
      status: 'APPROVED',
      passwordHash,
      name
    },
    create: {
      email,
      name,
      passwordHash,
      role: 'ADMIN',
      status: 'APPROVED'
    }
  });

  console.log('Admin user updated/created:', {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status
  });
  console.log('Password set to: admin');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
