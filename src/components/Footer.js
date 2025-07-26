// src/components/Footer.js
export default function Footer() {
  return (
    <footer style={styles.footer}>
      <p>📞 Contact: Umuganda Project Support</p>
      <p>📧 Email: <a href="mailto:support@umuganda.org" style={styles.email}>support@umuganda.org</a></p>
    </footer>
  );
}

const styles = {
  footer: {
    marginTop: "450px",
    padding: "20px",
    textAlign: "center",
    backgroundColor: "#2c3e50ff",
    color: "#fff",
    fontFamily: "sans-serif"
  },
  email: {
    color: "#1abc9c",
    textDecoration: "none"
  }
};
