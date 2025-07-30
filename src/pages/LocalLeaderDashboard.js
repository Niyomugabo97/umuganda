import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

export default function LocalLeaderDashboard() {
  const [attendee, setAttendee] = useState({ name: "", district: "", sector: "", village: "", cell: "" });
  const [absentee, setAbsentee] = useState({ name: "", district: "", sector: "", village: "", cell: "", amount: "" });
  const [activity, setActivity] = useState({ location: "", date: "", image: null, description: "" });
  const [nextSession, setNextSession] = useState({ location: "", day: "", date: "" });
  const [attendees, setAttendees] = useState([]);
  const [absentees, setAbsentees] = useState([]);
  const [activities, setActivities] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [nextSessions, setNextSessions] = useState([]);

  useEffect(() => {
    fetchAttendees();
    fetchAbsentees();
    fetchActivities();
    fetchNextSessions();
  }, []);

  async function fetchAttendees() {
    const { data, error } = await supabase.from('attendees').select('*').order('created_at', { ascending: false });
    if (!error && data) setAttendees(data);
  }

  async function fetchAbsentees() {
    const { data, error } = await supabase.from('absentees').select('*').order('created_at', { ascending: false });
    if (!error && data) setAbsentees(data);
  }

  async function fetchActivities() {
    const { data, error } = await supabase.from('activities').select('*').order('created_at', { ascending: false });
    if (!error && data) setActivities(data);
  }

  async function fetchNextSessions() {
    const { data, error } = await supabase.from('next_sessions').select('*').order('created_at', { ascending: false });
    if (!error && data) setNextSessions(data);
  }

  const handleChange = (e, type) => {
    const { name, value } = e.target;
    if (type === "attendee") setAttendee(prev => ({ ...prev, [name]: value }));
    if (type === "absentee") setAbsentee(prev => ({ ...prev, [name]: value }));
  };

  const handleActivityChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setActivity(prev => ({ ...prev, image: files?.[0] || null }));
    } else {
      setActivity(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.from('attendees').insert([attendee]).select();
    if (!error && data?.length) {
      setAttendees(prev => [data[0], ...prev]);
      setAttendee({ name: "", district: "", sector: "", village: "", cell: "" });
    }
  };

  const handleAddAbsentee = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.from('absentees').insert([absentee]).select();
    if (!error && data?.length) {
      setAbsentees(prev => [data[0], ...prev]);
      setAbsentee({ name: "", district: "", sector: "", village: "", cell: "", amount: "" });
    }
  };

  const handleSaveActivity = async (e) => {
    e.preventDefault();
    if (!activity.image) return alert("Please upload an image");

    const formData = new FormData();
    formData.append("file", activity.image);
    formData.append("upload_preset", process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET);

    let imageUrl = "";
    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      );
      const result = await response.json();
      if (!response.ok) throw new Error(result?.error?.message || "Upload failed.");
      imageUrl = result.secure_url;
    } catch (error) {
      alert("Failed to upload image: " + error.message);
      return;
    }

    const { data, error } = await supabase.from('activities').insert([{
      location: activity.location,
      date: activity.date,
      description: activity.description,
      image_url: imageUrl,
    }]).select();

    if (!error && data?.length) {
      setActivities(prev => [data[0], ...prev]);
      setActivity({ location: "", date: "", image: null, description: "" });
    }
  };

  const handleNextSessionChange = (e) => {
    const { name, value } = e.target;
    setNextSession(prev => ({ ...prev, [name]: value }));
  };

  const handleAddNextSession = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.from('next_sessions').insert([nextSession]).select();
    if (!error && data?.length) {
      setNextSessions(prev => [data[0], ...prev]);
      setNextSession({ location: "", day: "", date: "" });
    }
  };

  const handleEdit = (index) => {
    if (index >= 0 && index < attendees.length) {
      setAttendee(attendees[index]);
      setEditIndex(index);
    }
  };

  const handleDelete = async (index) => {
    const id = attendees[index]?.id;
    if (!id) return;
    const { error } = await supabase.from('attendees').delete().eq('id', id);
    if (!error) {
      setAttendees(prev => prev.filter((_, i) => i !== index));
      if (editIndex === index) {
        setEditIndex(null);
        setAttendee({ name: "", district: "", sector: "", village: "", cell: "" });
      }
    }
  };

  const handleDeleteAbsentee = async (index) => {
    const id = absentees[index]?.id;
    if (!id) return;
    const { error } = await supabase.from('absentees').delete().eq('id', id);
    if (!error) {
      setAbsentees(prev => prev.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="admin-dashboard">
      <h2 className="dashboard-title">Welcome, Local Leader</h2>

      {/* Activity Form */}
      <form onSubmit={handleSaveActivity} className="form-container">
        <h3>Add recently Community Activity</h3>
        <div className="form-grid">
          <input type="text" name="location" placeholder="Where activity happened" value={activity.location} onChange={handleActivityChange} required />
          <input type="date" name="date" value={activity.date} onChange={handleActivityChange} required />
          <input type="file" name="image" accept="image/*" onChange={handleActivityChange} required />
          <input type="text" name="description" placeholder="Short description" value={activity.description} onChange={handleActivityChange} />
        </div>
        {activity.image && (
          <div style={{ marginTop: '10px' }}>
            <strong>Image Preview:</strong><br />
            <img src={URL.createObjectURL(activity.image)} alt="Preview" style={{ maxWidth: "200px", borderRadius: "8px", marginTop: "5px" }} />
          </div>
        )}
        <button type="submit" className="submit-btn">Save Activity</button>
      </form>

      {/* Activities Table */}
      <h3 className="table-title">Community Activities</h3>
      <table className="attendance-table">
        <thead>
          <tr><th>Location</th><th>Date</th><th>Description</th><th>Image</th></tr>
        </thead>
        <tbody>
          {activities.length ? activities.map((a) => (
            <tr key={a.id}>
              <td>{a.location}</td>
              <td>{a.date}</td>
              <td>{a.description}</td>
              <td>{a.image_url ? <img src={a.image_url} alt="" style={{ maxWidth: 100 }} /> : "No image"}</td>
            </tr>
          )) : <tr><td colSpan="4" className="empty-row">No activities recorded yet.</td></tr>}
        </tbody>
      </table>

      {/* Next Session */}
      <form onSubmit={handleAddNextSession} className="form-container">
        <h3>Plan Next Umuganda Session</h3>
        <div className="form-grid">
          <input type="text" name="location" placeholder="Location" value={nextSession.location} onChange={handleNextSessionChange} required />
          <input type="text" name="day" placeholder="Day (e.g., Saturday)" value={nextSession.day} onChange={handleNextSessionChange} required />
          <input type="date" name="date" value={nextSession.date} onChange={handleNextSessionChange} required />
        </div>
        <button type="submit" className="submit-btn">Save Session Plan</button>
      </form>

      <h3 className="table-title">Upcoming Umuganda Sessions</h3>
      <table className="attendance-table">
        <thead>
          <tr><th>Location</th><th>Day</th><th>Date</th></tr>
        </thead>
        <tbody>
          {nextSessions.length ? nextSessions.map((s) => (
            <tr key={s.id}><td>{s.location}</td><td>{s.day}</td><td>{s.date}</td></tr>
          )) : <tr><td colSpan="3" className="empty-row">No next sessions saved yet.</td></tr>}
        </tbody>
      </table>

      {/* Attendee Form */}
      <form onSubmit={handleSubmit} className="form-container">
        <h3>{editIndex !== null ? "Edit Attendee" : "Add Attendee"}</h3>
        <div className="form-grid">
          {["name", "district", "sector", "village", "cell"].map((f) => (
            <input key={f} name={f} type="text" value={attendee[f]} placeholder={f} onChange={(e) => handleChange(e, "attendee")} required />
          ))}
        </div>
        <button className="submit-btn" type="submit">{editIndex !== null ? "Update" : "Add Attendee"}</button>
      </form>

      {/* Absentee Form */}
      <form onSubmit={handleAddAbsentee} className="form-container">
        <h3>Add Absentee</h3>
        <div className="form-grid">
          {["name", "district", "sector", "village", "cell", "amount"].map((f) => (
            <input key={f} name={f} type={f === "amount" ? "number" : "text"} value={absentee[f]} placeholder={f} onChange={(e) => handleChange(e, "absentee")} required />
          ))}
        </div>
        <button className="submit-btn" type="submit">Add Absentee</button>
      </form>

      {/* CSS Styling */}
      <style>{`
        .admin-dashboard {
          padding: 20px;
          font-family: Arial, sans-serif;
          max-width: 1200px;
          margin: auto;
        }

        .dashboard-title {
          font-size: 24px;
          font-weight: bold;
          text-align: center;
          margin-bottom: 20px;
        }

        .form-container {
          background: #f9f9f9;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 30px;
        }

        .form-container h3 {
          margin-bottom: 15px;
          text-align: center;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 15px;
          margin-bottom: 15px;
        }

        .form-grid input {
          padding: 10px;
          font-size: 16px;
          border-radius: 5px;
          border: 1px solid #ccc;
        }

        .submit-btn {
          background-color: #007bff;
          color: white;
          padding: 10px 20px;
          width: 100%;
          border: none;
          border-radius: 5px;
          font-size: 16px;
        }

        .submit-btn:hover {
          background-color: #0056b3;
        }

        .table-title {
          text-align: center;
          font-size: 20px;
          margin-top: 40px;
        }

        .attendance-table {
          width: 100%;
          border-collapse: collapse;
          overflow-x: auto;
          display: block;
        }

        .attendance-table th,
        .attendance-table td {
          border: 1px solid #ccc;
          padding: 10px;
          white-space: nowrap;
          text-align: center;
        }

        .attendance-table th {
          background: #eee;
        }

        .edit-btn,
        .delete-btn {
          padding: 6px 10px;
          margin: 0 4px;
          border: none;
          border-radius: 5px;
          font-size: 14px;
          cursor: pointer;
        }

        .edit-btn {
          background-color: #ffc107;
        }

        .delete-btn {
          background-color: #dc3545;
          color: white;
        }

        .empty-row {
          text-align: center;
          color: #777;
        }

        @media (max-width: 768px) {
          .form-grid {
            grid-template-columns: 1fr;
          }

          .submit-btn {
            font-size: 14px;
          }

          .attendance-table th,
          .attendance-table td {
            font-size: 14px;
            padding: 8px;
          }
        }

        @media (max-width: 480px) {
          .edit-btn, .delete-btn {
            font-size: 12px;
            padding: 4px 6px;
          }
        }
      `}</style>
    </div>
  );
}
