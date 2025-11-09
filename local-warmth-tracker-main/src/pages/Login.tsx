import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GlassCard } from "@/components/GlassCard";
import { Thermometer } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { FcGoogle } from "react-icons/fc";

const Login = () => {
  const { loginWithRedirect, isAuthenticated } = useAuth0();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  // 🔹 Step 1: Redirect if already logged in
  if (isAuthenticated) {
    window.location.href = "/area-selection";
    return null;
  }



  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // TODO: Replace with actual Django API call
    if (username && password) {
      // Simulated login - replace with actual API call to Django backend
      toast({
        title: "Login Successful",
        description: "Welcome to Campusense",
      });
      navigate("/area-selection");
    } else {
      toast({
        title: "Login Failed",
        description: "Please enter valid credentials",
        variant: "destructive",
      });
    }
  };

const handleGoogleLogin = () => loginWithRedirect();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-cold p-4">
      <GlassCard className="w-full max-w-md p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full bg-primary/10">
              <Thermometer className="w-12 h-12 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground">CampuSense</h1>
          {/*<p className="text-muted-foreground">Sign in to access your monitoring dashboard</p>*/}
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-foreground">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-white/50 border-white/30 backdrop-blur-sm"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-foreground">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white/50 border-white/30 backdrop-blur-sm"
              required
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
          >
            Sign In
          </Button>
        </form>
	        <div className="flex items-center justify-center gap-2 text-muted-foreground my-2">
          <span className="border-t flex-1 border-gray-300"></span>
          <span>OR</span>
          <span className="border-t flex-1 border-gray-300"></span>
        </div>

        {/* Google / Auth0 login button */}
        <Button
          onClick={handleGoogleLogin}
          className="w-full bg-white/80 hover:bg-white/90 text-black flex items-center justify-center gap-2"
        >
          <FcGoogle className="w-5 h-5" />
          Sign in with Google
        </Button>

      </GlassCard>
    </div>
  );
};

export default Login;
