import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock } from "lucide-react";
import { AdminDashboard } from "@/components/AdminDashboard";

const ADMIN_SESSION_KEY = "vsu_alphas_admin_session";

export default function Admin() {
  const [accessCode, setAccessCode] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const session = localStorage.getItem(ADMIN_SESSION_KEY);
    if (session === "authenticated") {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (accessCode === "APA4LIFE$") {
      setIsAuthenticated(true);
      localStorage.setItem(ADMIN_SESSION_KEY, "authenticated");
      setError("");
    } else {
      setError("Invalid access code");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem(ADMIN_SESSION_KEY);
  };

  // Show loading state while checking session
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0047bb] via-[#1a1a1a] to-[#BB8D09] flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-white border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <AdminDashboard onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0047bb] via-[#1a1a1a] to-[#BB8D09] flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-2 border-[#BB8D09]/30">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-[#0047bb] to-[#BB8D09] rounded-full flex items-center justify-center shadow-lg">
            <Lock className="w-10 h-10 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-[#0047bb] via-[#eb7722] to-[#BB8D09] bg-clip-text text-transparent">
            Admin Portal
          </CardTitle>
          <CardDescription className="text-base">
            VSU Alphas Alumni Chapter
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="accessCode" className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Access Code
              </label>
              <Input
                id="accessCode"
                type="password"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                placeholder="Enter admin access code"
                className="border-2 focus:border-[#BB8D09] h-12 text-lg"
                autoFocus
              />
              {error && (
                <p className="text-sm text-destructive font-medium">{error}</p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full h-12 text-lg font-bold bg-gradient-to-r from-[#0047bb] via-[#eb7722] to-[#BB8D09] hover:opacity-90 transition-opacity"
            >
              Access Dashboard
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
