import React from 'react';

// Sleek dark-mode card instead of a skeuomorphic sticky note
export const InsightCard = ({ 
  color, 
  title, 
  body, 
  author = "Saha" 
}: { 
  color: string, 
  title?: string, 
  body: string, 
  author?: string 
}) => {
  // Map color names to subtle accent colors (borders or tiny text indicators)
  const colorMap: Record<string, { bg: string, border: string, text: string }> = {
    yellow: { bg: "bg-[#121217]", border: "border-[#FFD700]/20", text: "text-[#FFD700]" },
    blue:   { bg: "bg-[#121217]", border: "border-[#1CB4F5]/20", text: "text-[#1CB4F5]" },
    purple: { bg: "bg-[#121217]", border: "border-[#B175FF]/20", text: "text-[#B175FF]" },
    pink:   { bg: "bg-[#121217]", border: "border-[#FF6BA6]/20", text: "text-[#FF6BA6]" },
    green:  { bg: "bg-[#121217]", border: "border-[#00E599]/20", text: "text-[#00E599]" },
  };
  
  const style = colorMap[color] || colorMap.blue;
  
  return (
    <div className={`${style.bg} border ${style.border} p-5 rounded-xl flex flex-col min-h-[140px] hover:border-white/30 transition-colors`}>
      {title && <div className={`font-['IBM_Plex_Mono'] text-xs tracking-widest uppercase mb-3 ${style.text}`}>{title}</div>}
      <div className="text-sm text-[#A7A7A7] font-light leading-relaxed flex-grow">{body}</div>
      <div className="text-[10px] text-[#5A5A5A] font-['IBM_Plex_Mono'] uppercase tracking-wider mt-4">{author}</div>
    </div>
  );
};

export const UserResearchArtifact = () => {
  return (
    <div className="w-full text-white mt-6">
      <div className="mb-16">
        <div className="flex items-center gap-4 mb-6">
          <h3 className="text-xl md:text-2xl font-medium tracking-tight text-white">Scenario Design</h3>
          <div className="h-[1px] bg-gradient-to-r from-white/10 to-transparent flex-grow"></div>
        </div>
        
        <p className="case-body-lg text-[#A7A7A7] mb-8 max-w-3xl">
          Working with Dr. Umar, I developed three realistic use-case scripts based on real patient journeys he had encountered.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InsightCard 
            color="yellow" 
            title="Scenario 1 / New Diagnosis"
            body="A patient just beginning chemotherapy educational" 
          />
          <InsightCard 
            color="yellow" 
            title="Scenario 2 / Mid-Treatment"
            body="A patient tracking side effects and trying to decide whether symptoms require medical attention." 
          />
          <InsightCard 
            color="yellow" 
            title="Scenario 3 / Caregiver"
            body="A family member seeking information about how to assist with medication timing and emotional reassurance." 
          />
        </div>
      </div>
      
      <div>
        <div className="flex items-center gap-4 mb-8">
          <h3 className="text-xl md:text-2xl font-medium tracking-tight text-white">Role-play Sessions</h3>
          <div className="h-[1px] bg-gradient-to-r from-white/10 to-transparent flex-grow"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InsightCard 
            color="blue" 
            body="Dr. Umar acted as both patient and caregiver in separate sessions, demonstrating likely behaviors, questions, and emotional responses." 
          />
          <InsightCard 
            color="blue" 
            body="I acted as a facilitator, prompting interactions with draft wireframes, information cards, and mock chatbot conversations to observe where confusion or anxiety arose." 
          />
          <InsightCard 
            color="blue" 
            body="Sessions were conducted as guided think-aloud activities, discussing what felt helpful, what was missing, and what could increase clarity or comfort." 
          />
        </div>
      </div>
    </div>
  );
};

export const AffinityMappingArtifact = () => {
  return (
    <div className="w-full text-white mt-6">
      
      <div className="flex flex-col gap-12">
        {/* Section 1 */}
        <div>
          <h3 className="text-lg font-medium text-white mb-6 border-l-2 border-[#FFD700] pl-4">Overwhelm & Fatigue</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <InsightCard color="yellow" body="Cognitive overload when too much information is presented at once." />
            <InsightCard color="yellow" body="Fatigue causes patients to abandon long reading materials." />
            <InsightCard color="yellow" body="Anxiety increases when educational content lacks prioritization." />
          </div>
        </div>
        
        {/* Section 2 */}
        <div>
          <h3 className="text-lg font-medium text-white mb-6 border-l-2 border-[#1CB4F5] pl-4">"Is This Normal?" - Symptom Confusion</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <InsightCard color="blue" body="Difficulty differentiating expected side-effects vs. medical emergencies." />
            <InsightCard color="blue" body="Over-reliance on unverified online sources." />
            <InsightCard color="blue" body="Stress from inconsistent advice between platforms." />
          </div>
        </div>
        
        {/* Section 3 */}
        <div>
          <h3 className="text-lg font-medium text-white mb-6 border-l-2 border-[#B175FF] pl-4">Trust & Credibility</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <InsightCard color="purple" body="Users question the credibility of health apps." />
            <InsightCard color="purple" body="AI skepticism, especially among older adults." />
            <InsightCard color="purple" body="Preference for brand-linked or clinician-reviewed sources." />
          </div>
        </div>
        
        {/* Section 4 */}
        <div>
          <h3 className="text-lg font-medium text-white mb-6 border-l-2 border-[#FF6BA6] pl-4">Caregiver "Invisible Workload"</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <InsightCard color="pink" body="Caregivers juggle logistics with little formal guidance." />
            <InsightCard color="pink" body="Emotional labor remains unacknowledged." />
            <InsightCard color="pink" body="No structured digital channel to share updates or reminders." />
          </div>
        </div>
        
        {/* Section 5 */}
        <div>
          <h3 className="text-lg font-medium text-white mb-6 border-l-2 border-[#00E599] pl-4">Tech Comfort & Accessibility</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <InsightCard color="green" body="Varying digital literacy levels among patients and caregivers." />
            <InsightCard color="green" body="Preference for large fonts, voice interfaces, or familiar platforms." />
            <InsightCard color="green" body="Accessibility needs heightened by fatigue or neuropathy." />
          </div>
        </div>
      </div>
      
    </div>
  );
};
