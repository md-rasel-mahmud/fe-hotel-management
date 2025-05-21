import { Layout } from "@/components/Layout";
import AdminDashboard from "@/pages/AdminDashboard";
import HomePage from "@/pages/HomePage";
import HotelDetailPage from "@/pages/HotelDetailPage";
import HotelsPage from "@/pages/HotelsPage";
import LoginPage from "@/pages/LoginPage";
import NotFound from "@/pages/NotFound";
import UserDashboard from "@/pages/UserDashboard";
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
  {
    path: "",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/hotels",
        element: <HotelsPage />,
      },
      {
        path: "/hotels/:id",
        element: <HotelDetailPage />,
      },

      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/dashboard",
        element: <UserDashboard />,
      },
      {
        path: "/admin",
        element: <AdminDashboard />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);
