import type { Metadata } from "next";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: "Meetings | Modern Dashboard",
  description: "Manage your meetings with elegance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="dashboard-container">
          <Sidebar />
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <Header />
            <main className="animate-fade-in">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
