import Image from 'next/image';
import ApplicationStatus from './status';

export default function ApplicationsTable() {
    // 🔥 Agora são candidaturas do usuário (não vagas abertas)
    const applications = [
        {
            id: '1',
            company: 'Google',
            role: 'Backend Developer',
            stage: 'Entrevista Técnica',
            date: '10/04/2026',
            status: 'interview',
            image_url: '/companies/google.png',
        },
        {
            id: '2',
            company: 'Microsoft',
            role: 'Frontend Developer',
            stage: 'Triagem de RH',
            date: '12/04/2026',
            status: 'screening',
            image_url: '/companies/microsoft.png',
        },
        {
            id: '3',
            company: 'Amazon',
            role: 'DevOps Engineer',
            stage: 'Processo finalizado',
            date: '08/04/2026',
            status: 'rejected',
            image_url: '/companies/amazon.png',
        },
    ];

    return (
        <div className="rounded-xl bg-gray-50 p-3">
            {/* Mobile */}
            <div className="md:hidden">
                {applications.map((app) => (
                    <div
                        key={app.id}
                        className="mb-3 rounded-xl bg-white p-4 shadow-sm border"
                    >
                        <div className="flex justify-between items-center border-b pb-3">
                            <div className="flex items-center gap-3">
                                <Image
                                    src={app.image_url}
                                    width={32}
                                    height={32}
                                    alt={app.company}
                                    className="rounded-full"
                                />
                                <div>
                                    <p className="font-medium">{app.company}</p>
                                    <p className="text-sm text-gray-500">
                                        {app.role}
                                    </p>
                                </div>
                            </div>

                            <ApplicationStatus status={app.status} />
                        </div>

                        <div className="pt-3">
                            <p className="text-sm text-gray-600">
                                {app.stage}
                            </p>
                            <p className="text-xs text-gray-400">
                                {app.date}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Desktop */}
            <table className="hidden md:table w-full text-sm text-gray-900">
                <thead className="text-gray-500 text-left">
                    <tr>
                        <th className="px-4 py-3">Empresa</th>
                        <th className="px-3 py-3">Cargo</th>
                        <th className="px-3 py-3">Etapa</th>
                        <th className="px-3 py-3">Data</th>
                        <th className="px-3 py-3">Status</th>
                    </tr>
                </thead>

                <tbody className="bg-white">
                    {applications.map((app) => (
                        <tr key={app.id} className="border-b hover:bg-gray-50">
                            <td className="px-4 py-3 flex items-center gap-3">

                                {app.company}
                            </td>

                            <td className="px-3 py-3">{app.role}</td>

                            <td className="px-3 py-3 text-gray-600">
                                {app.stage}
                            </td>

                            <td className="px-3 py-3 text-gray-500">
                                {app.date}
                            </td>

                            <td className="px-3 py-3">
                                <ApplicationStatus status={app.status} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}