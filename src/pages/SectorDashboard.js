import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { supabase } from "../supabaseClient";

export default function SectorOfficials() {
  const [stats, setStats] = useState([]);
  const [fines, setFines] = useState([]);

  useEffect(() => {
    const fetchStatsAndFines = async () => {
      // Fetch attendance
      const { data: attendees, error: attendeeError } = await supabase
        .from("attendees")
        .select("*");

      const { data: absentees, error: absenteeError } = await supabase
        .from("absentees")
        .select("*");

      if (attendeeError || absenteeError) {
        console.error("Error fetching data:", attendeeError || absenteeError);
        return;
      }

      // Group data by month (assuming a `date` field exists)
      const monthlyStats = {};

      [...attendees, ...absentees].forEach((entry) => {
        const month = new Date(entry.date).toLocaleString("default", {
          month: "short",
        });

        if (!monthlyStats[month]) {
          monthlyStats[month] = { month, attended: 0, absent: 0 };
        }

        if (attendees.includes(entry)) {
          monthlyStats[month].attended++;
        } else {
          monthlyStats[month].absent++;
        }
      });

      // Sort by month (optional)
      const sortedStats = Object.values(monthlyStats);

      setStats(sortedStats);

      // Optional: if "fines" are in absentees table
      const fineList = absentees.map((person) => ({
        id: person.id,
        name: person.name,
        sector: person.sector,
        amount: person.amount || 1000, // Default fine
        deadline: person.deadline || "N/A",
        paid: person.paid || false,
      }));

      setFines(fineList);
    };

    fetchStatsAndFines();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Participation Trends</h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={stats}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="attended" fill="#4CAF50" />
          <Bar dataKey="absent" fill="#F44336" />
        </BarChart>
      </ResponsiveContainer>

      <h2 className="text-xl font-bold mt-8 mb-2">Manage Fines</h2>
      <table className="w-full border">
        <thead>
          <tr>
            <th>Name</th>
            <th>Sector</th>
            <th>Amount</th>
            <th>Deadline</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {fines.map((fine) => (
            <tr key={fine.id}>
              <td>{fine.name}</td>
              <td>{fine.sector}</td>
              <td>{fine.amount} RWF</td>
              <td>{fine.deadline}</td>
              <td>{fine.paid ? "Paid" : "Unpaid"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
