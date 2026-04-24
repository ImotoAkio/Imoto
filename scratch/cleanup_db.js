import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  console.log('🧹 Limpando tabela de citações para correção do banco...');
  await prisma.artifactCitation.deleteMany({});
  console.log('✅ Pronto. Agora posso atualizar a estrutura.');
}
main().finally(() => prisma.$disconnect());
