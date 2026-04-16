"use server";

import { prisma } from '@/lib/prisma';
import { sendJobAlertEmail } from '@/lib/email';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

function parseSalaryValue(value: string | null | undefined) {
    if (!value) return null;

    const normalized = value
        .replace(/\s+/g, '')
        .replace(/R\$/gi, '')
        .replace(/[^0-9.,]/g, '');

    if (!normalized) return null;

    if (normalized.includes(',') && normalized.includes('.')) {
        const lastComma = normalized.lastIndexOf(',');
        const lastDot = normalized.lastIndexOf('.');
        if (lastComma > lastDot) {
            return parseFloat(normalized.replace(/\./g, '').replace(',', '.'));
        }
        return parseFloat(normalized.replace(/,/g, ''));
    }

    const normalizedNumber = normalized.replace(/,/g, '.');
    const parsed = parseFloat(normalizedNumber);
    return Number.isNaN(parsed) ? null : parsed;
}

export async function createJob(formData: FormData) {
    const company = formData.get('company') as string;
    const role = formData.get('role') as string;
    const area = formData.get('area') as string;
    const salary = formData.get('salary') as string;
    const status = (formData.get('status') as string) || 'open';

    console.log('=== INICIANDO CRIAÇÃO DE VAGA ===');
    console.log('Dados recebidos:', { company, role, area, salary, status });

    const job = await prisma.job.create({
        data: {
            company,
            role,
            area,
            salary,
            status,
        },
    });

    console.log('✓ Vaga criada no banco:', job.id);

    const jobSalary = parseSalaryValue(salary);
    console.log('Salário parseado da vaga:', jobSalary);

    const users = await prisma.user.findMany({
        where: { area },
    });

    console.log(`Nova vaga criada em ${area} - ${company}: encontradas ${users.length} pessoas com a mesma área`);

    if (users.length > 0) {
        console.log('Usuários encontrados:', users.map(u => ({ email: u.email, area: u.area, expectation: u.salaryExpectation })));
    }

    let sentCount = 0;

    for (const user of users) {
        const expectation = parseSalaryValue(user.salaryExpectation);
        const isSalaryCompatible =
            expectation === null || jobSalary === null || jobSalary >= expectation;

        console.log(`Verificando ${user.email}: expectation=${expectation}, compatible=${isSalaryCompatible}`);

        if (isSalaryCompatible) {
            try {
                await sendJobAlertEmail(user.email, job);
                sentCount += 1;
                console.log(`✓ Email enviado para ${user.email}`);
            } catch (error) {
                console.error(`✗ Erro ao enviar para ${user.email}:`, error);
            }
        }
    }

    console.log(`Alertas enviados: ${sentCount}`);
    console.log('=== FIM DA CRIAÇÃO DE VAGA ===');
    revalidatePath('/dashboard/vagas');
    redirect('/dashboard/vagas');
}
