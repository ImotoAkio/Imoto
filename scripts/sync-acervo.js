import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ACERVO_PATH = path.join(__dirname, '../public/acervo');
const DATA_OUTPUT = path.join(__dirname, '../src/data/gallery-data.json');

// Helper to ensure directory exists
const ensureDirectoryExistence = (filePath) => {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) return true;
  fs.mkdirSync(dirname, { recursive: true });
};

const main = () => {
  console.log('🚀 Iniciando sincronização do acervo digital...');

  if (!fs.existsSync(ACERVO_PATH)) {
    console.log('📂 Criando diretório public/acervo...');
    fs.mkdirSync(ACERVO_PATH, { recursive: true });
  }

  const files = fs.readdirSync(ACERVO_PATH).filter(f => 
    ['.jpg', '.jpeg', '.png', '.webp', '.pdf'].includes(path.extname(f).toLowerCase())
  );

  const items = files.map((file, index) => {
    const ext = path.extname(file).toLowerCase();
    const basename = path.basename(file, ext);
    
    // Pattern: YEAR_LOCATION_TITLE.ext (e.g., 1955_São-Paulo_Festa-Família.jpg)
    const parts = basename.split('_');
    
    let year = 'S/D';
    let location = 'Localização Desconhecida';
    let title = basename.replace(/-/g, ' ');

    if (parts.length >= 3) {
      year = parts[0];
      location = parts[1].replace(/-/g, ' ');
      title = parts.slice(2).join(' ').replace(/-/g, ' ');
    } else if (parts.length === 2) {
      year = parts[0];
      title = parts[1].replace(/-/g, ' ');
    }

    const type = ext === '.pdf' ? 'doc' : 'photo';
    
    // Category mapping based on year
    let category = 'Família';
    const yearInt = parseInt(year);
    if (!isNaN(yearInt)) {
      if (yearInt < 1930) category = 'Década de 20';
      else if (yearInt < 1960) category = 'Década de 50';
    }
    if (type === 'doc') category = 'Documentos';

    return {
      id: index + 1,
      type,
      title,
      meta: `${location}, ${year}`,
      image: `/acervo/${file}`,
      category,
      span: index % 5 === 0 ? 'md:col-span-2 md:row-span-2' : 'md:col-span-1 md:row-span-1'
    };
  });

  ensureDirectoryExistence(DATA_OUTPUT);
  fs.writeFileSync(DATA_OUTPUT, JSON.stringify(items, null, 2));

  console.log(`✅ Sincronização concluída! ${items.length} itens processados.`);
  console.log(`📂 Dados salvos em: ${DATA_OUTPUT}`);
};

main();
