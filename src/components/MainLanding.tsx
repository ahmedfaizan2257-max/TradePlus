/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Cloud,
  Zap,
  Sliders,
  ShieldAlert,
  RefreshCw,
  GitCommit,
  Check,
  ChevronDown,
  ArrowRight,
  TrendingUp,
  Activity,
  Play,
  RotateCcw,
  Clock,
  Shield,
  Server,
  Terminal,
  HelpCircle,
  Flame
} from 'lucide-react';
import { PRICING_PLANS, CORE_FEATURES, FAQ_ITEMS, SUPPORTED_PLATFORMS } from '../mockData';
import { PlatformType } from '../types';

interface MainLandingProps {
  theme: 'light' | 'dark';
  onLaunchDashboard: () => void;
  onSelectPlan: (planName: string, isAnnual: boolean) => void;
}

export default function MainLanding({ theme, onLaunchDashboard, onSelectPlan }: MainLandingProps) {
  const isDark = theme === 'dark';

  // State for billing cycle (monthly vs annual)
  const [isAnnual, setIsAnnual] = useState(false);

  // FAQ open states
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Live Latency Indicator simulation
  const [latencies, setLatencies] = useState({
    london: 11,
    newyork: 14,
    frankfurt: 8,
    tokyo: 42
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setLatencies({
        london: Math.floor(Math.sin(Date.now() / 3000) * 3) + 12,
        newyork: Math.floor(Math.cos(Date.now() / 4000) * 4) + 15,
        frankfurt: Math.floor(Math.sin(Date.now() / 2000) * 2) + 9,
        tokyo: Math.floor(Math.cos(Date.now() / 5000) * 5) + 45
      });
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  // --- INTERACTIVE SIMULATOR STATE ---
  const [simAsset, setSimAsset] = useState('EURUSD');
  const [simType, setSimType] = useState<'BUY' | 'SELL'>('BUY');
  const [simLots, setSimLots] = useState(1.0);
  const [simStep, setSimStep] = useState<'idle' | 'executing' | 'synced'>('idle');
  const [simLoadingProgress, setSimLoadingProgress] = useState(0);
  const [simReplicatingChild1, setSimReplicatingChild1] = useState(false);
  const [simReplicatingChild2, setSimReplicatingChild2] = useState(false);
  const [simCompleteLogs, setSimCompleteLogs] = useState<Array<{ text: string; time: string; type: 'success' | 'info' | 'warn' }>>([]);
  const [simLatencies, setSimLatencies] = useState({ child1: 0, child2: 0 });

  const handleRunSimulator = (e: React.FormEvent) => {
    e.preventDefault();
    if (simStep === 'executing') return;

    setSimStep('executing');
    setSimLoadingProgress(0);
    setSimReplicatingChild1(false);
    setSimReplicatingChild2(false);

    const currentTime = new Date().toLocaleTimeString();
    setSimCompleteLogs([
      {
        text: `⚡ Triggered Master execution: ${simType} ${simLots.toFixed(2)} lots ${simAsset} on FTMO Master`,
        time: currentTime,
        type: 'info'
      }
    ]);

    // Animate upload progress (cloud translation)
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += 10;
      setSimLoadingProgress(progress);
      if (progress >= 100) {
        clearInterval(progressInterval);
        
        // Master order confirmation
        setSimCompleteLogs(prev => [
          ...prev,
          {
            text: `✨ Trade Plus Cloud Broker-Bridging Server resolved parameters in 4ms`,
            time: new Date().toLocaleTimeString(),
            type: 'success'
          }
        ]);

        // Start replicating child 1
        setTimeout(() => {
          setSimReplicatingChild1(true);
          const child1Time = Math.floor(Math.random() * 8) + 11; // 11-19 ms
          setSimLatencies(l => ({ ...l, child1: child1Time }));
          setSimCompleteLogs(prev => [
            ...prev,
            {
              text: `🎯 Replicated EURUSD BUY ${simLots.toFixed(2)} lots on FundedNext Child 1 [DXTrade] in ${child1Time}ms`,
              time: new Date().toLocaleTimeString(),
              type: 'success'
            }
          ]);
        }, 150);

        // Start replicating child 2 (takes longer due to 2.0xMultiplier configuration)
        setTimeout(() => {
          setSimReplicatingChild2(true);
          const child2Time = Math.floor(Math.random() * 12) + 18; // 18-30 ms
          setSimLatencies(l => ({ ...l, child2: child2Time }));
          setSimCompleteLogs(prev => [
            ...prev,
            {
              text: `🎯 Replicated EURUSD BUY ${(simLots * 2.0).toFixed(2)} lots (2.0x Multiplier) on IC Markets Child 2 [MatchTrader] in ${child2Time}ms`,
              time: new Date().toLocaleTimeString(),
              type: 'success'
            },
            {
              text: `🎉 Synchronization successfully completed in 100% of accounts.`,
              time: new Date().toLocaleTimeString(),
              type: 'info'
            }
          ]);
          setSimStep('synced');
        }, 350);
      }
    }, 40);
  };

  const handleResetSimulator = () => {
    setSimStep('idle');
    setSimLoadingProgress(0);
    setSimReplicatingChild1(false);
    setSimReplicatingChild2(false);
    setSimCompleteLogs([]);
    setSimLatencies({ child1: 0, child2: 0 });
  };

  const getFeatureIcon = (name: string) => {
    switch (name) {
      case 'Cloud': return <Cloud className="text-blue-500 stroke-[1.5]" size={24} />;
      case 'Zap': return <Zap className="text-amber-500 stroke-[1.5]" size={24} />;
      case 'Sliders': return <Sliders className="text-emerald-500 stroke-[1.5]" size={24} />;
      case 'ShieldAlert': return <ShieldAlert className="text-rose-500 stroke-[1.5]" size={24} />;
      case 'RefreshCw': return <RefreshCw className="text-cyan-500 stroke-[1.5]" size={24} />;
      case 'GitCommit': return <GitCommit className="text-purple-500 stroke-[1.5]" size={24} />;
      default: return <Zap className="text-blue-500 stroke-[1.5]" size={24} />;
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#0A0A0B] text-slate-100' : 'bg-[#FAFAFB] text-slate-800'}`}>
      
      {/* HERO SECTION */}
      <section className="relative pt-24 pb-20 md:pb-32 overflow-hidden border-b border-dashed border-slate-200 dark:border-slate-800">
        
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 -z-10 pointer-events-none opacity-30 select-none">
          <div className="absolute -top-10 left-1/4 w-[35rem] h-[35rem] bg-blue-500/20 rounded-full blur-[120px]" />
          <div className="absolute top-20 right-1/4 w-[30rem] h-[30rem] bg-blue-600/10 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/20 dark:border-blue-400/20">
                <Flame size={12} className="animate-pulse" />
                <span>Next-Gen Cloud Technology</span>
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-ping ml-1" />
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold tracking-tight leading-tight">
                Replicate trades in <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-400">milliseconds</span>, on pure Cloud.
              </h1>
              
              <p className={`text-lg sm:text-xl font-normal leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                100% Cloud-based trade copier built for FTMO, FundedNext, and retail traders. Sync MT4, MT5, DXTrade, MatchTrader, cTrader, and futures in real-time. No VPS required, no installation, and zero downtime.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <button
                  id="hero-launch-dashboard-btn"
                  onClick={onLaunchDashboard}
                  className="w-full sm:w-auto px-8 py-4 rounded-xl font-medium bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white shadow-lg shadow-blue-500/20 dark:shadow-blue-500/10 hover:shadow-blue-500/30 transition-all duration-200 transform active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Start Free Trial</span>
                  <ArrowRight size={18} />
                </button>
                <a
                  href="#pricing-section"
                  className={`w-full sm:w-auto px-8 py-4 rounded-xl font-medium border text-center transition-all duration-200 cursor-pointer ${
                    isDark
                      ? 'border-slate-800 bg-slate-900/40 text-slate-200 hover:bg-slate-900/80 hover:border-slate-700'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-[#FAFAFB]'
                  }`}
                >
                  View Copier Pricing
                </a>
              </div>

              {/* Core quick features */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-dashed border-slate-200 dark:border-slate-800 text-left">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-mono tracking-wider font-semibold text-blue-500">
                    <Zap size={14} />
                    <span>LATENCY</span>
                  </div>
                  <p className="text-xl font-display font-bold">{"< 15ms"}</p>
                  <p className="text-xs text-slate-500 pointer-events-none">Sub-millisecond core engine</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-mono tracking-wider font-semibold text-emerald-500">
                    <Cloud size={14} />
                    <span>INFRASTRUCTURE</span>
                  </div>
                  <p className="text-xl font-display font-bold">100% Cloud</p>
                  <p className="text-xs text-slate-500 pointer-events-none">No PC or VPS required</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-mono tracking-wider font-semibold text-amber-500">
                    <Activity size={14} />
                    <span>PLANS SUPPORT</span>
                  </div>
                  <p className="text-xl font-display font-bold">Multi-Broker</p>
                  <p className="text-xs text-slate-500 pointer-events-none">MT5, DXTrade, MatchTrader</p>
                </div>
              </div>
            </div>

            {/* Right: Live Interactive Trade Replication Simulator Widget */}
            <div className="lg:col-span-5 w-full">
              <div className={`p-6 rounded-2xl border transition-all duration-300 shadow-xl ${
                isDark
                  ? 'bg-slate-900/80 border-white/5'
                  : 'bg-white border-slate-200'
              }`}>
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-500">Live Copier Simulator</span>
                  </div>
                  <span className="text-xs px-2.5 py-1 bg-blue-500/10 text-blue-500 dark:text-blue-400 font-semibold rounded-md flex items-center gap-1.5">
                    <Activity size={12} />
                    Synced
                  </span>
                </div>

                {simStep === 'idle' && (
                  <form onSubmit={handleRunSimulator} className="space-y-4">
                    <div>
                      <p className="text-sm font-semibold mb-2">1. Select Instrument & Direction</p>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setSimType('BUY')}
                          className={`py-3 rounded-xl font-display font-bold text-center border transition-all ${
                            simType === 'BUY'
                              ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400'
                              : isDark
                                ? 'border-slate-800 bg-slate-900/30 text-slate-400 hover:bg-slate-900/50'
                                : 'border-slate-200 bg-[#FAFAFB] text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          BUY GBPUSD
                        </button>
                        <button
                          type="button"
                          onClick={() => setSimType('SELL')}
                          className={`py-3 rounded-xl font-display font-bold text-center border transition-all ${
                            simType === 'SELL'
                              ? 'bg-rose-500/10 border-rose-500 text-rose-600 dark:text-rose-400'
                              : isDark
                                ? 'border-slate-800 bg-slate-900/30 text-slate-400 hover:bg-slate-900/50'
                                : 'border-slate-200 bg-[#FAFAFB] text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          SELL GBPUSD
                        </button>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label htmlFor="sim-lot-input" className="text-sm font-semibold">2. Sizing on Master Account</label>
                        <span className="text-xs font-mono text-slate-400">FTMO Master</span>
                      </div>
                      <div className="relative">
                        <input
                          id="sim-lot-input"
                          type="number"
                          step="0.01"
                          min="0.01"
                          max="100"
                          value={simLots}
                          onChange={(e) => setSimLots(parseFloat(e.target.value) || 1.0)}
                          className={`w-full px-4 py-3 rounded-xl border text-lg font-mono font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            isDark
                              ? 'bg-[#0A0A0B] border-slate-800 text-slate-100'
                              : 'bg-white border-slate-300 text-slate-900'
                          }`}
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-xs font-bold text-slate-500">LOTS</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 leading-relaxed italic">
                      Replicating this order will route trades to two connected Child accounts simultaneously (Child 1 is DXTrade with 1.0x Multiplier, Child 2 is MatchTrader with 2.0x Multiplier).
                    </p>

                    <button
                      type="submit"
                      className="w-full py-4 rounded-xl flex items-center justify-center gap-2 font-display font-medium bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-500 text-white shadow-md active:scale-98 transition-all cursor-pointer"
                    >
                      <Play size={16} fill="currentColor" />
                      <span>Place Replicated Test Order</span>
                    </button>
                  </form>
                )}

                {simStep !== 'idle' && (
                  <div className="space-y-5">
                    {/* Visual Routing Map */}
                    <div className="space-y-4">
                      {/* Source Master Account Card */}
                      <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-white/5 bg-[#FAFAFB] dark:bg-[#0A0A0B]/40">
                        <div className="flex items-center gap-2.5">
                          <span className="h-6 w-6 rounded bg-blue-500 text-[10px] text-white flex items-center justify-center font-bold font-mono">MT5</span>
                          <div className="text-left">
                            <p className="text-xs font-bold">FTMO Master Account</p>
                            <p className="text-[10px] font-mono text-slate-400">Ticket: #984102</p>
                          </div>
                        </div>
                        <span className={`text-xs font-bold font-mono text-right ${simType === 'BUY' ? 'text-emerald-500' : 'text-rose-500'}`}>
                          {simType} {simLots.toFixed(2)} LOTS
                        </span>
                      </div>

                      {/* Bridging Line Animation */}
                      <div className="relative h-12 flex justify-center items-center">
                        <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-slate-200 dark:bg-slate-800" />
                        <div
                          className="absolute left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-blue-500 shadow-md animate-ping"
                          style={{ top: `${simLoadingProgress}%` }}
                        />
                        <div className="z-10 px-3 py-1 rounded bg-blue-500 text-[10px] text-white font-mono font-medium shadow-sm">
                          Cloud Bridge Plus
                        </div>
                      </div>

                      {/* Children Accounts Replications */}
                      <div className="grid grid-cols-2 gap-3">
                        {/* Child Account 1 */}
                        <div className={`p-3 rounded-xl border transition-all duration-300 ${
                          simReplicatingChild1
                            ? 'bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/60'
                            : 'bg-[#FAFAFB]/50 dark:bg-[#0A0A0B]/10 border-slate-200 dark:border-slate-800'
                        }`}>
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <span className="h-5 w-5 bg-teal-500 text-[10px] text-white flex items-center justify-center font-bold rounded">DX</span>
                            <span className="text-[10px] font-bold">FundedNext (1x)</span>
                          </div>
                          {simReplicatingChild1 ? (
                            <div className="space-y-1">
                              <p className="text-xs font-bold font-mono text-emerald-500">
                                {simType} {simLots.toFixed(2)} LOTS
                              </p>
                              <p className="text-[9px] font-mono text-slate-400 mt-1">Latency: {simLatencies.child1}ms</p>
                            </div>
                          ) : (
                            <div className="h-6 flex items-center gap-1.5">
                              <span className="h-1.5 w-1.5 rounded bg-slate-400 animate-ping" />
                              <span className="text-[10px] font-mono text-slate-400 italic">Waiting...</span>
                            </div>
                          )}
                        </div>

                        {/* Child Account 2 */}
                        <div className={`p-3 rounded-xl border transition-all duration-300 ${
                          simReplicatingChild2
                            ? 'bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/60'
                            : 'bg-[#FAFAFB]/50 dark:bg-[#0A0A0B]/10 border-slate-200 dark:border-slate-800'
                        }`}>
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <span className="h-5 w-5 bg-purple-500 text-[10px] text-white flex items-center justify-center font-bold rounded">MTR</span>
                            <span className="text-[10px] font-bold">IC Markets (2x)</span>
                          </div>
                          {simReplicatingChild2 ? (
                            <div className="space-y-1">
                              <p className="text-xs font-bold font-mono text-emerald-500 text-left">
                                {simType} {(simLots * 2.0).toFixed(2)} LOTS
                              </p>
                              <p className="text-[9px] font-mono text-slate-400 mt-1">Latency: {simLatencies.child2}ms</p>
                            </div>
                          ) : (
                            <div className="h-6 flex items-center gap-1.5">
                              <span className="h-1.5 w-1.5 rounded bg-slate-400 animate-ping" />
                              <span className="text-[10px] font-mono text-slate-400 italic">Waiting...</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Console Log stream */}
                    <div className="bg-[#0A0A0B] text-slate-200 rounded-xl p-3.5 font-mono text-[10px] space-y-1.5 max-h-36 overflow-y-auto border border-slate-800 text-left">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-1.5 text-[9px] text-slate-400">
                        <span>REPLICATION EVENTS LOG</span>
                        <div className="flex items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span>Stream Active</span>
                        </div>
                      </div>
                      {simCompleteLogs.map((log, index) => (
                        <div key={index} className="flex gap-2 items-start">
                          <span className="text-slate-500 select-none">[{log.time}]</span>
                          <span className={log.type === 'success' ? 'text-emerald-400' : 'text-slate-200'}>
                            {log.text}
                          </span>
                        </div>
                      ))}
                    </div>

                    {simStep === 'synced' && (
                      <button
                        onClick={handleResetSimulator}
                        className={`w-full py-2.5 rounded-xl border flex items-center justify-center gap-2 text-xs font-semibold cursor-pointer ${
                          isDark
                            ? 'border-slate-800 hover:bg-slate-900 text-slate-300'
                            : 'border-slate-200 hover:bg-[#FAFAFB] text-slate-600'
                        }`}
                      >
                        <RotateCcw size={14} />
                        <span>Run Another Test Order</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* PLATFORMS GRID */}
      <section id="platforms-section" className="py-16 bg-[#FAFAFB]/50 dark:bg-[#0A0A0B]/20 border-b border-dashed border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-mono font-bold tracking-widest text-blue-500 uppercase mb-3">Sync Seamlessly</p>
          <h2 className="text-2xl sm:text-3xl font-display font-bold tracking-tight mb-8">
            Universal Cross-Platform Synchronization
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {SUPPORTED_PLATFORMS.map((platform) => (
              <div
                key={platform.id}
                className={`p-4 rounded-xl border flex flex-col items-center justify-center text-center transition-all duration-300 group ${
                  isDark
                    ? 'bg-slate-900/40 border-slate-800 hover:bg-blue-950/20 hover:border-blue-500/40 hover:shadow-lg hover:shadow-blue-500/10'
                    : 'bg-white border-slate-200 hover:bg-blue-500/5 hover:border-blue-500/30 hover:shadow-md'
                }`}
              >
                <div className={`p-2 rounded g-none mb-2 font-mono font-bold text-xs ${
                  platform.id === 'MT4' || platform.id === 'MT5'
                    ? 'bg-blue-500/10 text-blue-500'
                    : platform.id === 'DXTrade'
                      ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400'
                      : platform.id === 'MatchTrader'
                        ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
                        : 'bg-blue-500/10 text-blue-500'
                }`}>
                  {platform.logo}
                </div>
                <p className="text-sm font-semibold">{platform.name}</p>
                <p className="text-[10px] text-slate-500 pointer-events-none mt-1">{platform.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LATENCY LIVE STREAM */}
      <section id="specs-section" className="py-16 border-b border-dashed border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Texts */}
            <div className="lg:col-span-5 space-y-4 text-center lg:text-left">
              <span className="text-xs font-mono font-bold tracking-widest text-emerald-500 uppercase">Speed Test</span>
              <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight">
                Replication Speed That Protects Your Drawdown
              </h2>
              <p className={`text-base leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Slippage costs prop firm evaluations. Our high-frequency bridging lines sync orders globally in milliseconds utilizing server clusters stationed next to major brokers across Frankfurt, London, and New York.
              </p>
              <div className="pt-2 flex justify-center lg:justify-start items-center gap-6">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="text-xs font-mono font-semibold">Uptime: 99.99%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-blue-500" />
                  <span className="text-xs font-mono font-semibold">Delay: Under 15ms</span>
                </div>
              </div>
            </div>

            {/* Right Live Latency Grid */}
            <div className="lg:col-span-7">
              <div className="grid grid-cols-2 gap-4">
                <div className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-900/50 border-white/5' : 'bg-white border-slate-200'} text-left`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-mono text-slate-500">LD4 Server — London</span>
                    <Server size={14} className="text-slate-400" />
                  </div>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-3xl font-display font-bold font-mono tracking-tight text-emerald-500">{latencies.london}</span>
                    <span className="text-xs font-mono text-slate-400">ms</span>
                  </div>
                  <div className="h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full transition-all duration-300" style={{ width: `${latencies.london * 2}%` }} />
                  </div>
                </div>

                <div className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-900/50 border-white/5' : 'bg-white border-slate-200'} text-left`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-mono text-slate-500">NY4 Server — New York</span>
                    <Server size={14} className="text-slate-400" />
                  </div>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-3xl font-display font-bold font-mono tracking-tight text-emerald-500">{latencies.newyork}</span>
                    <span className="text-xs font-mono text-slate-400">ms</span>
                  </div>
                  <div className="h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full transition-all duration-300" style={{ width: `${latencies.newyork * 2}%` }} />
                  </div>
                </div>

                <div className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-900/50 border-white/5' : 'bg-white border-slate-200'} text-left`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-mono text-slate-500">FR2 Server — Frankfurt</span>
                    <Server size={14} className="text-slate-400" />
                  </div>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-3xl font-display font-bold font-mono tracking-tight text-emerald-500">{latencies.frankfurt}</span>
                    <span className="text-xs font-mono text-slate-400">ms</span>
                  </div>
                  <div className="h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full transition-all duration-300" style={{ width: `${latencies.frankfurt * 2.5}%` }} />
                  </div>
                </div>

                <div className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-900/50 border-white/5' : 'bg-white border-slate-200'} text-left`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-mono text-slate-500">TY3 Server — Tokyo</span>
                    <Server size={14} className="text-slate-400" />
                  </div>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-3xl font-display font-bold font-mono tracking-tight text-blue-400">{latencies.tokyo}</span>
                    <span className="text-xs font-mono text-slate-400">ms</span>
                  </div>
                  <div className="h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full transition-all duration-300" style={{ width: `${latencies.tokyo * 1.5}%` }} />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CORE FEATURES */}
      <section id="features-section" className="py-20 bg-[#FAFAFB]/20 dark:bg-[#0A0A0B]/10 border-b border-dashed border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-mono font-bold tracking-widest text-blue-500 uppercase">Why Tradesyncer</span>
            <h2 className="text-3xl sm:text-5xl font-display font-bold tracking-tight">
              A Complete Powerhouse for Cloud Replication
            </h2>
            <p className={`text-base sm:text-lg ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Engineered with meticulous precision, giving you clean controls over accounts, slippages, and limits without heavy VPS settings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CORE_FEATURES.map((feat) => (
              <div
                key={feat.title}
                className={`p-6 rounded-2xl border transition-all duration-300 flex flex-col group text-left ${
                  isDark
                    ? 'bg-slate-900/30 border-slate-800 hover:bg-slate-900/60 hover:border-slate-700 hover:shadow-lg'
                    : 'bg-white border-slate-200 hover:bg-blue-500/[0.01] hover:border-slate-300 hover:shadow-md'
                }`}
              >
                <div className={`p-2.5 rounded-xl w-fit mb-4 transition-transform group-hover:scale-105 ${
                  isDark ? 'bg-slate-900 text-blue-400 border border-slate-800' : 'bg-slate-100 text-blue-600'
                }`}>
                  {getFeatureIcon(feat.iconName)}
                </div>
                <h3 className="text-lg font-bold font-display tracking-tight mb-2">{feat.title}</h3>
                <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {feat.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 border-b border-dashed border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-mono font-bold tracking-widest text-blue-500 uppercase">Getting Started</span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight">
              Synchronize in Three Simple Steps
            </h2>
            <p className={`text-base ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Establish connections in minutes, configure robust hazard gates, and let our engine handle the rest completely in the cloud.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            
            {/* Step 1 */}
            <div className="space-y-4 text-center relative group">
              <span className={`text-5xl font-extrabold font-display leading-[0] ${isDark ? 'text-slate-800' : 'text-slate-200'}`}>01</span>
              <h3 className="text-lg font-bold">Link Your Accounts</h3>
              <p className={`text-sm max-w-sm mx-auto leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Securely enter your API, account credentials, or trading keys (MT4, MT5, DXTrade, or MatchTrader) inside our dashboard.
              </p>
            </div>

            {/* Step 2 */}
            <div className="space-y-4 text-center relative group">
              <span className={`text-5xl font-extrabold font-display leading-[0] ${isDark ? 'text-slate-800' : 'text-slate-200'}`}>02</span>
              <h3 className="text-lg font-bold">Setup Copier Rules</h3>
              <p className={`text-sm max-w-sm mx-auto leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Define your multipliers (e.g. 1.0x master, fixed lot 0.1, or size-matched ratios), safety slippage parameters, and symbol converters.
              </p>
            </div>

            {/* Step 3 */}
            <div className="space-y-4 text-center relative group">
              <span className={`text-5xl font-extrabold font-display leading-[0] ${isDark ? 'text-slate-800' : 'text-slate-200'}`}>03</span>
              <h3 className="text-lg font-bold">Start Cloud Sync</h3>
              <p className={`text-sm max-w-sm mx-auto leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Activate rules. Trades are now fully monitored. Sleep, close your browser, or hit the beach — cloud replication works round-the-clock.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section id="pricing-section" className="py-20 bg-[#FAFAFB]/40 dark:bg-[#0A0A0B]/40 border-b border-dashed border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto mb-12 space-y-3">
            <span className="text-xs font-mono font-bold tracking-widest text-blue-500 uppercase">Straightforward Pricing</span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight">
              Invest in Speed. Protect Your Challenges.
            </h2>
            <p className={`text-base ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Choose the cloud copier capacity that aligns with your trading operations. Switch monthly or annual subscription easily.
            </p>

            {/* Billing cycle toggle */}
            <div className="pt-4 flex items-center justify-center gap-3.5">
              <span className={`text-sm ${!isAnnual ? 'font-bold text-slate-900 dark:text-slate-100' : 'text-slate-400'}`}>Monthly</span>
              <button
                id="billing-cycle-toggle-btn"
                onClick={() => setIsAnnual(!isAnnual)}
                className={`relative w-12 h-6.5 rounded-full p-1 transition-colors outline-none focus:ring-2 focus:ring-blue-500 ${
                  isAnnual ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <div
                  className={`w-4.5 h-4.5 rounded-full bg-white transition-all transform shadow ${
                    isAnnual ? 'translate-x-5.5' : 'translate-x-0'
                  }`}
                />
              </button>
              <span className={`text-sm flex items-center gap-1 bg-green-500/10 text-green-600 dark:text-green-400 px-2 py-0.5 rounded-full font-bold ${isAnnual ? 'text-slate-900 dark:text-slate-100' : 'text-slate-400'}`}>
                <span>Annually</span>
                <span className="text-[10px] font-extrabold uppercase tracking-wider">Save 20%</span>
              </span>
            </div>
          </div>

          {/* Pricing cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PRICING_PLANS.map((plan) => {
              const price = isAnnual ? plan.priceAnnual : plan.priceMonthly;
              const hasRecommended = plan.recommended;

              return (
                <div
                  key={plan.name}
                  className={`relative p-6 rounded-2xl border transition-all duration-300 flex flex-col hover:-translate-y-1 text-left ${
                    hasRecommended
                      ? isDark
                        ? 'bg-slate-900/90 border-blue-500/80 shadow-lg shadow-blue-500/10'
                        : 'bg-white border-blue-500 shadow-xl shadow-blue-500/5'
                      : isDark
                        ? 'bg-slate-900/30 border-slate-800'
                        : 'bg-white border-slate-200'
                  }`}
                >
                  {hasRecommended && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white bg-blue-600 rounded-full">
                      Most Popular
                    </span>
                  )}

                  <div className="mb-5">
                    <p className="text-lg font-bold font-display tracking-tight text-blue-500">{plan.name}</p>
                    <div className="flex items-baseline gap-1 mt-2">
                      <span className="text-4xl font-extrabold font-display">${price}</span>
                      <span className="text-sm text-slate-500 font-normal">/ month</span>
                    </div>
                    <p className={`text-xs mt-2 font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Sync up to <span className="font-bold underline">{plan.accountsLimit} accounts</span>
                    </p>
                  </div>

                  <ul className="space-y-2.5 mb-8 border-t border-dashed border-slate-200 dark:border-slate-800 pt-4 text-xs font-normal">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex gap-2.5 items-start">
                        <Check size={14} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    id={`select-plan-btn-${plan.name.toLowerCase().replace(' ', '-')}`}
                    onClick={() => onSelectPlan(plan.name, isAnnual)}
                    className={`w-full py-3 rounded-xl font-medium text-xs font-display flex items-center justify-center gap-1 shadow transition-all active:scale-98 cursor-pointer ${
                      hasRecommended
                        ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/20'
                        : isDark
                          ? 'border border-slate-700 bg-slate-800 text-slate-100 hover:bg-slate-750'
                          : 'border border-slate-200 bg-[#FAFAFB] text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>Get Started</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQS ACCORDION */}
      <section className="py-20 border-b border-dashed border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-12 space-y-3">
            <span className="text-xs font-mono font-bold tracking-widest text-blue-500 uppercase">Trade Copier FAQ</span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight">
              Frequently Answered Questions
            </h2>
            <p className={`text-base ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Browse responses to common workflow questions or get in touch with our live support team.
            </p>
          </div>

          <div className="space-y-3.5 text-left">
            {FAQ_ITEMS.map((faq, index) => {
              const isOpen = openFaqIndex === index;

              return (
                <div
                  key={index}
                  className={`border rounded-2xl transition-all duration-300 ${
                    isOpen
                      ? isDark
                        ? 'bg-slate-900/40 border-slate-750'
                        : 'bg-white border-slate-300/80 shadow-md'
                      : isDark
                        ? 'bg-slate-900/10 border-white/5 hover:bg-slate-900/30'
                        : 'bg-[#FAFAFB]/50 border-slate-200 hover:bg-slate-100/50'
                  }`}
                >
                  <button
                    id={`faq-toggle-btn-${index}`}
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full px-5 py-4 flex items-center justify-between font-semibold font-display text-sm text-left focus:outline-none cursor-pointer"
                  >
                    <span className="flex items-center gap-2.5">
                      <HelpCircle size={16} className="text-blue-500" />
                      {faq.question}
                    </span>
                    <ChevronDown
                      size={16}
                      className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </button>

                  <div
                    className={`transition-all duration-300 overflow-hidden ${
                      isOpen ? 'max-h-52 border-t border-dashed border-slate-200 dark:border-slate-800' : 'max-h-0'
                    }`}
                  >
                    <div className={`px-5 py-4 text-xs font-normal leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {faq.answer}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* PRE-FOOTER CALL TO ACTION */}
      <section className="py-20 relative overflow-hidden text-center bg-slate-900 text-white">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-72 pointer-events-none select-none opacity-40">
          <div className="absolute top-10 left-10 w-96 h-96 bg-blue-600 rounded-full blur-[100px]" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative space-y-6">
          <h2 className="text-3xl sm:text-5xl font-display font-medium tracking-tight">
            Stop Leaving Funded Performance to Latency
          </h2>
          <p className="text-slate-400 font-normal text-base max-w-2xl mx-auto leading-relaxed">
            Link your master and child accounts today. Replicate sizes, safeguard drawdowns in the background, and achieve ultimate leverage.
          </p>
          <div className="pt-2 flex justify-center">
            <button
              id="cta-launch-copier-btn"
              onClick={onLaunchDashboard}
              className="px-8 py-4 rounded-xl font-medium bg-white text-slate-900 hover:bg-slate-100 shadow-xl shadow-blue-950/10 transition-all duration-200 active:scale-98 flex items-center gap-2 cursor-pointer"
            >
              <span>Start Free Trial</span>
              <ArrowRight size={16} className="text-blue-600" />
            </button>
          </div>
          <div className="pt-4 flex justify-center items-center gap-6 text-[10px] text-slate-500 font-mono uppercase tracking-wider">
            <span>✓ No credit card required</span>
            <span>✦ Instant bridge activation</span>
            <span>✦ 100% cloud secure</span>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-14 bg-[#0A0A0B] text-slate-400 border-t border-white/5 text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-white/5">
            
            {/* Logo/Identity */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="p-1 px-2.5 rounded bg-gradient-to-r from-blue-500 to-blue-600 text-white font-mono font-extrabold text-sm tracking-tighter">
                  TS
                </span>
                <span className="font-display font-bold text-white tracking-tight">Tradesyncer</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed pointer-events-none">
                100% Cloud-based proprietary trade copier engine designed for high-performing prop firm scaling and multi-metric retail setups.
              </p>
            </div>

            {/* Platform links */}
            <div className="space-y-3">
              <p className="text-xs font-semibold text-white uppercase tracking-wider">Supported Platforms</p>
              <ul className="space-y-1.5 text-xs">
                <li><a href="#platforms-section" className="hover:text-blue-400 cursor-pointer transition-colors block">MT5 Trade Copier</a></li>
                <li><a href="#platforms-section" className="hover:text-blue-400 cursor-pointer transition-colors block">MT4 Trade Copier</a></li>
                <li><a href="#platforms-section" className="hover:text-blue-400 cursor-pointer transition-colors block">DXTrade Copier</a></li>
                <li><a href="#platforms-section" className="hover:text-blue-400 cursor-pointer transition-colors block">MatchTrader Copier</a></li>
                <li><a href="#platforms-section" className="hover:text-blue-400 cursor-pointer transition-colors block">cTrader Trade Copier</a></li>
              </ul>
            </div>

            {/* Nav Links */}
            <div className="space-y-3">
              <p className="text-xs font-semibold text-white uppercase tracking-wider">Product navigation</p>
              <ul className="space-y-1.5 text-xs">
                <li><a href="#features-section" className="hover:text-amber-500 cursor-pointer transition-colors block">Features List</a></li>
                <li><a href="#specs-section" className="hover:text-amber-500 cursor-pointer transition-colors block">Replication Speed</a></li>
                <li><a href="#pricing-section" className="hover:text-amber-500 cursor-pointer transition-colors block">Pricing Plans</a></li>
                <li><a href="#pricing-section" className="hover:text-amber-500 cursor-pointer transition-colors block">FAQ Accordion</a></li>
                <li><span className="hover:text-white cursor-pointer transition-colors block" onClick={onLaunchDashboard}>Simulated Console</span></li>
              </ul>
            </div>

            {/* Contact Support */}
            <div className="space-y-3">
              <p className="text-xs font-semibold text-white uppercase tracking-wider">Contact & Legal</p>
              <p className="text-xs text-slate-500 pointer-events-none leading-relaxed">
                Need specialized assistance with custom bridge mapping? Reach out to our technical integration team.
              </p>
              <p className="text-xs text-blue-400 font-mono font-bold">support@tradesyncer.com</p>
            </div>
          </div>

          {/* RISK DISCLOSURE & LEGAL */}
          <div className="pt-8 text-[10px] text-slate-600 leading-relaxed space-y-4 pointer-events-none">
            <p>
              <strong className="text-slate-500">CFTC Rule 4.41 Statement:</strong> HYPOTHETICAL OR SIMULATED PERFORMANCE RESULTS HAVE CERTAIN LIMITATIONS. UNLIKE AN ACTUAL PERFORMANCE RECORD, SIMULATED RESULTS DO NOT REPRESENT ACTUAL TRADING. ALSO, SINCE THE TRADES HAVE NOT BEEN EXECUTED, THE RESULTS MAY HAVE UNDER-OR-OVER COMPENSATED FOR THE IMPACT, IF ANY, OF CERTAIN MARKET FACTORS, SUCH AS LACK OF LIQUIDITY. SIMULATED TRADING PROGRAMS IN GENERAL ARE ALSO SUBJECT TO THE FACT THAT THEY ARE DESIGNED WITH THE BENEFIT OF HINDSIGHT. NO REPRESENTATION IS BEING MADE THAT ANY ACCOUNT WILL OR IS LIKELY TO ACHIEVE PROFIT OR LOSSES SIMILAR TO THOSE SHOWN.
            </p>
            <p>
              Tradesyncer does not execute trades directly or broker derivative securities. All bridging, connection replication, and synchronizations are operated purely on virtual user directions. Futures, CFDs, and financial derivatives involve substantial capital risk. Under no instances should synthetic copiers be relied upon as financial advice or safe hedging tools.
            </p>
            <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-4 text-slate-700 pt-2 text-[9px]">
              <span>© {new Date().getFullYear()} Tradesyncer Clone. All rights reserved. Made by premium coder.</span>
              <div className="flex gap-4">
                <span>Terms of Service</span>
                <span>Privacy Statement</span>
                <span>Bridging SLA Guidelines</span>
              </div>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
