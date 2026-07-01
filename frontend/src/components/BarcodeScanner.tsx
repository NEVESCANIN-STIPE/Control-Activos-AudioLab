import { useState, useEffect } from 'react';
import { ArrowLeft, ScanBarcode, Search, Camera, X, CheckCircle } from 'lucide-react';
import type{ Asset, TechnicalState } from '../types';

type BarcodeScannerProps = {
  onBack: () => void;
  assets: Asset[];
  onAssetFound: (asset: Asset) => void;
};

export function BarcodeScanner({ onBack, assets, onAssetFound }: BarcodeScannerProps) {
  const [barcodeInput, setBarcodeInput] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [foundAsset, setFoundAsset] = useState<Asset | null>(null);
  const [notFound, setNotFound] = useState(false);

  // Simular efecto de escaneo
  useEffect(() => {
    if (isScanning) {
      const timer = setTimeout(() => {
        setIsScanning(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isScanning]);

  const handleBarcodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setBarcodeInput(value);
    setNotFound(false);
    setFoundAsset(null);
  };

  const handleSearch = () => {
    if (!barcodeInput.trim()) return;

    // Buscar activo por código
    const asset = assets.find(
      (a) => a.code.toLowerCase() === barcodeInput.toLowerCase()
    );

    if (asset) {
      setFoundAsset(asset);
      setNotFound(false);
    } else {
      setFoundAsset(null);
      setNotFound(true);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSimulateScan = () => {
    setIsScanning(true);
    // Simular que después del escaneo se detecta un código
    setTimeout(() => {
      if (assets.length > 0) {
        const randomAsset = assets[Math.floor(Math.random() * assets.length)];
        setBarcodeInput(randomAsset.code);
        setFoundAsset(randomAsset);
      }
    }, 2000);
  };

  const handleViewAsset = () => {
    if (foundAsset) {
      onAssetFound(foundAsset);
    }
  };

  const handleClearSearch = () => {
    setBarcodeInput('');
    setFoundAsset(null);
    setNotFound(false);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-blue-600 text-white p-6 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-2 mb-4 hover:bg-blue-700 px-3 py-2 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver
          </button>
          <h1 className="mb-1 flex items-center gap-3">
            <ScanBarcode className="w-8 h-8" />
            Escanear Código de Barras
          </h1>
          <p className="text-blue-100">Escanee o ingrese el código del activo</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {/* Scanner Area */}
        <div className="bg-gray-800 rounded-xl overflow-hidden shadow-2xl mb-6">
          {/* Camera View Simulation */}
          <div className="relative bg-black aspect-video flex items-center justify-center">
            {isScanning ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-full h-full">
                  {/* Scanning animation */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-64 h-40 border-4 border-blue-500 rounded-lg relative">
                      <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500 animate-pulse"></div>
                      <div
                        className="absolute top-0 left-0 right-0 h-1 bg-red-500"
                        style={{
                          animation: 'scan 2s linear infinite',
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-white text-xl mt-48">Escaneando...</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center p-8">
                <Camera className="w-24 h-24 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">Vista de cámara</p>
                <p className="text-gray-500 text-sm mt-2">
                  Coloque el código de barras frente a la cámara
                </p>
              </div>
            )}

            {/* Scan Frame Overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-72 h-48 border-2 border-white/30 rounded-lg relative">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-400"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-400"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-400"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-400"></div>
              </div>
            </div>
          </div>

          {/* Scanner Controls */}
          <div className="bg-gray-800 p-6 border-t border-gray-700">
            <button
              onClick={handleSimulateScan}
              disabled={isScanning}
              className={`w-full py-4 rounded-lg font-medium text-lg transition-all ${
                isScanning
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg'
              }`}
            >
              {isScanning ? 'Escaneando...' : 'Iniciar Escaneo'}
            </button>
          </div>
        </div>

        {/* Manual Input */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-gray-800 mb-4 flex items-center gap-2">
            Entrada Manual
          </h2>
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={barcodeInput}
                onChange={handleBarcodeChange}
                onKeyPress={handleKeyPress}
                placeholder="Ingrese el código del activo (Ej: AUD-001)"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                autoFocus
              />
              {barcodeInput && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            <button
              onClick={handleSearch}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <Search className="w-5 h-5" />
              Buscar
            </button>
          </div>
        </div>

        {/* Search Results */}
        {foundAsset && (
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-green-500 animate-pulse-once">
            <div className="flex items-start gap-4">
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-green-600 mb-3 flex items-center gap-2">
                  Activo Encontrado
                </h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-gray-500 text-sm">Código</p>
                    <p className="text-gray-900 font-medium">{foundAsset.code}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Nombre</p>
                    <p className="text-gray-900 font-medium">{foundAsset.description || '-'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Modelo</p>
                    <p className="text-gray-900">{foundAsset.model || '-'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">N° Serie</p>
                    <p className="text-gray-900">{foundAsset.serialNumber || '-'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Localización</p>
                    <p className="text-gray-900">{foundAsset.area || '-'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Técnico</p>
                    <p className="text-gray-900">{foundAsset.building || '-'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Estado</p>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm ${
                        foundAsset.technicalState === 'Operativo'
                          ? 'bg-green-100 text-green-700'
                          : foundAsset.technicalState === 'En mantenimiento'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {foundAsset.technicalState}
                    </span>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Categoría</p>
                    <p className="text-gray-900">{foundAsset.category}</p>
                  </div>
                </div>
                <button
                  onClick={handleViewAsset}
                  className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Ver Detalles del Activo
                </button>
              </div>
            </div>
          </div>
        )}

        {notFound && (
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-red-500">
            <div className="flex items-start gap-4">
              <div className="bg-red-100 p-3 rounded-full">
                <X className="w-8 h-8 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-red-600 mb-2">Activo No Encontrado</h3>
                <p className="text-gray-600">
                  No se encontró ningún activo con el código "{barcodeInput}".
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  Verifique que el código sea correcto o intente escanear nuevamente.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes scan {
          0% {
            top: 0;
          }
          100% {
            top: 100%;
          }
        }

        @keyframes pulse-once {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }

        .animate-pulse-once {
          animation: pulse-once 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}
