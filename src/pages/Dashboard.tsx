const Dashboard = () => {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Sistema de Control de Activos</h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
        <div className="card">Audiovisuales</div>
        <div className="card">Laboratorio</div>
        <div className="card">Kioskos</div>
      </div>
    </div>
  );
};

export default Dashboard;