import React from 'react';

export const Background: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-black">
      {/* Dark Red Vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-red-950 via-black to-black opacity-90"></div>
      
      {/* Grain texture simulation */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>

      {/* Floating Cash Effect (CSS Animation) */}
      <div className="absolute inset-0 pointer-events-none">
         {/* We can create a few floating elements if desired, but keeping it clean is better for readability */}
         <div className="absolute top-[-50px] left-[10%] w-12 h-20 bg-green-800/20 blur-sm rotate-12 animate-float-slow"></div>
         <div className="absolute top-[-50px] right-[20%] w-12 h-20 bg-green-800/20 blur-sm -rotate-45 animate-float-medium"></div>
      </div>
    </div>
  );
};