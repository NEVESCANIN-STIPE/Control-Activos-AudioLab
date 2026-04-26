import { ArrowLeft, Calendar, User, MapPin } from 'lucide-react';
import type{ Asset, TechnicalState } from '../types';

type AssetHistoryProps = {
  assets: Asset[];
  onBack: () => void;
};

export function AssetHistory({ assets, onBack }: AssetHistoryProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-purple-600 text-white p-6 shadow-lg">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-2 mb-4 hover:bg-purple-700 px-3 py-2 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver al Inventario
          </button>
          <h1 className="mb-1">Historial de Movimientos</h1>
          <p className="text-purple-100">Registro de actividades de los activos</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <div className="space-y-4">
          {assets.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-500">No hay movimientos registrados</p>
            </div>
          ) : (
            assets.map((asset) => (
              <div key={asset.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-gray-900 mb-1">{asset.name}</h3>
                    <p className="text-gray-600">Código: {asset.code}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    asset.technicalState === 'Operativo' 
                      ? 'bg-green-100 text-green-700'
                      : asset.technicalState === 'En mantenimiento'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {asset.technicalState}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Registrado: {asset.createdAt.toLocaleDateString('es-ES')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{asset.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <User className="w-4 h-4" />
                    <span>{asset.technician}</span>
                  </div>
                </div>

                {asset.description && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-gray-600 text-sm">{asset.description}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
