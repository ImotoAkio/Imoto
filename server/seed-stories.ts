import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

const storiesData = [
  { file: '1.md', tag: 'Imigração', author: 'Arquivo Imoto' },
  { file: '2.md', tag: 'Resiliência', author: 'Arquivo Imoto' },
  { file: '3.md', tag: 'História', author: 'Arquivo Imoto' },
  { file: '4.md', tag: 'Família', author: 'Arquivo Imoto' },
  { file: '5.md', tag: 'Legado', author: 'Arquivo Imoto' },
];

const placeholders = [
  'https://images.unsplash.com/photo-1528164344705-4754268799af?auto=format&fit=crop&q=80&w=1000', // Japan style
  'https://images.unsplash.com/photo-1582192732898-13d42d38565b?auto=format&fit=crop&q=80&w=1000', // Resilience/History
  'https://images.unsplash.com/photo-1464692805480-a69dfaafdb0d?auto=format&fit=crop&q=80&w=1000', // Old paper/War
  'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&q=80&w=1000', // Family
  'https://images.unsplash.com/photo-1495107334309-fcf20532ca7a?auto=format&fit=crop&q=80&w=1000', // Coffee/Legacy
];

async function main() {
  console.log('🌱 Iniciando inserção de histórias...');
  
  // Limpar histórias existentes para garantir que as versões limpas sejam inseridas
  await prisma.story.deleteMany();
  console.log('🗑️ Histórias antigas removidas.');
  
  const historiasPath = path.join(process.cwd(), 'historias');
  
  for (let i = 0; i < storiesData.length; i++) {
    const item = storiesData[i];
    const filePath = path.join(historiasPath, item.file);
    
    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️ Arquivo não encontrado: ${item.file}`);
      continue;
    }
    
    const rawContent = fs.readFileSync(filePath, 'utf-8');
    const lines = rawContent.split('\n');
    
    // Extrair título do primeiro capítulo
    const titleLine = lines[0].replace(/Capítulo \d+: /, '').trim();
    const content = lines.slice(1).join('\n').trim();
    
    // Extrair excerpt (primeiro parágrafo não vazio)
    const excerpt = lines.find(l => l.trim().length > 50)?.trim().substring(0, 150) + '...';
    
    const existing = await prisma.story.findFirst({
      where: { title: titleLine }
    });
    
    if (existing) {
      console.log(`⏩ História já existe: ${titleLine}`);
      continue;
    }
    
    await prisma.story.create({
      data: {
        title: titleLine,
        tag: item.tag,
        author: item.author,
        content: content,
        excerpt: excerpt,
        coverImage: placeholders[i] || placeholders[0],
        publishDate: new Date()
      }
    });
    
    console.log(`✅ História inserida: ${titleLine}`);
  }
  
  console.log('✨ Concluído!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
