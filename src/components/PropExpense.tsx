import React, { useState, useEffect } from 'react';
import { Plus, Trash2, DollarSign, Award, Sliders, CheckCircle2 } from 'lucide-react';

interface Expense {
  id: string;
  firm: string;
  challengeType: string;
  cost: number;
  status: 'active' | 'passed' | 'failed' | 'refunded';
  date: string;
}

interface PropExpenseProps {
  isDark: boolean;
}

export default function PropExpense({ isDark }: PropExpenseProps) {
  // Local persistent state ledger
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem('tradesyncer_expenses');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'exp-1', firm: 'Tradeify', challengeType: '$100K Evaluation', cost: 147.00, status: 'active', date: '2026-06-10' },
      { id: 'exp-2', firm: 'FTMO', challengeType: '$100K Verified challenge', cost: 540.00, status: 'passed', date: '2026-05-18' },
      { id: 'exp-3', firm: 'FundedNext', challengeType: '$50K Evaluation Challenge', cost: 210.00, status: 'failed', date: '2026-04-12' },
      { id: 'exp-4', firm: 'Tradesyncer Subscription', challengeType: 'Elite Copier Pro Plan', cost: 49.00, status: 'active', date: '2026-06-01' }
    ];
  });

  const [firmName, setFirmName] = useState('');
  const [challengeType, setChallengeType] = useState('$100K Challenge');
  const [costValue, setCostValue] = useState('');
  const [statusName, setStatusName] = useState<'active' | 'passed' | 'failed' | 'refunded'>('active');

  useEffect(() => {
    localStorage.setItem('tradesyncer_expenses', JSON.stringify(expenses));
  }, [expenses]);

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firmName.trim() || !costValue) return;

    const added: Expense = {
      id: `exp-${Date.now()}`,
      firm: firmName.trim(),
      challengeType: challengeType,
      cost: parseFloat(costValue) || 0,
      status: statusName,
      date: new Date().toISOString().split('T')[0]
    };

    setExpenses(prev => [added, ...prev]);
    setFirmName('');
    setCostValue('');
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  const totalSpent = expenses.reduce((sum, item) => sum + item.cost, 0);

  return (
    <div className="space-y-6 animate-fade-in text-left">
      {/* Overview Block */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className={`p-5 rounded-2xl border ${isDark ? 'bg-[#111622]/90 border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}>
          <p className="text-[10px] font-bold text-slate-400 font-mono tracking-wider uppercase">Aggregate Evaluation Fees</p>
          <h3 className="text-3xl font-mono font-extrabold text-blue-500 mt-1.5">${totalSpent.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h3>
          <div className="flex justify-between items-center text-[10.5px] text-slate-500 mt-3 border-t border-white/5 pt-3">
            <span>Capital invested</span>
            <span className="text-emerald-400 font-bold">1 Refundable check</span>
          </div>
        </div>

        <div className={`p-5 rounded-2xl border ${isDark ? 'bg-[#111622]/90 border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}>
          <p className="text-[10px] font-bold text-slate-400 font-mono tracking-wider uppercase">Active Accounts Challenges</p>
          <h3 className="text-3xl font-mono font-extrabold text-emerald-400 mt-1.5">{expenses.filter(e => e.status === 'active').length} Accounts</h3>
          <div className="flex justify-between items-center text-[10.5px] text-slate-500 mt-3 border-t border-white/5 pt-3">
            <span>Synchronized active sockets</span>
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
          </div>
        </div>

        <div className={`p-5 rounded-2xl border ${isDark ? 'bg-[#111622]/90 border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}>
          <p className="text-[10px] font-bold text-slate-400 font-mono tracking-wider uppercase">Challenge Pass rate</p>
          <h3 className="text-3xl font-mono font-extrabold text-indigo-400 mt-1.5">
            {expenses.filter(e => e.status === 'passed' || e.status === 'failed').length > 0 
              ? Math.round((expenses.filter(e => e.status === 'passed').length / expenses.filter(e => e.status === 'passed' || e.status === 'failed').length) * 100) 
              : 50}%
          </h3>
          <div className="flex justify-between items-center text-[10.5px] text-slate-500 mt-3 border-t border-white/5 pt-3">
            <span>{expenses.filter(e => e.status === 'passed').length} Passed • {expenses.filter(e => e.status === 'failed').length} Failed</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Registration Form Left */}
        <div className="lg:col-span-5 space-y-6">
          <div className={`p-6 rounded-2xl border ${isDark ? 'bg-[#111622]/90 border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}>
            <h4 className="text-sm font-bold tracking-tight mb-4 flex items-center gap-2">
              <Plus size={14} className="text-blue-500" />
              <span>Log Evaluation/Challenge Expense</span>
            </h4>

            <form onSubmit={handleAddExpense} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">PROP FIRM / COST SOURCE</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Tradeify Account"
                  value={firmName}
                  onChange={(e) => setFirmName(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none ${
                    isDark ? 'bg-slate-900 border-white/10 text-white' : 'bg-white border-slate-200'
                  }`}
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">CHALLENGE DETAILS / BILL TYPE</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. $100K challenge, VPS monthly fee"
                  value={challengeType}
                  onChange={(e) => setChallengeType(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none ${
                    isDark ? 'bg-slate-900 border-white/10 text-white' : 'bg-white border-slate-200'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">FEE REGISTRATION ($ USD)</label>
                  <input 
                    type="number" 
                    required
                    min="1"
                    placeholder="147.00"
                    value={costValue}
                    onChange={(e) => setCostValue(e.target.value)}
                    className={`w-full px-3 py-2 font-mono text-xs font-bold rounded-lg border focus:ring-1 focus:ring-blue-500 focus:outline-none ${
                      isDark ? 'bg-slate-900 border-white/10 text-white' : 'bg-white border-slate-200'
                    }`}
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">CHALLENGE STATUS</label>
                  <select 
                    value={statusName}
                    onChange={(e) => setStatusName(e.target.value as any)}
                    className={`w-full px-3 py-2 text-xs rounded-lg border cursor-pointer focus:ring-1 focus:ring-blue-500 focus:outline-none ${
                      isDark ? 'bg-slate-900 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-800'
                    }`}
                  >
                    <option value="active">Active</option>
                    <option value="passed">Passed</option>
                    <option value="failed">Failed</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white rounded-xl shadow-lg cursor-pointer transform active:scale-98 transition-all"
              >
                Log Cost Sheet
              </button>
            </form>
          </div>
        </div>

        {/* Expense List Tabular Spreadsheet Right */}
        <div className="lg:col-span-7 space-y-6">
          <div className={`p-5 rounded-2xl border ${isDark ? 'bg-[#111622]/90 border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 font-mono">Cost Ledger Ledger Sheets</h4>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 text-[9.5px] uppercase font-bold text-slate-500 tracking-widest font-mono">
                    <th className="pb-3 pl-2">Asset/Firm</th>
                    <th className="pb-3 text-center">Cost (USD)</th>
                    <th className="pb-3 text-center">Status</th>
                    <th className="pb-3 text-right pr-2">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-xs font-sans">
                  {expenses.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-slate-500 italic pointer-events-none text-xs">No registered entries. Add expense using logging console form.</td>
                    </tr>
                  ) : (
                    expenses.map(e => (
                      <tr key={e.id} className="hover:bg-slate-500/5 transition-colors">
                        <td className="py-3 pl-2">
                          <p className="font-bold">{e.firm}</p>
                          <span className="text-[10px] text-slate-500 font-mono">{e.challengeType} • {e.date}</span>
                        </td>
                        <td className="py-3 text-center font-mono font-bold">${e.cost.toFixed(2)}</td>
                        <td className="py-3 text-center">
                          <span className={`px-2 py-0.5 rounded text-[8.5px] font-extrabold font-mono uppercase ${
                            e.status === 'passed' ? 'bg-emerald-500/15 text-emerald-400' :
                            e.status === 'failed' ? 'bg-rose-500/15 text-rose-400' :
                            e.status === 'refunded' ? 'bg-amber-500/15 text-amber-500' :
                            'bg-blue-500/15 text-blue-400'
                          }`}>
                            {e.status}
                          </span>
                        </td>
                        <td className="py-3 text-right pr-2">
                          <button 
                            onClick={() => handleDeleteExpense(e.id)}
                            className="p-1 hover:bg-rose-500/10 text-slate-500 hover:text-rose-500 rounded transition-all cursor-pointer"
                            title="Delete record entry"
                          >
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
