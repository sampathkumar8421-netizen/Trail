import React from 'react';
import { AlertOctagon, TrendingDown, DollarSign, Layers, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useSpend } from '../../context/SpendContext';
import WasteBreakdownPanel from '../dashboard/WasteBreakdownPanel';

export default function WasteView() {
  const { metrics, formatCurrency, setSelectedSubscription, updateSubscriptionStatus } = useSpend();

  return (
    <div className="space-y-6">
      {/* Waste Hero KPI */}
      <div className="bg-red-50/50 border border-red-200/90 rounded-[6px] p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-red-700 font-bold">
              <AlertOctagon className="w-4 h-4 text-red-600" />
              <span>Executive Waste Audit</span>
            </div>
            <h2 className="text-xl font-bold font-mono text-slate-900 tracking-tight mt-1">
              {formatCurrency(metrics.totalWaste)}
              <span className="text-sm font-normal text-slate-500 font-sans ml-1.5">
                wasted monthly ({formatCurrency(metrics.totalWaste * 12)}/year)
              </span>
            </h2>
            <p className="text-xs text-slate-600 mt-1 max-w-xl font-sans">
              Trail identified {metrics.flaggedWasteSubs} subscriptions with zero usage, overlapping functionality, or unassigned seats. Resolving these can instantly recover <strong>{metrics.wastePercentage.toFixed(1)}%</strong> of your total SaaS budget.
            </p>
          </div>

          <div className="flex flex-col items-start sm:items-end gap-1 font-mono text-xs text-slate-600">
            <span className="bg-white px-2 py-1 rounded-[3px] border border-red-200 text-red-700 font-semibold">
              Potential Savings: {formatCurrency(metrics.totalWaste * 12)} ARR
            </span>
            <span className="text-[11px] text-slate-400">
              Audit cadence: Daily automated sync
            </span>
          </div>
        </div>
      </div>

      {/* Main Waste Breakdown Panel */}
      <WasteBreakdownPanel />

      {/* Recommended Action Plans */}
      <div className="bg-white border border-slate-200/80 rounded-[6px] p-5 shadow-2xs space-y-4">
        <h3 className="text-sm font-semibold text-slate-900 tracking-tight">
          Optimization Playbook for Finance Ops
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1 */}
          <div className="p-3.5 rounded-[4px] border border-slate-200 bg-slate-50/60 space-y-2">
            <div className="text-xs font-semibold text-slate-900">
              1. Terminate Zero-Usage Tools
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Clearbit, Asana, and Midjourney show 0 active logins for over 60 days. Instruct IT to cancel payment before auto-renewing.
            </p>
            <div className="text-xs font-mono font-bold text-red-600">
              Save: {formatCurrency(metrics.wasteBreakdown.unused)}/mo
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-3.5 rounded-[4px] border border-slate-200 bg-slate-50/60 space-y-2">
            <div className="text-xs font-semibold text-slate-900">
              2. Consolidate Duplicate Stacks
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Migrate Miro users to FigJam (bundled free with Figma Org) and consolidate HubSpot into Salesforce CRM pipeline.
            </p>
            <div className="text-xs font-mono font-bold text-purple-700">
              Save: {formatCurrency(metrics.wasteBreakdown.duplicates)}/mo
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-3.5 rounded-[4px] border border-slate-200 bg-slate-50/60 space-y-2">
            <div className="text-xs font-semibold text-slate-900">
              3. Right-size Seat Licenses
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Reduce 17 unassigned Salesforce licenses, 25 ChatGPT team seats, and 8 Greenhouse recruiter seats during upcoming invoice cycle.
            </p>
            <div className="text-xs font-mono font-bold text-amber-700">
              Save: {formatCurrency(metrics.wasteBreakdown.underutilized)}/mo
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
