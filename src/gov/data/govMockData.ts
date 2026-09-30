export type VillageRiskLevel = 'Healthy' | 'Attention' | 'Outbreak';

export interface VillageData {
  id: string;
  name: string;
  hindiName: string;
  block: string;
  riskLevel: VillageRiskLevel;
  totalCattle: number;
  activeCases: number;
  vaccinationRate: number; // percentage
  reportingFarmsToday: number;
  activeDiseases: string[];
  paraVetsAssigned: number;
  requiredVisits: number;
  coordinates: { x: number; y: number }; // percentage on district map
  recentAlert: string;
  thiIndex: number;
}

export interface DiseaseSurveillanceMetric {
  id: string;
  name: string;
  hindiName: string;
  scientificName: string;
  activeCases: number;
  newToday: number;
  recovered: number;
  trend: 'up' | 'down' | 'stable';
  trendPercentage: string;
  severity: 'Critical' | 'High' | 'Moderate' | 'Low';
  epidemicTimeline: { day: string; cases: number }[];
}

export interface VaccinationCoverageItem {
  id: string;
  diseaseName: string;
  targetPopulation: number;
  vaccinated: number;
  due: number;
  missed: number;
  completionPercentage: number;
  coldChainAudit: string;
  nextDriveDate: string;
}

export interface VillageResourceRow {
  village: string;
  activeCases: number;
  paraVets: number;
  requiredVisits: number;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  ambulanceDispatched: boolean;
}

export interface DistrictReportCard {
  id: string;
  title: string;
  subtitle: string;
  period: string;
  generatedDate: string;
  fileSize: string;
  summaryMetrics: { label: string; value: string }[];
  status: 'Ready' | 'Archived';
  category: 'Epidemiology' | 'NADCP' | 'Emergency';
}

// 6 Karnal District Villages
export const mockVillages: VillageData[] = [
  {
    id: 'karnal',
    name: 'Karnal Central',
    hindiName: 'करनाल',
    block: 'Karnal Block',
    riskLevel: 'Outbreak',
    totalCattle: 1420,
    activeCases: 34,
    vaccinationRate: 86.4,
    reportingFarmsToday: 48,
    activeDiseases: ['FMD', 'Mastitis'],
    paraVetsAssigned: 4,
    requiredVisits: 18,
    coordinates: { x: 50, y: 52 },
    recentAlert: 'Cluster of 40.6°C hyperthermia & frothy salivation in Sector 14 farm belt',
    thiIndex: 78,
  },
  {
    id: 'assandh',
    name: 'Assandh',
    hindiName: 'असंध',
    block: 'Assandh Sub-Division',
    riskLevel: 'Outbreak',
    totalCattle: 980,
    activeCases: 28,
    vaccinationRate: 79.2,
    reportingFarmsToday: 32,
    activeDiseases: ['FMD', 'Heat Stress'],
    paraVetsAssigned: 2,
    requiredVisits: 14,
    coordinates: { x: 22, y: 72 },
    recentAlert: 'FMD vesicular spread reported near western canal corridor',
    thiIndex: 82,
  },
  {
    id: 'nilokheri',
    name: 'Nilokheri',
    hindiName: 'नीलोखेड़ी',
    block: 'Nilokheri Block',
    riskLevel: 'Attention',
    totalCattle: 1150,
    activeCases: 14,
    vaccinationRate: 91.0,
    reportingFarmsToday: 29,
    activeDiseases: ['Mastitis', 'LSD'],
    paraVetsAssigned: 3,
    requiredVisits: 8,
    coordinates: { x: 54, y: 24 },
    recentAlert: 'Early subclinical mastitis quarter tension detected by AARVI',
    thiIndex: 74,
  },
  {
    id: 'gharaunda',
    name: 'Gharaunda',
    hindiName: 'घरौंडा',
    block: 'Gharaunda Block',
    riskLevel: 'Attention',
    totalCattle: 890,
    activeCases: 19,
    vaccinationRate: 88.5,
    reportingFarmsToday: 26,
    activeDiseases: ['LSD', 'Heat Stress'],
    paraVetsAssigned: 2,
    requiredVisits: 10,
    coordinates: { x: 52, y: 84 },
    recentAlert: 'Cutaneous circumscribed nodules reported in 3 dairy herds',
    thiIndex: 79,
  },
  {
    id: 'taraori',
    name: 'Taraori',
    hindiName: 'तरावड़ी',
    block: 'Nilokheri Sub-Division',
    riskLevel: 'Healthy',
    totalCattle: 760,
    activeCases: 5,
    vaccinationRate: 95.8,
    reportingFarmsToday: 22,
    activeDiseases: ['Mild Dietary Dip'],
    paraVetsAssigned: 2,
    requiredVisits: 3,
    coordinates: { x: 42, y: 35 },
    recentAlert: 'Optimal lactation stability; zero infectious disease spread',
    thiIndex: 71,
  },
  {
    id: 'indri',
    name: 'Indri',
    hindiName: 'इन्द्री',
    block: 'Indri Block',
    riskLevel: 'Healthy',
    totalCattle: 910,
    activeCases: 3,
    vaccinationRate: 96.5,
    reportingFarmsToday: 24,
    activeDiseases: ['Routine Wellness'],
    paraVetsAssigned: 2,
    requiredVisits: 2,
    coordinates: { x: 74, y: 38 },
    recentAlert: 'NADCP ring vaccination booster drive completed',
    thiIndex: 70,
  },
];

// District Key Disease Surveillance Metrics
export const mockDiseaseSurveillance: DiseaseSurveillanceMetric[] = [
  {
    id: 'mastitis',
    name: 'Bovine Mastitis',
    hindiName: 'थन में सूजन / मैस्टाइटिस',
    scientificName: 'Streptococcus / Staphylococcus intramammary infection',
    activeCases: 42,
    newToday: 6,
    recovered: 18,
    trend: 'up',
    trendPercentage: '+14% this week',
    severity: 'High',
    epidemicTimeline: [
      { day: '11 Sep', cases: 28 },
      { day: '12 Sep', cases: 30 },
      { day: '13 Sep', cases: 29 },
      { day: '14 Sep', cases: 32 },
      { day: '15 Sep', cases: 35 },
      { day: '16 Sep', cases: 34 },
      { day: '17 Sep', cases: 37 },
      { day: '18 Sep', cases: 36 },
      { day: '19 Sep', cases: 38 },
      { day: '20 Sep', cases: 40 },
      { day: '21 Sep', cases: 39 },
      { day: '22 Sep', cases: 41 },
      { day: '23 Sep', cases: 40 },
      { day: '24 Sep', cases: 42 },
    ],
  },
  {
    id: 'fmd',
    name: 'Foot & Mouth Disease',
    hindiName: 'खुरपका-मुँहपका (FMD)',
    scientificName: 'Apthovirus (Picornaviridae)',
    activeCases: 29,
    newToday: 4,
    recovered: 7,
    trend: 'up',
    trendPercentage: '+28% outbreak alert',
    severity: 'Critical',
    epidemicTimeline: [
      { day: '11 Sep', cases: 8 },
      { day: '12 Sep', cases: 9 },
      { day: '13 Sep', cases: 11 },
      { day: '14 Sep', cases: 12 },
      { day: '15 Sep', cases: 15 },
      { day: '16 Sep', cases: 17 },
      { day: '17 Sep', cases: 19 },
      { day: '18 Sep', cases: 21 },
      { day: '19 Sep', cases: 23 },
      { day: '20 Sep', cases: 25 },
      { day: '21 Sep', cases: 26 },
      { day: '22 Sep', cases: 27 },
      { day: '23 Sep', cases: 28 },
      { day: '24 Sep', cases: 29 },
    ],
  },
  {
    id: 'lsd',
    name: 'Lumpy Skin Disease',
    hindiName: 'लंपी स्किन डिसीज (LSD)',
    scientificName: 'Capripoxvirus (Neethling strain)',
    activeCases: 22,
    newToday: 3,
    recovered: 11,
    trend: 'stable',
    trendPercentage: '+2% under containment',
    severity: 'High',
    epidemicTimeline: [
      { day: '11 Sep', cases: 18 },
      { day: '12 Sep', cases: 19 },
      { day: '13 Sep', cases: 21 },
      { day: '14 Sep', cases: 22 },
      { day: '15 Sep', cases: 20 },
      { day: '16 Sep', cases: 22 },
      { day: '17 Sep', cases: 23 },
      { day: '18 Sep', cases: 21 },
      { day: '19 Sep', cases: 22 },
      { day: '20 Sep', cases: 21 },
      { day: '21 Sep', cases: 23 },
      { day: '22 Sep', cases: 22 },
      { day: '23 Sep', cases: 21 },
      { day: '24 Sep', cases: 22 },
    ],
  },
  {
    id: 'heat_stress',
    name: 'Bovine Heat Stress & Acidosis',
    hindiName: 'गर्मी का तनाव / लू लगना',
    scientificName: 'Thermal Humidity Index > 78 pyrexia / tachypnea',
    activeCases: 38,
    newToday: 8,
    recovered: 24,
    trend: 'up',
    trendPercentage: '+19% humidity spike',
    severity: 'Moderate',
    epidemicTimeline: [
      { day: '11 Sep', cases: 22 },
      { day: '12 Sep', cases: 24 },
      { day: '13 Sep', cases: 25 },
      { day: '14 Sep', cases: 28 },
      { day: '15 Sep', cases: 30 },
      { day: '16 Sep', cases: 29 },
      { day: '17 Sep', cases: 32 },
      { day: '18 Sep', cases: 35 },
      { day: '19 Sep', cases: 34 },
      { day: '20 Sep', cases: 36 },
      { day: '21 Sep', cases: 37 },
      { day: '22 Sep', cases: 36 },
      { day: '23 Sep', cases: 37 },
      { day: '24 Sep', cases: 38 },
    ],
  },
];

// Vaccination Coverage Data
export const mockVaccinationCoverage: VaccinationCoverageItem[] = [
  {
    id: 'fmd-cov',
    diseaseName: 'Foot and Mouth Disease (FMD)',
    targetPopulation: 6110,
    vaccinated: 5410,
    due: 480,
    missed: 220,
    completionPercentage: 88.5,
    coldChainAudit: 'Raksha-Ovac (2°C-8°C verified)',
    nextDriveDate: '05 Oct 2026',
  },
  {
    id: 'brucellosis-cov',
    diseaseName: 'Brucellosis (Bruvax-S19 Calves)',
    targetPopulation: 2240,
    vaccinated: 2060,
    due: 120,
    missed: 60,
    completionPercentage: 92.0,
    coldChainAudit: 'Livestock Department verified batch',
    nextDriveDate: '18 Oct 2026',
  },
  {
    id: 'lsd-cov',
    diseaseName: 'Lumpy Skin Disease (Goat Pox Heterologous)',
    targetPopulation: 6110,
    vaccinated: 5120,
    due: 710,
    missed: 280,
    completionPercentage: 83.8,
    coldChainAudit: 'NADCP Ring-Immunity Drive verified',
    nextDriveDate: '02 Oct 2026',
  },
];

// Heat Stress Monitoring
export const mockHeatStressData = {
  todayThi: 78.4,
  status: 'Moderate to High Stress',
  highRiskVillages: ['Assandh (THI 82)', 'Gharaunda (THI 79)', 'Karnal Central (THI 78)'],
  estimatedMilkLossDaily: '1,420 Litres district-wide',
  estimatedFinancialLoss: '₹71,000 / day',
  temperature14Days: [
    { date: '11 Sep', temp: 31, thi: 72 },
    { date: '12 Sep', temp: 32, thi: 73 },
    { date: '13 Sep', temp: 32, thi: 74 },
    { date: '14 Sep', temp: 33, thi: 75 },
    { date: '15 Sep', temp: 34, thi: 77 },
    { date: '16 Sep', temp: 34, thi: 76 },
    { date: '17 Sep', temp: 35, thi: 78 },
    { date: '18 Sep', temp: 36, thi: 80 },
    { date: '19 Sep', temp: 36, thi: 79 },
    { date: '20 Sep', temp: 37, thi: 81 },
    { date: '21 Sep', temp: 37, thi: 82 },
    { date: '22 Sep', temp: 36, thi: 80 },
    { date: '23 Sep', temp: 35, thi: 79 },
    { date: '24 Sep', temp: 35, thi: 78 },
  ],
};

// District Analytics Data
export const mockDistrictAnalytics = {
  diseaseDistribution: [
    { name: 'Mastitis', percentage: 32, cases: 42, color: '#F59E0B' },
    { name: 'Heat Stress', percentage: 29, cases: 38, color: '#EF4444' },
    { name: 'FMD', percentage: 22, cases: 29, color: '#DC2626' },
    { name: 'LSD', percentage: 17, cases: 22, color: '#8B5CF6' },
  ],
  breedDistribution: [
    { breed: 'Murrah Buffalo', count: 2450, percentage: 40.1, yieldAvg: '14.2 L' },
    { breed: 'HF Cross', count: 1820, percentage: 29.8, yieldAvg: '16.5 L' },
    { breed: 'Gir', count: 1040, percentage: 17.0, yieldAvg: '12.4 L' },
    { breed: 'Sahiwal', count: 800, percentage: 13.1, yieldAvg: '10.8 L' },
  ],
  monthlyProductionTrend: [
    { month: 'Apr', yieldKiloLiters: 1120 },
    { month: 'May', yieldKiloLiters: 1190 },
    { month: 'Jun', yieldKiloLiters: 1080 },
    { month: 'Jul', yieldKiloLiters: 1040 },
    { month: 'Aug', yieldKiloLiters: 1150 },
    { month: 'Sep', yieldKiloLiters: 1110 },
  ],
  referralVolumeByVillage: [
    { village: 'Karnal Central', referrals: 48, rate: 'High' },
    { village: 'Assandh', referrals: 36, rate: 'Outbreak' },
    { village: 'Gharaunda', referrals: 24, rate: 'Medium' },
    { village: 'Nilokheri', referrals: 18, rate: 'Medium' },
    { village: 'Taraori', referrals: 7, rate: 'Low' },
    { village: 'Indri', referrals: 5, rate: 'Low' },
  ],
};

// Resource Allocation Table Data
export const mockResourceAllocation: VillageResourceRow[] = [
  {
    village: 'Karnal Central',
    activeCases: 34,
    paraVets: 4,
    requiredVisits: 18,
    priority: 'Critical',
    ambulanceDispatched: true,
  },
  {
    village: 'Assandh',
    activeCases: 28,
    paraVets: 2,
    requiredVisits: 14,
    priority: 'Critical',
    ambulanceDispatched: true,
  },
  {
    village: 'Gharaunda',
    activeCases: 19,
    paraVets: 2,
    requiredVisits: 10,
    priority: 'High',
    ambulanceDispatched: false,
  },
  {
    village: 'Nilokheri',
    activeCases: 14,
    paraVets: 3,
    requiredVisits: 8,
    priority: 'Medium',
    ambulanceDispatched: false,
  },
  {
    village: 'Taraori',
    activeCases: 5,
    paraVets: 2,
    requiredVisits: 3,
    priority: 'Low',
    ambulanceDispatched: false,
  },
  {
    village: 'Indri',
    activeCases: 3,
    paraVets: 2,
    requiredVisits: 2,
    priority: 'Low',
    ambulanceDispatched: false,
  },
];

// Mock Downloadable Reports
export const mockDistrictReports: DistrictReportCard[] = [
  {
    id: 'rep-sep-2026',
    title: 'September District Animal Health & Triage Audit',
    subtitle: 'Comprehensive morbidity, early-detection yield recovery and para-vet triage response audit',
    period: '01 Sep – 26 Sep 2026',
    generatedDate: 'Today, 06:00 AM',
    fileSize: '3.4 MB (PDF)',
    summaryMetrics: [
      { label: 'Total Animals Screened', value: '6,110' },
      { label: 'Outbreak Containment', value: '94.2%' },
      { label: 'Average Triage Latency', value: '42 mins' },
    ],
    status: 'Ready',
    category: 'Epidemiology',
  },
  {
    id: 'rep-nadcp-vax',
    title: 'NADCP National Vaccination Coverage Audit',
    subtitle: 'Verification of cold chain maintenance, lot batches and missed bovine immunization tracking',
    period: 'Quarter 3 (Jul – Sep 2026)',
    generatedDate: '24 Sep 2026',
    fileSize: '2.8 MB (PDF)',
    summaryMetrics: [
      { label: 'FMD Immunized', value: '88.5%' },
      { label: 'Brucellosis Coverage', value: '92.0%' },
      { label: 'Pending Doses', value: '1,310' },
    ],
    status: 'Ready',
    category: 'NADCP',
  },
  {
    id: 'rep-fmd-outbreak',
    title: 'Assandh & Karnal FMD Ring-Containment Flash Report',
    subtitle: 'Emergency field dispatch assessment: quarantine zoning, potassium permanganate distribution and ring boosters',
    period: '20 Sep – 26 Sep 2026',
    generatedDate: 'Today, 07:15 AM',
    fileSize: '1.9 MB (PDF)',
    summaryMetrics: [
      { label: 'Quarantine Radius', value: '5.0 km' },
      { label: 'Ambulance Units Active', value: '3 Units' },
      { label: 'Secondary Spread Risk', value: 'Contained' },
    ],
    status: 'Ready',
    category: 'Emergency',
  },
];
