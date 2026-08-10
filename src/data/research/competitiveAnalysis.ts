export interface CompetitiveProduct {
  id: string;
  appName: string;
  primaryFocus: string;
  keyFeatures: string;
  strengths: string;
  weaknesses: string;
  userRating: string;
  gapIdentified: string;
}

export const competitiveAnalysisData: CompetitiveProduct[] = [
  {
    id: 'competitor_1',
    appName: 'MyChart',
    primaryFocus: 'EHR Access & Communication',
    keyFeatures: 'Appointment scheduling, test results, secure messaging, medication lists',
    strengths: 'Strong hospital integration, comprehensive medical records access',
    weaknesses: 'Not cancer-specific, overwhelming interface, limited educational content',
    userRating: '4.2/5',
    gapIdentified: 'Lacks symptom tracking and personalized education'
  },
  {
    id: 'competitor_2',
    appName: 'Cancer.Org Mobile',
    primaryFocus: 'Cancer Information',
    keyFeatures: 'Educational articles, symptom tracking, appointment tracking, medication reminders',
    strengths: 'ASCO-backed credible content, comprehensive cancer information',
    weaknesses: 'Text-heavy, information overload, no care team integration',
    userRating: '3.8/5',
    gapIdentified: 'No real-time support or caregiver features'
  },
  {
    id: 'competitor_3',
    appName: 'Belong: Cancer Support',
    primaryFocus: 'Community & Support',
    keyFeatures: 'Peer support forums, treatment tracking, symptom logging, clinical trial matching',
    strengths: 'Strong community engagement, emotional support focus',
    weaknesses: 'Limited clinical integration, no AI assistance, privacy concerns with community',
    userRating: '4.5/5',
    gapIdentified: 'Missing personalized education and care coordination'
  },
  {
    id: 'competitor_4',
    appName: 'CancerCare',
    primaryFocus: 'Support Services & Resources',
    keyFeatures: 'Educational resources, financial assistance info, counseling services directory',
    strengths: 'Comprehensive support resources, social work focus',
    weaknesses: 'Static information, no interactive features, not tech-forward',
    userRating: '3.5/5',
    gapIdentified: 'No symptom management or treatment coordination'
  },
  {
    id: 'competitor_5',
    appName: 'MyLifeLine',
    primaryFocus: 'Caregiver Communication',
    keyFeatures: 'Updates sharing, calendar coordination, meal train, visit scheduling',
    strengths: 'Excellent caregiver coordination, reduces communication burden',
    weaknesses: 'No clinical features, no symptom tracking, not HIPAA-compliant',
    userRating: '4.0/5',
    gapIdentified: 'Completely separate from clinical care'
  },
  {
    id: 'competitor_6',
    appName: 'Wellframe',
    primaryFocus: 'Health Management',
    keyFeatures: 'Personalized care plans, daily check-ins, symptom tracking, education modules',
    strengths: 'Good personalization, proactive engagement',
    weaknesses: 'Generic (not cancer-specific), limited care team visibility',
    userRating: '4.1/5',
    gapIdentified: 'Not tailored to chemotherapy side effects'
  },
  {
    id: 'competitor_7',
    appName: 'HealthTree',
    primaryFocus: 'Disease-Specific (Multiple Myeloma)',
    keyFeatures: 'Treatment tracking, lab result trends, educational content, community',
    strengths: 'Deep disease-specific focus, data visualization',
    weaknesses: 'Limited to one cancer type, small user base',
    userRating: '4.3/5',
    gapIdentified: 'Not scalable across cancer types'
  }
];
