import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/navigation/Sidebar';
import { Header } from '@/components/navigation/Header';
import { MobileNav } from '@/components/navigation/MobileNav';
import { DemoBanner } from '@/components/common/DemoBanner';
import { ProfileModal } from '@/features/auth/ProfileModal';

export const Layout: React.FC = () => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* Top Demo Banner when running offline or in demo mode */}
      <DemoBanner />

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <Sidebar onProfileClick={() => setIsProfileModalOpen(true)} />

        {/* Mobile Nav drawer */}
        <MobileNav
          isOpen={isMobileNavOpen}
          onClose={() => setIsMobileNavOpen(false)}
          onProfileClick={() => setIsProfileModalOpen(true)}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          <Header
            onToggleMobileNav={() => setIsMobileNavOpen(true)}
            onProfileClick={() => setIsProfileModalOpen(true)}
          />

          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <Outlet />
          </main>

          {/* Institutional Footer */}
          <footer className="py-4 px-6 border-t border-slate-200/80 bg-white text-center text-xs text-slate-500">
            <p>
              CampusPilot AI • Sahyadri College of Engineering & Management (SCEM), Adyar, Mangaluru, Karnataka - 575007.
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Autonomous Institute Affiliated to Visvesvaraya Technological University (VTU), Belagavi. NAAC 'A' Grade & NBA Accredited.
            </p>
          </footer>
        </div>
      </div>

      {/* User Profile Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </div>
  );
};

