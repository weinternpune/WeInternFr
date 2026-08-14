import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Users, Monitor, IndianRupee, School, Star } from "lucide-react";
import heroStudents from "../../assets/hero-students.jpg/hero-students.png";

const FEATURES = [
  {
    label: "Mentor Guided",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    label: "Live Client Projects",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
  },
  {
    label: "Stipend Opportunities",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  {
    label: "Real Portfolio",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
    ),
  },
  {
    label: "Career Growth",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
];
const floatingCards = [
  {
    icon: <Users className="h-6 w-6 text-emerald-400" />,
    value: "2,000+",
    label: "Student Impact",
  },
  {
    icon: <Monitor className="h-6 w-6 text-emerald-400" />,
    value: "100+",
    label: "Live Projects",
  },
  {
    icon: <IndianRupee className="h-6 w-6 text-emerald-400" />,
    value: "₹5 Lakh+",
    label: "Paid in Stipends",
  },
  {
    icon: <School className="h-6 w-6 text-emerald-400" />,
    value: "5+",
    label: "College Partners",
  },

];

const STATS = [
  {
    target: 2000,
    suffix: "+",
    label: "Student Impact",
    color: "text-emerald-400",
  },
  { target: 100, suffix: "+", label: "Live Projects", color: "text-amber-400" },
  {
    target: 5,
    prefix: "₹",
    suffix: " Lakh+",
    label: "Paid in Stipends",
    color: "text-orange-400",
  },
  {
    target: 75,
    suffix: "%",
    label: "of Project Value to Students",
    color: "text-emerald-400",
  },
  {
    target: 5,
    suffix: "+",
    label: "College Partners",
    color: "text-orange-400",
  },
  {
    static: "5/5",
    label: "Student Rating",
    color: "text-amber-400",
    stars: true,
  },
];

// A handful of fixed, non-uniform dot positions so the grid doesn't look mechanically repeated.
const GRID_DOTS = [
  { top: "6%", left: "34%" },
  { top: "3%", left: "88%" },
  { top: "18%", left: "4%" },
  { top: "46%", left: "96%" },
  { top: "58%", left: "2%" },
  { top: "72%", left: "46%" },
  { top: "30%", left: "55%" },
  { top: "88%", left: "99%" },
  { top: "95%", left: "20%" },
];

// Count-up on scroll into view — no external CSS, no dependency beyond React.
const Counter = ({ target, prefix = "", suffix = "", duration = 1800 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        obs.disconnect();
        const start = Date.now();
        const tick = () => {
          const elapsed = Date.now() - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setCount(Math.round(target * eased));
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [target, duration]);
  return (
    <span ref={ref}>
      {prefix}
      {count.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
};

const Hero = () => {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-[#0B1D2E] pt-14 pb-0 sm:pt-16 lg:pt-20"
    >
      {/* Ambient background — checkered grid + scattered dots + soft glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F2438] via-[#0B1D2E] to-[#081521]" />
        <div
          className="absolute inset-0 opacity-70"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
            backgroundSize: "36px 36px",
          }}
        />
        {GRID_DOTS.map((d, i) => (
          <span
            key={i}
            className="absolute h-1 w-1 rounded-full bg-emerald-400/70"
            style={{ top: d.top, left: d.left }}
          />
        ))}
        <motion.div
          className="absolute -top-24 left-[8%] h-[220px] w-[220px] rounded-full bg-emerald-400/10 blur-[80px] sm:h-[320px] sm:w-[320px] sm:blur-[100px]"
          animate={{ x: [0, 25, 0], y: [0, 15, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-16 right-[6%] h-[190px] w-[190px] rounded-full bg-amber-400/10 blur-[80px] sm:h-[280px] sm:w-[280px] sm:blur-[100px]"
          animate={{ x: [0, -20, 0], y: [0, -12, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          {/* Left — copy */}
          <div className="flex flex-col items-start">
            <div className="mt-8 inline-flex max-w-full items-center gap-1.5 rounded-full justify-start border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-[10px] font-medium tracking-wide text-emerald-300 sm:mt-12 sm:min-w-[220px] sm:text-[11px] lg:mt-20">
              <span className="relative flex h-1.5 w-1.5 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </span>
              <span className="leading-tight">
                INDIA'S No 1 LEARN-BY-WORKING ECOSYSTEM FOR STUDENTS
              </span>
            </div>

          <motion.h1
  className="mt-4 text-[1.75rem] font-medium leading-[1.12] tracking-tight text-white sm:text-[2.5rem] lg:text-[2.8rem]"
  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
  initial={{
    opacity: 0,
    y: 30,
    filter: "blur(8px)",
  }}
  animate={{
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
  }}
  transition={{
    duration: 0.9,
    ease: [0.22, 1, 0.36, 1], // Smooth cubic-bezier
  }}
>
  Learn In-Demand Skills.
  <br />
  Work on Real Projects.
  <br />

  <motion.span
    className="relative inline-block text-emerald-400"
    animate={{
      y: [0, -2, 0],
    }}
    transition={{
      duration: 5,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  >
    Earn Before You Graduate.

    <motion.svg
      className="absolute -bottom-1.5 left-0 w-full"
      height="8"
      viewBox="0 0 300 10"
      fill="none"
      preserveAspectRatio="none"
    >
      <motion.path
        d="M2 7C60 2 240 2 298 7"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.35"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{
          delay: 0.6,
          duration: 1,
          ease: "easeOut",
        }}
      />
    </motion.svg>
  </motion.span>
</motion.h1>

            <p className="mt-4 max-w-xl text-[13px] leading-relaxed text-slate-300 sm:text-[14px] lg:text-[15px]">
              Mentor-led training, live client projects and stipend
              opportunities — powered by WeIntern.
            </p>

       <div className="mt-6 w-full max-w-[520px]">
  <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3">
  {FEATURES.map((f, i) => (
    <motion.div
      key={i}
      initial={{
        opacity: 0,
        y: 16,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.55,
        delay: i * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{
        y: -2,
        scale: 1.02,
        transition: {
          duration: 0.25,
          ease: "easeOut",
        },
      }}
      className="group flex items-center justify-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-2 text-[11px] font-medium text-slate-200 backdrop-blur-md transition-colors duration-300 hover:border-emerald-400/40 hover:bg-emerald-500/10 sm:gap-2 sm:px-3 sm:text-xs"
    >
      <motion.span
        className="shrink-0 text-emerald-400"
        whileHover={{
          rotate: 8,
          scale: 1.12,
        }}
        transition={{
          duration: 0.25,
        }}
      >
        {f.icon}
      </motion.span>

      <span className="whitespace-nowrap">
        {f.label}
      </span>
    </motion.div>
  ))}
</div>
</div>

            <div className="mt-6 flex w-full flex-wrap items-center gap-3">
              <motion.a
  href="#courses"
  onClick={(e) => {
    e.preventDefault();
    document
      .getElementById("courses")
      ?.scrollIntoView({ behavior: "smooth" });
  }}
  whileHover={{
    scale: 1.03,
    y: -2,
  }}
  whileTap={{
    scale: 0.98,
  }}
  className="relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-emerald-500 px-5 py-3 text-sm font-medium text-[#081521] shadow-lg shadow-emerald-500/25 sm:w-auto sm:justify-start sm:px-6 sm:py-3.5 sm:text-base"
>
  {/* Continuous Shine */}
  <motion.div
    className="absolute inset-y-0 -left-24 w-16 -skew-x-12 bg-gradient-to-r from-transparent via-white/50 to-transparent"
    animate={{
      x: [-120, 420],
    }}
    transition={{
      duration: 2.8,
      ease: "linear",
      repeat: Infinity,
      repeatDelay: 0.7,
    }}
  />

  {/* Glow */}
  <motion.div
    className="absolute inset-0 rounded-xl bg-white/5"
    animate={{
      opacity: [0.08, 0.18, 0.08],
    }}
    transition={{
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />

  <span className="relative z-10">Explore Courses</span>

  <motion.span
    className="relative z-10"
    animate={{
      x: [0, 3, 0],
    }}
    transition={{
      duration: 1.6,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  >
    →
  </motion.span>
</motion.a>
              <motion.a
  href="#contact"
  onClick={(e) => {
    e.preventDefault();
    document
      .getElementById("contact")
      ?.scrollIntoView({ behavior: "smooth" });
  }}
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  className="group relative inline-flex w-full overflow-hidden rounded-xl p-[1.5px] sm:w-auto"
>
  {/* Cyan Aurora Border */}
  <motion.div
    className="absolute inset-0 rounded-xl"
    style={{
      background: `
        conic-gradient(
          from 0deg,
          transparent 0deg,
          transparent 250deg,
          #E8A820 285deg,
          #ffd23f 305deg,
          #ffd23f 325deg,
          #ffd23f 345deg,
          transparent 360deg
        )
      `,
      filter: "blur(0.5px)",
    }}
    animate={{ rotate: 360 }}
    transition={{
      duration: 4,
      ease: "linear",
      repeat: Infinity,
    }}
  />

  {/* Button */}
  <div className="relative z-10 inline-flex w-full items-center justify-center gap-2 rounded-[10px] border border-white/10 bg-[#0B1220]/95 px-5 py-3 text-sm font-medium text-white backdrop-blur-md transition-all duration-300 group-hover:bg-[#10192B] sm:w-auto sm:justify-start sm:px-6 sm:py-3.5 sm:text-base">
    <span>Start Your Journey</span>

    <motion.span
      animate={{ x: [0, 3, 0] }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      →
    </motion.span>
  </div>
</motion.a>
            </div>
          </div>

          {/* Right — visual composition */}
          <motion.div
  className="relative mx-auto w-full max-w-md overflow-hidden rounded-[1.5rem] border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-1.5 shadow-2xl shadow-black/40 lg:max-w-none"
  animate={{
    y: [0, -8, 0],
    rotate: [0, 0.4, 0, -0.4, 0],
    scale: [1, 1.01, 1],
  }}
  transition={{
    duration: 6,
    repeat: Infinity,
    ease: "easeInOut",
  }}
>
  <div className="relative overflow-hidden rounded-[1.15rem] bg-[#0B1220]">
    <img
      src={heroStudents}
      alt="WeIntern students working on live projects"
      className="h-[260px] w-full object-cover sm:h-[340px] lg:h-[390px]"
      onError={(e) => {
        e.target.style.display = "none";
        e.target.nextSibling.style.display = "flex";
      }}
    />

    <div className="hidden aspect-[4/5] w-full items-center justify-center bg-[#0B1220]">
      {/* Fallback */}
    </div>
  </div>

  {/* Logo Badge */}
  <motion.div
    className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full border border-white/10 bg-black/60 px-3 py-1.5 backdrop-blur sm:px-4 sm:py-2"
    animate={{
      y: [0, -3, 0],
    }}
    transition={{
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  >
    <img
      src="/welogo.png"
      alt="WeIntern"
      className="h-4 brightness-0 invert sm:h-5"
    />
  </motion.div>
</motion.div>
        </div>
       <div className="relative mt-10 mx-auto w-full max-w-8xl overflow-hidden rounded-2xl border border-white/10 bg-white backdrop-blur-md shadow-lg sm:mt-16">


  <div className="mx-auto grid max-w-6xl grid-cols-2 gap-x-4 gap-y-6 px-4 py-6 sm:grid-cols-3 lg:grid-cols-6 lg:px-4">
    {STATS.map((s, i) => (
      <div key={i} className="text-center lg:text-left">
        <div
          className={`text-xl font-semibold sm:text-2xl ${s.color}`}
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          {s.static ? (
            s.static
          ) : (
            <Counter
              target={s.target}
              prefix={s.prefix}
              suffix={s.suffix}
            />
          )}
        </div>

        {s.stars && (
          <div className="mt-0.5 text-[10px] text-amber-400">
            ★★★★★
          </div>
        )}

        <div className="mt-0.5 text-xs text-slate-500 sm:text-sm">
          {s.label}
        </div>
      </div>
    ))}
  </div>
</div>
      </div>

      
    </section>
  );
};

export default Hero;
