import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.story.create({
    data: {
      tag: 'História da Família',
      title: 'A Travessia do Santos-Maru: O Início do Legado no Brasil',
      excerpt: 'A jornada transoceânica que trouxe os primeiros Imoto, Kawai e Yajima para as terras paulistas na década de 20.',
      content: `A história da nossa família no Brasil começa com o balanço das ondas do Oceano Pacífico e o som das máquinas do navio **Santos-Maru**. 

Em duas viagens distintas, em 1927 e 1929, nossos antepassados deixaram o Japão em busca de novas oportunidades nas fazendas de café de São Paulo.

### A Primeira Onda (1927)
No dia 29 de novembro de 1926, **Makisuke Imoto** e sua esposa **Kura** embarcaram no Santos-Maru com seus filhos **Atsushi, Toshio, Mitsuro e Shiro**. Vindos da província de **Yamaguchi**, a travessia durou quase dois meses, chegando ao Porto de Santos em **16 de janeiro de 1927**. O destino da família foi a Fazenda Lageado, na região de Conquista.

### O Reencontro em Nagano (1929)
Dois anos depois, em **26 de junho de 1929**, uma nova leva de familiares e aliados chegou ao Brasil. Desta vez, vindo da província de **Nagano**, o navio trouxe as famílias **Yajima** (liderada por Shiro e Sakue) e **Kawai** (Seitaro e Sakae). Entre as crianças estava a pequena **Tsuta**, que mais tarde uniria estas linhagens ao se casar na nova terra. Eles seguiram para a Estação Penna, integrando-se ao esforço de colonização que moldaria as gerações futuras.

Estas certidões de desembarque não são apenas papéis; são as sementes de tudo o que somos hoje.`,
      author: 'Arquivo Imoto',
      coverImage: '/public/uploads/registro_imoto_1927.png',
      publishDate: new Date()
    }
  });

  console.log('Story created!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
