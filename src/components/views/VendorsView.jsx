import React from 'react';
import { Building2, ExternalLink, ArrowUpRight } from 'lucide-react';
import { useSpend } from '../../context/SpendContext';

export default function VendorsView() {
  const { vendors, subscriptions, formatCurrency, setSelectedSubscription, setActiveTab, setCategoryFilter } = useSpend();

  return (
    <div className="space-y-5">
      <div className="bg-white border border-slate-200/80 rounded-[6px] p-5 shadow-2xs flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-500">
            <Building2 className="w-4 h-4 text-slate-700" />
            <span>Approved Vendor Ledger</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight mt-1">
            Software Vendors Directory
          </h2>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            Commercial suppliers and master service agreements across all corporate departments.
          </p>
        </div>
        <div className="font-mono text-xs text-slate-500">
          <strong className="text-slate-900">{vendors.length}</strong> onboarded vendors
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vendors.map((vendor) => {
          // Find matching active subscriptions
          const matchingSubs = subscriptions.filter(
            (s) => s.vendor.toLowerCase().includes(vendor.name.toLowerCase()) || vendor.name.toLowerCase().includes(s.vendor.toLowerCase())
          );
          const vendorMonthlySpend = matchingSubs.reduce((acc, curr) => acc + curr.monthlyCost, 0);

          return (
            <div
              key={vendor.name}
              className="bg-white border border-slate-200/80 rounded-[6px] p-4 shadow-2xs hover:border-slate-300 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-[4px] bg-slate-100 text-slate-800 font-mono font-bold text-xs flex items-center justify-center border border-slate-200">
                      {vendor.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-slate-900">{vendor.name}</h4>
                      <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1 py-0.2 rounded-[2px]">
                        {vendor.category}
                      </span>
                    </div>
                  </div>
                  <a
                    href={vendor.website}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1 text-slate-400 hover:text-slate-700 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs font-mono">
                  <div className="flex items-center justify-between text-slate-500">
                    <span>Contracts:</span>
                    <span className="text-slate-900 font-medium">
                      {matchingSubs.length} active
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500">
                    <span>Monthly Spend:</span>
                    <span className="text-slate-900 font-bold tabular-nums">
                      {formatCurrency(vendorMonthlySpend)}/mo
                    </span>
                  </div>
                </div>
              </div>

              {matchingSubs.length > 0 && (
                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => {
                      setSelectedSubscription(matchingSubs[0]);
                    }}
                    className="text-[11px] font-mono text-slate-600 hover:text-slate-900 flex items-center gap-1"
                  >
                    <span>Inspect Contract</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
