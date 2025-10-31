import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import "./Home.css";
import umugandaImage from "../assets/umuganda.jpg"; // ✅ Correct image import

export default function Home() {
  const [activities, setActivities] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(true);

  useEffect(() => {
    const storedActivities = JSON.parse(localStorage.getItem("activities")) || [];
    setActivities(storedActivities);
  }, []);

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
    <div className="home-container">
      {/* ✅ Landing Image */}
      <div className="landing-section">
        <img src={umugandaImage} alt="Umuganda community activity" className="landing-image" />
        <div className="overlay">
          <h1>Welcome to UATS</h1>
          <p>
            Umuganda Attendance & Fines Tracking System (UATS) helps local leaders and citizens
            manage attendance, fines, and participation in Umuganda.
          </p>
          <Link to="/signup" className="primary-button">Login / Signup</Link>
        </div>
      </div>

      <ul className="features">
        <li>View Umuganda schedules and info</li>
        <li>Local leader dashboard to mark attendance and assign fines</li>
        <li>Citizens can track their participation history</li>
      </ul>

      <div className="activity-container">
        <h2>Recent Community Activities</h2>
        {activities.length === 0 ? (
          <p>No activities recorded yet.</p>
        ) : (
          <ul className="activity-list">
            {activities.map((act, index) => (
              <li key={index} className="activity-item">
                <h3>{act.location}</h3>
                <p><strong>Date:</strong> {act.date}</p>
                <p><strong>Description:</strong> {act.description}</p>
                {act.image_url && (
                  <img src={act.image_url} alt="activity" className="activity-image" />
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="activity-container">
        <h2>Upcoming Umuganda Sessions</h2>
        {loadingSessions ? (
          <p>Loading sessions...</p>
        ) : sessions.length === 0 ? (
          <p>No sessions scheduled yet.</p>
        ) : (
          <ul className="activity-list">
            {sessions.map((session, index) => (
              <li key={index} className="activity-item">
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
