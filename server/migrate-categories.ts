import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const classification = [
  {
    category: "Civis e Pessoais",
    keywords: ["Identidade", "Óbito", "Cemitério", "Vacinação", "Militar", "Panfleto", "Cyro", "Kura", "Mitsuo"]
  },
  {
    category: "Família e Relações",
    keywords: ["Carta", "Agradecimento", "Casamento", "Caderno", "Convid", "Correspondência"]
  },
  {
    category: "Patrimônio e Negócios",
    keywords: ["Terreno", "Escritura", "Cafezal", "Alqueire", "Balanço Financeiro", "Imigração", "Compra", "Venda", "Kuga"]
  },
  {
    category: "Impostos e Burocracia",
    keywords: ["Recibo", "Taxa", "Imposto", "Tributo", "Territorial", "Rodoviária"]
  }
];

async function main() {
  console.log('🔄 Iniciando migração de classificações...');
  
  const artifacts = await prisma.artifact.findMany();
  let updatedCount = 0;

  for (const art of artifacts) {
    let newCategory = "";
    const title = art.title || "";
    
    // Tenta encontrar a categoria baseada no título
    for (const group of classification) {
      if (group.keywords.some(k => title.toLowerCase().includes(k.toLowerCase()))) {
        newCategory = group.category;
        break;
      }
    }

    // Se não encontrou, mantém Família ou define como Família e Relações como padrão seguro
    if (!newCategory) {
      newCategory = "Família e Relações";
    }

    if (newCategory !== art.category) {
      await prisma.artifact.update({
        where: { id: art.id },
        data: { category: newCategory }
      });
      console.log(`✅ [${newCategory}] ${title}`);
      updatedCount++;
    }
  }

  console.log(`✨ Migração concluída! ${updatedCount} registros atualizados.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
