
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { Layout } from "./components/layout/Layout";
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

// Import resource pages
import Documentation from "./pages/Documentation";
import Tutorials from "./pages/Tutorials";
import Support from "./pages/Support";
import FAQ from "./pages/FAQ";

// Import legal pages
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Security from "./pages/Security";

export default function App() {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
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

            {/* Legal pages */}
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/security" element={<Security />} />

            <Route path="/dashboard" element={<Layout><Index /></Layout>} />
            <Route path="/projects" element={<Layout><ProjectsPageSimple /></Layout>} />
            <Route path="/project/:id" element={<Layout><ProjectDetailsPage /></Layout>} />
            <Route path="/tasks" element={<Layout><TasksPageNew /></Layout>} />
            <Route path="/team" element={<Layout><TeamPage /></Layout>} />
            <Route path="/calendar" element={<Layout><Calendar /></Layout>} />
            <Route path="/calendar-test" element={<Layout><CalendarTest /></Layout>} />
            <Route path="/calendar-simple" element={<Layout><CalendarSimplified /></Layout>} />
            <Route path="/files" element={<Layout><Files /></Layout>} />
            <Route path="/settings" element={<Layout><Settings /></Layout>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
