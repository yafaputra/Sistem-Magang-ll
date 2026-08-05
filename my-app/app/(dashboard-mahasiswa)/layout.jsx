import Sidebar from "./components/sidebar";
import "../globals.css";

export default function DashboardLayout({ children }) {
  return (
    <html>
      <body>
        <div style={{ display: "flex", height: "100vh", overflow: "hidden", backgroundColor: "var(--color-bg-dashboard)" }}>
          <Sidebar />
          <main style={{ flex: 1, overflowY: "auto" }}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}