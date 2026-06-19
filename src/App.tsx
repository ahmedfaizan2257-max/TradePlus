/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import MainLanding from './components/MainLanding';
import DashboardDemo from './components/DashboardDemo';
import ThemeToggle from './components/ThemeToggle';

type AppView = 'landing' | 'dashboard';

export default function App() {
  // Theme state: defaults to dark mode (standard TradePlus look)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('tradeplus_theme');
    return (saved === 'dark' || saved === 'light') ? saved : 'dark';
  });

  // Navigation view: landing or copier-dashboard
  const [currentView, setCurrentView] = useState<AppView>('landing');

  // Selected plan context from landing page to show on the dashboard
  const [selectedPlanDetails, setSelectedPlanDetails] = useState<{
    name: string;
    isAnnual: boolean;
  } | null>(null);

  // Sync theme with document class list for Tailwind v4 compatibility
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('tradeplus_theme', theme);
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleLaunchDashboard = () => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setCurrentView('dashboard');
  };

  const handleBackToLanding = () => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setCurrentView('landing');
  };

  const handleSelectPlan = (planName: string, isAnnual: boolean) => {
    setSelectedPlanDetails({ name: planName, isAnnual });
    window.scrollTo({ top: 0, behavior: 'instant' });
    setCurrentView('dashboard');
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' ? 'bg-[#0A0A0B] text-slate-100' : 'bg-[#FAFAFB] text-slate-800'
    }`}>
      
      {/* GLOBAL FIXED NAVIGATION FOR LANDING VIEW */}
      {currentView === 'landing' && (
        <header className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b transition-all duration-300 ${
          theme === 'dark'
            ? 'bg-[#0A0A0B]/80 border-white/5 text-white'
            : 'bg-white/80 border-slate-200/80 text-slate-800'
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            
            {/* Logo from Sleek Interface Theme */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={handleBackToLanding}>
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-600/20">
                <div className="w-3.5 h-3.5 border-2 border-white rotate-45 border-t-0 border-l-0"></div>
              </div>
              <span className="font-display font-bold text-lg tracking-tight">
                Tradesyncer
              </span>
            </div>

            {/* Nav links Desktop */}
            <nav className="hidden md:flex items-center gap-6 text-xs font-semibold tracking-wide uppercase">
              <a href="#features-section" className="hover:text-blue-500 transition-colors">Features</a>
              <a href="#platforms-section" className="hover:text-blue-500 transition-colors">Platforms</a>
              <a href="#specs-section" className="hover:text-blue-500 transition-colors">Speed specs</a>
              <a href="#pricing-section" className="hover:text-blue-500 transition-colors">Pricing</a>
            </nav>

            {/* CTAs */}
            <div className="flex items-center gap-3">
              {/* Theme mode controller */}
              <ThemeToggle theme={theme} onToggle={handleToggleTheme} />

              <button
                id="header-launch-console-btn"
                onClick={handleLaunchDashboard}
                className="px-4 py-2.5 rounded-xl font-semibold text-xs bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20 transition-all cursor-pointer active:scale-95"
              >
                Start Free Trial
              </button>
            </div>

          </div>
        </header>
      )}

      {/* COMPONENT ROUTER VIEWPORTS */}
      {currentView === 'landing' ? (
        <MainLanding
          theme={theme}
          onLaunchDashboard={handleLaunchDashboard}
          onSelectPlan={handleSelectPlan}
        />
      ) : (
        <DashboardDemo
          theme={theme}
          onBackToLanding={handleBackToLanding}
          preferredPlanName={selectedPlanDetails ? `${selectedPlanDetails.name} (${selectedPlanDetails.isAnnual ? 'Annually' : 'Monthly'})` : undefined}
        />
      )}

    </div>
  );
}
