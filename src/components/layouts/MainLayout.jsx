import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../ui/Header/Header";
import CookieBanner from "../ui/CookieBanner/CookieBanner";
import usePhoneTracking from "../../hooks/usePhoneTracking";

export const MainLayout = () => {
  usePhoneTracking();

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Outlet />
      </main>
      <CookieBanner />
    </div>
  );
};
