import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div style={styles.container}>
      <h1>Welcome to UATS</h1>
      <p>
        Umuganda Attendance & Fines Tracking System (UATS) helps local leaders and citizens
        manage attendance, fines, and participation in Umuganda.
      </p>

      <ul style={styles.features}>
        <li> View Umuganda schedules and info</li>
        <li> Local leader dashboard to mark attendance and assign fines</li>
        <li> Citizens can track their participation history</li>
      </ul>

      <Link to="/login" style={styles.button}>Login / Signup</Link>
    </div>
  );
}

const styles = {
  container: {
    padding: "100px",
    textAlign: "left",     
    fontFamily: "sans-serif",
    maxWidth: "700px",      
    marginLeft: "40px"      
  },
  features: {
    padding: "40px",
    listStyle: "none"
  },
  button: {
    marginTop: "20px",
    display: "inline-block",
    padding: "10px 20px",
    backgroundColor: " #007bff",
    color: "#fff",
    textDecoration: "none",
    borderRadius: "5px"
  }
};
