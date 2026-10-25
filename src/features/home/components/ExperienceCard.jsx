export default function ExperienceCard({ experience }) {
  const {
    index,
    company,
    role,
    logo,
    logoAlt,
    logoClass,
    duration,
    projects,
    highlights,
  } = experience;

  return (
    <div className="glass-panel p-5 sm:p-6 relative overflow-hidden group hover:border-defense-accent transition-colors flex flex-col min-w-0 w-full">
      <div className="absolute -right-4 -top-4 text-7xl sm:text-8xl font-bold text-white/5 font-mono group-hover:text-defense-accent/10 transition-colors pointer-events-none select-none">
        {index}
      </div>

      <div className="relative z-10 flex-grow min-w-0">
        {/* Header: Logo & Company/Role */}
        <div className="flex items-center gap-3.5 sm:gap-4 mb-5 sm:mb-6 min-w-0">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-lg border border-defense-border bg-black/50 flex items-center justify-center group-hover:border-defense-accent transition-colors shrink-0 p-2">
            <img
              src={logo}
              alt={logoAlt || company}
              loading="lazy"
              className={`w-full h-full object-contain opacity-80 group-hover:opacity-100 transition-opacity ${
                logoClass || ""
              }`}
            />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-base sm:text-lg font-bold text-white leading-tight">
              {company}
            </h3>
            <span className="text-xs font-mono text-gray-500 block mt-0.5">
              {role}
            </span>
          </div>
        </div>

        {/* Project Blocks (if any) */}
        {projects && projects.length > 0 ? (
          <div className="space-y-3.5 min-w-0">
            {projects.map((proj, idx) => (
              <div key={idx} className="min-w-0">
                <h4 className="text-[10px] font-bold text-defense-accent font-mono mb-1 tracking-wider break-words">
                  {proj.code}
                </h4>
                {proj.title && (
                  <h4 className="text-[9px] font-bold text-gray-400 font-mono mb-1 tracking-wider break-words">
                    {proj.title}
                  </h4>
                )}
                <ul className="space-y-1.5 min-w-0">
                  {proj.highlights.map((point, pIdx) => (
                    <li
                      key={pIdx}
                      className="flex gap-2 text-xs md:text-sm text-gray-400 items-start min-w-0"
                    >
                      <span className="text-defense-accent shrink-0 select-none">
                        ›
                      </span>
                      <span className="break-words min-w-0 flex-1 leading-relaxed">
                        {point}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : null}

        {/* Direct Highlights (if any) */}
        {highlights && highlights.length > 0 ? (
          <ul className="space-y-2.5 sm:space-y-3 mb-5 sm:mb-6 min-w-0">
            {highlights.map((point, pIdx) => (
              <li
                key={pIdx}
                className="flex gap-2 text-xs md:text-sm text-gray-400 items-start min-w-0"
              >
                <span className="text-defense-accent shrink-0 select-none">
                  ›
                </span>
                <span className="break-words min-w-0 flex-1 leading-relaxed">
                  {point}
                </span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      {/* Footer duration */}
      <div className="border-t border-defense-border pt-3.5 sm:pt-4 mt-4 sm:mt-auto relative z-10">
        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">
          Duration: {duration}
        </span>
      </div>
    </div>
  );
}
