import React, { useState } from 'react';
import { X, CheckSquare, Square, Calendar, ShieldCheck, ArrowRight, BookOpen, Clock, AlertTriangle, Users } from 'lucide-react';
import { useSpend } from '../../context/SpendContext';

export default function FinOpsPlaybookModal({ isOpen, onClose }) {
  const { metrics, formatCurrency, setActiveTab } = useSpend();
  const [activeTab, setLocalActiveTab] = useState('weekly');
  const [completedSteps, setCompletedSteps] = useState(new Set());

  if (!isOpen) return null;

  const toggleStep = (stepId) => {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(stepId)) next.delete(stepId);
      else next.add(stepId);
      return next;
    });
  };

  const weeklySteps = [
    {
      id: 'w1',
      title: 'Inspect contracts renewing in <14 days',
      desc: `Check the ${metrics.urgentRenewalsCount} contracts highlighted in red on the dashboard.`,
    },
    {
      id: 'w2',
      title: 'Verify usage with responsible department owner',
      desc: 'Confirm with owner if contract is still operational or should be terminated.',
    },
    {
      id: 'w3',
      title: 'Issue non-renewal notice before 30-day window closes',
      desc: 'Use Trail\'s 1-click Cancellation Notice Generator to email vendor account executive.',
    },
    {
      id: 'w4',
      title: 'Mark decision in Trail ledger',
      desc: 'Log the cancellation or renewal decision to maintain audit trail.',
    },
  ];

  const monthlySteps = [
    {
      id: 'm1',
      title: 'Filter Subscriptions by "Underutilized"',
      desc: 'Sort table by Seat Utilization percentage ascending to locate contracts below 75% usage.',
    },
    {
      id: 'm2',
      title: 'Identify unassigned seat counts',
      desc: `Currently 50 idle seats across Salesforce, ChatGPT Team, and Greenhouse (${formatCurrency(metrics.wasteBreakdown.underutilized)}/mo waste).`,
    },
    {
      id: 'm3',
      title: 'Submit de-provisioning request prior to next invoice',
      desc: 'Notify vendor billing to adjust license tier to true active count on upcoming billing cycle.',
    },
    {
      id: 'm4',
      title: 'Update active seat count in Trail',
      desc: 'Adjust seats purchased to active usage count and verify recoverable savings.',
    },
  ];

  const quarterlySteps = [
    {
      id: 'q1',
      title: 'Review "Duplicate Stacks" audit',
      desc: `Examine 2 identified software overlaps (${formatCurrency(metrics.wasteBreakdown.duplicates)}/mo redundant spend).`,
    },
    {
      id: 'q2',
      title: 'Evaluate bundled enterprise tools',
      desc: 'Consolidate Miro users into FigJam (included free in Figma Org) and consolidate HubSpot into Salesforce.',
    },
    {
      id: 'q3',
      title: 'Coordinate 15-minute cross-departmental sync',
      desc: 'Align Design (Sarah Jenkins) and Growth (Tom Miller) on migration timeline.',
    },
    {
      id: 'q4',
      title: 'Terminate duplicate contract & lock annual savings',
      desc: 'Recover up to $22,440/yr in redundant multi-vendor contract fees.',
    },
  ];

  const currentSteps =
    activeTab === 'weekly' ? weeklySteps : activeTab === 'monthly' ? monthlySteps : quarterlySteps;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-[6px] border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200/80 flex items-center justify-between bg-slate-50/80 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-[4px] bg-slate-900 text-white">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 tracking-tight">
                FinOps Standard Operating Procedures (SOPs)
              </h3>
              <p className="text-[11px] font-mono text-slate-500">
                Actionable operational cadences to eliminate waste and enforce renewal defense.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-[3px] text-slate-400 hover:text-slate-800 hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="px-5 pt-3 border-b border-slate-200 flex gap-4 text-xs font-mono shrink-0">
          <button
            onClick={() => setLocalActiveTab('weekly')}
            className={`pb-2.5 flex items-center gap-1.5 border-b-2 font-medium transition-colors ${
              activeTab === 'weekly'
                ? 'border-red-600 text-red-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-red-600" />
            <span>Weekly: 10-Min Renewal Defense</span>
          </button>
          <button
            onClick={() => setLocalActiveTab('monthly')}
            className={`pb-2.5 flex items-center gap-1.5 border-b-2 font-medium transition-colors ${
              activeTab === 'monthly'
                ? 'border-amber-600 text-amber-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-amber-600" />
            <span>Monthly: Seat True-Down</span>
          </button>
          <button
            onClick={() => setLocalActiveTab('quarterly')}
            className={`pb-2.5 flex items-center gap-1.5 border-b-2 font-medium transition-colors ${
              activeTab === 'quarterly'
                ? 'border-purple-600 text-purple-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
            <span>Quarterly: Stack Consolidation</span>
          </button>
        </div>

        {/* Checklist Content */}
        <div className="p-5 overflow-y-auto space-y-3">
          <div className="text-xs text-slate-600 mb-2 font-mono">
            Checklist progress: {completedSteps.size} of {currentSteps.length} tasks completed
          </div>

          <div className="space-y-2.5">
            {currentSteps.map((step) => {
              const isDone = completedSteps.has(step.id);

              return (
                <div
                  key={step.id}
                  onClick={() => toggleStep(step.id)}
                  className={`p-3 rounded-[4px] border cursor-pointer transition-all flex items-start gap-3 ${
                    isDone
                      ? 'bg-slate-50/80 border-slate-200 opacity-75'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  <button className="mt-0.5 text-slate-700">
                    {isDone ? (
                      <CheckSquare className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400" />
                    )}
                  </button>

                  <div className="flex-1">
                    <h4
                      className={`text-xs font-semibold ${
                        isDone ? 'line-through text-slate-400' : 'text-slate-900'
                      }`}
                    >
                      {step.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed font-sans">
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-200 bg-slate-50/80 flex items-center justify-between shrink-0">
          <button
            onClick={() => setCompletedSteps(new Set())}
            className="text-[11px] font-mono text-slate-400 hover:text-slate-700 underline"
          >
            Reset checklist
          </button>

          <button
            onClick={onClose}
            className="px-3.5 py-1.5 bg-slate-950 hover:bg-slate-800 text-white text-xs font-medium rounded-[3px] transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
