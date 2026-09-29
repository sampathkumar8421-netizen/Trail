import React, { useState } from 'react';
import { X, Copy, Check, Mail, AlertTriangle, ShieldCheck, FileText } from 'lucide-react';
import { useSpend } from '../../context/SpendContext';

export default function CancellationNoticeModal({ subscription, isOpen, onClose }) {
  const { formatCurrency, updateSubscriptionStatus } = useSpend();
  const [copied, setCopied] = useState(false);
  const [logged, setLogged] = useState(false);

  if (!isOpen || !subscription) return null;

  const noticeDate = new Date().toISOString().split('T')[0];
  const renewalDate = subscription.renewalDate;
  const daysLeft = subscription.daysRemaining;

  const emailSubject = `Notice of Non-Renewal: ${subscription.vendor} Subscription — Acme Technologies, Inc.`;
  const emailBody = `To: ${subscription.vendor} Accounts & Renewals Team
Subject: ${emailSubject}

Dear ${subscription.vendor} Team,

Please accept this email as formal written notice that Acme Technologies, Inc. will NOT be renewing our subscription for ${subscription.vendor} (${subscription.category}), which is currently scheduled for renewal on ${renewalDate}.

Per our Master Services Agreement / Terms of Service, we are exercising our right of non-renewal prior to the automatic renewal window (${daysLeft} days remaining).

Contract Details:
• Organization: Acme Technologies, Inc.
• Responsible Owner: ${subscription.owner.name} (${subscription.owner.email})
• Current License Commitment: ${subscription.seatsPurchased} seats (${subscription.seatsUsed} active)
• Current Monthly Cost: ${formatCurrency(subscription.monthlyCost)}/mo (${formatCurrency(subscription.monthlyCost * 12)}/yr ARR)
• Reason for Non-Renewal: ${subscription.wasteReason || 'Internal software consolidation and stack optimization'}

Please confirm receipt of this notice and confirm that no further invoices or credit card charges will be issued following the current billing period ending on ${renewalDate}.

Sincerely,
${subscription.owner.name}
${subscription.owner.role}
Acme Technologies, Inc.`;

  const handleCopy = () => {
    navigator.clipboard.writeText(emailBody);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleLogAction = () => {
    updateSubscriptionStatus(
      subscription.id,
      'active',
      `Non-renewal notice served on ${noticeDate}`
    );
    setLogged(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-[6px] border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-200/80 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-[4px] bg-red-100 text-red-700 border border-red-200">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 tracking-tight flex items-center gap-2">
                Auto-Renewal Cancellation Notice
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-[2px] bg-red-100 text-red-700 font-bold border border-red-200">
                  {daysLeft}d left
                </span>
              </h3>
              <p className="text-[11px] font-mono text-slate-500">
                Pre-formatted non-renewal notice enforcing 30-day contract cancellation windows.
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

        {/* Warning Banner */}
        <div className="px-5 py-2.5 bg-red-50/60 border-b border-red-100 flex items-center justify-between text-xs text-red-800">
          <span className="flex items-center gap-1.5 font-medium">
            <AlertTriangle className="w-3.5 h-3.5 text-red-600 shrink-0" />
            Vendor requires notice prior to renewal date ({renewalDate}). Recoverable:{' '}
            <strong className="font-mono text-red-900">
              {formatCurrency(subscription.monthlyCost * 12)}/yr
            </strong>
          </span>
          <span className="text-[10px] font-mono uppercase font-bold text-red-700">
            MSA Notice Clause
          </span>
        </div>

        {/* Email Preview Area */}
        <div className="p-5 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-slate-500">
            <span>Subject: {emailSubject}</span>
            <span className="text-[11px] text-slate-400">Recipient: {subscription.vendor} Account Rep</span>
          </div>

          <div className="relative">
            <pre className="p-4 bg-slate-900 text-slate-200 text-xs font-mono rounded-[4px] overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-72 border border-slate-800 selection:bg-slate-700">
              {emailBody}
            </pre>

            <button
              onClick={handleCopy}
              className="absolute top-2.5 right-2.5 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-[3px] border border-slate-700 flex items-center gap-1.5 transition-colors shadow-xs"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Copy Text</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3.5 border-t border-slate-200/80 bg-slate-50/80 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
            <span>Sends via email client or copy to vendor billing portal</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-[3px] border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-medium transition-colors"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleLogAction}
              disabled={logged}
              className="px-4 py-1.5 rounded-[3px] bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
            >
              {logged ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Notice Logged &amp; Tracked</span>
                </>
              ) : (
                <>
                  <FileText className="w-3.5 h-3.5" />
                  <span>Mark Notice Sent &amp; Resolve</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
