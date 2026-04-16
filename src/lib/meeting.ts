import { prisma } from "./prisma";

// buscar todos os encontros
export async function getMeetings() {
    
  const meetings = await prisma.encontros.findMany();

  return meetings;
}