import { useState } from 'react';
import { ArrowLeft, Plus, Edit2, Trash2 } from 'lucide-react';
import type{ Asset, TechnicalState } from '../types';

type TechnicalStatesProps = {
  states: TechnicalState[];
  onBack: () => void;
  onAddState: (state: Omit<TechnicalState, 'id'>) => void;
};

export function TechnicalStates({ states, onBack, onAddState }: TechnicalStatesProps) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    state: '',
    technician: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddState(formData);
    setFormData({ state: '', technician: '' });
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-purple-600 text-white p-6 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-2 mb-4 hover:bg-purple-700 px-3 py-2 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver
          </button>
          <h1 className="mb-1">Gestión de Estados Técnicos</h1>
          <p className="text-purple-100">Administre los estados disponibles para los activos</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {/* Add Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Agregar Estado Técnico
          </button>
        </div>

        {/* Add Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-gray-900 mb-4">Nuevo Estado Técnico</h3>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="state" className="block text-gray-700 mb-2">
                    Estado *
                  </label>
                  <input
                    type="text"
                    id="state"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    required
                    placeholder="Ej: En reparación"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label htmlFor="technician" className="block text-gray-700 mb-2">
                    Técnico Responsable *
                  </label>
                  <input
                    type="text"
                    id="technician"
                    value={formData.technician}
                    onChange={(e) => setFormData({ ...formData, technician: e.target.value })}
                    required
                    placeholder="Ej: Juan Pérez"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Guardar
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* States List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-gray-700">Estado</th>
                  <th className="px-6 py-3 text-left text-gray-700">Técnico Responsable</th>
                  <th className="px-6 py-3 text-center text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {states.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                      No hay estados técnicos registrados
                    </td>
                  </tr>
                ) : (
                  states.map((state) => (
                    <tr key={state.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-gray-900">{state.state}</td>
                      <td className="px-6 py-4 text-gray-600">{state.technician}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}