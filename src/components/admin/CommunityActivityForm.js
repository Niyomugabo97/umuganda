import { useState } from "react";
import { supabase } from "../../supabaseClient";

// Adjust table/columns to match your Supabase schema
const TABLE_NAME = "community_activities";

export default function CommunityActivityForm() {
  const [form, setForm] = useState({
    place: "",
    date: "",
    image_url: "",
    short_description: "",
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
      alert("Community activity added");
      setForm({ place: "", date: "", image_url: "", short_description: "" });
    } catch (err) {
      alert(err?.message || "Failed to add activity");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} style={styles.form}>
      <h3 style={styles.title}>Add Community Activity</h3>
      <div style={styles.row}><label>Place</label><input name="place" value={form.place} onChange={onChange} required /></div>
      <div style={styles.row}><label>Date</label><input type="date" name="date" value={form.date} onChange={onChange} required /></div>
      <div style={styles.row}><label>Image URL</label><input name="image_url" value={form.image_url} onChange={onChange} placeholder="https://..." /></div>
      <div style={styles.row}><label>Short Description</label><textarea name="short_description" value={form.short_description} onChange={onChange} rows={3} /></div>
      <button type="submit" disabled={loading} style={styles.button}>{loading ? "Submitting..." : "Submit"}</button>
    </form>
  );
}

const styles = {
  form: { border: "1px solid #e1e4e8", borderRadius: 8, padding: 16, marginBottom: 16, background: "#fff" },
  title: { marginTop: 0, marginBottom: 12 },
  row: { display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 },
  button: { padding: "8px 12px", borderRadius: 6, border: "1px solid #ccc", background: "#2c3e50", color: "#fff", cursor: "pointer" },
};
