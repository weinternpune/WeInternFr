import React, { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useAnimationFrame, AnimatePresence } from "framer-motion";
import ContactSection from "./ContactFrom";

const TESTIMONIALS = [
  {
    initials: "AP",
    color: "#E8A820",
    name: "AYUSH PATEL",
    role: "WeIntern Intern",
    stars: 5,
    text: '"Currently interning here and it’s been a great experience so far! The work culture is super chill and welcoming, and you actually get to work on real-world projects instead of just basic tasks. Everyone is really supportive whenever you get stuck. Glad I joined! 🙌"',
  },
  {
    initials: "AG",
    color: "#2196C9",
    name: "Aastha Gade",
    role: "WeIntern Student",
    stars: 5,
    text: '"Very nice and innovative place, best for career support and best guidance for future goals and skills development."',
  },
  {
    initials: "PD",
    color: "#9B59B6",
    name: "Prabina Das",
    role: "WeIntern Student",
    stars: 5,
    text: '"Best Platform for internships."',
  },
  {
    initials: "RK",
    color: "#E67E22",
    name: "Ria Kim",
    role: "WeIntern Student",
    stars: 5,
    text: '"Great workplaces don\'t just assign tasks, every task was an opportunity to learn something new. Thank you for an unforgettable learning journey!"',
  },
  {
    initials: "YP",
    color: "#18B45B",
    name: "Yashshree Pimpalkar",
    role: "WeIntern Student",
    stars: 5,
    text: '"My experience at WeIntern has been great so far. I\'m learning new things, gaining practical experience and getting valuable exposure to a professional work environment."',
  },
  {
    initials: "AP",
    color: "#F39C12",
    name: "Atasi Pradhan",
    role: "WeIntern Student",
    stars: 5,
    text: '"Best place to start career 🚀. Good learning environment and supportive team 😇."',
  },
  {
    initials: "PS",
    color: "#3498DB",
    name: "Priyankarani Sahu",
    role: "WeIntern Student",
    stars: 5,
    text: '"Great experience with WeIntern! The mentors are supportive, the learning environment is excellent, and I gained valuable practical skills. Highly recommended for students and freshers looking for quality internship opportunities."',
  },
  {
    initials: "AD",
    color: "#E74C3C",
    name: "Aachal Deshmukh",
    role: "WeIntern Student",
    stars: 5,
    text: '"Excellent tech company! Professional team, modern office, and great client service."',
  },
  {
    initials: "AS",
    color: "#8E44AD",
    name: "Amiya Samal",
    role: "WeIntern Student",
    stars: 5,
    text: '"A great place to learn and improve your skills. Highly recommended."',
  },
  {
    initials: "PS",
    color: "#16A085",
    name: "Pratham shorts",
    role: "WeIntern Student",
    stars: 5,
    text: "",
  },
  {
    initials: "MW",
    color: "#D35400",
    name: "Mangesh Wadichar",
    role: "WeIntern Student",
    stars: 5,
    text: "",
  },
];

const StarRating = ({ count }) => (
  <div className="flex shrink-0 items-center gap-0.5">
    {Array.from({ length: count }).map((_, i) => (
      <svg
        key={i}
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="#f59e0b"
        stroke="none"
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ))}
  </div>
);

const QuoteIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4v-10h9.983zm14.017 0v7.391c0 5.704-3.748 9.571-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-3.983v-10h9.983z" />
  </svg>
);

// Frosted-glass testimonial card — needs the colored ambient blobs behind the
// marquee to actually read as glass, otherwise translucency has nothing to
// pick up.
const TestimonialCard = ({ t }) => (
  <div className="group relative w-[260px] shrink-0 overflow-hidden rounded-2xl border border-white/15 bg-[#06131F]/85 p-4 shadow-xl shadow-slate-900/15 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400/30 hover:bg-[#071A29]/90 hover:shadow-2xl hover:shadow-slate-900/20 sm:w-[340px] sm:p-6">
    {/* Subtle emerald glass glow */}
    <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-emerald-400/10 blur-3xl transition-all duration-300 group-hover:bg-emerald-400/20" />

    <div className="relative">
      <QuoteIcon className="h-5 w-5 text-emerald-300/80 sm:h-6 sm:w-6" />

      <p
        className="mt-2 text-[12px] leading-relaxed text-slate-200 sm:mt-3 sm:text-[14px]"
        style={{
          display: "-webkit-box",
          WebkitLineClamp: 4,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          minHeight: "72px",
        }}
      >
        {t.text}
      </p>

      <div className="mt-4 flex items-center gap-2.5 border-t border-white/10 pt-3 sm:mt-5 sm:gap-3 sm:pt-4">
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold text-white ring-1 ring-white/20 sm:h-9 sm:w-9 sm:text-xs"
          style={{ background: t.color }}
        >
          {t.initials}
        </div>

        <div className="min-w-0 flex-1">
          <div className="truncate text-[12px] font-semibold text-white sm:text-sm">
            {t.name}
          </div>

          <div className="truncate text-[10px] text-emerald-300/80 sm:text-xs">
            {t.role}
          </div>
        </div>

        <StarRating count={t.stars} />
      </div>
    </div>
  </div>
);

// Continuous, seamless-loop marquee row. Duplicates its item set once so the
// track can wrap invisibly, and drives position with useAnimationFrame so it
// can be paused smoothly on hover instead of relying on a CSS keyframe reset.
const MarqueeRow = ({ items, speed = 34, direction = 1 }) => {
  const x = useMotionValue(0);
  const trackRef = useRef(null);
  const [setWidth, setSetWidthState] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const measure = () => {
      if (trackRef.current) setSetWidthState(trackRef.current.scrollWidth / 2);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [items]);

  useAnimationFrame((_, delta) => {
    if (isPaused || !setWidth) return;
    let next = x.get() - (direction * speed * delta) / 1000;
    if (direction > 0 && next <= -setWidth) next += setWidth;
    if (direction < 0 && next >= 0) next -= setWidth;
    x.set(next);
  });

  return (
    <div
      className="overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <motion.div ref={trackRef} style={{ x }} className="flex w-max gap-5">
        {[...items, ...items].map((t, i) => (
          <TestimonialCard key={`${t.name}-${i}`} t={t} />
        ))}
      </motion.div>
    </div>
  );
};

const Testimonials = () => {
  const [showPopup, setShowPopup] = useState(false);

  const items = TESTIMONIALS.filter((t) => t.text && t.text.trim().length > 0);
  const mid = Math.ceil(items.length / 2);
  const rowA = items.slice(0, mid);
  const rowB = items.slice(mid);

  const avatarStack = items.slice(0, 5);
  const featured = items[0];

  return (
    <>
      <section
        className="relative overflow-hidden bg-white pt-3 pb-14 sm:pt-6 sm:pb-24"
        id="testimonials"
      >
        {/* Ambient color blobs so the glass cards below have something to
            refract — kept soft enough not to fight the copy. */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-24 left-[8%] h-[300px] w-[300px] rounded-full bg-emerald-400/10 blur-[120px]" />
          <div className="absolute top-40 right-[6%] h-[280px] w-[280px] rounded-full bg-sky-400/8 blur-[120px]" />
          <div className="absolute bottom-0 left-[35%] h-[260px] w-[260px] rounded-full bg-violet-400/7 blur-[120px]" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header — now starts from the left, copy unchanged */}
          <motion.div
  className="mx-auto max-w-3xl text-center"
  initial={{ opacity: 0, y: 16 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, amount: 0.4 }}
  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
>
  {/* Eyebrow */}
  <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-50/70 px-3.5 py-1.5 backdrop-blur-sm">
    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
    <span
      className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-600 sm:text-[11px]"
      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
    >
      Real Stories
    </span>
  </div>

  {/* Heading */}
  <h2
    className="text-[20px] font-semibold leading-[1.12] tracking-[-0.035em] text-slate-900 sm:text-3xl md:text-4xl lg:text-[30px]"
    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
  >
    From Students{" "}
    <span className="relative inline-block text-emerald-600">
  Who Made the Leap
  <span className="absolute -bottom-1 left-0 h-[3px] w-full rounded-full bg-emerald-400/70" />
</span>
  </h2>

  {/* Description */}
  <p
    className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-500 sm:mt-5 sm:text-base sm:leading-7"
    style={{ fontFamily: "'Inter', sans-serif" }}
  >
    Real experiences from students who turned learning into
    <span className="font-medium text-slate-700"> skills, opportunities, and results.</span>
  </p>
</motion.div>
        </div>

        {/* Marquee — full-bleed, edges fade so cards drift off naturally */}
        <motion.div
          className="relative mt-9 space-y-3 sm:mt-14 sm:space-y-5"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}

        >
          <MarqueeRow items={rowA} direction={1} speed={30} />
          <MarqueeRow items={rowB} direction={-1} speed={26} />
        </motion.div>

     {/* Compact CTA */}
<div className="relative mx-4 mt-16 w-auto max-w-5xl overflow-hidden rounded-2xl border border-white/[0.1] bg-[#0B1D2E] px-4 py-5 backdrop-blur-xl sm:mx-auto sm:w-full sm:px-8 sm:py-8 lg:px-10">

  {/* Ambient glow */}
  <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-emerald-400/[0.08] blur-3xl" />
  <div className="pointer-events-none absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-emerald-500/[0.05] blur-3xl" />

  <div className="relative flex flex-col items-center justify-between gap-4 text-center md:flex-row md:gap-6 md:text-left">

    {/* Content */}
    <motion.div
      className="max-w-xl"
      initial={{ opacity: 0, x: -15 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-1.5 inline-flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-emerald-400 sm:mb-2 sm:gap-2 sm:text-[10px]">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
        Start Building
      </div>

      <h3
        className="text-xl font-semibold leading-tight text-white sm:text-3xl"
        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
      >
        Ready to turn internships into{" "}
        <span className="text-emerald-400">real experience?</span>
      </h3>

      <p className="mt-1.5 max-w-lg text-[11px] leading-relaxed text-slate-400 sm:mt-2 sm:text-sm">
        Build real projects, learn from mentors, and create a portfolio that
        gets noticed.
      </p>
    </motion.div>

    {/* Actions */}
    <motion.div
      className="flex shrink-0 flex-wrap justify-center gap-2.5 sm:gap-3"
      initial={{ opacity: 0, x: 15 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1, duration: 0.5 }}
    >
      <motion.button
        onClick={() => setShowPopup(true)}
        whileHover={{ scale: 1.03, y: -2 }}
        whileTap={{ scale: 0.98 }}
        className="group relative inline-flex items-center gap-1.5 overflow-hidden rounded-lg bg-emerald-400 px-4 py-2.5 text-xs font-semibold text-[#06120d] shadow-lg shadow-emerald-500/15 sm:gap-2 sm:rounded-xl sm:px-5 sm:py-3 sm:text-sm"
      >
        {/* Minimal Shine */}
        <motion.span
          className="absolute inset-y-0 -left-16 w-6 -skew-x-12 bg-white/15 blur-[1px]"
          animate={{ x: [-60, 170] }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            repeatDelay: 2,
            ease: "easeInOut",
          }}
        />

        <span className="relative z-10">Join WeIntern</span>

        <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">
          →
        </span>
      </motion.button>

      <a
        href="#courses"
        className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs font-medium text-slate-200 backdrop-blur-md transition-all duration-300 hover:border-emerald-400/25 hover:bg-white/[0.08] hover:text-white sm:gap-2 sm:rounded-xl sm:px-5 sm:py-3 sm:text-sm"
      >
        Explore Courses
      </a>
    </motion.div>
  </div>

  {/* Bottom accent */}
  <div className="absolute bottom-0 left-1/2 h-px w-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent" />
</div>
      </section>

      {/* POPUP — redesigned two-panel modal: glass promo panel + form */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowPopup(false)}
          >
            <motion.div
              className="relative grid w-full max-w-3xl grid-cols-1 overflow-hidden rounded-[1.75rem] bg-white shadow-2xl md:grid-cols-[0.85fr_1.15fr]"
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowPopup(false)}
                aria-label="Close"
                className="absolute right-4 top-4 z-20 flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20 md:text-white"
              >
                ×
              </button>

              {/* Left — glass promo panel, hidden on small screens */}
              <div
                className="relative hidden flex-col justify-between overflow-hidden p-8 text-white md:flex"
                style={{
                  background:
                    "linear-gradient(160deg, #081521 0%, #0B1D2E 45%, #0B3B34 100%)",
                }}
              >
                <div className="pointer-events-none absolute inset-0">
                  <div
                    className="absolute inset-0 opacity-25"
                    style={{
                      backgroundImage:
                        "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
                      backgroundSize: "28px 28px",
                    }}
                  />
                  <div className="absolute -bottom-10 -left-10 h-[220px] w-[220px] rounded-full bg-emerald-400/20 blur-[90px]" />
                </div>

                <div className="relative">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-medium tracking-wide text-emerald-200 backdrop-blur-md">
                    Let's get you started
                  </div>
                  <h4
                    className="mt-4 text-xl font-semibold leading-snug"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    Join the ecosystem building real careers.
                  </h4>
                  <p className="mt-2 text-sm text-slate-300">
                    Tell us a bit about yourself and a mentor will reach out
                    to guide you through the next steps.
                  </p>
                </div>

                      <div className="mb-5 h-[2px] w-12 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,0.45)]" />

      {/* CARD 1 */}
      <div className="group relative mb-3 flex w-full items-center gap-4 overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.035] px-4 py-3.5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-400/30 hover:bg-white/[0.055]">

        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/[0.06] via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/[0.08] text-lg text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.06)] transition-all duration-300 group-hover:border-emerald-400/40 group-hover:bg-emerald-400/[0.12]">
          ✉
        </div>

        <div className="relative min-w-0">
          <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
            Email
          </span>

          <h3 className="mt-1 truncate text-[12px] font-medium text-slate-200 transition-colors duration-300 group-hover:text-white">
            support@weintern.in
          </h3>
        </div>

        <span className="relative ml-auto text-lg text-slate-600 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-emerald-400">
          ↗
        </span>
      </div>

      {/* CARD 2 */}
      <div className="group relative mb-3 flex w-full items-center gap-4 overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.035] px-4 py-3.5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-400/30 hover:bg-white/[0.055]">

        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/[0.06] via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/[0.08] text-lg text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.06)] transition-all duration-300 group-hover:border-emerald-400/40 group-hover:bg-emerald-400/[0.12]">
          ☎
        </div>

        <div className="relative min-w-0">
          <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
            Phone
          </span>

          <h3 className="mt-1 truncate text-[12px] font-medium text-slate-200 transition-colors duration-300 group-hover:text-white">
            +91 7414974582
          </h3>
        </div>

        <span className="relative ml-auto text-lg text-slate-600 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-emerald-400">
          ↗
        </span>
      </div>

      {/* CARD 3 */}
      <div className="group relative flex w-full items-center gap-4 overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.035] px-4 py-3.5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-400/30 hover:bg-white/[0.055]">

        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/[0.06] via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/[0.08] text-lg text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.06)] transition-all duration-300 group-hover:border-emerald-400/40 group-hover:bg-emerald-400/[0.12]">
          📍
        </div>

        <div className="relative min-w-0">
          <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
            Location
          </span>

          <h3 className="mt-1 truncate text-[12px] font-medium text-slate-200 transition-colors duration-300 group-hover:text-white">
            Pune, Maharashtra, India
          </h3>
        </div>

        <span className="relative ml-auto text-lg text-slate-600 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-emerald-400">
          ↗
        </span>
      </div>
              </div>

              {/* Right — the actual form */}
              <div className="max-h-[85vh] overflow-y-auto p-1 sm:p-2">
                <ContactSection />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Testimonials;
