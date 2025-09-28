import { useState } from "react";
import LocalLeaderDashboard from "./LocalLeaderDashboard";
import SectorOfficials from "./SectorDashboard";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("local");

  return (
    <div style={{ padding: "16px" }}>
      <h2 style={{ fontWeight: 700, marginBottom: 16 }}>Admin Control Panel</h2>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <button
          onClick={() => setActiveTab("local")}
          style={{
            padding: "8px 12px",
            borderRadius: 6,
            border: "1px solid #ccc",
            background: activeTab === "local" ? "#4CAF50" : "#fff",
            color: activeTab === "local" ? "#fff" : "#333",
            cursor: "pointer",
          }}
        >
          Local Leader
        </button>
        <button
          onClick={() => setActiveTab("sector")}
          style={{
            padding: "8px 12px",
            borderRadius: 6,
            border: "1px solid #ccc",
            background: activeTab === "sector" ? "#4CAF50" : "#fff",
            color: activeTab === "sector" ? "#fff" : "#333",
            cursor: "pointer",
          }}
        >
          Sector Dashboard
        </button>
      </div>

      <div>
        {activeTab === "local" ? <LocalLeaderDashboard /> : <SectorOfficials />}
      </div>
    </div>
  );
}
