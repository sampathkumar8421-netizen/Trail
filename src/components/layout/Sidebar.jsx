import React from 'react';
import {
  LayoutDashboard,
  Layers,
  AlertTriangle,
  Calendar,
  Building2,
  Users,
  LogOut,
  ChevronDown,
  ChevronLeft,
  ShieldAlert,
  Search,
  DollarSign,
  Bell,
  Layout,
} from 'lucide-react';
import { useSpend } from '../../context/SpendContext';
import Toggle from '../common/Toggle';

export default function Sidebar() {
  const {
    activeTab,
    setActiveTab,
    metrics,
    formatCurrency,
    currentUser,
    setIsAuthenticated,
    isSidebarCollapsed,
    toggleSidebar,
    features,
    toggleFeature,
  } = useSpend();

  const collapsed = isSidebarCollapsed;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null, locked: true },
    { id: 'subscriptions', label: 'Subscriptions', icon: Layers, badge: metrics.totalSubs, locked: true },
    {
      id: 'waste',
      label: 'Waste & Sprawl',
      icon: AlertTriangle,
      badge: `${formatCurrency(metrics.totalWaste, { compact: true })}/mo`,
      badgeType: 'danger',
      featureKey: 'waste',
    },
    {
      id: 'renewals',
      label: 'Upcoming Renewals',
      icon: Calendar,
      badge: metrics.urgentRenewalsCount > 0 ? `${metrics.urgentRenewalsCount} urgent` : null,
      badgeType: metrics.urgentRenewalsCount > 0 ? 'urgent' : 'default',
      featureKey: 'renewals',
    },
    { id: 'vendors', label: 'Vendors Directory', icon: Building2, badge: null, featureKey: 'vendors' },
    { id: 'team', label: 'Team & Owners', icon: Users, badge: null, featureKey: 'team' },
  ].filter((item) => item.locked || features[item.featureKey]);

  // Feature toggle definitions grouped for the panel
  const featureGroups = [
    {
      title: 'Modules',
      items: [
        { key: 'waste', label: 'Waste & Sprawl', icon: AlertTriangle },
        { key: 'renewals', label: 'Upcoming Renewals', icon: Calendar },
        { key: 'vendors', label: 'Vendors Directory', icon: Building2 },
        { key: 'team', label: 'Team & Owners', icon: Users },
      ],
    },
    {
      title: 'Interface',
      items: [
        { key: 'search', label: 'Global search', icon: Search },
        { key: 'currencySwitch', label: 'Currency switcher', icon: DollarSign },
        { key: 'urgentAlerts', label: 'Urgent alert pill', icon: Bell },
        { key: 'execSummary', label: 'Executive summary card', icon: Layout },
      ],
    },
  ];

  return (
    <aside
      className={`${
        collapsed ? 'w-[68px]' : 'w-64'
      } bg-[#0F172A] text-slate-300 flex flex-col shrink-0 h-screen sticky top-0 border-r border-slate-800 select-none transition-[width] duration-300 ease-in-out overflow-hidden`}
    >
      {/* Brand & Organization */}
      <div className={`border-b border-slate-800/80 ${collapsed ? 'p-3' : 'p-4'}`}>
        <div className="flex items-center justify-between">
          <div className={`flex items-center ${collapsed ? 'justify-center w-full' : 'gap-2.5'}`}>
            <div className="w-6 h-6 rounded-[3px] bg-white flex items-center justify-center text-slate-950 font-bold text-xs tracking-tighter shadow-sm shrink-0">
              ▲
            </div>
            {!collapsed && (
              <>
                <span className="font-semibold text-white text-base tracking-tight">trail</span>
                <span className="text-[10px] uppercase font-mono tracking-widest bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded-[2px] border border-slate-700/60">
                  Ops
                </span>
              </>
            )}
          </div>

          {/* Collapse toggle */}
          {!collapsed && (
            <button
              onClick={toggleSidebar}
              title="Collapse sidebar"
              className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-[3px] transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
        </div>

        {!collapsed && (
          <div className="mt-3.5 p-2 rounded-[4px] bg-slate-900/80 border border-slate-800 flex items-center justify-between hover:border-slate-700 cursor-pointer transition-colors">
            <div className="truncate">
              <div className="text-xs font-medium text-slate-200 truncate">
                Acme Technologies, Inc.
              </div>
              <div className="text-[11px] text-slate-400 font-mono">142 employees • Series B</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          </div>
        )}
      </div>
      {/* Main Navigation */}
      <nav className={`flex-1 overflow-y-auto ${collapsed ? 'px-2 py-3' : 'px-2.5 py-4'} space-y-1`}>
        {!collapsed && (
          <div className="px-2 pb-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-400">
            Spend Management
          </div>
        )}

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              title={collapsed ? item.label : undefined}
              className={`w-full flex items-center rounded-[4px] text-xs font-medium transition-colors ${
                collapsed ? 'justify-center py-2' : 'justify-between px-2.5 py-2 text-left'
              } ${
                isActive
                  ? 'bg-slate-800 text-white font-semibold shadow-xs'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <div className={`flex items-center ${collapsed ? '' : 'gap-2.5'}`}>
                <Icon
                  className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`}
                />
                {!collapsed && <span>{item.label}</span>}
              </div>

              {!collapsed && item.badge && (
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded-[2px] tracking-tight ${
                    item.badgeType === 'danger'
                      ? 'bg-red-950/70 text-red-300 border border-red-800/60 font-semibold'
                      : item.badgeType === 'urgent'
                      ? 'bg-red-500 text-white font-semibold'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Executive Summary */}
        {!collapsed && features.execSummary && (
          <>
            <div className="pt-5 px-2 pb-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-400">
              Executive Summary
            </div>

            <div className="mx-1 p-2.5 rounded-[4px] bg-slate-900/90 border border-slate-800 text-slate-300 space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
                  Identified Waste
                </span>
                <span className="font-mono text-red-400 font-semibold tabular-nums">
                  {formatCurrency(metrics.totalWaste)}/mo
                </span>
              </div>
              <div className="text-[11px] text-slate-400 leading-tight">
                {metrics.flaggedWasteSubs} subscriptions flagged for cancelation or seat reduction.
              </div>
              <button
                onClick={() => setActiveTab('waste')}
                className="w-full mt-1 py-1 text-center text-[10px] font-medium text-slate-200 bg-slate-800 hover:bg-slate-700/80 rounded-[3px] transition-colors border border-slate-700"
              >
                Review Waste Audit →
              </button>
            </div>
          </>
        )}
        {/* Feature Toggle Panel */}
        {!collapsed ? (
          <div className="pt-5">
            <div className="px-2 pb-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Feature Toggles</span>
              <span className="text-slate-500 normal-case tracking-normal">
                {Object.values(features).filter(Boolean).length}/{Object.keys(features).length}
              </span>
            </div>

            <div className="space-y-3">
              {featureGroups.map((group) => (
                <div key={group.title}>
                  <div className="px-2 pb-1 text-[9px] font-mono uppercase tracking-wider text-slate-500">
                    {group.title}
                  </div>
                  <div className="mx-1 rounded-[4px] bg-slate-900/90 border border-slate-800 divide-y divide-slate-800/70">
                    {group.items.map((f) => {
                      const Icon = f.icon;
                      const on = features[f.key];
                      return (
                        <div
                          key={f.key}
                          className="flex items-center justify-between gap-2 px-2 py-1.5"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <Icon
                              className={`w-3.5 h-3.5 shrink-0 ${
                                on ? 'text-slate-300' : 'text-slate-600'
                              }`}
                            />
                            <span
                              className={`text-[11px] truncate ${
                                on ? 'text-slate-300' : 'text-slate-500 line-through'
                              }`}
                            >
                              {f.label}
                            </span>
                          </div>
                          <Toggle
                            checked={on}
                            onChange={() => toggleFeature(f.key)}
                            label={`Toggle ${f.label}`}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="pt-4 flex justify-center">
            <button
              onClick={toggleSidebar}
              title="Feature toggles — expand sidebar"
              className="w-9 h-9 flex items-center justify-center rounded-[4px] bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors border border-slate-700"
            >
              <Layout className="w-4 h-4" />
            </button>
          </div>
        )}
      </nav>

      {/* User profile & Session footer */}
      <div className={`border-t border-slate-800 bg-slate-950/40 ${collapsed ? 'p-2.5' : 'p-3'}`}>
        {collapsed ? (
          <div className="flex flex-col items-center gap-2">
            <div
              title={`${currentUser?.name || 'Sankar Patel'} — ${currentUser?.role || 'Head of Finance Ops'}`}
              className="w-8 h-8 rounded-[3px] bg-slate-800 text-slate-200 text-[11px] font-mono font-medium flex items-center justify-center border border-slate-700 shrink-0"
            >
              {currentUser?.avatar || 'SP'}
            </div>
            <button
              onClick={() => setIsAuthenticated(false)}
              title="Sign out / Switch account"
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-[3px] transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 truncate">
              <div className="w-7 h-7 rounded-[3px] bg-slate-800 text-slate-200 text-xs font-mono font-medium flex items-center justify-center border border-slate-700 shrink-0">
                {currentUser?.avatar || 'SP'}
              </div>
              <div className="truncate">
                <div className="text-xs font-medium text-slate-200 truncate leading-tight">
                  {currentUser?.name || 'Sankar Patel'}
                </div>
                <div className="text-[10px] text-slate-400 truncate font-mono">
                  {currentUser?.role || 'Head of Finance Ops'}
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsAuthenticated(false)}
              title="Sign out / Switch account"
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-[3px] transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}