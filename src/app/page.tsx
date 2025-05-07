'use client'

import { useEffect, useState } from 'react'

type Employee = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  position: string;
};

export default function Home() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Employee>>({});
  const [newEmployee, setNewEmployee] = useState<Partial<Employee>>({});
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  async function fetchEmployees() {
    try {
      const res = await fetch('/api/employes');
      if (!res.ok) throw new Error(`Erreur API: ${res.status}`);
      const data = await res.json();
      setEmployees(data);
    } catch (err: any) {
      setError(err.message || "Erreur inconnue");
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Voulez-vous vraiment supprimer cet employé ?")) return;
    try {
      const res = await fetch('/api/employes', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Échec de la suppression");
      await fetchEmployees();
    } catch (err) {
      console.error("Erreur suppression:", err);
    }
  }

  function handleEdit(employee: Employee) {
    setEditId(employee.id);
    setFormData(employee);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>, isNew = false) {
    const { name, value } = e.target;
    if (isNew) {
      setNewEmployee((prev) => ({ ...prev, [name]: value }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  }

  async function handleUpdate() {
    try {
      const res = await fetch('/api/employes', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Échec de la mise à jour");
      setEditId(null);
      setFormData({});
      await fetchEmployees();
    } catch (err) {
      console.error("Erreur modification:", err);
    }
  }

  async function handleAddEmployee() {
    try {
      const res = await fetch('/api/employes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEmployee),
      });
      if (!res.ok) throw new Error("Échec de l'ajout");
      setShowModal(false);
      setNewEmployee({});
      await fetchEmployees();
    } catch (err) {
      console.error("Erreur ajout:", err);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Header */}
      <header className="bg-blue-600 text-white p-6 rounded-lg shadow-md mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestion des Employés</h1>
          <p className="text-sm">Liste des employés enregistrés dans le système</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded text-white font-medium"
        >
          Ajouter un employé
        </button>
      </header>

      {error && <p className="text-red-500 mb-4">⚠️ {error}</p>}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="py-3 px-6 text-left">Prénom</th>
              <th className="py-3 px-6 text-left">Nom</th>
              <th className="py-3 px-6 text-left">Email</th>
              <th className="py-3 px-6 text-left">Poste</th>
              <th className="py-3 px-6 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id} className="border-b hover:bg-gray-100">
                {editId === emp.id ? (
                  <>
                    <td className="py-2 px-4">
                      <input name="firstName" value={formData.firstName || ''} onChange={handleChange} className="border px-2 py-1 rounded w-full" />
                    </td>
                    <td className="py-2 px-4">
                      <input name="lastName" value={formData.lastName || ''} onChange={handleChange} className="border px-2 py-1 rounded w-full" />
                    </td>
                    <td className="py-2 px-4">
                      <input name="email" value={formData.email || ''} onChange={handleChange} className="border px-2 py-1 rounded w-full" />
                    </td>
                    <td className="py-2 px-4">
                      <input name="position" value={formData.position || ''} onChange={handleChange} className="border px-2 py-1 rounded w-full" />
                    </td>
                    <td className="py-2 px-4 space-x-2">
                      <button onClick={handleUpdate} className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded">Enregistrer</button>
                      <button onClick={() => setEditId(null)} className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded">Annuler</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="py-3 px-6">{emp.firstName}</td>
                    <td className="py-3 px-6">{emp.lastName}</td>
                    <td className="py-3 px-6">{emp.email}</td>
                    <td className="py-3 px-6">{emp.position}</td>
                    <td className="py-3 px-6 flex space-x-2">
                      <button onClick={() => handleEdit(emp)} className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded">Modifier</button>
                      <button onClick={() => handleDelete(emp.id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">Supprimer</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal d'ajout */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Ajouter un employé</h2>
            <input
              name="firstName"
              placeholder="Prénom"
              className="w-full border mb-2 px-3 py-2 rounded"
              value={newEmployee.firstName || ''}
              onChange={(e) => handleChange(e, true)}
            />
            <input
              name="lastName"
              placeholder="Nom"
              className="w-full border mb-2 px-3 py-2 rounded"
              value={newEmployee.lastName || ''}
              onChange={(e) => handleChange(e, true)}
            />
            <input
              name="email"
              placeholder="Email"
              className="w-full border mb-2 px-3 py-2 rounded"
              value={newEmployee.email || ''}
              onChange={(e) => handleChange(e, true)}
            />
            <input
              name="position"
              placeholder="Poste"
              className="w-full border mb-4 px-3 py-2 rounded"
              value={newEmployee.position || ''}
              onChange={(e) => handleChange(e, true)}
            />
            <div className="flex justify-end space-x-2">
              <button onClick={() => setShowModal(false)} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded">
                Annuler
              </button>
              <button onClick={handleAddEmployee} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
