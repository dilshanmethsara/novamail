import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail, Copy, Check, RefreshCw, Plus, Clock, Search,
  Inbox, MailOpen, AlertTriangle, Shield, ArrowLeft, Trash2,
  Paperclip, ChevronRight
} from "lucide-react";
import { useEmail } from "@/hooks/useEmail";
import { toast } from "sonner";

const categoryColors: Record<string, string> = {
  verification: "text-primary",
  promo: "text-purple-400",
  alert: "text-amber-400",
  general: "text-muted-foreground",
};

const categoryLabels: Record<string, string> = {
  verification: "Verification",
  promo: "Promo",
  alert: "Alert",
  general: "General",
};

const InboxPage = () => {
  const [selectedEmail, setSelectedEmail] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [search, setSearch] = useState("");
  const [mobileShowReader, setMobileShowReader] = useState(false);

  const {
    account,
    emails,
    loading,
    error,
    sessionTime,
    generateEmail,
    fetchMessages,
    getMessage,
    refreshMessages,
    formatSessionTime,
  } = useEmail();

  // Initialize with a generated email if no account exists
  useEffect(() => {
    if (!account && !loading) {
      generateEmail();
    }
  }, [account, loading, generateEmail]);

  const handleCopy = useCallback(() => {
    if (account?.email) {
      navigator.clipboard.writeText(account.email);
      setCopied(true);
      toast.success("Email address copied!");
      setTimeout(() => setCopied(false), 2000);
    }
  }, [account]);

  const handleRefresh = useCallback(() => {
    refreshMessages();
  }, [refreshMessages]);

  const handleNewEmail = useCallback(() => {
    generateEmail();
    setSelectedEmail(null);
    setMobileShowReader(false);
  }, [generateEmail]);

  const handleSelectEmail = async (email: any) => {
    setSelectedEmail(email);
    setMobileShowReader(true);
    
    // Mark as read by refetching messages
    if (account) {
      await fetchMessages();
    }
  };

  const handleDelete = (id: string) => {
    // In a real implementation, you would call the delete API
    // For now, just remove from local state
    setSelectedEmail(null);
    setMobileShowReader(false);
    toast.success("Email deleted");
  };

  const filteredEmails = emails.filter((e) => {
    if (filter === "unread" && e.read) return false;
    if (filter === "read" && !e.read) return false;
    if (search) {
      const q = search.toLowerCase();
      return e.sender.toLowerCase().includes(q) || e.subject.toLowerCase().includes(q);
    }
    return true;
  });

  const unreadCount = emails.filter((e) => !e.read).length;

  // Show loading state
  if (loading && !account) {
    return (
      <div className="relative min-h-screen pt-16">
        <div className="ambient-bg" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center py-20">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-muted-foreground">Generating your temporary email...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error && !account) {
    return (
      <div className="relative min-h-screen pt-16">
        <div className="ambient-bg" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center py-20">
            <AlertTriangle size={48} className="mx-auto text-destructive mb-4" />
            <p className="text-destructive mb-4">Failed to generate email</p>
            <button onClick={generateEmail} className="btn-glow">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen pt-16">
      <div className="ambient-bg" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Email Address Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-4 sm:p-5 mb-6"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 btn-glow p-0">
                <Mail size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground mb-0.5">Your temporary email</p>
                <p className="font-mono text-sm sm:text-base text-foreground truncate">{account?.email || 'Loading...'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
              <button onClick={handleCopy} className="btn-glow py-2 px-4 text-xs flex-1 sm:flex-none">
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? "Copied!" : "Copy"}
              </button>
              <button onClick={handleRefresh} className="btn-glass py-2 px-3">
                <RefreshCw size={14} className={loading ? "animate-spin-slow" : ""} />
              </button>
              <button onClick={handleNewEmail} className="btn-glass py-2 px-3">
                <Plus size={14} />
              </button>
              <div className="btn-glass py-2 px-3 text-xs gap-1.5 hidden sm:inline-flex">
                <Clock size={12} className="text-primary" />
                {formatSessionTime(sessionTime)}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6"
        >
          {[
            { label: "Total Emails", value: emails.length, icon: Mail },
            { label: "Unread", value: unreadCount, icon: Inbox },
            { label: "Session Time", value: formatSessionTime(sessionTime), icon: Clock },
            { label: "Last Refresh", value: loading ? "Refreshing..." : "Just now", icon: RefreshCw },
          ].map((stat, i) => (
            <div key={i} className="glass-card rounded-xl p-3 flex items-center gap-3">
              <stat.icon size={14} className="text-primary shrink-0" />
              <div>
                <p className="text-[10px] text-muted-foreground">{stat.label}</p>
                <p className="text-sm font-semibold text-foreground">{stat.value}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Main Split Layout */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Inbox List */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`glass-card rounded-2xl overflow-hidden lg:w-[420px] shrink-0 ${mobileShowReader ? "hidden lg:block" : ""}`}
          >
            {/* Toolbar */}
            <div className="p-3 border-b border-border">
              <div className="flex items-center gap-2 mb-3">
                <div className="relative flex-1">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search emails..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-lg border-0 py-2 pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                    style={{ background: "hsl(var(--secondary))" }}
                  />
                </div>
                <div className="flex items-center gap-0.5 text-xs text-muted-foreground">
                  <span className="bg-primary/20 text-primary rounded-full px-2 py-0.5 text-[10px] font-medium">
                    {unreadCount}
                  </span>
                </div>
              </div>
              <div className="flex gap-1">
                {(["all", "unread", "read"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1 rounded-lg text-xs capitalize transition-colors ${
                      filter === f
                        ? "bg-primary/20 text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Email List */}
            <div className="max-h-[500px] overflow-y-auto">
              <AnimatePresence>
                {filteredEmails.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="py-16 text-center"
                  >
                    <Inbox size={32} className="mx-auto text-muted-foreground mb-3" />
                    <p className="text-sm text-muted-foreground">No emails yet</p>
                    <p className="text-xs text-muted-foreground mt-1">Emails will appear here automatically</p>
                  </motion.div>
                ) : (
                  filteredEmails.map((e, i) => (
                    <motion.button
                      key={e.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => handleSelectEmail(e)}
                      className={`w-full text-left p-3 border-b border-border flex items-center gap-3 transition-colors hover:bg-accent/50 ${
                        selectedEmail?.id === e.id ? "bg-accent/50" : ""
                      }`}
                    >
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-semibold shrink-0 ${
                          !e.read ? "btn-glow p-0" : ""
                        }`}
                        style={e.read ? { background: "hsl(var(--secondary))", color: "hsl(var(--muted-foreground))" } : {}}
                      >
                        {e.sender[0]}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className={`text-xs font-medium truncate ${!e.read ? "text-foreground" : "text-muted-foreground"}`}>
                            {e.sender}
                          </span>
                          {!e.read && <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />}
                          <span className={`text-[10px] ml-auto shrink-0 ${categoryColors[e.category]}`}>
                            {categoryLabels[e.category]}
                          </span>
                        </div>
                        <p className={`text-xs truncate ${!e.read ? "text-foreground" : "text-muted-foreground"}`}>{e.subject}</p>
                        <p className="text-[10px] text-muted-foreground truncate mt-0.5">{e.preview}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className="text-[10px] text-muted-foreground">{e.time}</span>
                        <ChevronRight size={12} className="text-muted-foreground" />
                      </div>
                    </motion.button>
                  ))
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Email Reader */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`glass-card rounded-2xl flex-1 min-h-[500px] ${!mobileShowReader && !selectedEmail ? "" : ""} ${mobileShowReader ? "" : "hidden lg:block"}`}
          >
            <AnimatePresence mode="wait">
              {selectedEmail ? (
                <motion.div
                  key={selectedEmail.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="h-full flex flex-col"
                >
                  {/* Reader Header */}
                  <div className="p-4 border-b border-border">
                    <div className="flex items-center justify-between mb-3">
                      <button
                        onClick={() => { setSelectedEmail(null); setMobileShowReader(false); }}
                        className="btn-glass py-1.5 px-3 text-xs lg:hidden"
                      >
                        <ArrowLeft size={14} />
                        Back
                      </button>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            // Toggle read status locally (in real app, would call API)
                            setSelectedEmail({
                              ...selectedEmail,
                              read: !selectedEmail.read
                            });
                            fetchMessages(); // Refresh to get updated status
                          }}
                          className="btn-glass py-1.5 px-3 text-xs"
                        >
                          {selectedEmail.read ? <Mail size={12} /> : <MailOpen size={12} />}
                          {selectedEmail.read ? "Unread" : "Read"}
                        </button>
                        <button
                          onClick={() => handleDelete(selectedEmail.id)}
                          className="btn-glass py-1.5 px-3 text-xs text-destructive"
                        >
                          <Trash2 size={12} />
                          Delete
                        </button>
                      </div>
                    </div>
                    <h2 className="text-lg font-semibold text-foreground mb-2">{selectedEmail.subject}</h2>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-semibold btn-glow p-0">
                        {selectedEmail.sender[0]}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{selectedEmail.sender}</p>
                        <p className="text-xs text-muted-foreground">{selectedEmail.senderEmail}</p>
                      </div>
                      <span className="ml-auto text-xs text-muted-foreground">{selectedEmail.time}</span>
                    </div>
                  </div>

                  {/* Reader Body */}
                  <div className="p-4 sm:p-6 flex-1 overflow-y-auto">
                    {selectedEmail.hasAttachment && (
                      <div className="glass-card rounded-xl p-3 mb-4 flex items-center gap-2 text-xs text-muted-foreground">
                        <Paperclip size={14} className="text-primary" />
                        1 attachment
                      </div>
                    )}
                    <div
                      className="text-sm text-foreground/90 leading-relaxed [&_a]:text-primary [&_a]:underline [&_p]:mb-3"
                      dangerouslySetInnerHTML={{ __html: selectedEmail.body }}
                    />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full flex items-center justify-center p-8"
                >
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-border"
                      style={{ background: "hsl(var(--secondary))" }}>
                      <MailOpen size={24} className="text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">Select an email to read</p>
                    <p className="text-xs text-muted-foreground">Choose a message from the inbox</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default InboxPage;
