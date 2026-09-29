import React from 'react';
import { PieChart, ArrowUpRight } from 'lucide-react';
import { useSpend } from '../../context/SpendContext';

export default function CategorySpendChart() {
  const { metrics, formatCurrency, setActiveTab, setCategoryFilter } = useSpend();

  const handleCategoryClick = (catName) => {
    setCategoryFilter(catName);
    setActiveTab('subscriptions');
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-[6px] shadow-2xs overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-[3px] bg-slate-100 text-slate-700">
            <PieChart className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-900 tracking-tight">
              Spend by Category
            </h2>
            <p className="text-[11px] text-slate-500 font-mono">
              Distribution across 8 operational departments.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setCategoryFilter('All');
            setActiveTab('subscriptions');
          }}
          className="text-xs text-slate-600 hover:text-slate-950 font-medium flex items-center gap-1"
        >
          View Table <ArrowUpRight className="w-3 h-3" />
        </button>
      </div>

      {/* Category List with dense progress bars */}
      <div className="p-4 space-y-3">
        {metrics.categoryBreakdown.map((cat) => {
          return (
            <div
              key={cat.name}
              onClick={() => handleCategoryClick(cat.name)}
              className="group cursor-pointer p-1.5 -mx-1.5 rounded-[4px] hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-slate-800 group-hover:text-slate-950">
                    {cat.name}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    ({cat.count} {cat.count === 1 ? 'tool' : 'tools'})
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-slate-900 font-semibold tabular-nums text-xs">
                    {formatCurrency(cat.spend)}/mo
                  </span>
                  <span className="font-mono text-slate-400 text-[11px] w-10 text-right tabular-nums">
                    {cat.percentage.toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-slate-800 group-hover:bg-slate-950 transition-all rounded-full"
                  style={{ width: `${Math.max(cat.percentage, 3)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
