import mongoose from "mongoose";
import xlsx from "xlsx";
import dotenv from "dotenv";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

// Modelo actualizado
const AssetSchema = new mongoose.Schema({
  code: String,
  name: String,
  description: String,
  location: String,
  department: String,
  serialNumber: String,
  model: String,
  technicalState: { type: String, default: "Operativo" },
  createdAt: { type: Date, default: Date.now },
});

const Asset = mongoose.model("assets", AssetSchema);

// Leer Excel
const workbook = xlsx.readFile("./Activos Febrero 2026.xlsx");
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const data = xlsx.utils.sheet_to_json(sheet);

console.log("Datos leídos:", data.length);
console.log("DB:", mongoose.connection.name);

// 🔁 MAPEO REAL (según tu Excel)
const mappedData = data.map((row) => ({
  code: String(row["Activo"] || ""),
  name: row["Descripcion"] || "",
  description: row["Caracteristicas"] || "",
  location: row["Area"] || "",
  department: String(row["Edificio"] || ""),
  serialNumber: row["Número de Serie"] || "",
  model: row["Modelo"] || "",
  technicalState: "Operativo",
}));

// Limpiar antes de insertar (opcional pero recomendado)
await Asset.deleteMany({});

// Insertar
await Asset.insertMany(mappedData);

console.log("✅ Datos importados correctamente");

process.exit();