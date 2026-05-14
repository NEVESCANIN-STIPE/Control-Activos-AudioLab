import type { Asset } from "../App";

const API_URL = "http://localhost:3000";

export const getAssets = async (): Promise<Asset[]> => {
  const res = await fetch(`${API_URL}/assets`);
  return res.json();
};

export const createAsset = async (data: any) => {
  const res = await fetch(`${API_URL}/assets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const updateAsset = async (id: string, data: any) => {
  const res = await fetch(`${API_URL}/assets/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const deleteAsset = async (id: string) => {
  const res = await fetch(`${API_URL}/assets/${id}`, {
    method: "DELETE",
  });
  return res.json(); // 👈 para confirmar respuesta
};

export const getAssetByCode = async (code: string) => {
  const res = await fetch(`http://localhost:3000/assets/code/${code}`);
  return res.json();
};