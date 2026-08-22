import AcademiaBlock from "./AcademiaBlock";

export default function SkillsSection() {
  return (
    <section id="skills" className="mb-24 scroll-mt-28">
      <div className="flex justify-between items-end mb-8">
        <h2 className="text-3xl font-bold text-white">Operations</h2>
        <div className="flex gap-2 items-center">
          <div className="w-2 h-2 bg-defense-accent rounded-full animate-pulse"></div>
          <span className="font-mono text-xs text-defense-accent">HISTORY</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-panel p-6 relative overflow-hidden group hover:border-defense-accent transition-colors flex flex-col">
          <div className="absolute -right-4 -top-4 text-8xl font-bold text-white/5 font-mono group-hover:text-defense-accent/10 transition-colors">
            01
          </div>
          <div className="relative z-10 flex-grow">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-lg border border-defense-border bg-black/50 flex items-center justify-center group-hover:border-defense-accent transition-colors shrink-0 p-2">
                <img
                  src="/l3harris.png"
                  alt="L3Harris"
                  loading="lazy"
                  className="w-full h-full object-contain brightness-0 invert opacity-80 group-hover:opacity-100 transition-opacity"
                />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white leading-none">
                  L3Harris
                </h3>
                <span className="text-xs font-mono text-gray-500">
                  Software Engineer
                </span>
              </div>
            </div>

            <div>
              <h4 className="text-[10px] font-bold text-defense-accent font-mono mb-1 tracking-wider">
                CCS
              </h4>
              <h4 className="text-[9px] font-bold text-gray-400 font-mono mb-1 tracking-wider">
                Counter Communications System
              </h4>
              <ul className="space-y-1">
                <li className="flex gap-2 text-xs md:text-sm text-gray-400 items-start">
                  <span className="text-defense-accent shrink-0">›</span>
                  <span>
                    Refactoring ISW into React with Cesium ion support.
                  </span>
                </li>
                <li className="flex gap-2 text-xs md:text-sm text-gray-400 items-start">
                  <span className="text-defense-accent shrink-0">›</span>
                  <span>
                    Modernized user management page using FreeIPA on Space Force
                    EW software.
                  </span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] pt-1 font-bold text-defense-accent font-mono mb-1 tracking-wider">
                GMASS
              </h4>
              <h4 className="text-[9px] font-bold text-gray-400 font-mono mb-1 tracking-wider">
                Ground Based Radar Maintenance and Sustainment Services
              </h4>
              <ul className="space-y-1">
                <li className="flex gap-2 py-2 text-xs md:text-sm text-gray-400 items-start">
                  <span className="text-defense-accent">›</span>
                  <span>
                    Built Analytics Dashboard (React) & Python REST APIs for
                    radar calibration metrics.
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-defense-border pt-4 mt-auto relative z-10">
            <span className="text-[10px] font-mono text-gray-500 uppercase">
              Duration: JAN 2024 - PRESENT
            </span>
          </div>
        </div>

        <div className="glass-panel p-6 relative overflow-hidden group hover:border-defense-accent transition-colors flex flex-col">
          <div className="absolute -right-4 -top-4 text-8xl font-bold text-white/5 font-mono group-hover:text-defense-accent/10 transition-colors">
            02
          </div>
          <div className="relative z-10 flex-grow">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-lg border border-defense-border bg-black/50 flex items-center justify-center group-hover:border-defense-accent transition-colors shrink-0 p-2">
                <img
                  src="/amazonpharmacy.png"
                  alt="Amazon Pharmacy"
                  loading="lazy"
                  className="w-full h-full object-contain invert opacity-80 group-hover:opacity-100 transition-opacity"
                />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white leading-none">
                  Amazon Pharmacy
                </h3>
                <span className="text-xs font-mono text-gray-500">
                  SDE Intern
                </span>
              </div>
            </div>
            <ul className="space-y-3 mb-6">
              <li className="flex gap-2 text-xs md:text-sm text-gray-400 items-start">
                <span className="text-defense-accent shrink-0">›</span>
                <span>
                  Migrated Rx refill system from Ruby monolith to TypeScript
                  microservices.
                </span>
              </li>
              <li className="flex gap-2 text-xs md:text-sm text-gray-400 items-start">
                <span className="text-defense-accent shrink-0">›</span>
                <span>
                  Streamlined developer onboarding and internal technical
                  documentation.
                </span>
              </li>
            </ul>
          </div>
          <div className="border-t border-defense-border pt-4 mt-auto relative z-10">
            <span className="text-[10px] font-mono text-gray-500 uppercase">
              Duration: FALL 2022
            </span>
          </div>
        </div>

        <AcademiaBlock />
      </div>
    </section>
  );
}
