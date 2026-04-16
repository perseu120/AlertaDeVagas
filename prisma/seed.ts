import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function main() {
    // Criar usuários de exemplo
    const user1 = await prisma.user.upsert({
        where: { email: 'user1@example.com' },
        update: {},
        create: {
            id: 'user1',
            name: 'João Silva',
            email: 'user1@example.com',
            emailVerified: true,
            area: 'backend',
            salaryExpectation: '10000',
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    });

    const user2 = await prisma.user.upsert({
        where: { email: 'user2@example.com' },
        update: {},
        create: {
            id: 'user2',
            name: 'Maria Santos',
            email: 'user2@example.com',
            emailVerified: true,
            area: 'frontend',
            salaryExpectation: '9000',
            company: 'Google',
            role: 'Backend Developer',
            area: 'backend',
            salary: 'R$ 12.000',
            status: 'open',
        },
            {
            company: 'Microsoft',
            role: 'Frontend Developer',
            area: 'frontend',
            salary: 'R$ 10.000',
            status: 'paused',
        },
        {
            company: 'Amazon',
            role: 'DevOps Engineer',
            area: 'devops',
            salary: 'R$ 9.000',
            status: 'filled',
        },
        ],
});

console.log('Seed completed');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });