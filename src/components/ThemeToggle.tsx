/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  theme: 'light' | 'dark';
  onToggle: () => void;
}

export default function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  const isDark = theme === 'dark';

  return (
    <button
      id="theme-toggle-btn"
      onClick={onToggle}
      className={`relative p-2.5 rounded-xl border flex items-center justify-center transition-all duration-300 transform active:scale-95 ${
        isDark
          ? 'bg-slate-900 border-slate-700 text-amber-400 hover:bg-slate-800'
          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
      } shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
      aria-label="Toggle Dark/Light Mode"
    >
      <div className="relative w-5 h-5 flex items-center justify-center overflow-hidden">
        {/* Sun Icon */}
        <div
          className={`absolute transition-all duration-500 transform ${
            isDark ? 'translate-y-10 rotate-90 opacity-0' : 'translate-y-0 rotate-0 opacity-100'
          }`}
        >
          <Sun size={20} className="stroke-[2]" />
        </div>

        {/* Moon Icon */}
        <div
          className={`absolute transition-all duration-500 transform ${
            isDark ? 'translate-y-0 rotate-0 opacity-100' : '-translate-y-10 -rotate-90 opacity-0'
          }`}
        >
          <Moon size={20} className="stroke-[2]" />
        </div>
      </div>
      <span className="sr-only">Toggle Theme</span>
    </button>
  );
}
