import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Middlewares
// ALLOWED_ORIGINS: lista separada por comas de dominios permitidos
// (ej: https://tu-app.vercel.app,http://localhost:5173)
// Si no se define, se permite cualquier origen (útil mientras desarrollas).
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map(o => o.trim())
  : null;

app.use(cors({
  origin: allowedOrigins || true,
}));
app.use(express.json({ limit: "5mb" })); // límite mayor por las fotos en base64

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Mongo conectado"))
  .catch(err => console.log("❌ Error Mongo:", err));

// Ruta de salud: para probar que el backend está vivo desde el navegador
// o para que Render/Railway verifiquen que el servicio responde.
app.get("/", (req, res) => {
  res.json({ ok: true, service: "control-activos-api" });
});

// Modelo
const AssetSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, trim: true },
  name: String,
  description: String,
  features: String,

  serialNumber: String,
  model: String,

  area: String,
  building: String,

  // Campos usados en los formularios de Registro Manual / Edición (Figma)
  location: String,
  technician: String,
  department: String,
  image: String, // foto en base64 (opcional)

  category: String, // importante para filtros
  technicalState: {
    type: String,
    default: "Operativo"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Asset = mongoose.model("Asset", AssetSchema);

// Modelo de Estados Técnicos (catálogo)
const TechnicalStateSchema = new mongoose.Schema({
  state: { type: String, required: true },
  technician: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const TechnicalState = mongoose.model("TechnicalState", TechnicalStateSchema);


// 🔹 RUTAS

// Crear
app.post("/assets", async (req, res) => {
  try {
    const asset = new Asset(req.body);
    await asset.save();
    res.status(201).json(asset);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ error: "Ya existe un activo con ese código" });
    }
    res.status(500).json({ error: "Error al crear activo" });
  }
});

// Obtener todos
app.get("/assets", async (req, res) => {
  try {
    const assets = await Asset.find().sort({ createdAt: -1 });
    res.json(assets);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener activos" });
  }
});

// 🔍 Obtener por código (IMPORTANTE para escáner)
app.get("/assets/code/:code", async (req, res) => {
  try {
    const asset = await Asset.findOne({ code: req.params.code });

    if (!asset) {
      return res.status(404).json({ message: "Activo no encontrado" });
    }

    res.json(asset);
  } catch (error) {
    res.status(500).json({ error: "Error en búsqueda" });
  }
});

// Actualizar
app.put("/assets/:id", async (req, res) => {
  try {
    const updated = await Asset.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar" });
  }
});

// Eliminar
app.delete("/assets/:id", async (req, res) => {
  try {
    await Asset.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar" });
  }
});

// 🔹 RUTAS - Estados Técnicos (catálogo)

// Obtener todos
app.get("/technical-states", async (req, res) => {
  try {
    const states = await TechnicalState.find().sort({ createdAt: -1 });
    res.json(states);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener estados técnicos" });
  }
});

// Crear
app.post("/technical-states", async (req, res) => {
  try {
    const state = new TechnicalState(req.body);
    await state.save();
    res.status(201).json(state);
  } catch (error) {
    res.status(500).json({ error: "Error al crear estado técnico" });
  }
});

// Eliminar
app.delete("/technical-states/:id", async (req, res) => {
  try {
    await TechnicalState.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar estado técnico" });
  }
});

// Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor en http://localhost:${PORT}`);
});