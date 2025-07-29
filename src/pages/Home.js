import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function Home() {
  const [activities, setActivities] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(true);

  // Load activities from localStorage
  useEffect(() => {
    const storedActivities = JSON.parse(localStorage.getItem("activities")) || [];
    setActivities(storedActivities);
  }, []);

  // Fetch next_sessions from Supabase
  useEffect(() => {
    const fetchSessions = async () => {
      const { data, error } = await supabase
        .from("next_sessions")
        .select("*")
        .order("date", { ascending: true });

      if (error) {
        console.error("Error fetching sessions:", error);
      } else {
        setSessions(data);
      }

      setLoadingSessions(false);
    };

    fetchSessions();
  }, []);

  return (
    <div style={styles.container}>
      <h1>Welcome to UATS</h1>
      <p>
        Umuganda Attendance & Fines Tracking System (UATS) helps local leaders and citizens
        manage attendance, fines, and participation in Umuganda.
      </p>

      <ul style={styles.features}>
        <li>View Umuganda schedules and info</li>
        <li>Local leader dashboard to mark attendance and assign fines</li>
        <li>Citizens can track their participation history</li>
      </ul>

      <Link to="/signup" style={styles.button}>Login/Signup with Google</Link>

      {/* Activities Section */}
      <div style={styles.activityContainer}>
        <h2>Recent Community Activities</h2>
        {activities.length === 0 ? (
          <p>No activities recorded yet.</p>
        ) : (
          <ul style={styles.activityList}>
            {activities.map((act, index) => (
              <li key={index} style={styles.activityItem}>
                <h3>{act.location}</h3>
                <p><strong>Date:</strong> {act.date}</p>
                <p><strong>Description:</strong> {act.description}</p>
                {act.image_url && (
                  <img
                    src={act.image_url}
                    alt="activity"
                    style={{ width: "100%", maxWidth: "300px", borderRadius: "8px", marginTop: "10px" }}
                  />
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Next Umuganda Sessions */}
      <div style={styles.activityContainer}>
        <h2>Upcoming Umuganda Sessions</h2>
        {loadingSessions ? (
          <p>Loading sessions...</p>
        ) : sessions.length === 0 ? (
          <p>No sessions scheduled yet.</p>
        ) : (
          <ul style={styles.activityList}>
            {sessions.map((session, index) => (
              <li key={index} style={styles.activityItem}>
                <h3>{session.location}</h3>
                <p><strong>Day:</strong> {session.day}</p>
                <p><strong>Date:</strong> {session.date}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "100px 40px",
    fontFamily: "sans-serif",
    maxWidth: "800px",
    margin: "auto"
  },
  features: {
    padding: "20px 0",
    listStyle: "none"
  },
  button: {
    marginTop: "20px",
    display: "inline-block",
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "#fff",
    textDecoration: "none",
    borderRadius: "5px"
  },
  activityContainer: {
    marginTop: "60px"
  },
  activityList: {
    listStyle: "none",
    paddingLeft: "0"
  },
  activityItem: {
    backgroundColor: "#f9f9f9",
    marginBottom: "20px",
    padding: "15px",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
  }
};
