import React from 'react';
import { Plus, Search, DollarSign, IndianRupee, Download, Bell } from 'lucide-react';
import { useSpend } from '../../context/SpendContext';

export default function TopNav() {
  const {
    activeTab,
    currency,
    setCurrency,
    setIsAddModalOpen,
    searchQuery,
    setSearchQuery,
    metrics,
    features,
  } = useSpend();

  const tabTitles = {
    dashboard: 'Financial Overview & Waste Detection',
    subscriptions: 'All Software Subscriptions',
    waste: 'Spend Optimization & Waste Audit',
    renewals: 'Renewal Calendar & Auto-Renewal Defense',
    vendors: 'Vendor Contracts & Commercial Terms',
    team: 'Department Owners & Seat Allocation',
  };

  return (
    <header className="h-14 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between sticky top-0 z-20 shrink-0">
      {/* View Title & Breadcrumb */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-mono text-slate-600 uppercase tracking-wider">
          Trail / {activeTab}
        </span>
        <span className="text-slate-300">/</span>
        <h1 className="text-sm font-semibold text-slate-900 tracking-tight">
          {tabTitles[activeTab] || 'Spend Management'}
        </h1>
      </div>

      {/* Center / Right controls */}
      <div className="flex items-center gap-3">
        {/* Global Search */}
        {features.search && (
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search vendor, owner, category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-[4px] text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white transition-colors"
            />
          </div>
        )}

        {/* Currency Switcher ($ / ₹) */}
        {features.currencySwitch && (
          <div className="flex items-center bg-slate-100 p-0.5 rounded-[4px] border border-slate-200 text-xs">
          <button
            onClick={() => setCurrency('USD')}
            className={`px-2 py-1 rounded-[3px] font-mono text-xs font-medium flex items-center gap-1 transition-all ${
              currency === 'USD'
                ? 'bg-white text-slate-950 shadow-xs border border-slate-200/60 font-semibold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
            title="View in US Dollars (USD $)"
          >
            <DollarSign className="w-3 h-3" />
            USD
          </button>
          <button
            onClick={() => setCurrency('INR')}
            className={`px-2 py-1 rounded-[3px] font-mono text-xs font-medium flex items-center gap-1 transition-all ${
              currency === 'INR'
                ? 'bg-white text-slate-950 shadow-xs border border-slate-200/60 font-semibold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
            title="View in Indian Rupees (INR ₹, 1 USD = ₹83.5)"
          >
            <IndianRupee className="w-3 h-3" />
            INR
          </button>
          </div>
        )}

        {/* Urgent Alert indicator */}
        {features.urgentAlerts && metrics.urgentRenewalsCount > 0 && (
          <div
            title={`${metrics.urgentRenewalsCount} contracts renewing in under 14 days`}
            className="flex items-center gap-1 px-2 py-1 bg-red-50 border border-red-200 rounded-[4px] text-red-700 text-xs font-medium"
          >
            <Bell className="w-3.5 h-3.5 text-red-600 animate-pulse" />
            <span className="font-mono text-[11px] font-semibold">{metrics.urgentRenewalsCount} Urgent</span>
          </div>
        )}

        {/* Primary Action: Add Subscription */}
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-slate-950 hover:bg-slate-800 text-white text-xs font-medium px-3 py-1.5 rounded-[4px] flex items-center gap-1.5 transition-colors shadow-xs active:translate-y-px"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Subscription</span>
        </button>
      </div>
    </header>
  );
}
