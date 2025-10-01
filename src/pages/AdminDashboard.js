import { useState } from "react";
import LocalLeaderDashboard from "./LocalLeaderDashboard";
import SectorOfficials from "./SectorDashboard";
import AttendanceForm from "../components/admin/AttendanceForm";
import AbsenteeForm from "../components/admin/AbsenteeForm";
import CommunityActivityForm from "../components/admin/CommunityActivityForm";
import NextSessionForm from "../components/admin/NextSessionForm";

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
          User Information
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
          Performance
        </button>
        <button
          onClick={() => setActiveTab("forms")}
          style={{
            padding: "8px 12px",
            borderRadius: 6,
            border: "1px solid #ccc",
            background: activeTab === "forms" ? "#4CAF50" : "#fff",
            color: activeTab === "forms" ? "#fff" : "#333",
            cursor: "pointer",
          }}
        >
          Recorging Forms 
        </button>
      </div>

      <div>
        {activeTab === "local" && <LocalLeaderDashboard />}
        {activeTab === "sector" && <SectorOfficials />}
        {activeTab === "forms" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>
            <AttendanceForm />
            <AbsenteeForm />
            <CommunityActivityForm />
            <NextSessionForm />
          </div>
        )}
      </div>
    </div>
  );
}
