import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

const storiesMetadata = [
  { 
    file: '1.md', 
    tag: 'Capítulo 1', 
    author: 'Arquivo Imoto',
    coverImage: '/api/proxy-image?id=167DDyeUVtNkCQiclTMnql9IoY0JKT5GD'
  },
  { 
    file: '2.md', 
    tag: 'Capítulo 2', 
    author: 'Arquivo Imoto',
    coverImage: 'https://projetokaeru.org.br/wp-content/uploads/2016/02/kasato_maru_postal_card.jpg'
  },
  { 
    file: '3.md', 
    tag: 'Capítulo 3', 
    author: 'Arquivo Imoto',
    coverImage: '/api/proxy-image?id=12AOi4K4RdDiyJ2aIxV4Eo-QaFalf0xoR'
  },
  { 
    file: '4.md', 
    tag: 'Capítulo 4', 
    author: 'Arquivo Imoto',
    coverImage: '/api/proxy-image?id=149dzQHw92qMFSuDapUx_TJwsaGxZw0J-'
  },
  { 
    file: '5.md', 
    tag: 'Capítulo 5', 
    author: 'Arquivo Imoto',
    coverImage: '/api/proxy-image?id=1pAKkqPb4xT7JDRStxLWyUFrQnVlfWlup'
  },
];

async function seed() {
  console.log('🌱 Semeando histórias originais dos arquivos MD...');
  
  await prisma.story.deleteMany();
  
  const historiasDir = path.join(process.cwd(), 'historias');
  
  for (const meta of storiesMetadata) {
    const filePath = path.join(historiasDir, meta.file);
    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️ Arquivo não encontrado: ${meta.file}`);
      continue;
    }
    
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    const title = lines[0].trim(); // Mantém o título original completo (ex: Capítulo 1: ...)
    const storyContent = lines.slice(1).join('\n').trim();
    
    // Pegar o primeiro parágrafo significativo para o resumo
    const firstParagraph = lines.find(l => l.trim().length > 50)?.trim() || '';
    const excerpt = firstParagraph.substring(0, 150) + (firstParagraph.length > 150 ? '...' : '');
    
    await prisma.story.create({
      data: {
        tag: meta.tag,
        title: title,
        excerpt: excerpt,
        content: storyContent,
        author: meta.author,
        coverImage: meta.coverImage,
        publishDate: new Date()
      }
    });
    console.log(`✅ Inserida: ${title}`);
  }
  
  console.log('✨ Seed finalizado!');
}

seed()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
