import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map(o => o.trim())
  : null;

app.use(cors({ origin: allowedOrigins || true }));
app.use(express.json({ limit: "5mb" }));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Mongo conectado"))
  .catch(err => console.log("❌ Error Mongo:", err));

app.get("/", (req, res) => {
  res.json({ ok: true, service: "control-activos-api" });
});

// ── Modelos ──────────────────────────────────────────────────────────────────

const AssetSchema = new mongoose.Schema({
  code:         { type: String, required: true, unique: true, trim: true },
  name:         String,
  description:  String,
  features:     String,
  serialNumber: String,
  model:        String,
  area:         String,
  building:     String,
  location:     String,
  technician:   String,
  department:   String,
  image:        String,
  category:     String,
  technicalState: { type: String, default: "Operativo" },
  createdAt:    { type: Date, default: Date.now }
});

const Asset = mongoose.model("Asset", AssetSchema);

const TechnicalStateSchema = new mongoose.Schema({
  state:      { type: String, required: true },
  technician: { type: String, required: true },
  createdAt:  { type: Date, default: Date.now }
});

const TechnicalState = mongoose.model("TechnicalState", TechnicalStateSchema);

// ── Rutas - Activos ───────────────────────────────────────────────────────────

app.post("/assets", async (req, res) => {
  try {
    const asset = new Asset(req.body);
    await asset.save();
    res.status(201).json(asset);
  } catch (error) {
    if (error.code === 11000)
      return res.status(409).json({ error: "Ya existe un activo con ese código" });
    res.status(500).json({ error: "Error al crear activo" });
  }
});

app.get("/assets", async (req, res) => {
  try {
    const assets = await Asset.find().sort({ createdAt: -1 });
    res.json(assets);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener activos" });
  }
});

app.get("/assets/code/:code", async (req, res) => {
  try {
    const asset = await Asset.findOne({ code: req.params.code });
    if (!asset) return res.status(404).json({ message: "Activo no encontrado" });
    res.json(asset);
  } catch (error) {
    res.status(500).json({ error: "Error en búsqueda" });
  }
});

app.put("/assets/:id", async (req, res) => {
  try {
    const updated = await Asset.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar" });
  }
});

app.delete("/assets/:id", async (req, res) => {
  try {
    await Asset.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar" });
  }
});

// 📥 Importar desde Excel (JSON parseado por el frontend con SheetJS)
app.post("/assets/import", async (req, res) => {
  try {
    const rows = req.body;
    if (!Array.isArray(rows) || rows.length === 0)
      return res.status(400).json({ error: "No se recibieron datos válidos" });

    const result = await Asset.insertMany(rows, { ordered: false });
    res.status(201).json({ inserted: result.length, total: rows.length });
  } catch (error) {
    const inserted = error.insertedDocs?.length ?? error.result?.nInserted ?? 0;
    const total = req.body?.length ?? 0;
    res.status(207).json({
      inserted,
      total,
      message: `Se importaron ${inserted} activos. ${total - inserted} duplicados omitidos.`,
    });
  }
});

// 📤 Exportar a Excel — devuelve JSON plano que el frontend convierte a .xlsx
app.get("/assets/export", async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const assets = await Asset.find(filter).sort({ code: 1 }).lean();

    const rows = assets.map(a => ({
      Codigo:            a.code           || "",
      Descripcion:       a.description    || "",
      Caracteristicas:   a.features       || "",
      "N° Serie":        a.serialNumber   || "",
      Modelo:            a.model          || "",
      Area:              a.area           || "",
      Edificio:          a.building       || "",
      Categoria:         a.category       || "",
      "Estado Tecnico":  a.technicalState || "",
      "Fecha Registro":  a.createdAt
        ? new Date(a.createdAt).toLocaleDateString("es-MX")
        : "",
    }));

    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Error al exportar activos" });
  }
});

// ── Rutas - Estados Técnicos ──────────────────────────────────────────────────

app.get("/technical-states", async (req, res) => {
  try {
    const states = await TechnicalState.find().sort({ createdAt: -1 });
    res.json(states);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener estados técnicos" });
  }
});

app.post("/technical-states", async (req, res) => {
  try {
    const state = new TechnicalState(req.body);
    await state.save();
    res.status(201).json(state);
  } catch (error) {
    res.status(500).json({ error: "Error al crear estado técnico" });
  }
});

app.put("/technical-states/:id", async (req, res) => {
  try {
    const updated = await TechnicalState.findByIdAndUpdate(
      req.params.id, req.body, { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Estado técnico no encontrado" });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar estado técnico" });
  }
});

app.delete("/technical-states/:id", async (req, res) => {
  try {
    await TechnicalState.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar estado técnico" });
  }
});

// ── Servidor ──────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor en http://localhost:${PORT}`);
});