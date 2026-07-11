import { Search, Tv, Beaker, Briefcase, Warehouse, Plus, Building2,
  FlaskConical   } from 'lucide-react';
//import { BarcodeScanner } from './BarcodeScanner';

type HomeProps = {
  onCategorySelect: (category: string) => void; 
  onScanBarcode: () => void;
};

export function Home({ onCategorySelect, onScanBarcode }: HomeProps) {
  const categories = [
    { name: 'Audiovisuales', icon: Tv, color: 'bg-blue-500' },
    { name: 'Almacen-laboratorios', icon: Warehouse, color: 'bg-purple-500' },
    { name: 'Laboratorios', icon: Beaker, color: 'bg-green-500' },
    { name: 'Oficina Rav-Lab', icon: Building2, color: 'bg-yellow-500' },
    { name: 'Activos fijos(generales)', icon: Briefcase, color: 'bg-red-500' }, 
    { name: 'Almacen(CEI)', icon: FlaskConical, color: 'bg-indigo-500' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-blue-900 mb-2">Sistema de Control de Activos</h1>
          <p className="text-gray-600">Seleccione una categoría para gestionar sus activos</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar categoría o activo..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
            />
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.name}
                onClick={() => onCategorySelect(category.name)}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1 border border-gray-100"
              >
                <div className={`${category.color} w-14 h-14 rounded-full flex items-center justify-center mb-4 mx-auto`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-gray-800 text-center">{category.name}</h3>
                <p className="text-gray-500 text-center text-sm mt-1">Ver inventario</p>
              </button>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <h3 className="text-gray-800 mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Acciones Rápidas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button 
            onClick={onScanBarcode}
            className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
              Escanear Código de Barras
            </button>
            <button className="px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
              Registro Rápido
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}