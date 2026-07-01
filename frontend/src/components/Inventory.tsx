import { useState } from 'react';
import { ArrowLeft, Search, ScanBarcode, FileEdit, History, Settings, Briefcase, Edit2, Trash2 } from 'lucide-react';
import type{ Asset } from '../types';
import { ConfirmDialog } from './ConfirmDialog';

type InventoryProps = {
  category: string;
  assets: Asset[];
  onBack: () => void;
  onManualRegistration: () => void;
  onEditAsset: (asset: Asset) => void;
  onDeleteAsset: (assetId: string) => Promise<void>;
  onViewHistory: () => void;
  onManageTechnicalStates: () => void;
  onViewFixedAssets: () => void;
  onScan: () => void;
};

export function Inventory({
  category,
  assets,
  onBack,
  onManualRegistration,
  onEditAsset,
  onDeleteAsset,
  onViewHistory,
  onManageTechnicalStates,
  onViewFixedAssets,
  onScan,
}: InventoryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [showBarcodeInput] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const filteredAssets = assets.filter(asset =>
  asset.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  asset.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  asset.area?.toLowerCase().includes(searchTerm.toLowerCase())
);

  const handleDeleteConfirm = async () => {
    if (!deleteConfirmId) return;
    try {
      await onDeleteAsset(deleteConfirmId);
      setDeleteConfirmId(null);
      setDeleteError(null);
    } catch (err: any) {
      setDeleteError(err?.message || 'No se pudo eliminar el activo.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-600 text-white p-6 shadow-lg">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-2 mb-4 hover:bg-blue-700 px-3 py-2 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver
          </button>
          <h1 className="mb-1">Inventario - {category}</h1>
          <p className="text-blue-100">{filteredAssets.length} activos registrados</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por nombre o código..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>
        </div>

        {/* Main Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <button
            onClick={onScan}
            className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all border-2 border-blue-500 flex items-center gap-3"
          >
            <div className="bg-blue-500 p-3 rounded-lg">
              <ScanBarcode className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <h3 className="text-gray-900">Escanear Código</h3>
              <p className="text-gray-500 text-sm">Ingrese código de barras</p>
            </div>
          </button>

          <button
            onClick={onManualRegistration}
            className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all border-2 border-green-500 flex items-center gap-3"
          >
            <div className="bg-green-500 p-3 rounded-lg">
              <FileEdit className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <h3 className="text-gray-900">Registro Manual</h3>
              <p className="text-gray-500 text-sm">Agregar nuevo activo</p>
            </div>
          </button>

          <button
            onClick={onViewHistory}
            className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all border-2 border-purple-500 flex items-center gap-3"
          >
            <div className="bg-purple-500 p-3 rounded-lg">
              <History className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <h3 className="text-gray-900">Historial</h3>
              <p className="text-gray-500 text-sm">Ver movimientos</p>
            </div>
          </button>
        </div>

        {/* Barcode Input */}
        {showBarcodeInput && (
          <div className="bg-blue-50 p-4 rounded-lg mb-6 border-2 border-blue-200">
            <label className="block text-gray-700 mb-2">Código de Barras</label>
            <input
              type="text"
              placeholder="Escanee o ingrese el código..."
              autoFocus
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        {/* Additional Options */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={onManageTechnicalStates}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            Gestionar Estados Técnicos
          </button>
          <button
            onClick={onViewFixedAssets}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
          >
            <Briefcase className="w-4 h-4" />
            Ver Activos Fijos
          </button>
        </div>

        {/* Assets List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-gray-700">Activo</th>
                  <th className="px-6 py-3 text-left text-gray-700">Descripcion</th>
                  <th className="px-6 py-3 text-left text-gray-700">Caracteristicas</th>
                  <th className="px-6 py-3 text-left text-gray-700">Número de Serie</th>
                  <th className="px-6 py-3 text-left text-gray-700">Modelo</th>
                  <th className="px-6 py-3 text-left text-gray-700">Area</th>
                  <th className="px-6 py-3 text-left text-gray-700">Edificio</th>
                  <th className="px-6 py-3 text-left text-gray-700">Estado</th>
                  <th className="px-6 py-3 text-center text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssets.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-8 text-center text-gray-500">
                      No hay activos registrados en esta categoría
                    </td>
                  </tr>
                ) : (
                  filteredAssets.map((asset) => (
                    <tr key={asset.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-gray-900">{asset.code}</td>
                      <td className="px-6 py-4 text-gray-900">{asset.description}</td>
                      <td className="px-6 py-4 text-gray-600">{asset.features || "-"}</td>
                      <td className="px-6 py-4 text-gray-600">{asset.serialNumber || "-"}</td>
                      <td className="px-6 py-4 text-gray-600">{asset.model || "-"}</td>
                      <td className="px-6 py-4 text-gray-600">{asset.area || "-"}</td>
                      <td className="px-6 py-4 text-gray-600">{asset.building || "-"}</td>
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
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => onEditAsset(asset)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(asset.id)}
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

      {/* Delete Confirmation Dialog */}
      {deleteConfirmId && (
        <ConfirmDialog
          title="¿Está seguro?"
          message={deleteError || "¿Desea eliminar este activo? Esta acción no se puede deshacer."}
          onConfirm={handleDeleteConfirm}
          onCancel={() => { setDeleteConfirmId(null); setDeleteError(null); }}
          confirmText="Eliminar"
          cancelText="Cancelar"
          variant="danger"
        />
      )}
    </div>
  );
}