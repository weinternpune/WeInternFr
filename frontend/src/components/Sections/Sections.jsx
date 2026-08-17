

import React, { useState, useEffect, useRef } from 'react';
import API, { submitCohortApplication } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useReveal from '../../hooks/useReveal';
import './Sections.css';
import './LiveJourney.css';
import { Target } from "lucide-react";
import { Quote, ChartNoAxesCombined } from "lucide-react";
import { motion,AnimatePresence } from "framer-motion";
import { GraduationCap, Building2, Check, X } from 'lucide-react';
import { Lock, MapPin, Users, Gift, CheckCircle2, ArrowRight, Loader2 ,Layers , Calendar} from "lucide-react";


import ai_chatbot from "../../assets/ai_chatbot.jpg";
import analytics from "../../assets/analytics.jpg";
import ecommerce from "../../assets/ecommerce.jpg";
import edtech from "../../assets/edtech.jpg";
import fleet_monitoring from "../../assets/fleet_monitoring.png";
import healthcare from "../../assets/healthcare.jpg";
import platform from "../../assets/platform.jpg";
import food_delivery from "../../assets/food_delivery.jpg";
import job_portal from "../../assets/job_portal.jpg";
import travel_booking from "../../assets/travel_booking.jpg";

// Import cohort images
import cohortLiveImg from "../../assets/cohort-live.jpg";
import cohortUpcomingImg from "../../assets/cohort-upcoming.jpg";
import cohortFutureImg from "../../assets/cohort-future.jpg";



export const Problem = () => {
  const q1 = useReveal(); const q2 = useReveal(); const q3 = useReveal(); const q4 = useReveal();
  return (
    <section className="problem" id="story">
      <div className="container">
        <div className="section-label text-center">
  The Reality
</div>

<h2
  className="
    section-title
    text-center
    text-[20px]
    sm:text-[20px]
    md:text-[30px]
    lg:text-[30px]
  "
>
  The Gap No One Talks About
</h2>
       <div className="flex flex-col lg:flex-row items-center lg:items-stretch justify-center gap-10 lg:gap-0 w-full max-w-6xl mx-auto px-4">
  {/* LEFT CARD */}
  <motion.div
  ref={q1}
  initial={{ opacity: 0, y: 24 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: '-80px' }}
  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
  whileHover={{ y: -4 }}
  className="group relative w-full max-w-md lg:max-w-none lg:flex-1 overflow-hidden rounded-2xl border border-emerald-100/60 bg-white shadow-[0_8px_30px_-12px_rgba(15,23,42,0.12)] p-7 sm:p-9 transition-shadow duration-500 hover:shadow-[0_20px_45px_-14px_rgba(16,185,129,0.22)]"
>


  {/* content */}
  <div className="relative z-10">
    <div className="flex items-center gap-4 mb-7">
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="relative w-[52px] h-[52px] rounded-xl bg-gradient-to-br from-emerald-50 to-white ring-1 ring-emerald-100 flex items-center justify-center shrink-0 shadow-[0_2px_10px_-2px_rgba(16,185,129,0.25)] transition-transform duration-500 group-hover:scale-105"
      >
        <GraduationCap className="w-6 h-6 text-emerald-700" strokeWidth={1.6} />
      </motion.div>
      <div>
        <h3 className="text-base sm:text-lg font-semibold text-slate-900 tracking-tight">Students Graduate With</h3>
        <motion.span
          initial={{ width: 0 }}
          whileInView={{ width: 32 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.35 }}
          className="block h-[3px] rounded-full bg-gradient-to-r from-emerald-400 to-emerald-300 mt-2"
        />
      </div>
    </div>

    <motion.ul
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08, delayChildren: 0.3 } } }}
      className="divide-y divide-slate-100"
    >
      {['Certificates & degrees', 'Completed courses', 'Good grades'].map((item) => (
        <motion.li
          key={item}
          variants={{ hidden: { opacity: 0, x: -12 }, visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: 'easeOut' } } }}
          className="flex items-center gap-3 py-3"
        >
          <span className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
            <Check className="w-3 h-3 text-white" strokeWidth={3} />
          </span>
          <span className="text-slate-600 text-sm sm:text-[15px]">{item}</span>
        </motion.li>
      ))}
      {['Real client experience', 'Deadline pressure skills', 'Team collaboration', 'Confidence to execute'].map((item) => (
        <motion.li
          key={item}
          variants={{ hidden: { opacity: 0, x: -12 }, visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: 'easeOut' } } }}
          className="flex items-center gap-3 py-3"
        >
          <span className="w-5 h-5 rounded-full bg-rose-400 flex items-center justify-center shrink-0">
            <X className="w-3 h-3 text-white" strokeWidth={3} />
          </span>
          <span className="text-slate-500 text-sm sm:text-[15px]">{item}</span>
        </motion.li>
      ))}
    </motion.ul>
  </div>
</motion.div>
  {/* CENTER — GAP + CONNECTORS */}
  <div ref={q2} className="flex items-center justify-center shrink-0 lg:w-[280px] py-8 lg:py-0">
  {/* LEFT CONNECTOR */}
  <div className="hidden lg:flex items-center flex-1 -mr-2 relative">
    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
    <div className="relative flex-1 h-px">
      <motion.span
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
        style={{ transformOrigin: 'left' }}
        className="absolute inset-0 border-t border-dashed border-emerald-300"
      />
      {[0, 0.7, 1.4].map((delay, i) => (
        <motion.span
          key={i}
          initial={{ left: '0%', opacity: 0 }}
          animate={{ left: '100%', opacity: [0, 1, 1, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, delay: 1.4 + delay, ease: 'linear' }}
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_1px_rgba(16,185,129,0.5)]"
        />
      ))}
    </div>
  </div>

  {/* GAP CIRCLE */}
  <motion.div
    initial={{ opacity: 0, scale: 0.85 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
    className="flex flex-col items-center"
  >
    <div className="relative w-52 h-52 sm:w-60 sm:h-60 rounded-full border border-slate-200 flex items-center justify-center">
      <motion.div
        animate={{ scale: [1, 1.06, 1], opacity: [0.45, 0.15, 0.45] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-0 rounded-full bg-rose-400/20 blur-xl"
      />
      {/* orbit ring accent */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-2 rounded-full border border-dashed border-slate-200/70"
      />

      <div className="relative w-40 h-40 sm:w-44 sm:h-44 rounded-full bg-gradient-to-br from-rose-500 via-rose-600 to-red-700 shadow-[0_20px_45px_-12px_rgba(225,29,72,0.5)] flex flex-col items-center justify-center text-white text-center px-4">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center mb-2"
        >
          <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5 text-white" strokeWidth={1.75} stroke="currentColor">
            <path d="M2 20h20M4 20v-6c0-1 .5-2 2-2s2 1 2 2v6M9 20v-8c0-1 .5-2 2-2s2 1 2 2v8M14 20v-8c0-1 .5-2 2-2s2 1 2 2v8M19 20v-6c0-1-.5-2-2-2s-2 1-2 2v6" />
          </svg>
        </motion.div>
        <span className="font-semibold text-[15px] sm:text-base tracking-wide">THE GAP</span>
        <p className="text-[11px] sm:text-xs text-white/85 mt-2 leading-relaxed">
          Frustration.
          <br />
          Self-doubt.
          <br />
          Missed chances.
        </p>
      </div>
    </div>

   <motion.span
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: 0.9 }}
      whileHover={{ scale: 1.04 }}
      className="group relative mt-5 inline-block overflow-hidden rounded-full bg-gradient-to-r from-amber-100 to-amber-50 border border-amber-200/80 px-6 py-2 font-semibold text-slate-800 shadow-sm text-sm tracking-tight cursor-default"
    >
      <motion.span
        animate={{ x: ['-150%', '250%'] }}
        transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1.5, ease: 'easeInOut' }}
        className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/70 to-transparent skew-x-[-20deg]"
      />
      <motion.span
        animate={{ boxShadow: ['0 0 0px rgba(217,119,6,0)', '0 0 12px rgba(217,119,6,0.25)', '0 0 0px rgba(217,119,6,0)'] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute inset-0 rounded-full"
      />
      <span className="relative z-10">WeIntern</span>
    </motion.span>
  </motion.div>

  {/* RIGHT CONNECTOR */}
  <div className="hidden lg:flex items-center flex-1 -ml-2 relative">
    <div className="relative flex-1 h-px">
      <motion.span
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
        style={{ transformOrigin: 'right' }}
        className="absolute inset-0 border-t border-dashed border-blue"
      />
      {[0, 0.7, 1.4].map((delay, i) => (
        <motion.span
          key={i}
          initial={{ left: '100%', opacity: 0 }}
          animate={{ left: '0%', opacity: [0, 1, 1, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, delay: 1.4 + delay, ease: 'linear' }}
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_1px_rgba(16,185,129,0.5)]"
        />
      ))}
    </div>
    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
  </div>
</div>

  {/* RIGHT CARD */}
  <motion.div
  ref={q3}
  initial={{ opacity: 0, y: 24 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: '-80px' }}
  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
  whileHover={{ y: -4 }}
  className="group relative w-full max-w-md lg:max-w-none lg:flex-1 overflow-hidden rounded-2xl border border-sky-100/60 bg-white shadow-[0_8px_30px_-12px_rgba(15,23,42,0.12)] p-7 sm:p-9 transition-shadow duration-500 hover:shadow-[0_20px_45px_-14px_rgba(14,165,233,0.22)]"
>
  {/* crystal facets — background layer */}
  <div className="pointer-events-none absolute inset-0 -z-0">
    <motion.div
      animate={{ opacity: [0.5, 0.8, 0.5] }}
      transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      className="absolute -top-24 -right-16 w-56 h-56 bg-gradient-to-br from-sky-200/40 via-sky-100/20 to-transparent blur-2xl"
      style={{ clipPath: 'polygon(30% 0%, 100% 15%, 85% 90%, 10% 100%)' }}
    />
    <motion.div
      animate={{ opacity: [0.3, 0.55, 0.3] }}
      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      className="absolute -bottom-20 -left-10 w-40 h-40 bg-gradient-to-tr from-cyan-100/40 to-transparent blur-2xl"
      style={{ clipPath: 'polygon(15% 10%, 90% 0%, 100% 85%, 5% 100%)' }}
    />
    <div
      className="absolute top-0 right-0 w-32 h-32 opacity-[0.07]"
      style={{
        background: 'linear-gradient(135deg, transparent 40%, #0ea5e9 40%, #0ea5e9 42%, transparent 42%), linear-gradient(45deg, transparent 60%, #0ea5e9 60%, #0ea5e9 62%, transparent 62%)',
      }}
    />
    <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/85 to-white" />
  </div>

  {/* content */}
  <div className="relative z-10">
    <div className="flex items-center gap-4 mb-7">
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="relative w-[52px] h-[52px] rounded-xl bg-gradient-to-br from-sky-50 to-white ring-1 ring-sky-100 flex items-center justify-center shrink-0 shadow-[0_2px_10px_-2px_rgba(14,165,233,0.25)] transition-transform duration-500 group-hover:scale-105"
      >
        <Building2 className="w-6 h-6 text-sky-700" strokeWidth={1.6} />
      </motion.div>
      <div>
        <h3 className="text-base sm:text-lg font-semibold text-slate-900 tracking-tight">Industry Demands</h3>
        <motion.span
          initial={{ width: 0 }}
          whileInView={{ width: 32 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.35 }}
          className="block h-[3px] rounded-full bg-gradient-to-r from-sky-400 to-sky-300 mt-2"
        />
      </div>
    </div>

    <motion.ul
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08, delayChildren: 0.3 } } }}
      className="divide-y divide-slate-100"
    >
      {[
        'Real project execution',
        'Deadline management',
        'Team collaboration',
        'Problem solving',
        'Communication skills',
        'Industry tools',
      ].map((item) => (
        <motion.li
          key={item}
          variants={{ hidden: { opacity: 0, x: -12 }, visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: 'easeOut' } } }}
          className="flex items-center gap-3 py-3"
        >
          <span className="w-5 h-5 rounded-full bg-sky-500 flex items-center justify-center shrink-0">
            <Check className="w-3 h-3 text-white" strokeWidth={3} />
          </span>
          <span className="text-slate-600 text-sm sm:text-[15px]">{item}</span>
        </motion.li>
      ))}
      <motion.li
        variants={{ hidden: { opacity: 0, x: -12 }, visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: 'easeOut' } } }}
        className="flex items-center gap-3 py-3"
      >
        <span className="w-5 h-5 rounded-full bg-rose-400 flex items-center justify-center shrink-0">
          <X className="w-3 h-3 text-white" strokeWidth={3} />
        </span>
        <span className="text-slate-500 text-sm sm:text-[15px]">"No freshers please"</span>
      </motion.li>
    </motion.ul>
  </div>
</motion.div>
</div>

<motion.div
  ref={q4}
  initial={{ opacity: 0, y: 25, scale: 0.985 }}
  whileInView={{ opacity: 1, y: 0, scale: 1 }}
  viewport={{ once: true, amount: 0.25 }}
  transition={{
    duration: 0.7,
    ease: [0.22, 1, 0.36, 1],
  }}
  whileHover={{
    y: -3,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  }}
  className="
    group
    relative
    mx-auto
    mt-10
    w-full
    max-w-[1050px]
    overflow-hidden
    rounded-[18px]
    border
    border-[#E2E8F0]
    bg-[#F8FBFF]
    px-5
    py-5
    font-['Inter',sans-serif]
    shadow-[0_4px_20px_rgba(15,23,42,0.05)]
    transition-shadow
    duration-500
    hover:shadow-[0_16px_40px_rgba(15,23,42,0.09)]
    sm:px-7
    sm:py-5
    lg:px-8
  "
>
  {/* Animated top accent */}
  <motion.div
    initial={{ scaleX: 0 }}
    whileInView={{ scaleX: 1 }}
    viewport={{ once: true }}
    transition={{
      delay: 0.15,
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    }}
    className="
      absolute
      left-0
      top-0
      h-[2px]
      w-full
      origin-left
      bg-[#2563EB]
    "
  />

  {/* Floating background glow */}
  <motion.div
    animate={{
      x: [0, 30, 0],
      y: [0, 10, 0],
      scale: [1, 1.08, 1],
    }}
    transition={{
      duration: 7,
      repeat: Infinity,
      ease: "easeInOut",
    }}
    className="
      pointer-events-none
      absolute
      -right-20
      -top-24
      h-48
      w-48
      rounded-full
      bg-[#DBEAFE]/70
      blur-3xl
    "
  />

  {/* Main content */}
  <div
    className="
      relative
      z-10
      flex
      flex-col
      gap-5
      sm:flex-row
      sm:items-center
      sm:gap-6
      lg:gap-8
    "
  >
    {/* Quote Icon */}
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.65,
        rotate: -10,
      }}
      whileInView={{
        opacity: 1,
        scale: 1,
        rotate: 0,
      }}
      viewport={{ once: true }}
      transition={{
        delay: 0.2,
        duration: 0.6,
        type: "spring",
        stiffness: 180,
        damping: 12,
      }}
      whileHover={{
        scale: 1.08,
        rotate: 6,
      }}
      className="
        relative
        flex
        h-11
        w-11
        shrink-0
        items-center
        justify-center
        rounded-full
        border
        border-[#BFDBFE]
        bg-[#EFF6FF]
        text-[#2563EB]
        shadow-[0_4px_12px_rgba(37,99,235,0.08)]
        sm:h-12
        sm:w-12
      "
    >
      <Quote
        size={21}
        strokeWidth={2}
        className="rotate-180"
      />

      {/* Orbit ring */}
      <motion.span
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "linear",
        }}
        className="
          absolute
          inset-[-4px]
          rounded-full
          border
          border-dashed
          border-[#93C5FD]
          opacity-0
          transition-opacity
          duration-300
          group-hover:opacity-100
        "
      />
    </motion.div>

    {/* Main Quote */}
    <motion.blockquote
      initial={{
        opacity: 0,
        x: -18,
      }}
      whileInView={{
        opacity: 1,
        x: 0,
      }}
      viewport={{ once: true }}
      transition={{
        delay: 0.3,
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="
        min-w-0
        flex-1
        font-['Inter',sans-serif]
        text-[18px]
        font-semibold
        leading-[1.35]
        tracking-[-0.03em]
        text-[#0F172A]
        sm:text-[20px]
        lg:text-[22px]
      "
    >
      They graduate with theory.

      <span className="text-[#64748B]">
        {" "}Industry demands{" "}
      </span>

      {/* Execution */}
      <motion.span
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{
          delay: 0.65,
          duration: 0.45,
        }}
        className="
          relative
          inline-block
          font-['Inter',sans-serif]
          font-bold
          text-[#2563EB]
        "
      >
        execution.

        {/* Animated underline */}
        <motion.span
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{
            delay: 0.8,
            duration: 0.55,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="
            absolute
            -bottom-1
            left-0
            h-[2px]
            w-full
            origin-left
            rounded-full
            bg-[#2563EB]
          "
        />
      </motion.span>
    </motion.blockquote>

    {/* Divider */}
    <motion.div
      initial={{
        scaleY: 0,
        opacity: 0,
      }}
      whileInView={{
        scaleY: 1,
        opacity: 1,
      }}
      viewport={{ once: true }}
      transition={{
        delay: 0.42,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="
        hidden
        h-9
        w-px
        shrink-0
        origin-center
        bg-[#E2E8F0]
        sm:block
      "
    />

    {/* Supporting content */}
    <motion.div
      initial={{
        opacity: 0,
        x: 18,
      }}
      whileInView={{
        opacity: 1,
        x: 0,
      }}
      viewport={{ once: true }}
      transition={{
        delay: 0.46,
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="
        shrink-0
        font-['Inter',sans-serif]
        sm:max-w-[220px]
        lg:max-w-[240px]
      "
    >
      <p
        className="
          font-['Inter',sans-serif]
          text-[10px]
          font-bold
          uppercase
          tracking-[0.16em]
          text-[#0F172A]
          sm:text-[11px]
        "
      >
         The Missing Layer
      </p>

      <p
        className="
          mt-1
          font-['Inter',sans-serif]
          text-xs
          leading-5
          text-[#64748B]
        "
      >
          Turning knowledge into real-world capability
      </p>
    </motion.div>

    {/* Status indicator */}
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.7,
      }}
      whileInView={{
        opacity: 1,
        scale: 1,
      }}
      viewport={{ once: true }}
      transition={{
        delay: 0.58,
        duration: 0.45,
        type: "spring",
        stiffness: 200,
      }}
      className="
        hidden
        shrink-0
        items-center
        gap-2
        font-['Inter',sans-serif]
        lg:flex
      "
    >

      
    </motion.div>
  </div>

  {/* Animated hover sweep */}
  <motion.div
    initial={{ x: "-120%" }}
    whileHover={{ x: "120%" }}
    transition={{
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    }}
    className="
      pointer-events-none
      absolute
      inset-y-0
      left-0
      z-0
      w-1/3
      -skew-x-12
      bg-white/60
      blur-xl
    "
  />
</motion.div>
      </div>
    </section>
  );
};


// ===== HowItWorks =====
export const HowItWorks = () => {
  // eslint-disable-next-line no-unused-vars
  const [tab, setTab] = React.useState('students');
  // eslint-disable-next-line no-unused-vars
  const STEPS = [
    { num:'01', icon:'📝', title:'Apply & Get Selected', desc:'No prior experience needed. Just passion and the willingness to grow. Submit your application and our team reviews within 3–5 days.' },
    { num:'02', icon:'👥', title:'Join a Real Team', desc:'Become part of a supervised intern team working on actual client projects — web dev, apps, AI, cloud, and more.' },
    { num:'03', icon:'💰', title:'Earn While You Learn', desc:'Receive a stipend for your real contributions. Not just a certificate — actual income while you build real skills.' },
    { num:'04', icon:'🚀', title:'Build Your Portfolio', desc:'Leave with 4–6 live projects, verified industry experience, and the confidence to own any interview room.' }
  ];
  // eslint-disable-next-line no-unused-vars
  const BIZ = [
    { num:'01', icon:'💡', title:'Share Your Requirements', desc:'Tell us what you need. We assess scope, timeline, and match your project to the right intern team.' },
    { num:'02', icon:'👥', title:'Get a Supervised Team', desc:'Passionate interns supervised by expert mentors. Quality guaranteed, deadlines respected.' },
    { num:'03', icon:'🚀', title:'Receive Quality Output', desc:'High-quality, tested, delivered products — cost-effective without compromising standards.' },
    { num:'04', icon:'🔄', title:'Continuous Support', desc:'Post-delivery support included. Long-term partnership, not just a one-time delivery.' }
  ];
};

// ===== EcosystemSection =====
export const EcosystemSection = () => {

  const STEP_ICONS = [
    // 1. Learn — open book
    <svg viewBox="0 0 48 48" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M24 10C24 10 14 7 8 10v26c6-3 16 0 16 0s10-3 16 0V10c-6-3-16 0-16 0z"/>
      <line x1="24" y1="10" x2="24" y2="36"/>
    </svg>,
    // 2. Build — code brackets
    <svg viewBox="0 0 48 48" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="18,14 8,24 18,34"/>
      <polyline points="30,14 40,24 30,34"/>
      <line x1="28" y1="12" x2="20" y2="36"/>
    </svg>,
    // 3. Get Assigned — briefcase
    <svg viewBox="0 0 48 48" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="8" y="18" width="32" height="22" rx="3"/>
      <path d="M16 18v-4a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v4"/>
      <line x1="8" y1="28" x2="40" y2="28"/>
    </svg>,
    // 4. Work & Grow — two people / team
    <svg viewBox="0 0 48 48" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="16" r="5"/>
      <path d="M6 38c0-6.627 5.373-12 12-12"/>
      <circle cx="32" cy="14" r="4"/>
      <path d="M28 38c0-5.523 3.582-10 8-10"/>
      <path d="M18 26c3.5 0 6.5 1.5 8.5 4"/>
    </svg>,
    // 5. Earn — rupee coin
    <svg viewBox="0 0 48 48" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="24" cy="24" r="16"/>
      <path d="M18 17h12M18 23h12M22 23l-4 8"/>
      <path d="M18 17c0 0 8 0 8 6s-8 6-8 6"/>
    </svg>,
  ];

  const STEP_COLORS = [
    { bg: '#22c55e', border: '#16a34a' },   // green  — Learn
    { bg: '#3b82f6', border: '#2563eb' },   // blue   — Build
    { bg: '#8b5cf6', border: '#7c3aed' },   // purple — Get Assigned
    { bg: '#f97316', border: '#ea580c' },   // orange — Work & Grow
    { bg: '#ec4899', border: '#db2777' },   // pink   — Earn
  ];

  const STEP_LABELS = [
    { num: 1, title: 'Learn',        desc: 'Learn in-demand skills with expert mentors' },
    { num: 2, title: 'Build',        desc: 'Build real projects and create your portfolio' },
    { num: 3, title: 'Get Assigned', desc: 'Get assigned to live projects from WeNexa (our IT arm)' },
    { num: 4, title: 'Work & Grow',  desc: 'Work under mentor supervision and improve your industry skills' },
    { num: 5, title: 'Earn',         desc: 'Earn stipend and become financially independent while you learn' },
  ];

  return (
    <section className="eco-wrapper" id="ecosystem">

      {/* ── TOP: Step Flow + Mission ── */}
      <div className="eco-heading-block">
        <h2 className="eco-title">
          How the <span className="eco-title-brand">Weintern</span> Ecosystem Works
        </h2>

<div className="flex items-center justify-center gap-3 w-full">
  <div className="h-px flex-1 max-w-[120px] bg-slate-300" />

  <div className="h-2 w-2 rounded-full bg-blue-500" />

  <div className="h-px flex-1 max-w-[120px] bg-slate-300" />
</div>

        <p className="eco-subtitle mt-5">From learning to earning — a journey that changes your future.</p>
      </div>

      {/* Steps + Mission side by side */}
      <div className="eco-top-body">
        {/* Steps */}
        <div className="eco-steps" >
          {STEP_LABELS.map((s, i) => (
            <React.Fragment key={s.num}>
              <div className="eco-step-card">
                <div className="eco-step-circle" style={{ background: STEP_COLORS[i].bg, borderColor: STEP_COLORS[i].border }}>
                  {STEP_ICONS[i]}
                </div>
                <div>
                  <span className="eco-step-label">{s.num}. {s.title} </span>
                  <br />
                  <span className="eco-step-desc">{s.desc}</span>
                </div>
              </div>
              {i < STEP_LABELS.length - 1 && (
                <div className="eco-step-arrow">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                    <polyline points="13,6 19,12 13,18"/>
                  </svg>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Mission box */}
       <div className="eco-mission" >
         <div className="flex items-center gap-3">
  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#01153e]">
    <Target className="h-5 w-5 text-green-100" />
  </div>

  <h4 className="eco-mission-head">Our Mission</h4>
</div>
          <p className="eco-mission-body">
            To empower every student with practical skills, real experience and financial independence through meaningful work.
          </p>
          <div className="eco-mission-brands">
            <span className="eco-mb-wi">Weintern</span>
            <span className="eco-mb-inf">∞</span>
            <span className="eco-mb-wn"><span className="eco-mb-we">We</span>Nexa</span>
          </div>
          <p className="eco-mission-tag">Stronger Together</p>
        </div>
      </div>

      {/* ── BOTTOM: Dark Impact Banner ── */}
      <div className="eco-bottom">
        <div className="eco-bottom-inner"style={{backgroundColor:'#01153e'}}>

          {/* Left: heading */}
          <div className="eco-b-left">
            <h2 className="eco-b-heading">
              Real Work. Real Impact.<br />
              <span className="eco-b-green">Real Income</span> for Students.
            </h2>
            <p className="eco-b-sub">We believe students deserve to earn for the value they create.</p>
          </div>

          {/* Donut */}
          <div className="eco-donut">
            <svg viewBox="0 0 120 120" className="eco-donut-svg">
              <defs>
                <linearGradient id="dg" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#86efac" />
                  <stop offset="100%" stopColor="#16a34a" />
                </linearGradient>
              </defs>
              {/* Track */}
              <circle cx="60" cy="60" r="46" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="16" />
              {/* 75% arc: circumference = 2π×46 ≈ 289, 75% = 217 */}
              <circle cx="60" cy="60" r="46" fill="none" stroke="url(#dg)" strokeWidth="16"
                strokeDasharray="217 72" strokeDashoffset="0" strokeLinecap="round" />
            </svg>
            <div className="eco-donut-center">
              <span className="eco-donut-pct">75%</span>
              <span className="eco-donut-lbl">OF PROJECT VALUE<br />GOES TO<br />STUDENTS</span>
            </div>
          </div>

          {/* 4 benefit columns */}
          <div className="eco-b-benefits">

            {/* Financial Independence — purse/wallet with clasp */}
            <div className="eco-b-card">
              <div className="eco-b-icon">
                <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 16c0-3 2-5 5-5h10c3 0 5 2 5 5v12c0 2-1.5 4-4 4H14c-2.5 0-4-2-4-4V16z"/>
                  <path d="M15 11c0-2 1-4 5-4s5 2 5 4"/>
                  <path d="M10 21h20"/>
                  <circle cx="20" cy="25" r="2" fill="currentColor" stroke="none"/>
                </svg>
              </div>
              <h4 className="eco-b-title">Financial Independence</h4>
              <p className="eco-b-desc">Students earn real income through their skills and hard work.</p>
            </div>

            {/* Industry Experience — briefcase with bar chart */}
            <div className="eco-b-card">
              <div className="eco-b-icon">
                <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="6" y="15" width="28" height="19" rx="2"/>
                  <path d="M14 15v-3a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v3"/>
                  <line x1="13" y1="34" x2="13" y2="27"/>
                  <line x1="20" y1="34" x2="20" y2="24"/>
                  <line x1="27" y1="34" x2="27" y2="29"/>
                </svg>
              </div>
              <h4 className="eco-b-title">Industry Experience</h4>
              <p className="eco-b-desc">Work on real projects and gain experience before graduation.</p>
            </div>

            {/* Career Growth — upward trending line */}
            <div className="eco-b-card">
              <div className="eco-b-icon">
                <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="5,32 14,21 21,26 30,13 36,8"/>
                  <polyline points="30,8 36,8 36,14"/>
                </svg>
              </div>
              <h4 className="eco-b-title">Career Growth</h4>
              <p className="eco-b-desc">Build confidence, strong portfolio and better career opportunities.</p>
            </div>

            {/* Better Future — two people silhouettes */}
            <div className="eco-b-card">
              <div className="eco-b-icon">
                <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="14" cy="13" r="4.5"/>
                  <path d="M4 33c0-5.523 4.477-10 10-10"/>
                  <path d="M14 23c5.523 0 10 4.477 10 10"/>
                  <circle cx="28" cy="11" r="3.5"/>
                  <path d="M24 33c0-4.418 1.79-8 4-8"/>
                  <path d="M28 25c2.21 0 4 3.582 4 8"/>
                </svg>
              </div>
              <h4 className="eco-b-title">Better Future</h4>
              <p className="eco-b-desc">Empowered students create a stronger and better India.</p>
            </div>

          </div>
        </div>

       
      </div>

<motion.div
  initial={{ opacity: 0, y: 18 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, amount: 0.4 }}
  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
  whileHover={{ y: -2 }}
  className="
    group relative mx-auto mt-10 w-full max-w-[1050px]
    overflow-hidden rounded-[17px]
    border border-[#dce8f3]
    bg-[#f5faff]
    px-4 py-3
    sm:px-5 sm:py-3
    md:px-8 md:py-[15px]
    shadow-[0_1px_4px_rgba(30,100,160,0.04)]
    transition-shadow duration-500
    hover:shadow-[0_8px_30px_rgba(37,141,221,0.10)]
  "
>
  {/* Animated Glow */}
  <motion.div
    animate={{
      x: ["-100%", "200%"],
    }}
    transition={{
      duration: 5,
      repeat: Infinity,
      repeatDelay: 3,
      ease: "easeInOut",
    }}
    className="
      pointer-events-none absolute inset-y-0 left-0
      w-[30%]
      bg-gradient-to-r from-transparent via-white/50 to-transparent
      skew-x-[-20deg]
    "
  />

  {/* ================= MOBILE ================= */}
  <div className="relative flex flex-col gap-2 md:hidden">

    {/* First Row */}
    <div className="flex items-center gap-2">
      <motion.div
        animate={{
          y: [0, -2, 0],
          rotate: [0, -2, 0],
        }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="shrink-0"
      >
        <Quote
          className="h-[25px] w-[25px] fill-[#258ddd] text-[#258ddd]"
          strokeWidth={0}
        />
      </motion.div>

      <p className="text-[12px] font-medium italic leading-tight tracking-[-0.01em] text-[#172033]">
        When you learn with WeIntern, you don’t just get a course –
      </p>
    </div>

    {/* Second Row */}
    <div className="flex items-center justify-center gap-2">
      <p className="text-center text-[12px] font-medium italic leading-tight tracking-[-0.01em] text-[#172033]">
        you get{" "}
        <motion.span
          animate={{
            opacity: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative font-bold text-[#2189dc]"
        >
          opportunities that pay.

          <motion.span
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{
              delay: 0.5,
              duration: 0.8,
              ease: "easeOut",
            }}
            className="
              absolute -bottom-1 left-0
              h-[1.5px] w-full
              origin-left rounded-full
              bg-[#2189dc]/30
            "
          />
        </motion.span>
      </p>

      <motion.div
        animate={{
          y: [0, -2, 0],
        }}
        transition={{
          duration: 2.8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="shrink-0"
      >
        <motion.div
          animate={{
            scale: [1, 1.06, 1],
          }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <ChartNoAxesCombined
            className="
              h-[25px] w-[25px]
              text-[#258ddd]
              transition-transform duration-300
            "
            strokeWidth={1.7}
          />
        </motion.div>
      </motion.div>
    </div>
  </div>


  {/* ================= TABLET + DESKTOP ================= */}
  <div className="relative hidden min-h-[40px] items-center md:flex">

    {/* Quote */}
    <motion.div
      animate={{
        y: [0, -3, 0],
        rotate: [0, -2, 0],
      }}
      transition={{
        duration: 3.5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className="flex w-[70px] items-center justify-start"
    >
      <Quote
        className="h-[38px] w-[38px] fill-[#258ddd] text-[#258ddd]"
        strokeWidth={0}
      />
    </motion.div>

    {/* Center Text */}
    <div className="flex flex-1 items-center justify-center">
      <p className="text-center text-[17px] font-medium italic tracking-[-0.01em] text-[#172033]">
        When you learn with WeIntern, you don’t just get a course – you get{" "}

        <motion.span
          animate={{
            opacity: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative font-bold text-[#2189dc]"
        >
          opportunities that pay.

          <motion.span
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{
              delay: 0.5,
              duration: 0.8,
              ease: "easeOut",
            }}
            className="
              absolute -bottom-1 left-0
              h-[2px] w-full
              origin-left rounded-full
              bg-[#2189dc]/30
            "
          />
        </motion.span>
      </p>
    </div>

    {/* Growth Icon */}
    <motion.div
      animate={{
        y: [0, -3, 0],
      }}
      transition={{
        duration: 2.8,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className="flex w-[70px] items-center justify-end"
    >
      <motion.div
        animate={{
          scale: [1, 1.06, 1],
        }}
        transition={{
          duration: 2.2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <ChartNoAxesCombined
          className="
            h-[38px] w-[38px]
            text-[#258ddd]
            transition-transform duration-300
            group-hover:scale-110
          "
          strokeWidth={1.7}
        />
      </motion.div>
    </motion.div>

  </div>
</motion.div>
    </section>
    
    
  );
  
};


// student project

export const Testimonials = () => {
const projectData = [
  { id: 1,  image: ecommerce,       title: "E-Commerce Website",       subtitle: "Built for Retail Brand",     tech: ["React", "Node.js", "MongoDB"] },
  { id: 2,  image: ai_chatbot,      title: "AI Chatbot Automation",    subtitle: "Built for SaaS Company",     tech: ["Python", "OpenAI", "FastAPI"] },
  { id: 3,  image: fleet_monitoring,title: "Fintech Dashboard",        subtitle: "Built for Fintech Startup",  tech: ["React", "Node.js", "Chart.js"] },
  { id: 4,  image: platform,        title: "Real Estate Platform",     subtitle: "Built for Real Estate Firm", tech: ["Next.js", "MongoDB", "Stripe"] },
  { id: 5,  image: edtech,          title: "EdTech Platform",          subtitle: "Built for Online Learning",  tech: ["Next.js", "Tailwind", "Prisma"] },
  { id: 6,  image: healthcare,      title: "Healthcare App",           subtitle: "Built for Clinic Network",   tech: ["React", "Firebase", "Stripe"] },
  { id: 7,  image: analytics,       title: "Analytics Dashboard",      subtitle: "Built for Marketing Agency", tech: ["Vue", "D3.js", "Node.js"] },
  { id: 8,  image: food_delivery,   title: "Food Delivery App",        subtitle: "Built for Restaurant Chain", tech: ["React", "Node.js", "MongoDB"] },
  { id: 9,  image: job_portal,      title: "Job Portal Website",       subtitle: "Built for Hiring Platform",  tech: ["Next.js", "Firebase", "Tailwind"] },
  { id: 10, image: travel_booking,  title: "Travel Booking Platform",  subtitle: "Built for Travel Agency",    tech: ["React", "Express", "Stripe"] },
];

const VISIBLE = 5;
const GAP = 14;

const ProjectCard = ({ image, title, subtitle, tech }) => (
  <div className="project-card">
    <div className="project-image-wrapper">
      <img src={image} alt={title} className="project-image" />
    </div>
    <div className="project-content">
      <h3>{title}</h3>
      <p>{subtitle}</p>
      <div className="tech-stack">
        {tech.map((item, i) => <span key={i}>{item}</span>)}
      </div>
    </div>
  </div>
);

  // eslint-disable-next-line no-unused-vars
const StudentProjectsSection = () => {
  const [start, setStart] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const trackRef = useRef(null);
  const [cardWidth, setCardWidth] = useState(0);

  useEffect(() => {
    const updateCardWidth = () => {
      if (trackRef.current) {
        const totalWidth = trackRef.current.offsetWidth;
        const width = (totalWidth - GAP * (VISIBLE - 1)) / VISIBLE;
        setCardWidth(width);
      }
    };
    updateCardWidth();
    window.addEventListener('resize', updateCardWidth);
    return () => window.removeEventListener('resize', updateCardWidth);
  }, [showAll]);

  return (
    <section className="student-projects-section" id="projects">
      <div className="container">

        <div className="section-header">
          <div />
          <div className="section-content">
            <h2>Real Projects Done by Our <span>Student Teams</span></h2>
            <p>Real clients. Real problems. Real impact.</p>
          </div>
          <button
            className="view-more-btn"
            onClick={() => { setShowAll(s => !s); setStart(0); }}
          >
            {showAll ? "← Show Less" : "View More Projects →"}
          </button>
        </div>

        {!showAll ? (
          <div className="projects-slider">
            <button
              className="slider-btn"
              onClick={() => setStart(s => Math.max(0, s - 1))}
              disabled={start === 0}
            >‹</button>

            <div className="projects-track-wrapper" ref={trackRef}>
              <div
                className="projects-track"
                style={{
                  transform: `translateX(-${start * (cardWidth + GAP)}px)`,
                  gap: `${GAP}px`,
                }}
              >
                {projectData.map(p => (
                  <div
                    key={p.id}
                    style={{ minWidth: cardWidth > 0 ? `${cardWidth}px` : `calc((100% - ${GAP * (VISIBLE - 1)}px) / ${VISIBLE})` }}
                  >
                    <ProjectCard {...p} />
                  </div>
                ))}
              </div>
            </div>

            <button
              className="slider-btn"
              onClick={() => setStart(s => Math.min(projectData.length - VISIBLE, s + 1))}
              disabled={start + VISIBLE >= projectData.length}
            >›</button>
          </div>
        ) : (
          <div className="projects-grid-all">
            {projectData.map(p => <ProjectCard key={p.id} {...p} />)}
          </div>
        )}

      </div>
    </section>
  );
};

};
// ===== Vision =====
export const Vision = () => {
  React.useEffect(() => {
    const container = document.getElementById('visionParticles');
    if (!container) return;
    // Clear existing
    while (container.firstChild) container.removeChild(container.firstChild);

    const CONFIGS = [
      { color: 'rgba(232,168,32,0.55)', minSize: 3, maxSize: 6 },
      { color: 'rgba(33,150,201,0.45)',  minSize: 2, maxSize: 5 },
      { color: 'rgba(255,255,255,0.15)', minSize: 1, maxSize: 3 },
    ];

    for (let i = 0; i < 40; i++) {
      const p = document.createElement('div');
      const cfg = CONFIGS[Math.floor(Math.random() * CONFIGS.length)];
      const size = cfg.minSize + Math.random() * (cfg.maxSize - cfg.minSize);
      const duration = 6 + Math.random() * 9;
      const delay = Math.random() * 5;
      const xMove = (Math.random() - 0.5) * 50;
      const yMove = -(20 + Math.random() * 50);

      Object.assign(p.style, {
        position: 'absolute',
        width: size + 'px',
        height: size + 'px',
        borderRadius: '50%',
        background: cfg.color,
        left: Math.random() * 100 + '%',
        top: Math.random() * 100 + '%',
        animation: `visionParticleAnim ${duration}s ease-in-out ${delay}s infinite`,
        '--vx': xMove + 'px',
        '--vy': yMove + 'px',
        pointerEvents: 'none',
      });
      container.appendChild(p);
    }

    if (!document.getElementById('vision-particle-style')) {
      const style = document.createElement('style');
      style.id = 'vision-particle-style';
      style.textContent = `
        @keyframes visionParticleAnim {
          0%   { transform: translate(0,0) scale(1);   opacity: 0; }
          15%  { opacity: 1; }
          50%  { transform: translate(var(--vx), var(--vy)) scale(1.4); opacity: 0.9; }
          85%  { opacity: 0.3; }
          100% { transform: translate(calc(var(--vx)*1.8), calc(var(--vy)*1.8)) scale(0.6); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);
 
};

// ===== Live Journey Section =====
export const LiveJourney = () => {
  const j1 = useReveal();
  const j2 = useReveal();
  const j3 = useReveal();
  const [showModal, setShowModal] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleViewDetails = () => {
    // Check if user is logged in
    if (!user) {
      // User not logged in - redirect to login
      console.log('❌ User not logged in - redirecting to login/register');
      toast("Please login or register to view details", { icon: 'ℹ️' });
      navigate('/login');
      return;
    }
    
    // User is logged in - show modal
    console.log('✅ User logged in - showing details modal');
    setShowModal(true);
  };

  const handleEnrollNow = async () => {
    if (!user) {
      toast.error('Please login first');
      navigate('/login');
      return;
    }

    try {
      toast.loading('Preparing payment...', { id: 'cohort-pay' });

      // Load Razorpay SDK
      const sdkLoaded = await new Promise((resolve) => {
        if (window.Razorpay) { resolve(true); return; }
        const s = document.createElement('script');
        s.src = 'https://checkout.razorpay.com/v1/checkout.js';
        s.onload = () => resolve(true);
        s.onerror = () => resolve(false);
        document.body.appendChild(s);
      });

      if (!sdkLoaded) {
        toast.error('Payment gateway failed to load. Check your internet.', { id: 'cohort-pay' });
        return;
      }

      // Create order from backend
      const orderRes = await API.post('/payments/create-order', {
        amount: 199,
        enrollmentId: null,
        description: 'WeIntern Weekly Skill Cohort'
      });

      if (!orderRes.data.success) {
        toast.error(orderRes.data.message || 'Failed to create order', { id: 'cohort-pay' });
        return;
      }

      toast.dismiss('cohort-pay');
      const order = orderRes.data.order;

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency || 'INR',
        name: 'WeIntern',
        description: 'Weekly Skill Cohort - Batch Registration',
        order_id: order.id,
        image: '/welogo.png',
        prefill: {
          name: user.name || '',
          email: user.email || '',
          contact: user.phone || ''
        },
        notes: {
          course: 'WeIntern Weekly Skill Cohort',
          batch: 'Batch 1',
          userId: user._id
        },
        theme: { color: '#18b45b' },
        handler: async function (response) {
          try {
            toast.loading('Verifying payment...', { id: 'cohort-verify' });
            const verifyRes = await API.post('/payments/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              enrollmentId: null
            });
            if (verifyRes.data.success) {
              toast.success('🎉 Payment Successful! You are registered for the cohort.', { id: 'cohort-verify', duration: 5000 });
              setShowModal(false);
            } else {
              toast.error('Payment verification failed. Contact support.', { id: 'cohort-verify' });
            }
          } catch (err) {
            toast.error('Verification error: ' + (err.response?.data?.message || err.message), { id: 'cohort-verify' });
          }
        },
        modal: {
          ondismiss: function() {
            toast('Payment cancelled', { icon: 'ℹ️' });
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function(response) {
        toast.error('Payment failed: ' + response.error.description);
      });
      rzp.open();

    } catch (err) {
      toast.error('Error: ' + (err.response?.data?.message || err.message), { id: 'cohort-pay' });
    }
  };
  const [showBooking, setShowBooking] = useState(false);
    const [bookingStep, setBookingStep] = useState("form"); // form | submitting | success
    const [form, setForm] = useState({
      name: "",
      email: "",
      phone: "",
      college: "",
      domain: "",
      day: "",
      year: "",
    });
    const [errors, setErrors] = useState({});
 
    const TOTAL_SEATS = 10;
    const SEATS_TAKEN = 6;
 
    const DOMAINS = [
      "Web Development",
      "App Development",
      "UI/UX Design",
      "Data Science & AI",
      "Digital Marketing",
      "Other",
    ];
 
    const updateField = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
    const setDay = (day) => setForm((f) => ({ ...f, day }));
 
    const validateBooking = () => {
      const e = {};
      if (!form.name.trim()) e.name = "Enter your full name";
      if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email";
      if (!/^\d{10}$/.test(form.phone.replace(/\s/g, ""))) e.phone = "Enter a 10-digit phone number";
      if (!form.college.trim()) e.college = "Enter your college or university";
      if (!form.domain) e.domain = "Choose a domain";
      if (!form.day) e.day = "Pick Saturday or Sunday";
      setErrors(e);
      return Object.keys(e).length === 0;
    };
 
   const handleBookingSubmit = async (e) => {
  e.preventDefault();

  if (!validateBooking()) return;

  setBookingStep("submitting");

  try {
    const response = await submitCohortApplication({
      name: form.name,
      email: form.email,
      phone: form.phone,
      college: form.college,
      domain: form.domain,
      year: form.year,
      day: form.day,
    });

    if (response.data.success) {
      setBookingStep("success");

      toast.success("Seat reserved successfully!");
    } else {
      setBookingStep("form");

      toast.error(
        response.data.message || "Failed to reserve your seat."
      );
    }
  } catch (error) {
    console.error("Cohort booking error:", error);

    setBookingStep("form");

    toast.error(
      error.response?.data?.message ||
      "Something went wrong. Please try again."
    );
  }
};

  return (
   <>
<section id="journey" className="relative overflow-hidden bg-gradient-to-b from-neutral-50 via-white to-neutral-100 py-10 lg:py-10">
  {/* Ambient glass blobs */}
  <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-neutral-300/30 blur-3xl" />
  <div className="pointer-events-none absolute top-1/2 -right-32 h-[28rem] w-[28rem] rounded-full bg-neutral-200/40 blur-3xl" />
 
  <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
    {/* Header */}
    <div className="mx-auto mb-16 w-full max-w-4xl px-4 text-center sm:mb-20">
  {/* Section Label */}
  <div className="mb-5 flex items-center justify-center gap-2">
    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.45)]" />

    <span
      className="
        text-[10px]
        font-bold
        uppercase
        tracking-[0.22em]
        text-neutral-500
        sm:text-[11px]
      "
    >
      Your Journey
    </span>

    <span className="h-px w-8 bg-neutral-200" />
  </div>

  {/* Main Heading */}
  <h2
    className="
      font-display
      text-[30px]
      font-bold
      leading-[1.02]
      tracking-[-0.045em]
      bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent
      sm:text-5xl
      md:text-6xl
      lg:text-[38px]
    "
  >
    Learn.
    <span className="mx-2 text-blue-700 sm:mx-3">Build.</span>
    <span className="bg-gradient-to-r from-purple-500 to-purple-600 bg-clip-text text-transparent">
      Grow.
    </span>
  </h2>

  {/* Description */}
  <p
  className="
    mx-auto
    mt-1
    max-w-2xl
    text-[11px]
    leading-5
    text-neutral-500
    sm:mt-5
    sm:text-xs
    sm:leading-8
    lg:text-base
    lg:leading-7
  "
>
  Workshops, skill cohorts, hackathons, and networking events designed
  to help you build real skills, gain practical experience, and become
  industry-ready.
</p>


</div>
 
    {/* Cards */}
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
      {/* Card 1: Cohort Live */}
<div
  className="
    group relative isolate overflow-hidden rounded-[20px]
    border border-emerald-100/80
    bg-white/75
    shadow-[0_8px_30px_rgba(16,185,129,0.08)]
    backdrop-blur-xl
    transition-all duration-500
    hover:-translate-y-1.5
    hover:border-emerald-200
    hover:shadow-[0_20px_45px_rgba(16,185,129,0.14)]
  "
>
  {/* Animated background glow */}
  <div
    className="
      pointer-events-none absolute -right-12 -top-12
      h-32 w-32 rounded-full
      bg-emerald-400/15 blur-3xl
      transition-all duration-700
      group-hover:scale-150 group-hover:bg-emerald-400/25
    "
  />

  <div
    className="
      pointer-events-none absolute -bottom-16 -left-12
      h-32 w-32 rounded-full
      bg-green-300/10 blur-3xl
      transition-all duration-700
      group-hover:scale-125
    "
  />

  {/* Image */}
  <div className="relative h-36 overflow-hidden bg-emerald-50">
    <img
      src={cohortLiveImg}
      alt="Cohort Live"
      className="
        h-full w-full object-cover
        transition-transform duration-700
        ease-out
        group-hover:scale-110
      "
    />

    {/* Image overlay */}
    <div
      className="
        absolute inset-0
        bg-gradient-to-t
        from-emerald-950/40
        via-transparent
        to-emerald-900/5
      "
    />

    {/* Animated shine */}
    <div
      className="
        pointer-events-none absolute inset-y-0 -left-[120%]
        w-[60%]
        skew-x-[-20deg]
        bg-gradient-to-r
        from-transparent
        via-white/25
        to-transparent
        transition-all duration-1000
        group-hover:left-[140%]
      "
    />

    {/* Live Badge */}
    <div
      className="
        absolute left-3 top-3
        inline-flex items-center gap-1.5
        rounded-full
        border border-emerald-200/60
        bg-white/90
        px-3 py-1
        text-[11px] font-bold
        text-emerald-700
        shadow-[0_4px_12px_rgba(16,185,129,0.15)]
        backdrop-blur-md
      "
    >
      <span className="relative flex h-1.5 w-1.5">
        <span
          className="
            absolute inline-flex h-full w-full
            animate-ping rounded-full
            bg-emerald-500 opacity-60
          "
        />
        <span
          className="
            relative inline-flex h-1.5 w-1.5
            rounded-full bg-emerald-500
          "
        />
      </span>

      Live now
    </div>

    {/* Small floating label */}
    <div
      className="
        absolute bottom-3 right-3
        rounded-full
        border border-white/30
        bg-black/20
        px-2.5 py-0.5
        text-[10px] font-semibold
        text-white
        backdrop-blur-md
        transition-all duration-300
        group-hover:bg-emerald-500/80
      "
    >
      Free Cohort
    </div>
  </div>

  {/* Content */}
  <div className="relative p-4 lg:p-5">

    {/* Eyebrow */}
    <div className="mb-2 flex items-center gap-2">
      <span className="h-px w-5 bg-emerald-400" />

      <h3
        className="
          text-[10px]
          font-bold
          uppercase
          tracking-[0.18em]
          text-emerald-600
        "
      >
        Cohort
      </h3>
    </div>

    {/* Heading */}
    <h3
      className="
        mb-3
        text-lg
        font-bold
        tracking-[-0.03em]
        text-slate-950
        transition-colors duration-300
        group-hover:text-emerald-700
      "
    >
      Cohort is Live!
    </h3>

    {/* Features */}
    <div className="space-y-0">

      <div
        className="
          flex items-center justify-between
          border-b border-slate-200/80
          py-2.5
        "
      >
        <span className="text-xs text-slate-600">
          Seats per batch
        </span>

        <span
          className="
            rounded-full
            bg-emerald-50
            px-2 py-0.5
            text-[11px] font-bold
            text-emerald-700
          "
        >
          10 seats
        </span>
      </div>

      <div
        className="
          flex items-center justify-between
          border-b border-slate-200/80
          py-2.5
        "
      >
        <span className="text-xs text-slate-600">
          Registration
        </span>

        <span className="text-xs font-semibold text-emerald-600">
          Free
        </span>
      </div>

      <div
        className="
          flex items-center justify-between
          py-2.5
        "
      >
        <span className="text-xs text-slate-600">
          Availability
        </span>

        <span className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-600">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
          Closing soon
        </span>
      </div>

    </div>

    {/* CTA */}
    <button
      onClick={() => setShowBooking(true)}
      className="
        group/btn relative mt-4 flex w-full
        items-center justify-center gap-2
        overflow-hidden rounded-lg
        bg-emerald-600
        py-2.5
        text-xs font-bold text-white
        shadow-[0_6px_16px_rgba(16,185,129,0.20)]
        transition-all duration-300
        hover:bg-emerald-700
        hover:shadow-[0_10px_24px_rgba(16,185,129,0.30)]
        active:scale-[0.98]
      "
    >
      {/* Button shine */}
      <span
        className="
          absolute inset-y-0 -left-full
          w-1/2 skew-x-[-20deg]
          bg-gradient-to-r
          from-transparent
          via-white/20
          to-transparent
          transition-all duration-700
          group-hover/btn:left-[130%]
        "
      />

      <span className="relative">
        Book your seat
      </span>

      <ArrowRight
        className="
          relative h-3.5 w-3.5
          transition-transform duration-300
          group-hover/btn:translate-x-1
        "
      />
    </button>

    {/* Bottom micro-copy */}
    <p className="mt-2 text-center text-[10px] text-slate-400">
      Limited seats · Free to attend
    </p>

  </div>
</div>
 
      {/* Card 2: Coming Next */}
<div
  className="
    group relative isolate overflow-hidden rounded-[20px]
    border border-blue-100/80
    bg-white/70
    shadow-[0_8px_30px_rgba(59,130,246,0.07)]
    backdrop-blur-xl
    transition-all duration-500
    hover:-translate-y-1.5
    hover:border-blue-200
    hover:shadow-[0_20px_45px_rgba(59,130,246,0.14)]
  "
>
  {/* Ambient blue glow */}
  <div
    className="
      pointer-events-none absolute -right-12 -top-12
      h-32 w-32 rounded-full
      bg-blue-400/10 blur-3xl
      transition-all duration-700
      group-hover:scale-150
      group-hover:bg-blue-400/20
    "
  />

  <div
    className="
      pointer-events-none absolute -bottom-16 -left-12
      h-32 w-32 rounded-full
      bg-sky-300/10 blur-3xl
      transition-all duration-700
      group-hover:scale-125
    "
  />

  {/* Image */}
  <div className="relative h-36 overflow-hidden bg-blue-50">
    <img
      src={cohortUpcomingImg}
      alt="Coming Next"
      className="
        h-full w-full object-cover
        opacity-65
        transition-all duration-700
        ease-out
        group-hover:scale-110
        group-hover:opacity-75
      "
    />

    {/* Animated shine */}
    <div
      className="
        pointer-events-none absolute inset-y-0 -left-[120%]
        w-[60%]
        skew-x-[-20deg]
        bg-gradient-to-r
        from-transparent
        via-white/20
        to-transparent
        transition-all duration-1000
        group-hover:left-[140%]
      "
    />

    {/* Pipeline badge */}
    <div
      className="
        absolute left-3 top-3
        inline-flex items-center gap-1.5
        rounded-full
        border border-blue-200/60
        bg-blue-950/80
        px-3 py-1
        text-[11px] font-bold
        text-white
        shadow-[0_4px_15px_rgba(30,64,175,0.18)]
        backdrop-blur-md
      "
    >
      <span className="relative flex h-1.5 w-1.5">
        <span
          className="
            absolute inline-flex h-full w-full
            animate-ping rounded-full
            bg-blue-300 opacity-60
          "
        />
        <span
          className="
            relative inline-flex h-1.5 w-1.5
            rounded-full bg-blue-300
          "
        />
      </span>

      Next in pipeline
    </div>

    {/* Lock icon */}
    <div
      className="
        absolute right-3 top-3
        flex h-7 w-7 items-center justify-center
        rounded-full
        border border-white/60
        bg-white/85
        text-blue-600
        shadow-[0_4px_12px_rgba(30,64,175,0.12)]
        backdrop-blur-md
        transition-all duration-300
        group-hover:rotate-[-8deg]
        group-hover:scale-110
      "
    >
      <Lock className="h-3 w-3" />
    </div>

    {/* Coming soon label */}
    <div
      className="
        absolute bottom-3 right-3
        rounded-full
        border border-white/30
        bg-blue-950/30
        px-2.5 py-0.5
        text-[10px] font-semibold
        text-white
        backdrop-blur-md
        transition-all duration-300
        group-hover:bg-blue-600/70
      "
    >
      Coming soon
    </div>
  </div>

  {/* Content */}
  <div className="relative p-4 lg:p-5">

    {/* Eyebrow */}
    <div className="mb-2 flex items-center gap-2">
      <span className="h-px w-5 bg-blue-400" />

      <h3
        className="
          text-[10px]
          font-bold
          uppercase
          tracking-[0.18em]
          text-blue-600
        "
      >
        Upcoming
      </h3>
    </div>

    {/* Heading */}
    <h2
      className="
        mb-3
        text-lg
        font-bold
        tracking-[-0.03em]
        text-slate-950
        transition-colors duration-300
        group-hover:text-blue-700
      "
    >
      Coming Up Next
    </h2>

    {/* Features */}
    <div className="space-y-0">

      <div
        className="
          flex items-center justify-between
          border-b border-slate-200/80
          py-2.5
        "
      >
        <span className="text-xs text-slate-600">
          Upcoming projects
        </span>

        <span
          className="
            rounded-full
            bg-blue-50
            px-2 py-0.5
            text-[11px] font-bold
            text-blue-700
          "
        >
          8 projects
        </span>
      </div>

      <div
        className="
          flex items-center justify-between
          border-b border-slate-200/80
          py-2.5
        "
      >
        <span className="text-xs text-slate-600">
          Expected launch
        </span>

        <span className="text-xs font-semibold text-blue-600">
          2–3 weeks
        </span>
      </div>

      <div
        className="
          flex items-center justify-between
          py-2.5
        "
      >
        <span className="text-xs text-slate-600">
          Access
        </span>

        <span className="flex items-center gap-1.5 text-[11px] font-semibold text-sky-600">
          <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
          Opening soon
        </span>
      </div>

    </div>

    {/* Locked CTA */}
    <button
      disabled
      className="
        mt-4 flex w-full
        cursor-not-allowed
        items-center justify-center gap-2
        rounded-lg
        border border-blue-100
        bg-blue-50/70
        py-2.5
        text-xs font-bold
        text-blue-300
        backdrop-blur-md
        transition-all duration-300
        group-hover:border-blue-200
        group-hover:bg-blue-50
        group-hover:text-blue-400
      "
    >
      <Lock className="h-3.5 w-3.5" />
      Locked
    </button>

    {/* Micro-copy */}
    <p className="mt-2 text-center text-[10px] text-slate-400">
      Early access will open soon
    </p>

  </div>
</div>
 
      {/* Card 3: Future Opportunities */}
<div
  className="
    group relative isolate overflow-hidden rounded-[20px]
    border border-violet-100/80
    bg-white/70
    shadow-[0_8px_30px_rgba(139,92,246,0.07)]
    backdrop-blur-xl
    transition-all duration-500
    hover:-translate-y-1.5
    hover:border-violet-200
    hover:shadow-[0_20px_45px_rgba(139,92,246,0.14)]
  "
>
  {/* Ambient purple glow */}
  <div
    className="
      pointer-events-none absolute -right-12 -top-12
      h-32 w-32 rounded-full
      bg-violet-400/10 blur-3xl
      transition-all duration-700
      group-hover:scale-150
      group-hover:bg-violet-400/20
    "
  />

  <div
    className="
      pointer-events-none absolute -bottom-16 -left-12
      h-32 w-32 rounded-full
      bg-purple-300/10 blur-3xl
      transition-all duration-700
      group-hover:scale-125
    "
  />

  {/* Image */}
  <div className="relative h-36 overflow-hidden">
    <img
      src={cohortFutureImg}
      alt="Future Opportunities"
      className="
        h-full w-full object-cover
        transition-all duration-700
        ease-out
        group-hover:scale-110
      "
    />

    {/* Animated shine */}
    <div
      className="
        pointer-events-none absolute inset-y-0 -left-[120%]
        w-[60%]
        skew-x-[-20deg]
        bg-gradient-to-r
        from-transparent
        via-white/20
        to-transparent
        transition-all duration-1000
        group-hover:left-[140%]
      "
    />

    {/* Coming soon badge */}
    <div
      className="
        absolute left-3 top-3
        inline-flex items-center gap-1.5
        rounded-full
        border border-violet-200/50
        bg-violet-950/80
        px-3 py-1
        text-[11px] font-bold
        text-white
        shadow-[0_4px_15px_rgba(109,40,217,0.18)]
        backdrop-blur-md
      "
    >
      <span className="relative flex h-1.5 w-1.5">
        <span
          className="
            absolute inline-flex h-full w-full
            animate-ping rounded-full
            bg-violet-300 opacity-60
          "
        />
        <span
          className="
            relative inline-flex h-1.5 w-1.5
            rounded-full bg-violet-300
          "
        />
      </span>

      Coming soon
    </div>

    {/* Lock */}
    <div
      className="
        absolute right-3 top-3
        flex h-7 w-7 items-center justify-center
        rounded-full
        border border-white/60
        bg-white/85
        text-violet-600
        shadow-[0_4px_12px_rgba(109,40,217,0.12)]
        backdrop-blur-md
        transition-all duration-300
        group-hover:rotate-[-8deg]
        group-hover:scale-110
      "
    >
      <Lock className="h-3 w-3" />
    </div>

    {/* Future label */}
    <div
      className="
        absolute bottom-3 right-3
        rounded-full
        border border-white/30
        bg-violet-950/30
        px-2.5 py-0.5
        text-[10px] font-semibold
        text-white
        backdrop-blur-md
        transition-all duration-300
        group-hover:bg-violet-600/70
      "
    >
      Future track
    </div>
  </div>

  {/* Content */}
  <div className="relative p-4 lg:p-5">

    {/* Eyebrow */}
    <div className="mb-2 flex items-center gap-2">
      <span className="h-px w-5 bg-violet-400" />

      <h3
        className="
          text-[10px]
          font-bold
          uppercase
          tracking-[0.18em]
          text-violet-600
        "
      >
        Future
      </h3>
    </div>

    {/* Heading */}
    <h2
      className="
        mb-3
        text-lg
        font-bold
        tracking-[-0.03em]
        text-slate-950
        transition-colors duration-300
        group-hover:text-violet-700
      "
    >
      What's Ahead
    </h2>

    {/* Features */}
    <div className="space-y-0">

      <div
        className="
          flex items-center justify-between
          border-b border-slate-200/80
          py-2.5
        "
      >
        <span className="text-xs text-slate-600">
          New opportunities
        </span>

        <span
          className="
            rounded-full
            bg-violet-50
            px-2 py-0.5
            text-[11px] font-bold
            text-violet-700
          "
        >
          20+ opportunities
        </span>
      </div>

      <div
        className="
          flex items-center justify-between
          border-b border-slate-200/80
          py-2.5
        "
      >
        <span className="text-xs text-slate-600">
          Project scope
        </span>

        <span className="text-xs font-semibold text-violet-600">
          International
        </span>
      </div>

      <div
        className="
          flex items-center justify-between
          py-2.5
        "
      >
        <span className="text-xs text-slate-600">
          Learning tracks
        </span>

        <span className="flex items-center gap-1.5 text-[11px] font-semibold text-purple-600">
          <span className="h-1.5 w-1.5 rounded-full bg-purple-500" />
          Advanced tech
        </span>
      </div>

    </div>

    {/* Locked CTA */}
    <button
      disabled
      className="
        mt-4 flex w-full
        cursor-not-allowed
        items-center justify-center gap-2
        rounded-lg
        border border-violet-100
        bg-violet-50/70
        py-2.5
        text-xs font-bold
        text-violet-300
        backdrop-blur-md
        transition-all duration-300
        group-hover:border-violet-200
        group-hover:bg-violet-50
        group-hover:text-violet-400
      "
    >
      <Lock className="h-3.5 w-3.5" />
      Locked
    </button>

    {/* Micro-copy */}
    <p className="mt-2 text-center text-[10px] text-slate-400">
      More opportunities are on the way
    </p>

  </div>
</div>
    </div>
 
    {/* Bottom Note */}
    <div
  className="
    group relative mx-auto mt-14 flex max-w-3xl
    items-center justify-center gap-4
    overflow-hidden
    border-y border-emerald-100
    px-6 py-5
    transition-all duration-500
    hover:border-emerald-200
  "
>
  {/* Animated top glow line */}
  <span
    className="
      absolute left-[-20%] top-0 h-px w-[40%]
      bg-gradient-to-r
      from-transparent
      via-emerald-400
      to-transparent
      opacity-0
      transition-all duration-1000
      group-hover:left-[80%]
      group-hover:opacity-100
    "
  />

  {/* Animated bottom glow line */}
  <span
    className="
      absolute right-[-20%] bottom-0 h-px w-[40%]
      bg-gradient-to-r
      from-transparent
      via-emerald-300
      to-transparent
      opacity-0
      transition-all duration-1000
      group-hover:right-[80%]
      group-hover:opacity-100
    "
  />

  {/* Soft ambient glow */}
  <span
    className="
      pointer-events-none absolute left-1/2 top-1/2
      h-24 w-48 -translate-x-1/2 -translate-y-1/2
      rounded-full
      bg-emerald-400/5
      blur-3xl
      opacity-0
      transition-all duration-700
      group-hover:scale-150
      group-hover:opacity-100
    "
  />

  {/* Icon */}
  <div className="relative shrink-0">
    {/* Pulsing glow */}
    <span
      className="
        absolute inset-0
        rounded-full
        bg-emerald-400/20
        blur-md
        opacity-0
        transition-all duration-500
        group-hover:scale-150
        group-hover:opacity-100
        group-hover:animate-pulse
      "
    />

    <Gift
      className="
        relative h-5 w-5
        text-emerald-500
        transition-all duration-500
        group-hover:-translate-y-1
        group-hover:rotate-[-8deg]
        group-hover:scale-110
      "
    />
  </div>

  {/* Quote */}
  <p
    className="
      relative text-center
      text-sm font-medium
      leading-relaxed
      text-slate-600
      transition-all duration-500
      group-hover:-translate-y-0.5
      sm:text-[15px]
    "
  >
    Every project means{" "}

    <span
      className="
        relative font-semibold text-slate-950
        transition-colors duration-300
        group-hover:text-emerald-700
      "
    >
      real experience
    </span>

    , a{" "}

    <span
      className="
        relative font-semibold text-slate-950
        transition-colors duration-300
        group-hover:text-emerald-700
      "
    >
      real portfolio
    </span>

    , and{" "}

    <span
      className="
        relative font-semibold text-emerald-600
        transition-all duration-300
        group-hover:text-emerald-500
      "
    >
      real income
    </span>
    .
  </p>

  {/* Shimmer sweep */}
  <span
    className="
      pointer-events-none absolute inset-y-0
      left-[-100%] w-1/3
      skew-x-[-20deg]
      bg-gradient-to-r
      from-transparent
      via-white/50
      to-transparent
      opacity-0
      transition-all duration-1000
      group-hover:left-[120%]
      group-hover:opacity-100
    "
  />
</div>
  </div>
 
  {/* Booking Modal */}
  <AnimatePresence>
    {showBooking && (
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/40 px-4 py-8 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setShowBooking(false)}
      >
        <motion.div
          className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-white/60 bg-white/80 shadow-[0_25px_80px_rgba(0,0,0,0.25)] backdrop-blur-2xl"
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => setShowBooking(false)}
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-900/5 hover:text-neutral-900"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
 
          {bookingStep !== "success" ? (
            <div className="p-7 lg:p-8">
              <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-neutral-500">
                Weekly Skill Cohort
              </div>
              <h2 className="mb-1 font-display text-2xl font-bold text-neutral-900">
                Reserve your seat
              </h2>
              <p className="mb-6 text-sm text-neutral-500">
                Hands-on, offline workshop for students who want to build real,
                industry-ready skills.
              </p>
 
              {/* Info strip */}
              <div className="mb-6 grid grid-cols-1 gap-3 rounded-xl border border-white/60 bg-white/50 p-4 backdrop-blur-md sm:grid-cols-2">
                <div className="flex items-start gap-2 text-sm text-neutral-600">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-neutral-400" />
                  <span>City Vista, Kharadi, Pune</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-neutral-600">
                  <Users className="mt-0.5 h-4 w-4 shrink-0 text-neutral-400" />
                  <span>{TOTAL_SEATS - SEATS_TAKEN} of {TOTAL_SEATS} seats left</span>
                </div>
                <div className="flex items-start gap-2 text-sm sm:col-span-2">
                  <Gift className="mt-0.5 h-4 w-4 shrink-0 text-neutral-900" />
                  <span className="text-neutral-600">
                    <span className="mr-1.5 text-neutral-400 line-through">₹199</span>
                    <span className="font-semibold text-neutral-900">Free for this batch</span>
                  </span>
                </div>
              </div>
 
              {/* Seats progress */}
              <div className="mb-6">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-200/70">
                  <div
                    className="h-full rounded-full bg-neutral-900"
                    style={{ width: `${(SEATS_TAKEN / TOTAL_SEATS) * 100}%` }}
                  />
                </div>
              </div>
 
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <label className="block">
                  <span className="mb-1.5 block text-xs font-medium text-neutral-600">
                    Full name
                  </span>
                  <input
                    type="text"
                    value={form.name}
                    onChange={updateField("name")}
                    placeholder="Ananya Sharma"
                    className={`w-full rounded-lg border bg-white/70 px-3.5 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none backdrop-blur-md transition-colors focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200 ${errors.name ? "border-rose-300" : "border-neutral-200"}`}
                  />
                  {errors.name && <span className="mt-1 block text-xs text-rose-500">{errors.name}</span>}
                </label>
 
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-medium text-neutral-600">Email</span>
                    <input
                      type="email"
                      value={form.email}
                      onChange={updateField("email")}
                      placeholder="you@college.edu"
                      className={`w-full rounded-lg border bg-white/70 px-3.5 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none backdrop-blur-md transition-colors focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200 ${errors.email ? "border-rose-300" : "border-neutral-200"}`}
                    />
                    {errors.email && <span className="mt-1 block text-xs text-rose-500">{errors.email}</span>}
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-medium text-neutral-600">
                      Phone number
                    </span>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={updateField("phone")}
                      placeholder="98765 43210"
                      className={`w-full rounded-lg border bg-white/70 px-3.5 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none backdrop-blur-md transition-colors focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200 ${errors.phone ? "border-rose-300" : "border-neutral-200"}`}
                    />
                    {errors.phone && <span className="mt-1 block text-xs text-rose-500">{errors.phone}</span>}
                  </label>
                </div>
 
                <label className="block">
                  <span className="mb-1.5 block text-xs font-medium text-neutral-600">
                    College / University
                  </span>
                  <input
                    type="text"
                    value={form.college}
                    onChange={updateField("college")}
                    placeholder="e.g. COEP Technological University"
                    className={`w-full rounded-lg border bg-white/70 px-3.5 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none backdrop-blur-md transition-colors focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200 ${errors.college ? "border-rose-300" : "border-neutral-200"}`}
                  />
                  {errors.college && <span className="mt-1 block text-xs text-rose-500">{errors.college}</span>}
                </label>
 
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-neutral-600">
                      <Layers className="h-3.5 w-3.5 text-neutral-400" />
                      Choose your domain
                    </span>
                    <select
                      value={form.domain}
                      onChange={updateField("domain")}
                      className={`w-full appearance-none rounded-lg border bg-white/70 px-3.5 py-2.5 text-sm text-neutral-900 outline-none backdrop-blur-md transition-colors focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200 ${errors.domain ? "border-rose-300" : "border-neutral-200"}`}
                    >
                      <option value="" disabled>
                        Select a domain
                      </option>
                      {DOMAINS.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                    {errors.domain && <span className="mt-1 block text-xs text-rose-500">{errors.domain}</span>}
                  </label>
 
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-medium text-neutral-600">
                      Year of study (optional)
                    </span>
                    <select
                      value={form.year}
                      onChange={updateField("year")}
                      className="w-full appearance-none rounded-lg border border-neutral-200 bg-white/70 px-3.5 py-2.5 text-sm text-neutral-900 outline-none backdrop-blur-md transition-colors focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200"
                    >
                      <option value="">Select year</option>
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="Final Year">Final Year</option>
                      <option value="Graduate">Graduate</option>
                    </select>
                  </label>
                </div>
 
                <div>
                  <span className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-neutral-600">
                    <Calendar className="h-3.5 w-3.5 text-neutral-400" />
                    Preferred day
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    {["Saturday", "Sunday"].map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setDay(d)}
                        className={`rounded-lg border px-4 py-2.5 text-sm font-medium backdrop-blur-md transition-all ${
                          form.day === d
                            ? "border-neutral-900 bg-neutral-900 text-white shadow-sm"
                            : "border-neutral-200 bg-white/70 text-neutral-600 hover:border-neutral-300"
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                  {errors.day && <span className="mt-1 block text-xs text-rose-500">{errors.day}</span>}
                  <p className="mt-1.5 text-xs text-neutral-400">
                    Sessions run weekends only — pick the day that works for you.
                  </p>
                </div>
 
                <button
                  type="submit"
                  disabled={bookingStep === "submitting"}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-neutral-900 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-black disabled:opacity-70"
                >
                  {bookingStep === "submitting" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Reserving your seat…
                    </>
                  ) : (
                    <>
                      Reserve my free seat
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
                <p className="text-center text-xs text-neutral-400">
                  No payment required. We'll confirm your seat on WhatsApp.
                </p>
              </form>
            </div>
          ) : (
            <div className="flex flex-col items-center px-8 py-14 text-center">
              <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-white/60 bg-white/70 backdrop-blur-md"
              >
                <CheckCircle2 className="h-7 w-7 text-neutral-900" />
              </motion.div>
              <h2 className="mb-2 font-display text-2xl font-bold text-neutral-900">
                You're in, {form.name.split(" ")[0]}!
              </h2>
              <p className="mb-6 max-w-sm text-sm leading-relaxed text-neutral-500">
                Your seat for the WeIntern Weekly Skill Cohort is reserved. We've
                sent the workshop details and WhatsApp group link to{" "}
                <span className="font-medium text-neutral-700">{form.email}</span>.
              </p>
              <div className="mb-6 w-full rounded-xl border border-white/60 bg-white/50 p-4 text-left text-sm text-neutral-600 backdrop-blur-md">
                <div className="flex justify-between border-b border-neutral-200/70 py-1.5">
                  <span>Domain</span>
                  <span className="font-medium text-neutral-800">{form.domain}</span>
                </div>
                <div className="flex justify-between border-b border-neutral-200/70 py-1.5">
                  <span>Day</span>
                  <span className="font-medium text-neutral-800">{form.day}</span>
                </div>
                <div className="flex justify-between border-b border-neutral-200/70 py-1.5">
                  <span>Venue</span>
                  <span className="font-medium text-neutral-800">City Vista, Kharadi, Pune</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span>Fee</span>
                  <span className="font-medium text-neutral-900">Free</span>
                </div>
              </div>
              <button
                onClick={() => setShowBooking(false)}
                className="w-full rounded-lg bg-neutral-900 py-3 text-sm font-semibold text-white transition-colors hover:bg-black"
              >
                Done
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
</section>
   </>
  );
};
