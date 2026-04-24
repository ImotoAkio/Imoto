import { PrismaClient } from '@prisma/client';
// No need for node-fetch in Node 24+

const prisma = new PrismaClient();
const GOOGLE_SHEET_ID = '18bl6QaVDHRrtjtI8mWVP2PI4oOOU7Qj9TO2jyqOUl1M';

const timelineEvents = [
  {
    year: 1885,
    title: 'Raízes em Yamaguchi',
    description: 'Nascimento de Haruo Imoto na província de Yamaguchi, Japão. Uma linhagem de agricultores e artesãos que moldaram o caráter da família.',
    iconName: 'Building2',
    location: 'Yamaguchi, Japão',
  },
  {
    year: 1908,
    title: 'A Grande Jornada',
    description: 'Partida rumo ao Brasil no navio Kasato Maru. Uma travessia de 52 dias que cruzou oceanos para encontrar um novo lar.',
    iconName: 'Ship',
    location: 'Porto de Santos, SP',
  },
  {
    year: 1924,
    title: 'Expansão em Mogi',
    description: 'Estabelecimento das primeiras lavouras próprias em Mogi das Cruzes. A transição definitiva do trabalho colono para a propriedade.',
    iconName: 'MapPin',
    location: 'Mogi das Cruzes, SP',
  },
  {
    year: 1952,
    title: 'A Nova Geração',
    description: 'A primeira graduação universitária da linhagem brasileira. Haruo Imoto inicia sua jornada na Engenharia Agrônoma.',
    iconName: 'GraduationCap',
    location: 'São Paulo, SP',
  },
  {
    year: 1988,
    title: 'Memorial do Centenário',
    description: 'Participação ativa nas celebrações dos 80 anos da imigração, reafirmando o compromisso com a preservação da memória.',
    iconName: 'Anchor',
    location: 'Associação Imoto',
  },
];

async function fetchGoogleSheet(sheetId: string) {
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;
  console.log(`🔗 Buscando dados da planilha: ${url}`);
  
  const response = await fetch(url);
  if (!response.ok) throw new Error('Falha ao buscar dados da planilha');
  
  const csvContent = await response.text();
  const rows = csvContent.split('\n').filter(row => row.trim() !== '');
  
  if (rows.length < 2) return [];

  const headers = rows[0].split(',').map(h => h.trim().replace(/"/g, ''));
  
  return rows.slice(1).map(row => {
    const values: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < row.length; i++) {
      const char = row[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());

    const obj: any = {};
    headers.forEach((header, index) => {
      obj[header] = values[index]?.replace(/^"|"$/g, '') || '';
    });
    return obj;
  });
}

async function main() {
  console.log('🚀 Iniciando migração para SQLite...');

  try {
    // 1. Limpar dados existentes (opcional, mas bom p/ evitar duplicatas na migração)
    console.log('🧹 Limpando tabelas de artefatos e eventos...');
    await prisma.artifactCitation.deleteMany();
    await prisma.artifact.deleteMany();
    await prisma.timelineEvent.deleteMany();

    // 2. Migrar Artefatos (Galeria)
    console.log('📸 Migrando dados da Galeria...');
    const sheetData = await fetchGoogleSheet(GOOGLE_SHEET_ID);
    
    const artifactsToCreate = sheetData.map((row: any) => {
      const keys = Object.keys(row);
      const getVal = (name: string, idx: number) => row[name] || row[keys[idx]] || '';
      
      const driveId = getVal('ID_Drive', 5);
      const type = getVal('Tipo', 1).toLowerCase() === 'documento' ? 'DOCUMENT' : 'PHOTO';
      
      return {
        type: type,
        title: getVal('Titulo', 2) || 'Sem Título',
        location: getVal('Local', 3) || 'Desconhecido',
        year: getVal('Ano', 4) || 'S/D',
        mediaUrl: driveId ? `https://lh3.googleusercontent.com/d/${driveId}` : '',
        category: getVal('Categoria', 6) || 'Família',
        contextDescription: getVal('Contexto', 7) || 'Registros da família Imoto.'
      };
    });

    let count = 0;
    for (const art of artifactsToCreate) {
      await prisma.artifact.create({ data: art });
      count++;
      if (count % 50 === 0) console.log(`  Processed ${count}/${artifactsToCreate.length} artifacts...`);
    }
    console.log(`✅ ${artifactsToCreate.length} artefatos migrados.`);

    // 3. Migrar Linha do Tempo
    console.log('⏳ Migrando dados da Linha do Tempo...');
    for (const event of timelineEvents) {
      await prisma.timelineEvent.create({
        data: event
      });
    }
    console.log(`✅ ${timelineEvents.length} eventos de linha do tempo migrados.`);

    console.log('🎉 Migração concluída com sucesso!');
  } catch (error) {
    console.error('❌ Erro durante a migração:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
