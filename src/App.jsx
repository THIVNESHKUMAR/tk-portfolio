import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  useLayoutEffect,
} from "react";

import { useWheelRouteNav } from "./useWheelRouteNav";

import {
  Routes,
  Route,
  NavLink,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import {
  Float,
  OrbitControls,
  Environment,
  MeshTransmissionMaterial,
} from "@react-three/drei";
import { loadFull } from "tsparticles";
import Particles from "react-tsparticles";
import { z } from "zod";

/* ---------------------------
   THEME / DATA (EDIT THESE)
----------------------------*/
const YOU = {
  name: "Thivnesh Kumar Venugopal",
  role: "UI/UX Designer • Front-End Developer",
  intro:
    "I design cinematic, data-driven interfaces and build responsive front-ends with polished micro-interactions.",
  achievements: [
    "3+ years delivering enterprise dashboards",
    "UI/UX research: URS/SRS, UAT, user manuals",
    "Vue/Vuetify + modern React experiments",
  ],
  resumeUrl: "/resume.pdf",
  photoUrl: "/profile.jpeg", // ✅ add this
};

const PROJECTS = [
  {
    title: "Reliability Analytics Dashboard",
    tag: "UI/UX + Front-End",
    desc: "Operational analytics with drilldowns + filters + export.",
    href: "#",
  },
  {
    title: "Calendar Work Order Planner",
    tag: "Web App",
    desc: "Look-ahead scheduling view with constraints + trends.",
    href: "#",
  },
  {
    title: "Corrosion Analytics Portal",
    tag: "Data + UI",
    desc: "Engineer-first visual language and interaction model.",
    href: "#",
  },
  {
    title: "Design System Kit",
    tag: "Components",
    desc: "Tokens, patterns, motion guidelines, and reusable UI.",
    href: "#",
  },
];

const ARTICLES = [
  {
    title: "Designing dashboards for operational clarity",
    date: "2025",
    href: "#",
  },
  { title: "Motion as usability, not decoration", date: "2025", href: "#" },
  {
    title: "Building consistent UI tokens across products",
    date: "2024",
    href: "#",
  },
];

const PROFILES = [
  {
    title: "GitHub",
    desc: "Code + case studies + experiments",
    href: "https://github.com/",
  },
  {
    title: "LeetCode",
    desc: "DSA practice + streaks",
    href: "https://leetcode.com/",
  },
  {
    title: "SkillRack",
    desc: "Skill challenges + certifications",
    href: "https://www.skillrack.com/",
  },
];

/* ---------------------------
   APP SHELL
----------------------------*/
export default function App() {
  // Toggle this to enable/disable wheel navigation between routes
  const WHEEL_HIJACK = true;
  useWheelRouteNav(WHEEL_HIJACK);

  const location = useLocation();
  return (
    <>
      <BackgroundFX />
      <TopNav />

      {/* Full-page cinematic route transitions */}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HeroAbout />} />
          <Route path="/cta" element={<CTA />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/profiles" element={<Profiles />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
    </>
  );
}

function TopNav() {
  const navInnerRef = useRef(null);

  useLayoutEffect(() => {
    const el = navInnerRef.current;
    if (!el) return;

    const apply = () => {
      const rect = el.getBoundingClientRect();

      // nav is fixed at top:14px, so total space = top offset + nav height
      const topOffset = 14;
      const navH = Math.ceil(rect.height + topOffset);

      document.documentElement.style.setProperty("--navH", `${navH}px`);
    };

    apply();

    const ro = new ResizeObserver(apply);
    ro.observe(el);

    window.addEventListener("resize", apply);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", apply);
    };
  }, []);

  const links = [
    ["/", "Home"],
    ["/cta", "CTA"],
    ["/resume", "Resume"],
    ["/projects", "Projects"],
    ["/skills", "Skills"],
    ["/contact", "Contact"],
    ["/articles", "Articles"],
    ["/profiles", "Profiles"],
  ];

  return (
    <div className="nav">
      <div className="container">
        <div ref={navInnerRef} className="inner card">
          <div className="badge">
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: 99,
                background: "rgba(80,130,255,0.9)",
                boxShadow: "0 0 24px rgba(80,130,255,0.6)",
              }}
            />
            {YOU.name} — {YOU.role}
          </div>

          <div className="links">
            {links.map(([to, label]) => (
              <NavLink
                key={to}
                to={to}
                className="pill"
                style={({ isActive }) => ({
                  background: isActive ? "rgba(255,255,255,0.10)" : undefined,
                })}
              >
                {label}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------
   GLOBAL BACKGROUND FX
   - Particles (interactive)
   - Gradient blur blobs (animated)
----------------------------*/
function BackgroundFX() {
  const prefersReduced = useReducedMotion();

  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  const options = useMemo(() => {
    // Keep particles lightweight to avoid mobile jank.
    return {
      fullScreen: { enable: true, zIndex: 0 },
      background: { color: { value: "#06070b" } },
      fpsLimit: 60,
      detectRetina: true,
      interactivity: {
        events: {
          onHover: { enable: !prefersReduced, mode: "repulse" },
          onClick: { enable: true, mode: "push" },
        },
        modes: {
          repulse: { distance: 110, duration: 0.2 },
          push: { quantity: 2 },
        },
      },
      particles: {
        number: { value: 60, density: { enable: true, area: 900 } },
        color: { value: ["#7aa7ff", "#ff77d4", "#6dffd9"] },
        opacity: { value: 0.35 },
        size: { value: { min: 1, max: 3 } },
        links: { enable: true, distance: 150, opacity: 0.15, width: 1 },
        move: { enable: true, speed: 0.6, outModes: { default: "out" } },
      },
    };
  }, [prefersReduced]);

  return (
    <>
      <GradientBlobs />
    </>
  );
}

function GradientBlobs() {
  // Animated blur blobs (cinematic background)
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          position: "absolute",
          inset: 0,
          filter: "blur(70px)",
          opacity: 0.85,
        }}
      >
        <motion.div
          animate={{
            x: [0, 80, -20, 0],
            y: [0, -40, 60, 0],
            scale: [1, 1.15, 0.95, 1],
          }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            top: "-10%",
            left: "-10%",
            width: 520,
            height: 520,
            borderRadius: 999,
            background:
              "radial-gradient(circle at 30% 30%, rgba(80,130,255,0.55), transparent 60%)",
          }}
        />
        <motion.div
          animate={{
            x: [0, -60, 40, 0],
            y: [0, 70, -30, 0],
            scale: [1, 0.95, 1.2, 1],
          }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            bottom: "-15%",
            right: "-10%",
            width: 620,
            height: 620,
            borderRadius: 999,
            background:
              "radial-gradient(circle at 40% 40%, rgba(255,80,190,0.45), transparent 60%)",
          }}
        />
        <motion.div
          animate={{ x: [0, 40, -60, 0], y: [0, 30, -70, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            top: "35%",
            left: "55%",
            width: 520,
            height: 520,
            borderRadius: 999,
            background:
              "radial-gradient(circle at 50% 50%, rgba(80,255,210,0.25), transparent 60%)",
          }}
        />
      </motion.div>

      {/* subtle vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(1200px 700px at 50% 40%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.65) 100%)",
        }}
      />
    </div>
  );
}

/* ---------------------------
   ROUTE TRANSITIONS (unique per page)
----------------------------*/
function Page({ children, variant = "cinematic" }) {
  const location = useLocation();
  const prefersReduced = useReducedMotion();

  const variants = {
    cinematic: {
      initial: { opacity: 0, y: prefersReduced ? 0 : 18, filter: "blur(10px)" },
      animate: { opacity: 1, y: 0, filter: "blur(0px)" },
      exit: { opacity: 0, y: prefersReduced ? 0 : -18, filter: "blur(10px)" },
      transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
    },
    parallaxSwipe: {
      initial: {
        opacity: 0,
        x: prefersReduced ? 0 : 60,
        rotate: prefersReduced ? 0 : 1.5,
        filter: "blur(12px)",
      },
      animate: { opacity: 1, x: 0, rotate: 0, filter: "blur(0px)" },
      exit: {
        opacity: 0,
        x: prefersReduced ? 0 : -60,
        rotate: prefersReduced ? 0 : -1.5,
        filter: "blur(12px)",
      },
      transition: { duration: 0.6, ease: [0.2, 0.9, 0.2, 1] },
    },
    zoomCut: {
      initial: {
        opacity: 0,
        scale: prefersReduced ? 1 : 0.96,
        filter: "blur(12px)",
      },
      animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
      exit: {
        opacity: 0,
        scale: prefersReduced ? 1 : 1.04,
        filter: "blur(12px)",
      },
      transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
    },
    curtain: {
      initial: { opacity: 0, clipPath: "inset(0 0 100% 0 round 24px)" },
      animate: { opacity: 1, clipPath: "inset(0 0 0% 0 round 24px)" },
      exit: { opacity: 0, clipPath: "inset(100% 0 0% 0 round 24px)" },
      transition: { duration: 0.7, ease: [0.25, 1, 0.25, 1] },
    },
  };

  const v = variants[variant] ?? variants.cinematic;

  return (
    <motion.main
      key={location.pathname}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={v}
      transition={v.transition}
      style={{ position: "relative", zIndex: 2 }}
    >
      {children}
    </motion.main>
  );
}

/* ---------------------------
   3D ICON / SCENES
----------------------------*/
function ThreeIcon({ intensity = 1 }) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 3.8], fov: 45 }}
      style={{ width: "100%", height: 320, borderRadius: 22 }}
    >
      <ambientLight intensity={0.6 * intensity} />
      <directionalLight position={[3, 3, 3]} intensity={1.4 * intensity} />
      <Environment preset="city" />

      <Float speed={1.6} rotationIntensity={1.1} floatIntensity={1.2}>
        <mesh>
          <torusKnotGeometry args={[0.85, 0.28, 160, 18]} />
          <MeshTransmissionMaterial
            thickness={0.7}
            roughness={0.1}
            transmission={1}
            ior={1.2}
            chromaticAberration={0.06}
            distortion={0.25}
            distortionScale={0.25}
            temporalDistortion={0.08}
          />
        </mesh>
      </Float>

      {/* Keep controls subtle */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        maxPolarAngle={Math.PI * 0.65}
        minPolarAngle={Math.PI * 0.35}
      />
    </Canvas>
  );
}

function ProjectHoverScene({ active }) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 4.2], fov: 50 }}
      style={{ width: "100%", height: 220 }}
    >
      <ambientLight intensity={0.65} />
      <directionalLight position={[2, 2, 2]} intensity={1.2} />
      <Float
        speed={active ? 2.2 : 1.1}
        rotationIntensity={active ? 1.8 : 0.8}
        floatIntensity={active ? 1.4 : 0.6}
      >
        <mesh>
          <icosahedronGeometry args={[1.05, 1]} />
          <meshStandardMaterial
            metalness={0.7}
            roughness={0.2}
            color={active ? "#9cb9ff" : "#7aa7ff"}
          />
        </mesh>
      </Float>
      <Environment preset="warehouse" />
    </Canvas>
  );
}

/* ---------------------------
   SOCIAL ICONS (no libs, simple SVG)
----------------------------*/
function SocialLinks() {
  const items = [
    {
      name: "LinkedIn",
      href: "https://www.linkedin.com/in/thivnesh-kumar-v-a84681176/",
      icon: LinkedinIcon,
    },

    {
      name: "GitHub",
      href: "https://github.com/THIVNESHKUMAR",
      icon: GithubIcon,
    },
  ];

  return (
    <div className="footerSocial">
      {items.map((it) => {
        const Icon = it.icon;
        return (
          <motion.a
            key={it.name}
            className="iconBtn"
            href={it.href}
            target="_blank"
            rel="noreferrer"
            whileHover={{
              y: -4,
              scale: 1.06,
              boxShadow:
                "0 0 0 1px rgba(255,255,255,0.12), 0 18px 60px rgba(80,130,255,0.18)",
              filter: "brightness(1.12)",
            }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 420, damping: 22 }}
            aria-label={it.name}
            title={it.name}
          >
            <Icon />
          </motion.a>
        );
      })}
    </div>
  );
}

/* ---------------------------
   PAGES
----------------------------*/
function HeroAbout() {
  return (
    <Page variant="cinematic">
      <section className="page-hero">
        <div className="container grid cols-2">
          <motion.div
            className="card"
            style={{ padding: 22 }} // ✅ add this back
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.05,
            }}
          >
            <span className="badge">
              ✨ Cinematic UI • Motion-first • Dark Aesthetic
            </span>
            <h1 className="h1">
              {YOU.name}.{" "}
              <span style={{ color: "rgba(155,190,255,0.95)" }}>
                I build experiences
              </span>{" "}
              — not pages.
            </h1>

            <hr className="sep" />

            <motion.div
              initial="hidden"
              animate="show"
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.08 } },
              }}
              className="grid"
              style={{ gap: 10 }}
            >
              {YOU.achievements.map((a) => (
                <motion.div
                  key={a}
                  className="card"
                  style={{
                    padding: "12px 14px",
                    background: "rgba(255,255,255,0.04)",
                  }}
                  variants={{
                    hidden: { opacity: 0, x: -10, filter: "blur(6px)" },
                    show: { opacity: 1, x: 0, filter: "blur(0px)" },
                  }}
                >
                  <div className="p" style={{ margin: 0 }}>
                    <span style={{ color: "rgba(255,255,255,0.9)" }}>•</span>{" "}
                    {a}
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <div style={{ height: 16 }} />

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <FancyButton to="/projects" label="Explore Projects" />
              <GhostButton to="/contact" label="Contact Me" />
            </div>

            <div style={{ height: 16 }} />
            <SocialLinks />
          </motion.div>

          <motion.div
            className="card"
            style={{ padding: 18, position: "relative", overflow: "hidden" }}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.12,
            }}
          >
            <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
              {/* Profile photo */}
              <div
                style={{
                  width: 300,
                  height: 300,
                  borderRadius: 22,
                  overflow: "hidden",
                  border: "1px solid rgba(255,255,255,0.14)",
                  background: "rgba(255,255,255,0.04)",
                  boxShadow: "0 20px 70px rgba(0,0,0,0.45)",
                  flex: "0 0 auto",
                }}
              >
                <img
                  src={YOU.photoUrl}
                  alt={YOU.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </div>

              {/* Quick identity */}
              <div style={{ minWidth: 0 }}>
                <div className="badge" style={{ marginBottom: 8 }}>
                  About Me
                </div>
                <div className="h2" style={{ margin: 0, lineHeight: 1.2 }}>
                  {YOU.name}
                </div>
                <p className="p" style={{ marginTop: 8 }}>
                  {YOU.role}
                </p>
              </div>
            </div>

            <div style={{ height: 14 }} />

            {/* Short about */}
            <div
              className="card"
              style={{
                padding: 14,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              <p className="p" style={{ margin: 0 }}>
                {YOU.intro}
              </p>
            </div>

            <div style={{ height: 14 }} />

            {/* Buttons */}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <FancyButton to="/resume" label="View Resume" />
              <GhostButton to="/projects" label="See Work" />
            </div>

            <div style={{ height: 14 }} />
            <SocialLinks />

            {/* Soft glow overlay */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                inset: -80,
                background:
                  "radial-gradient(circle at 30% 30%, rgba(80,130,255,0.16), transparent 55%), radial-gradient(circle at 70% 70%, rgba(255,80,190,0.12), transparent 55%)",
                filter: "blur(30px)",
                pointerEvents: "none",
                zIndex: -1,
              }}
            />
          </motion.div>
        </div>
      </section>
    </Page>
  );
}

function CTA() {
  return (
    <Page variant="parallaxSwipe">
      <section className="page">
        <div className="container">
          <motion.div
            className="card"
            style={{ padding: 24, maxWidth: 920, margin: "0 auto" }}
          >
            <span className="badge">⚡ Call to Action</span>
            <h2 className="h1" style={{ marginTop: 10 }}>
              Let’s build a{" "}
              <span style={{ color: "rgba(255,140,220,0.95)" }}>
                premium experience
              </span>{" "}
              together.
            </h2>
            <p className="p">
              This page uses a different transition style (parallax swipe) and a
              high-impact CTA with glow + motion blur on hover.
            </p>

            <div style={{ height: 18 }} />

            <motion.a
              href="/contact"
              className="card"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "14px 18px",
                borderRadius: 18,
                background:
                  "linear-gradient(135deg, rgba(90,150,255,0.25), rgba(255,80,190,0.15))",
                border: "1px solid rgba(255,255,255,0.14)",
                position: "relative",
                overflow: "hidden",
              }}
              whileHover={{
                y: -5,
                scale: 1.03,
                filter:
                  "drop-shadow(0px 18px 60px rgba(80,130,255,0.22)) blur(0px)",
              }}
              whileTap={{ scale: 0.99 }}
              transition={{ type: "spring", stiffness: 420, damping: 18 }}
            >
              <motion.span
                aria-hidden
                animate={{ x: [-40, 240] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
                style={{
                  position: "absolute",
                  top: -60,
                  left: -60,
                  width: 120,
                  height: 220,
                  background:
                    "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.22), rgba(255,255,255,0))",
                  transform: "rotate(18deg)",
                }}
              />
              <span style={{ fontWeight: 700 }}>Contact / Hire Me</span>
              <span style={{ color: "rgba(255,255,255,0.75)" }}>→</span>
            </motion.a>
          </motion.div>
        </div>
      </section>
    </Page>
  );
}

function Resume() {
  const [clicked, setClicked] = useState(false);

  return (
    <Page variant="zoomCut">
      <section className="page">
        <div className="container">
          <motion.div
            className="card"
            style={{ padding: 24, maxWidth: 860, margin: "0 auto" }}
          >
            <span className="badge">📄 Downloadable Resume</span>
            <h2 className="h1" style={{ marginTop: 10 }}>
              Resume that feels like an interaction.
            </h2>
            <p className="p">
              Put your PDF into{" "}
              <code style={{ color: "rgba(255,255,255,0.85)" }}>
                /public/resume.pdf
              </code>{" "}
              and update the link.
            </p>

            <div style={{ height: 18 }} />

            <motion.a
              href={YOU.resumeUrl}
              download
              onClick={() => setClicked(true)}
              className="card"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 12,
                padding: "14px 16px",
                borderRadius: 18,
                border: "1px solid rgba(255,255,255,0.14)",
                background: "rgba(255,255,255,0.05)",
              }}
              whileHover={{
                y: -4,
                boxShadow: "0 18px 70px rgba(255,80,190,0.18)",
              }}
              whileTap={{ scale: 0.98 }}
            >
              <span style={{ fontWeight: 700 }}>Download PDF</span>
              <motion.span
                animate={clicked ? { rotate: [0, 18, -18, 0] } : {}}
                transition={{ duration: 0.35 }}
                style={{ color: "rgba(255,255,255,0.75)" }}
              >
                ⬇
              </motion.span>
            </motion.a>
          </motion.div>
        </div>
      </section>
    </Page>
  );
}

function Projects() {
  return (
    <Page variant="curtain">
      <section className="page">
        <div className="container">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
              alignItems: "baseline",
              flexWrap: "wrap",
            }}
          >
            <div>
              <span className="badge">🧩 Projects</span>
              <h2 className="h1" style={{ marginTop: 10 }}>
                Hover feels 3D. Scroll stays smooth.
              </h2>
              <p className="p">
                Grid cards lazy-animate into view. Each card has a 3D hover
                scene (Three.js).
              </p>
            </div>
          </div>

          <div style={{ height: 16 }} />

          <div className="grid cols-3" style={{ alignItems: "stretch" }}>
            {PROJECTS.map((p, idx) => (
              <ProjectCard key={p.title} project={p} index={idx} />
            ))}
          </div>
        </div>
      </section>
    </Page>
  );
}

function ProjectCard({ project, index }) {
  const [hover, setHover] = useState(false);

  return (
    <motion.a
      href={project.href}
      className="card"
      style={{
        padding: 14,
        overflow: "hidden",
        position: "relative",
        minHeight: 360,
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20%" }}
      transition={{
        duration: 0.55,
        delay: index * 0.04,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{
        y: -8,
        boxShadow: "0 26px 80px rgba(0,0,0,0.55)",
        borderColor: "rgba(255,255,255,0.18)",
      }}
    >
      <div
        style={{
          borderRadius: 18,
          overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.10)",
        }}
      >
        <ProjectHoverScene active={hover} />
      </div>

      <div style={{ padding: 10 }}>
        <div className="badge" style={{ marginTop: 10 }}>
          {project.tag}
        </div>
        <div className="h2" style={{ marginTop: 10 }}>
          {project.title}
        </div>
        <p className="p">{project.desc}</p>
      </div>

      <motion.div
        aria-hidden
        animate={hover ? { opacity: 1 } : { opacity: 0 }}
        style={{
          position: "absolute",
          inset: -80,
          background:
            "radial-gradient(circle at 30% 30%, rgba(80,130,255,0.18), transparent 55%), radial-gradient(circle at 70% 70%, rgba(255,80,190,0.14), transparent 55%)",
          filter: "blur(30px)",
          pointerEvents: "none",
        }}
      />
    </motion.a>
  );
}

function Skills() {
  const skills = [
    { name: "UI/UX", value: 92 },
    { name: "Front-End", value: 88 },
    { name: "Motion Design", value: 84 },
    { name: "Data Viz", value: 80 },
    { name: "3D/Creative Dev", value: 72 },
  ];

  return (
    <Page variant="cinematic">
      <section className="page">
        <div className="container grid cols-2">
          <motion.div className="card" style={{ padding: 24 }}>
            <span className="badge">🧠 Skills</span>
            <h2 className="h1" style={{ marginTop: 10 }}>
              Animated proficiency.
            </h2>
            <p className="p">
              Bars + counters animate with Framer Motion. No jank, mobile
              friendly.
            </p>

            <div style={{ height: 18 }} />

            <div className="grid" style={{ gap: 12 }}>
              {skills.map((s, i) => (
                <SkillBar key={s.name} skill={s} index={i} />
              ))}
            </div>
          </motion.div>

          <motion.div className="card" style={{ padding: 18 }}>
            <div className="h2" style={{ marginBottom: 8 }}>
              Micro-interactions
            </div>
            <p className="p">
              Small touches that feel premium: hover lift, glow, blur, and
              cinematic easing.
            </p>
            <div style={{ height: 12 }} />
            <SocialLinks />
          </motion.div>
        </div>
      </section>
    </Page>
  );
}

function SkillBar({ skill, index }) {
  const prefersReduced = useReducedMotion();
  const [display, setDisplay] = useState(0);

  return (
    <motion.div
      className="card"
      style={{ padding: 14, background: "rgba(255,255,255,0.04)" }}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{
        duration: 0.5,
        delay: index * 0.04,
        ease: [0.22, 1, 0.36, 1],
      }}
      onViewportEnter={() => {
        if (prefersReduced) return setDisplay(skill.value);
        // Lightweight counter animation
        const start = performance.now();
        const dur = 700;
        const tick = (t) => {
          const p = Math.min(1, (t - start) / dur);
          setDisplay(Math.round(p * skill.value));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }}
    >
      <div
        style={{ display: "flex", justifyContent: "space-between", gap: 10 }}
      >
        <div style={{ fontWeight: 700 }}>{skill.name}</div>
        <div style={{ color: "rgba(255,255,255,0.72)" }}>{display}%</div>
      </div>

      <div style={{ height: 10 }} />

      <div
        style={{
          height: 10,
          borderRadius: 999,
          border: "1px solid rgba(255,255,255,0.10)",
          background: "rgba(0,0,0,0.25)",
          overflow: "hidden",
        }}
      >
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${skill.value}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{
            height: "100%",
            borderRadius: 999,
            background:
              "linear-gradient(90deg, rgba(90,150,255,0.75), rgba(255,80,190,0.55), rgba(80,255,210,0.45))",
            boxShadow: "0 0 22px rgba(80,130,255,0.25)",
          }}
        />
      </div>
    </motion.div>
  );
}

function Contact() {
  const schema = useMemo(
    () =>
      z.object({
        name: z.string().min(2, "Name is too short"),
        email: z.string().email("Enter a valid email"),
        message: z.string().min(10, "Message should be at least 10 characters"),
      }),
    [],
  );

  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSent(false);

    const res = schema.safeParse(form);
    if (!res.success) {
      const next = {};
      res.error.issues.forEach((i) => (next[i.path[0]] = i.message));
      setErrors(next);
      return;
    }
    setErrors({});
    setSending(true);

    // Replace this with your real email backend (e.g. Formspree, Resend, AWS SES, etc.)
    await new Promise((r) => setTimeout(r, 800));

    setSending(false);
    setSent(true);
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <Page variant="parallaxSwipe">
      <section className="page">
        <div className="container grid cols-2">
          <motion.div className="card" style={{ padding: 24 }}>
            <span className="badge">✉️ Contact</span>
            <h2 className="h1" style={{ marginTop: 10 }}>
              Let’s talk.
            </h2>
            <p className="p">
              Form validation + animated send success. Hook it to a real email
              service when you’re ready.
            </p>

            <div style={{ height: 16 }} />

            <form onSubmit={onSubmit} className="grid" style={{ gap: 10 }}>
              <Field
                label="Name"
                value={form.name}
                error={errors.name}
                onChange={(v) => setForm((s) => ({ ...s, name: v }))}
              />
              <Field
                label="Email"
                value={form.email}
                error={errors.email}
                onChange={(v) => setForm((s) => ({ ...s, email: v }))}
              />
              <Field
                label="Message"
                textarea
                value={form.message}
                error={errors.message}
                onChange={(v) => setForm((s) => ({ ...s, message: v }))}
              />

              <div
                style={{
                  display: "flex",
                  gap: 10,
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <motion.button
                  type="submit"
                  disabled={sending}
                  className="card"
                  style={{
                    padding: "12px 16px",
                    borderRadius: 16,
                    border: "1px solid rgba(255,255,255,0.14)",
                    background:
                      "linear-gradient(135deg, rgba(90,150,255,0.22), rgba(255,80,190,0.12))",
                    color: "rgba(255,255,255,0.92)",
                    cursor: sending ? "not-allowed" : "pointer",
                  }}
                  whileHover={{
                    y: -3,
                    boxShadow: "0 22px 80px rgba(80,130,255,0.18)",
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  {sending ? "Sending..." : "Send Message"}
                </motion.button>

                <AnimatePresence>
                  {sent && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, filter: "blur(8px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, y: 8, filter: "blur(8px)" }}
                      transition={{ duration: 0.4 }}
                      className="badge"
                      style={{
                        borderColor: "rgba(80,255,210,0.35)",
                        color: "rgba(220,255,248,0.9)",
                      }}
                    >
                      ✅ Sent successfully
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </form>
          </motion.div>

          <motion.div className="card" style={{ padding: 18 }}>
            <div className="h2" style={{ marginBottom: 8 }}>
              Social
            </div>
            <p className="p">Hover interactions + spring motion.</p>
            <div style={{ height: 12 }} />
            <SocialLinks />
          </motion.div>
        </div>
      </section>
    </Page>
  );
}

function Field({ label, value, onChange, error, textarea }) {
  return (
    <div className="grid" style={{ gap: 6 }}>
      <div
        style={{ display: "flex", justifyContent: "space-between", gap: 10 }}
      >
        <div style={{ fontWeight: 700 }}>{label}</div>
        {error && (
          <div style={{ color: "rgba(255,140,160,0.95)", fontSize: 12 }}>
            {error}
          </div>
        )}
      </div>
      {textarea ? (
        <textarea
          className="textarea"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          className="input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
}

function Articles() {
  return (
    <Page variant="zoomCut">
      <section className="page">
        <div className="container">
          <motion.div className="card" style={{ padding: 24 }}>
            <span className="badge">📝 Featured Articles</span>
            <h2 className="h1" style={{ marginTop: 10 }}>
              Readable. Smooth. Soft fade-ins.
            </h2>
            <p className="p">List loads in with staggered fade + blur.</p>

            <div style={{ height: 16 }} />

            <motion.div
              className="grid"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.08 } },
              }}
            >
              {ARTICLES.map((a) => (
                <motion.a
                  key={a.title}
                  href={a.href}
                  className="card"
                  style={{ padding: 16, background: "rgba(255,255,255,0.04)" }}
                  variants={{
                    hidden: { opacity: 0, y: 12, filter: "blur(10px)" },
                    show: { opacity: 1, y: 0, filter: "blur(0px)" },
                  }}
                  whileHover={{ y: -4, borderColor: "rgba(255,255,255,0.18)" }}
                >
                  <div className="badge">{a.date}</div>
                  <div className="h2" style={{ marginTop: 10 }}>
                    {a.title}
                  </div>
                  <p className="p">Open →</p>
                </motion.a>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>
    </Page>
  );
}

function Profiles() {
  return (
    <Page variant="curtain">
      <section className="page">
        <div className="container">
          <motion.div className="card" style={{ padding: 24 }}>
            <span className="badge">💻 Coding Profiles</span>
            <h2 className="h1" style={{ marginTop: 10 }}>
              Cards that pop in.
            </h2>
            <p className="p">
              Use this for GitHub, LeetCode, SkillRack, HackerRank, etc.
            </p>

            <div style={{ height: 16 }} />

            <div className="grid cols-3">
              {PROFILES.map((p, i) => (
                <motion.a
                  key={p.title}
                  href={p.href}
                  target="_blank"
                  rel="noreferrer"
                  className="card"
                  style={{ padding: 16, background: "rgba(255,255,255,0.04)" }}
                  initial={{
                    opacity: 0,
                    scale: 0.96,
                    y: 12,
                    filter: "blur(12px)",
                  }}
                  whileInView={{
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    filter: "blur(0px)",
                  }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{
                    duration: 0.55,
                    delay: i * 0.05,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  whileHover={{
                    y: -6,
                    boxShadow: "0 28px 90px rgba(0,0,0,0.55)",
                  }}
                >
                  <div className="h2">{p.title}</div>
                  <p className="p">{p.desc}</p>
                  <div style={{ height: 10 }} />
                  <div className="badge">Visit →</div>
                </motion.a>
              ))}
            </div>

            <div style={{ height: 18 }} />
            <SocialLinks />
          </motion.div>
        </div>
      </section>
    </Page>
  );
}

function NotFound() {
  const nav = useNavigate();
  return (
    <Page variant="cinematic">
      <section className="page">
        <div className="container">
          <div
            className="card"
            style={{ padding: 24, maxWidth: 820, margin: "0 auto" }}
          >
            <h2 className="h1">404</h2>
            <p className="p">This route doesn’t exist.</p>
            <div style={{ height: 14 }} />
            <motion.button
              className="card"
              style={{
                padding: "12px 16px",
                borderRadius: 16,
                border: "1px solid rgba(255,255,255,0.14)",
                background: "rgba(255,255,255,0.05)",
                color: "rgba(255,255,255,0.92)",
                cursor: "pointer",
              }}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => nav("/")}
            >
              Back Home
            </motion.button>
          </div>
        </div>
      </section>
    </Page>
  );
}

/* ---------------------------
   BUTTONS
----------------------------*/
function FancyButton({ to, label }) {
  return (
    <motion.a
      href={to}
      className="card"
      style={{
        padding: "12px 16px",
        borderRadius: 16,
        border: "1px solid rgba(255,255,255,0.14)",
        background:
          "linear-gradient(135deg, rgba(90,150,255,0.22), rgba(255,80,190,0.12))",
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        position: "relative",
        overflow: "hidden",
      }}
      whileHover={{
        y: -4,
        boxShadow: "0 28px 90px rgba(80,130,255,0.18)",
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 420, damping: 18 }}
    >
      <motion.span
        aria-hidden
        animate={{ x: [-60, 240] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
        style={{
          position: "absolute",
          top: -60,
          left: -60,
          width: 120,
          height: 240,
          background:
            "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.20), rgba(255,255,255,0))",
          transform: "rotate(18deg)",
        }}
      />
      <span style={{ fontWeight: 800 }}>{label}</span>
      <span style={{ color: "rgba(255,255,255,0.7)" }}>→</span>
    </motion.a>
  );
}

function GhostButton({ to, label }) {
  return (
    <motion.a
      href={to}
      className="card"
      style={{
        padding: "12px 16px",
        borderRadius: 16,
        border: "1px solid rgba(255,255,255,0.14)",
        background: "rgba(255,255,255,0.04)",
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
      }}
      whileHover={{ y: -4, background: "rgba(255,255,255,0.06)" }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 420, damping: 18 }}
    >
      <span style={{ fontWeight: 700 }}>{label}</span>
      <span style={{ color: "rgba(255,255,255,0.7)" }}>→</span>
    </motion.a>
  );
}

/* ---------------------------
   SIMPLE SVG ICONS
----------------------------*/
function IconBase({ children }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      {children}
    </svg>
  );
}
function GithubIcon() {
  return (
    <IconBase>
      <path
        d="M12 2C6.48 2 2 6.58 2 12.23c0 4.52 2.87 8.35 6.84 9.7.5.1.68-.22.68-.48v-1.69c-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.1-1.49-1.1-1.49-.9-.63.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.04 1.03-2.76-.1-.26-.45-1.31.1-2.73 0 0 .85-.28 2.8 1.05A9.5 9.5 0 0 1 12 6.87c.85 0 1.71.12 2.51.35 1.95-1.33 2.8-1.05 2.8-1.05.55 1.42.2 2.47.1 2.73.64.72 1.03 1.64 1.03 2.76 0 3.94-2.34 4.8-4.57 5.06.36.32.68.95.68 1.92v2.84c0 .26.18.59.69.48A10.05 10.05 0 0 0 22 12.23C22 6.58 17.52 2 12 2Z"
        fill="rgba(255,255,255,0.85)"
      />
    </IconBase>
  );
}
function LinkedinIcon() {
  return (
    <IconBase>
      <path
        d="M6.5 6.7A1.9 1.9 0 1 0 6.5 2.9a1.9 1.9 0 0 0 0 3.8Z"
        fill="rgba(255,255,255,0.85)"
      />
      <path d="M4.7 21V8.6h3.6V21H4.7Z" fill="rgba(255,255,255,0.85)" />
      <path
        d="M10.2 21V8.6h3.4v1.7h.05c.47-.9 1.62-1.85 3.34-1.85 3.57 0 4.23 2.4 4.23 5.52V21h-3.6v-6c0-1.43-.03-3.26-1.95-3.26-1.95 0-2.25 1.56-2.25 3.16V21h-3.62Z"
        fill="rgba(255,255,255,0.85)"
      />
    </IconBase>
  );
}
function InstagramIcon() {
  return (
    <IconBase>
      <path
        d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm5 6.2A3.8 3.8 0 1 0 15.8 12 3.8 3.8 0 0 0 12 8.2Zm6.2-.9a1 1 0 1 0-1 1 1 1 0 0 0 1-1Z"
        fill="rgba(255,255,255,0.85)"
      />
    </IconBase>
  );
}
function YoutubeIcon() {
  return (
    <IconBase>
      <path
        d="M21.7 8.2a3 3 0 0 0-2.1-2.1C17.8 5.6 12 5.6 12 5.6s-5.8 0-7.6.5A3 3 0 0 0 2.3 8.2 31 31 0 0 0 2 12a31 31 0 0 0 .3 3.8 3 3 0 0 0 2.1 2.1c1.8.5 7.6.5 7.6.5s5.8 0 7.6-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 22 12a31 31 0 0 0-.3-3.8ZM10.3 14.9V9.1L15.4 12l-5.1 2.9Z"
        fill="rgba(255,255,255,0.85)"
      />
    </IconBase>
  );
}
function XIcon() {
  return (
    <IconBase>
      <path
        d="M18.7 2H22l-7.2 8.2L23 22h-6.6l-5.2-6.8L5.2 22H2l7.8-8.9L1 2h6.8l4.7 6.2L18.7 2Zm-1.2 18h1.8L6.7 3.9H4.8L17.5 20Z"
        fill="rgba(255,255,255,0.85)"
      />
    </IconBase>
  );
}
