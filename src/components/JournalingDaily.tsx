import React from 'react';

interface JournalingDailyProps {
  isDark: boolean;
}

export default function JournalingDaily({ isDark }: JournalingDailyProps) {
  // Mock calendar statistics
  const weekdaysGroup = [
    { day: 'Monday', date: 'June 15', pnl: 1250.00, trades: 4, winRate: 100, status: 'profitable' },
    { day: 'Tuesday', date: 'June 16', pnl: 1450.50, trades: 6, winRate: 83, status: 'profitable' },
    { day: 'Wednesday', date: 'June 17', pnl: -180.20, trades: 3, winRate: 33, status: 'drawdown' },
    { day: 'Thursday', date: 'June 18', pnl: 940.00, trades: 5, winRate: 80, status: 'profitable' },
    { day: 'Friday', date: 'June 19', pnl: 790.20, trades: 6, winRate: 100, status: 'profitable' },
  ];

  const totalDailypnl = weekdaysGroup.reduce((acc, curr) => acc + curr.pnl, 0);

  return (
    <div className="space-y-6 animate-fade-in text-left">
      <div className={`p-6 rounded-2xl border ${isDark ? 'bg-[#111622]/90 border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-sm font-bold tracking-tight">Daily Performance Calendar</h3>
            <p className="text-xs text-slate-400">Trading profits grouped by calendar days which tracks copy statistics.</p>
          </div>
          <div className="text-right">
            <span className="text-[9px] text-slate-500 font-mono block uppercase">ACCUMULATED NET WEEKLY</span>
            <span className="text-base font-mono font-extrabold text-emerald-400">+${totalDailypnl.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </div>
        </div>

        {/* Daily Horizontal List Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {weekdaysGroup.map((w, index) => {
            const isProfitable = w.pnl >= 0;
            return (
              <div 
                key={index} 
                className={`p-4.5 rounded-xl border flex flex-col justify-between h-40 transition-all ${
                  isProfitable 
                    ? 'border-emerald-500/20 bg-emerald-500/[0.02] hover:bg-emerald-500/[0.04]' 
                    : 'border-rose-500/20 bg-rose-500/[0.02] hover:bg-rose-500/[0.04]'
                }`}
              >
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase font-mono block">{w.day}</span>
                  <span className="text-[9.5px] text-slate-500 font-mono">{w.date}, 2026</span>
                </div>

                <div>
                  <span className="text-[9px] text-slate-500 uppercase block font-mono">Realized Profit</span>
                  <p className={`text-lg font-mono font-extrabold ${isProfitable ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {isProfitable ? '+' : ''}${w.pnl.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </p>
                </div>

                <div className="flex justify-between items-center text-[10px] text-slate-400 pt-2 border-t border-dashed border-white/5 font-mono">
                  <span>{w.trades} copied</span>
                  <span className={isProfitable ? 'text-emerald-400' : 'text-rose-400'}>{w.winRate}% wr</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
