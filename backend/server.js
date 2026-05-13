import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Mongo conectado"))
  .catch(err => console.log("❌ Error Mongo:", err));

// Modelo
const AssetSchema = new mongoose.Schema({
  code: String,
  name: String,
  location: String,
  technician: String,
  category: String,
  description: String,
  department: String,
  technicalState: String,
  serialNumber: String,
  model: String,
  image: String,
  createdAt: { type: Date, default: Date.now }
});

const Asset = mongoose.model("Asset", AssetSchema);


// 🔹 RUTAS

// Crear
app.post("/assets", async (req, res) => {
  try {
    const asset = new Asset(req.body);
    await asset.save();
    res.json(asset);
  } catch (error) {
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

// Servidor
app.listen(3000, () => {
  console.log("🚀 Servidor en http://localhost:3000");
});