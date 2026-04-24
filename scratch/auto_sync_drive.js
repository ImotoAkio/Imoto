import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const ROOT_FOLDER_ID = '1Xu0fsAVYQ85HIK8u0qMtVGZ9BuX6EqIP';
const BATCH_SIZE = 10;

/**
 * Tenta extrair a lista de arquivos de uma pasta pública do Drive.
 * Usa um regex para encontrar padrões de ID e Nome dentro do HTML de visualização.
 */
async function fetchFolderItems(folderId) {
  const url = `https://drive.google.com/embeddedfolderview?id=${folderId}`;
  console.log(`🔍 Escaneando pasta: ${folderId}...`);
  
  try {
    const res = await fetch(url);
    const html = await res.text();
    
    const items = [];
    
    // O padrão do Google Drive para itens no embeddedview é:
    // ["FOLDER_ID/FILE_ID", "NAME", type, ...]
    // Vamos capturar strings que parecem IDs de Drive (25-50 chars) seguidas de um nome de arquivo
    const itemRegex = /"([a-zA-Z0-9_-]{28,50})","([^"]+)"/g;
    let match;
    while ((match = itemRegex.exec(html)) !== null) {
      const id = match[1];
      const name = match[2];
      
      const isImage = /\.(jpg|jpeg|png|webp|gif|bmp)$/i.test(name);
      // Se não tem extensão e não é o ID da própria pasta, tratamos como subpasta
      const isFolder = !name.includes('.') && id !== folderId; 
      
      items.push({ id, name, isFolder, isImage });
    }
    
    // Remove duplicatas exatas
    return items.filter((item, index, self) => 
      self.findIndex(t => t.id === item.id) === index
    );
  } catch (e) {
    console.error(`❌ Erro ao ler pasta ${folderId}:`, e.message);
    return [];
  }
}

async function deepCrawl(folderId, allImages = [], visited = new Set()) {
  if (visited.has(folderId)) return;
  visited.add(folderId);

  const items = await fetchFolderItems(folderId);
  console.log(`   └─ Encontrados ${items.length} itens na pasta.`);
  
  for (const item of items) {
    if (item.isImage) {
      allImages.push({ id: item.id, name: item.name });
    } else if (item.isFolder) {
      await deepCrawl(item.id, allImages, visited);
    }
  }
  
  return allImages;
}

async function syncToDatabase(images) {
  console.log(`\n💾 Sincronizando ${images.length} fotos com o banco de dados...`);
  let createdCount = 0;
  
  for (let i = 0; i < images.length; i += BATCH_SIZE) {
    const batch = images.slice(i, i + BATCH_SIZE);
    
    const promises = batch.map(async (img) => {
      const mediaUrl = `https://drive.google.com/file/d/${img.id}/view`;
      
      const exists = await prisma.artifact.findFirst({
        where: { mediaUrl }
      });
      
      if (!exists) {
        await prisma.artifact.create({
          data: {
            title: img.name.replace(/\.[^/.]+$/, "").replace(/_/g, " "),
            type: 'PHOTO',
            category: 'Família e Relações',
            year: 'S/D',
            description: `Importado automaticamente da pasta Drive.`,
            mediaUrl: mediaUrl
          }
        });
        createdCount++;
      }
    });
    
    await Promise.all(promises);
    process.stdout.write(`   Progresso: ${Math.min(i + BATCH_SIZE, images.length)}/${images.length}\r`);
  }
  
  console.log(`\n✅ Sincronização concluída! ${createdCount} novas fotos adicionadas.`);
}

async function main() {
  console.log('🚀 Iniciando Crawler Automático Imoto (ESM Version)...');
  
  try {
    const allImages = await deepCrawl(ROOT_FOLDER_ID);
    console.log(`\n✨ Varredura Finalizada. Total de ${allImages.length} imagens mapeadas.`);
    
    if (allImages.length > 0) {
        await syncToDatabase(allImages);
    } else {
        console.log('⚠️ Nenhuma imagem encontrada. Verifique se a pasta é pública.');
    }
  } catch (e) {
    console.error('💥 Erro fatal:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
