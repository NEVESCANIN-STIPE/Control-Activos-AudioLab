import { useState } from 'react';
import { ArrowLeft, Camera, Check } from 'lucide-react';
import type{ Asset, TechnicalState } from '../types';
import { ConfirmDialog } from './ConfirmDialog';
import { SuccessDialog } from './SuccessDialog';

type ManualRegistrationProps = {
  category: string;
  onBack: () => void;
  onAddAsset: (asset: Omit<Asset, 'id' | 'createdAt'>) => void;
  technicalStates: TechnicalState[];
};

export function ManualRegistration({ category, onBack, onAddAsset, technicalStates }: ManualRegistrationProps) {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    location: '',
    technician: '',
    description: '',
    department: '',
    technicalState: 'Operativo',
    image: '',
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

  const handleConfirmRegistration = () => {
    onAddAsset({
      ...formData,
      category,
    });
    setShowConfirm(false);
    setShowSuccess(true);
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    setFormData({
      code: '',
      name: '',
      location: '',
      technician: '',
      description: '',
      department: '',
      technicalState: 'Operativo',
      image: '',
    });
    onBack();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-green-600 text-white p-6 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-2 mb-4 hover:bg-green-700 px-3 py-2 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver al Inventario
          </button>
          <h1 className="mb-1">Registro Manual de Activo</h1>
          <p className="text-green-100">Categoría: {category}</p>
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
                  placeholder="Ej: AUD-001"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
                  placeholder="Ej: Proyector Epson"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
                  placeholder="Ej: Sala de conferencias A"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
                  placeholder="Ej: Carlos Mendoza"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
                  placeholder="Ej: Administración"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
                  placeholder="Descripción detallada del activo..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
                    Tomar Foto
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
                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md"
              >
                <Check className="w-5 h-5" />
                Registrar Activo
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirm && (
        <ConfirmDialog
          title="¿Está seguro de realizar el registro?"
          message="Se agregará el activo al inventario con los datos proporcionados."
          onConfirm={handleConfirmRegistration}
          onCancel={() => setShowConfirm(false)}
          confirmText="Confirmar"
          cancelText="Cancelar"
        />
      )}

      {/* Success Dialog */}
      {showSuccess && (
        <SuccessDialog
          message="El activo ha sido agregado con éxito"
          onClose={handleSuccessClose}
        />
      )}
    </div>
  );
}