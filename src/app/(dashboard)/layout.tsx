import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar"; // ✅ Import your sidebar component

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <AppSidebar /> 
      <SidebarInset className="bg-accent/20">
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Layout;
