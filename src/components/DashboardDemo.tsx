/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Plus,
  Trash2,
  Terminal,
  Play,
  RotateCcw,
  Sliders,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Zap,
  Activity,
  Coins,
  Link as LinkIcon,
  ChevronDown,
  Info,
  Rocket,
  Home,
  Users,
  Shield,
  Calendar,
  BookOpen,
  Award,
  Bell,
  HelpCircle,
  Compass,
  Briefcase,
  Search,
  Clock,
  Sparkles,
  Check,
  Percent,
  X,
  PlusCircle,
  DollarSign,
  Lock,
  Eye,
  EyeOff,
  Key,
  ShieldCheck
} from 'lucide-react';
import { TradingAccount, TradeOrder, CopyLog, PlatformType } from '../types';
import { INITIAL_ACCOUNTS, INITIAL_TRADES, INITIAL_LOGS } from '../mockData';
import JournalingDashboard from './JournalingDashboard';
import JournalingTrades from './JournalingTrades';
import JournalingDaily from './JournalingDaily';
import JournalingWeekly from './JournalingWeekly';
import PropDiscounts from './PropDiscounts';
import PropExpense from './PropExpense';

type TabId = 
  | 'get-started' 
  | 'home' 
  | 'connections' 
  | 'cockpit' 
  | 'groups' 
  | 'risk' 
  | 'calendar' 
  | 'journaling-dashboard' 
  | 'journaling-trades' 
  | 'journaling-daily' 
  | 'journaling-weekly' 
  | 'journaling-strategy' 
  | 'journaling-managedata' 
  | 'prop-discounts' 
  | 'prop-expense' 
  | 'affiliate' 
  | 'settings';

interface DashboardDemoProps {
  theme: 'light' | 'dark';
  onBackToLanding: () => void;
  preferredPlanName?: string;
}

export default function DashboardDemo({ theme, onBackToLanding, preferredPlanName }: DashboardDemoProps) {
  const isDark = theme === 'dark';

  // --- CORE APPLICATION STATES ---
  const [activeTab, setActiveTab] = useState<TabId>('get-started');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [journalingOpen, setJournalingOpen] = useState(true);
  const [propFirmsOpen, setPropFirmsOpen] = useState(true);
  
  // Simulation persistent database
  const [accounts, setAccounts] = useState<TradingAccount[]>(() => {
    const saved = localStorage.getItem('tradeplus_accounts');
    return saved ? JSON.parse(saved) : INITIAL_ACCOUNTS;
  });
  
  const [trades, setTrades] = useState<TradeOrder[]>(() => {
    const saved = localStorage.getItem('tradeplus_trades');
    return saved ? JSON.parse(saved) : INITIAL_TRADES;
  });
  
  const [logs, setLogs] = useState<CopyLog[]>(() => {
    const saved = localStorage.getItem('tradeplus_logs');
    return saved ? JSON.parse(saved) : INITIAL_LOGS;
  });

  // --- SUBSCRIPTION STATE ---
  const [selectedPlan, setSelectedPlan] = useState<string>(() => {
    return preferredPlanName || localStorage.getItem('tradeplus_selected_plan') || 'Plus Elite';
  });

  // --- AVAILABLE CREDITS STATE ---
  const [credits, setCredits] = useState<number>(() => {
    const saved = localStorage.getItem('tradeplus_credits');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [isRefreshingCredits, setIsRefreshingCredits] = useState(false);

  // --- RISK MANAGEMENT STATES ---
  const [riskDailyLimit, setRiskDailyLimit] = useState<number>(3000);
  const [riskMaxDrawdown, setRiskMaxDrawdown] = useState<number>(8); // 8% Default
  const [riskSlippageBuffer, setRiskSlippageBuffer] = useState<number>(1.5); // 1.5 Pips Default
  const [restrictedSymbols, setRestrictedSymbols] = useState<string[]>(['BTCUSD']);
  const [isRiskConfigured, setIsRiskConfigured] = useState<boolean>(false);
  const [customMultipliers, setCustomMultipliers] = useState<Record<string, number>>({});

  // --- ECONOMIC NEWS STATES ---
  const [newsSpikeProtection, setNewsSpikeProtection] = useState<boolean>(false);
  const [newsEvents, setNewsEvents] = useState([
    { id: 'n1', currency: 'USD', title: 'Core Retail Sales m/m', impact: 'HIGH', time: '15:30', status: 'Upcoming' },
    { id: 'n2', currency: 'GBP', title: 'BoE Official Bank Rate Decision', impact: 'HIGH', time: '14:00', status: 'Upcoming' },
    { id: 'n3', currency: 'EUR', title: 'ECB President Lagarde Speech', impact: 'MEDIUM', time: '17:15', status: 'Active' },
    { id: 'n4', currency: 'USD', title: 'FOMC Unemployment Claims', impact: 'HIGH', time: 'Tomorrow 15:30', status: 'Upcoming' }
  ]);

  // --- REPLICATION MULTI-GROUPS STATES ---
  const [replicationGroups, setReplicationGroups] = useState<{
    id: string;
    name: string;
    masterId: string;
    childIds: string[];
    weight: number;
    description: string;
  }[]>([
    {
      id: 'g1',
      name: 'Prop Evaluation Pool',
      masterId: 'acc-1',
      childIds: ['acc-2', 'acc-3'],
      weight: 1.0,
      description: 'Replicates master contracts instantly with standard risk scaling parameters.'
    }
  ]);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupMasterId, setNewGroupMasterId] = useState('acc-1');
  const [newGroupWeight, setNewGroupWeight] = useState(1.0);
  const [newGroupChildrenIds, setNewGroupChildrenIds] = useState<string[]>(['acc-2']);

  // --- JOURNAL STRATEGY NOTES STATE ---
  const [tradingNotes, setTradingNotes] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('tradeplus_notes');
    return saved ? JSON.parse(saved) : {
      'trd-1': 'Copied gold entry perfectly with 0ms slippage overhead.'
    };
  });
  const [searchJournalQuery, setSearchJournalQuery] = useState('');

  // --- NOTIFICATION DRUMS ---
  const [notifications, setNotifications] = useState<string[]>([
    'Welcome to Tradesyncer! Server cluster LD4 London is fully synced.',
    'System status check: 99.99% bridge connectivity achieved.',
    'Risk limits saved. Core broker bridge adjusted.'
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isMarketOpen, setIsMarketOpen] = useState(true);

  // --- ACCOUNT FORM STATES ---
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAccName, setNewAccName] = useState('');
  const [newAccNo, setNewAccNo] = useState('');
  const [newAccPlatform, setNewAccPlatform] = useState<PlatformType>('MT5');
  const [newAccRole, setNewAccRole] = useState<'master' | 'child'>('child');
  const [newAccBroker, setNewAccBroker] = useState('');
  const [newAccBalance, setNewAccBalance] = useState<number>(50000);
  const [newAccMultiplier, setNewAccMultiplier] = useState<number>(1.0);
  const [newAccEmail, setNewAccEmail] = useState('');
  const [newAccPassword, setNewAccPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [connectStep, setConnectStep] = useState<1 | 2>(1);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- COCKPIT INTERACTIVE PLACEMENT STATES ---
  const [tradeSymbol, setTradeSymbol] = useState('XAUUSD');
  const [tradeType, setTradeType] = useState<'BUY' | 'SELL'>('BUY');
  const [tradeLots, setTradeLots] = useState(2.00);

  // --- HELP GUIDE modal state ---
  const [showHelpModal, setShowHelpModal] = useState(false);

  // --- TRADEIFY DISCOUNT popover ---
  const [discountToastOpen, setDiscountToastOpen] = useState(true);
  const [isDiscountAppliedOnBilling, setIsDiscountAppliedOnBilling] = useState(false);

  // Save states to local storage
  useEffect(() => {
    localStorage.setItem('tradeplus_accounts', JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    localStorage.setItem('tradeplus_trades', JSON.stringify(trades));
  }, [trades]);

  useEffect(() => {
    localStorage.setItem('tradeplus_logs', JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    localStorage.setItem('tradeplus_credits', credits.toString());
  }, [credits]);

  useEffect(() => {
    localStorage.setItem('tradeplus_selected_plan', selectedPlan);
  }, [selectedPlan]);

  useEffect(() => {
    localStorage.setItem('tradeplus_notes', JSON.stringify(tradingNotes));
  }, [tradingNotes]);

  // Adjust default broker server on platform selection
  useEffect(() => {
    if (newAccPlatform === 'DXTrade') {
      setNewAccBroker('DXTrade Funded Server');
    } else if (newAccPlatform === 'MatchTrader') {
      setNewAccBroker('FTMO MatchTrader Server');
    } else if (newAccPlatform === 'cTrader') {
      setNewAccBroker('Spotware cTrader Server');
    } else if (newAccPlatform === 'MT5') {
      setNewAccBroker('FundedNext MetaQuotes 5');
    } else if (newAccPlatform === 'MT4') {
      setNewAccBroker('ICMarkets-Live4');
    }
  }, [newAccPlatform]);

  // Append system log helper
  const addLog = (message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info', latency?: number) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const newLogItem: CopyLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp,
      type,
      message,
      latency
    };
    setLogs(prev => [newLogItem, ...prev]);
  };

  // --- DYNAMIC 5-STEP GET STARTED CALCULATOR ---
  const completedSteps = {
    step1: selectedPlan !== '' && selectedPlan !== 'None',
    step2: accounts.some(a => a.role === 'master'),
    step3: accounts.some(a => a.role === 'child' && a.status === 'connected'),
    step4: isRiskConfigured,
    step5: trades.length > INITIAL_TRADES.length // Simulation test placed
  };

  const completedCount = Object.values(completedSteps).filter(Boolean).length;
  const progressPercent = (completedCount / 5) * 100;

  // --- ACTIONS HANDLERS ---
  const onToggleAccount = (id: string) => {
    setAccounts(prev => prev.map(acc => {
      if (acc.id === id) {
        const nextStatus = acc.status === 'connected' ? 'disconnected' : 'connected';
        addLog(`${acc.name} status manually changed to ${nextStatus.toUpperCase()}`, nextStatus === 'connected' ? 'success' : 'warning');
        return { ...acc, status: nextStatus };
      }
      return acc;
    }));
  };

  const onDeleteAccount = (id: string, name: string) => {
    setAccounts(prev => prev.filter(acc => acc.id !== id));
    setTrades(prev => prev.filter(t => t.accountId !== id));
    addLog(`Deleted account: ${name}`, 'warning');
  };

  const handleLinkAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!newAccName.trim() || !newAccNo.trim() || !newAccBroker.trim()) {
      setFormError('All configuration fields are required.');
      return;
    }

    if (connectStep === 1) {
      setConnectStep(2);
      return;
    }

    if (!newAccEmail.trim() || !newAccPassword.trim()) {
      setFormError('Authentication credentials are required.');
      return;
    }

    setIsSubmitting(true);
    addLog(`Initiating secure SSL handshake for ${newAccName} [${newAccNo}]...`, 'info');
    
    setTimeout(() => {
      addLog(`🔐 Verifying credentials for ${newAccEmail} on broker server: ${newAccBroker}...`, 'info');
      
      setTimeout(() => {
        const generatedId = `acc-${Date.now()}`;
        const newAccountObj: TradingAccount = {
          id: generatedId,
          name: newAccName,
          platform: newAccPlatform,
          role: newAccRole,
          accountNo: newAccNo,
          broker: newAccBroker,
          status: 'connected',
          balance: newAccBalance,
          equity: newAccBalance,
          currency: 'USD',
          multiplier: newAccRole === 'child' ? newAccMultiplier : undefined,
          copierMode: 'multiplier'
        };

        setAccounts(prev => [...prev, newAccountObj]);
        addLog(`✔️ Credentials approved! SSL handshake completed & link active for ${newAccName}.`, 'success', 8);
        
        // Update notifications list
        setNotifications(prev => [`New verified connection linked: ${newAccName}`, ...prev]);

        // Reset form variables
        setNewAccName('');
        setNewAccNo('');
        setNewAccEmail('');
        setNewAccPassword('');
        setNewAccBalance(50000);
        setNewAccMultiplier(1.0);
        setConnectStep(1);
        setShowAddForm(false);
        setIsSubmitting(false);
      }, 1000);
    }, 850);
  };

  const handleExecuteOrders = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isMarketOpen) {
      addLog('Execution Blocked: Market is closed. Toggle weekends mode at the navbar to mock active market hours.', 'error');
      return;
    }

    const masterAcc = accounts.find(a => a.role === 'master' && a.status === 'connected');
    if (!masterAcc) {
      addLog('Error: No online Master account selected as order source.', 'error');
      return;
    }

    if (restrictedSymbols.includes(tradeSymbol)) {
      addLog(`Trade execution canceled. ${tradeSymbol} is listed on active risk blacklist.`, 'warning');
      return;
    }

    addLog(`⚡ Master Order Placed: Buy ${tradeLots} lots of ${tradeSymbol}...`, 'info');

    // Default prices simulation
    let openPrice = 1.08550;
    if (tradeSymbol === 'XAUUSD') openPrice = 2045.20;
    if (tradeSymbol === 'BTCUSD') openPrice = 64200.00;

    const masterTicket = Math.floor(Math.random() * 800000) + 100000;
    const masterTradeId = `trd-${Date.now()}`;

    const newMasterTrade: TradeOrder = {
      id: masterTradeId,
      ticket: masterTicket.toString(),
      symbol: tradeSymbol,
      type: tradeType,
      lots: tradeLots,
      openPrice,
      currentPrice: openPrice,
      pnl: 0.00,
      openTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
      accountId: masterAcc.id,
      accountName: masterAcc.name,
      status: 'OPEN'
    };

    const copyOrders: TradeOrder[] = [];
    const childrenConnected = accounts.filter(a => a.role === 'child' && a.status === 'connected');

    childrenConnected.forEach(child => {
      const scaleMult = child.multiplier || 1.0;
      const childLots = Number((tradeLots * scaleMult).toFixed(2));
      const childTicket = masterTicket + Math.floor(Math.random() * 8) + 1;

      // Simulated tiny latency slippage
      const slippage = (Math.random() * 0.0003) - 0.0001;
      const childPrice = tradeSymbol === 'XAUUSD'
        ? openPrice + Number((slippage * 500).toFixed(2))
        : openPrice + Number((slippage * 25000).toFixed(2));

      const copyDelay = Math.floor(Math.random() * 12) + 9; // ~9ms latency

      addLog(`Copied trade successfully to child ${child.name} (${scaleMult}x Lots) fills at ${childPrice.toFixed(2)}`, 'success', copyDelay);

      copyOrders.push({
        id: `trd-${Date.now()}-${child.id}`,
        ticket: childTicket.toString(),
        symbol: tradeSymbol,
        type: tradeType,
        lots: childLots,
        openPrice: Number(childPrice.toFixed(5)),
        currentPrice: Number(childPrice.toFixed(5)),
        pnl: 0,
        openTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
        accountId: child.id,
        accountName: child.name,
        masterTradeId: masterTradeId,
        status: 'OPEN'
      });
    });

    setTrades(prev => [newMasterTrade, ...copyOrders, ...prev]);
  };

  const handleCloseMasterTradeRoute = (masterTradeId: string) => {
    const masterObj = trades.find(t => t.id === masterTradeId);
    if (!masterObj) return;

    addLog(`❌ Closing trade group corresponding to Master ID: #${masterObj.ticket}`, 'warning');

    const simulatedOutcomePips = (Math.random() * 32) - 10; // positive skew to look good

    setTrades(prev => prev.map(t => {
      if (t.id === masterTradeId || t.masterTradeId === masterTradeId) {
        const finalizedPnl = Number((t.lots * simulatedOutcomePips * 12).toFixed(2));

        // Adjust balances
        setAccounts(accs => accs.map(currAcc => {
          if (currAcc.id === t.accountId) {
            const nextBal = Number((currAcc.balance + finalizedPnl).toFixed(2));
            return {
              ...currAcc,
              balance: nextBal,
              equity: nextBal
            };
          }
          return currAcc;
        }));

        addLog(`Closed order Ticket #${t.ticket} on ${t.accountName}. Net PnL: ${finalizedPnl >= 0 ? '+' : ''}$${finalizedPnl.toLocaleString()}`, 'info');

        return {
          ...t,
          status: 'CLOSED',
          pnl: finalizedPnl
        };
      }
      return t;
    }));
  };

  // Safe manual credits top-up
  const handleTopupCredits = () => {
    setIsRefreshingCredits(true);
    addLog('Querying Stripe payment session ledger...', 'info');

    setTimeout(() => {
      setCredits(prev => prev + 50);
      setIsRefreshingCredits(false);
      addLog('✔️ $50.00 credits successfully provisioned to client balancer via Secure Checkout.', 'success');
      setNotifications(prev => ['Billing credit top-up completed', ...prev]);
    }, 1000);
  };

  // Modify journals notes
  const handleSaveNotes = (id: string, text: string) => {
    setTradingNotes(prev => {
      const next = { ...prev, [id]: text };
      return next;
    });
  };

  // Create new account pool groupings
  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;

    const addedGrp = {
      id: `grp-${Date.now()}`,
      name: newGroupName,
      masterId: newGroupMasterId,
      childIds: newGroupChildrenIds,
      weight: newGroupWeight,
      description: 'Custom cluster defined via secure user routing console.'
    };

    setReplicationGroups(prev => [...prev, addedGrp]);
    addLog(`✔️ Multi-pool group "${newGroupName}" successfully compiled into mapping catalog.`, 'success');
    setNewGroupName('');
  };

  // Toggle news autopause
  const handleToggleNewsProtection = () => {
    const nextVal = !newsSpikeProtection;
    setNewsSpikeProtection(nextVal);
    if (nextVal) {
      addLog('⏰ High Impact News protection active. Copier will idle 5 minutes before/after designated announcements.', 'success');
    } else {
      addLog('⏰ High Impact News protection disengaged. Replicator operates at normal rate.', 'warning');
    }
  };

  const handleApplyDiscount = () => {
    setIsDiscountAppliedOnBilling(true);
    setDiscountToastOpen(false);
    addLog('🎉 Voucher Applied: CODE35 applied live! Lifetime subscription checkout costs slashed by 35%.', 'success');
    setNotifications(prev => ['Lifetime promo voucher applied successfully', ...prev]);
  };

  // Master stats
  const totalBalanceVal = accounts.reduce((sum, item) => sum + item.balance, 0);
  const connectedMasters = accounts.filter(a => a.role === 'master' && a.status === 'connected');
  const connectedChildrenVal = accounts.filter(a => a.role === 'child' && a.status === 'connected');
  const openOrdersList = trades.filter(t => t.status === 'OPEN');
  const finishedOrdersList = trades.filter(t => t.status === 'CLOSED');

  return (
    <div className={`min-h-screen flex ${isDark ? 'bg-[#0A0A0B] text-slate-100' : 'bg-[#FAFAFB] text-slate-800'}`}>
      
      {/* 1. LEFT SIDEBAR AS DEPICTED IN THE IMAGE */}
      <aside className={`w-72 flex-shrink-0 border-r flex flex-col transition-all duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      } ${
        isDark ? 'bg-[#0A0A0B]/95 border-white/5 text-slate-300' : 'bg-white border-slate-250 text-slate-700'
      }`}>
        
        {/* Sidebar Header with Logo matching colors */}
        <div className="h-20 px-8 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
              <div className="w-4 h-4 border-2 border-white rotate-45 border-t-0 border-l-0"></div>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
              Tradesyncer
            </span>
          </div>

          <button 
            onClick={onBackToLanding}
            className="p-1.5 rounded-lg hover:bg-slate-500/10 text-slate-400 group cursor-pointer"
            title="Leave console to Landing Page"
          >
            <ArrowLeft size={16} className="group-hover:text-blue-500 transition-colors" />
          </button>
        </div>

        {/* PROFILE SECTION MATCHING THE IMAGE GRAPHICS */}
        <div className="p-6 border-b border-white/5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white font-mono shadow-md shadow-blue-500/10">
            A
          </div>
          <div className="text-left overflow-hidden">
            <p className="text-xs font-mono tracking-wider text-slate-500 uppercase">My Profile</p>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate" title="ahmedfaizan2257@gmail.com">
              ahmedfaizan2257
            </p>
          </div>
          <span className="ml-auto flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
        </div>

        {/* SIDEBAR VERTICAL NAVIGATION LIST */}
        <nav className="flex-1 px-4 py-5 space-y-1 overflow-y-auto">
          {/* standard root tabs */}
          {[
            { id: 'get-started', name: 'Get Started', icon: Rocket, badge: completedCount < 5 ? `${completedCount}/5` : 'Pass' },
            { id: 'home', name: 'Home', icon: Home },
            { id: 'connections', name: 'Connections', icon: LinkIcon, badge: accounts.length.toString() },
            { id: 'cockpit', name: 'Cockpit', icon: Compass, badge: openOrdersList.length ? openOrdersList.length.toString() : undefined },
            { id: 'groups', name: 'Groups', icon: Users, badge: replicationGroups.length.toString() },
            { id: 'risk', name: 'Risk Management', icon: Shield },
            { id: 'calendar', name: 'Economic Calendar', icon: Calendar, activeAlert: newsSpikeProtection },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as TabId)}
                className={`w-full py-2.5 px-3.5 rounded-xl flex items-center gap-2.5 font-semibold text-xs transition-all tracking-wide cursor-pointer text-left ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25 font-bold'
                    : 'hover:bg-slate-500/5 hover:text-slate-900 dark:hover:text-white text-slate-400'
                }`}
              >
                <Icon size={15} className={`${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span className="font-sans flex-1">{item.name}</span>
                {item.badge && (
                  <span className={`px-1.5 py-0.5 rounded font-mono font-extrabold text-[9px] ${
                    isActive ? 'bg-white text-blue-600' : 'bg-slate-500/10 text-blue-500 dark:text-blue-400'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Collapsible Journaling Accordion */}
          <div className="space-y-0.5">
            <button
              onClick={() => setJournalingOpen(!journalingOpen)}
              className={`w-full py-2.5 px-3.5 rounded-xl flex items-center gap-2.5 text-xs tracking-wide cursor-pointer text-left text-slate-400 hover:bg-slate-500/5 hover:text-slate-100 font-semibold`}
            >
              <BookOpen size={15} />
              <span className="font-sans flex-1">Journaling</span>
              <ChevronDown size={14} className={`transform transition-transform text-slate-500 ${journalingOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {journalingOpen && (
              <div className="pl-6 pr-2 py-1 space-y-1 border-l border-white/5 ml-5 mt-0.5">
                {[
                  { id: 'journaling-dashboard', name: 'Dashboard' },
                  { id: 'journaling-trades', name: 'Trades' },
                  { id: 'journaling-daily', name: 'Daily' },
                  { id: 'journaling-weekly', name: 'Weekly' },
                  { id: 'journaling-strategy', name: 'Strategy' },
                  { id: 'journaling-managedata', name: 'Manage Data' }
                ].map((sub) => {
                  const isActive = activeTab === sub.id;
                  return (
                    <button
                      key={sub.id}
                      onClick={() => setActiveTab(sub.id as TabId)}
                      className={`w-full py-1.5 px-2.5 rounded-lg text-left text-[11px] font-medium transition-all cursor-pointer ${
                        isActive
                          ? 'bg-blue-600/15 text-blue-400 font-bold border-l-2 border-blue-500 pl-2'
                          : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      {sub.name}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Collapsible Prop Firms Accordion */}
          <div className="space-y-0.5">
            <button
              onClick={() => setPropFirmsOpen(!propFirmsOpen)}
              className={`w-full py-2.5 px-3.5 rounded-xl flex items-center gap-2.5 text-xs tracking-wide cursor-pointer text-left text-slate-400 hover:bg-slate-500/5 hover:text-slate-100 font-semibold`}
            >
              <Award size={15} />
              <span className="font-sans flex-1">Prop Firms</span>
              <ChevronDown size={14} className={`transform transition-transform text-slate-500 ${propFirmsOpen ? 'rotate-180' : ''}`} />
            </button>

            {propFirmsOpen && (
              <div className="pl-6 pr-2 py-1 space-y-1 border-l border-white/5 ml-5 mt-0.5">
                {[
                  { id: 'prop-discounts', name: 'Prop Firm Discounts' },
                  { id: 'prop-expense', name: 'Expense Tracker' }
                ].map((sub) => {
                  const isActive = activeTab === sub.id;
                  return (
                    <button
                      key={sub.id}
                      onClick={() => {
                        if (sub.id === 'prop-discounts') {
                          window.open('https://propfirmsyncer.com', '_blank');
                        }
                        setActiveTab(sub.id as TabId);
                      }}
                      className={`w-full py-1.5 px-2.5 rounded-lg text-left text-[11px] font-medium transition-all cursor-pointer ${
                        isActive
                          ? 'bg-blue-600/15 text-blue-400 font-bold border-l-2 border-blue-500 pl-2'
                          : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      {sub.name}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Root sub links Affiliate and Settings */}
          {[
            { id: 'affiliate', name: 'Affiliate', icon: Sparkles },
            { id: 'settings', name: 'Settings', icon: Sliders }
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as TabId)}
                className={`w-full py-2.5 px-3.5 rounded-xl flex items-center gap-2.5 font-semibold text-xs transition-all tracking-wide cursor-pointer text-left ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25 font-bold'
                    : 'hover:bg-slate-500/5 hover:text-slate-900 dark:hover:text-white text-slate-400'
                }`}
              >
                <Icon size={15} className={`${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span className="font-sans flex-1">{item.name}</span>
              </button>
            );
          })}
        </nav>

        {/* BOTTOM CREDITS WIDGET */}
        <div className="p-4 border-t border-white/5">
          <div className={`p-4 rounded-xl border relative text-left ${
            isDark ? 'bg-white/[0.02] border-white/5' : 'bg-slate-50 border-slate-200'
          }`}>
            <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Available Credits</p>
            <div className="flex items-center justify-between mt-1">
              <h4 className="text-xl font-mono font-extrabold text-blue-500">${credits.toFixed(2)}</h4>
              <button
                onClick={handleTopupCredits}
                disabled={isRefreshingCredits}
                className={`p-1.5 rounded-lg hover:bg-slate-500/10 text-slate-400 hover:text-blue-500 cursor-pointer ${
                  isRefreshingCredits ? 'animate-spin text-blue-500' : ''
                }`}
                title="Mock credit top-up"
              >
                <RotateCcw size={14} />
              </button>
            </div>
            <p className="text-[9px] text-slate-400 mt-1 pointer-events-none">Requires positive balancer for prop routing.</p>
          </div>
        </div>

      </aside>

      {/* 2. RIGHT CONTENT AREA PANEL */}
      <div className="flex-grow flex flex-col min-w-0">
        
        {/* RIGHT AREA HEADER NAVBAR */}
        <header className={`h-20 px-8 flex items-center justify-between border-b ${
          isDark ? 'bg-[#0A0A0B]/80 border-white/5 backdrop-blur-md' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-500/10 text-slate-400 cursor-pointer"
            >
              <Activity size={18} />
            </button>
            <h1 className="text-lg font-bold font-display ml-1 tracking-tight capitalize">
              {activeTab.replace('-', ' ')}
            </h1>
          </div>

          <div className="flex items-center gap-6">
            
            {/* Interactive Market Status Badge */}
            <button
              onClick={() => {
                setIsMarketOpen(!isMarketOpen);
                addLog(`Simulated market hours shifted. Broker connection: ${!isMarketOpen ? 'OPEN (Weekday)' : 'CLOSED (Weekend)'}`, !isMarketOpen ? 'success' : 'warning');
              }}
              className={`px-3 py-1 border rounded-full text-xs font-mono font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer ${
                isMarketOpen
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                  : 'bg-rose-500/10 border-rose-500/20 text-rose-500'
              }`}
              title="Click to toggle simulated market hours"
            >
              <span className={`w-2 h-2 rounded-full ${isMarketOpen ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
              <span>{isMarketOpen ? 'Market Open' : 'Market Closed'}</span>
            </button>

            {/* Notification Ring bell trigger with dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-xl border border-slate-500/10 hover:bg-slate-500/5 text-slate-400 hover:text-slate-900 dark:hover:text-white relative cursor-pointer"
              >
                <Bell size={16} />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-rose-500 rounded-full" />
              </button>

              {showNotifications && (
                <div className={`absolute right-4 top-12 w-64 rounded-xl shadow-xl z-50 border p-3.5 space-y-2 text-left ${
                  isDark ? 'bg-slate-900 border-white/5' : 'bg-white border-slate-200'
                }`}>
                  <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest pb-1 border-b border-slate-500/10">Recent Sync Alerts</p>
                  <div className="max-h-48 overflow-y-auto space-y-2 pt-1.5">
                    {notifications.map((n, i) => (
                      <div key={i} className="text-[10.5px] leading-relaxed border-b border-slate-500/5 pb-1 text-slate-400">
                        • {n}
                      </div>
                    ))}
                  </div>
                  <button onClick={() => setShowNotifications(false)} className="w-full py-1 text-center font-mono text-[9px] text-blue-500 hover:underline">
                    Collapse Alerts
                  </button>
                </div>
              )}
            </div>

            {/* Instructions Manual Helper icon */}
            <button
              onClick={() => setShowHelpModal(true)}
              className="p-2 rounded-xl border border-slate-500/10 hover:bg-slate-500/5 text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
            >
              <HelpCircle size={16} />
            </button>

          </div>
        </header>

        {/* MAIN BODY VIEW ROUTER VIEWPORT */}
        <main className="flex-1 p-8 overflow-y-auto">
          
          {/* TAB 1: GET STARTED */}
          {activeTab === 'get-started' && (
            <div className="max-w-4xl mx-auto space-y-8 animate-fade-in text-center relative">
              
              {/* Background gradient blur */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/10 blur-[100px] rounded-full -z-10" />

              {/* Header Rocket Segment */}
              <div className="space-y-4">
                <div className="w-16 h-16 bg-blue-600/15 border border-blue-500/20 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                  <Rocket size={24} className="text-blue-500" />
                </div>
                <h2 className="text-3xl sm:text-4xl font-display font-extrabold tracking-tight">
                  Get Started with Tradesyncer
                </h2>
                <p className="text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
                  Follow these step-by-step procedures to synchronize and leverage virtual copier routing algorithms in real-time.
                </p>
              </div>

              {/* PROGRESS BAR DEPICTED IN THE CUSTOM STYLE */}
              <div className={`p-6 rounded-2xl border ${isDark ? 'bg-[#0A0A0B]/80 border-white/5' : 'bg-white border-slate-200'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-400 tracking-wider font-mono">COP_ENG ROADMAP</span>
                  <span className="text-xs font-mono font-bold text-blue-500">{completedCount}/5 COMPLETED</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-300 dark:bg-slate-800 overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 transition-all duration-500 ease-out" 
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <p className="text-[10px] text-slate-500 font-mono text-left mt-2 italic">
                  {completedCount === 5 
                    ? '🎉 100% active state setup. Tradesyncer replication running at peak cloud speed.' 
                    : 'System requires completed checkpoints to initialize complete cloud pipelines.'}
                </p>
              </div>

              {/* CHECKS LIST CARDS */}
              <div className="space-y-4">
                
                {/* Step 1 */}
                <div className={`p-5 rounded-xl border flex items-center justify-between transition-all text-left ${
                  completedSteps.step1 
                    ? 'bg-blue-600/5 border-blue-500/20' 
                    : isDark ? 'bg-white/[0.02] border-white/5' : 'bg-white border-slate-200'
                }`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                      completedSteps.step1 ? 'bg-emerald-500 text-white' : 'bg-slate-300 dark:bg-slate-800 text-slate-500'
                    }`}>
                      {completedSteps.step1 ? <Check size={14} /> : '1'}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold">Choose subscription plan</h4>
                      <p className="text-xs text-slate-400 mt-0.5">Define your account threshold constraints. Selected: {selectedPlan}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <select
                      value={selectedPlan}
                      onChange={(e) => setSelectedPlan(e.target.value)}
                      className={`text-xs px-3 py-1.5 rounded-lg border focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer ${
                        isDark ? 'bg-slate-900 border-white/10 text-white' : 'bg-white border-slate-200'
                      }`}
                    >
                      <option value="Plus Starter">Plus Starter ($19/mo)</option>
                      <option value="Plus Pro">Plus Pro ($29/mo)</option>
                      <option value="Plus Elite">Plus Elite ($49/mo)</option>
                      <option value="Plus Enterprise">Plus Enterprise ($99/mo)</option>
                    </select>
                  </div>
                </div>

                {/* Step 2 */}
                <div className={`p-5 rounded-xl border flex items-center justify-between transition-all text-left ${
                  completedSteps.step2 
                    ? 'bg-blue-600/5 border-blue-500/20' 
                    : isDark ? 'bg-white/[0.02] border-white/5' : 'bg-white border-slate-200'
                }`}>
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                      completedSteps.step2 ? 'bg-emerald-500 text-white' : 'bg-slate-300 dark:bg-slate-800 text-slate-500'
                    }`}>
                      {completedSteps.step2 ? <Check size={14} /> : '2'}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold">Attach Master Source Connection</h4>
                      <p className="text-xs text-slate-400 mt-0.5">Establish credentials bridge pointing to your trade source account.</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setActiveTab('connections')} 
                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all cursor-pointer shadow-md shadow-blue-500/10 flex items-center gap-1"
                  >
                    <span>Connect Master</span>
                    <Plus size={12} />
                  </button>
                </div>

                {/* Step 3 */}
                <div className={`p-5 rounded-xl border flex items-center justify-between transition-all text-left ${
                  completedSteps.step3 
                    ? 'bg-blue-600/5 border-blue-500/20' 
                    : isDark ? 'bg-white/[0.02] border-white/5' : 'bg-white border-slate-200'
                }`}>
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                      completedSteps.step3 ? 'bg-emerald-500 text-white' : 'bg-slate-300 dark:bg-slate-800 text-slate-500'
                    }`}>
                      {completedSteps.step3 ? <Check size={14} /> : '3'}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold">Enable Child Accounts Nodes</h4>
                      <p className="text-xs text-slate-400 mt-0.5">Attach follower receiver accounts to listen and copy commands.</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setActiveTab('connections')} 
                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all cursor-pointer shadow-md shadow-blue-500/10"
                  >
                    Link Children Nodes
                  </button>
                </div>

                {/* Step 4 */}
                <div className={`p-5 rounded-xl border flex items-center justify-between transition-all text-left ${
                  completedSteps.step4 
                    ? 'bg-blue-600/5 border-blue-500/20' 
                    : isDark ? 'bg-white/[0.02] border-white/5' : 'bg-white border-slate-200'
                }`}>
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                      completedSteps.step4 ? 'bg-emerald-500 text-white' : 'bg-slate-300 dark:bg-slate-800 text-slate-500'
                    }`}>
                      {completedSteps.step4 ? <Check size={14} /> : '4'}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold">Configure Risk Protocols</h4>
                      <p className="text-xs text-slate-400 mt-0.5">Set daily drawdowns limits, slippage bounds, and blacklist assets.</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setIsRiskConfigured(true);
                      setActiveTab('risk');
                      addLog('Risk protection constraints actively logged.', 'success');
                    }}
                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all cursor-pointer shadow-md shadow-blue-500/10"
                  >
                    Engage Shields
                  </button>
                </div>

                {/* Step 5 */}
                <div className={`p-5 rounded-xl border flex items-center justify-between transition-all text-left ${
                  completedSteps.step5 
                    ? 'bg-blue-600/5 border-blue-500/20' 
                    : isDark ? 'bg-white/[0.02] border-white/5' : 'bg-white border-slate-200'
                }`}>
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                      completedSteps.step5 ? 'bg-emerald-500 text-white' : 'bg-slate-300 dark:bg-slate-800 text-slate-500'
                    }`}>
                      {completedSteps.step5 ? <Check size={14} /> : '5'}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold">Place Sandbox Test Trade</h4>
                      <p className="text-xs text-slate-400 mt-0.5">Execute your first trade in the cockpit to check instantaneous socket mirroring.</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setActiveTab('cockpit')} 
                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all cursor-pointer shadow-md shadow-blue-500/10"
                  >
                    Open Cockpit Desk
                  </button>
                </div>

              </div>

              {/* DYNAMIC DISCOUNT SLIDING/POPUP TOAST AT BOTTOM RIGHT */}
              {discountToastOpen && (
                <div className={`fixed bottom-6 right-6 max-w-sm rounded-2xl shadow-2xl p-5 border text-left z-40 transition-all ${
                  isDark ? 'bg-slate-900 border-white/10 text-white' : 'bg-white border-slate-250 text-slate-800'
                }`}>
                  <button 
                    onClick={() => setDiscountToastOpen(false)}
                    className="absolute top-3 right-3 text-slate-400 hover:text-slate-100 p-0.5"
                  >
                    <X size={14} />
                  </button>
                  
                  <div className="flex gap-4 items-start pb-1">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg">
                      🏷️
                    </div>
                    <div className="text-sm">
                      <h4 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                        <span>Tradeify Partnership</span>
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-1.5 py-0.5 rounded uppercase">35% OFF</span>
                      </h4>
                      <p className="text-xs text-slate-400 mt-1 pointer-events-none">
                        Get 35% lifetime checkout discount. Syncs perfectly with FTMO, FundedNext, and DXTrade.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end mt-4">
                    <button 
                      onClick={() => setDiscountToastOpen(false)}
                      className="px-3 py-1.5 rounded-lg text-[11px] text-slate-400 hover:bg-slate-500/10 font-bold cursor-pointer"
                    >
                      Dismiss
                    </button>
                    <button 
                      onClick={handleApplyDiscount}
                      className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] font-bold cursor-pointer flex items-center gap-1 shadow shadow-emerald-500/10"
                    >
                      <Check size={12} />
                      <span>Get Deal</span>
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 2: PORTFOLIO HOME */}
          {activeTab === 'home' && (
            <div className="space-y-8 text-left animate-fade-in">
              
              {/* Metric Card Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                <div className={`p-6 rounded-2xl border ${isDark ? 'bg-[#0A0A0B]/80 border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}>
                  <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Combined Multi-Liquidity balance</p>
                  <h3 className="text-3xl font-mono font-extrabold text-blue-500 mt-1">
                    ${totalBalanceVal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </h3>
                  <div className="flex justify-between items-center text-[10px] text-slate-500 mt-2">
                    <span>Account Balances Aggregate</span>
                    <span className="text-emerald-400 font-bold">+12.4% ROI</span>
                  </div>
                </div>

                <div className={`p-6 rounded-2xl border ${isDark ? 'bg-[#0A0A0B]/80 border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}>
                  <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Attached Platform Ports</p>
                  <h3 className="text-3xl font-mono font-extrabold text-slate-800 dark:text-slate-100 mt-1">
                    {accounts.length}
                  </h3>
                  <div className="flex justify-between items-center text-[10px] text-slate-500 mt-2">
                    <span>{connectedMasters.length} Active masters</span>
                    <span>{accounts.length - connectedMasters.length} Active children</span>
                  </div>
                </div>

                <div className={`p-6 rounded-2xl border ${isDark ? 'bg-[#0A0A0B]/80 border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}>
                  <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Mirror Sync Routes</p>
                  <h3 className="text-3xl font-mono font-extrabold text-emerald-500 mt-1">
                    {connectedChildrenVal.length} / {accounts.filter(a => a.role === 'child').length}
                  </h3>
                  <div className="flex justify-between items-center text-[10px] text-slate-500 mt-2">
                    <span>Online socket lanes</span>
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
                  </div>
                </div>

                <div className={`p-6 rounded-2xl border ${isDark ? 'bg-[#0A0A0B]/80 border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}>
                  <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Average Routing Delay</p>
                  <h3 className="text-3xl font-mono font-extrabold text-white bg-blue-600 inline-block px-1.5 py-0.5 rounded mt-1 shadow-md shadow-blue-500/20">
                    14.8<span className="text-xs font-normal ml-0.5">ms</span>
                  </h3>
                  <p className="text-[10px] text-slate-500 mt-2">Ultra-low LD4 / NY4 latency</p>
                </div>

              </div>

              {/* STUNNING INTERACTIVE SVG EQUITY GROWTH AREA CHART */}
              <div className={`p-6 rounded-2xl border ${isDark ? 'bg-[#0A0A0B]/80 border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-sm font-bold tracking-tight">Combined Equity Growth Performance</h3>
                    <p className="text-xs text-slate-400">Aggregated master-to-follower evaluation curves</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-mono text-slate-400">AGGREGATE CLOSED PNL</p>
                    <p className="text-sm font-bold font-mono text-emerald-500">
                      +${finishedOrdersList.reduce((acc, t) => acc + (t.pnl || 0), 0).toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* SVG render area */}
                <div className="relative h-64 w-full">
                  <svg className="h-full w-full" viewBox="0 0 800 240" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2563eb" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    
                    {/* Gridlines */}
                    <line x1="50" y1="30" x2="750" y2="30" stroke="#f1f5f9" strokeWidth="1" strokeOpacity="0.05" />
                    <line x1="50" y1="90" x2="750" y2="90" stroke="#f1f5f9" strokeWidth="1" strokeOpacity="0.05" />
                    <line x1="50" y1="150" x2="750" y2="150" stroke="#f1f5f9" strokeWidth="1" strokeOpacity="0.05" />
                    <line x1="50" y1="210" x2="750" y2="210" stroke="#f1f5f9" strokeWidth="1" strokeOpacity="0.05" />

                    {/* Gradient Area under curve */}
                    <path
                      d="M 50 180 Q 200 130 350 170 T 550 90 T 750 60 L 750 210 L 50 210 Z"
                      fill="url(#chartGradient)"
                    />

                    {/* Smooth Spline Curve line */}
                    <path
                      d="M 50 180 Q 200 130 350 170 T 550 90 T 750 60"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />

                    {/* Animated Data point dots */}
                    <circle cx="50" cy="180" r="5" fill="#3b82f6" stroke="#ffffff" strokeWidth="2" className="cursor-pointer hover:r-7 transition-all" />
                    <circle cx="200" cy="147" r="5" fill="#3b82f6" stroke="#ffffff" strokeWidth="2" className="cursor-pointer" />
                    <circle cx="350" cy="170" r="5" fill="#3b82f6" stroke="#ffffff" strokeWidth="2" className="cursor-pointer" />
                    <circle cx="550" cy="95" r="5" fill="#3b82f6" stroke="#ffffff" strokeWidth="2" className="cursor-pointer" />
                    <circle cx="750" cy="60" r="5" fill="#10b981" stroke="#ffffff" strokeWidth="2" className="cursor-pointer animate-pulse" />

                    {/* Labels */}
                    <text x="50" y="230" fill="#94a3b8" fontSize="10" fontFamily="monospace" textAnchor="middle">MON (100K)</text>
                    <text x="200" y="230" fill="#94a3b8" fontSize="10" fontFamily="monospace" textAnchor="middle">TUE (102K)</text>
                    <text x="350" y="230" fill="#94a3b8" fontSize="10" fontFamily="monospace" textAnchor="middle">WED (101K)</text>
                    <text x="550" y="230" fill="#94a3b8" fontSize="10" fontFamily="monospace" textAnchor="middle">THU (104K)</text>
                    <text x="750" y="230" fill="#94a3b8" fontSize="10" fontFamily="monospace" textAnchor="middle">FRI (112K Live)</text>
                  </svg>
                  
                  {/* Absolute Tooltip representation */}
                  <div className="absolute top-4 left-1/3 bg-slate-900 border border-white/10 text-white rounded-lg p-2.5 shadow-xl hidden md:block text-xs font-mono">
                    <p className="text-slate-400">Mid-Week Scaler ROI:</p>
                    <p className="text-emerald-400 font-bold">+$12,482.00 Equity Peak</p>
                  </div>
                </div>
              </div>

              {/* QUICK CONTROL CONSOLE BOOST PANEL */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Active Accounts quick status list */}
                <div className={`p-6 rounded-2xl border ${isDark ? 'bg-[#0A0A0B]/80 border-white/5' : 'bg-white border-slate-200'}`}>
                  <h3 className="text-sm font-bold tracking-tight mb-4 flex items-center justify-between">
                    <span>Replication Network Overview ({accounts.length})</span>
                    <button onClick={() => setActiveTab('connections')} className="text-xs text-blue-500 hover:underline">Manage</button>
                  </h3>
                  
                  <div className="space-y-3">
                    {accounts.map(acc => {
                      const isActive = acc.status === 'connected';
                      return (
                        <div key={acc.id} className="flex justify-between items-center text-xs pb-2 border-b border-white/5">
                          <div className="flex items-center gap-2">
                            <span className="font-mono bg-blue-500/10 px-1.5 py-0.5 rounded text-blue-500 font-bold text-[9px]">{acc.platform}</span>
                            <span className="font-semibold">{acc.name}</span>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                            isActive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                          }`}>
                            {isActive ? 'ONLINE' : 'OFFLINE'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Boost test metrics */}
                <div className={`p-6 rounded-2xl border ${isDark ? 'bg-[#0A0A0B]/80 border-white/5' : 'bg-white border-slate-200'} flex flex-col justify-between`}>
                  <div>
                    <h3 className="text-sm font-bold tracking-tight">Simulated Balance Boosters</h3>
                    <p className="text-xs text-slate-400 mt-1 pointer-events-none">
                      Instantly simulate positive trade closure payouts to test Ledger aggregate performance.
                    </p>
                  </div>

                  <div className="flex gap-2.5 mt-4">
                    <button
                      onClick={() => {
                        // Add positive PnL to accounts
                        setAccounts(prev => prev.map(a => ({
                          ...a,
                          balance: Number((a.balance + 1250.00).toFixed(2)),
                          equity: Number((a.equity + 1250.00).toFixed(2))
                        })));
                        addLog('Simulated Booster: added +$1,250.00 profit to all accounts.', 'success');
                      }}
                      className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-white font-bold text-xs shadow-md shadow-emerald-500/10 cursor-pointer text-center"
                    >
                      +$1,250.00 Boost Balance
                    </button>

                    <button
                      onClick={() => {
                        // Reset simulation values
                        setAccounts(INITIAL_ACCOUNTS);
                        setTrades(INITIAL_TRADES);
                        setLogs(INITIAL_LOGS);
                        setCredits(0);
                        setSelectedPlan('Plus Elite');
                        addLog('Replication database restored to initial defaults.', 'warning');
                      }}
                      className="py-3 px-4 border border-slate-500/10 hover:bg-slate-500/5 rounded-xl text-slate-400 hover:text-white font-bold text-xs cursor-pointer text-center"
                    >
                      Reset Sim DB
                    </button>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 3: CONNECTIONS MANAGER */}
          {activeTab === 'connections' && (
            <div className="space-y-6 text-left animate-fade-in max-w-4xl mx-auto">
              
              <div className={`p-6 rounded-2xl border ${isDark ? 'bg-[#0A0A0B]/80 border-white/5' : 'bg-white border-slate-200'}`}>
                <div className="flex justify-between items-center border-b border-slate-500/10 pb-4 mb-4">
                  <div>
                    <h3 className="text-base font-bold">Trading Endpoints ({accounts.length})</h3>
                    <p className="text-xs text-slate-400">Establish broker connections using secure virtual API bridges.</p>
                  </div>
                  <button
                    onClick={() => {
                      setShowAddForm(!showAddForm);
                      setConnectStep(1);
                      setFormError('');
                    }}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Plus size={14} />
                    <span>Attach New Account</span>
                  </button>
                </div>

                {/* Expandable Form */}
                {showAddForm && (
                  <form onSubmit={handleLinkAccountSubmit} className={`p-6 rounded-2xl border mb-6 space-y-5 transition-all duration-300 ${
                    isDark ? 'bg-slate-900/40 border-white/5 shadow-inner' : 'bg-[#FAFAFB] border-slate-200'
                  }`}>
                    {/* Header */}
                    <div className="flex justify-between items-center border-b border-slate-500/10 pb-3">
                      <h4 className="text-xs font-bold font-display uppercase tracking-widest text-blue-500 flex items-center gap-2">
                        <Key size={14} className="text-blue-500 animate-pulse" />
                        <span>Link New Broker Terminal</span>
                      </h4>
                      <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Step {connectStep} of 2</span>
                    </div>

                    {/* Step wizard indicator */}
                    <div className="flex items-center justify-between pb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold leading-none ${connectStep === 1 ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'}`}>
                          {connectStep === 1 ? '1' : '✓'}
                        </div>
                        <span className={`text-[11px] font-bold ${connectStep === 1 ? (isDark ? 'text-white' : 'text-slate-800') : 'text-slate-400'}`}>1. Node Profile</span>
                      </div>
                      <div className="flex-1 h-[1px] bg-slate-500/10 mx-3">
                        <div className={`h-full bg-blue-500 transition-all duration-500 ${connectStep === 2 ? 'w-full' : 'w-0'}`} />
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold leading-none ${connectStep === 2 ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : (isDark ? 'bg-white/5 text-slate-500' : 'bg-slate-200 text-slate-500')}`}>
                          2
                        </div>
                        <span className={`text-[11px] font-bold ${connectStep === 2 ? (isDark ? 'text-white' : 'text-slate-800') : 'text-slate-500'}`}>2. Auth Handshake</span>
                      </div>
                    </div>

                    {/* Step Content */}
                    {connectStep === 1 ? (
                      /* STEP 1: CONFIG DETAILS */
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in">
                        <div>
                          <label htmlFor="conn-name" className="text-[10px] font-mono font-bold text-slate-400 block mb-1">ACCOUNT NICKNAME</label>
                          <input
                            id="conn-name"
                            type="text"
                            required
                            placeholder="e.g. My FTMO Evaluation Master"
                            value={newAccName}
                            onChange={(e) => setNewAccName(e.target.value)}
                            className={`w-full px-3 py-2 rounded-lg border text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                              isDark ? 'bg-slate-950 border-white/10 text-white' : 'bg-white border-slate-250 text-slate-900'
                            }`}
                          />
                        </div>

                        <div>
                          <label htmlFor="conn-no" className="text-[10px] font-mono font-bold text-slate-400 block mb-1">LOGIN ID / Account NO</label>
                          <input
                            id="conn-no"
                            type="text"
                            required
                            placeholder="e.g. 8172942"
                            value={newAccNo}
                            onChange={(e) => setNewAccNo(e.target.value)}
                            className={`w-full px-3 py-2 rounded-lg border text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                              isDark ? 'bg-slate-950 border-white/10 text-white' : 'bg-white border-slate-250 text-slate-900'
                            }`}
                          />
                        </div>

                        <div>
                          <label htmlFor="conn-platform" className="text-[10px] font-mono font-bold text-slate-400 block mb-1">TRADING INFRASTRUCTURE</label>
                          <select
                            id="conn-platform"
                            value={newAccPlatform}
                            onChange={(e) => setNewAccPlatform(e.target.value as PlatformType)}
                            className={`w-full px-3 py-2 rounded-lg border text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer ${
                              isDark ? 'bg-slate-950 border-white/10 text-white' : 'bg-white border-slate-250 text-slate-900'
                            }`}
                          >
                            <option value="MT5">MetaTrader 5 (MT5)</option>
                            <option value="MT4">MetaTrader 4 (MT4)</option>
                            <option value="DXTrade">DXTrade API Platform</option>
                            <option value="MatchTrader">MatchTrader Station</option>
                            <option value="cTrader">cTrader direct API</option>
                            <option value="Tradovate">Tradovate (Futures)</option>
                            <option value="Rithmic">Rithmic Engine (Futures)</option>
                          </select>
                        </div>

                        <div>
                          <label htmlFor="conn-role" className="text-[10px] font-mono font-bold text-slate-400 block mb-1">COPIER ROUTING ROLE</label>
                          <select
                            id="conn-role"
                            value={newAccRole}
                            onChange={(e) => setNewAccRole(e.target.value as 'master' | 'child')}
                            className={`w-full px-3 py-2 rounded-lg border text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer ${
                              isDark ? 'bg-slate-950 border-white/10 text-white' : 'bg-white border-slate-250 text-slate-900'
                            }`}
                          >
                            <option value="child">Child Account (Follower Node)</option>
                            <option value="master">Master Account (Trade Source)</option>
                          </select>
                        </div>

                        <div>
                          <label htmlFor="conn-broker" className="text-[10px] font-mono font-bold text-slate-400 block mb-1">BROKER SERVER / IP ADDRESS</label>
                          <input
                            id="conn-broker"
                            type="text"
                            required
                            placeholder="e.g. FundingNext-Demo-Live"
                            value={newAccBroker}
                            onChange={(e) => setNewAccBroker(e.target.value)}
                            className={`w-full px-3 py-2 rounded-lg border text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                              isDark ? 'bg-slate-950 border-white/10 text-white' : 'bg-white border-slate-250 text-slate-900'
                            }`}
                          />
                        </div>

                        <div>
                          <label htmlFor="conn-bal" className="text-[10px] font-mono font-bold text-slate-400 block mb-1">INITIAL VIRTUAL BALANCE ($)</label>
                          <input
                            id="conn-bal"
                            type="number"
                            value={newAccBalance}
                            onChange={(e) => setNewAccBalance(parseInt(e.target.value, 10))}
                            className={`w-full px-3 py-2 rounded-lg border text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                              isDark ? 'bg-slate-950 border-white/10 text-white' : 'bg-white border-slate-250 text-slate-900'
                            }`}
                          />
                        </div>
                      </div>
                    ) : (
                      /* STEP 2: CREDENTIALS FOR HANDSHAKE */
                      <div className="space-y-4 animate-fade-in text-left">
                        {/* High security alert notice */}
                        <div className={`p-4 rounded-xl border flex items-start gap-3 text-xs leading-relaxed ${
                          isDark ? 'bg-blue-500/5 border-blue-500/20 text-blue-400' : 'bg-blue-50/50 border-blue-200 text-blue-700'
                        }`}>
                          <Lock size={16} className="text-blue-500 flex-shrink-0 mt-0.5" />
                          <div className="space-y-1">
                            <h5 className="font-bold text-xs uppercase tracking-wider">Encrypted Handshake Routing Protocol</h5>
                            <p className="text-[11px] opacity-80 font-sans">
                              Tradesyncer runs completely sandboxed in the cloud. Credentials are encrypted on client transmission and directly routed into the secure terminal listener sockets of your requested node.
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="conn-email" className="text-[10px] font-mono font-bold text-slate-400 block mb-1">LOGIN EMAIL / OR USERNAME</label>
                            <input
                              id="conn-email"
                              type="text"
                              required
                              placeholder="e.g. trader@tradesyncer.com"
                              value={newAccEmail}
                              onChange={(e) => setNewAccEmail(e.target.value)}
                              className={`w-full px-3 py-2 rounded-lg border text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                                isDark ? 'bg-slate-950 border-white/10 text-white' : 'bg-white border-slate-250 text-slate-900'
                              }`}
                            />
                            <p className="text-[9px] text-slate-400 mt-1">Specify account identifier listed with your target broker platform.</p>
                          </div>

                          <div>
                            <label htmlFor="conn-password" className="text-[10px] font-mono font-bold text-slate-400 block mb-1">TERMINAL PASSWORD / SECURITY CODE</label>
                            <div className="relative">
                              <input
                                id="conn-password"
                                type={isPasswordVisible ? 'text' : 'password'}
                                required
                                placeholder="Your trading account secret password"
                                value={newAccPassword}
                                onChange={(e) => setNewAccPassword(e.target.value)}
                                className={`w-full pl-3 pr-10 py-2 rounded-lg border text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                                  isDark ? 'bg-slate-950 border-white/10 text-white' : 'bg-white border-slate-250 text-slate-900'
                                }`}
                              />
                              <button
                                type="button"
                                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                              >
                                {isPasswordVisible ? <EyeOff size={14} /> : <Eye size={14} />}
                              </button>
                            </div>
                            <p className="text-[9px] text-slate-400 mt-1">Both Master or follow Investor passwords can be supplied for child copier configurations.</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {newAccRole === 'child' && connectStep === 1 && (
                      <div className="space-y-1.5 border-t border-slate-500/10 pt-3">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-slate-400 uppercase tracking-widest text-[10px]">Multiplier Weight Ratio</span>
                          <span className="text-blue-500 font-mono font-bold">{newAccMultiplier}x</span>
                        </div>
                        <input
                          type="range"
                          min="0.1"
                          max="5.0"
                          step="0.1"
                          value={newAccMultiplier}
                          onChange={(e) => setNewAccMultiplier(parseFloat(e.target.value))}
                          className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-blue-500"
                        />
                      </div>
                    )}

                    {formError && (
                      <div className="text-rose-500 text-xs font-semibold flex items-center gap-1.5 pt-1">
                        <AlertCircle size={14} />
                        <span>{formError}</span>
                      </div>
                    )}

                    {/* Footer Buttons */}
                    <div className="flex justify-between items-center pt-2 border-t border-slate-500/10">
                      {/* Safety shield indicator */}
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <ShieldCheck size={12} className="text-emerald-500" />
                        <span>AES-256 Protocol active</span>
                      </span>

                      <div className="flex gap-2.5">
                        <button
                          type="button"
                          onClick={() => {
                            if (connectStep === 2) {
                              setConnectStep(1);
                              setFormError('');
                            } else {
                              setShowAddForm(false);
                            }
                          }}
                          className="px-4 py-2 border rounded-lg text-xs font-bold hover:bg-slate-500/10 cursor-pointer text-slate-400 hover:text-white transition-colors"
                        >
                          {connectStep === 2 ? 'Back to Config' : 'Cancel'}
                        </button>
                        
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer disabled:opacity-50 shadow-md shadow-blue-500/10"
                        >
                          {isSubmitting ? (
                            <span className="flex items-center gap-1">
                              <span className="w-2.5 h-2.5 rounded-full border border-t-transparent border-white animate-spin" />
                              <span>Authenticating...</span>
                            </span>
                          ) : (
                            <span>{connectStep === 1 ? 'Next: Authenticate' : 'Verify Broker Sockets'}</span>
                          )}
                        </button>
                      </div>
                    </div>

                  </form>
                )}

                {/* Table Accounts Grid */}
                <div className="space-y-4">
                  {accounts.map(acc => {
                    const isConnected = acc.status === 'connected';
                    const isMaster = acc.role === 'master';
                    return (
                      <div key={acc.id} className={`p-4 rounded-xl border flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between transition-all ${
                        isDark ? 'bg-white/[0.01] border-white/5 hover:bg-white/[0.02]' : 'bg-slate-50/50 border-slate-200 hover:bg-slate-100/50'
                      }`}>
                        
                        <div className="flex gap-3 items-start">
                          <span className={`px-2 py-1 rounded font-mono font-bold text-[9px] text-white ${
                            acc.platform === 'MT5' || acc.platform === 'MT4' ? 'bg-blue-600' : 'bg-teal-600'
                          }`}>
                            {acc.platform}
                          </span>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-bold text-sm tracking-tight">{acc.name}</h4>
                              <span className={`text-[9px] font-bold font-mono px-2 py-0.5 rounded uppercase ${
                                isMaster ? 'bg-blue-500/10 text-blue-500' : 'bg-emerald-500/10 text-emerald-500'
                              }`}>
                                {acc.role}
                              </span>
                              {!isMaster && acc.multiplier && (
                                <span className="text-[10px] text-slate-500 font-mono">({acc.multiplier}x Scale)</span>
                              )}
                            </div>
                            <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                              #{acc.accountNo} • {acc.broker}
                            </p>
                          </div>
                        </div>

                        {/* Balance Metrics & Controls */}
                        <div className="w-full sm:w-auto flex flex-row sm:flex-col justify-between sm:items-end gap-3.5 border-t sm:border-t-0 p-3 sm:p-0 border-slate-500/10 mt-2 sm:mt-0 pt-3">
                          <div className="text-left sm:text-right font-mono">
                            <p className="text-[9px] text-slate-500 uppercase tracking-wider">BALANCE / EQUITY</p>
                            <p className="text-xs font-bold">
                              ${acc.balance.toLocaleString()} / <span className="text-slate-400">${acc.equity.toLocaleString()}</span>
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => onToggleAccount(acc.id)}
                              className={`px-3 py-1 rounded-lg text-[10px] font-bold font-mono uppercase transition-all cursor-pointer ${
                                isConnected 
                                  ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500/20'
                                  : 'bg-slate-500/10 text-slate-400 border border-white/5 hover:bg-slate-500/20'
                              }`}
                            >
                              <span className="flex items-center gap-1">
                                <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-slate-500'}`} />
                                <span>{acc.status}</span>
                              </span>
                            </button>

                            <button
                              onClick={() => onDeleteAccount(acc.id, acc.name)}
                              className="p-1.5 rounded-lg border border-transparent text-slate-400 hover:bg-rose-500/10 hover:text-rose-500 cursor-pointer"
                              title="Delete bridge reference"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>

              </div>

            </div>
          )}

          {/* TAB 4: CENTRAL EXECUTION DESK COCKPIT */}
          {activeTab === 'cockpit' && (
            <div className="space-y-6 text-left animate-fade-in">
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Placement console Left (5 col) */}
                <div className="lg:col-span-5 space-y-6">
                  
                  <div className={`p-6 rounded-2xl border ${isDark ? 'bg-[#0A0A0B]/80 border-white/5' : 'bg-white border-slate-200'}`}>
                    <h3 className="text-sm font-bold tracking-tight mb-4 flex items-center gap-2">
                      <Zap size={14} className="text-amber-500" />
                      <span>Master execution Desk</span>
                    </h3>

                    {!connectedMasters.length ? (
                      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center space-y-2">
                        <AlertCircle className="mx-auto text-amber-500" size={24} />
                        <h4 className="font-bold text-xs">No Active Masters Connection</h4>
                        <p className="text-[10px] text-slate-500 leading-relaxed">
                          Please verify credentials and toggle Main FTMO account to active state inside Connections tab.
                        </p>
                      </div>
                    ) : (
                      <form onSubmit={handleExecuteOrders} className="space-y-4">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-400">Trading Route:</span>
                          <span className="text-blue-500 font-mono font-bold bg-blue-500/10 px-2 py-0.5 rounded">{connectedMasters[0].name}</span>
                        </div>

                        {/* Symbol Selection */}
                        <div className="grid grid-cols-3 gap-2">
                          {['XAUUSD', 'EURUSD', 'BTCUSD'].map(s => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => setTradeSymbol(s)}
                              className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                                tradeSymbol === s
                                  ? 'bg-blue-600 border-blue-500 text-white'
                                  : 'hover:bg-slate-500/10 text-slate-400 border-white/5 bg-slate-500/5'
                              }`}
                            >
                              {s === 'XAUUSD' ? 'Gold (XAU)' : s === 'BTCUSD' ? 'Bitcoin (BTC)' : 'EURUSD'}
                            </button>
                          ))}
                        </div>

                        {/* Buy or Sell block */}
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => setTradeType('BUY')}
                            className={`py-3 rounded-xl border text-xs font-bold transition-all cursor-pointer text-center ${
                              tradeType === 'BUY'
                                ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500'
                                : 'hover:bg-slate-500/5 text-slate-400 border-white/5'
                            }`}
                          >
                            BUY / LONG
                          </button>
                          <button
                            type="button"
                            onClick={() => setTradeType('SELL')}
                            className={`py-3 rounded-xl border text-xs font-bold transition-all cursor-pointer text-center ${
                              tradeType === 'SELL'
                                ? 'bg-rose-500/10 border-rose-500 text-rose-500'
                                : 'hover:bg-slate-500/5 text-slate-400 border-white/5'
                            }`}
                          >
                            SELL / SHORT
                          </button>
                        </div>

                        {/* Lots Input value */}
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block">Position size (LOTS)</label>
                          <div className="relative">
                            <input
                              type="number"
                              min="0.01"
                              max="20"
                              step="0.01"
                              value={tradeLots}
                              onChange={(e) => setTradeLots(parseFloat(e.target.value) || 1.00)}
                              className={`w-full px-3 py-2.5 rounded-lg border font-mono font-bold text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none ${
                                isDark ? 'bg-slate-900 border-white/10 text-white' : 'bg-white border-slate-250 text-slate-900'
                              }`}
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-bold text-slate-500 font-mono">LOT SPLIT</span>
                          </div>
                        </div>

                        <button
                          type="submit"
                          className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-500/20 cursor-pointer transform active:scale-98 transition-all flex items-center justify-center gap-1"
                        >
                          <Play size={12} fill="currentColor" />
                          <span>Dispatch Copy Command</span>
                        </button>

                        <p className="text-[9px] text-slate-500 italic text-center leading-relaxed">
                          * Dispatch triggers secure replication pipeline across {connectedChildrenVal.length} linked follower sub-node balances.
                        </p>
                      </form>
                    )}

                  </div>

                </div>

                {/* Live orders Right (7 col) */}
                <div className="lg:col-span-7 space-y-6">
                  
                  <div className={`p-6 rounded-2xl border ${isDark ? 'bg-[#0A0A0B]/80 border-white/5' : 'bg-white border-slate-200'}`}>
                    <h3 className="text-sm font-bold tracking-tight mb-4 flex items-center justify-between">
                      <span>Active Replication Positions ({openOrdersList.length})</span>
                      <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-500 font-bold px-1.5 py-0.5 rounded">AUTO MIRRORING</span>
                    </h3>

                    {openOrdersList.length === 0 ? (
                      <div className="py-12 text-center text-slate-500 border border-dashed border-slate-500/10 rounded-xl">
                        <Coins size={32} className="mx-auto text-slate-400 mb-2" />
                        <h4 className="font-bold text-xs">No Active Mirror Trades</h4>
                        <p className="text-[10px] text-slate-500">Initiate BUY or SELL commands inside the Master trader simulator desk</p>
                      </div>
                    ) : (
                      <div className="space-y-3 max-h-80 overflow-y-auto">
                        {openOrdersList.map(t => {
                          const isBuy = t.type === 'BUY';
                          const isCopied = !!t.masterTradeId;
                          return (
                            <div key={t.id} className="p-3.5 rounded-xl border border-white/5 bg-white/[0.01] flex justify-between items-center text-xs">
                              
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className={`px-1.5 py-0.5 rounded text-[8.5px] font-extrabold font-mono uppercase ${
                                    isBuy ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                                  }`}>
                                    {t.type}
                                  </span>
                                  <span className="font-bold">{t.symbol}</span>
                                  <span className="text-slate-400 font-mono">({t.lots} lots)</span>
                                </div>
                                <p className="text-[10px] font-mono text-slate-400">{t.accountName} • Ticket: #{t.ticket}</p>
                              </div>

                              <div className="text-right space-y-1 flex-shrink-0">
                                <p className="text-[9.5px] font-bold text-emerald-500 animate-pulse">Running Online</p>
                                {!isCopied ? (
                                  <button
                                    onClick={() => handleCloseMasterTradeRoute(t.id)}
                                    className="px-2 py-0.5 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 border border-rose-500/20 font-bold text-[9px] uppercase tracking-wider cursor-pointer font-mono"
                                  >
                                    Close Route
                                  </button>
                                ) : (
                                  <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 text-[9px] font-bold font-mono">
                                    Linked copy
                                  </span>
                                )}
                              </div>

                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                </div>

              </div>
              
              {/* Live Server auditing terminal output logs */}
              <div className={`p-6 rounded-2xl border ${isDark ? 'bg-[#0A0A0B]/80 border-white/5' : 'bg-white border-slate-200'}`}>
                <div className="flex justify-between items-center border-b border-slate-500/10 pb-3 mb-3">
                  <div>
                    <h3 className="text-sm font-bold tracking-tight">System Socket Diagnostic Auditor</h3>
                    <p className="text-[10px] text-slate-400">Verifying synchronization processes in real-time</p>
                  </div>
                  <button 
                    onClick={() => setLogs([])}
                    className="flex items-center gap-1 text-[10px] font-mono text-slate-400 hover:text-blue-500 cursor-pointer"
                  >
                    <RotateCcw size={10} />
                    <span>Clear logs</span>
                  </button>
                </div>

                <div className="bg-slate-950 text-slate-300 font-mono text-[10.5px] p-4 rounded-xl space-y-1 max-h-48 overflow-y-auto leading-relaxed text-left">
                  {logs.length === 0 ? (
                    <p className="text-slate-500 text-center italic py-4">Auditing logs empty. Send trades to initiate pipeline logs...</p>
                  ) : (
                    logs.map(log => (
                      <div key={log.id} className="flex gap-2">
                        <span className="text-slate-500">[{log.timestamp}]</span>
                        <span className={`flex-1 ${
                          log.type === 'success' ? 'text-emerald-400' :
                          log.type === 'warning' ? 'text-amber-500' :
                          log.type === 'error' ? 'text-rose-400 font-bold' : 'text-slate-400'
                        }`}>
                          {log.message}
                        </span>
                        {log.latency && (
                          <span className="text-[8.5px] bg-slate-900 px-1 py-0.5 rounded text-blue-500 font-bold">{log.latency ?? 0}ms</span>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          )}

          {/* TAB 5: MULTI-GROUPS POOLS */}
          {activeTab === 'groups' && (
            <div className="space-y-6 text-left animate-fade-in max-w-4xl mx-auto">
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Form Group compiles Left (5 col) */}
                <div className="lg:col-span-5 space-y-6">
                  <div className={`p-6 rounded-2xl border ${isDark ? 'bg-[#0A0A0B]/80 border-white/5' : 'bg-white border-slate-200'}`}>
                    <h3 className="text-sm font-bold tracking-tight mb-4 flex items-center gap-2">
                      <Users size={15} className="text-blue-500" />
                      <span>Compile Replication Pool</span>
                    </h3>

                    <form onSubmit={handleCreateGroup} className="space-y-4">
                      <div>
                        <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Group name</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Prop Challenger Pool"
                          value={newGroupName}
                          onChange={(e) => setNewGroupName(e.target.value)}
                          className={`w-full px-3 py-2 rounded-lg border text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none ${
                            isDark ? 'bg-slate-900 border-white/10 text-white' : 'bg-white border-slate-250 text-slate-900'
                          }`}
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Assigned master</label>
                        <select
                          value={newGroupMasterId}
                          onChange={(e) => setNewGroupMasterId(e.target.value)}
                          className={`w-full px-3 py-2 rounded-lg border text-xs focus:ring-1 focus:ring-blue-500 cursor-pointer ${
                            isDark ? 'bg-slate-900 border-white/10 text-white' : 'bg-white border-slate-250'
                          }`}
                        >
                          {accounts.filter(a => a.role === 'master').map(m => (
                            <option key={m.id} value={m.id}>{m.name} (#{m.accountNo})</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Assigned Followers</label>
                        <div className="space-y-1.5 max-h-32 overflow-y-auto border border-white/5 p-2 rounded-lg bg-slate-500/5">
                          {accounts.filter(a => a.role === 'child').map(c => {
                            const isChecked = newGroupChildrenIds.includes(c.id);
                            return (
                              <label key={c.id} className="flex items-center gap-2 text-xs text-slate-400 hover:text-white cursor-pointer select-none">
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => {
                                    if (isChecked) {
                                      setNewGroupChildrenIds(prev => prev.filter(id => id !== c.id));
                                    } else {
                                      setNewGroupChildrenIds(prev => [...prev, c.id]);
                                    }
                                  }}
                                  className="rounded accent-blue-500 text-white"
                                />
                                <span>{c.name}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Global Weight modifier</label>
                        <input
                          type="number"
                          step="0.1"
                          min="0.1"
                          max="5.0"
                          value={newGroupWeight}
                          onChange={(e) => setNewGroupWeight(parseFloat(e.target.value) || 1.0)}
                          className={`w-full px-3 py-1.5 rounded-lg border text-xs font-mono font-bold focus:ring-1 focus:ring-blue-500 focus:outline-none ${
                            isDark ? 'bg-slate-900 border-white/10 text-white' : 'bg-white border-white/5'
                          }`}
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg shadow-md cursor-pointer"
                      >
                        Create Group Pool
                      </button>
                    </form>
                  </div>
                </div>

                {/* Groups Display Right (7 col) */}
                <div className="lg:col-span-7 space-y-6">
                  <div className={`p-6 rounded-2xl border ${isDark ? 'bg-[#0A0A0B]/80 border-white/5' : 'bg-white border-slate-200'}`}>
                    <h3 className="text-sm font-bold tracking-tight mb-4">Active Routing Groups Pool ({replicationGroups.length})</h3>

                    <div className="space-y-4">
                      {replicationGroups.map(g => {
                        const mAcc = accounts.find(a => a.id === g.masterId);
                        return (
                          <div key={g.id} className="p-4 rounded-xl border border-white/5 bg-white/[0.01] space-y-2 text-xs">
                            <div className="flex justify-between items-center bg-blue-600/5 px-2.5 py-1.5 rounded-lg border border-blue-500/10">
                              <span className="font-bold text-blue-500">{g.name}</span>
                              <span className="font-mono bg-blue-600 text-white px-2 py-0.5 rounded text-[9px] font-bold uppercase">Weight: {g.weight}x</span>
                            </div>

                            <p className="text-slate-400 text-xs pointer-events-none">{g.description}</p>
                            
                            <div className="pt-2 border-t border-dashed border-white/5 space-y-1 font-mono text-[10.5px]">
                              <div>Master Source: <span className="text-slate-400 font-bold">{mAcc ? mAcc.name : 'Unknown master'}</span></div>
                              <div>Followers mapped: <span className="text-slate-400">{g.childIds.length} Child nodes bound</span></div>
                            </div>

                            <div className="pt-2 flex justify-end">
                              <button 
                                onClick={() => {
                                  setReplicationGroups(prev => prev.filter(grp => grp.id !== g.id));
                                  addLog(`Deleted group route: ${g.name}`, 'warning');
                                }}
                                className="text-[10px] font-bold text-rose-500 hover:underline cursor-pointer"
                              >
                                Delete Group mapping
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 6: RISK SHIELDS PARAMETERS */}
          {activeTab === 'risk' && (
            <div className="space-y-6 text-left animate-fade-in max-w-4xl mx-auto">
              
              <div className={`p-6 rounded-2xl border ${isDark ? 'bg-[#0A0A0B]/80 border-white/5' : 'bg-white border-slate-200'}`}>
                <h3 className="text-base font-bold mb-1 flex items-center gap-1.5">
                  <Shield size={16} className="text-blue-500" />
                  <span>Configure Risk Shield Guards</span>
                </h3>
                <p className="text-xs text-slate-400 mb-6">Engagement parameters designed to auto-halt replication should evaluation accounts hit margin alerts.</p>

                <div className="space-y-6">
                  
                  {/* Slide 1 */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-slate-400">DAILY MAX EVALUATION LOSS BARRIER ($)</span>
                      <span className="text-blue-500 font-mono font-extrabold font-bold">${riskDailyLimit.toLocaleString()}</span>
                    </div>
                    <input
                      type="range"
                      min="500"
                      max="10000"
                      step="500"
                      value={riskDailyLimit}
                      onChange={(e) => setRiskDailyLimit(parseInt(e.target.value, 10))}
                      className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                    <p className="text-[10px] text-slate-500 italic">Disables copier triggers immediately if aggregated closed daily loss passes limit.</p>
                  </div>

                  {/* Slide 2 */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-slate-400">MAX TOTAL SLIPPAGE TACTICAL BUFFER (PIPS)</span>
                      <span className="text-blue-500 font-mono font-extrabold font-bold">{riskSlippageBuffer} Pips</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="5.0"
                      step="0.1"
                      value={riskSlippageBuffer}
                      onChange={(e) => setRiskSlippageBuffer(parseFloat(e.target.value) || 1.0)}
                      className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                    <p className="text-[10px] text-slate-500 italic">Prevents execution copying on children if market spreads / slippages exceeds threshold.</p>
                  </div>

                  {/* Blacklist Asset checkboxes */}
                  <div className="space-y-2 border-t border-white/5 pt-4">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Ignored blacklisted assets list</h4>
                    <div className="flex gap-4">
                      {['EURUSD', 'BTCUSD', 'XAUUSD'].map(s => {
                        const isBlocked = restrictedSymbols.includes(s);
                        return (
                          <button
                            key={s}
                            type="button"
                            onClick={() => {
                              if (isBlocked) {
                                setRestrictedSymbols(prev => prev.filter(sym => sym !== s));
                                addLog(`Restored ${s} to active replication status.`, 'info');
                              } else {
                                setRestrictedSymbols(prev => [...prev, s]);
                                addLog(`Disabled replication copying for asset code: ${s}.`, 'warning');
                              }
                            }}
                            className={`px-3 py-1.5 rounded-lg font-mono font-bold text-xs border transition-all cursor-pointer ${
                              isBlocked 
                                ? 'bg-rose-500/10 border-rose-500 text-rose-500' 
                                : 'bg-slate-500/5 text-slate-500 hover:text-white border-white/5'
                            }`}
                          >
                            Block {s}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      onClick={() => {
                        setIsRiskConfigured(true);
                        addLog('🛡️ Secure drawdowns rules locked into copier flash core.', 'success');
                      }}
                      className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg cursor-pointer transition-all"
                    >
                      Save Secure Protection Rules
                    </button>
                  </div>

                </div>
              </div>

            </div>
          )}

          {/* TAB 7: ECONOMIC CALENDAR */}
          {activeTab === 'calendar' && (
            <div className="space-y-6 text-left animate-fade-in max-w-4xl mx-auto">
              
              <div className={`p-6 rounded-2xl border ${isDark ? 'bg-[#0A0A0B]/80 border-white/5' : 'bg-white border-slate-200'}`}>
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-500/10 pb-4 mb-6">
                  <div>
                    <h3 className="text-base font-bold flex items-center gap-1.5">
                      <Calendar size={16} className="text-blue-500" />
                      <span>Macro-Spike Copier Protection Calibrator</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 pointer-events-none">Automatically pauses replication routines around high volatility financial news releases.</p>
                  </div>

                  <div className="mt-4 sm:mt-0">
                    <button
                      onClick={handleToggleNewsProtection}
                      className={`px-4 py-2 border rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
                        newsSpikeProtection 
                          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500 shadow-md shadow-emerald-500/10'
                          : 'bg-slate-500/10 border-white/5 text-slate-400'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${newsSpikeProtection ? 'bg-emerald-500 animate-pulse' : 'bg-slate-500'}`} />
                      <span>{newsSpikeProtection ? 'SPIKE PROTOCOL ACTIVE' : 'ENGAGE SPIKE PROTECTION'}</span>
                    </button>
                  </div>
                </div>

                {/* News events schedule list */}
                <div className="space-y-3">
                  {newsEvents.map(e => (
                    <div key={e.id} className="p-4 rounded-xl border border-white/5 bg-white/[0.01] flex items-center justify-between text-xs">
                      
                      <div className="flex items-center gap-4">
                        <span className="font-mono bg-blue-500/10 px-2 py-0.5 rounded text-blue-500 font-extrabold text-[10px] tracking-wide">
                          {e.currency}
                        </span>
                        <div>
                          <h4 className="font-bold tracking-tight">{e.title}</h4>
                          <p className="text-[10px] text-slate-500 font-mono mt-0.5">Dispatches today @ {e.time}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className={`font-mono text-[9px] font-extrabold px-2 py-0.5 rounded uppercase ${
                          e.impact === 'HIGH' ? 'bg-rose-500/15 text-rose-500' : 'bg-amber-500/15 text-amber-500'
                        }`}>
                          {e.impact} IMPACT
                        </span>
                        
                        <span className="text-[10.5px] font-mono text-slate-400 bg-white/[0.02] px-2 py-0.5 rounded border border-white/5">
                          {newsSpikeProtection && e.impact === 'HIGH' ? '🚨 AUTO PAUSING' : 'Monitoring'}
                        </span>
                      </div>

                    </div>
                  ))}
                </div>

              </div>

            </div>
          )}

          {/* TAB 8: JOURNALING DASHBOARD */}
          {activeTab === 'journaling-dashboard' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <JournalingDashboard isDark={isDark} trades={trades} onAddLog={addLog} />
            </div>
          )}

          {/* TAB 8b: JOURNALING TRADES */}
          {activeTab === 'journaling-trades' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <JournalingTrades isDark={isDark} trades={trades} />
            </div>
          )}

          {/* TAB 8c: JOURNALING DAILY */}
          {activeTab === 'journaling-daily' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <JournalingDaily isDark={isDark} />
            </div>
          )}

          {/* TAB 8d: JOURNALING WEEKLY */}
          {activeTab === 'journaling-weekly' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <JournalingWeekly isDark={isDark} />
            </div>
          )}

          {/* TAB 8e: JOURNALING STRATEGY PLAYBOOKS */}
          {activeTab === 'journaling-strategy' && (
            <div className="max-w-4xl mx-auto space-y-6 text-left animate-fade-in animate-duration-300">
              <div className={`p-6 rounded-2xl border ${isDark ? 'bg-[#111622]/90 border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}>
                <h3 className="text-base font-bold mb-1">Trading Strategy Playbooks</h3>
                <p className="text-xs text-slate-400 mb-6 font-semibold">Define structural triggers, session guidelines, and rules-based checklists for your copiers.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="p-4.5 rounded-xl border border-white/5 bg-white/[0.01] space-y-3">
                    <span className="font-mono bg-blue-500/10 px-2 py-0.5 rounded text-blue-400 font-extrabold text-[9px] uppercase tracking-wide">GOLD SCALPER MATCH</span>
                    <h4 className="font-bold">Golden Hour NY Open Squeeze</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">Runs exclusively between 8:30 AM and 10:30 AM EST. Relies on 15m Fair Value Gap support blocks. High lot volume replication parameters.</p>
                    <div className="pt-2 border-t border-dashed border-white/5 text-[10.5px] text-slate-500 flex justify-between">
                      <span>Symbol: <strong>XAUUSD</strong></span>
                      <span>Target: <strong>2.5R Risk</strong></span>
                    </div>
                  </div>
                  
                  <div className="p-4.5 rounded-xl border border-white/5 bg-white/[0.01] space-y-3">
                    <span className="font-mono bg-indigo-500/10 px-2 py-0.5 rounded text-indigo-400 font-extrabold text-[9px] uppercase tracking-wide">SWING VALUE MATCH</span>
                    <h4 className="font-bold">H4 Institutional Order Block</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">Executes on H4 liquidity sweeps targeting relative equal highs or lows. Perfect for replication scaling with 0.5x risk weights.</p>
                    <div className="pt-2 border-t border-dashed border-white/5 text-[10.5px] text-slate-500 flex justify-between">
                      <span>Symbol: <strong>EURUSD, BTCUSD</strong></span>
                      <span>Target: <strong>4.0R Risk</strong></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8f: JOURNALING MANAGE DATA */}
          {activeTab === 'journaling-managedata' && (
            <div className="max-w-4xl mx-auto space-y-6 text-left animate-fade-in animate-duration-300">
              <div className={`p-6 rounded-2xl border ${isDark ? 'bg-[#111622]/90 border-white/5' : 'bg-white border-slate-200'}`}>
                <h3 className="text-base font-bold mb-1">Local Copy Cache Optimizer</h3>
                <p className="text-xs text-slate-400 mb-6">Manage replication indices, export databases, or perform hard clearing resetting actions.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="p-4.5 rounded-xl border border-white/5 bg-white/[0.01] flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-sm">Export Trade Ledger</h4>
                      <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">Save all execution entries locally in a structured spreadsheet format.</p>
                    </div>
                    <button 
                      onClick={() => {
                        const blob = new Blob([JSON.stringify(trades, null, 2)], { type: 'application/json' });
                        const link = document.createElement('a');
                        link.href = URL.createObjectURL(blob);
                        link.download = `tradesyncer_ledger_${Date.now()}.json`;
                        link.click();
                        addLog('Ledger coordinates exported as JSON successfully.', 'success');
                      }}
                      className="mt-4 px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer text-center font-sans"
                    >
                      Export JSON Data
                    </button>
                  </div>

                  <div className="p-4.5 rounded-xl border border-white/5 bg-white/[0.01] flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-sm">Synchronize Cache Sockets</h4>
                      <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">Fetch newer closed operations directly on London LD4 proxy bridge nodes.</p>
                    </div>
                    <button 
                      onClick={() => {
                        addLog('Local caching index matching synchronized.', 'info');
                      }}
                      className="mt-4 px-3 py-2 bg-slate-500/10 border border-white/5 hover:bg-slate-500/20 text-slate-300 font-bold text-xs rounded-lg transition-colors cursor-pointer text-center font-sans"
                    >
                      Trigger Re-Sync
                    </button>
                  </div>

                  <div className="p-4.5 rounded-xl border border-white/10 bg-rose-500/[0.01] flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-rose-400">Flush Memory Ledger</h4>
                      <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">Completely reset live simulated cache databases to default parameters.</p>
                    </div>
                    <button 
                      onClick={() => {
                        if (confirm('Are you absolutely sure you want to delete all trades logs cached entries? This cannot be undone.')) {
                          localStorage.removeItem('tradeplus_trades');
                          localStorage.removeItem('tradeplus_logs');
                          setTrades(INITIAL_TRADES);
                          setLogs(INITIAL_LOGS);
                          addLog('Trade copier simulation logs cleared successfully.', 'warning');
                        }
                      }}
                      className="mt-4 px-3 py-2 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500 text-rose-400 hover:text-white font-bold text-xs rounded-lg transition-colors cursor-pointer text-center font-sans"
                    >
                      Clear Memory Sockets
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 9a: PROP DISCOUNTS */}
          {activeTab === 'prop-discounts' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <PropDiscounts isDark={isDark} />
            </div>
          )}

          {/* TAB 9b: PROP EXPENSE TRACKER */}
          {activeTab === 'prop-expense' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <PropExpense isDark={isDark} />
            </div>
          )}

          {/* TAB 10: AFFILIATE PARTNER CODES */}
          {activeTab === 'affiliate' && (
            <div className="max-w-4xl mx-auto space-y-6 text-left animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className={`p-5 rounded-2xl border ${isDark ? 'bg-[#111622]/90 border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}>
                  <p className="text-[10px] font-bold text-slate-400 font-mono tracking-wider uppercase">Unpaid Affiliate Balance</p>
                  <h3 className="text-3xl font-mono font-extrabold text-blue-500 mt-1.5">$480.00</h3>
                  <div className="flex justify-between items-center text-[10.5px] text-slate-500 mt-3 border-t border-white/5 pt-3">
                    <span>Withdrawable on 1st of month</span>
                    <span className="text-blue-400 font-bold">Standard payout tier</span>
                  </div>
                </div>

                <div className={`p-5 rounded-2xl border ${isDark ? 'bg-[#111622]/90 border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}>
                  <p className="text-[10px] font-bold text-slate-400 font-mono tracking-wider uppercase">Active Premium Referrals</p>
                  <h3 className="text-3xl font-mono font-extrabold text-emerald-400 mt-1.5">16 Users</h3>
                  <div className="flex justify-between items-center text-[10.5px] text-slate-500 mt-3 border-t border-white/5 pt-3">
                    <span>Conversion rate: 22.4%</span>
                    <span className="text-emerald-400">⭐ Excellent rating</span>
                  </div>
                </div>

                <div className={`p-5 rounded-2xl border ${isDark ? 'bg-[#111622]/90 border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}>
                  <p className="text-[10px] font-bold text-slate-400 font-mono tracking-wider uppercase">Total commissions Paid</p>
                  <h3 className="text-3xl font-mono font-extrabold text-[#9c27b0] mt-1.5">$1,840.00</h3>
                  <div className="flex justify-between items-center text-[10.5px] text-slate-500 mt-3 border-t border-white/5 pt-3">
                    <span>Latest wire: May 29</span>
                  </div>
                </div>
              </div>

              {/* Campaign Link Card */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-5 space-y-6">
                  <div className={`p-6 rounded-2xl border ${isDark ? 'bg-[#111622]/90 border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}>
                    <h4 className="text-sm font-bold tracking-tight mb-4 flex items-center gap-1.5">
                      <Sparkles size={14} className="text-blue-500" />
                      <span>Custom Referral Campaign URL</span>
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed mb-4">Refer other traders to Tradesyncer and collect 15% recurring lifetime commissions on every premium plan they subscribe to.</p>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="text-[9px] font-bold text-slate-400 block mb-1">PARTNER LINK KEY</label>
                        <div className="bg-slate-500/5 px-3 py-2 rounded-lg border border-white/5 flex items-center justify-between text-xs">
                          <span className="font-mono text-slate-300">https://tradesyncer.com/ref?code=faizan2257</span>
                          <button 
                            onClick={() => {
                              navigator.clipboard.writeText('https://tradesyncer.com/ref?code=faizan2257');
                              addLog('Referral campaign link copied to clipboard.', 'success');
                            }}
                            className="text-blue-500 text-[10px] font-bold hover:underline cursor-pointer"
                          >
                            Copy Link
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-7 space-y-6">
                  <div className={`p-5 rounded-2xl border ${isDark ? 'bg-[#111622]/90 border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 font-mono">Commission Withdraw Ledger</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-white/5 text-[9.5px] uppercase font-bold text-slate-500 tracking-widest font-mono">
                            <th className="pb-3 pl-2">Date Cleared</th>
                            <th className="pb-3 text-center">Reference ID</th>
                            <th className="pb-3 text-center">Amount (USD)</th>
                            <th className="pb-3 text-right pr-2">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-slate-300 font-mono">
                          <tr className="hover:bg-slate-500/5 transition-colors">
                            <td className="py-3 pl-2 text-slate-400">2026-05-29 09:12</td>
                            <td className="py-3 text-center font-mono">#9021481</td>
                            <td className="py-3 text-center font-bold text-emerald-400">$640.00</td>
                            <td className="py-3 text-right pr-2 text-emerald-400 font-bold">COMPLETED</td>
                          </tr>
                          <tr className="hover:bg-slate-500/5 transition-colors">
                            <td className="py-3 pl-2 text-slate-400">2026-04-28 11:45</td>
                            <td className="py-3 text-center font-mono">#8914810</td>
                            <td className="py-3 text-center font-bold text-emerald-400">$1,200.00</td>
                            <td className="py-3 text-right pr-2 text-emerald-400 font-bold">COMPLETED</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 11: SYSTEM TUNING AND SETTINGS */}
          {activeTab === 'settings' && (
            <div className="max-w-4xl mx-auto space-y-6 text-left animate-fade-in">
              <div className={`p-6 rounded-2xl border ${isDark ? 'bg-[#111622]/90 border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}>
                <h3 className="text-base font-bold mb-1">Tradesyncer Enterprise Settings</h3>
                <p className="text-xs text-slate-400 mb-6">Manage global trade copier latency buffers, server routing regions, and cloud credentials.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* General latency offsets */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-mono font-bold text-blue-500 uppercase tracking-widest">Speed & Latency Tuning</h4>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block mb-1">MAX DELAY ALLOWED (MILLISECONDS)</label>
                      <input 
                        type="number" 
                        defaultValue={25}
                        className={`w-full px-3 py-2 text-xs font-mono rounded-lg border focus:ring-1 focus:ring-blue-500 focus:outline-none ${
                          isDark ? 'bg-slate-900 border-white/10 text-white' : 'bg-white border-slate-200'
                        }`}
                      />
                      <span className="text-[9px] text-slate-500 mt-1 block">Schedules order execution drops if network spikes exceed coordinates threshold.</span>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block mb-1">PROX_SERVER ROUTING ENDPOINT</label>
                      <select className={`w-full px-3 py-2 text-xs rounded-lg border cursor-pointer focus:ring-1 focus:ring-blue-500 focus:outline-none ${
                        isDark ? 'bg-slate-900 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-800'
                      }`}>
                        <option>LD4 Equinix (London) - Recommended (0.2ms Gateway)</option>
                        <option>NY4 Equinix (New York) - Backup (1.4ms Gateway)</option>
                        <option>TY3 Equinix (Tokyo) - Asia Hub (4.8ms Gateway)</option>
                      </select>
                    </div>
                  </div>

                  {/* Broker credentials config */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-mono font-bold text-blue-500 uppercase tracking-widest">Active Server Integrations</h4>
                    <div className="p-4 border border-white/5 rounded-xl bg-slate-500/5 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-xs">Bridge Server API Port</p>
                        <p className="text-[10px] text-slate-500 font-mono">Gateway active: 0.0.0.0:3000</p>
                      </div>
                      <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 font-mono text-[9px] rounded font-bold">STABLE</span>
                    </div>

                    <div className="p-4 border border-white/5 rounded-xl bg-slate-500/5 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-xs">Dynamic Slippage Cap</p>
                        <p className="text-[10px] text-slate-500 font-mono">Currently locked: 1.5 Pips max</p>
                      </div>
                      <span className="px-2 py-0.5 bg-blue-500/10 text-blue-500 font-mono text-[9px] rounded font-bold">LOCK_OK</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* INSTRUCTIONS MODAL CARD */}
      {showHelpModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 max-w-lg w-full text-left space-y-4">
            
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
              <h3 className="text-sm font-bold flex items-center gap-1.5 text-blue-500">
                <Info size={14} />
                <span>Tradesyncer Manual Guides</span>
              </h3>
              <button 
                onClick={() => setShowHelpModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X size={16} />
              </button>
            </div>

            <div className="text-xs space-y-3 leading-relaxed text-slate-300">
              <p>
                <strong>1. Connections Map:</strong> Connect at least one <strong>Master</strong> account (as the trades dispatcher) and multiple <strong>Child</strong> accounts. Toggle active buttons to connected.
              </p>
              <p>
                <strong>2. Copier Desk Cockpit:</strong> Go to Cockpit and choose your pairs symbol (Gold/XAUUSD, BTC, or major forex EURUSD). Select your direction (BUY or SELL) and contract size (Lots) and execute.
              </p>
              <p>
                <strong>3. Automated Multipliers:</strong> Folower accounts copy exact entries matching multipliers rules configured under connections panel (e.g., 2.0x weight scales a 1 Lot master order into a 2 Lot children order).
              </p>
              <p>
                <strong>4. Spike auto-pauser:</strong> Turn on calendar news filter autoplayer inside the Calendar tab to auto-idling copy bridges throughout macro claims reports.
              </p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowHelpModal(false)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold cursor-pointer transition-all"
              >
                Understood
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
