import React from 'react';
import { DollarSign, TrendingUp, Layers, AlertOctagon, ArrowUpRight } from 'lucide-react';
import { useSpend } from '../../context/SpendContext';

export default function KpiCards() {
  const { metrics, formatCurrency, setActiveTab, setStatusFilter } = useSpend();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Total Monthly Spend */}
      <div className="bg-white border border-slate-200/80 rounded-[6px] p-4 shadow-2xs hover:border-slate-300 transition-colors">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider font-mono">
            Monthly Spend
          </span>
          <div className="p-1.5 rounded-[4px] bg-slate-50 border border-slate-100 text-slate-600">
            <DollarSign className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="text-2xl font-semibold font-mono text-slate-900 tabular-nums tracking-tight">
          {formatCurrency(metrics.totalMonthly)}
          <span className="text-xs font-normal text-slate-400 font-sans ml-1">/mo</span>
        </div>
        <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100 font-mono">
          <span className="text-slate-500">Across {metrics.totalSubs} subscriptions</span>
          <span className="text-emerald-700 font-medium flex items-center">
            +3.2% MoM
          </span>
        </div>
      </div>

      {/* 2. Annual Run Rate (ARR) */}
      <div className="bg-white border border-slate-200/80 rounded-[6px] p-4 shadow-2xs hover:border-slate-300 transition-colors">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider font-mono">
            Annual Run Rate
          </span>
          <div className="p-1.5 rounded-[4px] bg-slate-50 border border-slate-100 text-slate-600">
            <TrendingUp className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="text-2xl font-semibold font-mono text-slate-900 tabular-nums tracking-tight">
          {formatCurrency(metrics.annualRunRate)}
          <span className="text-xs font-normal text-slate-400 font-sans ml-1">/yr</span>
        </div>
        <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100 font-mono">
          <span>Contracted SaaS</span>
          <span className="text-slate-400">12-mo forward</span>
        </div>
      </div>

      {/* 3. Active Subscriptions */}
      <div className="bg-white border border-slate-200/80 rounded-[6px] p-4 shadow-2xs hover:border-slate-300 transition-colors">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider font-mono">
            Active Contracts
          </span>
          <div className="p-1.5 rounded-[4px] bg-slate-50 border border-slate-100 text-slate-600">
            <Layers className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="text-2xl font-semibold font-mono text-slate-900 tabular-nums tracking-tight">
          {metrics.activeSubs}
          <span className="text-xs font-normal text-slate-400 font-sans ml-1.5">
            / {metrics.totalSubs} total
          </span>
        </div>
        <div className="mt-2.5 flex items-center justify-between text-[11px] pt-2 border-t border-slate-100">
          <span className="text-amber-700 font-medium font-mono">
            {metrics.flaggedWasteSubs} flagged with waste
          </span>
          <button
            onClick={() => {
              setActiveTab('subscriptions');
              setStatusFilter('All');
            }}
            className="text-slate-600 hover:text-slate-950 font-medium text-[11px] flex items-center gap-0.5"
          >
            View all <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* 4. Estimated Monthly Waste (Red reserved for waste) */}
      <div className="bg-red-50/40 border border-red-200/90 rounded-[6px] p-4 shadow-2xs hover:border-red-300 transition-colors">
        <div className="flex items-center justify-between text-red-700 mb-2">
          <span className="text-xs font-bold uppercase tracking-wider font-mono flex items-center gap-1.5">
            <AlertOctagon className="w-3.5 h-3.5 text-red-600" />
            Estimated Waste
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-[3px] bg-red-100 text-red-800 font-semibold border border-red-200">
            {metrics.wastePercentage.toFixed(1)}% of spend
          </span>
        </div>
        <div className="text-2xl font-bold font-mono text-red-700 tabular-nums tracking-tight">
          {formatCurrency(metrics.totalWaste)}
          <span className="text-xs font-medium text-red-600/80 font-sans ml-1">/mo</span>
        </div>
        <div className="mt-2.5 flex items-center justify-between text-[11px] text-red-700/90 pt-2 border-t border-red-200/60 font-mono">
          <span>{formatCurrency(metrics.totalWaste * 12)}/yr drain</span>
          <button
            onClick={() => setActiveTab('waste')}
            className="text-red-700 hover:text-red-900 font-semibold underline underline-offset-2 flex items-center gap-0.5"
          >
            Audit details →
          </button>
        </div>
      </div>
    </div>
  );
}
