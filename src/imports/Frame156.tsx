import svgPaths from "./svg-cxqqlnkn3m";

function Frame() {
  return (
    <div className="content-stretch flex font-['Inter:Medium',sans-serif] font-medium gap-[12px] items-center leading-[normal] not-italic relative shrink-0 text-[20px] text-nowrap text-white">
      <p className="relative shrink-0">.</p>
      <p className="relative shrink-0">LinkedIn</p>
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex font-['Inter:Medium',sans-serif] font-medium gap-[12px] items-center leading-[normal] not-italic relative shrink-0 text-[20px] text-nowrap text-white">
      <p className="relative shrink-0">.</p>
      <p className="relative shrink-0">Email</p>
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex gap-[40px] items-center relative shrink-0">
      <Frame />
      <Frame1 />
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full">
      <Frame2 />
      <div className="flex h-[17.421px] items-center justify-center relative shrink-0 w-[30.32px]" style={{ "--transform-inner-width": "300", "--transform-inner-height": "150" } as React.CSSProperties}>
        <div className="flex-none rotate-[90deg]">
          <div className="h-[30.32px] relative w-[17.421px]" data-name="Icon / chevron.left">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.4214 30.3204">
              <path d={svgPaths.p2d439d20} fill="var(--fill-0, white)" id="Icon / chevron.left" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame4() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[119px] p-[10px] top-[20px] w-[626px]">
      <Frame3 />
    </div>
  );
}

export default function Frame5() {
  return (
    <div className="relative size-full">
      <Frame4 />
    </div>
  );
}