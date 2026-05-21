import { Gamepad2 } from 'lucide-react';

export const COURSES = [
  {
    id: "cs7632",
    title: "Game AI",
    number: "CS 7632",
    icon: Gamepad2,
    description: "Spring 2026",
    topics: [
      {
        id: "overview",
        title: "OVERVIEW",
        content: (
          <div className="space-y-4">
            <p className="text-sm text-gray-300 leading-relaxed">
              Game AI (CS7632) is a breath of fresh air for a back-to-school software engineer working that's currently working in the industry. This course requires you to setup and get used to working with Unity, which is honestly the most annoying part of the course. But once you get past that, it's a lot of fun writing scripts in C# to correctly control agents in the game engine and then focus your work on optimizing it to successfully handle different scenarios. Since this class was primarily project-based, I'll be documenting all the assignments I complete throughout this course.
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
            <div className="w-full md:w-[50%] mx-auto border border-defense-border bg-black/50 rounded flex items-center justify-center overflow-hidden">
              <span className="font-mono text-defense-muted text-xs w-full h-full">
                <img src="/academia/gridlattice.gif" alt="" loading="lazy" decoding="async" className="w-full h-auto object-cover" />
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
        id: "pathnetwork",
        title: "PATHNETWORK",
        content: (
          <div className="space-y-4">
            <span>Assignment 2 : Path Network</span>
            <div className="w-full md:w-[50%] mx-auto border border-defense-border bg-black/50 rounded flex items-center justify-center overflow-hidden">
              <span className="font-mono text-defense-muted text-xs w-full h-full">
                <img src="/academia/pathnetwork.gif" alt="" loading="lazy" decoding="async" className="w-full h-auto object-cover" />
              </span>
            </div>
            <ul className="space-y-2">
              <li className="flex gap-2 text-xs text-gray-400 items-start">
                <span className="text-defense-accent shrink-0">›</span>
                <span>Difficulty ~7/10</span>
              </li>
              <li className="flex gap-2 text-xs text-gray-400 items-start">
                <span className="text-defense-accent shrink-0">›</span>
                <span>Assignment 2 was much more complicated than the first. Instead of using discrete grids for the map, this assignment required us to implement a node-like graph for connecting traversable points (nodes).</span>
              </li>
            </ul>
          </div>
        )
      }, {
        id: "astar",
        title: "ASTAR",
        content: (
          <div className="space-y-4">
            <span>Assignment 3 : A*</span>
            <div className="w-full md:w-[50%] mx-auto border border-defense-border bg-black/50 rounded flex items-center justify-center overflow-hidden">
              <span className="font-mono text-defense-muted text-xs w-full h-full">
                <img src="/academia/astar.gif" alt="" loading="lazy" decoding="async" className="w-full h-auto object-cover" />
              </span>
            </div>
            <ul className="space-y-2">
              <li className="flex gap-2 text-xs text-gray-400 items-start">
                <span className="text-defense-accent shrink-0">›</span>
                <span>Difficulty ~5/10</span>
              </li>
              <li className="flex gap-2 text-xs text-gray-400 items-start">
                <span className="text-defense-accent shrink-0">›</span>
                <span>Implementing A* a common algorithm to learn in class. It was fun seeing it in action and analyzing its performance.</span>
              </li>
            </ul>
          </div>
        )
      }, {
        id: "navmesh",
        title: "NAVMESH",
        content: (
          <div className="space-y-4">
            <span>Assignment 4 : Navmesh</span>
            <div className="w-full md:w-[50%] mx-auto border border-defense-border bg-black/50 rounded flex items-center justify-center overflow-hidden">
              <span className="font-mono text-defense-muted text-xs w-full h-full">
                <img src="/academia/navmesh.gif" alt="" loading="lazy" decoding="async" className="w-full h-auto object-cover" />
              </span>
            </div>
            <ul className="space-y-2">
              <li className="flex gap-2 text-xs text-gray-400 items-start">
                <span className="text-defense-accent shrink-0">›</span>
                <span>Difficulty ~8/10</span>
              </li>
              <li className="flex gap-2 text-xs text-gray-400 items-start">
                <span className="text-defense-accent shrink-0">›</span>
                <span>A Navmesh is a method of mapping out a grid by building out a graph of the navigable area by breaking it down into a set of convex polygons such that the area within each polygon is guaranteed to be obstacle-free.</span>
              </li>
              <li className="flex gap-2 text-xs text-gray-400 items-start">
                <span className="text-defense-accent shrink-0">›</span>
                <span>This assignment is a culmination of all the previous assignments. We had to use the pathfinding algorithms we learned in the previous assignments to find paths in the navmesh.</span>
              </li>
            </ul>
          </div>
        )
      }, {
        id: "ballistic",
        title: "BALLISTIC",
        content: (
          <div className="space-y-4">
            <span>Assignment 5 : BALLISTIC</span>
            <div className="w-full md:w-[50%] mx-auto border border-defense-border bg-black/50 rounded flex items-center justify-center overflow-hidden">
              <span className="font-mono text-defense-muted text-xs w-full h-full">
                <img src="/academia/ballistic.gif" alt="" loading="lazy" decoding="async" className="w-full h-auto object-cover" />
              </span>
            </div>
            <ul className="space-y-2">
              <li className="flex gap-2 text-xs text-gray-400 items-start">
                <span className="text-defense-accent shrink-0">›</span>
                <span>Difficulty ~8/10</span>
              </li>
              <li className="flex gap-2 text-xs text-gray-400 items-start">
                <span className="text-defense-accent shrink-0">›</span>
                <span>Assignment 5 is completely different from the first 4 assignments. Instead of pathfinding, this project was about projectile physics and trajectory. We had to implement a system to shoot balls at targets and hit them with accuracy and speed.</span>
              </li>
              <li className="flex gap-2 text-xs text-gray-400 items-start">
                <span className="text-defense-accent shrink-0">›</span>
                <span>There were 2 scripts to implement, one for the shot selection, and another for the aiming.</span>
              </li>
            </ul>
          </div>
        )
      }, {
        id: "dodgeball",
        title: "DODGEBALL",
        content: (
          <div className="space-y-4">
            <span>Assignment 6 : Dodgeball</span>
            <div className="w-full md:w-[50%] mx-auto border border-defense-border bg-black/50 rounded flex items-center justify-center overflow-hidden">
              <span className="font-mono text-defense-muted text-xs w-full h-full">
                <img src="/academia/dodgeball.gif" alt="" loading="lazy" decoding="async" className="w-full h-auto object-cover" />
              </span>
            </div>
            <ul className="space-y-2">
              <li className="flex gap-2 text-xs text-gray-400 items-start">
                <span className="text-defense-accent shrink-0">›</span>
                <span>Difficulty ~8/10</span>
              </li>
              <li className="flex gap-2 text-xs text-gray-400 items-start">
                <span className="text-defense-accent shrink-0">›</span>
                <span>The dodgeball assingment expands on the previous assingment, making use of the aiming and shot selection scripts.</span>
              </li>
              <li className="flex gap-2 text-xs text-gray-400 items-start">
                <span className="text-defense-accent shrink-0">›</span>
                <span>However, the tricky part of this assignment was to make control the state of the agents depending on the scenario and game parameters, such as where the balls are and where the other bots are, to be aggressive or defensive accordingly.</span>
              </li>
            </ul>
          </div>
        )
      }, {
        id: "racetrack",
        title: "RACETRACK",
        content: (
          <div className="space-y-4">
            <span>Assignment 7 : Racetrack</span>
            <div className="w-full md:w-[50%] mx-auto border border-defense-border bg-black/50 rounded flex items-center justify-center overflow-hidden">
              <span className="font-mono text-defense-muted text-xs w-full h-full">
                <img src="/academia/racetrack.gif" alt="" loading="lazy" decoding="async" className="w-full h-auto object-cover" />
              </span>
            </div>
            <ul className="space-y-2">
              <li className="flex gap-2 text-xs text-gray-400 items-start">
                <span className="text-defense-accent shrink-0">›</span>
                <span>Difficulty ~5/10</span>
              </li>
              <li className="flex gap-2 text-xs text-gray-400 items-start">
                <span className="text-defense-accent shrink-0">›</span>
                <span>Out of all the assignments, this was the most fun! Assignment 7 taught about using fuzzy logic to control the behavior of a race car driving on a procedurally generated racetrack.</span>
              </li>
              <li className="flex gap-2 text-xs text-gray-400 items-start">
                <span className="text-defense-accent shrink-0">›</span>
                <span>I used a combination of inputs such as the look ahead distance and the speed and position of the car to control what state the car was in, in order to determine how much to turn and how much to accelerate or brake.</span>
              </li>
            </ul>
          </div>
        )
      }, {
        id: "pcg",
        title: "PCG",
        content: (
          <div className="space-y-4">
            <span>Assignment 8 : PCG</span>
            <div className="w-full md:w-[50%] mx-auto border border-defense-border bg-black/50 rounded flex items-center justify-center overflow-hidden">
              <span className="font-mono text-defense-muted text-xs w-full h-full">
                <img src="/academia/pcg.png" alt="" loading="lazy" decoding="async" className="w-full h-auto object-cover" />
              </span>
            </div>
            <ul className="space-y-2">
              <li className="flex gap-2 text-xs text-gray-400 items-start">
                <span className="text-defense-accent shrink-0">›</span>
                <span>Difficulty ~2/10</span>
              </li>
              <li className="flex gap-2 text-xs text-gray-400 items-start">
                <span className="text-defense-accent shrink-0">›</span>
                <span>In this assignment, there was no coding involved. Instead, we had to utilize Perlin Noise Generation in order to create a game world with 3 distincy biome.</span>
              </li>
              <li className="flex gap-2 text-xs text-gray-400 items-start">
                <span className="text-defense-accent shrink-0">›</span>
                <span>Using trapezoidal filters, I sectioned off parts of the map to be mountains, hills, and rockpits.</span>
              </li>
            </ul>
          </div>
        )
      },
    ]
  }
];
