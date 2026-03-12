import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, Eye, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

const SuperAdminPage = () => {
  const [showContent, setShowContent] = useState(false);
  const [accessCode, setAccessCode] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleAccess = (e: React.FormEvent) => {
    e.preventDefault();
    if (accessCode === "show-admin-2024") {
      window.location.href = "/admin";
    } else {
      toast.error("Invalid access code");
    }
  };

  if (!showContent) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <Shield size={48} className="mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center">
      <div className="ambient-bg" />
      <div className="relative z-10 max-w-md w-full mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-card rounded-2xl p-8 text-center"
        >
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 btn-glow p-0">
            <Shield size={24} />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Admin Access</h1>
          <p className="text-muted-foreground text-sm mb-6">
            This area is restricted to authorized personnel only
          </p>
          
          <AlertTriangle size={32} className="mx-auto text-amber-400 mb-4" />
          
          <p className="text-xs text-muted-foreground mb-6">
            Unauthorized access attempts are logged and monitored
          </p>

          <form onSubmit={handleAccess} className="space-y-4">
            <input
              type="password"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              placeholder="Enter access code"
              className="w-full px-4 py-3 rounded-lg border-0 bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-center backdrop-blur-sm"
              autoComplete="off"
            />
            <button
              type="submit"
              className="w-full btn-glow py-3 px-4 text-sm font-medium"
            >
              <Eye size={16} className="inline mr-2" />
              Access Dashboard
            </button>
          </form>
          
          {/* Hint */}
          <div className="mt-4 p-3 rounded-lg bg-secondary/30 border border-border">
            <p className="text-xs text-muted-foreground text-center">
              Hint: Access code is <span className="bg-primary/20 text-primary px-1 py-0.5 rounded backdrop-blur-sm select-none">••••-•••••-••••</span>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SuperAdminPage;
