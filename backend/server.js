import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Mongo conectado"))
  .catch(err => console.log(err));

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
  image: String,
  createdAt: { type: Date, default: Date.now }
});

const Asset = mongoose.model("Asset", AssetSchema);


// 🔹 RUTAS

// Crear
app.post("/assets", async (req, res) => {
  const asset = new Asset(req.body);
  await asset.save();
  res.json(asset);
});

// Obtener
app.get("/assets", async (req, res) => {
  const assets = await Asset.find();
  res.json(assets);
});

// Actualizar
app.put("/assets/:id", async (req, res) => {
  const updated = await Asset.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

// Eliminar
app.delete("/assets/:id", async (req, res) => {
  await Asset.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

app.listen(3000, () => console.log("Servidor en http://localhost:3000"));