import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import "./Home.css";

// ✅ Import your Umuganda images
import img1 from "../assets/umuganda1.jpg";
import img2 from "../assets/umuganda2.jpg";
import img3 from "../assets/umuganda3.jpg";

export default function Home() {
  const [activities, setActivities] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(true);

  // ✅ Images for carousel
  const images = [img1, img2, img3];
  const [currentIndex, setCurrentIndex] = useState(0);

  // ✅ Auto-slide effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change every 5 seconds
    return () => clearInterval(interval);
  }, [images.length]);

  // ✅ Load activities from localStorage
  useEffect(() => {
    const storedActivities = JSON.parse(localStorage.getItem("activities")) || [];
    setActivities(storedActivities);
  }, []);

  // ✅ Fetch next_sessions from Supabase
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
      {/* ========================
          Landing Image Carousel
      ======================== */}
      <div className="carousel-container">
        {images.map((image, index) => (
          <div
            key={index}
            className={`slide ${index === currentIndex ? "active" : ""}`}
            style={{ backgroundImage: `url(${image})` }}
          >
            <div className="overlay-text">
              <h1>Welcome to UATS</h1>
              <p>
                Umuganda Attendance & Fines Tracking System (UATS) helps local
                leaders and citizens manage attendance, fines, and participation
                in Umuganda.
              </p>
              <Link to="/signup" className="primary-button">
                Login / Signup
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* ========================
          Activities Section
      ======================== */}
      <div className="activity-container">
        <h2>Recent Community Activities</h2>
        {activities.length === 0 ? (
          <p>No activities recorded yet.</p>
        ) : (
          <ul className="activity-list">
            {activities.map((act, index) => (
              <li key={index} className="activity-item">
                <h3>{act.location}</h3>
                <p>
                  <strong>Date:</strong> {act.date}
                </p>
                <p>
                  <strong>Description:</strong> {act.description}
                </p>
                {act.image_url && (
                  <img
                    src={act.image_url}
                    alt="activity"
                    className="activity-image"
                  />
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ========================
          Upcoming Sessions
      ======================== */}
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
                <p>
                  <strong>Day:</strong> {session.day}
                </p>
                <p>
                  <strong>Date:</strong> {session.date}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
