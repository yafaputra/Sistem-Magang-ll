// app/layout.jsx  (atau app/(dashboard)/layout.jsx jika pakai route group)

import Sidebar from "./components/sidebar";
import "../globals.css";

export default function DashboardLayout({ children }) {
  return (
 <html>
      <body>
        <div style={{ display: "flex", minHeight: "100vh" }}>
          <Sidebar />
          <main style={{ flex: 1 }}>
            {children}
          </main>
         </div>
      </body>
    </html>
  );
}