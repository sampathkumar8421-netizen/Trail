import React from 'react';
import { Users, Mail, DollarSign, Layers } from 'lucide-react';
import { useSpend } from '../../context/SpendContext';

export default function TeamView() {
  const { users, subscriptions, formatCurrency, setSelectedSubscription } = useSpend();

  return (
    <div className="space-y-5">
      <div className="bg-white border border-slate-200/80 rounded-[6px] p-5 shadow-2xs flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-500">
            <Users className="w-4 h-4 text-slate-700" />
            <span>Budget Accountability</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight mt-1">
            Department Owners &amp; Stakeholders
          </h2>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            Finance accountability mapping: every software dollar has an assigned executive owner.
          </p>
        </div>
        <div className="font-mono text-xs text-slate-500">
          <strong className="text-slate-900">{users.length}</strong> budget stakeholders
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user) => {
          const ownedSubs = subscriptions.filter((s) => s.owner.name === user.name);
          const totalMonthlyManaged = ownedSubs.reduce((acc, curr) => acc + curr.monthlyCost, 0);

          return (
            <div
              key={user.id}
              className="bg-white border border-slate-200/80 rounded-[6px] p-4 shadow-2xs hover:border-slate-300 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-[4px] bg-slate-800 text-white font-mono text-xs font-bold flex items-center justify-center shrink-0">
                  {user.avatar}
                </div>
                <div className="truncate">
                  <h4 className="text-xs font-bold text-slate-900 truncate">{user.name}</h4>
                  <div className="text-[11px] font-mono text-slate-500 truncate">{user.role}</div>
                  <div className="text-[10px] font-mono text-slate-400 truncate">{user.department}</div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs font-mono">
                <div className="flex items-center justify-between text-slate-500">
                  <span>Subscriptions Owned:</span>
                  <span className="text-slate-900 font-semibold">{ownedSubs.length}</span>
                </div>
                <div className="flex items-center justify-between text-slate-500">
                  <span>Managed Spend:</span>
                  <span className="text-slate-900 font-bold tabular-nums">
                    {formatCurrency(totalMonthlyManaged)}/mo
                  </span>
                </div>
              </div>

              {/* Owned tools pills */}
              {ownedSubs.length > 0 && (
                <div className="mt-3 pt-2 border-t border-slate-100 flex flex-wrap gap-1">
                  {ownedSubs.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSelectedSubscription(s)}
                      className="text-[10px] font-mono px-1.5 py-0.5 rounded-[2px] bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                    >
                      {s.vendor}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
