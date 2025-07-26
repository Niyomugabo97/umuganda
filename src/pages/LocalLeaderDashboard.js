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
  }, []);

  async function fetchAttendees() {
    const { data, error } = await supabase
      .from('attendees')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.error("Fetch attendees error:", error);
      alert("Failed to load attendees: " + error.message);
    } else if (data) {
      setAttendees(data);
    }
  }

  async function fetchAbsentees() {
    const { data, error } = await supabase
      .from('absentees')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.error("Fetch absentees error:", error);
      alert("Failed to load absentees: " + error.message);
    } else if (data) {
      setAbsentees(data);
    }
  }

  async function fetchActivities() {
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.error("Fetch activities error:", error);
      alert("Failed to load activities: " + error.message);
    } else if (data) {
      setActivities(data);
    }
  }

  const handleChange = (e, type) => {
    const { name, value } = e.target;
    if (type === "attendee") {
      setAttendee(prev => ({ ...prev, [name]: value }));
    } else if (type === "absentee") {
      setAbsentee(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleActivityChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setActivity(prev => ({ ...prev, image: files ? files[0] : null }));
    } else {
      setActivity(prev => ({ ...prev, [name]: value }));
    }
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  if (editIndex !== null) {
    alert("Edit attendee not implemented on DB yet");
    return;
  }
  const { data, error } = await supabase.from('attendees').insert([attendee]).select();
  if (error) {
    alert("Error adding attendee: " + error.message);
  } else if (data && data.length > 0) {
    setAttendees(prev => [data[0], ...prev]);
    setAttendee({ name: "", district: "", sector: "", village: "", cell: "" });
    alert("Attendee added successfully!");
  } else {
    alert("No data returned from Supabase.");
  }
};



  const handleAddAbsentee = async (e) => {
  e.preventDefault();
  const { data, error } = await supabase.from('absentees').insert([absentee]).select();

  if (error) {
    alert("Error adding absentee: " + error.message);
  } else if (data && data.length > 0) {
    setAbsentees(prev => [data[0], ...prev]);
    setAbsentee({ name: "", district: "", sector: "", village: "", cell: "", amount: "" });
    alert("Absentee added successfully!");
  } else {
    alert("No data returned from Supabase.");
  }
};




 const handleSaveActivity = async (e) => {
  e.preventDefault();

  if (!activity.image) {
    alert("Please upload an image");
    return;
  }

  //  Prepare image upload form data
  const formData = new FormData();
  formData.append("file", activity.image);
  formData.append("upload_preset", "YOUR_UPLOAD_PRESET"); 
  formData.append("cloud_name", "YOUR_CLOUD_NAME");        

  try {
    // Upload to Cloudinary
    const response = await fetch("https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload", {
      method: "POST",
      body: formData
    });

    const result = await response.json();
    const imageUrl = result.secure_url;

    //  Save to localStorage or database
    const newActivity = {
      location: activity.location,
      date: activity.date,
      description: activity.description,
      image_url: imageUrl,
      id: Date.now()
    };

    const storedActivities = JSON.parse(localStorage.getItem("activities")) || [];
    const updatedActivities = [newActivity, ...storedActivities];
    localStorage.setItem("activities", JSON.stringify(updatedActivities));

    setActivities(updatedActivities);
    setActivity({ location: "", date: "", image: null, description: "" });
    alert("Activity saved with image on Cloudinary!");
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    alert("Failed to upload image to Cloudinary.");
  }
};


  const handleEdit = (index) => {
    if (index >= 0 && index < attendees.length) {
      setAttendee(attendees[index]);
      setEditIndex(index);
    }
  };

  const handleDelete = async (index) => {
    if (index < 0 || index >= attendees.length) return;
    const id = attendees[index].id;
    const { error } = await supabase.from('attendees').delete().eq('id', id);
    if (error) {
      alert("Error deleting attendee: " + error.message);
    } else {
      setAttendees(prev => prev.filter((_, i) => i !== index));
      if (editIndex === index) {
        setEditIndex(null);
        setAttendee({ name: "", district: "", sector: "", village: "", cell: "" });
      }
    }
  };

  const handleDeleteAbsentee = async (index) => {
    if (index < 0 || index >= absentees.length) return;
    const id = absentees[index].id;
    const { error } = await supabase.from('absentees').delete().eq('id', id);
    if (error) {
      alert("Error deleting absentee: " + error.message);
    } else {
      setAbsentees(prev => prev.filter((_, i) => i !== index));
    }
  };


  async function fetchNextSessions() {
    const { data, error } = await supabase.from('next_sessions').select('*').order('created_at', { ascending: false });
    if (!error) setNextSessions(data);
  }
  const handleNextSessionChange = (e) => {
    const { name, value } = e.target;
    setNextSession(prev => ({ ...prev, [name]: value }));
  };

  const handleAddNextSession = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.from('next_sessions').insert([nextSession]).select();
    if (!error && data?.length > 0) {
      setNextSessions(prev => [data[0], ...prev]);
      setNextSession({ location: "", day: "", date: "" });
      alert("Next session added successfully!");
    }
  };
 





  return (
    <div className="admin-dashboard">
      <h2 className="dashboard-title">Welcome, Local Leader</h2>

      {/* Community Activity Form */}
      <form onSubmit={handleSaveActivity} className="form-container">
        <h3>Add Community Activity</h3>
        <div className="form-grid">
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
            required
          />
          <input
            type="text"
            name="description"
            placeholder="Short description"
            value={activity.description}
            onChange={handleActivityChange}
          />
        </div>
        {activity.image && (
          <div style={{ marginTop: '10px' }}>
            <strong>Image Preview:</strong><br />
            <img
              src={URL.createObjectURL(activity.image)}
              alt="Preview"
              style={{ maxWidth: "200px", borderRadius: "8px", marginTop: "5px" }}
            />
          </div>
        )}
        <button type="submit" className="submit-btn">Save Activity</button>
      </form>

           {/* Next Umuganda Session Form */}
      <form onSubmit={handleAddNextSession} className="form-container">
        <h3>Plan Next Umuganda Session</h3>
        <div className="form-grid">
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
        </div>
        <button type="submit" className="submit-btn">Save Session Plan</button>
      </form>

      {/* Next Sessions Table */}
      <h3 className="table-title">Upcoming Umuganda Sessions</h3>
      <table className="attendance-table">
        <thead>
          <tr>
            <th>Location</th>
            <th>Day</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {nextSessions.length > 0 ? (
            nextSessions.map((session) => (
              <tr key={session.id}>
                <td>{session.location}</td>
                <td>{session.day}</td>
                <td>{session.date}</td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="3" className="empty-row">No next sessions saved yet.</td></tr>
          )}
        </tbody>
      </table>
    





      {/* Attendees Form */}
      <form onSubmit={handleSubmit} className="form-container">
        <h3>{editIndex !== null ? "Edit Attendee" : "Add Attendee"}</h3>
        <div className="form-grid">
          {["name", "district", "sector", "village", "cell"].map((field) => (
            <input
              key={field}
              type="text"
              name={field}
              placeholder={field[0].toUpperCase() + field.slice(1)}
              value={attendee[field]}
              onChange={(e) => handleChange(e, "attendee")}
              required
            />
          ))}
        </div>
        <button type="submit" className="submit-btn">
          {editIndex !== null ? "Update Attendee" : "Add Attendee"}
        </button>
      </form>

      {/* Absentees Form */}
      <form onSubmit={handleAddAbsentee} className="form-container">
        <h3>Add Absentee (Fine Notifier)</h3>
        <div className="form-grid">
          {["name", "district", "sector", "village", "cell", "amount"].map((field) => (
            <input
              key={field}
              type={field === "amount" ? "number" : "text"}
              name={field}
              placeholder={field === "amount" ? "Amount to Pay (RWF)" : field[0].toUpperCase() + field.slice(1)}
              value={absentee[field]}
              onChange={(e) => handleChange(e, "absentee")}
              required
            />
          ))}
        </div>
        <button type="submit" className="submit-btn">Add Absentee</button>
      </form>

      {/* Attendance List */}
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
          {attendees.length > 0 ? (
            attendees.map((a, index) => (
              <tr key={a.id}>
                <td>{a.name}</td>
                <td>{a.district}</td>
                <td>{a.sector}</td>
                <td>{a.village}</td>
                <td>{a.cell}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEdit(index)}>Edit</button>
                  <button className="delete-btn" onClick={() => handleDelete(index)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="6" className="empty-row">No attendance records yet.</td></tr>
          )}
        </tbody>
      </table>

      {/* Absentees List */}
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
          {absentees.length > 0 ? (
            absentees.map((a, index) => (
              <tr key={a.id}>
                <td>{a.name}</td>
                <td>{a.district}</td>
                <td>{a.sector}</td>
                <td>{a.village}</td>
                <td>{a.cell}</td>
                <td>{a.amount}</td>
                <td>
                  <button className="delete-btn" onClick={() => handleDeleteAbsentee(index)}>Remove</button>
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="7" className="empty-row">No absentees recorded yet.</td></tr>
          )}
        </tbody>
      </table>

      {/* CSS styles */}
      <style>{`
        .admin-dashboard {
          padding: 20px;
          font-family: Arial, sans-serif;
        }
        .dashboard-title {
          font-size: 24px;
          font-weight: bold;
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
        }
        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
          margin-bottom: 15px;
        }
        .form-grid input {
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 5px;
        }
        .submit-btn {
          background-color: #007bff;
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
        .submit-btn:hover {
          background-color: #0056b3;
        }
        .table-title {
          font-size: 20px;
          margin-top: 40px;
          margin-bottom: 10px;
        }
        .attendance-table {
          width: 100%;
          border-collapse: collapse;
        }
        .attendance-table th,
        .attendance-table td {
          border: 1px solid #ccc;
          padding: 10px;
          text-align: center;
        }
        .attendance-table th {
          background-color: #eee;
        }
        .edit-btn,
        .delete-btn {
          padding: 5px 10px;
          border: none;
          border-radius: 4px;
          margin: 0 5px;
          cursor: pointer;
        }
        .edit-btn {
          background-color: #ffc107;
          color: black;
        }
        .delete-btn {
          background-color: #dc3545;
          color: white;
        }
        .edit-btn:hover {
          background-color: #e0a800;
        }
        .delete-btn:hover {
          background-color: #c82333;
        }
        .empty-row {
          text-align: center;
          padding: 20px;
          color: #999;
        }
      `}</style>
    </div>
  );
};