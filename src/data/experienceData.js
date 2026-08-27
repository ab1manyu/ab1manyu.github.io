export const EXPERIENCES = [
  {
    id: "l3harris",
    index: "01",
    company: "L3Harris",
    role: "Software Engineer",
    logo: "/l3harris.png",
    logoAlt: "L3Harris",
    logoClass: "brightness-0 invert",
    duration: "JAN 2024 - PRESENT",
    projects: [
      {
        code: "CCS",
        title: "Counter Communications System",
        highlights: [
          "Refactoring ISW into React with Cesium ion support.",
          "Modernized user management page using FreeIPA on Space Force EW software.",
        ],
      },
      {
        code: "GMASS",
        title: "Ground Based Radar Maintenance and Sustainment Services",
        highlights: [
          "Built Analytics Dashboard (React) & Python REST APIs for radar calibration metrics.",
        ],
      },
    ],
  },
  {
    id: "amazon-pharmacy",
    index: "02",
    company: "Amazon Pharmacy",
    role: "SDE Intern",
    logo: "/amazonpharmacy.png",
    logoAlt: "Amazon Pharmacy",
    logoClass: "invert",
    duration: "FALL 2022",
    highlights: [
      "Migrated Rx refill system from Ruby monolith to TypeScript microservices.",
      "Streamlined developer onboarding and internal technical documentation.",
    ],
  },
];
