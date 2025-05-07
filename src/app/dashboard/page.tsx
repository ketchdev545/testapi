'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [user, setUser] = useState<{ email: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    // Décoder ou récupérer l'utilisateur à partir du token si besoin
    const payload = JSON.parse(atob(token.split('.')[1]));
    setUser({ email: payload.email });
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/auth/login');
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-6 text-lg font-bold border-b">Dashboard</div>
        <nav className="p-6 space-y-4 text-sm">
          <a href="#" className="block text-gray-700 hover:text-blue-500">Accueil</a>
          <a href="#" className="block text-gray-700 hover:text-blue-500">Employés</a>
          <a href="#" className="block text-gray-700 hover:text-blue-500">Statistiques</a>
          <button onClick={handleLogout} className="mt-4 text-red-600 hover:underline">Se déconnecter</button>
        </nav>
      </aside>

      {/* Contenu principal */}
      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Bienvenue sur votre tableau de bord</h1>
          <span className="text-gray-600">Connecté en tant que <strong>{user?.email}</strong></span>
        </header>

        {/* Statistiques */}
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded shadow text-center">
            <h2 className="text-lg font-medium">Total Employés</h2>
            <p className="text-2xl font-bold text-blue-600">42</p>
          </div>
          <div className="bg-white p-6 rounded shadow text-center">
            <h2 className="text-lg font-medium">Postes</h2>
            <p className="text-2xl font-bold text-green-600">7</p>
          </div>
          <div className="bg-white p-6 rounded shadow text-center">
            <h2 className="text-lg font-medium">Email Envoyés</h2>
            <p className="text-2xl font-bold text-purple-600">124</p>
          </div>
          <div className="bg-white p-6 rounded shadow text-center">
            <h2 className="text-lg font-medium">Actifs</h2>
            <p className="text-2xl font-bold text-yellow-600">36</p>
          </div>
        </section>

        {/* Liste des employés (statique pour l'instant) */}
        <section className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Liste des employés</h2>
          <table className="w-full table-auto">
            <thead>
              <tr className="text-left border-b">
                <th className="pb-2">Nom</th>
                <th className="pb-2">Email</th>
                <th className="pb-2">Poste</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td>Jean Dupont</td>
                <td>jean@entreprise.com</td>
                <td>Développeur</td>
              </tr>
              <tr className="border-b">
                <td>Sophie Martin</td>
                <td>sophie@entreprise.com</td>
                <td>Designer</td>
              </tr>
              <tr>
                <td>David Morel</td>
                <td>david@entreprise.com</td>
                <td>Chef de projet</td>
              </tr>
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}
