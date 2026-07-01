import { useState, useEffect } from 'react';
import { Home } from './components/Home';
import { Inventory } from './components/Inventory';
import { ManualRegistration } from './components/ManualRegistration';
import { EditAsset } from './components/EditAsset';
import { TechnicalStates } from './components/TechnicalStates';
import { FixedAssets } from './components/FixedAssets';
import { AssetHistory } from './components/AssetHistory';
import { ScanPage } from './pages/ScanPage';
import type { Asset, TechnicalState } from './types';
import {
  getAssets,
  createAsset,
  updateAsset,
  deleteAsset,
  getTechnicalStates,
  createTechnicalState,
} from './services/api';
import './styles/globals.css';

// Nombre exacto de la categoría "Activos Fijos" definida en Home.tsx
const FIXED_ASSETS_CATEGORY = 'Activos fijos(generales)';

export type { Asset, TechnicalState };

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<
    'home' | 'inventory' | 'manual-registration' | 'edit-asset' | 'technical-states' | 'fixed-assets' | 'history' | 'scan'
  >('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [assets, setAssets] = useState<Asset[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [technicalStates, setTechnicalStates] = useState<TechnicalState[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carga inicial de activos y estados técnicos desde el backend
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [assetsData, statesData] = await Promise.all([
          getAssets(),
          getTechnicalStates(),
        ]);
        setAssets(assetsData);
        setTechnicalStates(statesData);
      } catch (err) {
        console.error('Error cargando datos:', err);
        setError(
          'No se pudo conectar con el servidor. Verifique que el backend esté corriendo en ' +
            (import.meta.env.VITE_API_URL || 'http://localhost:3000')
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setCurrentScreen('inventory');
  };

  // Crea el activo en el backend y lo agrega al estado local con el id real
  const handleAddAsset = async (asset: Omit<Asset, 'id' | 'createdAt'>) => {
    const created = await createAsset(asset);
    setAssets(prev => [created, ...prev]);
  };

  // Actualiza el activo en el backend y refleja el resultado en el estado local
  const handleUpdateAsset = async (updatedAsset: Asset) => {
    const saved = await updateAsset(updatedAsset.id, updatedAsset);
    setAssets(prev => prev.map(asset => (asset.id === saved.id ? saved : asset)));
  };

  // Elimina el activo en el backend y lo quita del estado local
  const handleDeleteAsset = async (assetId: string) => {
    await deleteAsset(assetId);
    setAssets(prev => prev.filter(asset => asset.id !== assetId));
  };

  const handleEditAsset = (asset: Asset) => {
    setSelectedAsset(asset);
    setCurrentScreen('edit-asset');
  };

  // Crea el estado técnico en el backend y lo agrega al catálogo local
  const handleAddTechnicalState = async (state: Omit<TechnicalState, 'id'>) => {
    const created = await createTechnicalState(state);
    setTechnicalStates(prev => [...prev, created]);
  };

  const filteredAssets = selectedCategory
    ? assets.filter(
        asset =>
          asset.category?.toLowerCase().trim() === selectedCategory.toLowerCase().trim()
      )
    : assets;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Cargando activos...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {error && (
        <div className="bg-red-100 border-b border-red-300 text-red-700 px-6 py-3 text-sm">
          {error}
        </div>
      )}

      {currentScreen === 'home' && (
        <Home
          onCategorySelect={handleCategorySelect}
          onScanBarcode={() => setCurrentScreen('scan')}
        />
      )}

      {currentScreen === 'inventory' && (
        <Inventory
          category={selectedCategory}
          assets={filteredAssets}
          onBack={() => setCurrentScreen('home')}
          onManualRegistration={() => setCurrentScreen('manual-registration')}
          onEditAsset={handleEditAsset}
          onDeleteAsset={handleDeleteAsset}
          onViewHistory={() => setCurrentScreen('history')}
          onManageTechnicalStates={() => setCurrentScreen('technical-states')}
          onViewFixedAssets={() => setCurrentScreen('fixed-assets')}
          onScan={() => setCurrentScreen('scan')}
        />
      )}

      {currentScreen === 'manual-registration' && (
        <ManualRegistration
          category={selectedCategory}
          onBack={() => setCurrentScreen('inventory')}
          onAddAsset={handleAddAsset}
          technicalStates={technicalStates}
        />
      )}

      {currentScreen === 'edit-asset' && selectedAsset && (
        <EditAsset
          asset={selectedAsset}
          onBack={() => setCurrentScreen('inventory')}
          onUpdateAsset={handleUpdateAsset}
          technicalStates={technicalStates}
        />
      )}

      {currentScreen === 'technical-states' && (
        <TechnicalStates
          states={technicalStates}
          onBack={() => setCurrentScreen('inventory')}
          onAddState={handleAddTechnicalState}
        />
      )}

      {currentScreen === 'fixed-assets' && (
        <FixedAssets
          assets={assets.filter(asset => asset.category === FIXED_ASSETS_CATEGORY)}
          onBack={() => setCurrentScreen('inventory')}
          onManageTechnicalStates={() => setCurrentScreen('technical-states')}
        />
      )}

      {currentScreen === 'history' && (
        <AssetHistory
          assets={filteredAssets}
          onBack={() => setCurrentScreen('inventory')}
        />
      )}

      {currentScreen === 'scan' && (
        <ScanPage onBack={() => setCurrentScreen('inventory')} />
      )}
    </div>
  );
}
