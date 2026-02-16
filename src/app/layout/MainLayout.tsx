import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="h-screen overflow-hidden">
      <Outlet />
    </div>
  );
};

export default MainLayout;
