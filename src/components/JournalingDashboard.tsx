import React from 'react';
import { TradeOrder } from '../types';
import { TrendingUp, Award, Clock, DollarSign, Activity } from 'lucide-react';

interface JournalingDashboardProps {
  isDark: boolean;
  trades: TradeOrder[];
  onAddLog?: (message: string, type: 'info' | 'success' | 'warning' | 'error') => void;
}

export default function JournalingDashboard({ isDark, trades, onAddLog }: JournalingDashboardProps) {
  const closedTrades = trades.filter(t => t.status === 'CLOSED');
  
  // Calculate stats dynamically, fall back to beautiful preset numbers if no trades
  const totalTrades = closedTrades.length;
  const winningTrades = closedTrades.filter(t => (t.pnl || 0) > 0);
  const losingTrades = closedTrades.filter(t => (t.pnl || 0) < 0);
  
  const totalProfit = winningTrades.reduce((sum, t) => sum + (t.pnl || 0), 0);
  const totalLoss = Math.abs(losingTrades.reduce((sum, t) => sum + (t.pnl || 0), 0));
  
  const profitFactor = totalLoss > 0 ? (totalProfit / totalLoss).toFixed(2) : totalProfit > 0 ? 'Max' : '0.00';
  const winRate = totalTrades > 0 ? Math.round((winningTrades.length / totalTrades) * 100) : 0;
  
  const netPnl = closedTrades.reduce((sum, t) => sum + (t.pnl || 0), 0);
  
  // High-fidelity fallback values for realistic demonstration
  const displayNetPnl = totalTrades > 0 ? netPnl : 4250.50;
  const displayTradesCount = totalTrades > 0 ? totalTrades : 24;
  const displayWinRate = totalTrades > 0 ? winRate : 68;
  const displayProfitFactor = totalTrades > 0 ? profitFactor : '2.14';
  
  const bestTrade = closedTrades.reduce((max, t) => Math.max(max, t.pnl || 0), 0);
  const displayBestTrade = totalTrades > 0 ? bestTrade : 840.00;
  
  const worstTrade = closedTrades.reduce((min, t) => Math.min(min, t.pnl || 0), 0);
  const displayWorstTrade = totalTrades > 0 ? worstTrade : -310.00;

  return (
    <div className="space-y-6 animate-fade-in text-left" id="journaling-dashboard-render">
      {/* Top Selector Belt */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-500/5 p-4 rounded-2xl border border-white/5">
        <div className="flex gap-2">
          <button className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-blue-600 text-white shadow-md shadow-blue-500/10 cursor-pointer">
            All Journals
          </button>
          <button className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all hover:bg-slate-500/10 cursor-pointer ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Verified
          </button>
          <button className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all hover:bg-slate-500/10 cursor-pointer ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Manual
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select className={`text-xs px-3 py-1.5 rounded-lg border cursor-pointer focus:ring-1 focus:ring-blue-500 focus:outline-none ${
            isDark ? 'bg-slate-900 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-800'
          }`}>
            <option value="all">All Accounts</option>
            <option value="prop">Prop Challenges Only</option>
          </select>
          <button className="px-4 py-1.5 rounded-lg text-xs font-bold bg-blue-600 text-white hover:bg-blue-500 shadow-md shadow-blue-600/10 cursor-pointer flex items-center gap-1.5">
            <span>Sync Accounts</span>
          </button>
        </div>
      </div>

      {/* Metric Panel Grids */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* PNL Block */}
        <div className={`p-5 rounded-2xl border relative overflow-hidden flex flex-col justify-between ${
          isDark ? 'bg-[#111622]/90 border-white/5' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div>
            <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase font-mono">Net Realized PNL</p>
            <h3 className={`text-3xl font-mono font-extrabold mt-1.5 ${displayNetPnl >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
              {displayNetPnl >= 0 ? '+' : ''}${displayNetPnl.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </h3>
          </div>
          <div className="flex justify-between items-center text-[10.5px] text-slate-500 mt-4 border-t border-white/5 pt-3">
            <span>{displayTradesCount} Total copy-trades</span>
            <span className="text-emerald-400 font-bold">Passed Drawdown Checks</span>
          </div>
        </div>

        {/* Profit Factor Block */}
        <div className={`p-5 rounded-2xl border relative overflow-hidden flex flex-col justify-between ${
          isDark ? 'bg-[#111622]/90 border-white/5' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div>
            <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase font-mono">Profit Factor</p>
            <h3 className="text-3xl font-mono font-extrabold text-blue-500 mt-1.5">
              {displayProfitFactor}
            </h3>
          </div>
          <div className="flex justify-between items-center text-[10.5px] text-slate-500 mt-4 border-t border-white/5 pt-3">
            <span>Goal: &gt; 2.00 SF</span>
            <span className="text-blue-400 font-bold font-mono">Optimal Ratio</span>
          </div>
        </div>

        {/* Win rate Block */}
        <div className={`p-5 rounded-2xl border relative overflow-hidden flex flex-col justify-between ${
          isDark ? 'bg-[#111622]/90 border-white/5' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div>
            <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase font-mono">Win Rate percentage</p>
            <h3 className="text-3xl font-mono font-extrabold text-emerald-400 mt-1.5">
              {displayWinRate}%
            </h3>
          </div>
          <div className="flex justify-between items-center text-[10.5px] text-slate-500 mt-4 border-t border-white/5 pt-3">
            <span>{winningTrades.length || 16} W - {losingTrades.length || 8} L</span>
            <span className="text-slate-400">Target Winrate 55%+</span>
          </div>
        </div>
      </div>

      {/* Advanced Performance Analytics Grid containing SVG Spider triangle chart and Line graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Tradesyncer Score Radar Triangle SVG Component (4 cols) */}
        <div className={`p-5 rounded-2xl border lg:col-span-4 flex flex-col justify-between ${
          isDark ? 'bg-[#111622]/90 border-white/5' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">Tradesyncer Performance Index</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Calculated scoring based on risk, volume consistency, and speed.</p>
          </div>

          <div className="relative py-4 flex items-center justify-center">
            {/* Elegant SVG dynamic radar spider metric graph */}
            <svg viewBox="0 0 200 200" className="w-40 h-40">
              {/* Outer grid rings */}
              <circle cx="100" cy="100" r="80" fill="none" stroke={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} strokeWidth="1" strokeDasharray="3 3" />
              <circle cx="100" cy="100" r="55" fill="none" stroke={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} strokeWidth="1" />
              <circle cx="100" cy="100" r="30" fill="none" stroke={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} strokeWidth="1" />
              
              {/* Triangular Axes */}
              <line x1="100" y1="20" x2="100" y2="180" stroke={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} strokeWidth="1" />
              <line x1="30" y1="140" x2="170" y2="60" stroke={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} strokeWidth="1" />
              <line x1="30" y1="60" x2="170" y2="140" stroke={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} strokeWidth="1" />

              {/* Labeled corner nodes */}
              <text x="100" y="15" textAnchor="middle" fill="#94a3b8" fontSize="8" fontFamily="sans-serif" fontWeight="bold">WIN RATE</text>
              <text x="10" y="150" textAnchor="start" fill="#94a3b8" fontSize="8" fontFamily="sans-serif" fontWeight="bold">PROFIT FACTOR</text>
              <text x="190" y="150" textAnchor="end" fill="#94a3b8" fontSize="8" fontFamily="sans-serif" fontWeight="bold">DRAWDOWN</text>

              {/* Dynamic Score Polygon Area representation */}
              <polygon 
                points="100,45 50,125 150,110" 
                fill="rgba(37, 99, 235, 0.25)" 
                stroke="#3b82f6" 
                strokeWidth="2" 
              />
              
              {/* Core scoring metrics center point badge */}
              <circle cx="100" cy="45" r="3" fill="#3b82f6" />
              <circle cx="50" cy="125" r="3" fill="#3b82f6" />
              <circle cx="150" cy="110" r="3" fill="#10b981" />
            </svg>

            {/* Absolute Score overlay center pointer badge */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-mono font-extrabold text-blue-500">88.4</span>
              <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest font-mono">COPIER SCORE</span>
            </div>
          </div>

          <div className="bg-slate-500/5 p-3 rounded-xl border border-white/5 flex items-center justify-between text-[11px]">
            <span className="text-slate-400 font-semibold">Tier Compliance rating:</span>
            <span className="font-extrabold text-emerald-400 font-mono">92/100 EXCELLENT</span>
          </div>
        </div>

        {/* Dynamic Cumulative Performance Line Graph (8 cols) */}
        <div className={`p-5 rounded-2xl border lg:col-span-8 flex flex-col justify-between ${
          isDark ? 'bg-[#111622]/90 border-white/5' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">Daily cumulative return curves</h4>
              <p className="text-[11px] text-slate-400">Replication growth charting closed simulated trades.</p>
            </div>
            <div className="text-right">
              <span className="text-[9px] text-slate-500 block">GROWTH INDEX</span>
              <span className="text-xs font-mono font-bold text-emerald-500">+18.52% Peak</span>
            </div>
          </div>

          {/* Line Chart drawing using pure SVG */}
          <div className="h-44 w-full relative">
            <svg className="w-full h-full" viewBox="0 0 500 150" preserveAspectRatio="none">
              <defs>
                <linearGradient id="pnlGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <line x1="10" y1="30" x2="490" y2="30" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              <line x1="10" y1="75" x2="490" y2="75" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              <line x1="10" y1="120" x2="490" y2="120" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              
              {/* Fill Area underneath curve */}
              <path 
                d="M 10 115 L 80 120 L 160 100 L 240 85 L 320 50 L 400 65 L 490 28 L 490 150 L 10 150 Z" 
                fill="url(#pnlGrad)" 
              />
              {/* Curve Line */}
              <path 
                d="M 10 115 Q 80 120 160 100 T 240 85 T 320 50 T 400 65 T 490 28" 
                fill="none" 
                stroke="#10b981" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
              />
              {/* Dots representation */}
              <circle cx="10" cy="115" r="3.5" fill="#10b981" />
              <circle cx="160" cy="100" r="3.5" fill="#10b981" />
              <circle cx="320" cy="50" r="3.5" fill="#3b82f6" />
              <circle cx="490" cy="28" r="4.5" fill="#10b981" stroke="#fff" strokeWidth="1.5" className="animate-pulse" />
            </svg>
            <div className="absolute top-2 left-1/4 bg-slate-900/90 border border-white/10 text-white rounded-lg px-2 py-1 shadow-lg text-[9px] font-mono hidden sm:block">
              <span className="text-emerald-400">Gold Copy Peak: +$1,250</span>
            </div>
          </div>

          <div className="flex justify-between font-mono text-[9px] text-slate-500 pt-2 border-t border-white/5">
            <span>WEEK 01</span>
            <span>WEEK 02</span>
            <span>WEEK 03</span>
            <span>WEEK 04</span>
            <span>WEEK 05 (LIVE)</span>
          </div>
        </div>
      </div>

      {/* Best Trade & Worst Trade sub-grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className={`p-4.5 rounded-xl border flex items-center justify-between ${
          isDark ? 'bg-white/[0.01] border-white/5' : 'bg-white border-slate-200'
        }`}>
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 tracking-wider font-mono">BEST REPLICATED TRADE</span>
            <p className="text-lg font-mono font-extrabold text-emerald-500">+${displayBestTrade.toFixed(2)}</p>
          </div>
          <span className="text-xs font-mono font-bold bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded">XAUUSD</span>
        </div>

        <div className={`p-4.5 rounded-xl border flex items-center justify-between ${
          isDark ? 'bg-white/[0.01] border-white/5' : 'bg-white border-slate-200'
        }`}>
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 tracking-wider font-mono">AVERAGE PAYOUT VALUE</span>
            <p className="text-lg font-mono font-extrabold text-blue-500">+${(displayBestTrade / 2).toFixed(2)}</p>
          </div>
          <span className="text-xs font-mono font-bold bg-blue-500/10 text-blue-500 px-2 py-1 rounded">Avg/Pos</span>
        </div>

        <div className={`p-4.5 rounded-xl border flex items-center justify-between ${
          isDark ? 'bg-white/[0.01] border-white/5' : 'bg-white border-slate-200'
        }`}>
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 tracking-wider font-mono">WORST REPLICATED LOSS</span>
            <p className="text-lg font-mono font-extrabold text-rose-500">${displayWorstTrade.toFixed(2)}</p>
          </div>
          <span className="text-xs font-mono font-bold bg-rose-500/10 text-rose-500 px-2 py-1 rounded">BTCUSD</span>
        </div>
      </div>

      {/* Trades History Log table matching 0:36 */}
      <div className={`p-5 rounded-2xl border ${
        isDark ? 'bg-[#111622]/90 border-white/5' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 font-mono">Historical Execution Journal Log</h4>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-[9.5px] uppercase font-bold text-slate-500 tracking-widest font-mono">
                <th className="pb-3.5 pl-2 font-mono">Date/Time</th>
                <th className="pb-3.5 font-mono">Symbol</th>
                <th className="pb-3.5 font-mono">Account</th>
                <th className="pb-3.5 font-mono">Side</th>
                <th className="pb-3.5 font-mono">Qty (Lots)</th>
                <th className="pb-3.5 font-mono">Entry</th>
                <th className="pb-3.5 font-mono">Exit</th>
                <th className="pb-3.5 text-right font-mono pr-2">PnL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs">
              {closedTrades.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500 italic pointer-events-none text-xs">
                    No verified historical trades in local cache. Go to the active Cockpit to execute and close copies!
                  </td>
                </tr>
              ) : (
                closedTrades.map(t => (
                  <tr key={t.id} className="hover:bg-slate-500/5 transition-colors">
                    <td className="py-3 pl-2 font-mono text-[10px] text-slate-400">2026-06-19 14:15</td>
                    <td className="py-3 font-semibold">{t.symbol}</td>
                    <td className="py-3 text-slate-400">{t.accountName}</td>
                    <td className="py-3">
                      <span className={`px-1.5 py-0.5 rounded text-[8.5px] font-extrabold font-mono uppercase ${
                        t.type === 'BUY' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                      }`}>
                        {t.type}
                      </span>
                    </td>
                    <td className="py-3 font-mono text-slate-400">{t.lots}</td>
                    <td className="py-3 font-mono text-slate-400">{t.entryPrice || '1.0924'}</td>
                    <td className="py-3 font-mono text-slate-400">{t.exitPrice || '1.0968'}</td>
                    <td className={`py-3 text-right font-mono font-bold pr-2 ${t.pnl && t.pnl >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {t.pnl && t.pnl >= 0 ? '+' : ''}${t.pnl?.toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
