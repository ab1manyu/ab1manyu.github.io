import { useState, useEffect, useLayoutEffect } from "react";

const frames = [
  //   `+-----------------------------------------------------------------------+
  `  .        *           .             .         +             *       . 
      +          .           *                    .         .      *   
  .  +-----------------------------------------------------------+  *  
 *     .       *                         *        .              .   
            ____   ____         ______          ___    ____          
   .       //  /  //  /        / ____ \\\\       //  /  //  /      *   
          //  /__//  /        / / / // /      //  /__//  /           
  *      /__________/        / / / // /      /__________/         .  
                // /         \\\\ \\\\// /             //  /             
  .            //_/           \\\\____/             //__/       .  *   
                                                                     
 +        .                >_ NOT FOUND                           .  
  *  +-----------------------------------------------------------+ .   
        .              *            .          .             +      *  
  .              *            .           +             *          . . `,
  // +-----------------------------------------------------------------------+`,

  //   `+- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -+
  `  *        .           *             *         .             .       * 
      .          *           .                    *         +      .   
  +  +-----------------------------------------------------------+  .  
 .     *       .                         .        *              *   
            ____   ____         ______          ___    ____          
   .       //  /  //  /        / ____ \\\\       //  /  //  /      *   
          //  /__//  /        / / / // /      //  /__//  /           
  +      /__________/        / / / // /      /__________/         *  
                // /         \\\\ \\\\// /             //  /             
  +            //_/           \\\\____/             //__/       .  *   
                                                                     
 +        +                >_ NOT FOUND                           .  
  .  +-----------------------------------------------------------+ *   
        .              *            +          *             .      .  
  *              .            *           .             .          * * `,
  // +- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -+`,

  //   `+-----------------------------------------------------------------------+
  `  .        +           *             .         *             +       . 
      *          .           +                    .         *      +   
  .  +- - - - - - - - - - - - - - - - - - - - - - - - - - - - - -+  +  
 +     +       *                         +        .              .   
            ____   ____         ______          ___    ____          
   +       //  /  //  /        / ____ \\\\       //  /  //  /      .   
          //  /__//  /        / / / // /      //  /__//  /           
  *      /__________/        / / / // /      /__________/         +  
                // /         \\\\ \\\\// /             //  /             
  .            //_/           \\\\____/             //__/       .  .   
                                                                     
 +        +                >_ NOT FOUND                           +  
  .  +- - - - - - - - - - - - - - - - - - - - - - - - - - - - - -+ +   
        +              .            *          .             *      *  
  +              *            .           +             *          . . `,
  // +-----------------------------------------------------------------------+`,
];

export default function NotFound() {
  const [frameIndex, setFrameIndex] = useState(0);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % frames.length);
    }, 550);

    return () => clearInterval(timer);
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center px-4 pt-16 pb-12 relative z-10 select-none">
      <div className="glass-panel p-4 sm:p-8 flex flex-col items-center justify-center max-w-3xl w-full border border-defense-border hover:border-defense-accent transition-colors">
        {/* 3D 404 ASCII Space Frame */}
        <div className="w-full overflow-x-auto flex justify-center py-2">
          <pre className="font-mono text-[9px] xs:text-[10px] sm:text-xs md:text-sm text-defense-accent leading-tight sm:leading-normal whitespace-pre text-left">
            {frames[frameIndex]}
          </pre>
        </div>
      </div>
    </main>
  );
}
