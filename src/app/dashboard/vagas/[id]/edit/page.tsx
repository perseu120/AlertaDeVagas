import Form from '@/components/vagas/create-form';
import Breadcrumbs from '@/components/vagas/breadcrumbs';

export default async function Page(props: { params: Promise<{ id: string }> }) {
    const { id } = await props.params;

    // 🔥 Vaga mockada
    const invoice = {
        id,
        name: 'Google',
        email: 'jobs@google.com',
        amount: 'R$ 12.000',
        category: 'backend',
    };

    // 🔥 Empresas mockadas
    const customers = [
        { id: '1', name: 'Google' },
        { id: '2', name: 'Microsoft' },
        { id: '3', name: 'Amazon' },
    ];

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Vagas', href: '/dashboard/vagas' },
                    {
                        label: 'Aplicar vaga',
                        href: `/dashboard/vagas/${id}/apply`,
                        active: true,
                    },
                ]}
            />


        </main>
    );
}