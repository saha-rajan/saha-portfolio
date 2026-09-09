import React from 'react';

export const StickyNote = ({ color, title, body, author = "Deepika" }: { color: string, title?: string, body: string, author?: string }) => {
  const colorMap: Record<string, string> = {
    yellow: "bg-[#FFE79A] text-[#4A3B00]",
    blue: "bg-[#A7D8FF] text-[#003B6D]",
    purple: "bg-[#D3B8FF] text-[#2D006D]",
    pink: "bg-[#FFAEE3] text-[#6D004B]",
    green: "bg-[#B4F0B8] text-[#004D07]",
  };
  
  return (
    <div className={`${colorMap[color]} p-4 md:p-6 shadow-sm flex flex-col min-h-[160px] aspect-square`}>
      {title && <div className="font-semibold text-sm mb-2">{title}</div>}
      <div className="text-xs md:text-sm font-medium leading-relaxed flex-grow">{body}</div>
      <div className="text-[10px] opacity-50 mt-4">{author}</div>
    </div>
  );
};

export const UserResearchArtifact = () => {
  return (
    <div className="bg-white rounded-2xl p-8 md:p-12 w-full text-black">
      <div className="mb-12">
        <h3 className="font-['Caveat'] text-2xl md:text-3xl font-bold mb-4">Scenario Design</h3>
        <p className="font-mono text-xs md:text-sm font-semibold mb-8 max-w-3xl leading-relaxed">
          Working with Dr. Umar, I developed three realistic use-case scripts based on real patient journeys he had encountered
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono">
          <StickyNote 
            color="yellow" 
            title="Scenario 1"
            body="New Diagnosis: A patient just beginning chemotherapy educational" 
          />
          <StickyNote 
            color="yellow" 
            title="Scenario 2"
            body="Mid-Treatment Management: A patient tracking side effects and trying to decide whether symptoms require medical attention." 
          />
          <StickyNote 
            color="yellow" 
            title="Scenario 3"
            body="Caregiver Communication: A family member seeking information about how to assist with medication timing and emotional reassurance." 
          />
        </div>
      </div>
      
      <div>
        <h3 className="font-['Caveat'] text-2xl md:text-3xl font-bold mb-8">Role-play Sessions</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono">
          <StickyNote 
            color="blue" 
            body="Dr. Umar acted as both patient and caregiver in separate sessions, demonstrating likely behaviors, questions, and emotional responses." 
          />
          <StickyNote 
            color="blue" 
            body="I acted as a facilitator, prompting interactions with draft wireframes, information cards, and mock chatbot conversations to observe where confusion or anxiety arose." 
          />
          <StickyNote 
            color="blue" 
            body="Sessions were conducted as guided think-aloud activities, discussing what felt helpful, what was missing, and what could increase clarity or comfort." 
          />
        </div>
      </div>
      
      <div className="mt-8 text-right font-mono font-bold text-gray-400">User Research</div>
    </div>
  );
};

export const AffinityMappingArtifact = () => {
  return (
    <div className="bg-white rounded-2xl p-8 md:p-12 w-full text-black">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
        {/* Section 1 */}
        <div>
          <h3 className="font-['Caveat'] text-xl font-bold mb-4">Overwhelm & Fatigue</h3>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 font-mono">
            <StickyNote color="yellow" body="Cognitive overload when too much information is presented at once." />
            <StickyNote color="yellow" body="Fatigue causes patients to abandon long reading materials." />
            <StickyNote color="yellow" body="Anxiety increases when educational content lacks prioritization." />
          </div>
        </div>
        
        {/* Section 2 */}
        <div>
          <h3 className="font-['Caveat'] text-xl font-bold mb-4">"Is This Normal?" - Symptom Confusion</h3>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 font-mono">
            <StickyNote color="blue" body="Difficulty differentiating expected side-effects vs. medical emergencies." />
            <StickyNote color="blue" body="Over-reliance on unverified online sources." />
            <StickyNote color="blue" body="Stress from inconsistent advice between platforms." />
          </div>
        </div>
        
        {/* Section 3 */}
        <div>
          <h3 className="font-['Caveat'] text-xl font-bold mb-4">Trust & Credibility</h3>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 font-mono">
            <StickyNote color="purple" body="Users question the credibility of health apps." />
            <StickyNote color="purple" body="AI skepticism, especially among older adults." />
            <StickyNote color="purple" body="Preference for brand-linked or clinician-reviewed sources." />
          </div>
        </div>
        
        {/* Section 4 */}
        <div>
          <h3 className="font-['Caveat'] text-xl font-bold mb-4">Caregiver "Invisible Workload"</h3>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 font-mono">
            <StickyNote color="pink" body="Caregivers juggle logistics with little formal guidance." />
            <StickyNote color="pink" body="Emotional labor remains unacknowledged." />
            <StickyNote color="pink" body="No structured digital channel to share updates or reminders." />
          </div>
        </div>
        
        {/* Section 5 (Centered span) */}
        <div className="md:col-span-2 flex flex-col items-center">
          <h3 className="font-['Caveat'] text-xl font-bold mb-4 text-left w-full max-w-3xl">Tech Comfort & Accessibility</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono w-full max-w-3xl">
            <StickyNote color="green" body="Varying digital literacy levels among patients and caregivers." />
            <StickyNote color="green" body="Preference for large fonts, voice interfaces, or familiar platforms." />
            <StickyNote color="green" body="Accessibility needs heightened by fatigue or neuropathy." />
          </div>
        </div>
      </div>
      
      <div className="mt-8 text-right font-mono font-bold text-gray-400">Affinity mapping</div>
    </div>
  );
};
