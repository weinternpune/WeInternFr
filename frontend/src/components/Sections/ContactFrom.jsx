export default function ContactSection() {
  return (
    <>
   {/* RIGHT SIDE ONLY */}
<div className="relative w-full overflow-hidden rounded-[26px] border border-white/[0.08] bg-[#08111f] p-5 shadow-2xl shadow-black/30 sm:p-6 lg:p-7">

  {/* Subtle navy/emerald glow */}
  <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-emerald-400/[0.045] blur-3xl" />

  <div className="relative">

    {/* Header */}
    <div className="mb-5">
      <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-emerald-400">
        Get In Touch
      </span>

      <h2 className="mt-1 text-xl font-semibold tracking-tight text-white sm:text-2xl">
        Send us a Message
      </h2>

      <div className="mt-3 h-[2px] w-12 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.45)]" />
    </div>

    <form>

      {/* Form Grid */}
      <div className="grid gap-4 sm:grid-cols-2">

        {/* Full Name */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-400">
            Full Name
          </label>

          <input
            type="text"
            placeholder="Enter your name"
            required
            className="h-10 w-full rounded-xl border border-white/[0.09] bg-[#0c1727] px-3.5 text-sm text-slate-200 outline-none placeholder:text-slate-600 transition-all duration-300 focus:border-emerald-400/40 focus:bg-[#0e1b2d] focus:ring-1 focus:ring-emerald-400/15"
          />
        </div>

        {/* Email */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-400">
            Email Address
          </label>

          <input
            type="email"
            placeholder="Enter your email"
            required
            className="h-10 w-full rounded-xl border border-white/[0.09] bg-[#0c1727] px-3.5 text-sm text-slate-200 outline-none placeholder:text-slate-600 transition-all duration-300 focus:border-emerald-400/40 focus:bg-[#0e1b2d] focus:ring-1 focus:ring-emerald-400/15"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-400">
            Phone Number
          </label>

          <input
            type="text"
            placeholder="Enter your number"
            required
            className="h-10 w-full rounded-xl border border-white/[0.09] bg-[#0c1727] px-3.5 text-sm text-slate-200 outline-none placeholder:text-slate-600 transition-all duration-300 focus:border-emerald-400/40 focus:bg-[#0e1b2d] focus:ring-1 focus:ring-emerald-400/15"
          />
        </div>

        {/* Subject */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-400">
            Subject
          </label>

          <input
            type="text"
            placeholder="Enter subject"
            required
            className="h-10 w-full rounded-xl border border-white/[0.09] bg-[#0c1727] px-3.5 text-sm text-slate-200 outline-none placeholder:text-slate-600 transition-all duration-300 focus:border-emerald-400/40 focus:bg-[#0e1b2d] focus:ring-1 focus:ring-emerald-400/15"
          />
        </div>

        {/* Message */}
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs font-medium text-slate-400">
            Your Message
          </label>

          <textarea
            placeholder="Write your message here..."
            required
            rows={3}
            className="h-[90px] w-full resize-none rounded-xl border border-white/[0.09] bg-[#0c1727] px-3.5 py-3 text-sm text-slate-200 outline-none placeholder:text-slate-600 transition-all duration-300 focus:border-emerald-400/40 focus:bg-[#0e1b2d] focus:ring-1 focus:ring-emerald-400/15"
          />
        </div>

      </div>

      {/* Bottom Row */}
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

        <button
          type="submit"
          className="group inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-emerald-400 px-5 text-sm font-semibold text-[#03100b] shadow-[0_0_20px_rgba(52,211,153,0.12)] transition-all duration-300 hover:bg-emerald-300 hover:shadow-[0_0_28px_rgba(52,211,153,0.2)] active:scale-[0.98]"
        >
          Send Message

          <span className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </button>

        <div className="flex items-center gap-2 text-[10px] leading-4 text-slate-500">
          <span className="text-emerald-400">
            🛡
          </span>

          <span>
            We respect your privacy.
            <br />
            Your information is safe with us.
          </span>
        </div>

      </div>

    </form>
  </div>
</div>
</>
  );
}