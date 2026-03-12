import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users, Globe, Mail, Eye, Activity, Clock, TrendingUp,
  MapPin, Server, AlertCircle, BarChart3, RefreshCw, Search,
  Filter, Download, Calendar, Shield, LogOut
} from "lucide-react";
import { toast } from "sonner";
import AdminAuth from "@/components/AdminAuth";

const API_BASE_URL = 'http://localhost:5000';
const ADMIN_KEY = 'nova-mail-admin-2024';

interface DashboardStats {
  totalRequests24h: number;
  uniqueIPs24h: number;
  emailsGenerated24h: number;
  messagesFetched24h: number;
  messagesViewed24h: number;
  activeSessions: number;
  topCountries: Array<{ country: string; count: number }>;
  recentActivity: Array<{
    timestamp: string;
    ip: string;
    endpoint: string;
    event?: string;
  }>;
}

interface IPInfo {
  ip: string;
  firstSeen: string;
  lastSeen: string;
  requestCount: number;
  endpoints: string[];
  events: string[];
  geolocation: {
    country: string;
    region: string;
    city: string;
    latitude: number;
    longitude: number;
    isp: string;
  };
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [ips, setIps] = useState<IPInfo[]>([]);
  const [selectedIP, setSelectedIP] = useState<IPInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"overview" | "ips" | "analytics">("overview");
  const [adminKey, setAdminKey] = useState("");

  // Get admin key from session storage
  useEffect(() => {
    const storedKey = sessionStorage.getItem("adminKey");
    if (storedKey) {
      setAdminKey(storedKey);
    }
  }, []);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    if (!adminKey) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/admin/dashboard?adminKey=${adminKey}`);
      const data = await response.json();
      
      if (data.success) {
        setStats(data.data);
      } else {
        throw new Error(data.error || 'Failed to fetch dashboard data');
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to fetch dashboard data');
    }
  };

  // Fetch all IPs
  const fetchIPs = async () => {
    if (!adminKey) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/admin/ips?adminKey=${adminKey}`);
      const data = await response.json();
      
      if (data.success) {
        setIps(data.data.ips);
      } else {
        throw new Error(data.error || 'Failed to fetch IP data');
      }
    } catch (error) {
      console.error('Error fetching IP data:', error);
      toast.error('Failed to fetch IP data');
    }
  };

  // Fetch detailed IP information
  const fetchIPDetails = async (ip: string) => {
    if (!adminKey) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/admin/ips/${ip}?adminKey=${adminKey}`);
      const data = await response.json();
      
      if (data.success) {
        setSelectedIP(data.data);
      } else {
        throw new Error(data.error || 'Failed to fetch IP details');
      }
    } catch (error) {
      console.error('Error fetching IP details:', error);
      toast.error('Failed to fetch IP details');
    }
  };

  // Handle logout
  const handleLogout = () => {
    sessionStorage.removeItem("adminKey");
    setAdminKey("");
    setStats(null);
    setIps([]);
    setSelectedIP(null);
    toast.success("Logged out successfully");
  };

  // Initialize data
  useEffect(() => {
    if (!adminKey) return;
    
    const initializeData = async () => {
      setLoading(true);
      await fetchDashboardData();
      await fetchIPs();
      setLoading(false);
    };

    initializeData();

    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchDashboardData();
      fetchIPs();
    }, 30000);

    return () => clearInterval(interval);
  }, [adminKey]);

  // Filter IPs based on search
  const filteredIPs = ips.filter(ip =>
    ip.ip.includes(searchTerm) ||
    ip.geolocation.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ip.geolocation.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // If not authenticated, show login screen
  if (!adminKey) {
    return <AdminAuth><AdminDashboard /></AdminAuth>;
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16">
      <div className="ambient-bg" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Monitor Nova Mail usage and analytics</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="btn-glass py-2 px-3 text-xs flex items-center gap-2">
              <Shield size={14} className="text-primary" />
              Admin Access
            </div>
            <button 
              onClick={handleLogout}
              className="btn-glass py-2 px-3 text-xs flex items-center gap-2 text-destructive hover:text-destructive"
            >
              <LogOut size={14} />
              Logout
            </button>
            <button 
              onClick={() => {
                fetchDashboardData();
                fetchIPs();
                toast.info('Dashboard refreshed');
              }}
              className="btn-glass py-2 px-3 text-xs"
            >
              <RefreshCw size={14} />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-1 mb-6">
          {[
            { id: "overview", label: "Overview", icon: BarChart3 },
            { id: "ips", label: "IP Addresses", icon: Globe },
            { id: "analytics", label: "Analytics", icon: TrendingUp }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors ${
                activeTab === tab.id
                  ? "bg-primary/20 text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && stats && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Total Requests (24h)", value: stats.totalRequests24h, icon: Activity, color: "text-blue-400" },
                { label: "Unique IPs (24h)", value: stats.uniqueIPs24h, icon: Users, color: "text-green-400" },
                { label: "Emails Generated", value: stats.emailsGenerated24h, icon: Mail, color: "text-purple-400" },
                { label: "Active Sessions", value: stats.activeSessions, icon: Eye, color: "text-orange-400" }
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card rounded-xl p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <stat.icon size={16} className={stat.color} />
                    <span className="text-xs text-muted-foreground">Last 24h</span>
                  </div>
                  <div className="text-2xl font-bold text-foreground">{stat.value.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Top Countries & Recent Activity */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Top Countries */}
              <div className="glass-card rounded-xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Globe size={16} className="text-primary" />
                  Top Countries
                </h3>
                <div className="space-y-3">
                  {stats.topCountries.map((country, i) => (
                    <div key={country.country} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium text-primary">
                          {i + 1}
                        </div>
                        <span className="text-sm text-foreground">{country.country}</span>
                      </div>
                      <span className="text-sm font-medium text-primary">{country.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="glass-card rounded-xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Clock size={16} className="text-primary" />
                  Recent Activity
                </h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {stats.recentActivity.map((activity, i) => (
                    <div key={i} className="flex items-center gap-3 text-xs">
                      <div className="w-2 h-2 rounded-full bg-primary/50" />
                      <span className="text-muted-foreground">
                        {new Date(activity.timestamp).toLocaleTimeString()}
                      </span>
                      <span className="text-foreground font-mono">{activity.ip}</span>
                      <span className="text-muted-foreground">{activity.endpoint}</span>
                      {activity.event && (
                        <span className="bg-primary/20 text-primary rounded px-1.5 py-0.5">
                          {activity.event}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* IP Addresses Tab */}
        {activeTab === "ips" && (
          <div className="space-y-6">
            {/* Search Bar */}
            <div className="glass-card rounded-xl p-4">
              <div className="flex items-center gap-3">
                <Search size={16} className="text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search by IP, country, or city..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
                <div className="text-sm text-muted-foreground">
                  {filteredIPs.length} IPs found
                </div>
              </div>
            </div>

            {/* IP List */}
            <div className="glass-card rounded-xl overflow-hidden">
              <div className="max-h-96 overflow-y-auto">
                {filteredIPs.map((ip, i) => (
                  <div
                    key={ip.ip}
                    onClick={() => fetchIPDetails(ip.ip)}
                    className="p-4 border-b border-border hover:bg-accent/50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-xs font-medium text-primary">
                          {i + 1}
                        </div>
                        <div>
                          <div className="font-mono text-sm text-foreground">{ip.ip}</div>
                          <div className="text-xs text-muted-foreground">
                            {ip.geolocation.city}, {ip.geolocation.country}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-foreground">{ip.requestCount}</div>
                        <div className="text-xs text-muted-foreground">requests</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* IP Details Modal */}
            {selectedIP && (
              <div className="glass-card rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground">IP Details</h3>
                  <button
                    onClick={() => setSelectedIP(null)}
                    className="btn-glass py-1.5 px-3 text-xs"
                  >
                    Close
                  </button>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">IP Address</div>
                      <div className="font-mono text-sm text-foreground">{selectedIP.ip}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Location</div>
                      <div className="text-sm text-foreground">
                        {selectedIP.geolocation.city}, {selectedIP.geolocation.region}, {selectedIP.geolocation.country}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">ISP</div>
                      <div className="text-sm text-foreground">{selectedIP.geolocation.isp}</div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">First Seen</div>
                      <div className="text-sm text-foreground">
                        {new Date(selectedIP.firstSeen).toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Last Seen</div>
                      <div className="text-sm text-foreground">
                        {new Date(selectedIP.lastSeen).toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Total Requests</div>
                      <div className="text-sm text-foreground">{selectedIP.requestCount}</div>
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <div className="text-xs text-muted-foreground mb-2">Endpoints Used</div>
                  <div className="flex flex-wrap gap-2">
                    {selectedIP.endpoints.map((endpoint) => (
                      <span key={endpoint} className="bg-secondary text-secondary-foreground rounded px-2 py-1 text-xs">
                        {endpoint}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <div className="glass-card rounded-xl p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Analytics Overview</h3>
            <div className="text-center py-12">
              <BarChart3 size={48} className="mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-2">Advanced analytics coming soon</p>
              <p className="text-xs text-muted-foreground">Detailed usage patterns and trends</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
