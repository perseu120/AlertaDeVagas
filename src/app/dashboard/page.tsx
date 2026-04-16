import { Suspense } from 'react';
import ApplicationsTable from './_components/aplication-table';

export default async function Page() {
  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Minhas Candidaturas
          </h1>
          <p className="text-sm text-gray-500">
            Acompanhe o andamento das vagas que você aplicou
          </p>
        </div>
      </div>

      <Suspense>
        <ApplicationsTable />
      </Suspense>
    </div>
  );
}