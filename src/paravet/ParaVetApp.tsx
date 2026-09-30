import React, { useState } from 'react';
import { Sidebar, ParaVetTab } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { DashboardHome } from './components/DashboardHome';
import { LiveReferralsView } from './components/LiveReferralsView';
import { CattleRecordsView } from './components/CattleRecordsView';
import { AppointmentsView } from './components/AppointmentsView';
import { VaccinationView } from './components/VaccinationView';
import { AnalyticsView } from './components/AnalyticsView';
import { SettingsView } from './components/SettingsView';
import { CaseDetailsModal } from './components/CaseDetailsModal';
import { initialParaVetReferrals, CaseClinicalDetails } from './data/paravetMockData';
import { useApp } from '../context/AppContext';
import { Cattle } from '../types';

interface ParaVetAppProps {
  onSwitchToFarmerApp: () => void;
  onSwitchToGovApp?: () => void;
}

export const ParaVetApp: React.FC<ParaVetAppProps> = ({
  onSwitchToFarmerApp,
  onSwitchToGovApp,
}) => {
  const {
    cattleList,
    timelineRecords,
    paravetReferrals,
    setParavetReferrals,
    markCaseVisitedAndTreated,
    addPrescriptionToCase,
    updateTreatmentNotes,
    scheduleCaseVisit,
  } = useApp();

  const [activeTab, setActiveTab] = useState<ParaVetTab>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);

  const selectedCase = paravetReferrals.find((c) => c.id === selectedCaseId) || null;

  const urgentCount = paravetReferrals.filter((r) => r.riskLevel === 'Urgent' && r.status !== 'completed').length;

  const handleUpdateTreatmentNotes = (caseId: string, notes: string) => {
    updateTreatmentNotes(caseId, notes);
  };

  const handleAddPrescription = (
    caseId: string,
    rx: { medicineName: string; dosage: string; route: any; duration: string; instructions: string }
  ) => {
    addPrescriptionToCase(caseId, rx);
  };

  const handleScheduleVisit = (caseId: string, date: string, time: string, ambulanceUnit: string) => {
    scheduleCaseVisit(caseId, date, time, ambulanceUnit);
  };

  const handleOpenByReferralId = (refId: string) => {
    setSelectedCaseId(refId);
  };

  const handleSelectCattleToOpenCase = (cattle: Cattle) => {
    const linkedCase = paravetReferrals.find(
      (r) => r.cattleId === cattle.id || r.cattleName.toLowerCase() === cattle.name.toLowerCase()
    );
    if (linkedCase) {
      setSelectedCaseId(linkedCase.id);
    } else {
      setActiveTab('analytics');
    }
  };

  // Matched cattle profile for the modal
  const selectedCattleProfile = selectedCase
    ? cattleList.find(
        (c) =>
          c.id === selectedCase.cattleId ||
          c.name.toLowerCase() === selectedCase.cattleName.toLowerCase()
      )
    : undefined;

  return (
    <div className="flex h-screen w-full bg-[#F4F6F2] font-sans text-stone-900 overflow-hidden antialiased">
      {/* 1. Left Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          setSelectedCaseId(null);
        }}
        onSwitchToFarmerApp={onSwitchToFarmerApp}
        onSwitchToGovApp={onSwitchToGovApp}
        urgentCount={urgentCount}
        totalReferralsCount={paravetReferrals.length}
      />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {/* Top Header */}
        <TopHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          urgentCount={urgentCount}
          onSwitchToFarmerApp={onSwitchToFarmerApp}
          onOpenUrgentFilter={() => {
            setActiveTab('referrals');
          }}
        />

        {/* Scrollable Viewport Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' && (
              <DashboardHome
                referrals={paravetReferrals}
                onSelectReferral={(ref) => setSelectedCaseId(ref.id)}
                onNavigateToTab={(tab) => setActiveTab(tab)}
              />
            )}

            {activeTab === 'referrals' && (
              <LiveReferralsView
                referrals={paravetReferrals}
                onSelectReferral={(ref) => setSelectedCaseId(ref.id)}
              />
            )}

            {activeTab === 'cattle' && (
              <CattleRecordsView
                cattleList={cattleList}
                onSelectCattle={handleSelectCattleToOpenCase}
              />
            )}

            {activeTab === 'appointments' && (
              <AppointmentsView onOpenCaseByReferralId={handleOpenByReferralId} />
            )}

            {activeTab === 'vaccination' && <VaccinationView />}

            {activeTab === 'analytics' && (
              <AnalyticsView
                cattleList={cattleList}
                timelineRecords={timelineRecords}
              />
            )}

            {activeTab === 'settings' && <SettingsView />}
          </div>
        </main>
      </div>

      {/* 3. Case Details 3-Column Modal */}
      {selectedCase && (
        <CaseDetailsModal
          caseData={selectedCase}
          cattleProfile={selectedCattleProfile}
          onClose={() => setSelectedCaseId(null)}
          onUpdateTreatmentNotes={handleUpdateTreatmentNotes}
          onAddPrescription={handleAddPrescription}
          onScheduleVisit={handleScheduleVisit}
          onMarkVisitedAndTreated={markCaseVisitedAndTreated}
        />
      )}
    </div>
  );
};
