import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load env from server directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env') });

import PersonalInfo from '../models/PersonalInfo.js';
import Project from '../models/Project.js';
import Skill from '../models/Skill.js';
import Certificate from '../models/Certificate.js';
import Journey from '../models/Journey.js';

// ─── Seed Data ───────────────────────────────────────────────

const personalInfoData = {
  name: "Rehan Fazal",
  brand: "rehan.dev",
  terminalUser: "~/rehan-fazal $ whoami",
  role: "B.Tech Computer Engineering student — full-stack (MERN) developer, now going deep on DSA and shifting into AI/ML. Along the way, I picked up a real love for web design.",
  location: "Delhi, India",
  university: "Jamia Millia Islamia (JMI '28)",
  github: "https://github.com/Rehan9599",
  linkedin: "https://www.linkedin.com/in/rehan-fazal-09425532a/",
  email: "rehanfazal9599@gmail.com",
  quote: "Building things that work, then making them beautiful.",
  journeyText: "I started with the MERN stack, shipping full projects end to end. Somewhere along the way, solving algorithmic problems every day became its own habit — and that habit pulled me toward the math and models behind AI/ML. I'm currently splitting my time between DSA practice and learning the fundamentals of machine learning, one problem set and one paper at a time.",
  currentFocus: " Diving deep into Machine Learning & Data Structures — personalize this line  /Rehan",
  stats: {
    projectsShipped: "12+",
    mernExperience: "2 yrs",
    mlAccuracy: "92%",
    skillAreas: "5",
    dsaSolved: "350+",
    dsaStreak: "60+"
  }
};

const projectsData = [
  {
    projectId: "01",
    title: "Smart Room Allotment",
    description: "Intelligent room allocation web application for hostels and educational facilities, streamlining student housing.",
    tags: ["JavaScript", "HTML5", "CSS3", "Node.js"],
    github: "https://github.com/MdFareedKhan01/smart-room-allotment",
    demo: "#",
    featured: true,
    image: '/assets/projects/dormengine.png',
    order: 1
  },
  {
    projectId: "02",
    title: "Keeper App",
    description: "Modern, responsive note-taking application inspired by Google Keep built with component-driven architecture.",
    tags: ["React", "CSS3", "CodeSandbox"],
    github: "https://github.com/Rehan9599/KeeperApp",
    demo: "#",
    featured: true,
    image: '/assets/projects/dormengine.png',
    order: 2
  },
  {
    projectId: "03",
    title: "ReadyCool",
    description: "Web application tailored for custom cooling and system monitoring routines.",
    tags: ["React", "Node.js", "Express"],
    github: "https://github.com/Rehan9599/SIRS_Z",
    demo: "#",
    featured: true,
    image: '/assets/projects/readycool.png',
    order: 3
  },
  {
    projectId: "04",
    title: "Anime Tier List",
    description: "Interactive tier-list maker allowing users to rank, organize, and share their favorite anime shows.",
    tags: ["React", "JavaScript", "Tailwind CSS"],
    github: "https://github.com/Rehan9599/ANIme-tier-list",
    demo: "#",
    featured: true,
    image: '/assets/projects/anime-tier-list.png',
    order: 4
  },
  {
    projectId: "05",
    title: "Personal Portfolio",
    description: "Interactive developer portfolio showcasing full-stack applications, DSA progress, and certificates.",
    tags: ["React", "Node.js", "MongoDB", "Tailwind CSS"],
    github: "https://github.com/Rehan9599/portfolio",
    demo: "#",
    featured: true,
    image: '/assets/projects/portfolio.png',
    order: 5
  },
  {
    projectId: "06",
    title: "Secrets Authentication",
    description: "Secure web platform featuring level 6 authentication, OAuth integration, and secret message persistence.",
    tags: ["Node.js", "Express", "EJS", "Passport.js"],
    github: "https://github.com/Rehan9599/Secrets-Project",
    demo: "#",
    featured: true,
    image: '/assets/projects/dormengine.png',
    order: 6
  },
  {
    projectId: "07",
    title: "Authentication",
    description: "Secure web platform featuring level 6 authentication, OAuth integration, and secret message persistence.",
    tags: ["Node.js", "Express", "EJS", "Passport.js"],
    github: "https://github.com/Rehan9599/Secrets-Project",
    demo: "#",
    featured: true,
    image: '/assets/projects/dormengine.png',
    order: 7
  }
];

const skillsData = [
  {
    key: 'webDev',
    label: 'web development',
    items: [
      { label: 'Mo', name: 'mongodb', logo: 'mongodb' },
      { label: 'Ex', name: 'express', logo: 'express' },
      { label: 'Re', name: 'react', logo: 'react' },
      { label: 'No', name: 'node.js', logo: 'nodedotjs' },
      { label: 'Pg', name: 'postgresql', logo: 'postgresql' },
      { label: 'My', name: 'mysql', logo: 'mysql' },
      { label: 'Gt', name: 'git', logo: 'git' },
      { label: 'Gh', name: 'github', logo: 'github' },
    ],
  },
  {
    key: 'softwareDev',
    label: 'software development',
    items: [
      { label: 'Lx', name: 'linux', logo: 'linux' },
      { label: 'Py', name: 'python', logo: 'python' },
      { label: 'C+', name: 'c++', logo: 'cplusplus' },
      { label: 'Vc', name: 'version control', logo: null },
    ],
  },
  {
    key: 'aiMl',
    label: 'ai & ml',
    items: [
      { label: 'Py', name: 'python', logo: 'python' },
      { label: 'Pd', name: 'pandas', logo: 'pandas' },
      { label: 'Np', name: 'numpy', logo: 'numpy' },
      { label: 'Mp', name: 'matplotlib', logo: 'matplotlib' },
      { label: 'Sk', name: 'scikit-learn', logo: 'scikitlearn' },
    ],
  },
  {
    key: 'design',
    label: 'digital design',
    items: [
      { label: 'Fg', name: 'figma', logo: 'figma' },
      { label: 'Cv', name: 'canva', logo: 'canva' },
      { label: 'Fr', name: 'framer', logo: 'framer' },
    ],
  },
];

const certificatesData = [
  {
    certId: "01",
    title: "Full Stack Web Development Bootcamp",
    issuer: "Udemy",
    year: "2026",
    category: "webDev",
    image: null,
    link: "/assets/certificates/Certificate_Udemy_Full-Stack-Dev_Rehan-Fazal.pdf"
  },
  {
    certId: "02",
    title: "HTML Certificate",
    issuer: "SoloLearn",
    year: "2021",
    category: "webDev",
    image: "/assets/certificates/HTML_certificate.jpg",
    link: "/assets/certificates/HTML_certificate.jpg"
  },
  {
    certId: "03",
    title: "CSS Certificate",
    issuer: "SoloLearn",
    year: "2021",
    category: "webDev",
    image: "/assets/certificates/CSS_certificate.jpg",
    link: "/assets/certificates/CSS_certificate.jpg"
  },
  {
    certId: "04",
    title: "JavaScript Certificate",
    issuer: "SoloLearn",
    year: "2022",
    category: "webDev",
    image: "/assets/certificates/JavaScript_certificate.jpg",
    link: "/assets/certificates/JavaScript_certificate.jpg"
  },
  {
    certId: "05",
    title: "Introduction to C++",
    issuer: "SoloLearn",
    year: "2022",
    category: "softwareDev",
    image: "/assets/certificates/Introduction to C++_certificate.jpg",
    link: "/assets/certificates/Introduction to C++_certificate.jpg"
  },
  {
    certId: "06",
    title: "Git Certificate",
    issuer: "Great Learning",
    year: "2025",
    category: "softwareDev",
    image: null,
    link: "/assets/certificates/certificate git.pdf"
  },
  {
    certId: "07",
    title: "Git Intermediate",
    issuer: "Great Learning",
    year: "2025",
    category: "softwareDev",
    image: null,
    link: "/assets/certificates/certificate git intermediate.pdf"
  },
  {
    certId: "08",
    title: "GitHub Certificate",
    issuer: "Great Learning",
    year: "2025",
    category: "softwareDev",
    image: null,
    link: "/assets/certificates/certificate github.pdf"
  },
  {
    certId: "09",
    title: "GitHub Intermediate",
    issuer: "Great Learning",
    year: "2025",
    category: "softwareDev",
    image: null,
    link: "/assets/certificates/certificate github intermediate.pdf"
  },
  {
    certId: "10",
    title: "GitHub Foundations",
    issuer: "Great Learning",
    year: "2025",
    category: "softwareDev",
    image: null,
    link: "/assets/certificates/certificate githubFoundations.pdf"
  },
  {
    certId: "11",
    title: "Cloud Computing Certificate",
    issuer: "NPTEL / Coursera",
    year: "2025",
    category: "aiMl",
    image: null,
    link: "/assets/certificates/Rehan_Fazal_Cloud_Certificate.pdf"
  },
  {
    certId: "12",
    title: "IIT Delhi Hackathon — Participant",
    issuer: "IIT Delhi",
    year: "2025",
    category: "softwareDev",
    image: null,
    link: "/assets/certificates/IITD-hackathon.pdf"
  },
  {
    certId: "13",
    title: "Smart Campus Hackathon 2026 — National Innovation Challenge",
    issuer: "National Innovation Challenge",
    year: "2026",
    category: "softwareDev",
    image: null,
    link: "/assets/certificates/Certificate of Participation in Smart Campus Hackathon 2026 – National Innovation Challenge.mht"
  }
];

const journeyData = [
  {
    year: '2021',
    title: 'First lines of code',
    desc: 'Started with SoloLearn — HTML, CSS, and JavaScript, out of pure curiosity.',
    x: 150, y: 480,
  },
  {
    year: '2022',
    title: 'JEE + the CS fundamentals',
    desc: 'JEE prep alongside Python and SQL as a school subject — basics to intermediate.',
    x: 345, y: 380,
  },
  {
    year: '2024',
    title: 'Computer Engineering begins',
    desc: 'Started my B.Tech in Computer Engineering, set up GitHub, LinkedIn, and the rest.',
    x: 550, y: 280,
  },
  {
    year: '2025',
    title: 'DSA + MERN',
    desc: 'Deep into DSA on LeetCode, and building full-stack apps with the MERN stack.',
    x: 755, y: 180,
  },
  {
    year: '2026',
    title: 'Python + Machine Learning',
    desc: 'Shifting focus toward Python, ML, and shipping real projects.',
    x: 960, y: 80,
  },
];

// ─── Seed Function ───────────────────────────────────────────

const seedDB = async () => {
  if (!process.env.MONGO_URI) {
    console.error('❌ MONGO_URI is missing in your .env file!');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('📦 Connected to MongoDB for seeding...');

    // Clear existing data
    await PersonalInfo.deleteMany({});
    await Project.deleteMany({});
    await Skill.deleteMany({});
    await Certificate.deleteMany({});
    await Journey.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Insert seed data
    await PersonalInfo.create(personalInfoData);
    console.log('✅ Personal info seeded');

    await Project.insertMany(projectsData);
    console.log(`✅ ${projectsData.length} projects seeded`);

    await Skill.insertMany(skillsData);
    console.log(`✅ ${skillsData.length} skills seeded`);

    await Certificate.insertMany(certificatesData);
    console.log(`✅ ${certificatesData.length} certificates seeded`);

    await Journey.insertMany(journeyData);
    console.log(`✅ ${journeyData.length} journey seeded`);

    console.log('\n🎉 Database seeded successfully!');
  } catch (error) {
    console.error('❌ Seed error:', error);
  } finally {
    // Safely disconnect from DB before exiting
    await mongoose.connection.close();
    process.exit(0);
  }
};

seedDB();