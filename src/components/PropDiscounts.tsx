import React, { useState } from 'react';
import { Check, Clipboard, ExternalLink, Award, Shield, Sparkles } from 'lucide-react';

interface PropDiscountsProps {
  isDark: boolean;
}

export default function PropDiscounts({ isDark }: PropDiscountsProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const programs = [
    {
      name: 'Tradeify',
      logo: '🟢',
      subtitle: 'Most Recommended for copier setups',
      maxFunding: '$300,000',
      drawdownLimit: '5% Daily, 10% Trailing',
      profitTarget: '6% Phase 1, 6% Phase 2',
      discount: '35% OFF (Exclusive Partners)',
      couponCode: 'SYNC35',
      reviewScore: '4.9/5',
      website: 'https://propfirmsyncer.com',
    },
    {
      name: 'Lucid Trading',
      logo: '✨',
      subtitle: 'Excellent drawdown policies',
      maxFunding: '$500,000',
      drawdownLimit: '4% Daily, 8% Static max loss',
      profitTarget: '8% Single phase challenge',
      discount: '10% OFF on checks',
      couponCode: 'LUCID10',
      reviewScore: '4.7/5',
      website: 'https://propfirmsyncer.com',
    },
    {
      name: 'FTMO',
      logo: '🛡️',
      subtitle: 'Industry gold standard platform',
      maxFunding: '$200,000',
      drawdownLimit: '5% Daily, 10% Absolute max loss',
      profitTarget: '10% Phase 1, 5% Phase 2',
      discount: 'No constraints direct pass',
      couponCode: 'FTMO10',
      reviewScore: '4.9/5',
      website: 'https://ftmo.com',
    },
    {
      name: 'FundedNext',
      logo: '💎',
      subtitle: 'Balance based drawdown',
      maxFunding: '$200,000',
      drawdownLimit: '5% Daily, 10% Max Drawdown',
      profitTarget: '8% Phase 1, 5% Phase 2',
      discount: '15% voucher registration',
      couponCode: 'NEXT15',
      reviewScore: '4.5/5',
      website: 'https://fundednext.com',
    }
  ];

  const handleCopyCode = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => {
      setCopiedIndex(null);
    }, 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in text-left">
      <div className={`p-6 rounded-2xl border ${isDark ? 'bg-[#111622]/90 border-white/5' : 'bg-white border-slate-200'}`}>
        <div className="flex justify-between items-start flex-wrap gap-4 mb-6">
          <div>
            <h3 className="text-base font-bold flex items-center gap-2">
              <Award className="text-blue-500" size={18} />
              <span>Prop Firm Vouchers & Performance Rankings</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">Verified partner discounts compiled for instant active subscription savings.</p>
          </div>
          <button 
            onClick={() => window.open('https://propfirmsyncer.com', '_blank')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 font-bold text-xs text-white rounded-xl shadow-md shadow-blue-600/20 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <span>Prop Firm Syncer Platform</span>
            <ExternalLink size={12} />
          </button>
        </div>

        {/* Directory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {programs.map((p, index) => (
            <div 
              key={index}
              className={`p-5 rounded-2xl border transition-all ${
                index === 0
                  ? 'border-blue-500/30 bg-blue-500/[0.01] hover:bg-blue-500/[0.02]'
                  : 'border-white/5 bg-white/[0.01]'
              }`}
            >
              <div className="flex justify-between items-start border-b border-white/5 pb-3 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-600/10 flex items-center justify-center text-lg">{p.logo}</div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                      <span>{p.name}</span>
                      {index === 0 && <span className="text-[8px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded font-extrabold uppercase font-mono tracking-wider">Top match</span>}
                    </h4>
                    <p className="text-[11px] text-slate-500 font-sans mt-0.5">{p.subtitle}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[9px] text-slate-500 block uppercase font-mono">Rating</span>
                  <span className="text-xs font-bold text-amber-500 font-mono">★ {p.reviewScore}</span>
                </div>
              </div>

              {/* Specifications block */}
              <div className="space-y-1.5 pb-2.5 mb-4 text-[10.5px] border-b border-white/5 font-sans">
                <div className="flex justify-between">
                  <span className="text-slate-400">Maximum Funding limit:</span>
                  <span className="font-bold font-mono text-slate-300">{p.maxFunding}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Drawdown parameters:</span>
                  <span className="font-bold font-mono text-slate-300">{p.drawdownLimit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Challenge target margins:</span>
                  <span className="font-bold font-mono text-slate-300">{p.profitTarget}</span>
                </div>
              </div>

              {/* Deal parameters Copy and Redirect buttons */}
              <div className="flex gap-2 items-center justify-between">
                <div className="bg-slate-500/5 px-2.5 py-1.5 rounded-lg border border-dashed border-white/10 flex items-center justify-between gap-3 text-xs w-2/3">
                  <span className="text-slate-400 font-mono font-bold text-[10px]">{p.couponCode}</span>
                  <button 
                    onClick={() => handleCopyCode(p.couponCode, index)}
                    className="p-1 hover:bg-slate-500/10 text-slate-400 hover:text-white rounded transition-colors cursor-pointer"
                    title="Copy coupon code"
                  >
                    {copiedIndex === index ? <Check size={12} className="text-emerald-500" /> : <Clipboard size={12} />}
                  </button>
                </div>

                <button
                  onClick={() => window.open(p.website, '_blank')}
                  className="px-3.5 py-2 font-bold text-[11px] bg-slate-500/10 border border-white/10 text-slate-300 hover:bg-slate-500/20 hover:text-white rounded-lg flex items-center gap-1 flex-1 transiton-all cursor-pointer text-center justify-center"
                >
                  <span>Apply Deal</span>
                  <ExternalLink size={10} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
