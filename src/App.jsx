import React from 'react';
import { SpendProvider, useSpend } from './context/SpendContext';
import Sidebar from './components/layout/Sidebar';
import TopNav from './components/layout/TopNav';
import DashboardHome from './components/dashboard/DashboardHome';
import SubscriptionsTable from './components/subscriptions/SubscriptionsTable';
import WasteView from './components/views/WasteView';
import RenewalsView from './components/views/RenewalsView';
import VendorsView from './components/views/VendorsView';
import TeamView from './components/views/TeamView';
import AddSubscriptionModal from './components/modals/AddSubscriptionModal';
import SubscriptionDetailDrawer from './components/subscriptions/SubscriptionDetailDrawer';
import AuthScreen from './components/auth/AuthScreen';

function MainApp() {
  const { isAuthenticated, activeTab } = useSpend();

  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  return (
    <div className="flex min-h-screen bg-[#F8F9FA] text-slate-900 font-sans selection:bg-slate-200">
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopNav />

        <main className="flex-1 p-6 lg:p-8 max-w-[1400px] w-full mx-auto">
          {activeTab === 'dashboard' && <DashboardHome />}
          {activeTab === 'subscriptions' && <SubscriptionsTable />}
          {activeTab === 'waste' && <WasteView />}
          {activeTab === 'renewals' && <RenewalsView />}
          {activeTab === 'vendors' && <VendorsView />}
          {activeTab === 'team' && <TeamView />}
        </main>
      </div>

      {/* Modals & Drawers */}
      <AddSubscriptionModal />
      <SubscriptionDetailDrawer />
    </div>
  );
}

export default function App() {
  return (
    <SpendProvider>
      <MainApp />
    </SpendProvider>
  );
}
