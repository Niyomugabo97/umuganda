import { Link } from "react-router-dom";

export default function Join() {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Join Umuganda Platform</h2>
      <p>Choose your action</p>
      <Link to="/join/select-role">
        <button>Login / Signup</button>
      </Link>
    </div>
  );
}
