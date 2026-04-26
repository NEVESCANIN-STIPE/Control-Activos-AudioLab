import { useState } from 'react';
import { ArrowLeft, Camera, Check } from 'lucide-react';
import type{ Asset, TechnicalState } from '../types';
import { ConfirmDialog } from './ConfirmDialog';
import { SuccessDialog } from './SuccessDialog';

type EditAssetProps = {
  asset: Asset;
  onBack: () => void;
  onUpdateAsset: (asset: Asset) => void;
  technicalStates: TechnicalState[];
};

export function EditAsset({ asset, onBack, onUpdateAsset, technicalStates }: EditAssetProps) {
  const [formData, setFormData] = useState({
    code: asset.code,
    name: asset.name,
    location: asset.location,
    technician: asset.technician,
    description: asset.description || '',
    department: asset.department || '',
    technicalState: asset.technicalState || 'Operativo',
    image: asset.image || '',
  });

  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          image: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  const handleConfirmUpdate = () => {
    onUpdateAsset({
      ...asset,
      ...formData,
    });
    setShowConfirm(false);
    setShowSuccess(true);
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    onBack();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-600 text-white p-6 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-2 mb-4 hover:bg-blue-700 px-3 py-2 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver al Inventario
          </button>
          <h1 className="mb-1">Editar Activo</h1>
          <p className="text-blue-100">Código: {asset.code}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Código del Activo */}
              <div>
                <label htmlFor="code" className="block text-gray-700 mb-2">
                  Código del Activo *
                </label>
                <input
                  type="text"
                  id="code"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Nombre del Artículo */}
              <div>
                <label htmlFor="name" className="block text-gray-700 mb-2">
                  Nombre del Artículo *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Localización */}
              <div>
                <label htmlFor="location" className="block text-gray-700 mb-2">
                  Localización *
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Nombre del Técnico */}
              <div>
                <label htmlFor="technician" className="block text-gray-700 mb-2">
                  Nombre del Técnico Responsable *
                </label>
                <input
                  type="text"
                  id="technician"
                  name="technician"
                  value={formData.technician}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Departamento */}
              <div>
                <label htmlFor="department" className="block text-gray-700 mb-2">
                  Departamento/Sucursal
                </label>
                <input
                  type="text"
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Estado Técnico */}
              <div>
                <label htmlFor="technicalState" className="block text-gray-700 mb-2">
                  Estado Técnico
                </label>
                <select
                  id="technicalState"
                  name="technicalState"
                  value={formData.technicalState}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {technicalStates.map(state => (
                    <option key={state.id} value={state.state}>
                      {state.state}
                    </option>
                  ))}
                </select>
              </div>

              {/* Descripción */}
              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Fotografía */}
              <div className="md:col-span-2">
                <label className="block text-gray-700 mb-2">
                  Fotografía del Activo
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer transition-colors">
                    <Camera className="w-5 h-5" />
                    Actualizar Foto
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                  {formData.image && (
                    <div className="relative">
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="w-20 h-20 object-cover rounded-lg border-2 border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, image: '' })}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
              >
                <Check className="w-5 h-5" />
                Guardar Cambios
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirm && (
        <ConfirmDialog
          title="¿Está seguro de guardar los cambios?"
          message="Se actualizará la información del activo."
          onConfirm={handleConfirmUpdate}
          onCancel={() => setShowConfirm(false)}
          confirmText="Guardar"
          cancelText="Cancelar"
        />
      )}

      {/* Success Dialog */}
      {showSuccess && (
        <SuccessDialog
          message="Los cambios han sido guardados con éxito"
          onClose={handleSuccessClose}
        />
      )}
    </div>
  );
}