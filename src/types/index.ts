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