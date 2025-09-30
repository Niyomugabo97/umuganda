import { useState } from "react";
import { supabase } from "../../supabaseClient";

// Adjust to your Supabase table name/columns if different
const TABLE_NAME = "absentees";

export default function AbsenteeForm() {
  const [form, setForm] = useState({
    name: "",
    district: "",
    sector: "",
    village: "",
    cell: "",
    amount_to_pay: "",
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
      const payload = {
        name: form.name,
        district: form.district,
        sector: form.sector,
        village: form.village,
        cell: form.cell,
        amount_to_pay: Number(form.amount_to_pay || 0),
        date: form.date || null,
      };
      const { error } = await supabase.from(TABLE_NAME).insert(payload);
      if (error) throw error;
      alert("Absentee submitted");
      setForm({ name: "", district: "", sector: "", village: "", cell: "", amount_to_pay: "", date: "" });
    } catch (err) {
      alert(err?.message || "Failed to submit absentee");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} style={styles.form}>
      <h3 style={styles.title}>Absentee</h3>
      <div style={styles.row}><label>Name</label><input name="name" value={form.name} onChange={onChange} required /></div>
      <div style={styles.row}><label>District</label><input name="district" value={form.district} onChange={onChange} required /></div>
      <div style={styles.row}><label>Sector</label><input name="sector" value={form.sector} onChange={onChange} required /></div>
      <div style={styles.row}><label>Village</label><input name="village" value={form.village} onChange={onChange} required /></div>
      <div style={styles.row}><label>Cell</label><input name="cell" value={form.cell} onChange={onChange} required /></div>
      <div style={styles.row}><label>Amount to pay</label><input type="number" name="amount_to_pay" value={form.amount_to_pay} onChange={onChange} required min="0" step="0.01" /></div>
      <div style={styles.row}><label>Date</label><input type="date" name="date" value={form.date} onChange={onChange} required /></div>
      <button type="submit" disabled={loading} style={styles.button}>{loading ? "Sending..." : "Send"}</button>
    </form>
  );
}

const styles = {
  form: { border: "1px solid #e1e4e8", borderRadius: 8, padding: 16, marginBottom: 16, background: "#fff" },
  title: { marginTop: 0, marginBottom: 12 },
  row: { display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 },
  button: { padding: "8px 12px", borderRadius: 6, border: "1px solid #ccc", background: "#2c3e50", color: "#fff", cursor: "pointer" },
};
