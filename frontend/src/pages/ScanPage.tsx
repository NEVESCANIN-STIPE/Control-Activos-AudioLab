import { useState } from 'react';
import { BarcodeScanner } from '../components/BarcodeScanner';
import { getAssetByCode } from '../services/api';
import type { Asset } from '../types';

type Props = {
  onBack: () => void;
};

export function ScanPage({ onBack }: Props) {
  const [asset, setAsset] = useState<Asset | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchedCode, setSearchedCode] = useState<string | null>(null);

  const handleScan = async (code: string) => {
    setLoading(true);
    setError(null);
    setAsset(null);
    setSearchedCode(code);

    try {
      const result = await getAssetByCode(code);
      setAsset(result);
    } catch (err: any) {
      setError(err?.message || 'Activo no encontrado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={onBack}
          className="mb-4 flex items-center gap-2 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg transition-colors"
        >
          ← Volver
        </button>

        <h1 className="text-2xl mb-4 text-gray-900">Escanear Activo</h1>

        <BarcodeScanner onScan={handleScan} />

        {loading && <p className="mt-4 text-gray-600">Buscando "{searchedCode}"...</p>}

        {asset && !loading && (
          <div className="mt-6 p-6 border rounded-lg bg-white shadow-md">
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              {asset.description || asset.code}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <p><b>Código:</b> {asset.code}</p>
              <p><b>Categoría:</b> {asset.category || '-'}</p>
              <p><b>Descripción:</b> {asset.description || '-'}</p>
              <p><b>Modelo:</b> {asset.model || '-'}</p>
              <p><b>N° Serie:</b> {asset.serialNumber || '-'}</p>
              <p><b>Área:</b> {asset.area || '-'}</p>
              <p><b>Edificio:</b> {asset.building || '-'}</p>
              <p>
                <b>Estado:</b>{' '}
                <span
                  className={`px-2 py-0.5 rounded-full text-xs ${
                    asset.technicalState === 'Operativo'
                      ? 'bg-green-100 text-green-700'
                      : asset.technicalState === 'En mantenimiento'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {asset.technicalState}
                </span>
              </p>
            </div>
          </div>
        )}

        {error && !loading && (
          <div className="mt-6 p-4 border-2 border-red-300 rounded-lg bg-red-50 text-red-700">
            {error}{searchedCode ? ` ("${searchedCode}")` : ''}
          </div>
        )}

        {!asset && !error && !loading && (
          <p className="mt-4 text-gray-500">Escanee un código o ingréselo manualmente...</p>
        )}
      </div>
    </div>
  );
}
