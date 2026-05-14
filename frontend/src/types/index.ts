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