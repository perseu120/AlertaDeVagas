import Image from 'next/image';
import { UpdateInvoice } from './buttons';
import InvoiceStatus from './status';
import { prisma } from '@/lib/prisma';

export default async function InvoicesTable({
    query,
    currentPage,
}: {
    query: string;
    currentPage: number;
}) {

    const jobs = await prisma.job.findMany({
        where: {
            OR: [
                { company: { contains: query, mode: 'insensitive' } },
                { role: { contains: query, mode: 'insensitive' } },
                { area: { contains: query, mode: 'insensitive' } },
            ],
        },
        orderBy: { date: 'desc' },
    });

    const invoices = jobs.map(job => ({
        id: job.id,
        name: job.company,
        role: job.role,
        area: job.area,
        amount: job.salary,
        date: job.date.toLocaleDateString('pt-BR'),
        status: job.status,
        image_url: `/companies/${job.company.toLowerCase()}.png`, // Assumindo imagens por empresa
    }));

    return (
        <div className="mt-6 flow-root">
            <div className="inline-block min-w-full align-middle">
                <div className="rounded-xl bg-gray-50 p-3 md:pt-0">

                    {/* 📱 Mobile */}
                    <div className="md:hidden">
                        {invoices?.map((invoice) => (
                            <div
                                key={invoice.id}
                                className="mb-3 w-full rounded-xl bg-white p-4 shadow-sm border"
                            >
                                <div className="flex items-center justify-between border-b pb-3">
                                    <div className="flex items-center gap-3">
                                        <Image
                                            src={invoice.image_url}
                                            className="rounded-full"
                                            width={32}
                                            height={32}
                                            alt={`${invoice.name} logo`}
                                        />
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {invoice.name}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {invoice.role}
                                            </p>
                                        </div>
                                    </div>
                                    <InvoiceStatus status={invoice.status} />
                                </div>

                                <div className="flex items-center justify-between pt-3">
                                    <div>
                                        <p className="text-lg font-semibold text-gray-900">
                                            {invoice.amount}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {invoice.area} • {invoice.date}
                                        </p>
                                    </div>

                                    <UpdateInvoice id={invoice.id} />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* 💻 Desktop */}
                    <table className="hidden min-w-full text-gray-900 md:table">
                        <thead className="text-left text-sm text-gray-500">
                            <tr>
                                <th className="px-4 py-4 sm:pl-6">Empresa</th>
                                <th className="px-3 py-4">Cargo</th>
                                <th className="px-3 py-4">Área</th>
                                <th className="px-3 py-4">Salário</th>
                                <th className="px-3 py-4">Publicado</th>
                                <th className="px-3 py-4">Status</th>
                                <th className="py-3 pl-6 pr-3"></th>
                            </tr>
                        </thead>

                        <tbody className="bg-white rounded-lg">
                            {invoices?.map((invoice) => (
                                <tr
                                    key={invoice.id}
                                    className="border-b text-sm hover:bg-gray-50 transition"
                                >
                                    {/* Empresa */}
                                    <td className="py-3 pl-6 pr-3">
                                        <div className="flex items-center gap-3">

                                            <span className="font-medium">
                                                {invoice.name}
                                            </span>
                                        </div>
                                    </td>

                                    {/* Cargo */}
                                    <td className="px-3 py-3">
                                        {invoice.role}
                                    </td>

                                    {/* Área */}
                                    <td className="px-3 py-3">
                                        <span className="bg-gray-100 px-2 py-1 rounded-md text-xs">
                                            {invoice.area}
                                        </span>
                                    </td>

                                    {/* Salário */}
                                    <td className="px-3 py-3 font-medium">
                                        {invoice.amount}
                                    </td>

                                    {/* Data */}
                                    <td className="px-3 py-3 text-gray-500">
                                        {invoice.date}
                                    </td>

                                    {/* Status */}
                                    <td className="px-3 py-3">
                                        <InvoiceStatus status={invoice.status} />
                                    </td>

                                    {/* Ação */}
                                    <td className="py-3 pl-6 pr-3 text-right">
                                        <UpdateInvoice id={invoice.id} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                </div>
            </div>
        </div>
    );
}