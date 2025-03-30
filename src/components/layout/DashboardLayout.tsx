
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { BarChart3, Home, PieChart, TrendingUp, LineChart, NewspaperIcon, DollarSign, Calculator, LogOut } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [userRole, setUserRole] = useState<string | null>(null);
  
  useEffect(() => {
    const role = sessionStorage.getItem("userRole");
    setUserRole(role);
  }, []);

  const navigate = useNavigate();
  
  const handleLogout = () => {
    sessionStorage.removeItem("userRole");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-slate-50">
        <AppSidebar userRole={userRole} />
        
        <main className="flex-1 overflow-auto">
          <div className="p-4 sm:p-6 flex items-center justify-between">
            <div className="flex items-center">
              <SidebarTrigger />
              <div className="ml-4">
                <span className="text-xl font-semibold text-slate-800">ReturnoScope</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {userRole && (
                <>
                  <span className="text-sm bg-slate-200 px-2 py-1 rounded-md capitalize">
                    {userRole}
                  </span>
                  <Button variant="ghost" size="icon" onClick={handleLogout}>
                    <LogOut className="h-5 w-5" />
                  </Button>
                </>
              )}
            </div>
          </div>
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
};

interface AppSidebarProps {
  userRole: string | null;
}

const AppSidebar = ({ userRole }: AppSidebarProps) => {
  const location = useLocation();
  const pathname = location.pathname;
  const isAdmin = userRole === "admin";

  // Menu items for traders
  const traderItems = [
    {
      title: "Dashboard",
      url: "/",
      icon: Home,
    },
    {
      title: "Market",
      url: "/market",
      icon: DollarSign,
    },
    {
      title: "Financial News",
      url: "/financial-news",
      icon: NewspaperIcon,
    },
    {
      title: "Portfolio",
      url: "/portfolio",
      icon: PieChart,
    },
    {
      title: "Performance",
      url: "/performance",
      icon: TrendingUp,
    },
    {
      title: "Analysis",
      url: "/analysis",
      icon: BarChart3,
    },
    {
      title: "Forecasting",
      url: "/forecasting",
      icon: LineChart,
    },
    {
      title: "Valuation",
      url: "/valuation",
      icon: Calculator,
    },
  ];

  // Menu items for admins
  const adminItems = [
    {
      title: "Admin Dashboard",
      url: "/admin-dashboard",
      icon: Home,
    },
  ];

  // Choose items based on role
  const items = isAdmin ? adminItems : traderItems;

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    isActive={pathname === item.url}
                  >
                    <Link to={item.url} className="flex items-center">
                      <item.icon className="h-5 w-5 mr-3" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
