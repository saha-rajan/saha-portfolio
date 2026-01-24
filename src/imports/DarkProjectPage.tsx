import svgPaths from "./svg-1iwjb431vx";
import clsx from "clsx";
type TextProps = {
  text: string;
  additionalClassNames?: string;
};

function Text({ text, additionalClassNames = "" }: TextProps) {
  return (
    <div className={clsx("absolute bg-[#121217] left-[129px] overflow-clip rounded-[8px] w-[1187px]", additionalClassNames)}>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[29px] not-italic text-[#929292] text-[16px] text-nowrap top-[21px]">{text}</p>
    </div>
  );
}

function Frame4() {
  return (
    <div className="h-[5895px] relative shrink-0 w-[180.5px]">
      <div className="absolute inset-[0_-0.11%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 180.9 5895">
          <g id="Frame 43">
            <path d="M0.2 0V5895" id="Vector 2" stroke="var(--stroke-0, #1D1D1D)" strokeWidth="0.4" />
            <path d="M180.7 0V5895" id="Vector 3" stroke="var(--stroke-0, #1D1D1D)" strokeWidth="0.4" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Grid() {
  return (
    <div className="absolute content-stretch flex gap-[20px] items-center left-[129.5px] top-0" data-name="Grid">
      {[...Array(6).keys()].map((_, i) => (
        <Frame4 key={i} />
      ))}
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex font-['Inter:Regular',sans-serif] font-normal gap-[22px] items-center leading-[normal] not-italic relative shrink-0 text-[16px] text-nowrap text-white">
      <p className="relative shrink-0">Works</p>
      <p className="relative shrink-0">Studio</p>
      <p className="relative shrink-0">Write</p>
      <p className="relative shrink-0">Cinematics</p>
    </div>
  );
}

function Frame1() {
  return (
    <div className="bg-white content-stretch flex items-center justify-center px-[16px] py-[8px] relative rounded-[34px] shrink-0">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[16px] text-black text-nowrap">Contact</p>
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex gap-[24px] items-center relative shrink-0">
      <p className="[text-underline-position:from-font] decoration-solid font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[16px] text-nowrap text-white underline">Resume</p>
      <Frame1 />
    </div>
  );
}

function Frame() {
  return (
    <div className="absolute bg-black content-stretch flex gap-[347px] items-center justify-center left-1/2 px-[183px] py-[40px] top-0 translate-x-[-50%]">
      <div className="relative shrink-0 size-[34px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 34 34">
          <path d={svgPaths.p1bed5780} fill="var(--fill-0, white)" id="Ellipse 79" />
        </svg>
      </div>
      <Frame2 />
      <Frame8 />
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex font-['Inter:Medium',sans-serif] font-medium gap-[12px] items-center leading-[normal] not-italic relative shrink-0 text-[20px] text-nowrap text-white">
      <p className="relative shrink-0">.</p>
      <p className="relative shrink-0">LinkedIn</p>
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex font-['Inter:Medium',sans-serif] font-medium gap-[12px] items-center leading-[normal] not-italic relative shrink-0 text-[20px] text-nowrap text-white">
      <p className="relative shrink-0">.</p>
      <p className="relative shrink-0">Email</p>
    </div>
  );
}

function Frame7() {
  return (
    <div className="absolute content-stretch flex gap-[40px] items-center left-[129px] top-[839px]">
      <Frame5 />
      <Frame6 />
    </div>
  );
}

function Frame9() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[16px] items-start leading-[normal] left-[129px] not-italic top-[186px] w-[382px]">
      <p className="bg-clip-text bg-gradient-to-l font-['Inter:Bold',sans-serif] font-bold from-[#ffffff] relative shrink-0 text-[64px] to-[#999999] w-full" style={{ WebkitTextFillColor: "transparent" }}>
        Say hello!
      </p>
      <p className="font-['Inter:Regular',sans-serif] font-normal relative shrink-0 text-[16px] text-white w-full">If you’ve scrolled this far, that’s reason enough. I’m always open to feedback, ideas, or even a quick chat about design, films, or anything random.</p>
    </div>
  );
}

function Frame3() {
  return (
    <div className="absolute left-1/2 rounded-[8px] top-[700px] translate-x-[-50%] w-[1192px]">
      <div className="content-stretch flex items-center justify-center overflow-clip px-[73px] py-[16px] relative rounded-[inherit] w-full">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[14px] text-nowrap text-white">Send Email</p>
      </div>
      <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

export default function DarkProjectPage() {
  return (
    <div className="bg-black relative size-full" data-name="Dark project page">
      <Grid />
      <Frame />
      <Frame7 />
      <Frame9 />
      <p className="absolute bg-clip-text bg-gradient-to-l font-['Inter:Bold',sans-serif] font-bold from-[#ffffff] leading-[normal] left-[129px] not-italic text-[16px] text-nowrap to-[#999999] top-[389px]" style={{ WebkitTextFillColor: "transparent" }}>
        Drop me a note, I read them all ↓
      </p>
      <Text text="Email" additionalClassNames="h-[61px] top-[445px]" />
      <Text text="Message" additionalClassNames="h-[149px] top-[514px]" />
      <Frame3 />
    </div>
  );
}