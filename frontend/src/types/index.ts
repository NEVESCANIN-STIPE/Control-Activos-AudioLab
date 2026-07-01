// Tipo único de Activo usado en todo el frontend.
// Debe coincidir con el esquema de Mongo en backend/server.js
export type Asset = {
  id: string;
  code: string;
  name?: string;
  description?: string;
  features?: string;
  serialNumber?: string;
  model?: string;
  area?: string;
  building?: string;

  // Campos del formulario de registro/edición (diseño Figma)
  location?: string;
  technician?: string;
  department?: string;
  image?: string;

  category: string;
  technicalState?: string;
  createdAt: Date;
};

export type TechnicalState = {
  id: string;
  state: string;
  technician: string;
};