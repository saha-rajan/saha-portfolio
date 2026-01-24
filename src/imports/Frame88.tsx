import svgPaths from "./svg-ygs9xxoe9w";

function Wrapper1({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="relative shrink-0 size-[24px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        {children}
      </svg>
    </div>
  );
}

function Wrapper({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="bg-[#121217] relative rounded-[8px] shrink-0 w-full">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start px-[16px] py-[33px] relative w-full">{children}</div>
      </div>
    </div>
  );
}

function Brightness() {
  return (
    <Wrapper1>
      <g id="brightness_1">
        <mask height="24" id="mask0_26_516" maskUnits="userSpaceOnUse" style={{ maskType: "alpha" }} width="24" x="0" y="0">
          <rect fill="var(--fill-0, #D9D9D9)" height="24" id="Bounding box" width="24" />
        </mask>
        <g mask="url(#mask0_26_516)">
          <path d={svgPaths.p1ee5e230} fill="var(--fill-0, white)" id="brightness_1_2" />
        </g>
      </g>
    </Wrapper1>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0">
      <Brightness />
      <p className="font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[20px] text-nowrap text-white">CONTEXT</p>
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex flex-col gap-[40px] items-start relative shrink-0 w-[632px]">
      <Frame />
      <p className="bg-clip-text bg-gradient-to-l font-['Inter:Medium',sans-serif] font-medium from-[#ffffff] leading-[normal] min-w-full not-italic relative shrink-0 text-[36px] to-[#999999] w-[min-content]" style={{ WebkitTextFillColor: "transparent" }}>
        The Enterprise Cybersecurity Reality
      </p>
    </div>
  );
}

function ArrowSplit() {
  return (
    <Wrapper1>
      <g id="arrow_split">
        <mask height="24" id="mask0_26_512" maskUnits="userSpaceOnUse" style={{ maskType: "alpha" }} width="24" x="0" y="0">
          <rect fill="var(--fill-0, #D9D9D9)" height="24" id="Bounding box" width="24" />
        </mask>
        <g mask="url(#mask0_26_512)">
          <g id="arrow_split_2">
            <path d={svgPaths.p26aee400} fill="var(--fill-0, #6FFF00)" />
            <path d={svgPaths.p26aee400} fill="var(--fill-1, black)" fillOpacity="0.2" />
          </g>
        </g>
      </g>
    </Wrapper1>
  );
}

function Frame12() {
  return (
    <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full">
      <ArrowSplit />
      <p className="font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[20px] text-nowrap text-white">High-Stakes Decisions:</p>
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] h-[111px] items-start relative shrink-0 w-full">
      <Frame12 />
      <p className="basis-0 font-['Inter:Medium',sans-serif] font-medium grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#a7a7a7] text-[20px] w-full">Security teams monitor hundreds to thousands of events daily, where even small delays in response can result in major vulnerabilities.</p>
    </div>
  );
}

function Frame1() {
  return (
    <Wrapper>
      <Frame2 />
    </Wrapper>
  );
}

function Automation() {
  return (
    <Wrapper1>
      <g id="automation">
        <mask height="24" id="mask0_26_504" maskUnits="userSpaceOnUse" style={{ maskType: "alpha" }} width="24" x="0" y="0">
          <rect fill="var(--fill-0, #D9D9D9)" height="24" id="Bounding box" width="24" />
        </mask>
        <g mask="url(#mask0_26_504)">
          <g id="automation_2">
            <path d={svgPaths.p182a5400} fill="var(--fill-0, #6FFF00)" />
            <path d={svgPaths.p182a5400} fill="var(--fill-1, black)" fillOpacity="0.2" />
          </g>
        </g>
      </g>
    </Wrapper1>
  );
}

function Frame13() {
  return (
    <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full">
      <Automation />
      <p className="font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[20px] text-nowrap text-white">Untapped Efficiency Opportunity</p>
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
      <Frame13 />
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#a7a7a7] text-[20px] w-full">Existing dashboards lacked consolidated views and prioritization, forcing teams to manually interpret data across tools, slowing response and creating potential risk exposure.</p>
    </div>
  );
}

function Frame5() {
  return (
    <Wrapper>
      <Frame4 />
    </Wrapper>
  );
}

function BookmarkStacks() {
  return (
    <Wrapper1>
      <g id="bookmark_stacks">
        <mask height="24" id="mask0_26_508" maskUnits="userSpaceOnUse" style={{ maskType: "alpha" }} width="24" x="0" y="0">
          <rect fill="var(--fill-0, #D9D9D9)" height="24" id="Bounding box" width="24" />
        </mask>
        <g mask="url(#mask0_26_508)">
          <g id="bookmark_stacks_2">
            <path d={svgPaths.p12990400} fill="var(--fill-0, #6FFF00)" />
            <path d={svgPaths.p12990400} fill="var(--fill-1, black)" fillOpacity="0.2" />
          </g>
        </g>
      </g>
    </Wrapper1>
  );
}

function Frame14() {
  return (
    <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full">
      <BookmarkStacks />
      <p className="font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[20px] text-nowrap text-white">Impact of Fragmentation</p>
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
      <Frame14 />
      <div className="font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#a7a7a7] text-[20px] w-full">
        <p className="mb-0">{`	•	Teams spent 30–45 minutes per shift just reviewing alerts.`}</p>
        <p className="mb-0">{`	•	Multiple tools had to be checked to understand system health.`}</p>
        <p>{`	•	Critical alerts were missed or delayed in ~25% of cases.`}</p>
      </div>
    </div>
  );
}

function Frame3() {
  return (
    <Wrapper>
      <Frame6 />
    </Wrapper>
  );
}

function Frame11() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
      <Frame1 />
      <Frame5 />
      <Frame3 />
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex flex-col gap-[64px] items-start relative shrink-0 w-[582px]">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#a7a7a7] text-[20px] w-full">Organizations face increasingly complex cybersecurity challenges, managing multiple endpoints, cloud systems, and threat vectors simultaneously. Traditional tools often overwhelm teams with fragmented dashboards and scattered alerts.</p>
      <Frame11 />
    </div>
  );
}

function Frame9() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[20px] text-nowrap text-white">Key Market Context</p>
      <Frame8 />
    </div>
  );
}

export default function Frame10() {
  return (
    <div className="content-stretch flex flex-col gap-[86px] items-start relative size-full">
      <Frame7 />
      <Frame9 />
    </div>
  );
}