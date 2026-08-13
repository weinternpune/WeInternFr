import React from "react";
import { motion } from "framer-motion";

import codeplateau from "../../assets/partners/codeplateau-tieup.png";
import BMC from "../../assets/partners/BMC-Software-tieup.png";
import Cybage from "../../assets/partners/Cybage-tieup.png";
import Deloitte from "../../assets/partners/Deloitte-tieup.png";
import Persistant from "../../assets/partners/persistant-tieup.png";
import phoenix from "../../assets/partners/Phoenix-tieup.png";
import pradysis from "../../assets/partners/pradysis-tieup.png";
import radical from "../../assets/partners/radical-tieup.png";
import redhat from "../../assets/partners/redhat-tieup.png";
import tejit from "../../assets/partners/tejit-tieup.png";
import thinkitive from "../../assets/partners/thinkitive-tieup.png";
import wenexa from "../../assets/partners/wenexa-tieup.png";
import Zenture from "../../assets/partners/Zenture-tieup.png";

const partners = [
  {
    name: "CodePlateau",
    logo: codeplateau,
  },
  {
    name: "BMC Software",
    logo: BMC,
  },
  {
    name: "Pradysis",
    logo: pradysis,
  },
  {
    name: "Cybage",
    logo: Cybage,
  },
  {
    name: "Red Hat",
    logo: redhat,
  },
  {
    name: "Deloitte",
    logo: Deloitte,
  },
  {
    name: "Persistent",
    logo: Persistant,
  },
  {
    name: "Phoenix",
    logo: phoenix,
  },
  {
    name: "Radical",
    logo: radical,
  },
  {
    name: "Tejit",
    logo: tejit,
  },
  {
    name: "Thinkitive",
    logo: thinkitive,
  },
  {
    name: "WeNexa",
    logo: wenexa,
  },
  {
    name: "Zenture",
    logo: Zenture,
  },
];

/* ---------------------------------------------
   Animation Variants
--------------------------------------------- */

const headerContainer = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.1,
    },
  },
};

const headerItem = {
  hidden: {
    opacity: 0,
    y: 16,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const PartnerCard = ({ partner }) => {
  return (
    <motion.div
      className="
        group
        flex
        h-[72px]
        w-[150px]
        shrink-0
        items-center
        justify-center
        rounded-xl
        border
        border-slate-200
        bg-white
        px-4

        sm:h-[82px]
        sm:w-[175px]
        sm:px-5

        lg:h-[92px]
        lg:w-[205px]
        lg:rounded-2xl
        lg:px-6
      "
      initial={{
        opacity: 0.85,
        y: 0,
      }}
      whileHover={{
        y: -5,
        scale: 1.025,
        borderColor: "rgb(203 213 225)",
        boxShadow: "0 14px 30px rgba(15, 23, 42, 0.09)",
        transition: {
          duration: 0.25,
          ease: "easeOut",
        },
      }}
      whileTap={{
        scale: 0.98,
      }}
      transition={{
        duration: 0.25,
      }}
    >
      <motion.img
        src={partner.logo}
        alt={`${partner.name} logo`}
        loading="lazy"
        className="
          max-h-[38px]
          max-w-[112px]
          object-contain

          sm:max-h-[44px]
          sm:max-w-[135px]

          lg:max-h-[50px]
          lg:max-w-[155px]
        "
        whileHover={{
          scale: 1.08,
          transition: {
            duration: 0.3,
            ease: "easeOut",
          },
        }}
      />
    </motion.div>
  );
};

const PartnersMarquee = () => {
  return (
    <section
      className="
        relative
        overflow-hidden
        bg-slate-50
        py-12
        font-['Inter',sans-serif]

        sm:py-10
        lg:py-5
      "
    >
      {/* ========================================
          MARQUEE ANIMATION
      ======================================== */}

      <style>{`
        @keyframes partnersMarquee {
          from {
            transform: translateX(0);
          }

          to {
            transform: translateX(calc(-50% - 10px));
          }
        }

        .partners-marquee-track {
          animation: partnersMarquee 42s linear infinite;
          will-change: transform;
        }

        .partners-marquee-wrapper:hover .partners-marquee-track {
          animation-play-state: paused;
        }

        @media (max-width: 640px) {
          .partners-marquee-track {
            animation-duration: 30s;
          }
        }

        @media (min-width: 641px) and (max-width: 1024px) {
          .partners-marquee-track {
            animation-duration: 36s;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .partners-marquee-track {
            animation: none;
          }
        }
      `}</style>

      {/* Top border */}
      <div className="absolute left-0 right-0 top-0 h-px bg-slate-200/80" />

      {/* ========================================
          SECTION HEADER
      ======================================== */}

      <motion.div
        className="
          mx-auto
          mb-8
          max-w-3xl
          px-5
          text-center

          sm:mb-10
          sm:px-6

          lg:mb-12
        "
        variants={headerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{
          once: true,
          amount: 0.3,
        }}
      >
        {/* Eyebrow */}
        <motion.div
          variants={headerItem}
          className="
            mb-3
            inline-flex
            items-center
            gap-2
            text-[9px]
            font-bold
            uppercase
            tracking-[0.22em]
            text-slate-500

            sm:text-[10px]
            sm:tracking-[0.25em]
          "
        >
          <motion.span
            className="h-px w-5 bg-slate-400 sm:w-7"
            initial={{ width: 0, opacity: 0 }}
            whileInView={{
              width: "1.75rem",
              opacity: 1,
            }}
            viewport={{ once: true }}
            transition={{
              duration: 0.6,
              delay: 0.15,
            }}
          />

          Industry Partners

          <motion.span
            className="h-px w-5 bg-slate-400 sm:w-7"
            initial={{ width: 0, opacity: 0 }}
            whileInView={{
              width: "1.75rem",
              opacity: 1,
            }}
            viewport={{ once: true }}
            transition={{
              duration: 0.6,
              delay: 0.15,
            }}
          />
        </motion.div>

        {/* Heading */}
        <motion.h2
          variants={headerItem}
          className="
            text-[20px]
            font-semibold
            leading-tight
            tracking-[-0.025em]
            text-slate-950

            sm:text-3xl
            lg:text-[40px]
          "
        >
          Trusted by{" "}
          <motion.span
            className="inline-block text-green-600"
            whileHover={{
              y: -2,
              transition: {
                duration: 0.2,
              },
            }}
          >
            Industry Leaders
          </motion.span>
        </motion.h2>

        {/* Description */}
        <motion.p
          variants={headerItem}
          className="
            mx-auto
            mt-2.5
            max-w-[540px]
            text-[12px]
            leading-5
            text-slate-500

            sm:mt-3
            sm:text-sm
            sm:leading-6
          "
        >
          We collaborate with leading companies to create meaningful
          opportunities and build stronger careers.
        </motion.p>
      </motion.div>

      {/* ========================================
          MARQUEE
      ======================================== */}

      <motion.div
        className="partners-marquee-wrapper relative w-full overflow-hidden"
        initial={{
          opacity: 0,
          y: 20,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
          amount: 0.2,
        }}
        transition={{
          duration: 0.8,
          delay: 0.2,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        {/* Left fade */}
        <div
          className="
            pointer-events-none
            absolute
            inset-y-0
            left-0
            z-10
            w-12
            bg-gradient-to-r
            from-slate-50
            via-slate-50/90
            to-transparent

            sm:w-20
            lg:w-36
          "
        />

        {/* Right fade */}
        <div
          className="
            pointer-events-none
            absolute
            inset-y-0
            right-0
            z-10
            w-12
            bg-gradient-to-l
            from-slate-50
            via-slate-50/90
            to-transparent

            sm:w-20
            lg:w-36
          "
        />

        {/* ========================================
            MARQUEE TRACK
        ======================================== */}

        <div className="overflow-hidden py-3 sm:py-4 lg:py-5">
          <div
            className="
              partners-marquee-track
              flex
              w-max
              gap-4
              px-4

              sm:gap-5
              sm:px-5
            "
          >
            {/* First set */}
            <div className="flex shrink-0 gap-4 sm:gap-5">
              {partners.map((partner) => (
                <PartnerCard
                  key={`first-${partner.name}`}
                  partner={partner}
                />
              ))}
            </div>

            {/* Duplicate set */}
            <div
              className="flex shrink-0 gap-4 sm:gap-5"
              aria-hidden="true"
            >
              {partners.map((partner) => (
                <PartnerCard
                  key={`second-${partner.name}`}
                  partner={partner}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-slate-200/80" />
    </section>
  );
};

export default PartnersMarquee;