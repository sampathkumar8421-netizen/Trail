import React, { useState } from 'react';
import { Calendar, AlertCircle, Clock, ShieldCheck, CheckCircle2, ChevronRight } from 'lucide-react';
import { useSpend } from '../../context/SpendContext';
import StatusBadge from '../common/StatusBadge';

export default function RenewalsView() {
  const { metrics, formatCurrency, setSelectedSubscription } = useSpend();

  // Sort all subscriptions by renewal timeline
  const sortedByRenewal = [...metrics.enrichedSubscriptions].sort(
    (a, b) => a.daysRemaining - b.daysRemaining
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200/80 rounded-[6px] p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-500">
            <Calendar className="w-4 h-4 text-slate-700" />
            <span>Auto-Renewal Defense Pipeline</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight mt-1">
            Contract Renewal Schedule
          </h2>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            Never miss a 30-day cancellation window. Subscriptions highlighted in red renew within 14 days.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <div className="p-2.5 bg-red-50 border border-red-200 rounded-[4px] text-right">
            <div className="text-[10px] uppercase text-red-600 font-semibold">Urgent (&lt;14d)</div>
            <div className="text-base font-bold text-red-700 tabular-nums">
              {metrics.urgentRenewalsCount} contracts
            </div>
          </div>
          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-[4px] text-right">
            <div className="text-[10px] uppercase text-slate-500">Next 30 Days</div>
            <div className="text-base font-bold text-slate-900 tabular-nums">
              {metrics.next30DaysRenewals.length} contracts
            </div>
          </div>
        </div>
      </div>

      {/* Renewals Timeline List */}
      <div className="bg-white border border-slate-200/80 rounded-[6px] shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <span className="text-xs font-mono font-medium text-slate-600 uppercase">
            All Upcoming Renewals (Ordered by urgency)
          </span>
          <span className="text-xs font-mono text-slate-400">
            {sortedByRenewal.length} software commitments
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {sortedByRenewal.map((sub) => {
            return (
              <div
                key={sub.id}
                onClick={() => setSelectedSubscription(sub)}
                className={`p-4 hover:bg-slate-50/80 cursor-pointer transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  sub.isUrgent ? 'bg-red-50/15' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-[4px] bg-slate-100 text-slate-800 flex items-center justify-center font-bold font-mono text-xs border border-slate-200 shrink-0">
                    {sub.vendor.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-900 flex items-center gap-2">
                      <span>{sub.vendor}</span>
                      <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1 py-0.2 rounded-[2px]">
                        {sub.category}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                      Owner: {sub.owner.name} ({sub.owner.role})
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6 self-end sm:self-center">
                  <div className="text-right">
                    <div className="text-xs font-mono font-semibold text-slate-900 tabular-nums">
                      {formatCurrency(sub.monthlyCost)}/mo
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 tabular-nums">
                      {formatCurrency(sub.monthlyCost * 12)}/yr ARR
                    </div>
                  </div>

                  <div className="min-w-[130px] text-right">
                    {sub.isUrgent ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[3px] bg-red-100 text-red-700 font-mono text-xs font-bold border border-red-300">
                        <AlertCircle className="w-3.5 h-3.5 text-red-600" />
                        {sub.daysRemaining === 0 ? 'Today' : `${sub.daysRemaining} days left`}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[3px] bg-slate-100 text-slate-700 font-mono text-xs font-medium border border-slate-200">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        in {sub.daysRemaining} days
                      </span>
                    )}
                    <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                      {sub.renewalDate}
                    </div>
                  </div>

                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
