function Frame() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start not-italic relative shrink-0 text-[20px] w-full">
      <p className="font-['Inter:Bold',sans-serif] font-bold leading-[normal] relative shrink-0 text-white w-full">My Role</p>
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[normal] relative shrink-0 text-[#a7a7a7] w-full">{`UI/UX Designer & Researcher`}</p>
      <div className="font-['Inter:Medium',sans-serif] font-medium leading-[normal] relative shrink-0 text-[#a7a7a7] w-full">
        <p className="mb-0">Handled end-to-end design, from research and wireframes to interface design, usability testing, and design iterations.</p>
        <p className="text-[20px]">&nbsp;</p>
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start not-italic relative shrink-0 text-[20px] w-full">
      <p className="font-['Inter:Bold',sans-serif] font-bold leading-[normal] relative shrink-0 text-white w-full">{`Team & Collaboration`}</p>
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[normal] relative shrink-0 text-[#a7a7a7] w-full">
        <span className="font-['Inter:Bold',sans-serif] font-bold not-italic text-white">Team:</span>
        <span className="font-['Inter:Bold',sans-serif] font-bold not-italic"> </span>
        <span>{`Harish (Design Lead), Saha (Research, UI & Interaction Design), Sathish (Developer), Sathesh (Designer)`}</span>
      </p>
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[normal] relative shrink-0 text-[#a7a7a7] w-full">
        <span className="font-['Inter:Bold',sans-serif] font-bold not-italic text-white">Stakeholders:</span>
        <span className="font-['Inter:Bold',sans-serif] font-bold not-italic"> </span>Product Manager, Engineering Lead, Researcher, Marketing Manager, Customer Support, Executive Sponsor
      </p>
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[normal] relative shrink-0 text-[#a7a7a7] w-full">
        <span className="font-['Inter:Bold',sans-serif] font-bold not-italic text-white">Collaboration:</span>
        <span>{` Weekly standups, cybersecurity review sessions, user research interviews, data visualization workshops, usability testing reviews, design–engineering handoff meetings`}</span>
      </p>
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start leading-[normal] not-italic relative shrink-0 text-[20px] w-full">
      <p className="font-['Inter:Bold',sans-serif] font-bold relative shrink-0 text-white w-full">Timeline</p>
      <p className="font-['Inter:Medium',sans-serif] font-medium relative shrink-0 text-[#a7a7a7] w-full">3 months (from initial research to final prototype)</p>
    </div>
  );
}

export default function Frame3() {
  return (
    <div className="content-stretch flex flex-col gap-[64px] items-start relative size-full">
      <Frame />
      <Frame1 />
      <Frame2 />
    </div>
  );
}