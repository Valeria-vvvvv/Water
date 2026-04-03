import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import { Home } from "../../pages/Home";
import { Products } from "../../pages/Products";
import { ProductDetails } from "../../pages/ProductDetails";
import { ServiceCategory } from "../../pages/ServiceCategory";
import { ServiceDetails } from "../../pages/ServiceDetails";
import { Prices } from "../../pages/Prices";
import { Privacy } from "../../pages/Privacy";
import { Agreement } from "../../pages/Agreement";
import { Consent } from "../../pages/Consent";

/** Массив роутов приложения */
const routes = [
  { path: "/", element: <Home /> },
  { path: "/products", element: <Products /> },
  { path: "/prices", element: <Prices /> },
  { path: "/privacy", element: <Privacy /> },
  { path: "/agreement", element: <Agreement /> },
  { path: "/consent", element: <Consent /> },
  { path: "/products/:id", element: <ProductDetails /> },
  { path: "/services/:categoryId", element: <ServiceCategory /> },
  { path: "/services/:categoryId/:serviceId", element: <ServiceDetails /> },
];

/**
 * Рекурсивно отображает роуты и дочерние роуты.
 * @param {RouteItem} route - Объект роута.
 */
const renderRoute = ({ path, element, children }) => (
  <Route key={path} path={path} element={element}>
    {children && children.map(renderRoute)}
  </Route>
);

/** Корневой компонент приложения с роутами */
export const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<MainLayout />}>
      {routes.map(renderRoute)}
    </Route>
  </Routes>
);
