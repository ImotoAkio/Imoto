import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 1. Timeline Events
  const event1927 = await prisma.timelineEvent.create({
    data: {
      year: 1927,
      title: 'Chegada da Família Imoto ao Brasil',
      description: 'A família Imoto, liderada por Makisuke e Kura, desembarca no Porto de Santos em 16 de janeiro de 1927 a bordo do navio Santos-Maru, vindo da província de Yamaguchi. O destino inicial foi a Fazenda Lageado, estação Conquista, em São Paulo.',
      iconName: 'Ship',
      location: 'Porto de Santos, SP'
    }
  });

  const event1929 = await prisma.timelineEvent.create({
    data: {
      year: 1929,
      title: 'Chegada das Famílias Yajima e Kawai',
      description: 'Em 26 de junho de 1929, as famílias Yajima e Kawai desembarcam em Santos no navio Santos-Maru. Vindos da província de Nagano, seguiram para a estação Penna, em São Paulo.',
      iconName: 'Ship',
      location: 'Porto de Santos, SP'
    }
  });

  // 2. Members (Create missing ones)
  const shiroImoto = await prisma.member.create({
    data: {
      firstName: 'Shiro',
      lastName: 'Imoto',
      generation: 'Issei',
      isDeceased: true
    }
  });

  const kiyotakeKawai = await prisma.member.create({
    data: {
      firstName: 'Kiyotake',
      lastName: 'Kawai',
      generation: 'Issei',
      isDeceased: true
    }
  });

  // 3. Artifacts (Documents)
  // We'll use the provided info as originalText
  
  const artifact1927 = await prisma.artifact.create({
    data: {
      type: 'DOCUMENT',
      title: 'Registro de Imigração - Navio Santos-Maru (1927)',
      year: '1927',
      category: 'Imigração',
      location: 'Arquivo Museu da Imigração',
      mediaUrl: '/public/uploads/registro_imoto_1927.png', // Placeholder for the screenshot
      contextDescription: 'Registro oficial de desembarque da família Imoto no Brasil. Mostra a composição familiar vinda de Yamaguchi.',
      originalText: 'Navio: SANTOS-MARU | Destino: São Paulo | Partida: 11/29/1926 | Chegada: 1/16/1927 | Província: YAMAGUCHI | Fazenda: Lageado | Estação: Conquista',
      citations: {
        create: [
          { memberId: 'P9MW-VJ7' }, // Makisuke
          { memberId: 'GV4C-XKX' }, // Kura
          { memberId: 'P9MW-5G2' }, // Atsushi
          { memberId: 'P979-K6T' }, // Toshio
          { memberId: 'P9MW-NNZ' }, // Mitsuro
          { memberId: shiroImoto.id }
        ]
      }
    }
  });

  const artifact1929 = await prisma.artifact.create({
    data: {
      type: 'DOCUMENT',
      title: 'Registro de Imigração - Navio Santos-Maru (1929)',
      year: '1929',
      category: 'Imigração',
      location: 'Arquivo Museu da Imigração',
      mediaUrl: '/public/uploads/registro_kawai_1929.png', // Placeholder for the screenshot
      contextDescription: 'Registro oficial de desembarque das famílias Yajima e Kawai. Confirma a origem em Nagano e o destino na Estação Penna.',
      originalText: 'Navio: SANTOS-MARU | Destino: São Paulo | Partida: 5/11/1929 | Chegada: 6/26/1929 | Província: NAGANO | Estação: Penna',
      citations: {
        create: [
          { memberId: 'G39N-7V5' }, // Shiro Yajima
          { memberId: 'G39N-33M' }, // Sakue
          { memberId: 'G39F-BCM' }, // Seitaro
          { memberId: 'GS1L-D5D' }, // Sakae
          { memberId: kiyotakeKawai.id },
          { memberId: '4c033725-9e74-45d5-b650-8f822f2c2c66' } // Tsuta
        ]
      }
    }
  });

  console.log('Indexing complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
