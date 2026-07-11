import { useState } from 'react';
import { ArrowLeft, Search, ScanBarcode, FileEdit, History, Settings, Briefcase, Edit2, Trash2, FileSpreadsheet } from 'lucide-react';
import type { Asset } from '../types';
import { ConfirmDialog } from './ConfirmDialog';
import { ExcelTools } from './ExcelTools';

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
  const [_showBarcodeInput] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [showExcelTools, setShowExcelTools] = useState(false);

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
        <div className="max-w-7xl mx-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-2 mb-4 hover:bg-blue-700 px-3 py-2 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver
          </button>
          <h1 className="text-2xl font-bold mb-1">Inventario - {category}</h1>
          <p className="text-blue-100">{assets.length} activos registrados</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Buscador */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por nombre o código..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>

        {/* Acciones rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <button
            onClick={onScan}
            className="flex items-center gap-3 p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
          >
            <ScanBarcode className="w-6 h-6" />
            <div className="text-left">
              <p className="font-semibold">Escanear Código</p>
              <p className="text-blue-100 text-sm">Ingrese código de barras</p>
            </div>
          </button>
          <button
            onClick={onManualRegistration}
            className="flex items-center gap-3 p-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md"
          >
            <FileEdit className="w-6 h-6" />
            <div className="text-left">
              <p className="font-semibold">Registro Manual</p>
              <p className="text-green-100 text-sm">Agregar nuevo activo</p>
            </div>
          </button>
          <button
            onClick={onViewHistory}
            className="flex items-center gap-3 p-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-md"
          >
            <History className="w-6 h-6" />
            <div className="text-left">
              <p className="font-semibold">Historial</p>
              <p className="text-purple-100 text-sm">Ver movimientos</p>
            </div>
          </button>
        </div>

        {/* Botones secundarios */}
        <div className="flex flex-wrap gap-3 mb-6">
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
          <button
            onClick={() => setShowExcelTools(true)}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Excel
          </button>
        </div>

        {/* Tabla */}
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
                      <td className="px-6 py-4 font-mono text-sm text-gray-900">{asset.code}</td>
                      <td className="px-6 py-4 text-gray-900">{asset.description}</td>
                      <td className="px-6 py-4 text-gray-600 text-sm">{asset.features}</td>
                      <td className="px-6 py-4 text-gray-600 text-sm">{asset.serialNumber}</td>
                      <td className="px-6 py-4 text-gray-600 text-sm">{asset.model}</td>
                      <td className="px-6 py-4 text-gray-600 text-sm">{asset.area}</td>
                      <td className="px-6 py-4 text-gray-600 text-sm">{asset.building}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
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

      {/* Diálogo de confirmación de borrado */}
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

      {/* Modal Importar/Exportar Excel */}
      {showExcelTools && (
        <ExcelTools
          category={category}
          onClose={() => setShowExcelTools(false)}
        />
      )}
    </div>
  );
}