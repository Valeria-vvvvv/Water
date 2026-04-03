import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../ui/Header/Header";
import CookieBanner from "../ui/CookieBanner/CookieBanner";

export const MainLayout = () => {
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
