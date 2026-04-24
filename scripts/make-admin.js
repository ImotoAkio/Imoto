import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function makeAdmin(email) {
  if (!email) {
    console.error("Uso: node scripts/make-admin.js email@exemplo.com");
    process.exit(1);
  }

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
    console.error(`❌ Erro: Usuário com e-mail ${email} não encontrado. Certifique-se de que o usuário já se cadastrou.`);
  } finally {
    await prisma.$disconnect();
  }
}

makeAdmin(process.argv[2]);
