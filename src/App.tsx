import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import AppLayout from "@/components/AppLayout";
import Navbar from "@/components/Navbar";
import Index from "./pages/Index";
import Avatars from "./pages/Avatars";
import Properties from "./pages/Properties";
import Visits from "./pages/Visits";
import Leads from "./pages/Leads";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import Pricing from "./pages/Pricing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import AgentChatPage from "./pages/AgentChatPage";
import AcceptInvitePage from "./pages/AcceptInvitePage";
import Footer from "./components/Footer";
import { useEffect } from "react";
import Dashboard from "./components/Dasboard";

const queryClient = new QueryClient();

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/pricing" element={
              <>
               
                <Pricing />
                <Footer />
              </>
            } />
            <Route path="/login" element={
              <>
                <Navbar />
                <Login />
                    <Footer />
              </>
            } />
            <Route path="/signup" element={
              <>
                <Navbar />
                <Signup />
                    <Footer />
              </>
            } />
            <Route path="/accept-invite" element={<AcceptInvitePage />} />
            <Route path="/agent/:id" element={<AgentChatPage />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/avatars" element={<Avatars />} />
                <Route path="/properties" element={<Properties />} />
                <Route path="/visits" element={<Visits />} />
                <Route
                  element={
                    <ProtectedRoute
                      allowedRoles={["owner", "admin", "member", "agent", "individual"]}
                    />
                  }
                >
                  <Route path="/leads" element={<Leads />} />
                </Route>
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/settings" element={<Settings />} />
              </Route>
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
