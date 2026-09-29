import React, { useState } from 'react';
import { Calendar, AlertCircle, Clock, ExternalLink, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useSpend } from '../../context/SpendContext';
import StatusBadge from '../common/StatusBadge';

export default function RenewalsPanel() {
  const { metrics, formatCurrency, setSelectedSubscription, updateSubscriptionStatus } = useSpend();
  const [filterMode, setFilterMode] = useState('all'); // 'all' | 'urgent'
  const [handledRenewals, setHandledRenewals] = useState({});

  const renewals = metrics.next30DaysRenewals.filter((item) => {
    if (filterMode === 'urgent') return item.isUrgent;
    return true;
  });

  const handleSnooze = (e, id) => {
    e.stopPropagation();
    setHandledRenewals((prev) => ({
      ...prev,
      [id]: 'Reviewed & Decision Logged',
    }));
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-[6px] shadow-2xs overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1 rounded-[3px] bg-slate-100 text-slate-700">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-900 tracking-tight flex items-center gap-2">
              Renewals in Next 30 Days
              {metrics.urgentRenewalsCount > 0 && (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-[3px] bg-red-100 text-red-700 font-semibold border border-red-200">
                  {metrics.urgentRenewalsCount} under 14 days
                </span>
              )}
            </h2>
            <p className="text-[11px] text-slate-500 font-mono">
              Avoid surprise contract renewals and enforce cancellation notice periods.
            </p>
          </div>
        </div>

        {/* Filter toggle */}
        <div className="flex items-center bg-slate-100 p-0.5 rounded-[4px] text-[11px] font-mono">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-2 py-0.5 rounded-[3px] transition-colors ${
              filterMode === 'all'
                ? 'bg-white text-slate-900 font-medium shadow-2xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            All 30 Days ({metrics.next30DaysRenewals.length})
          </button>
          <button
            onClick={() => setFilterMode('urgent')}
            className={`px-2 py-0.5 rounded-[3px] transition-colors flex items-center gap-1 ${
              filterMode === 'urgent'
                ? 'bg-white text-red-700 font-medium shadow-2xs'
                : 'text-slate-500 hover:text-red-600'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
            Urgent (&lt;14d) ({metrics.urgentRenewalsCount})
          </button>
        </div>
      </div>

      {/* Renewals Table */}
      <div className="divide-y divide-slate-100 overflow-x-auto">
        {renewals.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400 font-mono">
            No contract renewals scheduled in this timeframe.
          </div>
        ) : (
          renewals.map((sub) => {
            const isHandled = handledRenewals[sub.id];

            return (
              <div
                key={sub.id}
                onClick={() => setSelectedSubscription(sub)}
                className={`p-3.5 flex items-center justify-between hover:bg-slate-50/80 cursor-pointer transition-colors ${
                  sub.isUrgent ? 'bg-red-50/10' : ''
                }`}
              >
                {/* Vendor & Category */}
                <div className="flex items-center gap-3 min-w-[200px]">
                  <div className="w-8 h-8 rounded-[4px] bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs font-mono border border-slate-200 shrink-0">
                    {sub.vendor.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                      <span>{sub.vendor}</span>
                      {sub.billingCycle === 'annual' && (
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-tight">
                          [Annual]
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                      <span className="font-mono text-slate-400">{sub.category}</span>
                      <span>•</span>
                      <span>Owner: {sub.owner.name}</span>
                    </div>
                  </div>
                </div>

                {/* Status indicator */}
                <div className="hidden sm:block">
                  <StatusBadge status={sub.status} size="small" />
                </div>

                {/* Monthly & Annual Cost */}
                <div className="text-right min-w-[110px]">
                  <div className="text-xs font-mono font-semibold text-slate-900 tabular-nums">
                    {formatCurrency(sub.monthlyCost)}
                    <span className="text-[10px] font-sans font-normal text-slate-400">/mo</span>
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 tabular-nums">
                    {formatCurrency(sub.monthlyCost * 12)}/yr ARR
                  </div>
                </div>

                {/* Countdown & Renewal date (RED BADGE if under 14 days) */}
                <div className="min-w-[130px] text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    {sub.isUrgent ? (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[3px] bg-red-100 text-red-700 font-mono text-[10px] font-bold border border-red-300">
                        <AlertCircle className="w-3 h-3 text-red-600" />
                        {sub.daysRemaining === 0 ? 'Renews Today' : `${sub.daysRemaining} days left`}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[3px] bg-slate-100 text-slate-700 font-mono text-[10px] font-medium border border-slate-200">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {sub.daysRemaining} days left
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                    {sub.renewalDate}
                  </div>
                </div>

                {/* Action button */}
                <div className="pl-3">
                  {isHandled ? (
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-mono font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Reviewed
                    </span>
                  ) : (
                    <button
                      onClick={(e) => handleSnooze(e, sub.id)}
                      className={`text-[11px] font-medium px-2.5 py-1 rounded-[3px] border transition-colors ${
                        sub.isUrgent
                          ? 'bg-red-600 text-white border-red-700 hover:bg-red-700 font-semibold'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                      title="Log finance decision or review notice"
                    >
                      {sub.isUrgent ? 'Review & Act' : 'Review'}
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Alert note */}
      <div className="p-2.5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-500">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
          Auto-renewal warning triggers at 30d, 14d, and 48h windows.
        </span>
        <button
          onClick={() => (window.location.hash = '#renewals')}
          className="text-slate-700 hover:text-slate-950 font-medium"
        >
          View 12-month calendar →
        </button>
      </div>
    </div>
  );
}
