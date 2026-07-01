import type { Asset, TechnicalState } from "../types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

class ApiError extends Error {}

async function request(path: string, options?: RequestInit) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  let body: any = null;
  try {
    body = await res.json();
  } catch {
    // respuesta sin cuerpo
  }

  if (!res.ok) {
    const message = body?.error || body?.message || `Error ${res.status}`;
    throw new ApiError(message);
  }

  return body;
}

function normalizeAsset(raw: any): Asset {
  return {
    id: raw._id ?? raw.id,
    code: raw.code ?? "",
    name: raw.name ?? "",
    description: raw.description ?? "",
    features: raw.features ?? "",
    serialNumber: raw.serialNumber ?? "",
    model: raw.model ?? "",
    area: raw.area ?? "",
    building: raw.building ?? "",
    location: raw.location ?? "",
    technician: raw.technician ?? "",
    department: raw.department ?? "",
    image: raw.image ?? "",
    category: raw.category ?? "",
    technicalState: raw.technicalState ?? "Operativo",
    createdAt: raw.createdAt ? new Date(raw.createdAt) : new Date(),
  };
}

function normalizeTechnicalState(raw: any): TechnicalState {
  return {
    id: raw._id ?? raw.id,
    state: raw.state ?? "",
    technician: raw.technician ?? "",
  };
}

// ---------- Activos ----------

export const getAssets = async (): Promise<Asset[]> => {
  const data = await request("/assets");
  return data.map(normalizeAsset);
};

export const getAssetByCode = async (code: string): Promise<Asset> => {
  const data = await request(`/assets/code/${encodeURIComponent(code)}`);
  return normalizeAsset(data);
};

export const createAsset = async (
  data: Omit<Asset, "id" | "createdAt">
): Promise<Asset> => {
  const created = await request("/assets", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return normalizeAsset(created);
};

export const updateAsset = async (
  id: string,
  data: Partial<Asset>
): Promise<Asset> => {
  const updated = await request(`/assets/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return normalizeAsset(updated);
};

export const deleteAsset = async (id: string): Promise<void> => {
  await request(`/assets/${id}`, { method: "DELETE" });
};

// ---------- Estados Técnicos ----------

export const getTechnicalStates = async (): Promise<TechnicalState[]> => {
  const data = await request("/technical-states");
  return data.map(normalizeTechnicalState);
};

export const createTechnicalState = async (
  data: Omit<TechnicalState, "id">
): Promise<TechnicalState> => {
  const created = await request("/technical-states", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return normalizeTechnicalState(created);
};