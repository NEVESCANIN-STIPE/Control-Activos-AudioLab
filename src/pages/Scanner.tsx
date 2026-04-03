import { Html5Qrcode } from "html5-qrcode";
import { useEffect } from "react";

const Scanner = () => {
  useEffect(() => {
    const scanner = new Html5Qrcode("reader");
let escaneado = false;

scanner.start(
  { facingMode: "environment" },
  { fps: 10, qrbox: 250 },
  (decodedText) => {
    if (!escaneado) {
      escaneado = true;
      console.log("Código:", decodedText);
    }
  },
  () => {}
);

    return () => {
      scanner.stop();
    };
  }, []);

  return <div id="reader" style={{ width: "300px" }} />;
};

export default Scanner;