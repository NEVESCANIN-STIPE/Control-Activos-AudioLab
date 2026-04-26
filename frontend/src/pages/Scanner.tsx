import { Html5Qrcode } from "html5-qrcode";
import { useEffect, useState } from "react";

const Scanner = () => {
  const [codigo, setCodigo] = useState("");

  useEffect(() => {
    const scanner = new Html5Qrcode("reader");

    scanner.start(
      { facingMode: "environment" },
      { fps: 10, qrbox: 250 },
      (decodedText) => {
        setCodigo(decodedText);
        console.log("Código:", decodedText);
      },
      () => {}
    );

    return () => {
      scanner.stop().catch(() => {});
    };
  }, []);

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>📷 Escáner de Activos</h1>

      {/* Cámara */}
      <div
        id="reader"
        style={{
          width: "300px",
          margin: "20px auto",
          border: "2px solid #ccc",
          borderRadius: "10px",
          padding: "10px",
        }}
      />

      {/* Resultado */}
      <div style={{ marginTop: "20px" }}>
        <h3>Resultado:</h3>
        <p style={{ fontSize: "18px", fontWeight: "bold" }}>
          {codigo || "Escanea un código..."}
        </p>
      </div>
    </div>
  );
};

export default Scanner;