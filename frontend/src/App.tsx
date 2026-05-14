import { useState } from 'react';
import { Home } from './components/Home';
import { Inventory } from './components/Inventory';
import { ManualRegistration } from './components/ManualRegistration';
import { EditAsset } from './components/EditAsset';
import { TechnicalStates } from './components/TechnicalStates';
import { FixedAssets } from './components/FixedAssets';
import { AssetHistory } from './components/AssetHistory';
import { useEffect } from "react";
import { getAssets } from "./services/api";
import './styles/globals.css';
import { ScanPage } from "./pages/ScanPage";

export type Asset = {
  id: string;
  code: string;
  description?: string;
  features?: string;
  serialNumber?: string;
  model?: string;
  area?: string;
  building?: string;
  category: string;
  technicalState?: string;
  createdAt: Date;  
};

export type TechnicalState = {
  id: string;
  state: string;
  technician: string;
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'home' | 'inventory' | 'manual-registration' | 'edit-asset' | 'technical-states' | 'fixed-assets' | 'history' | 'scan'>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [assets, setAssets] = useState<Asset[]>([
      // datos de prueba
   
  ]);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [technicalStates, setTechnicalStates] = useState<TechnicalState[]>([
    
  ]);

 useEffect(() => {
  const loadAssets = async () => {
    try {
      const data = await getAssets();

      // 🔁 convertir _id → id
      const mapped = data.map((item: any) => ({
  id: item._id,
  code: item.code || "",
  description: item.description || "",
  features: item.features || "",
  serialNumber: item.serialNumber || "",
  model: item.model || "",
  area: item.area || "",
  building: item.building || "",
  category: item.category || "",
  technicalState: item.technicalState || "Operativo",
  createdAt: item.createdAt,
}));

      setAssets(mapped);
    } catch (error) {
      console.error("Error cargando activos:", error);
    }
  };

  loadAssets();
}, []);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setCurrentScreen('inventory');
  };

  const handleAddAsset = (asset: Omit<Asset, 'id' | 'createdAt'>) => {
    const newAsset: Asset = {
      ...asset,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setAssets([...assets, newAsset]);
  };

  const handleUpdateAsset = (updatedAsset: Asset) => {
    setAssets(assets.map(asset => asset.id === updatedAsset.id ? updatedAsset : asset));
  };

  const handleDeleteAsset = (assetId: string) => {
    setAssets(assets.filter(asset => asset.id !== assetId));
  };

  const handleEditAsset = (asset: Asset) => {
    setSelectedAsset(asset);
    setCurrentScreen('edit-asset');
  };

  const handleAddTechnicalState = (state: Omit<TechnicalState, 'id'>) => {
    const newState: TechnicalState = {
      ...state,
      id: Date.now().toString(),
    };
    setTechnicalStates([...technicalStates, newState]);
  };

 const filteredAssets = selectedCategory
  ? assets.filter(
      asset =>
        asset.category?.toLowerCase().trim() ===
        selectedCategory.toLowerCase().trim()
    )
  : assets;

  return (
    <div className="min-h-screen bg-gray-50">
      {currentScreen === 'home' && (
        <Home onCategorySelect={handleCategorySelect} />
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
          assets={assets.filter(asset => asset.category === 'Activos Fijos')}
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
        <ScanPage onBack={() => setCurrentScreen('inventory')}
        />
      )}
    </div>
  );
}