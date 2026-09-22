import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--color-surface-alt)" }}>
      {/* Navbar will go here in later phases */}
      <main className="mx-auto max-w-7xl px-4 py-6">
        <Outlet />
      </main>
      {/* Footer will go here in later phases */}
    </div>
  );
};

export default MainLayout;