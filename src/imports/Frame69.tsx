import imgImage29 from "figma:asset/2c0216d374cc29beb5cc28a5e9a53bd5060abe4f.png";

export default function Frame() {
  return (
    <div className="bg-gradient-to-b from-[rgba(93,93,93,0.18)] overflow-clip relative rounded-[24px] size-full to-[rgba(93,93,93,0.72)]">
      <div className="absolute h-[480px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[710px]" data-name="image 29">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full rounded-lg" src={imgImage29} />
      </div>
      <p className="absolute font-['SF_Pro:Medium',sans-serif] font-[510] leading-[1.6] left-[923px] text-[#484848] text-[16px] text-nowrap top-[621px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Research timeline
      </p>
    </div>
  );
}