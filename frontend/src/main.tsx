import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import App from "./App.tsx";
import AdminPage from "./features/pages/admin-page.tsx";
import AppointmentsPage from "./features/pages/appointments-page.tsx";
import CreateBarberPage from "./features/pages/create-barber-page.tsx";
import CreateSpecialtyPage from "./features/pages/create-specialty-page.tsx";
import LoginPage from "./features/pages/login-page.tsx";
import RegisterPage from "./features/pages/register-page.tsx";
import SchedulePage from "./features/pages/schedule-page.tsx";
import QueryProvider from "./features/query-provider.tsx";
import "./index.css";
import "./lib/fonts/manrope.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/specialty/new" element={<CreateSpecialtyPage />} />
          <Route path="/barber/new" element={<CreateBarberPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/me/appointments" element={<AppointmentsPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </BrowserRouter>
    </QueryProvider>
  </StrictMode>,
);
