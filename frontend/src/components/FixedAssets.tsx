import { ArrowLeft, Search, Settings } from 'lucide-react';
import type{ Asset } from '../types';

type FixedAssetsProps = {
  assets: Asset[];
  onBack: () => void;
  onManageTechnicalStates: () => void;
};

export function FixedAssets({ assets, onBack, onManageTechnicalStates }: FixedAssetsProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-red-600 text-white p-6 shadow-lg">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-2 mb-4 hover:bg-red-700 px-3 py-2 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver
          </button>
          <h1 className="mb-1">Activos Fijos</h1>
          <p className="text-red-100">Listado de activos permanentes</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Search and Actions */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar activo fijo..."
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
            />
          </div>
          <button
            onClick={onManageTechnicalStates}
            className="px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
          >
            <Settings className="w-5 h-5" />
            Agregar Estado Técnico
          </button>
        </div>

        {/* Fixed Assets List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-gray-700">Código</th>
                  <th className="px-6 py-3 text-left text-gray-700">Nombre</th>
                  <th className="px-6 py-3 text-left text-gray-700">Localización</th>
                  <th className="px-6 py-3 text-left text-gray-700">Departamento</th>
                  <th className="px-6 py-3 text-left text-gray-700">Estado</th>
                  <th className="px-6 py-3 text-left text-gray-700">Técnico</th>
                </tr>
              </thead>
              <tbody>
                {assets.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      <p className="mb-2">No hay activos fijos registrados</p>
                      <p className="text-sm">Los activos categorizados como "Activos Fijos" aparecerán aquí</p>
                    </td>
                  </tr>
                ) : (
                  assets.map((asset) => (
                    <tr key={asset.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-gray-900">{asset.code}</td>
                      <td className="px-6 py-4 text-gray-900">{asset.name}</td>
                      <td className="px-6 py-4 text-gray-600">{asset.location}</td>
                      <td className="px-6 py-4 text-gray-600">{asset.department}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          asset.technicalState === 'Operativo' 
                            ? 'bg-green-100 text-green-700'
                            : asset.technicalState === 'En mantenimiento'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {asset.technicalState}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{asset.technician}</td>
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