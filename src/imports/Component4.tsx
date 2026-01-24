import clsx from "clsx";
import imgIMockupIPhone13 from "figma:asset/1965a5d424e01dd455dd1ec4300e7f9ea38ae7c4.png";
import imgIMockupIPhone14 from "figma:asset/2893ead9a89805d8a10906af120dd562888c00dc.png";
import imgIMockupIPhone15 from "figma:asset/7b8165c300fea4d58bde0e973fe080399464fec7.png";
import imgIMockupIPhone16 from "figma:asset/8d758829d4d2888ac82f34ff16202e0757030178.png";
import imgIMockupIPhone17 from "figma:asset/b1ee3d4faffebc7f8331658bfae67c7304407fbe.png";
import imgIMockupIPhone18 from "figma:asset/26494fa0ad2d5db98def977291bca874483bdb9d.png";
import imgIMockupIPhone19 from "figma:asset/332043ce212addfd6db05a2fac75d0ca75c96ca4.png";
type Component4IMockupIPhoneImageProps = {
  additionalClassNames?: string;
};

function Component4IMockupIPhoneImage({ additionalClassNames = "" }: Component4IMockupIPhoneImageProps) {
  return (
    <div className={clsx("absolute h-[525px] w-[260px]", additionalClassNames)}>
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgIMockupIPhone17} />
    </div>
  );
}

export default function Component() {
  return (
    <div className="bg-gradient-to-b from-[rgba(186,214,212,0.39)] overflow-clip relative rounded-[24px] size-full to-[rgba(151,167,165,0.92)]" data-name="Component 4">
      <div className="absolute h-[526px] left-[-22px] shadow-[0px_306px_86px_0px_rgba(0,0,0,0),0px_196px_78px_0px_rgba(0,0,0,0.01),0px_110px_66px_0px_rgba(0,0,0,0.05),0px_49px_49px_0px_rgba(0,0,0,0.09),0px_12px_27px_0px_rgba(0,0,0,0.1)] top-[373px] w-[260px]" data-name="iMockup - iPhone 13">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgIMockupIPhone13} />
      </div>
      <div className="absolute h-[526px] left-[268px] shadow-[0px_199px_56px_0px_rgba(0,0,0,0),0px_127px_51px_0px_rgba(0,0,0,0.01),0px_72px_43px_0px_rgba(0,0,0,0.05),0px_32px_32px_0px_rgba(0,0,0,0.09),0px_8px_18px_0px_rgba(0,0,0,0.1)] top-[251px] w-[260px]" data-name="iMockup - iPhone 14">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgIMockupIPhone14} />
      </div>
      <div className="absolute h-[523px] left-[558px] shadow-[0px_225px_63px_0px_rgba(0,0,0,0),0px_144px_57px_0px_rgba(0,0,0,0.01),0px_81px_49px_0px_rgba(0,0,0,0.05),0px_36px_36px_0px_rgba(0,0,0,0.09),0px_9px_20px_0px_rgba(0,0,0,0.1)] top-[-178px] w-[260px]" data-name="iMockup - iPhone 15">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgIMockupIPhone15} />
      </div>
      <div className="absolute h-[524px] left-[calc(50%+435px)] shadow-[0px_208px_58px_0px_rgba(0,0,0,0),0px_133px_53px_0px_rgba(0,0,0,0.01),0px_75px_45px_0px_rgba(0,0,0,0.05),0px_33px_33px_0px_rgba(0,0,0,0.09),0px_8px_18px_0px_rgba(0,0,0,0.1)] top-[-119px] translate-x-[-50%] w-[260px]" data-name="iMockup - iPhone 16">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgIMockupIPhone16} />
      </div>
      <Component4IMockupIPhoneImage additionalClassNames="left-[268px] top-[-290px]" />
      <Component4IMockupIPhoneImage additionalClassNames="left-[848px] top-[435px]" />
      <div className="absolute h-[523px] left-[558px] top-[367px] w-[260px]" data-name="iMockup - iPhone 13">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgIMockupIPhone18} />
      </div>
      <div className="absolute h-[524px] left-[-22px] top-[-168px] w-[260px]" data-name="iMockup - iPhone 13">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgIMockupIPhone19} />
      </div>
    </div>
  );
}