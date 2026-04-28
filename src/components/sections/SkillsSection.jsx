import { useState } from 'react';
import { Gamepad2, Microscope, Calendar, GraduationCap } from 'lucide-react';
import styles from './SkillsSection.module.css';

export default function SkillsSection() {
  const [activeSchool, setActiveSchool] = useState('gatech');

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
          <div className="absolute -right-4 -top-4 text-8xl font-bold text-white/5 font-mono group-hover:text-defense-accent/10 transition-colors">01</div>
          <div className="relative z-10 flex-grow">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-lg border border-defense-border bg-black/50 flex items-center justify-center group-hover:border-defense-accent transition-colors shrink-0 p-2">
                <img src="/l3harris.png" alt="L3Harris" className="w-full h-full object-contain brightness-0 invert opacity-80 group-hover:opacity-100 transition-opacity" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white leading-none">L3Harris</h3>
                <span className="text-xs font-mono text-gray-500">Software Engineer</span>
              </div>
            </div>

            <div>
              <h4 className="text-[10px] font-bold text-defense-accent font-mono mb-1 tracking-wider">CCS</h4>
              <h4 className="text-[9px] font-bold text-gray-400 font-mono mb-1 tracking-wider">Counter Communications System</h4>
              <ul className="space-y-1">
                <li className="flex gap-2 text-xs md:text-sm text-gray-400 items-start">
                  <span className="text-defense-accent shrink-0">›</span>
                  <span>Refactoring ISW into React with Cesium ion support.</span>
                </li>
                <li className="flex gap-2 text-xs md:text-sm text-gray-400 items-start">
                  <span className="text-defense-accent shrink-0">›</span>
                  <span>Modernized user management page using FreeIPA on Space Force EW software.</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] pt-1 font-bold text-defense-accent font-mono mb-1 tracking-wider">GMASS</h4>
              <h4 className="text-[9px] font-bold text-gray-400 font-mono mb-1 tracking-wider">Ground Based Radar Maintenance and Sustainment Services</h4>
              <ul className="space-y-1">
                <li className="flex gap-2 py-2 text-xs md:text-sm text-gray-400 items-start">
                  <span className="text-defense-accent">›</span>
                  <span>Built Analytics Dashboard (React) & Python REST APIs for radar calibration metrics.</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-defense-border pt-4 mt-auto relative z-10">
            <span className="text-[10px] font-mono text-gray-500 uppercase">Duration: JAN 2024 - PRESENT</span>
          </div>
        </div>

        <div className="glass-panel p-6 relative overflow-hidden group hover:border-defense-accent transition-colors flex flex-col">
          <div className="absolute -right-4 -top-4 text-8xl font-bold text-white/5 font-mono group-hover:text-defense-accent/10 transition-colors">02</div>
          <div className="relative z-10 flex-grow">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-lg border border-defense-border bg-black/50 flex items-center justify-center group-hover:border-defense-accent transition-colors shrink-0 p-2">
                <img src="/amazonpharmacy.png" alt="Amazon Pharmacy" className="w-full h-full object-contain invert opacity-80 group-hover:opacity-100 transition-opacity" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white leading-none">Amazon Pharmacy</h3>
                <span className="text-xs font-mono text-gray-500">SDE Intern</span>
              </div>
            </div>
            <ul className="space-y-3 mb-6">
              <li className="flex gap-2 text-xs md:text-sm text-gray-400 items-start">
                <span className="text-defense-accent shrink-0">›</span>
                <span>Migrated Rx refill system from Ruby monolith to TypeScript microservices.</span>
              </li>
              <li className="flex gap-2 text-xs md:text-sm text-gray-400 items-start">
                <span className="text-defense-accent shrink-0">›</span>
                <span>Streamlined developer onboarding and internal technical documentation.</span>
              </li>
            </ul>
          </div>
          <div className="border-t border-defense-border pt-4 mt-auto relative z-10">
            <span className="text-[10px] font-mono text-gray-500 uppercase">Duration: FALL 2022</span>
          </div>
        </div>

        <div className="glass-panel md:col-span-2 p-8 relative overflow-hidden group flex flex-col justify-center">
          <div className={styles.academiaBg}></div>
          <div className="relative z-10 flex flex-col md:flex-row gap-8 h-full">

            {/* LEFT — school tabs */}
            <div className="flex-1 border-b md:border-b-0 md:border-r border-defense-border pb-4 md:pb-0 md:pr-8 flex flex-col gap-0">
              <div className="text-xs font-mono text-defense-accent mb-4">ACADEMIA</div>

              {/* Tabs — side by side on mobile, stacked on md+ */}
              <div className="flex flex-row md:flex-col gap-0">

                {/* Georgia Tech tab */}
                <button
                  onClick={() => setActiveSchool('gatech')}
                  className={`${styles.tab} ${activeSchool === 'gatech' ? styles.gatechActive : styles.gatechInactive}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className={styles.schoolTitle}>GEORGIA</h3>
                  </div>
                  <h4 className={styles.schoolSubtitle}>INSTITUTE OF TECHNOLOGY</h4>
                  <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                    <GraduationCap className="w-3 h-3 text-defense-accent shrink-0" />
                    <span>M.S. Computer Science</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 font-mono">
                    <Calendar className="w-3 h-3 shrink-0" />
                    <span>Class of 2028</span>
                  </div>
                </button>

                {/* Horizontal divider on md+ only */}
                <div className="hidden md:block md:h-px bg-defense-border md:my-3" />

                {/* Rutgers tab */}
                <button
                  onClick={() => setActiveSchool('rutgers')}
                  className={`${styles.tab} ${activeSchool === 'rutgers' ? styles.rutgersActive : styles.rutgersInactive}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className={styles.schoolTitle}>RUTGERS</h3>
                  </div>
                  <h4 className={styles.schoolSubtitle}>UNIVERSITY</h4>
                  <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                    <GraduationCap className="w-3 h-3 text-defense-accent shrink-0" />
                    <span>B.S. Computer Engineering</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 font-mono">
                    <Calendar className="w-3 h-3 shrink-0" />
                    <span>Class of 2023</span>
                  </div>
                </button>

              </div>
            </div>

            {/* RIGHT — swappable content panel */}
            <div className="flex-1 flex flex-col justify-center gap-4">
              {activeSchool === 'gatech' ? (
                <>
                  <div className="pt-2">
                    <span className="text-xs font-mono text-gray-500 block mb-2">SPECIALIZATION</span>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-white/5 border border-defense-border rounded text-[10px] text-gray-300 font-mono">Artificial Intelligence</span>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-defense-border mt-4">
                    <div className="flex justify-between items-end mb-3">
                      <span className="text-xs font-mono text-gray-500 block">CURRENT_COURSE</span>
                      <Gamepad2 className="w-3 h-3 text-defense-muted" />
                    </div>
                    <div className="bg-white/5 border border-defense-border rounded p-4">
                      <div className="flex flex-col gap-2 mb-3">
                        <span className="text-xs font-bold text-white">
                          Game AI <span className="text-gray-500 pl-2">CS 7632</span>
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-400 leading-relaxed">
                        Using Unity and C# to create AI agents that can navigate, plan, and make decisions in a game environment.
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="pt-2">
                    <span className="text-xs font-mono text-gray-500 block mb-2">REL_COURSES</span>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-white/5 border border-defense-border rounded text-[10px] text-gray-300 font-mono">Data Science</span>
                      <span className="px-2 py-1 bg-white/5 border border-defense-border rounded text-[10px] text-gray-300 font-mono">Machine Learning</span>
                      <span className="px-2 py-1 bg-white/5 border border-defense-border rounded text-[10px] text-gray-300 font-mono">Agile Development</span>
                      <span className="px-2 py-1 bg-white/5 border border-defense-border rounded text-[10px] text-gray-300 font-mono">Comp Arch</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-defense-border mt-4">
                    <div className="flex justify-between items-end mb-3">
                      <span className="text-xs font-mono text-gray-500 block">RESEARCH_LAB</span>
                      <Microscope className="w-3 h-3 text-defense-muted" />
                    </div>
                    <a href="https://rutgers.alma.exlibrisgroup.com/discovery/delivery/01RUT_INST:01RUT/12676941630004646?lang=en&viewerServiceCode=AlmaViewer" className="block outline-none" target="_blank" rel="noreferrer">
                      <div className={styles.researchCard}>
                        <div className="flex flex-col gap-2 mb-3">
                          <span className={styles.researchTitle}>
                            An Approach To Disposing of Unwanted Pet Hairs From Homes Using Electrostatic Attraction
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-400 leading-relaxed">
                          Developed an electronic device to efficiently collect and dispose of fallen pet hairs, addressing health risks associated with the million tons of hair shed annually by pets worldwide.
                        </p>
                      </div>
                    </a>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
