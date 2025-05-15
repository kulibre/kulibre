
import { Header } from "./Header";
import { MobileNavigation } from "./MobileNavigation";
import { Sidebar } from "./Sidebar";
import { Toaster } from "@/components/ui/toaster";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center gap-2 md:hidden p-4 border-b">
          <MobileNavigation />
          <div className="flex items-center gap-2">
            <div className="bg-kulibre-purple rounded-lg w-8 h-8 flex items-center justify-center">
              <span className="text-white font-bold">K</span>
            </div>
            <h1 className="text-xl font-bold">kulibre</h1>
          </div>
        </div>
        <Header />
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
      <Toaster />
    </div>
  );
}
