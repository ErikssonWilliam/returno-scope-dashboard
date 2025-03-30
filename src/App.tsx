
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Market from "./pages/Market";
import FinancialNews from "./pages/FinancialNews";
import Forecasting from "./pages/Forecasting";
import Portfolio from "./pages/Portfolio";
import Performance from "./pages/Performance";
import Analysis from "./pages/Analysis";
import Valuation from "./pages/Valuation";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";

const queryClient = new QueryClient();

// Route guard component
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const role = sessionStorage.getItem("userRole");
    setUserRole(role);
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userRole) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={
            <PrivateRoute>
              <Index />
            </PrivateRoute>
          } />
          
          <Route path="/market" element={
            <PrivateRoute>
              <Market />
            </PrivateRoute>
          } />
          
          <Route path="/financial-news" element={
            <PrivateRoute>
              <FinancialNews />
            </PrivateRoute>
          } />
          
          <Route path="/portfolio" element={
            <PrivateRoute>
              <Portfolio />
            </PrivateRoute>
          } />
          
          <Route path="/performance" element={
            <PrivateRoute>
              <Performance />
            </PrivateRoute>
          } />
          
          <Route path="/analysis" element={
            <PrivateRoute>
              <Analysis />
            </PrivateRoute>
          } />
          
          <Route path="/forecasting" element={
            <PrivateRoute>
              <Forecasting />
            </PrivateRoute>
          } />
          
          <Route path="/valuation" element={
            <PrivateRoute>
              <Valuation />
            </PrivateRoute>
          } />
          
          <Route path="/admin-dashboard" element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          } />
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
