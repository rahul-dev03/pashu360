import React, { useState } from 'react';
import { GovSidebar, GovTab } from './components/GovSidebar';
import { GovHeader } from './components/GovHeader';
import { OverviewView } from './components/OverviewView';
import { DiseaseSurveillanceView } from './components/DiseaseSurveillanceView';
import { VaccinationCoverageView } from './components/VaccinationCoverageView';
import { HeatStressView } from './components/HeatStressView';
import { DistrictAnalyticsView } from './components/DistrictAnalyticsView';
import { ResourceAllocationView } from './components/ResourceAllocationView';
import { ReportsView } from './components/ReportsView';
import { useApp } from '../context/AppContext';

interface GovAppProps {
  onSwitchToFarmerApp: () => void;
  onSwitchToParaVetApp: () => void;
}

export const GovApp: React.FC<GovAppProps> = ({
  onSwitchToFarmerApp,
  onSwitchToParaVetApp,
}) => {
  const { villagesData, isReportsBadgeUpdated } = useApp();
  const [activeTab, setActiveTab] = useState<GovTab>('overview');
  const [selectedVillageId, setSelectedVillageId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter villages by search query if any
  const displayedVillages = villagesData.filter((v) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      v.name.toLowerCase().includes(query) ||
      v.hindiName.includes(query) ||
      v.block.toLowerCase().includes(query) ||
      v.activeDiseases.some((d) => d.toLowerCase().includes(query))
    );
  });

  const selectedVillage = villagesData.find((v) => v.id === selectedVillageId);
  const outbreakVillagesCount = villagesData.filter((v) => v.riskLevel === 'Outbreak').length;

  return (
    <div className="flex h-screen w-full bg-[#F4F6F2] font-sans text-stone-900 overflow-hidden antialiased">
      {/* 1. Left Sidebar Navigation */}
      <GovSidebar
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
        onSwitchToFarmerApp={onSwitchToFarmerApp}
        onSwitchToParaVetApp={onSwitchToParaVetApp}
        outbreakVillagesCount={outbreakVillagesCount}
        isReportsBadgeUpdated={isReportsBadgeUpdated}
      />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {/* Top Header */}
        <GovHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedVillageName={selectedVillage?.name}
          outbreakCount={outbreakVillagesCount}
          onSwitchToFarmerApp={onSwitchToFarmerApp}
          onSwitchToParaVetApp={onSwitchToParaVetApp}
        />

        {/* Scrollable Viewport Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'overview' && (
              <OverviewView
                villages={displayedVillages}
                selectedVillageId={selectedVillageId}
                onSelectVillage={(vid) => setSelectedVillageId(vid)}
                onNavigateToTab={(tab) => setActiveTab(tab)}
              />
            )}

            {activeTab === 'surveillance' && (
              <DiseaseSurveillanceView selectedVillageName={selectedVillage?.name} />
            )}

            {activeTab === 'vaccination' && <VaccinationCoverageView />}

            {activeTab === 'heat_stress' && <HeatStressView />}

            {activeTab === 'analytics' && <DistrictAnalyticsView />}

            {activeTab === 'resources' && <ResourceAllocationView />}

            {activeTab === 'reports' && <ReportsView />}
          </div>
        </main>
      </div>
    </div>
  );
};
