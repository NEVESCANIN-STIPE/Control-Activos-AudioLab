  import { useEffect, useRef, useState } from 'react';
  import { ArrowLeft, ScanBarcode, Search, X } from 'lucide-react';
  import { Html5Qrcode } from 'html5-qrcode';

  type BarcodeScannerProps = {
    onScan: (code: string) => void;
    onBack?: () => void;
  };

  const READER_ID = 'barcode-reader';

  export function BarcodeScanner({ onScan, onBack }: BarcodeScannerProps) {
    const [manualCode, setManualCode] = useState('');
    const [cameraActive, setCameraActive] = useState(false);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const scannerRef = useRef<Html5Qrcode | null>(null);

    useEffect(() => {
      return () => {
        // Detiene la cámara si el componente se desmonta
        scannerRef.current?.stop().catch(() => {});
      };
    }, []);

    const startCamera = async () => {
      setCameraError(null);
      try {
        const scanner = new Html5Qrcode(READER_ID);
        scannerRef.current = scanner;
        await scanner.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: 250 },
          (decodedText) => {
            onScan(decodedText);
            stopCamera();
          },
          () => {
            // ignorar fotogramas sin código detectado
          }
        );
        setCameraActive(true);
      } catch (err) {
        console.error('Error iniciando la cámara:', err);
        setCameraError(
          'No se pudo acceder a la cámara. Verifique los permisos del navegador o use la entrada manual.'
        );
        setCameraActive(false);
      }
    };

    const stopCamera = async () => {
      try {
        await scannerRef.current?.stop();
      } catch {
        // la cámara ya pudo haberse detenido
      }
      setCameraActive(false);
    };

    const handleManualSearch = () => {
      if (!manualCode.trim()) return;
      onScan(manualCode.trim());
    };

    return (
      <div className="bg-gray-900 rounded-xl overflow-hidden shadow-2xl">
        {onBack && (
          <div className="bg-blue-600 text-white p-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 hover:bg-blue-700 px-3 py-2 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Volver
            </button>
          </div>
        )}

        {/* Vista de cámara */}
        <div className="relative bg-black aspect-video flex items-center justify-center">
          <div id={READER_ID} className="w-full h-full" />
          {!cameraActive && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
              <ScanBarcode className="w-20 h-20 text-gray-600 mb-4" />
              <p className="text-gray-400 text-lg">Cámara desactivada</p>
              {cameraError && (
                <p className="text-red-400 text-sm mt-2 max-w-sm">{cameraError}</p>
              )}
            </div>
          )}
        </div>

        <div className="bg-gray-800 p-6 border-t border-gray-700 space-y-4">
          <button
            onClick={cameraActive ? stopCamera : startCamera}
            className="w-full py-3 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-lg"
          >
            {cameraActive ? 'Detener Cámara' : 'Iniciar Escaneo con Cámara'}
          </button>

          <div className="flex gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleManualSearch()}
                placeholder="Ingrese el código manualmente (Ej: AUD-001)"
                className="w-full px-4 py-3 border-2 border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {manualCode && (
                <button
                  onClick={() => setManualCode('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            <button
              onClick={handleManualSearch}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <Search className="w-5 h-5" />
              Buscar
            </button>
          </div>
        </div>
      </div>
    );
  }
