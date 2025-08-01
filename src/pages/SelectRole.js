import { useNavigate } from "react-router-dom";

export default function SelectRole() {
  const navigate = useNavigate();

  const handleSelect = (role) => {
    localStorage.setItem("role", role); // Store role temporarily
    navigate("/auth"); // Send user to Google login page
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Select Your Role</h2>
      <p>Choose the role you belong to:</p>
      <button onClick={() => handleSelect("citizen")}>Citizen</button>
      <button onClick={() => handleSelect("local")}>Local Leader</button>
      <button onClick={() => handleSelect("sector")}>Sector Official</button>
    </div>
  );
}
