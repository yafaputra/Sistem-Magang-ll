import Sidebar from "./components/sidebar";
import "../globals.css";

export default function DashboardLayout({ children }) {
  return (
    <html>
      <body>
        <div style={{ display: "flex", minHeight: "100vh", background: "#f5f5fb" }}>
          <Sidebar />
          <main style={{ flex: 1, overflow: "auto" }}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}