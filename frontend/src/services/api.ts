const API_URL = "http://localhost:3000";

export const getAssets = async () => {
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
  await fetch(`${API_URL}/assets/${id}`, {
    method: "DELETE",
  });
};