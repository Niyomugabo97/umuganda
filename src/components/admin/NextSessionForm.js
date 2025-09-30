import { useState } from "react";
import { supabase } from "../../supabaseClient";

// Adjust table/columns to match your Supabase schema
const TABLE_NAME = "next_sessions";

export default function NextSessionForm() {
  const [form, setForm] = useState({
    location: "",
    day: "",
    date: "",
  });
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form };
      const { error } = await supabase.from(TABLE_NAME).insert(payload);
      if (error) throw error;
      alert("Next Umuganda session added");
      setForm({ location: "", day: "", date: "" });
    } catch (err) {
      alert(err?.message || "Failed to add next session");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} style={styles.form}>
      <h3 style={styles.title}>Next Umuganda Session</h3>
      <div style={styles.row}><label>Location</label><input name="location" value={form.location} onChange={onChange} required /></div>
      <div style={styles.row}><label>Day</label><input name="day" value={form.day} onChange={onChange} placeholder="e.g., Saturday" required /></div>
      <div style={styles.row}><label>Date</label><input type="date" name="date" value={form.date} onChange={onChange} required /></div>
      <button type="submit" disabled={loading} style={styles.button}>{loading ? "Adding..." : "Add"}</button>
    </form>
  );
}

const styles = {
  form: { border: "1px solid #e1e4e8", borderRadius: 8, padding: 16, marginBottom: 16, background: "#fff" },
  title: { marginTop: 0, marginBottom: 12 },
  row: { display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 },
  button: { padding: "8px 12px", borderRadius: 6, border: "1px solid #ccc", background: "#2c3e50", color: "#fff", cursor: "pointer" },
};
