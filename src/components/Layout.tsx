import React from "react";

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navbar removed */}
      <main className="h-full overflow-hidden">{children}</main>
    </div>
  );
}
