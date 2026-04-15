import Image from 'next/image';
import { UpdateInvoice } from './buttons';
import InvoiceStatus from './status';

export default async function InvoicesTable({
    query,
    currentPage,
}: {
    query: string;
    currentPage: number;
}) {

    // 🔥 Dados mockados de vagas (já formatados)
    const invoices = [
        {
            id: '1',
            name: 'Google',
            email: 'jobs@google.com',
            amount: 'R$ 12.000',
            date: '10/04/2026',
            status: 'paid',
            image_url: '/companies/google.png',
        },
        {
            id: '2',
            name: 'Microsoft',
            email: 'careers@microsoft.com',
            amount: 'R$ 10.000',
            date: '12/04/2026',
            status: 'pending',
            image_url: '/companies/microsoft.png',
        },
        {
            id: '3',
            name: 'Amazon',
            email: 'jobs@amazon.com',
            amount: 'R$ 9.000',
            date: '08/04/2026',
            status: 'overdue',
            image_url: '/companies/amazon.png',
        },
    ];

    return (
        <div className="mt-6 flow-root">
            <div className="inline-block min-w-full align-middle">
                <div className="rounded-lg bg-gray-50 p-2 md:pt-0">

                    {/* 📱 Mobile */}
                    <div className="md:hidden">
                        {invoices?.map((invoice) => (
                            <div
                                key={invoice.id}
                                className="mb-2 w-full rounded-md bg-white p-4"
                            >
                                <div className="flex items-center justify-between border-b pb-4">
                                    <div>
                                        <div className="mb-2 flex items-center">
                                            <Image
                                                src={invoice.image_url}
                                                className="mr-2 rounded-full"
                                                width={28}
                                                height={28}
                                                alt={`${invoice.name} logo`}
                                            />
                                            <p>{invoice.name}</p>
                                        </div>
                                        <p className="text-sm text-gray-500">{invoice.email}</p>
                                    </div>
                                    <InvoiceStatus status={invoice.status} />
                                </div>
                                <div className="flex w-full items-center justify-between pt-4">
                                    <div>
                                        <p className="text-xl font-medium">
                                            {invoice.amount}
                                        </p>
                                        <p>{invoice.date}</p>
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <UpdateInvoice id={invoice.id} />

                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* 💻 Desktop */}
                    <table className="hidden min-w-full text-gray-900 md:table">
                        <thead className="rounded-lg text-left text-sm font-normal">
                            <tr>
                                <th className="px-4 py-5 sm:pl-6">Empresa</th>
                                <th className="px-3 py-5">Salário</th>
                                <th className="px-3 py-5">Publicado</th>
                                <th className="px-3 py-5">Status</th>
                                <th className="relative py-3 pl-6 pr-3">
                                    <span className="sr-only">Ações</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {invoices?.map((invoice) => (
                                <tr
                                    key={invoice.id}
                                    className="w-full border-b py-3 text-sm"
                                >

                                    <td className="px-3 py-3">
                                        {invoice.email}
                                    </td>
                                    <td className="px-3 py-3">
                                        {invoice.amount}
                                    </td>
                                    <td className="px-3 py-3">
                                        {invoice.date}
                                    </td>
                                    <td className="px-3 py-3">
                                        <InvoiceStatus status={invoice.status} />
                                    </td>
                                    <td className="py-3 pl-6 pr-3">
                                        <div className="flex justify-end gap-3">
                                            <UpdateInvoice id={invoice.id} />

                                        </div>
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