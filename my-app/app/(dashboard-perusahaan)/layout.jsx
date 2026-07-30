import SidebarPerusahaan from "./components/sidebar";
import "../globals.css";

export default function PerusahaanLayout({ children }) {
  return (

  <html>
    <body>    
      <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "#f5f5fb" }}>
          <SidebarPerusahaan />
          <main style={{ flex: 1, overflowY: "auto" }}>
            {children}
          </main>
        </div>
    </body>
  </html>

  );
}