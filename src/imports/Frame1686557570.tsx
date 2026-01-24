import image_1fe6da1fb24e994dedf5f88213c048966d32519a from 'figma:asset/1fe6da1fb24e994dedf5f88213c048966d32519a.png';
import image_68eb3e4689690c387ac6a58fcb7b5cb95e117395 from 'figma:asset/68eb3e4689690c387ac6a58fcb7b5cb95e117395.png';
import literatureReviewImage from "figma:asset/e9f2d17049abb93ceab92371fb42a3e467599da1.png";

function Frame() {
  return (
    <div className="absolute h-[532px] left-[calc(50%+0.5px)] rounded-[24px] top-[calc(50%+0.5px)] translate-x-[-50%] translate-y-[-50%] w-[941px]">
      <img src={image_1fe6da1fb24e994dedf5f88213c048966d32519a} alt="Literature review research papers spreadsheet" className="absolute max-w-none object-cover rounded-[24px] size-full" />
    </div>
  );
}

export default function Frame1() {
  return (
    <div className="bg-gradient-to-b from-[rgba(93,93,93,0.18)] overflow-visible relative rounded-[24px] w-full h-full to-[rgba(93,93,93,0.72)] group">
      <Frame />
      <p className="absolute font-['IBM_Plex_Mono:Bold',sans-serif] leading-[1.6] left-[798px] not-italic text-[16px] text-nowrap text-white top-[611px] opacity-0 group-hover:opacity-100 transition-opacity duration-300">Literature review data</p>
    </div>
  );
}