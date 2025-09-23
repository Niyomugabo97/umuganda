import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabaseClient";
import './CitizenDashboard.css';

export default function CitizenDashboard() {
  const { user, logout } = useAuth();

  const [attendees, setAttendees] = useState([]);
  const [absentees, setAbsentees] = useState([]);

  const [searchName, setSearchName] = useState("");
  const [filteredAttendance, setFilteredAttendance] = useState([]);
  const [filteredAbsence, setFilteredAbsence] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: att, error: attError } = await supabase.from('attendees').select('*');
      const { data: abs, error: absError } = await supabase.from('absentees').select('*');

      if (attError || absError) {
        console.error("Error fetching data:", attError || absError);
      } else {
        setAttendees(att);
        setAbsentees(abs);
      }
    };
    fetchData();
  }, []);

  const handleSearch = () => {
    const nameLower = searchName.toLowerCase();

    const matchedAttendance = attendees.filter(a => a.name?.toLowerCase() === nameLower);
    const matchedAbsence = absentees.filter(a => a.name?.toLowerCase() === nameLower);

    setFilteredAttendance(matchedAttendance);
    setFilteredAbsence(matchedAbsence);
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Welcome {user?.email}</h2>
      </div>

      <div className="search-box">
        <input
          type="text"
          placeholder="Enter your name..."
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <h3>Attendance</h3>
          {filteredAttendance.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>District</th>
                  <th>Sector</th>
                  <th>Cell</th>
                  <th>Village</th>
                </tr>
              </thead>
              <tbody>
                {filteredAttendance.map((item, i) => (
                  <tr key={i}>
                    <td>{item.name}</td>
                    <td>{item.district}</td>
                    <td>{item.sector}</td>
                    <td>{item.cell}</td>
                    <td>{item.village}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No attendance record found.</p>
          )}
        </div>

        <div className="card">
          <h3>Absence</h3>
          {filteredAbsence.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>District</th>
                  <th>Sector</th>
                  <th>Cell</th>
                  <th>Village</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {filteredAbsence.map((item, i) => (
                  <tr key={i}>
                    <td>{item.name}</td>
                    <td>{item.district}</td>
                    <td>{item.sector}</td>
                    <td>{item.cell}</td>
                    <td>{item.village}</td>
                    <td>{item.amount} RWF</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No absence record found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
