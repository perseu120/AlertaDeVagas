const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");
const { PrismaClient } = require("../src/generated/prisma/client");

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL não está definida.");
}

const adapter = new PrismaPg(new Pool({ connectionString }));
const prisma = new PrismaClient({ adapter });

async function main() {
  const now = new Date();

  await prisma.inscricoes.deleteMany();
  await prisma.mentorados.deleteMany();
  await prisma.encontros.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.verification.deleteMany();
  await prisma.user.deleteMany();

  await prisma.user.create({
    data: {
      id: "user_admin_seed",
      name: "Admin",
      email: "admin@alertadevagas.com",
      emailVerified: true,
      createdAt: now,
      updatedAt: now,
    },
  });

  await prisma.encontros.createMany({
    data: [
      { nome: "Mentoria Backend", data: new Date("2026-04-20T19:00:00Z"), vagas_max: 30 },
      { nome: "Mentoria Frontend", data: new Date("2026-04-25T19:00:00Z"), vagas_max: 25 },
    ],
  });

  await prisma.mentorados.createMany({
    data: [
      { nome: "Ana Silva", email: "ana.silva@email.com" },
      { nome: "Bruno Costa", email: "bruno.costa@email.com" },
      { nome: "Carla Souza", email: "carla.souza@email.com" },
    ],
  });

  const encontros = await prisma.encontros.findMany({ orderBy: { id: "asc" } });
  const mentorados = await prisma.mentorados.findMany({ orderBy: { id: "asc" } });

  if (encontros.length >= 2 && mentorados.length >= 3) {
    await prisma.inscricoes.createMany({
      data: [
        { encontro_id: encontros[0].id, mentorado_id: mentorados[0].id },
        { encontro_id: encontros[0].id, mentorado_id: mentorados[1].id },
        { encontro_id: encontros[1].id, mentorado_id: mentorados[2].id },
      ],
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("Erro ao executar seed:", error);
    await prisma.$disconnect();
    process.exit(1);
  });