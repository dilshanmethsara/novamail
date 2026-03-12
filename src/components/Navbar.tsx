import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Shield, Menu, X } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isLanding = location.pathname === "/";

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-border"
      style={{ background: "hsl(220 40% 5% / 0.8)", backdropFilter: "blur(16px)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center btn-glow p-0">
              <Shield size={16} />
            </div>
            <span className="font-semibold text-foreground tracking-tight text-lg">
              Nova<span className="glow-text">Mail</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {isLanding ? (
              <>
                <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
                <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How it Works</a>
                <a href="#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">FAQ</a>
              </>
            ) : (
              <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Home</Link>
            )}
            <Link to="/inbox" className="btn-glow text-xs py-2 px-4">
              <Mail size={14} />
              Open Inbox
            </Link>
          </div>

          <button
            className="md:hidden text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden border-t border-border"
          style={{ background: "hsl(220 40% 5% / 0.95)" }}
        >
          <div className="px-4 py-4 flex flex-col gap-3">
            {isLanding && (
              <>
                <a href="#features" onClick={() => setMobileOpen(false)} className="text-sm text-muted-foreground py-2">Features</a>
                <a href="#how-it-works" onClick={() => setMobileOpen(false)} className="text-sm text-muted-foreground py-2">How it Works</a>
                <a href="#faq" onClick={() => setMobileOpen(false)} className="text-sm text-muted-foreground py-2">FAQ</a>
              </>
            )}
            <Link to="/inbox" onClick={() => setMobileOpen(false)} className="btn-glow text-xs py-2 px-4 text-center">
              <Mail size={14} />
              Open Inbox
            </Link>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
