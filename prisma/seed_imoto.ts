import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const data = {
  "persons": [
    { "id": "P9MW-5G2", "name": "Atsushi", "gender": "M" },
    { "id": "P9MW-VJ7", "name": "Makisuke", "gender": "M", "displayName": "Makisuke Imoto" },
    { "id": "GV4C-XKX", "name": "Kura", "gender": "F", "displayName": "Kura Imoto" },
    { "id": "PZPQ-MSP", "name": "Hico", "gender": "M", "displayName": "Hico Okada" },
    { "id": "PZP3-598", "name": "Yahiti", "gender": "F", "displayName": "Yahiti Okada" },
    { "id": "P97M-PTQ", "name": "Tsunejiro", "gender": "M", "displayName": "Tsunejiro Imoto" },
    { "id": "P979-MZ2", "name": "Tomi", "gender": "F", "displayName": "Tomi Imoto" },
    { "id": "G5PP-W88", "name": "Cyro", "gender": "M", "displayName": "Cyro Imoto" },
    { "id": "G5PP-XNT", "name": "Nobuko", "gender": "F", "displayName": "Nobuko Yajima" },
    { "id": "G39N-7V5", "name": "Shiro", "gender": "M", "displayName": "Shiro Yajima" },
    { "id": "G39N-33M", "name": "Sakue", "gender": "F", "displayName": "Sakue Kawai" },
    { "id": "G39F-BCM", "name": "Seitaro", "gender": "M", "displayName": "Seitaro Kawai" },
    { "id": "GS1L-D5D", "name": "Sakae", "gender": "F", "displayName": "Sakae Kawai" },
    { "id": "GKM4-CQ1", "name": "HITARO", "gender": "M", "displayName": "HITARO YAYUMA" },
    { "id": "GKM4-2LY", "name": "MAKIE", "gender": "F", "displayName": "MAKIE JAYUMA" },
    { "id": "GKM4-699", "name": "YATO", "gender": "M", "displayName": "YATO KAWAI" },
    { "id": "GKM4-Y8X", "name": "YOJURO", "gender": "F", "displayName": "YOJURO KAWAI" },
    { "id": "G39F-Y91", "name": "Katsunosuke", "gender": "M", "displayName": "Katsunosuke Yajima" },
    { "id": "G39N-SPR", "name": "Akino", "gender": "F", "displayName": "Akino Yajima" },
    { "id": "GBPK-47D", "name": "Yoiti", "gender": "M", "displayName": "Yoiti Yazima" },
    { "id": "P3HL-F5K", "name": "Lydia de Ascenção", "gender": "F", "displayName": "Lydia de Ascenção Fonseca Yazima" },
    { "id": "G5PP-68H", "name": "Cesar", "gender": "M", "displayName": "Cesar Imoto" },
    { "id": "G5PP-VTY", "name": "Maria de Lourdes", "gender": "F", "displayName": "Maria de Lourdes Almeida Imoto" },
    { "id": "G5PG-BJW", "name": "Vitor Akio", "gender": "M", "displayName": "Vitor Akio Almeida Imoto" },
    { "id": "P9MW-9XS", "name": "Henrique Atshushi", "gender": "M" },
    { "id": "P3HL-ZR8", "name": "Marcia", "gender": "F" },
    { "id": "P9MW-RV7", "name": "Mauro", "gender": "M" },
    { "id": "P9QP-289", "name": "Keiko", "gender": "F" },
    { "id": "P3HL-XLH", "name": "Alberto", "gender": "M" },
    { "id": "P9MW-NNZ", "name": "Mitsuro", "gender": "M" },
    { "id": "P979-K6T", "name": "Toshio", "gender": "M" },
    { "id": "G6Y9-5GY", "name": "Fumiko", "gender": "F" }
  ],
  "relationships": [
    { "type": "couple", "persons": ["GBPK-47D", "P3HL-F5K"] },
    { "type": "parentChild", "parents": ["GBPK-47D", "P3HL-F5K"], "child": "G5PP-68H" },
    { "type": "couple", "persons": ["G5PP-68H", "G5PP-VTY"] },
    { "type": "parentChild", "parents": ["G5PP-68H", "G5PP-VTY"], "child": "G5PG-BJW" },
    { "type": "parentChild", "parents": ["G5PP-68H", "G5PP-VTY"], "child": "P9MW-9XS" }
  ]
};

async function main() {
  console.log("🧹 Zerando banco de dados...");
  await prisma.artifactCitation.deleteMany();
  await prisma.member.deleteMany();
  await prisma.artifact.deleteMany();
  await prisma.story.deleteMany();
  await prisma.timelineEvent.deleteMany();

  console.log("👥 Criando membros...");
  for (const p of data.persons) {
    const fullName = p.displayName || p.name;
    const nameParts = fullName.split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : "";

    await prisma.member.create({
      data: {
        id: p.id,
        firstName: firstName,
        lastName: lastName,
      }
    });
  }

  console.log("🔗 Criando relacionamentos...");
  for (const rel of data.relationships) {
    if (rel.type === 'couple') {
      const [p1, p2] = rel.persons;
      await prisma.member.update({
        where: { id: p1 },
        data: { spouseId: p2 }
      });
    } else if (rel.type === 'parentChild') {
      const { parents, child } = rel as any;
      await prisma.member.update({
        where: { id: child },
        data: { 
          parents: { 
            connect: parents.map((pid: string) => ({ id: pid })) 
          } 
        }
      });
    }
  }

  // Adicionando laços implícitos baseados no gen.md anterior (opcional mas bom p/ árvore principal)
  console.log("📌 Adicionando laços principais (Imoto/Okada)...");
  
  // Tsunejiro + Tomi -> Makisuke
  await prisma.member.update({ where: { id: "P97M-PTQ" }, data: { spouseId: "P979-MZ2" } });
  await prisma.member.update({ where: { id: "P9MW-VJ7" }, data: { parents: { connect: [{id: "P97M-PTQ"}, {id: "P979-MZ2"}] } } });
  
  // Hico + Yahiti -> Kura
  await prisma.member.update({ where: { id: "PZPQ-MSP" }, data: { spouseId: "PZP3-598" } });
  await prisma.member.update({ where: { id: "GV4C-XKX" }, data: { parents: { connect: [{id: "PZPQ-MSP"}, {id: "PZP3-598"}] } } });
  
  // Makisuke + Kura
  await prisma.member.update({ where: { id: "P9MW-VJ7" }, data: { spouseId: "GV4C-XKX" } });
  
  // Filhos de Makisuke e Kura
  const filhosMK = ["P9MW-5G2", "P979-K6T", "P9MW-NNZ", "G5PP-W88", "G39N-7V5"]; // Shiro está no JSON tb
  for (const fId of filhosMK) {
     if (data.persons.find(p => p.id === fId)) {
        await prisma.member.update({
           where: { id: fId },
           data: { parents: { connect: [{id: "P9MW-VJ7"}, {id: "GV4C-XKX"}] } }
        });
     }
  }

  console.log("✅ Importação concluída com sucesso!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
