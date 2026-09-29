import React, { createContext, useContext, useState, useMemo } from 'react';
import { INITIAL_SUBSCRIPTIONS, USERS, CATEGORIES, VENDORS } from '../data/mockData';

const SpendContext = createContext(null);

export const SpendProvider = ({ children }) => {
  const [subscriptions, setSubscriptions] = useState(INITIAL_SUBSCRIPTIONS);
  const [currency, setCurrency] = useState('USD'); // 'USD' | 'INR'
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'subscriptions' | 'waste' | 'renewals' | 'vendors'
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [currentUser, setCurrentUser] = useState(USERS[0]); // Sankar Patel (Finance Ops)
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Exchange rate USD to INR
  const USD_TO_INR = 83.5;

  // Format currency helper
  const formatCurrency = (amountInUSD, options = {}) => {
    const isINR = currency === 'INR';
    const val = isINR ? amountInUSD * USD_TO_INR : amountInUSD;
    const symbol = isINR ? '₹' : '$';

    if (options.compact) {
      if (val >= 10000000 && isINR) return `₹${(val / 10000000).toFixed(2)}Cr`;
      if (val >= 100000 && isINR) return `₹${(val / 100000).toFixed(1)}L`;
      if (val >= 1000000) return `${symbol}${(val / 1000000).toFixed(2)}M`;
      if (val >= 1000) return `${symbol}${(val / 1000).toFixed(1)}k`;
    }

    const formatted = Math.round(val).toLocaleString(isINR ? 'en-IN' : 'en-US');
    return `${symbol}${formatted}`;
  };

  // Calculate days remaining helper
  const getDaysRemaining = (renewalDateStr) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const renewal = new Date(renewalDateStr);
    renewal.setHours(0, 0, 0, 0);
    const diffTime = renewal - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Metrics calculations
  const metrics = useMemo(() => {
    let totalMonthly = 0;
    let unusedWaste = 0;
    let duplicateWaste = 0;
    let underutilizedWaste = 0;
    let activeSubs = 0;
    let flaggedWasteSubs = 0;

    const categorySpendMap = {};
    CATEGORIES.forEach((cat) => {
      categorySpendMap[cat] = { spend: 0, count: 0 };
    });

    const enriched = subscriptions.map((sub) => {
      const daysLeft = getDaysRemaining(sub.renewalDate);
      return {
        ...sub,
        daysRemaining: daysLeft,
        isUrgent: daysLeft >= 0 && daysLeft <= 14,
      };
    });

    enriched.forEach((sub) => {
      totalMonthly += sub.monthlyCost;

      if (sub.status === 'active') {
        activeSubs++;
      } else {
        flaggedWasteSubs++;
        if (sub.status === 'unused') {
          unusedWaste += sub.wasteMonthlyAmount || sub.monthlyCost;
        } else if (sub.status === 'duplicates') {
          duplicateWaste += sub.wasteMonthlyAmount || sub.monthlyCost;
        } else if (sub.status === 'underutilization') {
          underutilizedWaste += sub.wasteMonthlyAmount || 0;
        }
      }

      if (categorySpendMap[sub.category]) {
        categorySpendMap[sub.category].spend += sub.monthlyCost;
        categorySpendMap[sub.category].count += 1;
      }
    });

    const totalWaste = unusedWaste + duplicateWaste + underutilizedWaste;
    const annualRunRate = totalMonthly * 12;
    const wastePercentage = totalMonthly > 0 ? (totalWaste / totalMonthly) * 100 : 0;

    // Renewals in next 30 days
    const next30DaysRenewals = enriched
      .filter((s) => s.daysRemaining >= 0 && s.daysRemaining <= 30)
      .sort((a, b) => a.daysRemaining - b.daysRemaining);

    const urgentRenewalsCount = next30DaysRenewals.filter((s) => s.isUrgent).length;

    // Top categories sorted by spend
    const categoryBreakdown = Object.entries(categorySpendMap)
      .map(([name, data]) => ({
        name,
        spend: data.spend,
        count: data.count,
        percentage: totalMonthly > 0 ? (data.spend / totalMonthly) * 100 : 0,
      }))
      .sort((a, b) => b.spend - a.spend);

    return {
      totalMonthly,
      annualRunRate,
      activeSubs,
      totalSubs: subscriptions.length,
      flaggedWasteSubs,
      totalWaste,
      wastePercentage,
      wasteBreakdown: {
        unused: unusedWaste,
        duplicates: duplicateWaste,
        underutilized: underutilizedWaste,
      },
      next30DaysRenewals,
      urgentRenewalsCount,
      categoryBreakdown,
      enrichedSubscriptions: enriched,
    };
  }, [subscriptions]);

  // Add new subscription
  const addSubscription = (newSub) => {
    const id = `sub_${Date.now()}`;
    const ownerObj = USERS.find((u) => u.id === newSub.ownerId) || USERS[0];

    // Compute automatic waste flags if not active
    let wasteAmount = 0;
    if (newSub.status === 'unused') {
      wasteAmount = Number(newSub.monthlyCost);
    } else if (newSub.status === 'underutilization' && newSub.seatsPurchased > newSub.seatsUsed) {
      const perSeat = Number(newSub.monthlyCost) / (Number(newSub.seatsPurchased) || 1);
      const unusedSeats = Number(newSub.seatsPurchased) - Number(newSub.seatsUsed);
      wasteAmount = Math.round(perSeat * unusedSeats);
    } else if (newSub.status === 'duplicates') {
      wasteAmount = Number(newSub.monthlyCost);
    }

    const created = {
      id,
      vendor: newSub.vendor,
      website: newSub.website || `https://${newSub.vendor.toLowerCase().replace(/\s+/g, '')}.com`,
      category: newSub.category,
      monthlyCost: Number(newSub.monthlyCost),
      billingCycle: newSub.billingCycle || 'annual',
      renewalDate: newSub.renewalDate,
      owner: ownerObj,
      seatsPurchased: Number(newSub.seatsPurchased) || 1,
      seatsUsed: Number(newSub.seatsUsed) || 1,
      status: newSub.status,
      wasteReason: newSub.wasteReason || (newSub.status !== 'active' ? 'Flagged during onboarding' : null),
      wasteMonthlyAmount: wasteAmount,
      description: newSub.description || `${newSub.category} software for team`,
    };

    setSubscriptions((prev) => [created, ...prev]);
  };

  // Update subscription status (e.g. resolve waste, mark for cancellation)
  const updateSubscriptionStatus = (id, newStatus, reason = null) => {
    setSubscriptions((prev) =>
      prev.map((sub) => {
        if (sub.id === id) {
          return {
            ...sub,
            status: newStatus,
            wasteReason: reason || (newStatus === 'active' ? null : sub.wasteReason),
            wasteMonthlyAmount: newStatus === 'active' ? 0 : sub.wasteMonthlyAmount,
          };
        }
        return sub;
      })
    );
  };

  // Delete / cancel subscription
  const deleteSubscription = (id) => {
    setSubscriptions((prev) => prev.filter((s) => s.id !== id));
    if (selectedSubscription?.id === id) {
      setSelectedSubscription(null);
    }
  };

  return (
    <SpendContext.Provider
      value={{
        subscriptions,
        metrics,
        currency,
        setCurrency,
        formatCurrency,
        getDaysRemaining,
        activeTab,
        setActiveTab,
        isAddModalOpen,
        setIsAddModalOpen,
        selectedSubscription,
        setSelectedSubscription,
        isAuthenticated,
        setIsAuthenticated,
        currentUser,
        setCurrentUser,
        searchQuery,
        setSearchQuery,
        categoryFilter,
        setCategoryFilter,
        statusFilter,
        setStatusFilter,
        addSubscription,
        updateSubscriptionStatus,
        deleteSubscription,
        categories: CATEGORIES,
        users: USERS,
        vendors: VENDORS,
      }}
    >
      {children}
    </SpendContext.Provider>
  );
};

export const useSpend = () => {
  const context = useContext(SpendContext);
  if (!context) {
    throw new Error('useSpend must be used within a SpendProvider');
  }
  return context;
};
