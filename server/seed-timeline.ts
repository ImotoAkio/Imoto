import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const events = [
  {
    year: 1909,
    title: "Requerimento Militar de Makisuke Imoto em Tóquio",
    location: "Tóquio e Vila de Kuga, Japão",
    description: "Documento no qual o jovem Makisuke solicita permissão para participar de uma inspeção militar obrigatória no bairro de Kanda, em Tóquio, onde residia temporariamente.",
    iconName: "Building2"
  },
  {
    year: 1917,
    title: "Certificado da 2ª Dose de Vacinação (Era Taisho)",
    location: "Vila de Kuga, Província de Yamaguchi, Japão",
    description: "Comprovante médico indicando que o jovem Fukuo Miyauchi tomou a segunda dose da vacina contra a varíola.",
    iconName: "MapPin"
  },
  {
    year: 1918,
    title: "Contrato de Direito de Superfície (Chijōken)",
    location: "Vila de Kuga, Japão",
    description: "Contrato formal com a assembleia da vila concedendo a Makisuke Imoto o uso de terras públicas de montanha e floresta por cinquenta anos para extração de bambus e madeiras.",
    iconName: "Building2"
  },
  {
    year: 1918,
    title: "Compra de Terreno em Kuga",
    location: "Vila de Kuga, Japão",
    description: "Registro civil de compra de terras no qual Makisuke adquire propriedades agrícolas em lotes menores, como um campo de arroz inundado e outro seco, pagando 100 Ienes.",
    iconName: "Building2"
  },
  {
    year: 1922,
    title: "Venda de Terreno em Kuga por Nisaburo Suekawa",
    location: "Vila de Kuga, Japão",
    description: "Documento atestando uma transação de compra ou venda de lotes agrícolas de Nisaburo Suekawa na vila.",
    iconName: "Building2"
  },
  {
    year: 1922,
    title: "Vacinação contra Varíola de Mitsuo Imoto",
    location: "Vila de Kuga, Japão",
    description: "Papel vermelho emitido pelo prefeito que servia como comprovante compulsório de imunização infantil para o bebê Mitsuo Imoto.",
    iconName: "MapPin"
  },
  {
    year: 1925,
    title: "Termo de Acordo Manuscrito com Hanko",
    location: "Japão",
    description: "Documento contendo os termos de um acordo formalizado de maneira manuscrita e autenticado com o tradicional carimbo avermelhado.",
    iconName: "Building2"
  },
  {
    year: 1926,
    title: "Carta de Agradecimento da Escola de Kuga",
    location: "Kuga, Japão",
    description: "Uma carta oficial da instituição escolar prestando agradecimentos pela provável contribuição social de Makisuke Imoto na sua província.",
    iconName: "GraduationCap"
  },
  {
    year: 1929,
    title: "Convite de Casamento Apadrinhado",
    location: "Indefinido (Linguagem Japonesa)",
    description: "Convite formal tradicional no qual Makisuke aparece figurando papel de prestígio ou apoio no enlace matrimonial.",
    iconName: "Clock"
  },
  {
    year: 1930,
    title: "Escritura de Compra na Fazenda Alliança",
    location: "Cartório em Lins, São Paulo, Brasil",
    description: "Marco da ascensão econômica brasileira com o registro de compra de doze alqueires possuindo uma casa e cinco mil cafeeiros produtivos.",
    iconName: "Building2"
  },
  {
    year: 1936,
    title: "Escritura de Compra de Cafezal",
    location: "Lins, São Paulo, Brasil",
    description: "A ampliação das terras da família com a adição de outros dez alqueires vizinhos que já contavam com expressivos dez mil pés de café.",
    iconName: "Building2"
  },
  {
    year: 1937,
    title: "Impostos Diversos da Prefeitura de Getulina",
    location: "Getulina, São Paulo, Brasil",
    description: "Recibo comprovando o pagamento perante a tesouraria municipal do imposto cedular sobre rendimentos da propriedade rural.",
    iconName: "MapPin"
  },
  {
    year: 1940,
    title: "Taxa Rodoviária do Bairro Alliança",
    location: "Getulina, São Paulo, Brasil",
    description: "Pagamento municipal à prefeitura a fim de garantir as vias de transporte necessárias para escoamento das safras de café.",
    iconName: "MapPin"
  },
  {
    year: 1941,
    title: "Imposto Territorial Rural de São Paulo",
    location: "Getulina, São Paulo, Brasil",
    description: "Documentos provando que as secretarias estaduais mantinham e taxavam de maneira independente o lote original de doze alqueires e a segunda compra de dez alqueires da família.",
    iconName: "MapPin"
  },
  {
    year: 1942,
    title: "Taxas Rodoviárias (Getulina)",
    location: "Getulina, São Paulo, Brasil",
    description: "Papéis duplos de pagamento pela conservação contínua das estradas de rodagem do interior, processados no começo de 1942.",
    iconName: "MapPin"
  },
  {
    year: 1942,
    title: "Óbito de Kura Imoto e Memorial",
    location: "Getulina, São Paulo, Brasil",
    description: "Registros contendo o fatídico anúncio de que Kura Imoto morreu devido a hemorragia cerebral, além das guias de investimento em sepultura perpétua.",
    iconName: "Clock"
  },
  {
    year: 1943,
    title: "Balanço Financeiro da Produção de Café",
    location: "Getulina e Lins, São Paulo, Brasil",
    description: "Caderno rústico que mapeava a riqueza advinda das vendas do café e despesas como casamentos e trágicos inventários.",
    iconName: "Building2"
  },
  {
    year: 1948,
    title: "Cartas do Pós-Guerra",
    location: "Enviadas do Japão para o Brasil",
    description: "Manuscritos relatando os momentos mais tenebrosos no lado japonês, englobando a hiperinflação e ausência de bens básicos.",
    iconName: "Clock"
  },
  {
    year: 1952,
    title: "Casamento de Cyro Imoto e Nobuko",
    location: "Lins, São Paulo, Brasil",
    description: "O anúncio matrimonial festivo oficializando a união de Cyro Imoto e Nobuko na Igreja de Lins.",
    iconName: "Clock"
  },
  {
    year: 1959,
    title: "Cédula de Identidade de Cyro Imoto",
    location: "Estado de São Paulo, Brasil",
    description: "O registro e as digitais do cidadão brasileiro Cyro Imoto, comprovando sua naturalidade em Minas Gerais.",
    iconName: "MapPin"
  },
  {
    year: 1960,
    title: "Panfleto Político ao IBC",
    location: "Getulina e Lins, São Paulo, Brasil",
    description: "Propaganda enaltecendo a liderança do vereador Cyro Imoto, lançando candidatura a delegado no Instituto Brasileiro do Café.",
    iconName: "Building2"
  }
];

async function main() {
  console.log('⏳ Limpando linha do tempo antiga...');
  await prisma.timelineEvent.deleteMany({});
  
  console.log('🚀 Semeando 21 novos marcos históricos...');
  for (const event of events) {
    await prisma.timelineEvent.create({ data: event });
  }
  
  console.log('✅ Linha do tempo atualizada com sucesso!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
