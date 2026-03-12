import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Eye, EyeOff, Lock } from "lucide-react";
import { toast } from "sonner";

interface AdminAuthProps {
  children: React.ReactNode;
}

const AdminAuth: React.FC<AdminAuthProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminKey, setAdminKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!adminKey.trim()) {
      toast.error("Please enter the admin key");
      return;
    }

    setLoading(true);
    
    try {
      // Test the admin key by calling a protected endpoint
      const response = await fetch(`http://localhost:5000/admin/dashboard?adminKey=${adminKey}`);
      
      if (response.ok) {
        setIsAuthenticated(true);
        toast.success("Admin access granted");
        // Store in session storage for convenience
        sessionStorage.setItem("adminKey", adminKey);
      } else {
        const data = await response.json();
        throw new Error(data.error || "Invalid admin key");
      }
    } catch (error) {
      console.error("Admin auth error:", error);
      toast.error(error instanceof Error ? error.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  // Check if already authenticated on mount
  useState(() => {
    const storedKey = sessionStorage.getItem("adminKey");
    if (storedKey) {
      setAdminKey(storedKey);
      // Verify the stored key is still valid
      fetch(`http://localhost:5000/admin/dashboard?adminKey=${storedKey}`)
        .then(response => {
          if (response.ok) {
            setIsAuthenticated(true);
          } else {
            sessionStorage.removeItem("adminKey");
          }
        })
        .catch(() => {
          sessionStorage.removeItem("adminKey");
        });
    }
  });

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center">
      <div className="ambient-bg" />
      <div className="relative z-10 max-w-md w-full mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-card rounded-2xl p-8"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 btn-glow p-0">
              <Shield size={24} />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Admin Access</h1>
            <p className="text-muted-foreground text-sm">
              Enter your admin key to access the dashboard
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="adminKey" className="block text-sm font-medium text-foreground mb-2">
                Admin Key
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type={showKey ? "text" : "password"}
                  id="adminKey"
                  value={adminKey}
                  onChange={(e) => setAdminKey(e.target.value)}
                  placeholder="Enter admin key"
                  className="w-full pl-10 pr-12 py-3 rounded-lg border-0 bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  autoComplete="off"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !adminKey.trim()}
              className="w-full btn-glow py-3 px-4 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  <Shield size={16} />
                  Access Dashboard
                </>
              )}
            </button>
          </form>

          {/* Help Text */}
          <div className="mt-6 p-4 rounded-lg bg-secondary/50 border border-border">
            <p className="text-xs text-muted-foreground text-center">
              Default admin key: <code className="bg-primary/20 text-primary px-1 py-0.5 rounded backdrop-blur-sm select-none">•••••••••••••••</code>
            </p>
            <p className="text-xs text-muted-foreground text-center mt-1">
              Configure this in your backend environment variables
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminAuth;
