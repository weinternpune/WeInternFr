import React from "react";
import {
  Monitor,
  Database,
  Coffee,
  Cpu,
  Globe,
  Smartphone,
  Bot,
  TrendingUp,
  Terminal,
  ShieldCheck,
  BarChart3,
  PenTool,
  Sparkles,
  Megaphone,
} from "lucide-react";

const courses = [
  { n: "01", title: "Full Stack Development", sub: "MERN, REST APIs & deployment", icon: Monitor, popular: true, tint: "text-sky-400" },
  { n: "02", title: "MERN Stack Development", sub: "MongoDB, Express, React, Node", icon: Database, tint: "text-emerald-400" },
  { n: "03", title: "Java Development", sub: "Core Java to Spring Boot", icon: Coffee, tint: "text-amber-400" },
  { n: "04", title: "C / C++ Programming", sub: "DSA & systems fundamentals", icon: Cpu, tint: "text-orange-400" },
  { n: "05", title: "Web Development", sub: "HTML, CSS & modern JS", icon: Globe, tint: "text-cyan-400" },
  { n: "06", title: "Mobile App Development", sub: "Flutter & cross-platform apps", icon: Smartphone, tint: "text-blue-400" },
  { n: "07", title: "AI / ML", sub: "Models, training & deployment", icon: Bot, popular: true, tint: "text-violet-400" },
  { n: "08", title: "Data Science", sub: "Statistics, EDA & storytelling", icon: TrendingUp, tint: "text-rose-400" },
  { n: "09", title: "Python Development", sub: "Scripting, backend & automation", icon: Terminal, tint: "text-yellow-400" },
  { n: "10", title: "Cyber Security", sub: "Network & app security basics", icon: ShieldCheck, tint: "text-teal-400" },
  { n: "11", title: "Data Analytics", sub: "SQL, dashboards & reporting", icon: BarChart3, tint: "text-fuchsia-400" },
  { n: "12", title: "UI / UX Design", sub: "Figma, wireframes & prototyping", icon: PenTool, popular: true, tint: "text-pink-400" },
  { n: "13", title: "Graphic Design", sub: "Visual identity & branding", icon: Sparkles, tint: "text-indigo-400" },
  { n: "14", title: "Digital Marketing", sub: "SEO, ads & social growth", icon: Megaphone, tint: "text-lime-400" },
];

function CoursePill({ course }) {
  const Icon = course.icon;
  return (
    <div className="flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 sm:gap-3 sm:px-4 sm:py-2">
      <Icon className={`h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4 ${course.tint}`} strokeWidth={1.75} />
      <div className="flex flex-col leading-tight">
        <span className="text-xs font-semibold text-white/90 sm:text-sm">{course.title}</span>
        <span className="text-[9px] text-white/40 sm:text-[11px]">{course.sub}</span>
      </div>
      {course.popular && (
        <span className="shrink-0 rounded-full bg-emerald-400/15 px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-wide text-emerald-400 ring-1 ring-emerald-400/30 sm:px-2 sm:text-[10px]">
          Popular
        </span>
      )}
      <span className="text-white/15">•</span>
    </div>
  );
}

export default function CourseMarqueeBar() {
  return (
    <div className="w-full max-w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
      <style>{`
        @keyframes marquee-bar-left {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee-bar-track { animation: none !important; }
        }
      `}</style>
      <div
        className="marquee-bar-track flex w-max items-center gap-2 py-2 sm:gap-3 sm:py-3"
        style={{ animation: "marquee-bar-left 35s linear infinite" }}
        onMouseEnter={(e) => (e.currentTarget.style.animationPlayState = "paused")}
        onMouseLeave={(e) => (e.currentTarget.style.animationPlayState = "running")}
      >
        {[...courses, ...courses].map((course, i) => (
          <CoursePill key={`${course.n}-${i}`} course={course} />
        ))}
      </div>
    </div>
  );
}