import { useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import { Upload, Download, X, CheckCircle, AlertCircle } from 'lucide-react';
import { importAssetsFromJSON, exportAssetsToJSON } from '../services/api';
import type { Asset } from '../types';

type Props = {
  onClose: () => void;
  category?: string;
};

type ImportResult = {
  inserted: number;
  total: number;
  message?: string;
};

function mapRowToAsset(row: Record<string, any>, category: string): Omit<Asset, 'id' | 'createdAt'> {
  const get = (...keys: string[]) => {
    for (const k of keys) {
      const val = row[k] ?? row[k.toLowerCase()] ?? row[k.toUpperCase()];
      if (val !== undefined && val !== null && val !== '') return String(val).trim();
    }
    return '';
  };

  return {
    code:          get('Activo', 'Codigo', 'code', 'ACTIVO', 'CÓDIGO', 'Código'),
    description:   get('Descripcion', 'Descripción', 'description', 'DESCRIPCION'),
    features:      get('Caracteristicas', 'Características', 'features', 'CARACTERISTICAS'),
    serialNumber:  get('Número de Serie', 'N° Serie', 'serialNumber', 'NUMERO DE SERIE', 'NumSerie'),
    model:         get('Modelo', 'model', 'MODELO'),
    area:          get('Area', 'Área', 'area', 'AREA'),
    building:      get('Edificio', 'building', 'EDIFICIO'),
    category:      category || get('Categoria', 'Categoría', 'category') || 'Sin categoría',
    technicalState: get('Estado Tecnico', 'Estado Técnico', 'technicalState') || 'Operativo',
    name:       '',
    location:   '',
    technician: '',
    department: '',
    image:      '',
  };
}

export function ExcelTools({ onClose, category = '' }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<any[] | null>(null);
  const [parsedRows, setParsedRows] = useState<Omit<Asset, 'id' | 'createdAt'>[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setResult(null);
    setError(null);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = evt.target?.result;
        const wb = XLSX.read(data, { type: 'binary' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rows: Record<string, any>[] = XLSX.utils.sheet_to_json(ws, { defval: '' });

        const mapped = rows
          .map(r => mapRowToAsset(r, category))
          .filter(r => r.code);

        setParsedRows(mapped);
        setPreview(mapped.slice(0, 5));
      } catch {
        setError('No se pudo leer el archivo. Verifica que sea un .xlsx válido.');
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleImport = async () => {
    if (!parsedRows.length) return;
    setImporting(true);
    setError(null);
    try {
      const res = await importAssetsFromJSON(parsedRows);
      setResult(res);
      setParsedRows([]);
      setPreview(null);
      if (fileRef.current) fileRef.current.value = '';
    } catch (err: any) {
      setError(err?.message || 'Error al importar');
    } finally {
      setImporting(false);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    setError(null);
    try {
      const rows = await exportAssetsToJSON(category || undefined);
      if (!rows.length) {
        setError('No hay activos para exportar en esta categoría.');
        return;
      }
      const ws = XLSX.utils.json_to_sheet(rows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Activos');

      const cols = Object.keys(rows[0]).map(key => ({
        wch: Math.max(key.length, ...rows.map(r => String(r[key] || '').length), 10)
      }));
      ws['!cols'] = cols;

      const name = category
        ? `Activos_${category.replace(/\s+/g, '_')}_${new Date().toLocaleDateString('es-MX').replace(/\//g, '-')}.xlsx`
        : `Activos_${new Date().toLocaleDateString('es-MX').replace(/\//g, '-')}.xlsx`;

      XLSX.writeFile(wb, name);
    } catch (err: any) {
      setError(err?.message || 'Error al exportar');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">
            Importar / Exportar Excel
            {category && <span className="ml-2 text-sm font-normal text-gray-500">— {category}</span>}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Exportar */}
          <div className="border rounded-lg p-4 bg-green-50 border-green-200">
            <h3 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
              <Download className="w-5 h-5" /> Exportar a Excel
            </h3>
            <p className="text-sm text-green-700 mb-3">
              Descarga todos los activos{category ? ` de "${category}"` : ''} en formato .xlsx.
            </p>
            <button
              onClick={handleExport}
              disabled={exporting}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              {exporting ? 'Generando...' : 'Descargar Excel'}
            </button>
          </div>

          {/* Importar */}
          <div className="border rounded-lg p-4 bg-blue-50 border-blue-200">
            <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
              <Upload className="w-5 h-5" /> Importar desde Excel
            </h3>
            <p className="text-sm text-blue-700 mb-3">
              El archivo debe tener columnas: <strong>Activo, Descripcion, Caracteristicas, Número de Serie, Modelo, Area, Edificio</strong>.
              Los activos con código duplicado se omiten automáticamente.
            </p>

            <input
              ref={fileRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
            />

            {preview && (
              <div className="mt-4">
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  Vista previa — {parsedRows.length} activos listos (mostrando primeros 5):
                </p>
                <div className="overflow-x-auto rounded border">
                  <table className="text-xs w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-2 py-1 text-left">Código</th>
                        <th className="px-2 py-1 text-left">Descripción</th>
                        <th className="px-2 py-1 text-left">Área</th>
                        <th className="px-2 py-1 text-left">Edificio</th>
                      </tr>
                    </thead>
                    <tbody>
                      {preview.map((r, i) => (
                        <tr key={i} className="border-t">
                          <td className="px-2 py-1 font-mono">{r.code}</td>
                          <td className="px-2 py-1">{r.description}</td>
                          <td className="px-2 py-1">{r.area}</td>
                          <td className="px-2 py-1">{r.building}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button
                  onClick={handleImport}
                  disabled={importing}
                  className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  {importing ? 'Importando...' : `Importar ${parsedRows.length} activos`}
                </button>
              </div>
            )}
          </div>

          {result && (
            <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-300 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-green-800">Importación completada</p>
                <p className="text-sm text-green-700">
                  {result.message || `Se importaron ${result.inserted} de ${result.total} activos.`}
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-300 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}