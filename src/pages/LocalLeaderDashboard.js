import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import "./LocalLeaderDashboard.css";

export default function LocalLeaderDashboard() {
  const [attendee, setAttendee] = useState({ name: "", district: "", sector: "", village: "", cell: "" });
  const [absentee, setAbsentee] = useState({ name: "", district: "", sector: "", village: "", cell: "", amount: "" });
  const [activity, setActivity] = useState({ location: "", date: "", image: null, description: "" });
  const [nextSession, setNextSession] = useState({ location: "", day: "", date: "" });

  const [attendees, setAttendees] = useState([]);
  const [absentees, setAbsentees] = useState([]);
  const [activities, setActivities] = useState([]);
  const [nextSessions, setNextSessions] = useState([]);

  const [editAttendeeIndex, setEditAttendeeIndex] = useState(null);
  const [editActivityIndex, setEditActivityIndex] = useState(null);
  const [editSessionIndex, setEditSessionIndex] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: attendeesData } = await supabase.from("attendees").select().order('created_at', { ascending: false });
    const { data: absenteesData } = await supabase.from("absentees").select().order('created_at', { ascending: false });
    const { data: activitiesData } = await supabase.from("activities").select().order('created_at', { ascending: false });
    const { data: sessionsData } = await supabase.from("next_sessions").select().order('created_at', { ascending: false });
    setAttendees(attendeesData || []);
    setAbsentees(absenteesData || []);
    setActivities(activitiesData || []);
    setNextSessions(sessionsData || []);
  };

  // -- Attendee Handlers --

  const handleAttendeeChange = (e) => {
    const { name, value } = e.target;
    setAttendee(prev => ({ ...prev, [name]: value }));
  };

  const handleAttendeeSubmit = async (e) => {
    e.preventDefault();
    if (editAttendeeIndex !== null) {
      // Update attendee
      const id = attendees[editAttendeeIndex].id;
      const { data, error } = await supabase.from('attendees').update(attendee).eq('id', id).select();
      if (!error && data?.length) {
        const updated = [...attendees];
        updated[editAttendeeIndex] = data[0];
        setAttendees(updated);
        setEditAttendeeIndex(null);
        setAttendee({ name: "", district: "", sector: "", village: "", cell: "" });
      } else {
        alert("Failed to update attendee: " + error.message);
      }
    } else {
      // Insert attendee
      const { data, error } = await supabase.from('attendees').insert([attendee]).select();
      if (!error && data?.length) {
        setAttendees([data[0], ...attendees]);
        setAttendee({ name: "", district: "", sector: "", village: "", cell: "" });
      } else {
        alert("Failed to add attendee: " + error.message);
      }
    }
  };

  const handleEditAttendee = (index) => {
    setAttendee(attendees[index]);
    setEditAttendeeIndex(index);
  };

  const handleDeleteAttendee = async (index) => {
    const id = attendees[index].id;
    const { error } = await supabase.from('attendees').delete().eq('id', id);
    if (!error) {
      setAttendees(prev => prev.filter((_, i) => i !== index));
      if (editAttendeeIndex === index) {
        setEditAttendeeIndex(null);
        setAttendee({ name: "", district: "", sector: "", village: "", cell: "" });
      }
    } else {
      alert("Failed to delete attendee: " + error.message);
    }
  };

  // -- Absentee Handlers --

  const handleAbsenteeChange = (e) => {
    const { name, value } = e.target;
    setAbsentee(prev => ({ ...prev, [name]: value }));
  };

  const handleAbsenteeSubmit = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.from('absentees').insert([absentee]).select();
    if (!error && data?.length) {
      setAbsentees([data[0], ...absentees]);
      setAbsentee({ name: "", district: "", sector: "", village: "", cell: "", amount: "" });
    } else {
      alert("Failed to add absentee: " + error.message);
    }
  };

  const handleDeleteAbsentee = async (index) => {
    const id = absentees[index].id;
    const { error } = await supabase.from('absentees').delete().eq('id', id);
    if (!error) {
      setAbsentees(prev => prev.filter((_, i) => i !== index));
    } else {
      alert("Failed to delete absentee: " + error.message);
    }
  };

  // -- Activity Handlers --

  const handleActivityChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setActivity(prev => ({ ...prev, image: files[0] }));
    } else {
      setActivity(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSaveActivity = async (e) => {
    e.preventDefault();
    let imageUrl = "";

    if (activity.image && typeof activity.image !== "string") {
      const formData = new FormData();
      formData.append("file", activity.image);
      formData.append("upload_preset", process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET);

      try {
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );
        const result = await response.json();
        if (!response.ok) throw new Error(result?.error?.message || "Upload failed.");
        imageUrl = result.secure_url;
      } catch (error) {
        alert("Image upload failed: " + error.message);
        return;
      }
    } else if (typeof activity.image === "string") {
      imageUrl = activity.image;
    }

    if (editActivityIndex !== null) {
      // Update activity
      const id = activities[editActivityIndex].id;
      const { data, error } = await supabase.from('activities').update({
        location: activity.location,
        date: activity.date,
        description: activity.description,
        image_url: imageUrl,
      }).eq('id', id).select();

      if (!error && data?.length) {
        const updated = [...activities];
        updated[editActivityIndex] = data[0];
        setActivities(updated);
        setEditActivityIndex(null);
        setActivity({ location: "", date: "", image: null, description: "" });
      } else {
        alert("Failed to update activity: " + error.message);
      }
    } else {
      // Insert activity
      const { data, error } = await supabase.from('activities').insert([{
        location: activity.location,
        date: activity.date,
        description: activity.description,
        image_url: imageUrl,
      }]).select();

      if (!error && data?.length) {
        setActivities([data[0], ...activities]);
        setActivity({ location: "", date: "", image: null, description: "" });
      } else {
        alert("Failed to add activity: " + error.message);
      }
    }
  };

  const handleEditActivity = (index) => {
    const act = activities[index];
    setActivity({ location: act.location, date: act.date, image: act.image_url || null, description: act.description });
    setEditActivityIndex(index);
  };

  const handleDeleteActivity = async (index) => {
    const id = activities[index].id;
    const { error } = await supabase.from('activities').delete().eq('id', id);
    if (!error) {
      setActivities(prev => prev.filter((_, i) => i !== index));
    } else {
      alert("Failed to delete activity: " + error.message);
    }
  };

  // -- Next Session Handlers --

  const handleNextSessionChange = (e) => {
    const { name, value } = e.target;
    setNextSession(prev => ({ ...prev, [name]: value }));
  };

  const handleAddNextSession = async (e) => {
    e.preventDefault();
    if (editSessionIndex !== null) {
      // Update session
      const id = nextSessions[editSessionIndex].id;
      const { data, error } = await supabase.from('next_sessions').update(nextSession).eq('id', id).select();
      if (!error && data?.length) {
        const updated = [...nextSessions];
        updated[editSessionIndex] = data[0];
        setNextSessions(updated);
        setNextSession({ location: "", day: "", date: "" });
        setEditSessionIndex(null);
      } else {
        alert("Failed to update session: " + error.message);
      }
    } else {
      // Insert session
      const { data, error } = await supabase.from('next_sessions').insert([nextSession]).select();
      if (!error && data?.length) {
        setNextSessions([data[0], ...nextSessions]);
        setNextSession({ location: "", day: "", date: "" });
      } else {
        alert("Failed to add session: " + error.message);
      }
    }
  };

  const handleEditSession = (index) => {
    const session = nextSessions[index];
    setNextSession({ location: session.location, day: session.day, date: session.date });
    setEditSessionIndex(index);
  };

  const handleDeleteSession = async (index) => {
    const id = nextSessions[index].id;
    const { error } = await supabase.from('next_sessions').delete().eq('id', id);
    if (!error) {
      setNextSessions(prev => prev.filter((_, i) => i !== index));
    } else {
      alert("Failed to delete session: " + error.message);
    }
  };

  return (
    <div className="dashboard-container">

      {/* Attendees Form */}
      <section className="form-section">
        <h3>{editAttendeeIndex !== null ? "Edit Attendee" : "Add Attendee"}</h3>
        <form onSubmit={handleAttendeeSubmit} className="form-grid">
          {["name", "district", "sector", "village", "cell"].map((field) => (
            <input
              key={field}
              type="text"
              name={field}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={attendee[field]}
              onChange={handleAttendeeChange}
              required
            />
          ))}
          <button type="submit">{editAttendeeIndex !== null ? "Update Attendee" : "Add Attendee"}</button>
        </form>
      </section>

      {/* Attendees Table */}
      <section className="table-section">
        <h3 className="table-title">Attendance List</h3>
        <table className="attendance-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>District</th>
              <th>Sector</th>
              <th>Village</th>
              <th>Cell</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {attendees.length > 0 ? attendees.map((a, i) => (
              <tr key={a.id}>
                <td>{a.name}</td>
                <td>{a.district}</td>
                <td>{a.sector}</td>
                <td>{a.village}</td>
                <td>{a.cell}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEditAttendee(i)}>Edit</button>
                  <button className="delete-btn" onClick={() => handleDeleteAttendee(i)}>Delete</button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="6" style={{ textAlign: "center" }}>No attendance records yet.</td></tr>
            )}
          </tbody>
        </table>
      </section>

      {/* Absentees Form */}
      <section className="form-section">
        <h3>Add Absentee (Fine Notifier)</h3>
        <form onSubmit={handleAbsenteeSubmit} className="form-grid">
          {["name", "district", "sector", "village", "cell"].map((field) => (
            <input
              key={field}
              type="text"
              name={field}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={absentee[field]}
              onChange={handleAbsenteeChange}
              required
            />
          ))}
          <input
            type="number"
            name="amount"
            placeholder="Amount to Pay (RWF)"
            value={absentee.amount}
            onChange={handleAbsenteeChange}
            required
          />
          <button type="submit">Add Absentee</button>
        </form>
      </section>

      {/* Absentees Table */}
      <section className="table-section">
        <h3 className="table-title">Absentees (Fined)</h3>
        <table className="attendance-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>District</th>
              <th>Sector</th>
              <th>Village</th>
              <th>Cell</th>
              <th>Amount (RWF)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {absentees.length > 0 ? absentees.map((a, i) => (
              <tr key={a.id}>
                <td>{a.name}</td>
                <td>{a.district}</td>
                <td>{a.sector}</td>
                <td>{a.village}</td>
                <td>{a.cell}</td>
                <td>{a.amount}</td>
                <td>
                  <button className="delete-btn" onClick={() => handleDeleteAbsentee(i)}>Remove</button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="7" style={{ textAlign: "center" }}>No absentees recorded yet.</td></tr>
            )}
          </tbody>
        </table>
      </section>

      {/* Activities Form */}
      <section className="form-section">
        <h3>{editActivityIndex !== null ? "Edit Community Activity" : "Add Community Activity"}</h3>
        <form onSubmit={handleSaveActivity} className="form-grid" encType="multipart/form-data">
          <input
            type="text"
            name="location"
            placeholder="Where activity happened"
            value={activity.location}
            onChange={handleActivityChange}
            required
          />
          <input
            type="date"
            name="date"
            value={activity.date}
            onChange={handleActivityChange}
            required
          />
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleActivityChange}
            // required only for new activities, not for edit when image already exists
            required={editActivityIndex === null}
          />
          <input
            type="text"
            name="description"
            placeholder="Short description"
            value={activity.description}
            onChange={handleActivityChange}
          />
          <button type="submit">{editActivityIndex !== null ? "Update Activity" : "Save Activity"}</button>
        </form>
        {activity.image && typeof activity.image !== "string" && (
          <div style={{ textAlign: "center", marginTop: "10px" }}>
            <strong>Image Preview:</strong><br />
            <img
              src={URL.createObjectURL(activity.image)}
              alt="Preview"
              style={{ maxWidth: "200px", borderRadius: "8px", marginTop: "5px" }}
            />
          </div>
        )}
      </section>

      {/* Activities Table */}
      <section className="table-section">
        <h3 className="table-title">Community Activities</h3>
        <table className="attendance-table">
          <thead>
            <tr>
              <th>Location</th>
              <th>Date</th>
              <th>Description</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {activities.length > 0 ? activities.map((act, i) => (
              <tr key={act.id}>
                <td>{act.location}</td>
                <td>{act.date}</td>
                <td>{act.description}</td>
                <td>
                  {act.image_url ? (
                    <img src={act.image_url} alt={`Activity at ${act.location}`} style={{ maxWidth: "150px", borderRadius: "8px" }} />
                  ) : (
                    "No image"
                  )}
                </td>
                <td>
                  <button className="edit-btn" onClick={() => handleEditActivity(i)}>Edit</button>
                  <button className="delete-btn" onClick={() => handleDeleteActivity(i)}>Delete</button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="5" style={{ textAlign: "center" }}>No activities recorded yet.</td></tr>
            )}
          </tbody>
        </table>
      </section>

      {/* Next Sessions Form */}
      <section className="form-section">
        <h3>{editSessionIndex !== null ? "Edit Next Umuganda Session" : "Plan Next Umuganda Session"}</h3>
        <form onSubmit={handleAddNextSession} className="form-grid">
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={nextSession.location}
            onChange={handleNextSessionChange}
            required
          />
          <input
            type="text"
            name="day"
            placeholder="Day (e.g., Saturday)"
            value={nextSession.day}
            onChange={handleNextSessionChange}
            required
          />
          <input
            type="date"
            name="date"
            value={nextSession.date}
            onChange={handleNextSessionChange}
            required
          />
          <button type="submit">{editSessionIndex !== null ? "Update Session" : "Add Session"}</button>
        </form>
      </section>

      {/* Next Sessions Table */}
      <section className="table-section">
        <h3 className="table-title">Upcoming Umuganda Sessions</h3>
        <table className="attendance-table">
          <thead>
            <tr>
              <th>Location</th>
              <th>Day</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {nextSessions.length > 0 ? nextSessions.map((sess, i) => (
              <tr key={sess.id}>
                <td>{sess.location}</td>
                <td>{sess.day}</td>
                <td>{sess.date}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEditSession(i)}>Edit</button>
                  <button className="delete-btn" onClick={() => handleDeleteSession(i)}>Delete</button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="4" style={{ textAlign: "center" }}>No upcoming sessions planned.</td></tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
