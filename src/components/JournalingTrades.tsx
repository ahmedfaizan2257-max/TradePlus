import React from 'react';
import { TradeOrder } from '../types';

interface JournalingTradesProps {
  isDark: boolean;
  trades: TradeOrder[];
}

export default function JournalingTrades({ isDark, trades }: JournalingTradesProps) {
  const closedTrades = trades.filter(t => t.status === 'CLOSED');
  
  // Dynamic stats
  const totalTrades = closedTrades.length;
  const winningTrades = closedTrades.filter(t => (t.pnl || 0) > 0);
  const losingTrades = closedTrades.filter(t => (t.pnl || 0) < 0);
  const totalProfit = winningTrades.reduce((sum, t) => sum + (t.pnl || 0), 0);
  const totalLoss = Math.abs(losingTrades.reduce((sum, t) => sum + (t.pnl || 0), 0));
  
  const profitFactor = totalLoss > 0 ? (totalProfit / totalLoss).toFixed(2) : totalProfit > 0 ? 'Max' : '0.00';
  const winRate = totalTrades > 0 ? Math.round((winningTrades.length / totalTrades) * 100) : 0;
  
  const bestTrade = closedTrades.reduce((max, t) => Math.max(max, t.pnl || 0), 0);
  const worstTrade = closedTrades.reduce((min, t) => Math.min(min, t.pnl || 0), 0);
  const avgWinLoss = totalTrades > 0 ? closedTrades.reduce((sum, t) => sum + (t.pnl || 0), 0) / totalTrades : 0;

  return (
    <div className="space-y-6 animate-fade-in text-left">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-500/5 p-4 rounded-2xl border border-white/5">
        <div className="flex gap-2">
          <button className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-blue-600 text-white shadow-md shadow-blue-500/10 cursor-pointer">All Journals</button>
          <button className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all hover:bg-slate-500/10 cursor-pointer ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Verified</button>
          <button className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all hover:bg-slate-500/10 cursor-pointer ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Manual</button>
        </div>

        <select className={`text-xs px-3 py-1.5 rounded-lg border cursor-pointer focus:ring-1 focus:ring-blue-500 focus:outline-none ${
          isDark ? 'bg-slate-900 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-800'
        }`}>
          <option value="all">All Accounts</option>
          <option value="real">Real Accounts</option>
        </select>
      </div>

      {/* Metric Blocks matching 0:38 in video */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {/* Total Trades */}
        <div className={`p-4 rounded-xl border text-center ${isDark ? 'bg-white/[0.01] border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}>
          <span className="text-[9.5px] font-bold text-slate-400 font-mono block uppercase">Total Trades</span>
          <p className="text-xl font-mono font-extrabold text-blue-500 mt-1">{totalTrades > 0 ? totalTrades : 24}</p>
          <span className="text-[8px] text-slate-500 font-mono">trades taken</span>
        </div>

        {/* Win Rate */}
        <div className={`p-4 rounded-xl border text-center ${isDark ? 'bg-white/[0.01] border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}>
          <span className="text-[9.5px] font-bold text-slate-400 font-mono block uppercase">Win Rate</span>
          <p className="text-xl font-mono font-extrabold text-emerald-500 mt-1">{totalTrades > 0 ? winRate : 68}%</p>
          <span className="text-[8px] text-slate-500 font-mono">{totalTrades > 0 ? winningTrades.length : 16}W - {totalTrades > 0 ? losingTrades.length : 8}L</span>
        </div>

        {/* Profit Factor */}
        <div className={`p-4 rounded-xl border text-center ${isDark ? 'bg-white/[0.01] border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}>
          <span className="text-[9.5px] font-bold text-slate-400 font-mono block uppercase">Profit Factor</span>
          <p className="text-xl font-mono font-extrabold text-amber-500 mt-1">{totalTrades > 0 ? profitFactor : '2.14'}</p>
          <span className="text-[8px] text-slate-500 font-mono">pf factor index</span>
        </div>

        {/* Best Trade */}
        <div className={`p-4 rounded-xl border text-center ${isDark ? 'bg-white/[0.01] border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}>
          <span className="text-[9.5px] font-bold text-slate-400 font-mono block uppercase">Best Trade</span>
          <p className="text-xl font-mono font-extrabold text-emerald-400 mt-1">+${totalTrades > 0 ? bestTrade.toFixed(0) : '840'}</p>
          <span className="text-[8px] text-slate-500 font-mono">peak gains ticket</span>
        </div>

        {/* Avg Win/Loss */}
        <div className={`p-4 rounded-xl border text-center ${isDark ? 'bg-white/[0.01] border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}>
          <span className="text-[9.5px] font-bold text-slate-400 font-mono block uppercase">Avg Win/Loss</span>
          <p className={`text-xl font-mono font-extrabold mt-1 ${avgWinLoss >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
            {avgWinLoss >= 0 ? '+' : ''}${totalTrades > 0 ? avgWinLoss.toFixed(1) : '177.1'}
          </p>
          <span className="text-[8px] text-slate-500 font-mono">pnl per trade average</span>
        </div>

        {/* Worst Trade */}
        <div className={`p-4 rounded-xl border text-center ${isDark ? 'bg-white/[0.01] border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}>
          <span className="text-[9.5px] font-bold text-slate-400 font-mono block uppercase">Worst Trade</span>
          <p className="text-xl font-mono font-extrabold text-rose-500 mt-1">${totalTrades > 0 ? worstTrade.toFixed(0) : '-310'}</p>
          <span className="text-[8px] text-slate-500 font-mono">peak loss draw</span>
        </div>

        {/* Day Win % */}
        <div className={`p-4 rounded-xl border text-center ${isDark ? 'bg-white/[0.01] border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}>
          <span className="text-[9.5px] font-bold text-slate-400 font-mono block uppercase">Day Win %</span>
          <p className="text-xl font-mono font-extrabold text-indigo-400 mt-1">100%</p>
          <span className="text-[8px] text-slate-500 font-mono">100% profitable days</span>
        </div>
      </div>

      {/* Trades Table List */}
      <div className={`p-5 rounded-2xl border ${isDark ? 'bg-[#111622]/90 border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}>
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 font-mono">Trades Audit Ledger</h4>
        
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
            <tbody className="divide-y divide-white/5 text-xs font-sans">
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
                      <span className={`px-2 py-0.5 rounded text-[8.5px] font-extrabold font-mono uppercase ${
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
