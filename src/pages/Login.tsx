
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function Login() {
  const [role, setRole] = useState<"trader" | "admin" | null>(null);
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!role) {
      toast.error("Please select a role to continue");
      return;
    }
    
    // Store user role in session storage
    sessionStorage.setItem("userRole", role);
    
    // Navigate based on role
    if (role === "trader") {
      navigate("/");
      toast.success("Logged in as Trader");
    } else {
      navigate("/admin-dashboard");
      toast.success("Logged in as Admin");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">ReturnoScope</CardTitle>
          <CardDescription>Select your role to continue</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant={role === "trader" ? "default" : "outline"}
              className="h-20 flex flex-col"
              onClick={() => setRole("trader")}
            >
              <span className="text-lg">Trader</span>
              <span className="text-xs mt-1">View market data and trade securities</span>
            </Button>
            <Button
              variant={role === "admin" ? "default" : "outline"}
              className="h-20 flex flex-col"
              onClick={() => setRole("admin")}
            >
              <span className="text-lg">Admin</span>
              <span className="text-xs mt-1">Manage platform and users</span>
            </Button>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleLogin}>
            Continue
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
