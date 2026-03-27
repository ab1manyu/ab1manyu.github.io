import { useEffect, useRef } from 'react';
import { Terminal, Shield, ArrowUpRight, Camera, Microscope, Calendar, GraduationCap } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MatrixRain from '../components/MatrixRain';
import CardMatrixRain from '../components/CardMatrixRain';
import Loader from '../components/Loader';
import BackgroundElements from '../components/BackgroundElements';
import { TextScramble } from '../utils/textScramble';

export default function Home() {
  const heroNameRef = useRef(null);

  useEffect(() => {
    // 1. Text Scramble logic
    const initScramble = () => {
      if (heroNameRef.current) {
        const fx = new TextScramble(heroNameRef.current);
        fx.setText("abimanyu ananthu");
      }
    };

    if (sessionStorage.getItem("booted")) {
      setTimeout(initScramble, 100);
    } else {
      window.addEventListener('loader-finished', initScramble);
    }

    // 2. Intersection Observer for glass-panels
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll(".glass-panel").forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(20px)";
      el.style.transition = "opacity 0.6s ease, transform 0.6s ease, border-color 0.3s ease";
      observer.observe(el);
    });

    // 3. Scroll Spy for Navbar
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll(".nav-item");
    const spyObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          navLinks.forEach((link) => {
            link.classList.remove("text-white", "text-defense-accent");
            link.classList.add("text-defense-muted");
          });
          const activeLink = document.querySelector(`.nav-item[href="#${id}"]`);
          if (activeLink) {
            activeLink.classList.remove("text-defense-muted");
            activeLink.classList.add("text-white");
          }
        }
      });
    }, { root: null, rootMargin: "-50% 0px -50% 0px", threshold: 0 });

    sections.forEach((section) => spyObserver.observe(section));

    return () => {
      window.removeEventListener('loader-finished', initScramble);
      observer.disconnect();
      spyObserver.disconnect();
    };
  }, []);

  return (
    <>
      <Loader />
      {/* <MatrixRain /> */}
      <BackgroundElements />
      <Navbar />

      <main className="pt-24 pb-12 px-4 md:px-6 max-w-7xl mx-auto relative z-10 transition-opacity duration-500">

        {/* ABOUT SECTION */}
        <section id="about" className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-24 scroll-mt-28">
          <div className="glass-panel md:col-span-8 p-6 md:p-8 relative overflow-hidden group">
            <CardMatrixRain />
            <div className="absolute top-4 right-4 font-mono text-xs text-gray-600 z-10">
              0067
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-2 uppercase text-white relative z-10" id="hero-name" ref={heroNameRef}>
              uynami
            </h1>
            <h2 className="font-mono text-xl md:text-2xl text-gray-400 mb-6 flex items-center gap-2 relative z-10">
              <Terminal className="w-5 h-5" />
              CLEARED SOFTWARE ENGINEER
            </h2>
            <p className="max-w-lg text-gray-400 leading-relaxed text-sm md:text-base relative z-10">
              Specializing in full-stack software development and mission-critical software architecture. <br /><br />
              Building resilient solutions for defense and aerospace sectors.
            </p>
          </div>

          <div className="glass-panel md:col-span-4 p-6 md:p-8 flex flex-col justify-between relative">
            <div className="flex justify-between items-start">
              <span className="font-mono text-xs text-gray-500">SECURITY_CLEARANCE</span>
              <Shield className="text-gray-300 w-6 h-6" />
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-1">Secret</div>
              <div className="text-xs font-mono text-gray-500 uppercase tracking-widest">
                Active Status
              </div>
            </div>
            <div className="w-full h-[1px] bg-defense-border mt-4 relative overflow-hidden">
              <div className="absolute top-0 left-0 h-full w-1/3 bg-white animate-slideRight"></div>
            </div>
          </div>

          <div className="glass-panel md:col-span-3 p-6 flex flex-col justify-center items-center text-center gap-2">
            <span className="font-mono text-6xl font-bold text-white">2+</span>
            <span className="text-xs text-gray-500 uppercase tracking-widest font-mono">YEARS OF EXPERIENCE</span>
          </div>

          <div className="glass-panel md:col-span-5 p-6 flex flex-col gap-6">
            <div>
              <div className="font-mono text-xs text-gray-500 mb-2">PRIMARY_DOMAINS</div>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 border border-defense-border rounded-full text-xs font-mono transition-all duration-300 cursor-crosshair hover:-translate-y-1 hover:bg-[#3776AB] hover:border-[#3776AB] hover:text-white hover:shadow-[0_0_15px_rgba(55,118,171,0.5)]">Python</span>
                <span className="px-3 py-1 border border-defense-border rounded-full text-xs font-mono transition-all duration-300 cursor-crosshair hover:-translate-y-1 hover:bg-[#61DAFB] hover:border-[#61DAFB] hover:text-black hover:shadow-[0_0_15px_rgba(97,218,251,0.5)]">ReactJS</span>
                <span className="px-3 py-1 border border-defense-border rounded-full text-xs font-mono transition-all duration-300 cursor-crosshair hover:-translate-y-1 hover:bg-[#f89820] hover:border-[#f89820] hover:text-white hover:shadow-[0_0_15px_rgba(248,152,32,0.5)]">Java</span>
                <span className="px-3 py-1 border border-defense-border rounded-full text-xs font-mono transition-all duration-300 cursor-crosshair hover:-translate-y-1 hover:bg-[#e77e24] hover:border-[#e77e24] hover:text-white hover:shadow-[0_0_15px_rgba(231,126,36,0.5)]">MATLAB</span>
              </div>
            </div>
            <div>
              <div className="font-mono text-xs text-gray-500 mb-2">SECONDARY_DOMAINS</div>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 border border-defense-border rounded-full text-xs font-mono transition-all duration-300 cursor-crosshair hover:-translate-y-1 hover:bg-pink-500 hover:border-pink-500 hover:text-white hover:shadow-[0_0_15px_rgba(236,72,153,0.5)]">UI / UX</span>
                <span className="px-3 py-1 border border-defense-border rounded-full text-xs font-mono transition-all duration-300 cursor-crosshair hover:-translate-y-1 hover:bg-purple-600 hover:border-purple-600 hover:text-white hover:shadow-[0_0_15px_rgba(147,51,234,0.5)]">AI</span>
                <span className="px-3 py-1 border border-defense-border rounded-full text-xs font-mono transition-all duration-300 cursor-crosshair hover:-translate-y-1 hover:bg-teal-500 hover:border-teal-500 hover:text-white hover:shadow-[0_0_15px_rgba(20,184,166,0.5)]">Data Science</span>
              </div>
            </div>
          </div>

          <a href="resume.pdf" target="_blank" rel="noopener noreferrer" className="glass-panel md:col-span-4 p-6 flex items-center justify-between group cursor-pointer hover:bg-white/5 transition-colors">
            <div>
              <div className="font-mono text-xs text-defense-accent mb-1">MORE_DOMAINS</div>
              <div className="text-xl font-bold text-white">Resume</div>
            </div>
            <div className="w-10 h-10 rounded-full border border-defense-border flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </a>
        </section>

        {/* SKILLS SECTION */}
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
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTAgNDBMMCAwSDEiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIiBmaWxsPSJub25lIi8+PC9zdmc+')] opacity-20"></div>
              <div className="relative z-10 flex flex-col md:flex-row gap-8 h-full">
                <div className="flex-1 border-b md:border-b-0 md:border-r border-defense-border pb-4 md:pb-0 md:pr-8 flex flex-col justify-center">
                  <div className="text-xs font-mono text-defense-accent mb-2">ACADEMIA</div>
                  <h3 className="text-3xl font-bold text-white mb-1">RUTGERS</h3>
                  <h4 className="text-xl text-gray-400 mb-4">UNIVERSITY</h4>
                  <div className="flex items-center gap-3 text-sm text-gray-300 mb-2">
                    <GraduationCap className="w-4 h-4 text-defense-accent" />
                    <span>B.S. Computer Engineering</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-500 font-mono">
                    <Calendar className="w-4 h-4" />
                    <span>Class of 2023</span>
                  </div>
                </div>

                <div className="flex-1 flex flex-col justify-center gap-4">
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
                      <div className="bg-white/5 border border-defense-border rounded p-4 hover:border-defense-accent transition-colors group/research">
                        <div className="flex flex-col gap-2 mb-3">
                          <span className="text-xs font-bold text-white group-hover/research:text-defense-accent transition-colors">
                            An Approach To Disposing of Unwanted Pet Hairs From Homes Using Electrostatic Attraction
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-400 leading-relaxed">
                          Developed an electronic device to efficiently collect and dispose of fallen pet hairs, addressing health risks associated with the million tons of hair shed annually by pets worldwide.
                        </p>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CONTACT SECTION */}
        <section id="contact" className="max-w-4xl mx-auto mb-24 scroll-mt-28">
          <div className="flex justify-between items-end mb-8 md:px-0">
            <h2 className="text-3xl font-bold text-white">Links</h2>
            <div className="flex gap-2 items-center">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="font-mono text-xs text-red-500">AWAITING CONNECTION</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link to="/gallery" className="group glass-panel p-8 relative overflow-hidden hover:border-[#EA5506] transition-all duration-300">
              <div className="absolute -right-6 -bottom-6 text-white/5 group-hover:text-[#EA5506]/10 transition-colors duration-500">
                <Camera className="w-32 h-32" />
              </div>
              <div className="relative z-10 flex flex-col h-full justify-between min-h-[140px]">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-xs font-mono text-gray-500 mb-1">PORTFOLIO</div>
                    <h3 className="text-2xl font-bold text-white group-hover:text-[#EA5506] transition-colors">Photography</h3>
                  </div>
                  <div className="w-10 h-10 rounded-full border border-defense-border flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-400 font-mono">Memories captured through my lens.</p>
                </div>
              </div>
            </Link>

            <a href="https://www.linkedin.com/in/abimanyuananthu/" target="_blank" rel="noopener noreferrer" className="group glass-panel p-8 relative overflow-hidden hover:border-[#0077b5] transition-all duration-300">
              <div className="absolute -right-6 -bottom-6 text-white/5 group-hover:text-[#0077b5]/10 transition-colors duration-500">
                <FaLinkedin className="w-32 h-32" />
              </div>
              <div className="relative z-10 flex flex-col h-full justify-between min-h-[140px]">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-xs font-mono text-gray-500 mb-1">NETWORK</div>
                    <h3 className="text-2xl font-bold text-white group-hover:text-[#0077b5] transition-colors">LinkedIn</h3>
                  </div>
                  <div className="w-10 h-10 rounded-full border border-defense-border flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-400 font-mono">Connect via secure professional network.</p>
                </div>
              </div>
            </a>

            <a href="https://github.com/ab1manyu" target="_blank" rel="noopener noreferrer" className="group glass-panel p-8 relative overflow-hidden hover:border-defense-accent transition-all duration-300">
              <div className="absolute -right-6 -bottom-6 text-white/5 group-hover:text-defense-accent/10 transition-colors duration-500">
                <FaGithub className="w-32 h-32" />
              </div>
              <div className="relative z-10 flex flex-col h-full justify-between min-h-[140px]">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-xs font-mono text-gray-500 mb-1">REPOSITORY</div>
                    <h3 className="text-2xl font-bold text-white group-hover:text-defense-accent transition-colors">GitHub</h3>
                  </div>
                  <div className="w-10 h-10 rounded-full border border-defense-border flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-400 font-mono">Access source code & projects.</p>
                </div>
              </div>
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
