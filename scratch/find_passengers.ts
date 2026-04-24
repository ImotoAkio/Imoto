import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const names = [
    'Makisuke', 'Kura', 'Atsushi', 'Toshio', 'Mitsuro', 'Shiro', 'Iwao',
    'Shiro', 'Sakue', 'Seitaro', 'Sakae', 'Kiyotake', 'Tsuta'
  ];
  
  const found = await prisma.member.findMany({
    where: {
      OR: names.map(n => ({ firstName: { contains: n } }))
    }
  });
  
  console.log('Found members:', JSON.stringify(found, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
