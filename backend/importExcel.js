import mongoose from "mongoose";
import xlsx from "xlsx";
import dotenv from "dotenv";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

// 🔥 MISMO SCHEMA que en server.js
const AssetSchema = new mongoose.Schema({
  code: String,
  name: String,
  description: String,
  features: String,
  serialNumber: String,
  model: String,
  area: String,
  building: String,
  category: String,
  technicalState: { type: String, default: "Operativo" },
  createdAt: { type: Date, default: Date.now },
});

// MISMO nombre que server
const Asset = mongoose.model("Asset", AssetSchema);

// Leer Excel
const workbook = xlsx.readFile("./Activos Febrero 2026.xlsx");
const sheet = workbook.Sheets[workbook.SheetNames[0]];

// ESTE ES EL ORIGINAL
const sheetData = xlsx.utils.sheet_to_json(sheet, {
  header: [
    "Activo",
    "Descripcion",
    "Caracteristicas",
    "Número de Serie",
    "Modelo",
    "Area",
    "Edificio"
  ],
  range: 4
});

console.log("Datos leídos:", sheetData.length);
console.log("DB:", mongoose.connection.name);
console.log("Primer registro:", sheetData[0]);

// MAPEO CORRECTO
const mappedData = sheetData.map((row) => ({
  code: String(row["Activo"]).trim(),
  name: String(row["Activo"]).trim(),
  description: String(row["Descripcion"] || "").trim(),
  features: String(row["Caracteristicas"] || "").trim(),
  serialNumber: String(row["Número de Serie"] || "").trim(),
  model: String(row["Modelo"] || "").trim(),
  area: String(row["Area"] || "").trim(),
  building: String(row["Edificio"] || "").trim(),
  category: detectCategory(row),
  technicalState: "Operativo"
}));

function detectCategory(row) {
  const area = String(row["Area"] || "").toLowerCase();
  const building = String(row["Edificio"] || "").toLowerCase();
  const name = String(row["Activo"] || "").toLowerCase();

  if (area.includes("lab")) {
    return "Laboratorios";
  }

  if (area.includes("almacen")) {
    return "Almacen-laboratorios";
  }

  if (area.includes("oficina")) {
    return "Oficina Rab-Lav";
  }

  if (building.includes("cei")) {
    return "Almacen(CEI)";
  }

  return "Audiovisuales";
}
// limpiar colección
await Asset.deleteMany({});

// insertar
await Asset.insertMany(mappedData);

console.log("✅ Datos importados correctamente");

process.exit();