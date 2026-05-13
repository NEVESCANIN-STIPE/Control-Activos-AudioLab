import { useState } from "react";
import { BarcodeScanner } from "../components/BarcodeScanner";
import { getAssetByCode } from "../services/api";

type Props = {
  onBack: () => void;
};

export function ScanPage({ onBack }: Props) {
  const [asset, setAsset] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleScan = async (code: string) => {
    setLoading(true);

    const result = await getAssetByCode(code);

    setAsset(result);
    setLoading(false);
  };

  return (
    <div className="p-6">
      {/* Botón volver */}
      <button
        onClick={onBack}
        className="mb-4 bg-gray-300 px-4 py-2 rounded"
      >
        ← Volver
      </button>

      <h1 className="text-xl font-bold mb-4">Escanear activo</h1>

      {/* Scanner */}
      <BarcodeScanner onScan={handleScan} />

      {/* Estado */}
      {loading && <p className="mt-4">Buscando...</p>}

      {/* Resultado */}
      {asset && (
        <div className="mt-6 p-4 border rounded bg-white shadow">
          <h2 className="text-lg font-bold">{asset.name}</h2>
          <p><b>Código:</b> {asset.code}</p>
          <p><b>Descripción:</b> {asset.description}</p>
          <p><b>Área:</b> {asset.department}</p>
          <p><b>Modelo:</b> {asset.model}</p>
          <p><b>Serie:</b> {asset.serialNumber}</p>
          <p><b>Estado:</b> {asset.technicalState}</p>
        </div>
      )}

      {/* No encontrado */}
      {asset === null && !loading && (
        <p className="mt-4 text-red-500">Escanea un código...</p>
      )}
    </div>
  );
}