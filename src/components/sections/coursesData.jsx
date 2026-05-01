import { Gamepad2, BookOpen } from 'lucide-react';

export const COURSES = [
  {
    id: "cs7632",
    title: "Game AI",
    number: "CS 7632",
    icon: Gamepad2,
    description: "Using Unity and C# to create AI agents that can navigate, plan, and make decisions in a game environment.",
    topics: [
      {
        id: "overview",
        title: "OVERVIEW",
        content: (
          <div className="space-y-4">
            <p className="text-sm text-gray-300 leading-relaxed">
              Game AI (CS7632) is a breath of fresh air for a back-to-school software engineer working that's currently working in the industy. This course requires you to setup and get used to working with Unity, which is honestly the most annoying part of the course. But once you get past that, it's a lot of fun writing scripts in C# to correctly control agents in the game engine, then focus your work on optimzing it, and handling different scenarios.
            </p>

          </div>
        )
      },
      {
        id: "gridlattice",
        title: "GRIDLATTICE",
        content: (
          <div className="space-y-4">

            <span>Assignment 1 : Grid Lattice</span>
            <div className="w-[50%] border border-defense-border bg-black/50 rounded flex items-center justify-center">
              <span className="font-mono text-defense-muted text-xs fit-content border border-defense-border">
                <img src="/academia/gridlattice.gif" alt="" />
              </span>
            </div>
            <ul className="space-y-2">
              <li className="flex gap-2 text-xs text-gray-400 items-start">
                <span className="text-defense-accent shrink-0">›</span>
                <span>Difficulty ~4/10</span>
              </li>
              <li className="flex gap-2 text-xs text-gray-400 items-start">
                <span className="text-defense-accent shrink-0">›</span>
                <span>Implementation of a grid lattice system to find paths and distances in a 2D environment.</span>
              </li>
              <li className="flex gap-2 text-xs text-gray-400 items-start">
                <span className="text-defense-accent shrink-0">›</span>
                <span>We need to make sure that this system works across any algorithm, and not allow the agent to interesect with obstacles or traverse off the map.</span>
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
