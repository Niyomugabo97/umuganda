

import { Link } from "react-router-dom";

export default function Join() {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Join Umuganda Platform</h2>
      <p>Choose your action</p>
      <Link to="/signup"><button>login/Signup</button></Link>
      {/* ndashaka ko when user clicks on login/signup button   this navbar.js ifite izi codes izahita igaragara:*/}
    </div>
  );
}
