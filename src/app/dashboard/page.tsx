'use client';

import { useSession, signIn, signOut } from 'next-auth/react';

export default function Dashboard() {
  const { data, status } = useSession();

  if (status === 'loading') {
    return <p>Cargando...</p>;
  }

  if (!data || !data.user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p>Debes iniciar sesión para ver esta página</p>
        <button
          onClick={() => signIn()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Iniciar sesión
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">Bienvenido, {data.user.name}</h1>
      <p>{data.user.email}</p>
      <button
        onClick={() => signOut()}
        className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Cerrar sesión
      </button>
    </div>
  );
}