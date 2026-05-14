import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import WaterDelivery from "../../pages/WaterDelivery";
import { Privacy } from "../../pages/Privacy";
import { Agreement } from "../../pages/Agreement";
import { Consent } from "../../pages/Consent";

export const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<MainLayout />}>
      <Route index element={<WaterDelivery />} />
      <Route path="privacy" element={<Privacy />} />
      <Route path="agreement" element={<Agreement />} />
      <Route path="consent" element={<Consent />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Route>
  </Routes>
);
