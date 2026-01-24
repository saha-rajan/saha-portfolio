export default function Grid() {
  return (
    <div className="w-full max-w-[1200px] h-full flex justify-between px-8 md:px-16 lg:px-24" data-name="Grid">
      {/* Desktop: 7 columns - double lines for middle, single for first/last */}
      <div className="hidden lg:flex w-full h-full justify-between">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="flex gap-[16px]">
            {i === 0 || i === 6 ? (
              // First and last: single line
              <div className="h-full bg-[#1D1D1D]" style={{ width: '0.4px' }} />
            ) : (
              // Middle: double lines
              <>
                <div className="h-full bg-[#1D1D1D]" style={{ width: '0.4px' }} />
                <div className="h-full bg-[#1D1D1D]" style={{ width: '0.4px' }} />
              </>
            )}
          </div>
        ))}
      </div>
      
      {/* Tablet: 4 columns - double lines for middle, single for first/last */}
      <div className="hidden md:flex lg:hidden w-full h-full justify-between">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex gap-[16px]">
            {i === 0 || i === 3 ? (
              // First and last: single line
              <div className="h-full bg-[#1D1D1D]" style={{ width: '0.4px' }} />
            ) : (
              // Middle: double lines
              <>
                <div className="h-full bg-[#1D1D1D]" style={{ width: '0.4px' }} />
                <div className="h-full bg-[#1D1D1D]" style={{ width: '0.4px' }} />
              </>
            )}
          </div>
        ))}
      </div>
      
      {/* Mobile: 2 columns - all single lines */}
      <div className="flex md:hidden w-full h-full justify-between">
        {[...Array(2)].map((_, i) => (
          <div key={i}>
            <div className="h-full bg-[#1D1D1D]" style={{ width: '0.4px' }} />
          </div>
        ))}
      </div>
    </div>
  );
}