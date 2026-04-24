import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();
const DATA_FILE = path.join(process.cwd(), 'scratch', 'drive_data.json');

async function main() {
  console.log('🚀 Iniciando Importação Local Imoto...');
  
  if (!fs.existsSync(DATA_FILE)) {
    console.error(`❌ Erro: Arquivo ${DATA_FILE} não encontrado.`);
    console.log('💡 Por favor, crie o arquivo e cole o JSON gerado pelo Google Apps Script.');
    return;
  }

  try {
    const rawData = fs.readFileSync(DATA_FILE, 'utf8');
    const items = JSON.parse(rawData);

    console.log(`📦 Encontrados ${items.length} itens para processar.`);

    let created = 0;
    let skipped = 0;

    for (const item of items) {
      const mediaUrl = `https://drive.google.com/file/d/${item.id}/view`;
      
      // Verifica se já existe
      const exists = await prisma.artifact.findFirst({
        where: { mediaUrl }
      });

      if (exists) {
        skipped++;
        continue;
      }

      await prisma.artifact.create({
        data: {
          type: item.type === 'Documento' ? 'DOCUMENT' : 'PHOTO',
          title: item.title.replace(/\.[^/.]+$/, "").replace(/_/g, " "),
          mediaUrl: mediaUrl,
          category: item.category || 'Família e Relações',
          location: item.location || 'Brasil',
          year: item.year || 'S/D',
          contextDescription: `Importado de: ${item.folderPath}`
        }
      });
      created++;
      
      if (created % 10 === 0) {
        process.stdout.write(`   Importados: ${created}/${items.length}\r`);
      }
    }

    console.log(`\n\n✅ Sucesso!`);
    console.log(`   - Novos registros: ${created}`);
    console.log(`   - Pulados (duplicados): ${skipped}`);

  } catch (error) {
    console.error('💥 Erro durante a importação:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
