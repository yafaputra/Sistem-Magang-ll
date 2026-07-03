import SidebarPerusahaan from "./components/sidebar";
import "../globals.css";

export default function PerusahaanLayout({ children }) {
  return (

  <html>
    <body>    
      <div style={{ display: "flex", minHeight: "100vh", background: "#f5f5fb" }}>
          <SidebarPerusahaan />
          <main style={{ flex: 1, overflow: "auto" }}>
            {children}
          </main>
        </div>
    </body>
  </html>

  );
}