#!/bin/bash
set -e

# ============================================================
# WeIntern - Homepage sections polish v2 (alignment + responsive fixes)
# Fixes: ecosystem step-row alignment (grid instead of flex),
# oversized 75% donut, tighter tablet/mobile breakpoints.
# Run from your project ROOT:
#   cd ~/path/to/WeInternFr
#   bash polish-homepage-sections-v2.sh
# ============================================================

SRC="frontend/src"

if [ ! -f "$SRC/components/Sections/Sections.jsx" ]; then
  echo "Cannot find $SRC/components/Sections/Sections.jsx -- run this from your project root."
  exit 1
fi

echo "Overwriting SectionsPolish.css with alignment + responsive fixes ..."
mkdir -p "$SRC/components/Sections"
cat > "$SRC/components/Sections/SectionsPolish.css" << 'POLISHEOF'
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

/* ══════════════════════════════════════════════════════════
   SHARED
   ══════════════════════════════════════════════════════════ */
.problem, .problem *,
.eco-wrapper, .eco-wrapper *,
.live-journey, .live-journey * {
  font-family: 'Inter', sans-serif !important;
}

/* ══════════════════════════════════════════════════════════
   1. PROBLEM SECTION — "The Gap No One Talks About"
   ══════════════════════════════════════════════════════════ */
.problem {
  background:
    radial-gradient(circle at 8% 15%, rgba(255,138,76,0.07), transparent 32%),
    radial-gradient(circle at 92% 20%, rgba(45,212,191,0.07), transparent 32%),
    #fbfcfe !important;
  padding: 5rem 0 4.5rem !important;
}

.problem .section-label {
  color: #ff6b35 !important;
  font-weight: 700 !important;
  letter-spacing: 0.08em !important;
  text-transform: uppercase !important;
  font-size: 0.8rem !important;
}

.problem .section-title {
  color: #14192e !important;
  font-weight: 800 !important;
  font-size: clamp(1.9rem, 4vw, 2.6rem) !important;
  letter-spacing: -0.02em !important;
}

.gap-visual {
  display: grid !important;
  grid-template-columns: 1fr auto 1fr !important;
  gap: 1.75rem !important;
  align-items: stretch !important;
  margin: 2.75rem 0 !important;
}

.gap-side {
  background: #fff !important;
  border: 1.5px solid #eef0f5 !important;
  border-top: 4px solid #ff8a4c !important;
  border-radius: 20px !important;
  padding: 2rem 1.9rem !important;
  box-shadow: 0 10px 30px rgba(20, 25, 46, 0.05) !important;
  transition: transform 0.2s ease, box-shadow 0.2s ease !important;
}
.gap-side:hover { transform: translateY(-4px) !important; box-shadow: 0 16px 40px rgba(20, 25, 46, 0.09) !important; }
.gap-side.gap-industry { border-top-color: #2dd4bf !important; }

.gap-icon {
  width: 52px !important; height: 52px !important;
  border-radius: 16px !important;
  background: rgba(255, 138, 76, 0.12) !important;
  display: flex !important; align-items: center !important; justify-content: center !important;
  font-size: 1.5rem !important;
  margin-bottom: 1.1rem !important;
}
.gap-industry .gap-icon { background: rgba(45, 212, 191, 0.12) !important; }

.gap-side h3 {
  color: #14192e !important;
  font-weight: 800 !important;
  font-size: 1.2rem !important;
  margin-bottom: 1.1rem !important;
}

.gap-side ul { list-style: none !important; display: flex !important; flex-direction: column !important; gap: 0.6rem !important; }
.gap-side li {
  font-size: 0.9rem !important;
  font-weight: 500 !important;
  line-height: 1.5 !important;
  padding-left: 0 !important;
}
.gap-side li.good { color: #15803d !important; }
.gap-side li.bad { color: #dc2626 !important; }

.gap-bridge {
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 1rem !important;
  min-width: 160px !important;
}

.gap-chasm {
  background: linear-gradient(145deg, #ff9d5c, #ff6b35) !important;
  color: #fff !important;
  border-radius: 18px !important;
  padding: 1.5rem 1.4rem !important;
  text-align: center !important;
  box-shadow: 0 14px 32px rgba(255, 107, 53, 0.35) !important;
  min-width: 150px !important;
}
.chasm-label { font-weight: 800 !important; font-size: 1rem !important; letter-spacing: 0.04em !important; margin-bottom: 0.5rem !important; }
.chasm-sub { font-size: 0.78rem !important; opacity: 0.95 !important; line-height: 1.55 !important; }

.bridge-connector { display: flex !important; align-items: center !important; gap: 0.5rem !important; width: 100%; }
.bc-line { flex: 1 !important; height: 2px !important; background: repeating-linear-gradient(90deg, #ff8a4c 0 6px, transparent 6px 11px) !important; }
.bc-badge {
  background: #14192e !important; color: #fff !important;
  font-size: 0.72rem !important; font-weight: 700 !important;
  padding: 5px 10px !important; border-radius: 999px !important; white-space: nowrap !important;
}

.problem-quote {
  background: linear-gradient(120deg, #fff3e9, #fdeee4) !important;
  border-left: 4px solid #ff6b35 !important;
  border-radius: 16px !important;
  padding: 2rem 2.25rem !important;
  margin-top: 1rem !important;
}
.problem-quote blockquote {
  font-size: clamp(1.1rem, 2.4vw, 1.5rem) !important;
  font-weight: 600 !important;
  font-style: italic !important;
  color: #14192e !important;
  line-height: 1.55 !important;
  margin: 0 !important;
}

@media (max-width: 900px) {
  .gap-visual { grid-template-columns: 1fr !important; gap: 1.25rem !important; }
  .gap-bridge { flex-direction: row !important; order: 2 !important; min-width: 0 !important; }
  .bridge-connector { display: none !important; }
  .gap-chasm { width: 100% !important; }
}
@media (max-width: 480px) {
  .gap-side { padding: 1.4rem 1.2rem !important; }
  .gap-side h3 { font-size: 1.05rem !important; }
  .gap-side li { font-size: 0.85rem !important; }
}
@media (max-width: 560px) {
  .problem { padding: 3.25rem 0 3rem !important; }
  .gap-side { padding: 1.6rem 1.4rem !important; }
  .problem-quote { padding: 1.5rem 1.4rem !important; }
}

/* ══════════════════════════════════════════════════════════
   2. ECOSYSTEM SECTION — "How the Weintern Ecosystem Works"
   ══════════════════════════════════════════════════════════ */
.eco-wrapper { background: #f7f8fb !important; padding: 4rem 4% 2rem !important; }

.eco-heading-block { text-align: center !important; margin-bottom: 2.5rem !important; }
.eco-title { color: #14192e !important; font-weight: 800 !important; font-size: clamp(1.8rem, 3.6vw, 2.4rem) !important; letter-spacing: -0.02em !important; }
.eco-title-brand { color: #2196C9 !important; }
.eco-subtitle { color: #6b7280 !important; font-size: 1rem !important; margin-top: 0.5rem !important; }

.eco-top-body {
  display: grid !important;
  grid-template-columns: 1fr 300px !important;
  gap: 1.75rem !important;
  max-width: 1300px !important;
  margin: 0 auto !important;
  align-items: stretch !important;
}

.eco-steps {
  background: #fff !important;
  border: 1px solid #eef0f5 !important;
  border-radius: 20px !important;
  padding: 1.75rem 1.5rem !important;
  display: grid !important;
  grid-template-columns: 1fr 28px 1fr 28px 1fr 28px 1fr 28px 1fr !important;
  align-items: start !important;
  box-shadow: 0 10px 30px rgba(20, 25, 46, 0.04) !important;
}

.eco-step-card {
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  text-align: center !important;
  gap: 0.55rem !important;
  align-self: start !important;
  padding: 0 0.4rem !important;
  min-width: 0 !important;
}
.eco-step-circle {
  width: 52px !important; height: 52px !important; border-radius: 50% !important;
  display: flex !important; align-items: center !important; justify-content: center !important;
  flex-shrink: 0 !important;
  border: 3px solid !important;
  box-shadow: 0 8px 18px rgba(0,0,0,0.14) !important;
}
.eco-step-circle svg { width: 24px !important; height: 24px !important; }
.eco-step-label { font-weight: 800 !important; font-size: 0.88rem !important; color: #14192e !important; line-height: 1.3 !important; }
.eco-step-desc { font-size: 0.73rem !important; color: #6b7280 !important; line-height: 1.45 !important; display: block !important; margin-top: 2px !important; }
.eco-step-arrow {
  color: #d1d5db !important;
  align-self: start !important;
  margin-top: 14px !important;
  display: flex !important;
  justify-content: center !important;
}

.eco-mission {
  background: linear-gradient(150deg, #eefaf1, #e7f6ea) !important;
  border: 1px solid #d7f0dd !important;
  border-radius: 20px !important;
  padding: 1.75rem !important;
  display: flex !important;
  flex-direction: column !important;
  justify-content: center !important;
}
.eco-mission-head { color: #15803d !important; font-weight: 800 !important; font-size: 1.05rem !important; margin-bottom: 0.6rem !important; display: flex; align-items: center; gap: 6px; }
.eco-mission-body { color: #374151 !important; font-size: 0.85rem !important; line-height: 1.6 !important; margin-bottom: 1rem !important; }
.eco-mission-brands { display: flex !important; align-items: center !important; gap: 8px !important; font-weight: 800 !important; font-size: 0.95rem !important; color: #14192e !important; flex-wrap: wrap; }
.eco-mb-inf { color: #22c55e !important; }
.eco-mission-tag { color: #9ca3af !important; font-size: 0.75rem !important; margin-top: 0.4rem !important; font-weight: 600 !important; }

.eco-bottom {
  background: #0e1428 !important;
  border-radius: 24px !important;
  margin: 2.5rem auto 0 !important;
  max-width: 1300px !important;
  padding: 2.5rem !important;
  overflow: hidden !important;
}
.eco-bottom-inner {
  display: grid !important;
  grid-template-columns: 1.15fr 100px 1.35fr !important;
  gap: 1.75rem !important;
  align-items: center !important;
}
.eco-b-heading { color: #fff !important; font-weight: 800 !important; font-size: 1.4rem !important; line-height: 1.32 !important; }
.eco-b-green { color: #4ade80 !important; }
.eco-b-sub { color: rgba(255,255,255,0.65) !important; font-size: 0.83rem !important; margin-top: 0.5rem !important; line-height: 1.5 !important; }
.eco-donut { position: relative !important; width: 100px !important; height: 100px !important; flex-shrink: 0 !important; margin: 0 auto !important; }
.eco-donut-center { position: absolute !important; inset: 0 !important; display: flex !important; flex-direction: column !important; align-items: center !important; justify-content: center !important; }
.eco-donut-pct { color: #4ade80 !important; font-weight: 800 !important; font-size: 1.2rem !important; line-height: 1 !important; }
.eco-donut-lbl { color: rgba(255,255,255,0.6) !important; font-size: 0.5rem !important; text-align: center !important; line-height: 1.35 !important; font-weight: 700 !important; margin-top: 3px; letter-spacing: 0.02em !important; }
.eco-b-benefits { display: grid !important; grid-template-columns: repeat(4, 1fr) !important; gap: 1rem !important; }
.eco-b-card { color: #fff !important; }
.eco-b-icon { color: #4ade80 !important; width: 34px !important; height: 34px !important; margin-bottom: 0.6rem !important; }
.eco-b-icon svg { width: 100% !important; height: 100% !important; }
.eco-b-title { color: #fff !important; font-size: 0.85rem !important; font-weight: 700 !important; margin-bottom: 0.35rem !important; line-height: 1.3 !important; }
.eco-b-desc { color: rgba(255,255,255,0.6) !important; font-size: 0.72rem !important; line-height: 1.5 !important; }
.eco-b-note {
  text-align: center !important;
  color: rgba(255,255,255,0.75) !important;
  font-size: 0.82rem !important;
  margin-top: 2rem !important;
  padding-top: 1.5rem !important;
  border-top: 1px solid rgba(255,255,255,0.08) !important;
}

@media (max-width: 1100px) {
  .eco-top-body { grid-template-columns: 1fr !important; }
  .eco-mission { max-width: 560px !important; margin: 0 auto !important; }
}
@media (max-width: 900px) {
  .eco-steps {
    grid-template-columns: repeat(3, 1fr) !important;
    row-gap: 1.75rem !important;
    column-gap: 0.5rem !important;
  }
  .eco-step-arrow { display: none !important; }
  .eco-bottom-inner { grid-template-columns: 1fr !important; text-align: center !important; gap: 1.5rem !important; }
  .eco-donut { margin: 0 auto !important; }
  .eco-b-benefits { grid-template-columns: repeat(2, 1fr) !important; text-align: left !important; }
}
@media (max-width: 640px) {
  .eco-wrapper { padding: 3rem 5% 1.5rem !important; }
  .eco-steps {
    grid-template-columns: 1fr !important;
    justify-items: center !important;
    row-gap: 1.5rem !important;
  }
  .eco-step-card { max-width: 280px !important; }
  .eco-bottom { padding: 1.75rem !important; border-radius: 18px !important; }
  .eco-b-benefits { grid-template-columns: 1fr !important; }
}

/* ══════════════════════════════════════════════════════════
   3. LIVE JOURNEY — "Learn. Build. Grow."
   ══════════════════════════════════════════════════════════ */
.live-journey { background: #fbfcfe !important; padding: 4rem 0 3rem !important; }

.live-journey .section-label { color: #ff6b35 !important; text-align: center !important; font-weight: 700 !important; letter-spacing: 0.08em !important; text-transform: uppercase !important; }
.live-journey .section-title { color: #14192e !important; text-align: center !important; font-weight: 800 !important; font-size: clamp(1.9rem, 4vw, 2.6rem) !important; }
.live-journey .section-sub { color: #6b7280 !important; text-align: center !important; max-width: 640px !important; margin: 0 auto 2.5rem !important; }

.journey-cards {
  display: grid !important;
  grid-template-columns: repeat(3, 1fr) !important;
  gap: 1.75rem !important;
  max-width: 1200px !important;
  margin: 0 auto !important;
  padding: 0 4% !important;
}

.journey-card {
  background: #fff !important;
  border: 1px solid #eef0f5 !important;
  border-top: 4px solid #22c55e !important;
  border-radius: 18px !important;
  overflow: hidden !important;
  box-shadow: 0 10px 28px rgba(20,25,46,0.06) !important;
  transition: transform 0.2s ease, box-shadow 0.2s ease !important;
}
.journey-card:hover { transform: translateY(-6px) !important; box-shadow: 0 18px 40px rgba(20,25,46,0.1) !important; }
.journey-card.card-next { border-top-color: #3b82f6 !important; }
.journey-card.card-future { border-top-color: #a855f7 !important; }

.journey-card-image { height: 160px !important; }
.journey-badge {
  font-size: 0.62rem !important;
  padding: 5px 12px !important;
}
.badge-live { background: #22c55e !important; }
.badge-next { background: #3b82f6 !important; }
.badge-future { background: #a855f7 !important; }

.journey-card-category { color: #9ca3af !important; }
.journey-card-title { color: #14192e !important; font-weight: 800 !important; }
.journey-card-list li { color: #4b5563 !important; }

.journey-view-btn { background: #22c55e !important; color: #fff !important; font-weight: 700 !important; }
.journey-view-btn:hover { background: #16a34a !important; }
.card-next .journey-view-btn { background: #3b82f6 !important; }
.card-next .journey-view-btn:hover { background: #2563eb !important; }
.card-future .journey-view-btn { background: #a855f7 !important; }
.card-future .journey-view-btn:hover { background: #9333ea !important; }
.journey-view-btn:disabled { background: #d1d5db !important; color: #6b7280 !important; }

.journey-note {
  max-width: 900px !important;
  margin: 2rem auto 0 !important;
  background: #fff7ed !important;
  border: 1.5px solid #ffd8b8 !important;
}
.journey-note p { color: #14192e !important; }

@media (max-width: 900px) {
  .journey-cards { grid-template-columns: 1fr !important; max-width: 480px !important; }
}
@media (min-width: 901px) and (max-width: 1180px) {
  .journey-cards { gap: 1.1rem !important; padding: 0 3% !important; }
}
@media (max-width: 640px) {
  .live-journey { padding: 3rem 0 2.5rem !important; }
  .journey-cards { padding: 0 5% !important; gap: 1.25rem !important; }
  .journey-card-image { height: 150px !important; }
}
@media (max-width: 380px) {
  .journey-cards { padding: 0 4% !important; }
  .journey-card-body { padding: 1rem 1.1rem !important; }
}
POLISHEOF

echo "Ensuring it's imported in Sections.jsx ..."
python3 << 'PYEOF1'
path = "frontend/src/components/Sections/Sections.jsx"
with open(path) as f:
    content = f.read()

marker = "import './LiveJourney.css';"
new_import = "import './LiveJourney.css';\nimport './SectionsPolish.css';"

if "import './SectionsPolish.css'" in content:
    print("   Already imported -- skipping.")
elif marker in content:
    content = content.replace(marker, new_import, 1)
    with open(path, "w") as f:
        f.write(content)
    print("   Imported SectionsPolish.css.")
else:
    print("   WARNING: could not find LiveJourney.css import line -- add manually:")
    print("   import './SectionsPolish.css';")
PYEOF1

echo ""
echo "Done. Next steps:"
echo "   cd frontend && npm start"
echo "   Check the ecosystem steps row (should be evenly aligned in columns now),"
echo "   the 75% donut (smaller now), and resize to tablet/mobile widths."
echo ""
echo "To deploy:"
echo "   git add ."
echo "   git commit -m \"fix: align ecosystem steps as grid, shrink donut, tighten responsive breakpoints\""
echo "   git push origin main"
