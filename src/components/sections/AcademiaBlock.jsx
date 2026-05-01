import { useState, useRef, useEffect } from 'react';
import { Microscope, Calendar, GraduationCap, Gamepad2, ArrowLeft, BookOpen } from 'lucide-react';
import styles from './SkillsSection.module.css';

const COURSES = [
  {
    id: "cs7632",
    title: "Game AI",
    number: "CS 7632",
    icon: Gamepad2,
    description: "Using Unity and C# to create AI agents that can navigate, plan, and make decisions in a game environment.",
    topics: [
      {
        id: "pathfinding",
        title: "Pathfinding",
        content: (
          <div className="space-y-4">
            <p className="text-sm text-gray-300 leading-relaxed">
              Pathfinding involves algorithms that find the shortest route between two points. A common approach uses <strong>A* (A-Star)</strong>, which combines the benefits of Dijkstra's algorithm and Greedy Best-First-Search.
            </p>
            <div className="w-full aspect-video border border-defense-border bg-black/50 rounded flex items-center justify-center">
              <span className="font-mono text-defense-muted text-xs">[ Pathfinding Diagram Placeholder ]</span>
            </div>
            <ul className="space-y-2 mt-4">
              <li className="flex gap-2 text-xs text-gray-400 items-start">
                <span className="text-defense-accent shrink-0">›</span>
                <span>NavMeshes partition the environment into convex polygons for efficient agent traversal.</span>
              </li>
              <li className="flex gap-2 text-xs text-gray-400 items-start">
                <span className="text-defense-accent shrink-0">›</span>
                <span>Heuristics (like Manhattan or Euclidean distance) optimize the search graph.</span>
              </li>
            </ul>
          </div>
        )
      },
      {
        id: "ballistic",
        title: "Ballistic Trajectory",
        content: (
          <div className="space-y-4">
            <p className="text-sm text-gray-300 leading-relaxed">
              Calculating the trajectory of projectiles considering physics variables like gravity, drag, and initial velocity to hit a specific target.
            </p>
            <ul className="space-y-2">
              <li className="flex gap-2 text-xs text-gray-400 items-start">
                <span className="text-defense-accent shrink-0">›</span>
                <span>Requires solving quadratic equations for intercept points.</span>
              </li>
            </ul>
          </div>
        )
      },
      {
        id: "procedural",
        title: "Procedural Generation",
        content: (
          <div className="space-y-4">
            <p className="text-sm text-gray-300 leading-relaxed">
              Algorithms to automatically generate content like levels, terrains, and structures, ensuring replayability and scale.
            </p>
          </div>
        )
      }
    ]
  },
  {
    id: "cs7641",
    title: "Machine Learning",
    number: "CS 7641",
    icon: BookOpen,
    description: "In-depth study of algorithms for supervised, unsupervised, and reinforcement learning.",
    topics: [
      {
        id: "supervised",
        title: "Supervised Learning",
        content: (
          <div className="space-y-4">
            <p className="text-sm text-gray-300 leading-relaxed">
              Training models using labeled datasets to predict outputs for unseen data.
            </p>
            <ul className="space-y-2">
              <li className="flex gap-2 text-xs text-gray-400 items-start">
                <span className="text-defense-accent shrink-0">›</span>
                <span>Algorithms include SVMs, Decision Trees, and Neural Networks.</span>
              </li>
            </ul>
          </div>
        )
      },
      {
        id: "unsupervised",
        title: "Unsupervised Learning",
        content: (
          <div className="space-y-4">
            <p className="text-sm text-gray-300 leading-relaxed">
              Finding hidden patterns or intrinsic structures in input data without explicit labels (e.g., K-Means clustering, PCA).
            </p>
          </div>
        )
      }
    ]
  }
];

export default function AcademiaBlock() {
  const [activeSchool, setActiveSchool] = useState('gatech');
  const [currentView, setCurrentView] = useState('main'); // 'main' | 'notes'
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [selectedTopicId, setSelectedTopicId] = useState(null);

  const handleCourseClick = (courseId) => {
    setSelectedCourseId(courseId);
    const course = COURSES.find(c => c.id === courseId);
    if (course && course.topics && course.topics.length > 0) {
      setSelectedTopicId(course.topics[0].id);
    }
    setCurrentView('notes');
  };

  const handleBack = () => {
    setCurrentView('main');
    setSelectedCourseId(null);
    setSelectedTopicId(null);
  };

  if (currentView === 'notes') {
    const activeCourse = COURSES.find(c => c.id === selectedCourseId);
    const activeTopic = activeCourse?.topics?.find(t => t.id === selectedTopicId) || activeCourse?.topics?.[0];

    return (
      <div className="glass-panel md:col-span-2 relative overflow-hidden group h-full min-h-[400px]">
        <div className={styles.academiaBg}></div>
        <div className="p-8 flex flex-col h-full md:absolute md:inset-0">
          <div className="relative z-10 flex-1 min-h-0 flex flex-col md:flex-row gap-8 overflow-hidden">

            {/* LEFT SIDEBAR - Topics Navigation */}
            <div className="flex-1 md:max-w-[200px] border-b md:border-b-0 md:border-r border-defense-border pb-4 md:pb-0 md:pr-6 flex flex-col gap-4">
              <div className="flex items-center gap-2 mb-2">
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 text-xs font-mono text-defense-accent hover:text-white transition-colors"
                  aria-label="Go back"
                >
                  <ArrowLeft className="w-3 h-3" />
                  <span>BACK</span>
                </button>
              </div>

              <div className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-y-auto custom-scrollbar">
                {activeCourse?.topics?.map((topic) => (
                  <button
                    key={topic.id}
                    onClick={() => setSelectedTopicId(topic.id)}
                    className={`px-4 py-2 text-left font-mono text-xs transition-all border whitespace-nowrap md:whitespace-normal
                    ${selectedTopicId === topic.id
                        ? 'bg-defense-accent/10 border-defense-accent text-defense-accent shadow-[0_0_10px_rgba(45,212,191,0.1)]'
                        : 'bg-transparent border-defense-border/50 text-gray-500 hover:border-defense-accent/30 hover:text-gray-300'
                      }`}
                  >
                    {topic.title}
                  </button>
                ))}
              </div>
            </div>

            {/* RIGHT CONTENT - Topic Details */}
            <div className="flex-[2] flex flex-col min-h-0">
              {activeTopic ? (
                <>
                  <h3 className="text-xl font-bold text-white mb-6 border-b border-defense-border pb-4 shrink-0">
                    {activeTopic.title}
                  </h3>
                  <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-2 pb-4">
                    {activeTopic.content}
                  </div>
                </>
              ) : (
                <div className="text-sm text-gray-500 font-mono">No topics available.</div>
              )}
            </div>

          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel md:col-span-2 relative overflow-hidden group h-full min-h-[400px]">
      <div className={styles.academiaBg}></div>
      <div className="p-8 flex flex-col h-full md:absolute md:inset-0">
        <div className="relative z-10 flex-1 min-h-0 flex flex-col md:flex-row gap-8 overflow-hidden">

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
                <div className="pt-4 border-t border-defense-border mt-4 flex-1 min-h-0 overflow-y-auto pr-2 custom-scrollbar">
                  <div className="flex justify-between items-end mb-3">
                    <span className="text-xs font-mono text-gray-500 block">CURRENT_COURSES</span>
                  </div>
                  <div className="space-y-3">
                    {COURSES.map((course) => {
                      const Icon = course.icon;
                      return (
                        <button
                          key={course.id}
                          onClick={() => handleCourseClick(course.id)}
                          className="w-full text-left bg-white/5 hover:bg-white/10 border border-defense-border hover:border-defense-accent/50 rounded p-4 transition-all group/course block"
                        >
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-bold text-white group-hover/course:text-defense-accent transition-colors">
                              {course.title} <span className="text-gray-500 pl-2 font-mono">{course.number}</span>
                            </span>
                            <Icon className="w-3 h-3 text-defense-muted group-hover/course:text-defense-accent transition-colors" />
                          </div>
                          <p className="text-[11px] text-gray-400 leading-relaxed line-clamp-2">
                            {course.description}
                          </p>
                        </button>
                      );
                    })}
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
  );
}
