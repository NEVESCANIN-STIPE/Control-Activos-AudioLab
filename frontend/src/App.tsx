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

export type Asset = {
  id: string;
  code: string;
  name: string;
  location: string;
  technician: string;
  category: string;
  image?: string;
  description?: string;
  department?: string;
  technicalState?: string;
  createdAt: Date;
};

export type TechnicalState = {
  id: string;
  state: string;
  technician: string;
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'home' | 'inventory' | 'manual-registration' | 'edit-asset' | 'technical-states' | 'fixed-assets' | 'history'>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [assets, setAssets] = useState<Asset[]>([
    {
      id: '1',
      code: 'AUD-001',
      name: 'Proyector Epson',
      location: 'Sala de conferencias A',
      technician: 'Carlos Mendoza',
      category: 'Audiovisuales',
      description: 'Proyector HD 1080p',
      department: 'Administración',
      technicalState: 'Operativo',
      createdAt: new Date('2024-01-15'),
    },
    {
      id: '2',
      code: 'LAB-045',
      name: 'Microscopio Digital',
      location: 'Laboratorio 3',
      technician: 'Ana García',
      category: 'Laboratorio',
      description: 'Microscopio con cámara integrada',
      department: 'Ciencias',
      technicalState: 'En mantenimiento',
      createdAt: new Date('2024-02-20'),
    },
    {
      id: '3',
      code: 'KIO-012',
      name: 'Tablet Samsung',
      location: 'Kiosko Principal',
      technician: 'Roberto Silva',
      category: 'Kioskos',
      description: 'Tablet 10" para consultas',
      department: 'Recepción',
      technicalState: 'Operativo',
      createdAt: new Date('2024-03-10'),
    },
  ]);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [technicalStates, setTechnicalStates] = useState<TechnicalState[]>([
    { id: '1', state: 'Operativo', technician: 'Carlos Mendoza' },
    { id: '2', state: 'En mantenimiento', technician: 'Ana García' },
    { id: '3', state: 'Fuera de servicio', technician: 'Roberto Silva' },
  ]);

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
    ? assets.filter(asset => asset.category === selectedCategory)
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
    </div>
  );
}