import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  AlertCircle,
  Clock,
  ExternalLink,
  ChevronRight,
  Plus,
  Trash2,
  CheckCircle2,
} from 'lucide-react';
import { useSpend } from '../../context/SpendContext';
import StatusBadge from '../common/StatusBadge';

export default function SubscriptionsTable() {
  const {
    subscriptions,
    metrics,
    formatCurrency,
    categories,
    categoryFilter,
    setCategoryFilter,
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    setSelectedSubscription,
    setIsAddModalOpen,
    deleteSubscription,
    updateSubscriptionStatus,
  } = useSpend();

  const [sortField, setSortField] = useState('monthlyCost'); // 'monthlyCost' | 'renewalDate' | 'vendor' | 'seats'
  const [sortDirection, setSortDirection] = useState('desc'); // 'asc' | 'desc'

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection(field === 'vendor' ? 'asc' : 'desc');
    }
  };

  // Filter and sort subscriptions
  const filteredSubscriptions = useMemo(() => {
    return metrics.enrichedSubscriptions
      .filter((sub) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchVendor = sub.vendor.toLowerCase().includes(q);
          const matchOwner = sub.owner.name.toLowerCase().includes(q);
          const matchCat = sub.category.toLowerCase().includes(q);
          if (!matchVendor && !matchOwner && !matchCat) return false;
        }

        // Category filter
        if (categoryFilter !== 'All' && sub.category !== categoryFilter) {
          return false;
        }

        // Status filter
        if (statusFilter !== 'All' && sub.status !== statusFilter) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];

        if (sortField === 'seats') {
          valA = a.seatsUsed / (a.seatsPurchased || 1);
          valB = b.seatsUsed / (b.seatsPurchased || 1);
        } else if (sortField === 'vendor') {
          valA = a.vendor.toLowerCase();
          valB = b.vendor.toLowerCase();
        } else if (sortField === 'renewalDate') {
          valA = a.daysRemaining;
          valB = b.daysRemaining;
        }

        if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
  }, [metrics.enrichedSubscriptions, searchQuery, categoryFilter, statusFilter, sortField, sortDirection]);

  return (
    <div className="space-y-4">
      {/* Top Filter Bar */}
      <div className="bg-white border border-slate-200/80 rounded-[6px] p-3 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        {/* Left: Category & Status dropdowns/pills */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-slate-400 font-mono text-[11px] uppercase">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-[3px] px-2 py-1 text-slate-800 focus:outline-none focus:border-slate-400"
            >
              <option value="All">All Categories ({subscriptions.length})</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-slate-400 font-mono text-[11px] uppercase">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-[3px] px-2 py-1 text-slate-800 focus:outline-none focus:border-slate-400"
            >
              <option value="All">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="unused">Unused (Waste)</option>
              <option value="duplicates">Duplicates</option>
              <option value="underutilization">Underutilized</option>
            </select>
          </div>

          {/* Reset Filters if active */}
          {(categoryFilter !== 'All' || statusFilter !== 'All' || searchQuery) && (
            <button
              onClick={() => {
                setCategoryFilter('All');
                setStatusFilter('All');
                setSearchQuery('');
              }}
              className="text-[11px] font-mono text-slate-500 hover:text-slate-900 underline px-1"
            >
              Reset filters
            </button>
          )}
        </div>

        {/* Right: Quick actions & count */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-slate-500">
            Showing <strong className="text-slate-900">{filteredSubscriptions.length}</strong> of{' '}
            {subscriptions.length} subscriptions
          </span>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-slate-950 hover:bg-slate-800 text-white text-xs font-medium px-2.5 py-1 rounded-[3px] flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New</span>
          </button>
        </div>
      </div>

      {/* Dense Table */}
      <div className="bg-white border border-slate-200/80 rounded-[6px] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-mono uppercase tracking-wider text-slate-500">
                <th
                  onClick={() => handleSort('vendor')}
                  className="py-2.5 px-4 font-medium cursor-pointer hover:text-slate-900 transition-colors select-none"
                >
                  <div className="flex items-center gap-1">
                    <span>Vendor &amp; Tool</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-2.5 px-4 font-medium">Category</th>
                <th className="py-2.5 px-4 font-medium">Owner</th>
                <th
                  onClick={() => handleSort('monthlyCost')}
                  className="py-2.5 px-4 font-medium text-right cursor-pointer hover:text-slate-900 transition-colors select-none"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Monthly Cost</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('seats')}
                  className="py-2.5 px-4 font-medium cursor-pointer hover:text-slate-900 transition-colors select-none"
                >
                  <div className="flex items-center gap-1">
                    <span>Seats (Used/Total)</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('renewalDate')}
                  className="py-2.5 px-4 font-medium text-right cursor-pointer hover:text-slate-900 transition-colors select-none"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Renewal Date</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-2.5 px-4 font-medium text-center">Status</th>
                <th className="py-2.5 px-3 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredSubscriptions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 font-mono">
                    No subscriptions matching selected filters.
                  </td>
                </tr>
              ) : (
                filteredSubscriptions.map((sub) => {
                  const utilizationPct = Math.round(
                    (sub.seatsUsed / (sub.seatsPurchased || 1)) * 100
                  );

                  return (
                    <tr
                      key={sub.id}
                      onClick={() => setSelectedSubscription(sub)}
                      className={`group hover:bg-slate-50/80 cursor-pointer transition-colors ${
                        sub.isUrgent ? 'bg-red-50/15' : ''
                      }`}
                    >
                      {/* Vendor */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-[3px] bg-slate-100 text-slate-700 flex items-center justify-center font-mono font-bold text-xs border border-slate-200 shrink-0">
                            {sub.vendor.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                              <span>{sub.vendor}</span>
                              {sub.billingCycle === 'annual' && (
                                <span className="text-[10px] font-mono text-slate-400 font-normal">
                                  /yr
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono truncate max-w-[180px]">
                              {sub.website.replace('https://', '')}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4">
                        <span className="text-[11px] font-mono text-slate-600 px-1.5 py-0.5 rounded-[3px] bg-slate-100 border border-slate-200/80">
                          {sub.category}
                        </span>
                      </td>

                      {/* Owner */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-[2px] bg-slate-200 text-slate-700 text-[10px] font-mono flex items-center justify-center font-medium shrink-0">
                            {sub.owner.avatar}
                          </div>
                          <div>
                            <div className="font-medium text-slate-800 leading-tight">
                              {sub.owner.name}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono">
                              {sub.owner.department}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Monthly Cost (Tabular monospace) */}
                      <td className="py-3 px-4 text-right">
                        <div className="font-mono font-semibold text-slate-900 tabular-nums">
                          {formatCurrency(sub.monthlyCost)}
                        </div>
                        <div className="text-[10px] font-mono text-slate-400 tabular-nums">
                          {formatCurrency(sub.monthlyCost * 12)}/yr
                        </div>
                      </td>

                      {/* Seat Utilization */}
                      <td className="py-3 px-4">
                        <div className="w-32">
                          <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                            <span className="font-medium text-slate-700 tabular-nums">
                              {sub.seatsUsed} / {sub.seatsPurchased}
                            </span>
                            <span
                              className={`tabular-nums ${
                                utilizationPct < 50
                                  ? 'text-red-600 font-semibold'
                                  : utilizationPct < 75
                                  ? 'text-amber-600 font-medium'
                                  : 'text-slate-500'
                              }`}
                            >
                              {utilizationPct}%
                            </span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                utilizationPct < 50
                                  ? 'bg-red-500'
                                  : utilizationPct < 75
                                  ? 'bg-amber-500'
                                  : 'bg-emerald-500'
                              }`}
                              style={{ width: `${Math.min(utilizationPct, 100)}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Renewal Date with RED BADGE if under 14 days */}
                      <td className="py-3 px-4 text-right">
                        <div>
                          {sub.isUrgent ? (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[3px] bg-red-100 text-red-700 font-mono text-[10px] font-bold border border-red-300">
                              <AlertCircle className="w-3 h-3 text-red-600" />
                              {sub.daysRemaining === 0 ? 'Today' : `${sub.daysRemaining}d left`}
                            </span>
                          ) : (
                            <span className="text-[11px] font-mono text-slate-600">
                              in {sub.daysRemaining} days
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                          {sub.renewalDate}
                        </div>
                      </td>

                      {/* Status Pill */}
                      <td className="py-3 px-4 text-center">
                        <StatusBadge status={sub.status} />
                      </td>

                      {/* Row action chevron */}
                      <td className="py-3 px-3 text-right">
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-colors" />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
