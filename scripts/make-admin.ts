import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function makeAdmin(email: string) {
  try {
    const user = await prisma.user.update({
      where: { email },
      data: { 
        role: 'ADMIN', 
        status: 'APPROVED' 
      }
    });
    console.log(`✅ Sucesso! O usuário ${user.email} agora é ADMIN e está APROVADO.`);
  } catch (error) {
    console.error(`❌ Erro: Usuário com e-mail ${email} não encontrado. Certifique-se de que você já se cadastrou no site.`);
  }
}

const email = process.argv[2];
if (!email) {
  console.error("Uso: npx tsx scripts/make-admin.ts seu-email@exemplo.com");
  process.exit(1);
}

makeAdmin(email)
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
