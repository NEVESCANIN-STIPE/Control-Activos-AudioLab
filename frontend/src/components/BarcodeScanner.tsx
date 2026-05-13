import { Html5Qrcode } from "html5-qrcode";
import { useEffect } from "react";

type Props = {
  onScan: (code: string) => void;
};

export function BarcodeScanner({ onScan }: Props) {

  useEffect(() => {
    const scanner = new Html5Qrcode("reader");

    scanner.start(
      { facingMode: "environment" },
      {
        fps: 10,
        qrbox: 250,
      },
      (decodedText) => {
        console.log("Código:", decodedText);
        onScan(decodedText);
        scanner.stop(); // detener después de leer
      },
      (error) => {
        // ignorar errores normales de escaneo
      }
    );

    return () => {
      scanner.stop().catch(() => {});
    };
  }, []);

  return <div id="reader" style={{ width: "300px" }} />;
}