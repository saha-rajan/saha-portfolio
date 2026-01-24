import svgPaths from "./svg-oib4itnfxn";
import clsx from "clsx";
type Wrapper1Props = {
  additionalClassNames?: string;
};

function Wrapper1({ children, additionalClassNames = "" }: React.PropsWithChildren<Wrapper1Props>) {
  return (
    <div className={clsx("bg-[rgba(186,214,212,0.1)] h-[218px] relative rounded-[24px] shrink-0", additionalClassNames)}>
      <div className="overflow-clip relative rounded-[inherit] size-full">{children}</div>
      <div aria-hidden="true" className="absolute border border-[#bad6d4] border-solid inset-0 pointer-events-none rounded-[24px]" />
    </div>
  );
}
type WrapperProps = {
  additionalClassNames?: string;
};

function Wrapper({ children, additionalClassNames = "" }: React.PropsWithChildren<WrapperProps>) {
  return (
    <div className={clsx("absolute size-[24px] top-[18px]", additionalClassNames)}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        {children}
      </svg>
    </div>
  );
}

function Info() {
  return (
    <Wrapper additionalClassNames="left-[14px]">
      <g id="Info">
        <path d={svgPaths.p1b0e4e80} fill="var(--fill-0, #114559)" id="Vector" />
      </g>
    </Wrapper>
  );
}

function Frame() {
  return (
    <Wrapper1 additionalClassNames="w-[343px]">
      <p className="absolute font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[normal] left-[46px] text-[#114559] text-[20px] top-[18px] w-[205px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Information overload
      </p>
      <p className="absolute font-['SF_Pro:Medium',sans-serif] font-[510] leading-[1.6] left-[20.5px] text-[#5d5d5d] text-[18px] top-[140px] w-[306px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Printed materials are overwhelming and not tailored to treatment type.
      </p>
      <Info />
    </Wrapper1>
  );
}

function FaceAnxiousSweatRegularFull() {
  return (
    <Wrapper additionalClassNames="left-[21px]">
      <g id="face-anxious-sweat-regular-full">
        <path d={svgPaths.p1e0fd300} fill="var(--fill-0, #114559)" id="Vector" />
      </g>
    </Wrapper>
  );
}

function Frame1() {
  return (
    <Wrapper1 additionalClassNames="w-[343px]">
      <p className="absolute font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[normal] left-[53px] text-[#114559] text-[20px] top-[18px] w-[205px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        24/7 Anxiety
      </p>
      <p className="absolute font-['SF_Pro:Medium',sans-serif] font-[510] leading-[1.6] left-[21.5px] text-[#5d5d5d] text-[18px] top-[139px] w-[296px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Questions arise late at night when help isn’t available.
      </p>
      <FaceAnxiousSweatRegularFull />
    </Wrapper1>
  );
}

function FaceAnguishedRegularFull() {
  return (
    <Wrapper additionalClassNames="left-[21px]">
      <g id="face-anguished-regular-full">
        <path d={svgPaths.p2784b500} fill="var(--fill-0, #114559)" id="Vector" />
      </g>
    </Wrapper>
  );
}

function Frame3() {
  return (
    <Wrapper1 additionalClassNames="w-[343px]">
      <p className="absolute font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[normal] left-[53px] text-[#114559] text-[20px] top-[18px] w-[205px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Symptom confusion
      </p>
      <p className="absolute font-['SF_Pro:Medium',sans-serif] font-[510] leading-[1.6] left-[21.5px] text-[#5d5d5d] text-[18px] top-[141px] w-[308px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Patients can’t easily tell what’s “normal” versus dangerous.
      </p>
      <FaceAnguishedRegularFull />
    </Wrapper1>
  );
}

function ArrowsLeftRightToLineRegularFull() {
  return (
    <Wrapper additionalClassNames="left-[21.5px]">
      <g id="arrows-left-right-to-line-regular-full">
        <path d={svgPaths.p2da18680} fill="var(--fill-0, #114559)" id="Vector" />
      </g>
    </Wrapper>
  );
}

function Frame4() {
  return (
    <Wrapper1 additionalClassNames="w-[520px]">
      <p className="absolute font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[normal] left-[53.5px] text-[#114559] text-[20px] top-[18px] w-[205px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Caregiver gaps
      </p>
      <p className="absolute font-['SF_Pro:Medium',sans-serif] font-[510] leading-[1.6] left-[21.5px] text-[#5d5d5d] text-[18px] top-[139px] w-[504px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Family members lack structured ways to support or monitor progress.
      </p>
      <ArrowsLeftRightToLineRegularFull />
    </Wrapper1>
  );
}

function ChartSimpleSolidFull() {
  return (
    <Wrapper additionalClassNames="left-[21.5px]">
      <g id="chart-simple-solid-full">
        <path d={svgPaths.p1e8b9880} id="Vector" stroke="var(--stroke-0, #114559)" strokeWidth="1.5" />
      </g>
    </Wrapper>
  );
}

function Frame2() {
  return (
    <Wrapper1 additionalClassNames="w-[537px]">
      <p className="absolute font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[normal] left-[53.5px] text-[#114559] text-[20px] top-[18px] w-[205px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Complex logistics
      </p>
      <p className="absolute font-['SF_Pro:Medium',sans-serif] font-[510] leading-[1.6] left-[21.5px] text-[#5d5d5d] text-[18px] top-[138px] w-[520px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Appointments, medications, and diets are scattered across platforms.
      </p>
      <ChartSimpleSolidFull />
    </Wrapper1>
  );
}

function Frame5() {
  return (
    <div className="content-start flex flex-wrap gap-[29px_26px] items-start justify-center relative shrink-0 w-full">
      <Frame />
      <Frame1 />
      <Frame3 />
      <Frame4 />
      <Frame2 />
    </div>
  );
}

export default function Frame6() {
  return (
    <div className="content-stretch flex flex-col items-start relative size-full">
      <Frame5 />
    </div>
  );
}