import Form from '@/components/vagas/create-form';
import Breadcrumbs from '@/components/vagas/breadcrumbs';
import { createJob } from '@/lib/actions';

export default async function Page() {

    // 🔥 Empresas mockadas
    const customers = [
        { id: '1', name: 'BackEnd' },
        { id: '2', name: 'FrontEnd' },
        { id: '3', name: 'Scrum' },
    ];

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Vagas', href: '/dashboard/vagas' },
                    {
                        label: 'Criar Vaga',
                        href: '/dashboard/vagas/create',
                        active: true,
                    },
                ]}
            />
            <Form customers={customers} action={createJob} />
        </main>
    );
}