import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import App from "./App.tsx";
import LoginPage from "./features/pages/login-page.tsx";
import RegisterPage from "./features/pages/register-page.tsx";
import SchedulePage from "./features/pages/schedule-page.tsx";
import "./index.css";
import "./lib/fonts/manrope.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/schedule" element={<SchedulePage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
