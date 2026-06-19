import React from 'react';

interface JournalingWeeklyProps {
  isDark: boolean;
}

export default function JournalingWeekly({ isDark }: JournalingWeeklyProps) {
  const weeksData = [
    { week: 'Week 22', date: 'May 25 - May 31', pnl: 2840.00, trades: 18, winRate: 72, volume: '22.0' },
    { week: 'Week 23', date: 'Jun 01 - Jun 07', pnl: 4120.00, trades: 24, winRate: 79, volume: '28.5' },
    { week: 'Week 24', date: 'Jun 08 - Jun 14', pnl: -640.00, trades: 15, winRate: 46, volume: '18.0' },
    { week: 'Week 25', date: 'Jun 15 - Jun 21', pnl: 4250.50, trades: 24, winRate: 68, volume: '30.0' },
  ];

  return (
    <div className="space-y-6 animate-fade-in text-left">
      <div className={`p-6 rounded-2xl border ${isDark ? 'bg-[#111622]/90 border-white/5' : 'bg-white border-slate-200'}`}>
        <h3 className="text-sm font-bold tracking-tight mb-1">Week-over-Week Performance Ledger</h3>
        <p className="text-xs text-slate-400 mb-6">Aggregated metrics detailing copier consistency across preceding active weeks.</p>

        <div className="space-y-4">
          {weeksData.map((w, index) => {
            const isProfitable = w.pnl >= 0;
            return (
              <div 
                key={index} 
                className={`p-4 rounded-xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all ${
                  isProfitable 
                    ? 'border-emerald-500/10 bg-emerald-500/[0.01]' 
                    : 'border-rose-500/10 bg-rose-500/[0.01]'
                }`}
              >
                <div>
                  <h4 className="font-bold text-sm tracking-tight">{w.week}</h4>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">{w.date}</p>
                </div>

                <div className="flex gap-8 items-center flex-wrap font-mono text-xs">
                  <div>
                    <span className="text-[9px] text-slate-500 block uppercase">Trades Count</span>
                    <span className="font-bold font-mono text-slate-300">{w.trades} taken</span>
                  </div>

                  <div>
                    <span className="text-[9px] text-slate-500 block uppercase">Win Rate</span>
                    <span className="font-bold font-mono text-slate-300">{w.winRate}%</span>
                  </div>

                  <div>
                    <span className="text-[9px] text-slate-500 block uppercase">Volume Traded</span>
                    <span className="font-bold font-mono text-slate-300">{w.volume} Lots</span>
                  </div>

                  <div className="text-right min-w-28">
                    <span className="text-[9px] text-slate-500 block uppercase">Weekly Returns</span>
                    <span className={`font-mono font-extrabold text-sm ${isProfitable ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {isProfitable ? '+' : ''}${w.pnl.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
