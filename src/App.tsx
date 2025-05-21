import * as React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import NotFound from "./pages/NotFound";
import HomePage from "./pages/HomePage";
import HotelsPage from "./pages/HotelsPage";
import HotelDetailPage from "./pages/HotelDetailPage";
import LoginPage from "./pages/LoginPage";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ProviderWrapper from "@/contexts/ProviderWrapper";

const App: React.FC = () => (
  <React.StrictMode>
    <ProviderWrapper>
      <Toaster />
      <Sonner />
    </ProviderWrapper>
  </React.StrictMode>
);

export default App;
