import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Layout } from "./components/layout/Layout";
import CustomCursor from "./components/ui/custom-cursor";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { AuthProvider } from "./lib/auth";
import Index from "./pages/Index";
import ProjectsPageSimple from "./pages/ProjectsPageSimple";
import ProjectDetailsPage from "./pages/ProjectDetailsPage";
import Calendar from "./pages/Calendar";
import CalendarTest from "./pages/CalendarTest";
import CalendarSimplified from "./pages/CalendarSimplified";
import TasksPage from "./pages/TasksPage";
import TasksPageDebug from "./pages/TasksPage.debug";
import TasksPageNew from "./pages/TasksPage.new";
import TeamPage from "./pages/TeamPage";
import Files from "./pages/Files";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

// Import new pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import SelectPlan from "./pages/SelectPlan";
import About from "./pages/About";
import Careers from "./pages/Careers";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import AuthCallback from "./pages/AuthCallback";

// Import resource pages
import Documentation from "./pages/Documentation";
import Tutorials from "./pages/Tutorials";
import Support from "./pages/Support";
import FAQ from "./pages/FAQ";

// Import legal pages
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Security from "./pages/Security";
import RefundPolicy from "./pages/RefundPolicy";

// Add this to your imports
import Analytics from "./pages/Analytics";
import PricingPage from './pages/Pricing';

export function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <CustomCursor />
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <ScrollToTop />
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                <Route path="/select-plan" element={<SelectPlan />} />
                <Route path="/about" element={<About />} />
                <Route path="/careers" element={<Careers />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/contact" element={<Contact />} />

                {/* Resource pages */}
                <Route path="/documentation" element={<Documentation />} />
                <Route path="/tutorials" element={<Tutorials />} />
                <Route path="/support" element={<Support />} />
                <Route path="/faq" element={<FAQ />} />

                {/* Dashboard routes */}
                <Route path="/dashboard" element={<Layout><Index /></Layout>} />
                <Route path="/projects" element={<Layout><ProjectsPageSimple /></Layout>} />
                <Route path="/projects/:id" element={<Layout><ProjectDetailsPage /></Layout>} />
                <Route path="/tasks" element={<Layout><TasksPage /></Layout>} />
                <Route path="/team" element={<Layout><TeamPage /></Layout>} />
                <Route path="/calendar" element={<Layout><Calendar /></Layout>} />
                <Route path="/analytics" element={<Layout><Analytics /></Layout>} />
                <Route path="/files" element={<Layout><Files /></Layout>} />
                <Route path="/settings" element={<Layout><Settings /></Layout>} />
                
                {/* Legal pages */}
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/security" element={<Security />} />
                <Route path="/refund-policy" element={<RefundPolicy />} />
                
                <Route path="/pricing" element={<PricingPage />} />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
