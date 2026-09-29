import React, { useState } from 'react';
import { AlertTriangle, Users, Copy, XCircle, ArrowRight, Check } from 'lucide-react';
import { useSpend } from '../../context/SpendContext';

export default function WasteBreakdownPanel() {
  const { metrics, formatCurrency, setSelectedSubscription, updateSubscriptionStatus, subscriptions } = useSpend();
  const [activeWasteTab, setActiveWasteTab] = useState('all'); // 'all' | 'unused' | 'duplicates' | 'underutilization'
  const [resolvedIds, setResolvedIds] = useState(new Set());

  const wasteItems = subscriptions
    .filter((s) => s.status !== 'active')
    .filter((s) => (activeWasteTab === 'all' ? true : s.status === activeWasteTab));

  const totalWaste = metrics.totalWaste;
  const unusedPct = totalWaste > 0 ? (metrics.wasteBreakdown.unused / totalWaste) * 100 : 0;
  const dupPct = totalWaste > 0 ? (metrics.wasteBreakdown.duplicates / totalWaste) * 100 : 0;
  const underPct = totalWaste > 0 ? (metrics.wasteBreakdown.underutilized / totalWaste) * 100 : 0;

  const handleResolveAction = (e, sub) => {
    e.stopPropagation();
    setResolvedIds((prev) => new Set([...prev, sub.id]));
    updateSubscriptionStatus(sub.id, 'active', 'Waste resolved by Finance Ops');
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-[6px] shadow-2xs overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-[3px] bg-red-50 text-red-700 border border-red-200">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-semibold text-slate-900 tracking-tight">
              Software Waste Breakdown
            </h2>
            <span className="text-xs font-mono font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded-[3px] border border-red-200">
              {formatCurrency(metrics.totalWaste)}/mo recoverable
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-mono mt-0.5">
            Breakdown across unused tools, duplicate software suites, and idle seat licenses.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-[4px] text-[11px] font-mono self-start sm:self-auto">
          <button
            onClick={() => setActiveWasteTab('all')}
            className={`px-2 py-0.5 rounded-[3px] transition-colors ${
              activeWasteTab === 'all'
                ? 'bg-white text-slate-900 font-medium shadow-2xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            All Waste ({metrics.flaggedWasteSubs})
          </button>
          <button
            onClick={() => setActiveWasteTab('unused')}
            className={`px-2 py-0.5 rounded-[3px] transition-colors ${
              activeWasteTab === 'unused'
                ? 'bg-white text-red-700 font-medium shadow-2xs'
                : 'text-slate-500 hover:text-red-700'
            }`}
          >
            Unused
          </button>
          <button
            onClick={() => setActiveWasteTab('duplicates')}
            className={`px-2 py-0.5 rounded-[3px] transition-colors ${
              activeWasteTab === 'duplicates'
                ? 'bg-white text-purple-700 font-medium shadow-2xs'
                : 'text-slate-500 hover:text-purple-700'
            }`}
          >
            Duplicates
          </button>
          <button
            onClick={() => setActiveWasteTab('underutilization')}
            className={`px-2 py-0.5 rounded-[3px] transition-colors ${
              activeWasteTab === 'underutilization'
                ? 'bg-white text-amber-700 font-medium shadow-2xs'
                : 'text-slate-500 hover:text-amber-700'
            }`}
          >
            Idle Seats
          </button>
        </div>
      </div>

      {/* Visual Chart: Segmented Progress Bar */}
      <div className="p-4 bg-slate-50/50 border-b border-slate-100">
        <div className="flex items-center justify-between text-xs font-mono text-slate-600 mb-2">
          <span>Waste Distribution by Category</span>
          <span className="font-semibold text-slate-900 tabular-nums">
            {formatCurrency(metrics.totalWaste * 12)} Annualized Leak
          </span>
        </div>

        {/* Stacked Bar Chart */}
        <div className="h-3 w-full bg-slate-200 rounded-[3px] overflow-hidden flex shadow-inner">
          <div
            style={{ width: `${unusedPct}%` }}
            title={`Unused Tools: ${formatCurrency(metrics.wasteBreakdown.unused)}/mo (${unusedPct.toFixed(1)}%)`}
            className="bg-red-500 hover:bg-red-600 transition-colors h-full"
          />
          <div
            style={{ width: `${dupPct}%` }}
            title={`Duplicate Tools: ${formatCurrency(metrics.wasteBreakdown.duplicates)}/mo (${dupPct.toFixed(1)}%)`}
            className="bg-purple-500 hover:bg-purple-600 transition-colors h-full"
          />
          <div
            style={{ width: `${underPct}%` }}
            title={`Underutilized Seats: ${formatCurrency(metrics.wasteBreakdown.underutilized)}/mo (${underPct.toFixed(1)}%)`}
            className="bg-amber-500 hover:bg-amber-600 transition-colors h-full"
          />
        </div>

        {/* Legend / Category Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3.5">
          {/* Unused */}
          <div
            onClick={() => setActiveWasteTab('unused')}
            className={`p-2.5 rounded-[4px] border cursor-pointer transition-all ${
              activeWasteTab === 'unused'
                ? 'border-red-300 bg-red-50/40 ring-1 ring-red-400'
                : 'border-slate-200/80 bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex items-center gap-1.5 text-xs text-red-700 font-semibold mb-1">
              <span className="w-2 h-2 rounded-[2px] bg-red-500" />
              <span>Unused Tools</span>
            </div>
            <div className="text-base font-semibold font-mono text-slate-900 tabular-nums">
              {formatCurrency(metrics.wasteBreakdown.unused)}
              <span className="text-[10px] text-slate-400 font-sans ml-1">/mo</span>
            </div>
            <div className="text-[11px] text-slate-500 font-mono mt-0.5">
              3 tools with 0 active logins
            </div>
          </div>

          {/* Duplicates */}
          <div
            onClick={() => setActiveWasteTab('duplicates')}
            className={`p-2.5 rounded-[4px] border cursor-pointer transition-all ${
              activeWasteTab === 'duplicates'
                ? 'border-purple-300 bg-purple-50/40 ring-1 ring-purple-400'
                : 'border-slate-200/80 bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex items-center gap-1.5 text-xs text-purple-700 font-semibold mb-1">
              <span className="w-2 h-2 rounded-[2px] bg-purple-500" />
              <span>Duplicate Tools</span>
            </div>
            <div className="text-base font-semibold font-mono text-slate-900 tabular-nums">
              {formatCurrency(metrics.wasteBreakdown.duplicates)}
              <span className="text-[10px] text-slate-400 font-sans ml-1">/mo</span>
            </div>
            <div className="text-[11px] text-slate-500 font-mono mt-0.5">
              2 redundant tool overlaps
            </div>
          </div>

          {/* Underutilized Seats */}
          <div
            onClick={() => setActiveWasteTab('underutilization')}
            className={`p-2.5 rounded-[4px] border cursor-pointer transition-all ${
              activeWasteTab === 'underutilization'
                ? 'border-amber-300 bg-amber-50/40 ring-1 ring-amber-400'
                : 'border-slate-200/80 bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex items-center gap-1.5 text-xs text-amber-800 font-semibold mb-1">
              <span className="w-2 h-2 rounded-[2px] bg-amber-500" />
              <span>Idle Seats</span>
            </div>
            <div className="text-base font-semibold font-mono text-slate-900 tabular-nums">
              {formatCurrency(metrics.wasteBreakdown.underutilized)}
              <span className="text-[10px] text-slate-400 font-sans ml-1">/mo</span>
            </div>
            <div className="text-[11px] text-slate-500 font-mono mt-0.5">
              50 unassigned paid seats
            </div>
          </div>
        </div>
      </div>

      {/* Flagged Subscriptions List */}
      <div className="divide-y divide-slate-100">
        {wasteItems.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500 font-mono">
            No waste items matching this filter. Clean software ledger!
          </div>
        ) : (
          wasteItems.map((sub) => {
            const isResolved = resolvedIds.has(sub.id);

            return (
              <div
                key={sub.id}
                onClick={() => setSelectedSubscription(sub)}
                className="p-3.5 hover:bg-slate-50/70 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                {/* Left: Tool info & waste cause */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-[4px] bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs font-mono border border-slate-200 shrink-0 mt-0.5">
                    {sub.vendor.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-900">{sub.vendor}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-[2px] bg-slate-100 text-slate-600 border border-slate-200">
                        {sub.category}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        Owner: {sub.owner.name} ({sub.owner.department})
                      </span>
                    </div>

                    <div className="mt-1 text-xs text-slate-600 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                      <span className="font-medium text-red-900/90">{sub.wasteReason}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Waste Cost & Action */}
                <div className="flex items-center gap-4 self-end sm:self-center">
                  <div className="text-right">
                    <div className="text-xs font-mono font-bold text-red-600 tabular-nums">
                      +{formatCurrency(sub.wasteMonthlyAmount || sub.monthlyCost)}
                      <span className="text-[10px] font-normal text-red-500">/mo waste</span>
                    </div>
                    <div className="text-[10px] font-mono text-slate-400">
                      Total bill: {formatCurrency(sub.monthlyCost)}/mo
                    </div>
                  </div>

                  {isResolved ? (
                    <span className="text-[11px] text-emerald-700 font-mono font-medium flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Action Logged
                    </span>
                  ) : (
                    <button
                      onClick={(e) => handleResolveAction(e, sub)}
                      className="text-[11px] font-medium px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-[3px] transition-colors shrink-0"
                    >
                      {sub.status === 'unused'
                        ? 'Cancel Tool'
                        : sub.status === 'duplicates'
                        ? 'Consolidate'
                        : 'Reclaim Seats'}
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
