'use client'

import Link from 'next/link';
import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';

import { Button } from './button';

type CustomerField = {
  id: string;
  name: string;
};

export default function Form({ customers }: { customers: CustomerField[] }) {

  function handleSubmit(formData: FormData) {
    const data = {
      empresa: formData.get('customerId'),
      salario: formData.get('amount'),
      status: formData.get('status'),
    };

    console.log('🔥 Nova vaga criada:', data);
    alert('Vaga criada (mock)');
  }

  return (
    <form action={handleSubmit}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">


        <div className="mb-4">

          <label htmlFor="customer" className="mb-2 block text-sm font-medium">
            Escolha a área
          </label>

          <div className="relative">
            <select
              id="customer"
              name="customerId"
              className="peer block w-full rounded-md border py-2 pl-10 text-sm"
              defaultValue=""
            >
              <option value="" disabled>
                Área
              </option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>
            <UserCircleIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          </div>
        </div>


        <div className="mb-4">
          <label htmlFor="amount" className="mb-2 block text-sm font-medium">
            Salário
          </label>
          <div className="relative">
            <input
              id="amount"
              name="amount"
              type="number"
              placeholder="Ex: 5000"
              className="w-full rounded-md border py-2 pl-10 text-sm"
              required
            />
            <CurrencyDollarIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          </div>
        </div>


        <fieldset>
          <legend className="mb-2 text-sm font-medium">
            Status da vaga
          </legend>

          <div className="flex gap-4">


            <label className="flex items-center gap-2">
              <input type="radio" name="status" value="open" />
              <span className="flex items-center gap-1 text-sm">
                Aberta <CheckIcon className="h-4 w-4" />
              </span>
            </label>


            <label className="flex items-center gap-2">
              <input type="radio" name="status" value="urgent" />
              <span className="flex items-center gap-1 text-sm">
                Urgente <ClockIcon className="h-4 w-4" />
              </span>
            </label>


            <label className="flex items-center gap-2">
              <input type="radio" name="status" value="closed" />
              <span className="text-sm">
                Fechada
              </span>
            </label>

          </div>
        </fieldset>
      </div>


      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/vagas"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm"
        >
          Cancelar
        </Link>
        <Button type="submit">Criar Vaga</Button>
      </div>
    </form>
  );
}