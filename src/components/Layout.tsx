import React from "react";

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 text-slate-900">
      {/* Soft background blobs */}
      <div className="pointer-events-none fixed inset-0 opacity-70">
        <div className="absolute -top-32 -left-24 h-72 w-72 rounded-full bg-blue-200 blur-3xl" />
        <div className="absolute -bottom-32 -right-24 h-72 w-72 rounded-full bg-cyan-200 blur-3xl" />
      </div>

      <main className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-3 py-4 sm:px-6 sm:py-6">
        {children}
      </main>
    </div>
  );
}
