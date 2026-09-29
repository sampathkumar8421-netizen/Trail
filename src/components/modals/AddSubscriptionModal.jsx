import React, { useState, useEffect } from 'react';
import { X, Plus, AlertCircle, Building2, User, Calendar, CreditCard, DollarSign } from 'lucide-react';
import { useSpend } from '../../context/SpendContext';

export default function AddSubscriptionModal() {
  const {
    isAddModalOpen,
    setIsAddModalOpen,
    addSubscription,
    categories,
    users,
    currency,
  } = useSpend();

  const [formData, setFormData] = useState({
    vendor: '',
    website: '',
    category: 'Productivity',
    monthlyCost: '',
    billingCycle: 'annual',
    renewalDate: '',
    ownerId: users[0]?.id || '',
    seatsPurchased: '10',
    seatsUsed: '10',
    status: 'active',
    wasteReason: '',
    description: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isAddModalOpen) {
        setIsAddModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAddModalOpen, setIsAddModalOpen]);

  if (!isAddModalOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.vendor.trim()) errs.vendor = 'Vendor name is required';
    if (!formData.monthlyCost || Number(formData.monthlyCost) <= 0) {
      errs.monthlyCost = 'Valid monthly spend is required';
    }
    if (!formData.renewalDate) errs.renewalDate = 'Renewal date is required';
    if (
      formData.status === 'underutilization' &&
      Number(formData.seatsUsed) >= Number(formData.seatsPurchased)
    ) {
      errs.seatsUsed = 'Used seats must be less than purchased seats for underutilized status';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    addSubscription(formData);
    setIsAddModalOpen(false);
    // Reset form
    setFormData({
      vendor: '',
      website: '',
      category: 'Productivity',
      monthlyCost: '',
      billingCycle: 'annual',
      renewalDate: '',
      ownerId: users[0]?.id || '',
      seatsPurchased: '10',
      seatsUsed: '10',
      status: 'active',
      wasteReason: '',
      description: '',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-[6px] border border-slate-200 shadow-xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 tracking-tight">
              Add Software Subscription
            </h3>
            <p className="text-[11px] font-mono text-slate-500">
              Track contract, license seats, owner, and renewal terms.
            </p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(false)}
            className="p-1 rounded-[3px] text-slate-400 hover:text-slate-800 hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Vendor Name & Website */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono uppercase text-slate-600 mb-1">
                Vendor Name *
              </label>
              <input
                type="text"
                placeholder="e.g. GitHub Copilot, Datadog"
                value={formData.vendor}
                onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                className={`w-full px-2.5 py-1.5 text-xs bg-slate-50 border rounded-[3px] focus:outline-none focus:bg-white transition-colors ${
                  errors.vendor ? 'border-red-400 bg-red-50/30' : 'border-slate-200 focus:border-slate-400'
                }`}
              />
              {errors.vendor && (
                <p className="text-[10px] text-red-600 mt-0.5">{errors.vendor}</p>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-slate-600 mb-1">
                Website URL
              </label>
              <input
                type="text"
                placeholder="https://vendor.com"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-[3px] focus:outline-none focus:border-slate-400 focus:bg-white transition-colors"
              />
            </div>
          </div>

          {/* Category & Owner */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono uppercase text-slate-600 mb-1">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-[3px] focus:outline-none focus:border-slate-400 focus:bg-white transition-colors"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-slate-600 mb-1">
                Responsible Owner *
              </label>
              <select
                value={formData.ownerId}
                onChange={(e) => setFormData({ ...formData, ownerId: e.target.value })}
                className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-[3px] focus:outline-none focus:border-slate-400 focus:bg-white transition-colors"
              >
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.role})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Cost & Billing Cycle */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-mono uppercase text-slate-600 mb-1">
                Monthly Cost (USD $) *
              </label>
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-mono">
                  $
                </span>
                <input
                  type="number"
                  placeholder="2400"
                  value={formData.monthlyCost}
                  onChange={(e) => setFormData({ ...formData, monthlyCost: e.target.value })}
                  className={`w-full pl-6 pr-2.5 py-1.5 text-xs font-mono bg-slate-50 border rounded-[3px] focus:outline-none focus:bg-white transition-colors ${
                    errors.monthlyCost ? 'border-red-400 bg-red-50/30' : 'border-slate-200 focus:border-slate-400'
                  }`}
                />
              </div>
              {errors.monthlyCost && (
                <p className="text-[10px] text-red-600 mt-0.5">{errors.monthlyCost}</p>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-slate-600 mb-1">
                Billing Cycle
              </label>
              <select
                value={formData.billingCycle}
                onChange={(e) => setFormData({ ...formData, billingCycle: e.target.value })}
                className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-[3px] focus:outline-none focus:border-slate-400 focus:bg-white transition-colors"
              >
                <option value="annual">Annual Commitment</option>
                <option value="monthly">Monthly Recurring</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-slate-600 mb-1">
                Next Renewal Date *
              </label>
              <input
                type="date"
                value={formData.renewalDate}
                onChange={(e) => setFormData({ ...formData, renewalDate: e.target.value })}
                className={`w-full px-2.5 py-1.5 text-xs font-mono bg-slate-50 border rounded-[3px] focus:outline-none focus:bg-white transition-colors ${
                  errors.renewalDate ? 'border-red-400 bg-red-50/30' : 'border-slate-200 focus:border-slate-400'
                }`}
              />
              {errors.renewalDate && (
                <p className="text-[10px] text-red-600 mt-0.5">{errors.renewalDate}</p>
              )}
            </div>
          </div>

          {/* Seats: Purchased vs Used */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-mono uppercase text-slate-600 mb-1">
                Seats Purchased
              </label>
              <input
                type="number"
                min="1"
                value={formData.seatsPurchased}
                onChange={(e) => setFormData({ ...formData, seatsPurchased: e.target.value })}
                className="w-full px-2.5 py-1.5 text-xs font-mono bg-slate-50 border border-slate-200 rounded-[3px] focus:outline-none focus:border-slate-400 focus:bg-white transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-slate-600 mb-1">
                Seats Used (Active)
              </label>
              <input
                type="number"
                min="0"
                value={formData.seatsUsed}
                onChange={(e) => setFormData({ ...formData, seatsUsed: e.target.value })}
                className={`w-full px-2.5 py-1.5 text-xs font-mono bg-slate-50 border rounded-[3px] focus:outline-none focus:bg-white transition-colors ${
                  errors.seatsUsed ? 'border-red-400 bg-red-50/30' : 'border-slate-200 focus:border-slate-400'
                }`}
              />
              {errors.seatsUsed && (
                <p className="text-[10px] text-red-600 mt-0.5">{errors.seatsUsed}</p>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-slate-600 mb-1">
                Subscription Status *
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-[3px] focus:outline-none focus:border-slate-400 focus:bg-white transition-colors font-medium"
              >
                <option value="active">Active (Healthy)</option>
                <option value="unused">Unused (0 usage waste)</option>
                <option value="duplicates">Duplicate (Overlap)</option>
                <option value="underutilization">Underutilized (Idle seats)</option>
              </select>
            </div>
          </div>

          {/* Waste Reason if not active */}
          {formData.status !== 'active' && (
            <div className="p-3 bg-red-50/50 border border-red-200 rounded-[4px] space-y-1.5 animate-in fade-in">
              <label className="block text-[11px] font-mono uppercase text-red-800 font-semibold">
                Waste Observation / Note
              </label>
              <input
                type="text"
                placeholder="e.g. Migration complete, zero logins for 60 days"
                value={formData.wasteReason}
                onChange={(e) => setFormData({ ...formData, wasteReason: e.target.value })}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-red-200 rounded-[3px] focus:outline-none focus:border-red-400"
              />
            </div>
          )}

          {/* Modal Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-3 py-1.5 rounded-[3px] border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-[3px] bg-slate-950 hover:bg-slate-800 text-white text-xs font-medium transition-colors shadow-xs"
            >
              Save Subscription
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
