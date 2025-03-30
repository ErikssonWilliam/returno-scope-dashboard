
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { KeyRound, ShieldCheck, User, ArrowRight } from "lucide-react";

export default function Login() {
  const [role, setRole] = useState<"trader" | "admin" | null>(null);
  const [username, setUsername] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!role) {
      toast.error("Please select a role to continue");
      return;
    }

    if (!username.trim()) {
      toast.error("Please enter a username");
      return;
    }
    
    setLoading(true);
    
    // Simulate loading
    setTimeout(() => {
      // Store user role and username in session storage
      sessionStorage.setItem("userRole", role);
      sessionStorage.setItem("username", username);
      
      if (rememberMe) {
        localStorage.setItem("rememberedUsername", username);
      }
      
      // Navigate based on role
      if (role === "trader") {
        navigate("/");
        toast.success(`Welcome, ${username}! Logged in as Trader`);
      } else {
        navigate("/admin-dashboard");
        toast.success(`Welcome, ${username}! Logged in as Admin`);
      }
      
      setLoading(false);
    }, 800);
  };

  // Set remembered username if available
  useState(() => {
    const remembered = localStorage.getItem("rememberedUsername");
    if (remembered) {
      setUsername(remembered);
      setRememberMe(true);
    }
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-slate-50 to-blue-50">
      <div className="w-full max-w-md px-4">
        <Card className="w-full backdrop-blur-sm bg-white/90 shadow-xl border-none">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
              <KeyRound className="h-8 w-8 text-indigo-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-indigo-800">ReturnoScope</CardTitle>
            <CardDescription className="text-slate-600">
              Advanced financial analytics platform
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <User className="h-4 w-4 text-slate-400" />
                </div>
                <Input 
                  id="username" 
                  placeholder="Enter your username" 
                  className="pl-10"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-3">
              <Label className="block mb-2">Select your role</Label>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  type="button"
                  variant={role === "trader" ? "default" : "outline"}
                  className={`h-24 flex flex-col items-center justify-center text-left transition-all ${
                    role === "trader" 
                      ? "bg-indigo-600 hover:bg-indigo-700 text-white" 
                      : "hover:border-indigo-300 hover:bg-indigo-50"
                  }`}
                  onClick={() => setRole("trader")}
                >
                  <User className={`h-6 w-6 mb-2 ${role === "trader" ? "text-white" : "text-indigo-600"}`} />
                  <span className="text-lg font-medium">Trader</span>
                  <span className="text-xs mt-1">Market access & analysis</span>
                </Button>
                
                <Button
                  type="button"
                  variant={role === "admin" ? "default" : "outline"}
                  className={`h-24 flex flex-col items-center justify-center text-left transition-all ${
                    role === "admin" 
                      ? "bg-indigo-600 hover:bg-indigo-700 text-white" 
                      : "hover:border-indigo-300 hover:bg-indigo-50"
                  }`}
                  onClick={() => setRole("admin")}
                >
                  <ShieldCheck className={`h-6 w-6 mb-2 ${role === "admin" ? "text-white" : "text-indigo-600"}`} />
                  <span className="text-lg font-medium">Admin</span>
                  <span className="text-xs mt-1">Platform management</span>
                </Button>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="remember" 
                checked={rememberMe}
                onCheckedChange={(checked) => {
                  setRememberMe(checked === true);
                }}
              />
              <label 
                htmlFor="remember" 
                className="text-sm text-slate-600 cursor-pointer"
              >
                Remember username
              </label>
            </div>
          </CardContent>
          
          <CardFooter className="pt-2">
            <Button 
              onClick={handleLogin} 
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center transition-all"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Signing in...
                </div>
              ) : (
                <>
                  Login <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
        
        <div className="text-center mt-4 text-sm text-slate-500">
          <p>Demo platform - Use any username to continue</p>
        </div>
      </div>
    </div>
  );
}
