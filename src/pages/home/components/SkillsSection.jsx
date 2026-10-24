import AcademiaBlock from "./AcademiaBlock";
import ExperienceCard from "./ExperienceCard";
import { EXPERIENCES } from "../data/experienceData";

export default function SkillsSection() {
  return (
    <section id="skills" className="mb-24 scroll-mt-28">
      <div className="flex justify-between items-end mb-8">
        <h2 className="text-3xl font-bold text-white">Operations</h2>
        <div className="flex gap-2 items-center">
          <div className="w-2 h-2 bg-defense-accent rounded-full"></div>
          <span className="font-mono text-xs text-defense-accent">
            EXPERIENCE
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {EXPERIENCES.map((exp) => (
          <ExperienceCard key={exp.id} experience={exp} />
        ))}
        <AcademiaBlock />
      </div>
    </section>
  );
}
