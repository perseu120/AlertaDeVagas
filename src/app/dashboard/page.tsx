import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { ButtonSignOut } from "./_components/button-signout";
import { redirect } from 'next/navigation';
import CardWrapper, { Card } from '@/components/dashboard/card';

import LatestInvoices from '@/components/dashboard/latest-simulation';


export default async function Dashboard() {

  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    redirect("/")
  }

  return (
    <div className="container mx-auto min-h-screen flex items-center justify-center flex-col">
      <h1 className={` mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      <h3>Usuario logado: {session.user.name}</h3>
      <h3 className='mb-4'>Email: {session.user.email}</h3>
      <h3 className='mb-4'>Id user: {session.user.id}</h3>


      <ButtonSignOut />
    </div>
  );
}