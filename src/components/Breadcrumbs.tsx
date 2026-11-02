import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { CurrentAppType } from './AppSwitcherModal';

export interface BreadcrumbItem {
  label: string;
  appTarget?: CurrentAppType;
  hashTarget?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  onNavigate: (app: CurrentAppType) => void;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, onNavigate }) => {
  return (
    <nav className="flex items-center gap-1.5 text-xs text-slate-400 py-2 px-3 sm:px-4 mb-3 rounded-xl bg-slate-900/60 border border-white/5 backdrop-blur-md overflow-x-auto no-scrollbar">
      <button
        onClick={() => onNavigate('bca')}
        className="flex items-center gap-1.5 text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"
        title="Return to Home OS Hub"
      >
        <Home className="w-3.5 h-3.5 text-cyan-400" />
        <span className="font-semibold text-[11px] sm:text-xs">OS Hub</span>
      </button>

      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;

        return (
          <React.Fragment key={idx}>
            <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />
            {isLast || !item.appTarget ? (
              <span className="font-bold text-white text-[11px] sm:text-xs truncate max-w-[180px]">
                {item.label}
              </span>
            ) : (
              <button
                onClick={() => item.appTarget && onNavigate(item.appTarget)}
                className="text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer truncate max-w-[140px] text-[11px] sm:text-xs"
              >
                {item.label}
              </button>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
