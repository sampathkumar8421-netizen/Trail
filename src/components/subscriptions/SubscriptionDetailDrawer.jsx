import React, { useState } from 'react';
import {
  X,
  ExternalLink,
  Calendar,
  AlertTriangle,
  User,
  Users,
  CreditCard,
  Trash2,
  CheckCircle2,
  Clock,
  ShieldAlert,
} from 'lucide-react';
import { useSpend } from '../../context/SpendContext';
import StatusBadge from '../common/StatusBadge';

export default function SubscriptionDetailDrawer() {
  const {
    selectedSubscription,
    setSelectedSubscription,
    formatCurrency,
    updateSubscriptionStatus,
    deleteSubscription,
  } = useSpend();

  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!selectedSubscription) return null;

  const sub = selectedSubscription;
  const daysLeft = sub.daysRemaining !== undefined ? sub.daysRemaining : 30;
  const isUrgent = daysLeft <= 14 && daysLeft >= 0;
  const unusedSeats = Math.max(0, sub.seatsPurchased - sub.seatsUsed);
  const seatUtilizationPct = Math.round((sub.seatsUsed / (sub.seatsPurchased || 1)) * 100);

  const handleStatusChange = (newStatus) => {
    updateSubscriptionStatus(sub.id, newStatus);
    setSelectedSubscription({
      ...sub,
      status: newStatus,
      wasteReason: newStatus === 'active' ? null : sub.wasteReason,
      wasteMonthlyAmount: newStatus === 'active' ? 0 : sub.wasteMonthlyAmount,
    });
  };

  const handleDelete = () => {
    deleteSubscription(sub.id);
  };

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-slate-950/40 backdrop-blur-2xs animate-in fade-in">
      <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-200/80 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[4px] bg-slate-950 text-white font-mono font-bold text-xs flex items-center justify-center">
              {sub.vendor.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">{sub.vendor}</h3>
                <StatusBadge status={sub.status} size="small" />
              </div>
              <a
                href={sub.website}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] font-mono text-slate-500 hover:text-slate-900 flex items-center gap-1 mt-0.5"
              >
                <span>{sub.website.replace('https://', '')}</span>
                <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
              </a>
            </div>
          </div>

          <button
            onClick={() => setSelectedSubscription(null)}
            className="p-1 rounded-[3px] text-slate-400 hover:text-slate-800 hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 divide-y divide-slate-100">
          {/* Top Waste Alert Banner (if not active) */}
          {sub.status !== 'active' && (
            <div className="p-3.5 bg-red-50/60 border border-red-200 rounded-[4px] space-y-1.5">
              <div className="flex items-center justify-between text-xs text-red-700 font-bold uppercase tracking-wider font-mono">
                <span className="flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-red-600" />
                  Waste Flagged
                </span>
                <span>+{formatCurrency(sub.wasteMonthlyAmount || sub.monthlyCost)}/mo loss</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-sans">
                {sub.wasteReason || 'Flagged by finance ops for optimization.'}
              </p>
              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={() => handleStatusChange('active')}
                  className="px-2.5 py-1 bg-white border border-red-200 hover:bg-red-50 text-red-700 text-xs font-semibold rounded-[3px] transition-colors flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Mark Waste Resolved
                </button>
              </div>
            </div>
          )}

          {/* Financials & Contract Terms */}
          <div className="pt-4 space-y-3">
            <h4 className="text-xs font-mono uppercase text-slate-400 tracking-wider">
              Financial &amp; Contract Terms
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-[4px]">
                <div className="text-[11px] font-mono text-slate-500 uppercase">Monthly Cost</div>
                <div className="text-lg font-mono font-bold text-slate-900 tabular-nums mt-0.5">
                  {formatCurrency(sub.monthlyCost)}
                  <span className="text-xs font-normal text-slate-400 font-sans ml-1">/mo</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-[4px]">
                <div className="text-[11px] font-mono text-slate-500 uppercase">Annualized ARR</div>
                <div className="text-lg font-mono font-bold text-slate-900 tabular-nums mt-0.5">
                  {formatCurrency(sub.monthlyCost * 12)}
                  <span className="text-xs font-normal text-slate-400 font-sans ml-1">/yr</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
              <div className="flex items-center justify-between p-2 rounded-[3px] bg-slate-50/60 border border-slate-100">
                <span className="text-slate-500">Billing Cycle:</span>
                <span className="font-mono font-medium text-slate-900 uppercase">
                  {sub.billingCycle}
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-[3px] bg-slate-50/60 border border-slate-100">
                <span className="text-slate-500">Category:</span>
                <span className="font-mono font-medium text-slate-900">{sub.category}</span>
              </div>
            </div>
          </div>

          {/* Renewal Timeline */}
          <div className="pt-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-mono uppercase text-slate-400 tracking-wider">
                Renewal Timeline
              </h4>
              {isUrgent ? (
                <span className="text-[10px] font-mono font-bold text-red-600 bg-red-100 border border-red-200 px-1.5 py-0.2 rounded-[2px]">
                  CRITICAL &lt;14 DAYS
                </span>
              ) : (
                <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded-[2px]">
                  Scheduled
                </span>
              )}
            </div>

            <div className="p-3 rounded-[4px] border border-slate-200/80 bg-slate-50/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-500" />
                <div>
                  <div className="text-xs font-mono font-semibold text-slate-900">
                    {sub.renewalDate}
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    Standard 30-day non-renewal notice requirement
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div
                  className={`text-xs font-mono font-bold ${
                    isUrgent ? 'text-red-600' : 'text-slate-700'
                  }`}
                >
                  {daysLeft} days remaining
                </div>
              </div>
            </div>
          </div>

          {/* Seat Allocation & Utilization */}
          <div className="pt-4 space-y-2.5">
            <h4 className="text-xs font-mono uppercase text-slate-400 tracking-wider">
              Seat Utilization
            </h4>

            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-[4px] space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span>Active Seats:</span>
                <span className="font-semibold text-slate-900 tabular-nums">
                  {sub.seatsUsed} / {sub.seatsPurchased} licenses ({seatUtilizationPct}%)
                </span>
              </div>

              <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    seatUtilizationPct < 60 ? 'bg-red-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(seatUtilizationPct, 100)}%` }}
                />
              </div>

              {unusedSeats > 0 && (
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-600 pt-1">
                  <span>Unassigned Seats:</span>
                  <span className="text-red-700 font-semibold">{unusedSeats} idle seats</span>
                </div>
              )}
            </div>
          </div>

          {/* Contract Owner */}
          <div className="pt-4 space-y-2.5">
            <h4 className="text-xs font-mono uppercase text-slate-400 tracking-wider">
              Responsible Owner
            </h4>

            <div className="p-3 rounded-[4px] border border-slate-200/80 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-[3px] bg-slate-800 text-white font-mono text-xs flex items-center justify-center font-semibold">
                  {sub.owner.avatar}
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-900">{sub.owner.name}</div>
                  <div className="text-[11px] font-mono text-slate-500">
                    {sub.owner.role} • {sub.owner.department}
                  </div>
                  <div className="text-[10px] font-mono text-slate-400">{sub.owner.email}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          {sub.description && (
            <div className="pt-4 space-y-1.5">
              <h4 className="text-xs font-mono uppercase text-slate-400 tracking-wider">
                Usage &amp; Contract Notes
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/50 p-2.5 rounded-[4px] border border-slate-100">
                {sub.description}
              </p>
            </div>
          )}

          {/* Status Change Selector */}
          <div className="pt-4 space-y-2">
            <h4 className="text-xs font-mono uppercase text-slate-400 tracking-wider">
              Update Status
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => handleStatusChange('active')}
                className={`py-1.5 px-2 rounded-[3px] border font-medium transition-colors ${
                  sub.status === 'active'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                Active
              </button>
              <button
                onClick={() => handleStatusChange('unused')}
                className={`py-1.5 px-2 rounded-[3px] border font-medium transition-colors ${
                  sub.status === 'unused'
                    ? 'bg-red-50 text-red-800 border-red-300 font-semibold'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                Unused Tool
              </button>
              <button
                onClick={() => handleStatusChange('duplicates')}
                className={`py-1.5 px-2 rounded-[3px] border font-medium transition-colors ${
                  sub.status === 'duplicates'
                    ? 'bg-purple-50 text-purple-800 border-purple-300 font-semibold'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                Duplicate Tool
              </button>
              <button
                onClick={() => handleStatusChange('underutilization')}
                className={`py-1.5 px-2 rounded-[3px] border font-medium transition-colors ${
                  sub.status === 'underutilization'
                    ? 'bg-amber-50 text-amber-800 border-amber-300 font-semibold'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                Underutilized
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200/80 bg-slate-50/70 flex items-center justify-between">
          {confirmDelete ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-red-600 font-mono">Confirm remove?</span>
              <button
                onClick={handleDelete}
                className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded-[3px] text-xs font-semibold"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="px-2 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-[3px] text-xs"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmDelete(true)}
              className="text-slate-400 hover:text-red-600 text-xs flex items-center gap-1 font-mono transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Remove Subscription</span>
            </button>
          )}

          <button
            onClick={() => setSelectedSubscription(null)}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-[3px] transition-colors"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}
