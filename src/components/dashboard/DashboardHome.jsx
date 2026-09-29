import React from 'react';
import {
  AlertTriangle,
  Calendar,
  Clock,
  ArrowRight,
  TrendingDown,
  ShieldAlert,
  Download,
  Sparkles,
  Zap,
} from 'lucide-react';
import { useSpend } from '../../context/SpendContext';
import KpiCards from './KpiCards';
import RenewalsPanel from './RenewalsPanel';
import WasteBreakdownPanel from './WasteBreakdownPanel';
import CategorySpendChart from './CategorySpendChart';

export default function DashboardHome() {
  const {
    metrics,
    formatCurrency,
    setActiveTab,
    setStatusFilter,
    subscriptions,
  } = useSpend();

  // Export CSV helper
  const handleExportCSV = () => {
    const headers = [
      'Vendor',
      'Category',
      'Monthly Cost',
      'Annual Run Rate',
      'Billing Cycle',
      'Renewal Date',
      'Days Remaining',
      'Owner',
      'Seats Purchased',
      'Seats Used',
      'Status',
      'Waste Reason',
    ];

    const rows = metrics.enrichedSubscriptions.map((s) => [
      `"${s.vendor}"`,
      `"${s.category}"`,
      s.monthlyCost,
      s.monthlyCost * 12,
      s.billingCycle,
      s.renewalDate,
      s.daysRemaining,
      `"${s.owner.name}"`,
      s.seatsPurchased,
      s.seatsUsed,
      s.status,
      `"${s.wasteReason || ''}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `trail_saas_spend_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Finance Executive Alert Ribbon */}
      <div className="bg-white border border-slate-200/90 rounded-[6px] p-3.5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          <span className="text-xs font-semibold text-slate-900 font-mono tracking-tight">
            Finance Ops Audit:
          </span>
          <span className="text-xs text-slate-600">
            <strong>{metrics.urgentRenewalsCount} contracts</strong> renew in &lt;14 days. 
            Estimated monthly waste is{' '}
            <strong className="text-red-700 font-mono font-bold">
              {formatCurrency(metrics.totalWaste)}/mo
            </strong>{' '}
            ({metrics.wastePercentage.toFixed(1)}% of SaaS budget).
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('waste')}
            className="text-xs font-medium text-red-700 hover:text-red-800 bg-red-50 hover:bg-red-100/80 px-2.5 py-1 rounded-[3px] border border-red-200 transition-colors flex items-center gap-1"
          >
            <span>Review {metrics.flaggedWasteSubs} waste flags</span>
            <ArrowRight className="w-3 h-3" />
          </button>

          <button
            onClick={handleExportCSV}
            className="text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 px-2.5 py-1 rounded-[3px] border border-slate-200 transition-colors flex items-center gap-1 font-mono"
            title="Download full software ledger as CSV"
          >
            <Download className="w-3 h-3 text-slate-500" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Top Row KPI Cards */}
      <KpiCards />

      {/* Main Grid: Renewals (Left) + Category Breakdown (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Renewals in the next 30 days panel (2 cols) */}
        <div className="lg:col-span-2">
          <RenewalsPanel />
        </div>

        {/* Spend by Category Chart (1 col) */}
        <div className="lg:col-span-1">
          <CategorySpendChart />
        </div>
      </div>

      {/* Waste Breakdown Panel and Chart */}
      <div>
        <WasteBreakdownPanel />
      </div>
    </div>
  );
}
