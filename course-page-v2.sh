#!/bin/bash
set -e

# ============================================================
# WeIntern - Course Page v2 (light theme, same-tab navigation)
# + reverts homepage navbar/hero back to original
# Run from your project ROOT:
#   cd ~/path/to/WeInternFr
#   bash course-page-v2.sh
# ============================================================

SRC="frontend/src"

if [ ! -f "$SRC/styles/global.css" ]; then
  echo "Cannot find $SRC/styles/global.css -- run this from your project root."
  exit 1
fi

echo "[1/8] Restoring original global.css (homepage font back to Poppins) ..."
cat > "$SRC/styles/global.css" << 'GLOBALEOF'
/* ===========================
   WEINTERN v4 React – Global CSS
=========================== */
:root {
  --navy:    #1B2A4A;
  --navy2:   #243659;
  --navy3:   #0f1d33;
  --gold:    #E8A820;
  --gold2:   #f5c842;
  --gold3:   rgba(232,168,32,.13);
  --cyan:    #2196C9;
  --cyan2:   #3db8f0;
  --cyan3:   rgba(33,150,201,.13);
  --cream:   #f4f6fb;
  --white:   #ffffff;
  --text:    #1a2640;
  --muted:   #5a6a82;
  --border:  rgba(27,42,74,.1);
  --sh:      0 4px 24px rgba(27,42,74,.09);
  --shlg:    0 16px 48px rgba(27,42,74,.15);
  --shgold:  0 8px 32px rgba(232,168,32,.3);
  --shcyan:  0 8px 32px rgba(33,150,201,.3);
  --r:       16px;
  --rsm:     8px;
  --ease:    .3s cubic-bezier(.4,0,.2,1);
}

/* ============ RESET ============ */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html, body { overflow-x: hidden; font-family: 'Poppins', sans-serif; }
*:focus { outline: none !important; box-shadow: none !important; }
*:focus-visible { outline: 2px solid var(--cyan) !important; outline-offset: 2px !important; }
input:focus-visible, textarea:focus-visible, select:focus-visible, button:focus-visible, a:focus-visible {
  outline: 2px solid var(--cyan) !important;
  outline-offset: 2px !important;
}
.container { max-width: 1160px; margin: 0 auto; padding: 0 1.5rem; }

/* ============ POPPINS FOR ALL NUMBERS ============ */
* {
  font-variant-numeric: tabular-nums;
  font-family: 'Poppins', sans-serif;
}

/* Import Poppins for numbers */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');

/* Apply Poppins to all elements that contain numbers */
body, input, textarea, select, button, 
.cs-offer-new-price, .cs-offer-old-price, .enroll-price,
.enroll-offer-price, .enroll-original-price,
.cs-card-price, .stat-value, .hero-stat-value,
.price, .amount, .count, .number {
  font-feature-settings: 'tnum', 'lnum';
}

.btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 6px;
  padding: .85rem 1.8rem; border-radius: 50px; font-family: 'DM Sans', sans-serif;
  font-weight: 700; font-size: .97rem; text-decoration: none; cursor: pointer;
  border: none; transition: var(--ease); white-space: nowrap; position: relative;
  overflow: hidden; line-height: 1.5; background: none;
}
.btn::after { content: ''; position: absolute; inset: 0; background: rgba(255,255,255,.15); opacity: 0; transition: var(--ease); }
.btn:hover::after { opacity: 1; }
.btn-primary { background: var(--gold); color: var(--navy); }
.btn-primary:hover { transform: translateY(-2px); box-shadow: var(--shgold); }
.btn-outline { background: transparent; color: var(--cyan); border: 2px solid var(--cyan); }
.btn-outline:hover { background: var(--cyan); color: white; transform: translateY(-2px); box-shadow: var(--shcyan); }
.btn-white { background: white; color: var(--navy); }
.btn-white:hover { background: var(--navy); color: white; transform: translateY(-2px); }
.btn-lg { padding: 1.05rem 2.4rem; font-size: 1.02rem; font-weight: 700; }
.btn-full { width: 100%; border-radius: var(--rsm); }
.btn-glow { animation: pulseGlow 3s ease infinite; }
.btn-danger { background: #dc4545; color: white; }
.btn-danger:hover { background: #c03333; transform: translateY(-2px); }
.btn-success { background: #27ae60; color: white; }
.btn-success:hover { background: #1e8449; transform: translateY(-2px); }

@keyframes pulseGlow {
  0%,100% { box-shadow: var(--shgold); }
  50% { box-shadow: 0 0 0 8px rgba(232,168,32,.15), var(--shgold); }
}

.section-label {
  font-family: 'Space Mono', monospace; font-size: .72rem; letter-spacing: .14em;
  text-transform: uppercase; color: var(--gold); margin-bottom: .75rem; display: block;
}
.section-label.light { color: var(--gold2); }
.section-title {
  font-family: 'Poppins', sans-serif; font-size: clamp(2rem,4vw,3rem);
  font-weight: 700; line-height: 1.15; color: var(--navy); margin-bottom: 1rem;
}
.section-title.light { color: white; }
.section-sub { color: var(--muted); font-size: 1.05rem; max-width: 580px; margin-bottom: 3rem; }

/* REVEAL */
.reveal { opacity: 1;  transition: opacity .65s ease, transform .65s ease; }
.reveal.visible { opacity: 1; transform: translateY(0); }

/* ============ FORM SHARED ============ */
.the-form {
  background: var(--cream); border-radius: var(--r); padding: 2.5rem;
  max-width: 820px; box-shadow: var(--sh); margin: 0 auto;
}
.the-form-alt { background: white; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; margin-bottom: 1.25rem; }
.form-group { display: flex; flex-direction: column; gap: .4rem; margin-bottom: 1.25rem; }
.form-group:last-of-type { margin-bottom: 0; }
.form-group label { font-weight: 600; font-size: .84rem; color: var(--navy); }
.form-group input, .form-group select, .form-group textarea {
  padding: .78rem 1rem; border: 1.5px solid var(--border); border-radius: var(--rsm);
  font-family: 'DM Sans', sans-serif; font-size: .92rem; color: var(--text);
  background: white; transition: border-color var(--ease), box-shadow var(--ease); width: 100%;
}
.form-group input:focus, .form-group select:focus, .form-group textarea:focus {
  outline: none; border-color: var(--cyan); box-shadow: 0 0 0 3px rgba(33,150,201,.12);
}
.form-group textarea { resize: vertical; }
.form-note { text-align: center; margin-top: 1.5rem; font-size: .9rem; color: var(--muted); font-weight: 500; }

/* Check group */
.check-group { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.2rem; margin-top: 1rem; }
.check-item {
  display: flex; align-items: center; justify-content: center; gap: .6rem;
  padding: 1rem; border: 1.5px solid var(--border); border-radius: 40px;
  font-size: .9rem; font-weight: 500; background: white; cursor: pointer;
  transition: all .3s ease; text-align: center; min-height: 60px;
}
.check-item:hover { border-color: var(--cyan); color: var(--cyan); }
.check-item input { accent-color: var(--cyan); flex-shrink: 0; width: 18px; height: 18px; }
.check-item span { color: var(--text); white-space: nowrap; }

/* Apply btn group */
.apply-btn-group {
  display: flex; gap: 15px; width: 100%; justify-content: center;
  align-items: center; flex-wrap: wrap; margin-top: 1.5rem;
}
.apply-btn-group .btn {
  flex: 1 1 calc(50% - 7.5px); min-width: 160px; max-width: 280px;
}
.whatsapp-btn {
  width: 100%; max-width: 280px; display: flex; align-items: center; justify-content: center;
  background: #25D366; color: white; text-align: center; padding: 1rem 1.8rem;
  border-radius: 50px; font-weight: 600; text-decoration: none; transition: .3s;
  font-size: 1.02rem; margin-top: 12px; border: none; cursor: pointer; height: auto;
  line-height: 1.5;
}
.whatsapp-btn:hover { background: #1ebe5d; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(37,211,102,.3); }

/* ============ MODAL ============ */
.modal-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,.6);
  display: flex; align-items: center; justify-content: center; z-index: 9999;
}
.modal-box {
  background: white; padding: 2.5rem; width: 100%; max-width: 480px;
  border-radius: 16px; box-shadow: 0 20px 50px rgba(0,0,0,.2);
  animation: popup .3s ease; max-height: 85vh; overflow-y: auto;
}
@keyframes popup {
  from { transform: scale(.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
.modal-box h3 { margin-bottom: 1.5rem; text-align: center; font-family: 'Playfair Display', serif; color: var(--navy); }
.modal-close {
  position: absolute; top: 1rem; right: 1rem; background: none; border: none;
  font-size: 1.4rem; cursor: pointer; color: var(--muted); line-height: 1;
}

/* ============ WA FLOAT ============ */
.wa-float {
  position: fixed; bottom: 1.75rem; right: 1.75rem; z-index: 999;
  background: #25D366; width: 54px; height: 54px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 4px 20px rgba(37,211,102,.4); transition: var(--ease);
}
.wa-float:hover { transform: scale(1.1); box-shadow: 0 8px 28px rgba(37,211,102,.55); }

/* ============ MARQUEE ============ */
.marquee-strip { background: var(--navy); padding: .75rem 0; overflow: hidden; border-top: 1px solid rgba(255,255,255,.06); border-bottom: 1px solid rgba(255,255,255,.06); }
.marquee-track { display: flex; gap: 3rem; animation: marquee 28s linear infinite; width: max-content; }
.marquee-track span { font-family: 'Space Mono', monospace; font-size: .72rem; color: rgba(255,255,255,.6); white-space: nowrap; letter-spacing: .06em; }
.marquee-track span:nth-child(odd) { color: var(--gold); }
@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }

/* ============ BADGE / TAGS ============ */
.badge-status {
  display: inline-flex; align-items: center; padding: .22rem .7rem;
  border-radius: 50px; font-size: .7rem; font-weight: 700; letter-spacing: .04em;
}
.badge-pending { background: rgba(232,168,32,.15); color: var(--gold); }
.badge-reviewing { background: rgba(33,150,201,.15); color: var(--cyan); }
.badge-accepted { background: rgba(39,174,96,.15); color: #27ae60; }
.badge-rejected { background: rgba(220,69,69,.15); color: #dc4545; }
.badge-paid { background: rgba(39,174,96,.15); color: #27ae60; }
.badge-enrolled { background: rgba(33,150,201,.15); color: var(--cyan); }

/* ============ TOAST ============ */
.toast-custom { font-family: 'DM Sans', sans-serif !important; }

/* ============ RESPONSIVE ============ */
@media (max-width: 640px) {
  .form-row { grid-template-columns: 1fr; }
  .check-group { grid-template-columns: 1fr; }
  .the-form, .the-form-alt { padding: 1.5rem; }
}
@media (max-width: 420px) {
  .apply-btn-group { flex-direction: column; align-items: stretch; }
  .apply-btn-group .btn { max-width: 100%; }
}
GLOBALEOF

echo "[2/8] Restoring original Navbar.css ..."
cat > "$SRC/components/Layout/Navbar.css" << 'NAVCSSEOF'
.nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
  background: rgba(10,22,40,0.85);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255,255,255,0.08);
  transition: all .3s;
}
.nav.scrolled {
  background: rgba(10,22,40,0.97);
  box-shadow: 0 4px 24px rgba(0,0,0,0.3);
  border-bottom: 1px solid rgba(255,255,255,0.12);
}
.nav::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, rgba(255,255,255,0.15), rgba(255,255,255,0.15));
}
.nav-inner {
  display: flex; 
  align-items: center; 
  gap: 1.5rem;
  padding: .75rem 2rem; 
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  box-sizing: border-box;
}
.logo-link { display: flex; align-items: center; flex-shrink: 0; text-decoration: none; }
.nav-logo { height: 38px; width: auto; filter: brightness(0) invert(1); }
.nav-links {
  display: flex; 
  gap: 1.5rem; 
  list-style: none;
  margin: 0 auto; 
  padding: 0;
  flex: 1;
  justify-content: center;
  align-items: center;
}
.nav-link {
  background: none; border: none; cursor: pointer;
  color: rgba(255,255,255,0.75); font-weight: 500; font-size: .85rem;
  font-family: 'DM Sans',sans-serif; padding: .45rem .75rem;
  border-radius: 6px; transition: all .2s; white-space: nowrap;
  text-decoration: none; display: inline-block;
}
.nav-link:hover { color: #18b45b; background: rgba(24,180,91,0.08); }
.nav-ctas { display: flex; align-items: center; gap: .65rem; flex-shrink: 0; }
.nav-user-info { display: flex; align-items: center; gap: .5rem; }
.nav-avatar {
  width: 32px; height: 32px; border-radius: 50%;
  background: linear-gradient(135deg,#18b45b,#15a050);
  color: white; display: flex; align-items: center; justify-content: center;
  font-weight: 700; font-size: .82rem;
}
.nav-user-type { color: rgba(255,255,255,0.6); font-size: .78rem; }
.nav-students-count, .nav-for-biz {
  display: flex; align-items: center; gap: .4rem;
  color: rgba(255,255,255,0.6); font-size: .78rem; white-space: nowrap;
}
.nav-students-count svg, .nav-for-biz svg { opacity: .7; }
.btn-nav-login {
  background: #18b45b; color: white; border: none;
  padding: .55rem 1.25rem; border-radius: 50px;
  font-weight: 700; font-size: .85rem; cursor: pointer;
  font-family: 'DM Sans',sans-serif; text-decoration: none;
  transition: all .2s; white-space: nowrap;
}
.btn-nav-login:hover { background: #15a050; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(24,180,91,0.35); }
.btn.btn-outline {
  color: rgba(255,255,255,0.8); border: 1px solid rgba(255,255,255,0.25);
  background: rgba(255,255,255,0.06); border-radius: 6px;
  font-family: 'DM Sans',sans-serif; cursor: pointer; text-decoration: none;
  transition: all .2s;
}
.btn.btn-outline:hover { background: rgba(255,255,255,0.12); color: white; }
.hamburger {
  display: none; flex-direction: column; gap: 5px;
  background: none; border: none; cursor: pointer; padding: 4px; margin-left: auto;
}
.hamburger span { display: block; width: 24px; height: 2px; background: rgba(255,255,255,0.8); border-radius: 2px; transition: all .3s; }
.hamburger.open span:nth-child(1) { transform: rotate(45deg) translate(5px,5px); }
.hamburger.open span:nth-child(2) { opacity: 0; }
.hamburger.open span:nth-child(3) { transform: rotate(-45deg) translate(5px,-5px); }
.mobile-menu {
  display: flex; flex-direction: column; gap: .5rem;
  padding: 1rem 1.5rem; background: rgba(10,22,40,0.98);
  border-top: 1px solid rgba(255,255,255,0.08);
}
.mobile-nav-link {
  background: none; border: none; text-align: left; cursor: pointer;
  color: rgba(255,255,255,0.7); font-weight: 500; font-size: .95rem;
  font-family: 'DM Sans',sans-serif; padding: .55rem 0;
  border-bottom: 1px solid rgba(255,255,255,0.06); text-decoration: none; display: block;
}
.mobile-nav-link:hover { color: #18b45b; }
.mobile-cta-btn {
  background: #18b45b; color: white; border: none;
  padding: .75rem 1rem; border-radius: 50px; font-weight: 700;
  font-size: .95rem; cursor: pointer; font-family: 'DM Sans',sans-serif;
  text-align: center; margin-top: .5rem; text-decoration: none; display: block;
}
/* Tablet and below - hide nav links */
@media (max-width: 960px) { 
  .nav-links { display: none; } 
  .nav-students-count, .nav-for-biz { display: none; } 
}

/* Mobile - show hamburger, hide desktop CTAs */
@media (max-width: 640px) { 
  .nav-inner { padding: .65rem 1rem; }
  .nav-logo { height: 32px; }
  .nav-ctas { display: none; } 
  .hamburger { display: flex; } 
}

/* Desktop - hide mobile menu and hamburger */
@media (min-width: 1025px) {

  .mobile-menu {
    display: none !important;
  }

  .hamburger {
    display: none;
  }

  .sidebar-toggle {
    display: none !important;
  }
}

/* =========================
   TABLET / IPAD FIX
========================= */

@media (min-width: 641px) and (max-width: 1024px) {

  .nav-inner {
    padding: 0.75rem 1rem;
    justify-content: space-between;
    gap: 0.75rem;
  }

  /* Hide desktop navigation */
  .nav-links {
    display: none;
  }

  /* Hide all desktop CTA buttons */
  .nav-ctas {
    display: none !important;
  }

  /* Show hamburger only */
  .hamburger {
    display: flex;
    margin-left: auto;
    z-index: 1201;
  }

  /* Proper dropdown menu */
  .mobile-menu {
    position: fixed;
    top: 72px;
    left: 0;
    right: 0;
    width: 100%;
    background: rgba(10,22,40,0.98);
    backdrop-filter: blur(20px);
    padding: 1rem 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    border-top: 1px solid rgba(255,255,255,0.08);
    z-index: 1200;
    box-sizing: border-box;
    animation: slideDown 0.25s ease;
  }

  .mobile-nav-link {
    width: 100%;
    display: block;
    text-align: left;
    padding: 0.9rem 0;
    font-size: 1rem;
    color: rgba(255,255,255,0.85);
    background: none;
    border: none;
    text-decoration: none;
  }

  .mobile-cta-btn {
    width: 100%;
    margin-top: 1rem;
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
NAVCSSEOF

echo "[3/8] Restoring original Hero.css ..."
cat > "$SRC/components/Sections/Hero.css" << 'HEROCSSEOF'
.hero,
.hero *:not(.hero-title) {
  font-family: 'Poppins', sans-serif;
}
.hero { position:relative; overflow:hidden; background:linear-gradient(135deg,#0a1628 0%,#0f2340 50%,#0d1b2e 100%); padding-top:74px; }
.hero-bg { position:absolute; inset:0; z-index:0; pointer-events:none; overflow:hidden; }
.hero-orb { position:absolute; border-radius:50%; filter:blur(80px); }
.orb-1 { width:500px; height:500px; background:rgba(24,180,91,0.1); top:-100px; right:30%; }
.orb-2 { width:400px; height:400px; background:rgba(37,99,235,0.07); bottom:-100px; left:10%; }
.hero-grid { position:absolute; inset:0; background-image:linear-gradient(rgba(255,255,255,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.025) 1px,transparent 1px); background-size:40px 40px; }
@keyframes heroFloat { 0%{transform:translate(0,0) scale(1);opacity:0} 10%{opacity:1} 50%{transform:translate(var(--x),var(--y)) scale(1.4);opacity:.85} 90%{opacity:.3} 100%{transform:translate(calc(var(--x)*2),calc(var(--y)*1.8)) scale(.7);opacity:0} }

/* Layout — 3 columns like reference */
/* Layout — 3 columns like reference */
.hero-inner {
  position:relative; z-index:1;
  display:grid; grid-template-columns:1fr 1.3fr 0.7fr;
  gap:0; align-items:center;
  max-width:1400px; margin:0 auto;
  padding:3rem 2rem 1.5rem; min-height:calc(90vh - 74px);
}

/* LEFT */
.hero-left { padding-right:1.5rem; }
.hero-badge { display:inline-flex; align-items:center; gap:8px; background:rgba(24,180,91,0.12); border:1px solid rgba(24,180,91,0.3); color:#18b45b; padding:.35rem .9rem; border-radius:50px; font-size:.72rem; font-weight:700; margin-bottom:1.25rem; text-transform:uppercase; letter-spacing:.06em; white-space:nowrap; }
.badge-dot { width:7px; height:7px; background:#18b45b; border-radius:50%; animation:pulse 1.5s ease infinite; }
@keyframes pulse { 0%,100%{opacity:1}50%{opacity:.4} }
.hero-title { font-family:'Playfair Display',serif; font-size:clamp(2.8vw,2.8rem); font-weight:900; line-height:1.3; color:#fff; margin-bottom:1rem; }
.highlight { color:#18b45b; white-space:nowrap; }
.hero-sub { font-size:.9rem; color:rgba(255,255,255,.6); margin-bottom:1.5rem; line-height:1.7; }
.hero-features { display:flex; flex-wrap:wrap; gap:.5rem; margin-bottom:1.75rem; }
.hf-item { display:flex; align-items:center; gap:.4rem; background:rgba(255,255,255,.06); border:1px solid rgba(255,255,255,.1); color:rgba(255,255,255,.75); padding:.3rem .75rem; border-radius:50px; font-size:.75rem; font-weight:500; }
.hf-icon { color:#18b45b; display:flex; }

/* Mobile override for vertical layout */
@media (max-width: 960px) {
  .hero-features { 
    display: flex !important;
    flex-direction: column !important;
    flex-wrap: nowrap !important;
    gap: .5rem !important;
    align-items: stretch !important;
  }
  .hf-item { 
    display: flex !important;
    width: 100% !important;
    padding: .5rem .7rem !important;
    font-size: .75rem !important;
    border-radius: 8px !important;
    background: rgba(24,180,91,0.08) !important;
    border: 1px solid rgba(24,180,91,0.2) !important;
    justify-content: flex-start !important;
  }
  .hf-icon { 
    margin-right: .4rem !important;
    flex-shrink: 0 !important;
  }
  .hf-icon svg { 
    width: 17px !important; 
    height: 17px !important; 
  }
}
.hero-btns { display:flex; gap:.85rem; flex-wrap:wrap; }

/* Desktop: show desktop buttons, hide mobile buttons */
.hero-btns-mobile { display: none; }
.hero-btns-desktop { display: flex; }
.btn-hero-primary { display:inline-flex; align-items:center; background:#18b45b; color:white; border:none; padding:.8rem 1.5rem; border-radius:50px; font-weight:700; font-size:.9rem; cursor:pointer; text-decoration:none; font-family:'DM Sans',sans-serif; transition:all .3s; }
.btn-hero-primary:hover { background:#15a050; transform:translateY(-2px); box-shadow:0 8px 24px rgba(24,180,91,.35); }
.btn-hero-outline { display:inline-flex; align-items:center; background:rgba(255,255,255,.06); color:white; border:1.5px solid rgba(255,255,255,.3); padding:.8rem 1.5rem; border-radius:50px; font-weight:600; font-size:.9rem; cursor:pointer; text-decoration:none; font-family:'DM Sans',sans-serif; transition:all .3s; }
.btn-hero-outline:hover { background:rgba(255,255,255,.12); border-color:rgba(255,255,255,.6); transform:translateY(-2px); }

/* Right side */
.hero-right { display: flex; gap: 1.5rem; }
.hero-img-wrap { flex: 1; position: relative; }
.hero-img-placeholder {
  width: 100%; min-height: 380px; border-radius: 20px;
  background: rgba(255,255,255,0.05); border: 1.5px dashed rgba(255,255,255,0.15);
  display: flex; align-items: center; justify-content: center;
}
.hip-inner { text-align: center; }
.hero-badge-float {
  position: absolute; background: rgba(255,255,255,0.1);
  backdrop-filter: blur(16px); border: 1px solid rgba(255,255,255,0.18);
  border-radius: 12px; padding: .65rem 1rem;
  display: flex; align-items: center; gap: .65rem;
  color: white; font-size: .82rem;
}
.hbf-1 { bottom: 40px; left: -20px; }
.hbf-2 { top: 40px; right: -20px; }
.hero-badge-float strong { display: block; font-weight: 700; color: white; }
.hero-badge-float span { color: rgba(255,255,255,0.6); font-size: .75rem; }
.hbf-icon { width: 36px; height: 36px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }

/* CENTER — Image */
.hero-center { display:flex; align-items:center; justify-content:center; padding:0 .5rem; }
.hero-img-box { position:relative; width:100%; max-width:520px; border-radius:16px; overflow:hidden; }
.hero-main-img { width:100%; height:auto; min-height:320px; max-height:480px; object-fit:cover; object-position:center top; display:block; border-radius:16px; }
.hero-img-fallback { width:100%; min-height:360px; background:rgba(255,255,255,.05); border:1.5px dashed rgba(255,255,255,.15); border-radius:16px; align-items:center; justify-content:center; flex-direction:column; gap:.75rem; color:rgba(255,255,255,.4); font-size:.82rem; text-align:center; padding:2rem; }
.hero-logo-badge { position:absolute; bottom:1.25rem; right:1.25rem; background:rgba(0,0,0,.6); backdrop-filter:blur(12px); border:1px solid rgba(255,255,255,.15); border-radius:10px; padding:.5rem .85rem; display:flex; align-items:center; }

/* RIGHT — Stats */
.hero-stats-side { display:flex; flex-direction:column; gap:.6rem; padding-left:1.25rem; border-left:1px solid rgba(255,255,255,.08); }
.hss-item { display:flex; align-items:center; gap:.75rem; background:rgba(255,255,255,.05); border:1px solid rgba(255,255,255,.08); border-radius:10px; padding:.7rem .9rem; }
.hss-icon { flex-shrink:0; }
.hss-item strong {
  display: block;
  font-family: 'Poppins', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.02em;
  color: #ffffff;
}

.hss-item span {
  display: block;
  margin-top: 3px;
  font-family: 'Poppins', sans-serif;
  font-size: 0.72rem;
  font-weight: 500;
  line-height: 1.4;
  color: rgba(255, 255, 255, 0.65);
}

.hss-stars {
  margin-top: 4px;
  font-family: 'Poppins', sans-serif;
  font-size: 0.78rem;
  letter-spacing: 2px;
  color: #f59e0b;
}
/* Stats Bar */
.hero-stats-bar {
  position: relative;
  z-index: 1;
  background: transparent;
  padding: 0 2rem 1.25rem;
}
.hsb-inner {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  max-width: 1400px;
  margin: 0 auto;
  padding: 0;
  background: white;
  border-radius: 14px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06);
  border: 1px solid #e5e7eb;
  overflow: hidden;
}
.hsb-item {
  text-align: center;
  padding: 0.7rem 0.75rem;
  border-right: 1px solid #e5e7eb;
  transition: background 0.18s;
}
.hsb-item:last-child { border-right: none; }
.hsb-item:hover { background: #f9fafb; }
.hsb-val {
  font-family: 'Poppins', sans-serif;
  font-size: 1.25rem;
  font-weight: 700;
  /* or 800 */
  line-height: 1;
  margin-bottom: .2rem;
}
.hsb-label { font-size: .63rem; color: #6b7280; line-height: 1.35; }
.hsb-stars { color: #f59e0b; font-size: .78rem; margin-top: .15rem; letter-spacing: 1px; }

/* Responsive */
@media (max-width:1200px) {
  .hero-inner { grid-template-columns:1fr 1fr; }
  .hero-stats-side { display:none; }
  .hero-stats-bar { padding: 0 1.5rem 1.75rem; }
  .hsb-inner { grid-template-columns:repeat(3,1fr); }
  .hero-left { padding-right:1rem; }
}

@media (max-width:960px) {
  .hero-inner { grid-template-columns:1fr; min-height:auto; padding:2.5rem 1.5rem 1rem; gap:1rem; }
  .hero-center { order:0; margin-bottom:0; }
  .hero-left { padding-right:0; order:0; }
  .hero-title { font-size:clamp(1.7rem,5vw,2.3rem); }
  .hero-sub { font-size:.88rem; }
  
  /* Features - Vertical Stack for mobile */
  .hero-features { 
    display: flex;
    flex-direction: column;
    gap: .5rem; 
    margin-bottom: 1.2rem;
    align-items: stretch;
  }
  .hf-item { 
    padding: .5rem .7rem; 
    font-size: .75rem; 
    border-radius: 8px;
    background: rgba(24,180,91,0.08);
    border: 1px solid rgba(24,180,91,0.2);
    width: 100%;
    justify-content: flex-start;
    flex-wrap: nowrap;
  }
  .hf-icon { 
    color: #18b45b;
    display: flex;
    margin-right: .4rem;
    flex-shrink: 0;
  }
  .hf-icon svg { width: 17px; height: 17px; }
  
  /* Hide desktop buttons, show mobile buttons below image */
  .hero-btns-desktop { display: none; }
  .hero-btns-mobile {
    display: flex;
    flex-direction: column;
    gap: .65rem;
    order: 1;
    width: 100%;
    margin-bottom: 0;
  }
  .btn-hero-primary, .btn-hero-outline {
    width: 100%;
    justify-content: center;
    border-radius: 8px;
  }
  
  .hero-stats-bar { padding: 0 1.5rem .75rem; }
  .hsb-inner { grid-template-columns:repeat(3,1fr); }
  .hsb-item { padding:.65rem .5rem; }
  .hsb-val { font-size:1.1rem; }
  .hsb-label { font-size:.6rem; }
}

@media (max-width:768px) {
  .hero-inner { padding:2rem 1rem 1rem; gap:.75rem; }
  .hero-title { font-size:clamp(1.6rem,6vw,2.2rem); }
  .hero-sub { font-size:.85rem; margin-bottom:1.25rem; }
  
  /* Features - Vertical Stack */
  .hero-features { 
    gap: .48rem;
    flex-direction: column;
    align-items: stretch;
  }
  .hf-item { 
    padding: .48rem .68rem; 
    font-size: .72rem;
    border-radius: 8px;
    background: rgba(24,180,91,0.08);
    border: 1px solid rgba(24,180,91,0.2);
    width: 100%;
    justify-content: flex-start;
  }
  .hf-icon { 
    color: #18b45b;
    display: flex;
    margin-right: .38rem;
  }
  .hf-icon svg { width: 16px; height: 16px; }
  
  /* Buttons */
  .hero-btns { gap:.65rem; }
  .hero-btns-mobile { gap: .65rem; }
  .btn-hero-primary, .btn-hero-outline {
    border-radius: 8px;
  }
  
  .hero-stats-bar { padding: 0 1rem .6rem; }
  .hsb-inner { grid-template-columns:repeat(2,1fr); border-radius: 12px; }
  .hsb-item:nth-child(n+5) { border-bottom:none; }
}

@media (max-width:640px) {
  .hero-inner { padding:1.5rem 1rem 1rem; }
  .hero-badge { font-size:.68rem; padding:.3rem .75rem; margin-bottom:1rem; }
  .hero-title { font-size:clamp(1.5rem,7vw,2rem); margin-bottom:.85rem; }
  .hero-sub { font-size:.82rem; margin-bottom:1rem; }
  
  /* Features - Vertical Stack for ALL mobile devices */
  .hero-features { 
    display: flex;
    flex-direction: column;
    gap: .5rem; 
    margin-bottom: 1.25rem;
    align-items: stretch;
  }
  .hf-item { 
    padding: .5rem .7rem; 
    font-size: .74rem; 
    border-radius: 8px;
    background: rgba(24,180,91,0.08);
    border: 1px solid rgba(24,180,91,0.2);
    width: 100%;
    justify-content: flex-start;
  }
  .hf-icon { 
    color: #18b45b;
    display: flex;
    margin-right: .4rem;
  }
  .hf-icon svg { width:17px; height:17px; }
  
  /* Buttons - Full width stacked */
  .hero-btns { flex-direction:column; gap:.6rem; }
  .hero-btns-mobile { 
    display: flex;
    flex-direction:column; 
    gap:.65rem;
    width: 100%;
  }
  .btn-hero-primary, .btn-hero-outline { 
    width:100%; 
    justify-content:center; 
    padding:.75rem 1.25rem; 
    font-size:.85rem;
    border-radius: 8px;
  }
  
  .hero-img-box { max-width:100%; }
  .hero-main-img { min-height:280px; max-height:380px; }
  .hero-img-badge { bottom:1rem; left:1rem; padding:.6rem .85rem; }
  .hero-img-badge div { font-size:.85rem !important; }
  .hero-logo-badge { bottom:1rem; right:1rem; padding:.4rem .7rem; }
  .hero-logo-badge img { height:20px !important; }
  .hero-stats-bar { padding: 0 .75rem .85rem; }
  .hsb-inner { border-radius: 10px; }
  .hsb-item { padding:.55rem .35rem; }
  .hsb-val { font-size:1rem; }
  .hsb-label { font-size:.58rem; }
  .hsb-stars { font-size:.72rem; }
}

@media (max-width:480px) {
  .hero-badge { font-size:.65rem; padding:.28rem .7rem; }
  .hero-title { font-size:1.4rem; }
  .hero-sub { font-size:.78rem; }
  
  /* Features - Vertical Stack */
  .hero-features { 
    gap: .45rem;
    flex-direction: column;
    align-items: stretch;
  }
  .hf-item { 
    padding: .45rem .65rem; 
    font-size: .7rem;
    border-radius: 8px;
    background: rgba(24,180,91,0.08);
    border: 1px solid rgba(24,180,91,0.2);
    width: 100%;
    justify-content: flex-start;
  }
  .hf-icon { 
    color: #18b45b;
    display: flex;
    margin-right: .35rem;
  }
  .hf-icon svg { width: 16px; height: 16px; }
  
  /* Buttons - Full width */
  .btn-hero-primary, .btn-hero-outline { 
    padding:.7rem 1.1rem; 
    font-size:.82rem;
    border-radius: 8px;
    width: 100%;
  }
  
  .hero-main-img { min-height:240px; max-height:320px; }
  .hsb-item { padding:.5rem .3rem; }
  .hsb-val { font-size:.95rem; }
  .hsb-label { font-size:.55rem; }
}

@media (max-width:380px) {
  .hero-title { font-size:1.3rem; }
  .hero-sub { font-size:.75rem; }
  
  /* Features - Already vertical from parent, just adjust sizing */
  .hero-features { 
    flex-direction: column; 
    align-items: stretch;
    gap: .42rem;
  }
  .hf-item { 
    justify-content: flex-start;
    padding: .42rem .6rem;
    font-size: .68rem;
    width: 100%;
  }
  .hf-icon { margin-right: .32rem; }
  .hf-icon svg { width: 15px; height: 15px; }
  
  .hero-stats-bar { padding: 0 .5rem .85rem; }
  .hsb-inner { grid-template-columns:1fr; border-radius: 10px; }
  .hsb-item { border-right:none; border-bottom:1px solid #e5e7eb; }
  .hsb-item:last-child { border-bottom:none; }
}

/* ── Stats bar responsive (phone/tablet only) ── */
@media (max-width: 1024px) {
  .hsb-inner { grid-template-columns: repeat(3, 1fr); }
  .hero-inner{min-height: 0vh;}
}
@media (max-width: 768px) {
  .hero-stats-bar { padding: 0; }
  .hsb-inner { grid-template-columns: repeat(2, 1fr); padding: 0 1rem; }
  .hsb-item { padding: 1rem .5rem; border-right: none; border-bottom: 1px solid #e5e7eb; }
  .hsb-item:nth-child(odd) { border-right: 1px solid #e5e7eb; }
  .hsb-item:nth-last-child(-n+2) { border-bottom: none; }
  .hsb-val { font-size: 1.2rem; }
  .hsb-label { font-size: .65rem; }
}
@media (max-width: 480px) {
  .hsb-inner { grid-template-columns: repeat(2, 1fr); padding: 0 .5rem; }
  .hsb-item { padding: .85rem .4rem; }
  .hsb-val { font-size: 1.1rem; }
  .hsb-label { font-size: .62rem; }
  
  /* Badge - ONE LINE fully filling the box */
  .hero-badge { 
    white-space: nowrap !important;
    font-size: .58rem !important;
    padding: .3rem .5rem !important;
    letter-spacing: 0 !important;
    word-spacing: .15em !important;
    gap: 6px !important;
    margin: 0 0 1rem 0 !important;
    width: 100% !important;
    max-width: 100% !important;
    display: inline-flex !important;
    box-sizing: border-box !important;
    justify-content: center !important;
    font-family: 'Poppins', sans-serif !important;
  }
  
  .badge-dot {
    width: 6px !important;
    height: 6px !important;
    flex-shrink: 0 !important;
  }
  
  .hero-left {
    padding-left: 0 !important;
    padding-right: 0 !important;
    box-sizing: border-box !important;
  }
  
  .hero-inner {
    padding: 1.5rem .5rem 1rem !important;
    box-sizing: border-box !important;
  }
}

/* ===== DEVICE-SPECIFIC RESPONSIVE STYLES ===== */
/* Galaxy Z Fold 5, Samsung Galaxy S8+, iPhone SE, iPhone 14 Pro Max */

/* Galaxy Z Fold 5 (≤344px) */
@media (max-width: 344px) {
  .hero { padding-top: 70px; }
  .hero-inner { padding: 1.25rem .75rem .85rem; gap: .65rem; }
  
  /* Badge */
  .hero-badge { 
    font-size: .62rem; 
    padding: .25rem .65rem; 
    margin-bottom: .85rem; 
    gap: 6px;
    display: inline-flex;
    width: auto;
  }
  .badge-dot { width: 6px; height: 6px; }
  
  /* Title */
  .hero-title { 
    font-size: 1.25rem; 
    margin-bottom: .75rem; 
    line-height: 1.2;
  }
  
  /* Subtitle */
  .hero-sub { 
    font-size: .74rem; 
    margin-bottom: .85rem; 
    line-height: 1.6;
  }
  
  /* Features - Vertical Stack */
  .hero-features { 
    display: flex;
    flex-direction: column;
    gap: .45rem; 
    margin-bottom: 1rem;
    align-items: stretch;
  }
  .hf-item { 
    padding: .45rem .65rem; 
    font-size: .7rem; 
    border-radius: 8px;
    background: rgba(24,180,91,0.08);
    border: 1px solid rgba(24,180,91,0.2);
    width: 100%;
    justify-content: flex-start;
  }
  .hf-icon { 
    color: #18b45b;
    display: flex;
    margin-right: .35rem;
  }
  .hf-icon svg { width: 16px; height: 16px; }
  
  /* Buttons - Full width stacked */
  .hero-btns-mobile { 
    display: flex;
    flex-direction: column;
    gap: .6rem;
    width: 100%;
    margin-bottom: 1rem;
  }
  .btn-hero-primary, .btn-hero-outline { 
    width: 100%;
    padding: .7rem 1.2rem; 
    font-size: .8rem;
    border-radius: 8px;
    justify-content: center;
    text-align: center;
  }
  
  /* Image */
  .hero-img-box { border-radius: 12px; }
  .hero-main-img { 
    min-height: 220px; 
    max-height: 300px; 
    border-radius: 12px;
  }
  .hero-logo-badge { 
    bottom: .85rem; 
    right: .85rem; 
    padding: .35rem .6rem; 
    border-radius: 8px;
  }
  .hero-logo-badge img { height: 18px !important; }
  
  /* Stats Bar */
  .hero-stats-bar { padding: 0 .75rem .85rem; }
  .hsb-inner { 
    grid-template-columns: repeat(2, 1fr); 
    border-radius: 10px;
  }
  .hsb-item { padding: .75rem .3rem; }
  .hsb-val { font-size: 1rem; }
  .hsb-label { font-size: .54rem; line-height: 1.35; }
  .hsb-stars { font-size: .7rem; margin-top: .12rem; }
}

/* Samsung Galaxy S8+ (345px - 360px) */
@media (min-width: 345px) and (max-width: 360px) {
  .hero { padding-top: 72px; }
  .hero-inner { padding: 1.35rem .85rem .9rem; gap: .7rem; }
  
  /* Badge */
  .hero-badge { 
    font-size: .64rem; 
    padding: .26rem .68rem; 
    margin-bottom: .9rem; 
    gap: 6px;
    display: inline-flex;
    width: auto;
  }
  .badge-dot { width: 6px; height: 6px; }
  
  /* Title */
  .hero-title { 
    font-size: 1.3rem; 
    margin-bottom: .8rem;
    line-height: 1.2;
  }
  
  /* Subtitle */
  .hero-sub { 
    font-size: .76rem; 
    margin-bottom: .9rem;
    line-height: 1.6;
  }
  
  /* Features - Vertical Stack */
  .hero-features { 
    display: flex;
    flex-direction: column;
    gap: .48rem; 
    margin-bottom: 1.05rem;
    align-items: stretch;
  }
  .hf-item { 
    padding: .48rem .68rem; 
    font-size: .72rem; 
    border-radius: 8px;
    background: rgba(24,180,91,0.08);
    border: 1px solid rgba(24,180,91,0.2);
    width: 100%;
    justify-content: flex-start;
  }
  .hf-icon { 
    color: #18b45b;
    display: flex;
    margin-right: .38rem;
  }
  .hf-icon svg { width: 16px; height: 16px; }
  
  /* Buttons - Full width stacked */
  .hero-btns-mobile { 
    display: flex;
    flex-direction: column;
    gap: .62rem;
    width: 100%;
    margin-bottom: 1.05rem;
  }
  .btn-hero-primary, .btn-hero-outline { 
    width: 100%;
    padding: .72rem 1.25rem; 
    font-size: .82rem;
    border-radius: 8px;
    justify-content: center;
    text-align: center;
  }
  
  /* Image */
  .hero-img-box { border-radius: 13px; }
  .hero-main-img { 
    min-height: 230px; 
    max-height: 310px;
    border-radius: 13px;
  }
  .hero-logo-badge { 
    bottom: .9rem; 
    right: .9rem; 
    padding: .36rem .62rem;
    border-radius: 8px;
  }
  .hero-logo-badge img { height: 19px !important; }
  
  /* Stats Bar */
  .hero-stats-bar { padding: 0 .8rem .88rem; }
  .hsb-inner { 
    grid-template-columns: repeat(2, 1fr);
    border-radius: 10px;
  }
  .hsb-item { padding: .78rem .32rem; }
  .hsb-val { font-size: 1.02rem; }
  .hsb-label { font-size: .56rem; line-height: 1.36; }
  .hsb-stars { font-size: .72rem; margin-top: .13rem; }
}

/* iPhone SE (361px - 375px) */
@media (min-width: 361px) and (max-width: 375px) {
  .hero { padding-top: 74px; }
  .hero-inner { padding: 1.4rem .9rem .95rem; gap: .72rem; }
  
  /* Badge */
  .hero-badge { 
    font-size: .66rem; 
    padding: .27rem .7rem; 
    margin-bottom: .95rem; 
    gap: 7px;
    display: inline-flex;
    width: auto;
  }
  .badge-dot { width: 6.5px; height: 6.5px; }
  
  /* Title */
  .hero-title { 
    font-size: 1.35rem; 
    margin-bottom: .82rem;
    line-height: 1.2;
  }
  
  /* Subtitle */
  .hero-sub { 
    font-size: .78rem; 
    margin-bottom: .95rem;
    line-height: 1.65;
  }
  
  /* Features - Vertical Stack */
  .hero-features { 
    display: flex;
    flex-direction: column;
    gap: .5rem; 
    margin-bottom: 1.1rem;
    align-items: stretch;
  }
  .hf-item { 
    padding: .5rem .7rem; 
    font-size: .74rem; 
    border-radius: 8px;
    background: rgba(24,180,91,0.08);
    border: 1px solid rgba(24,180,91,0.2);
    width: 100%;
    justify-content: flex-start;
  }
  .hf-icon { 
    color: #18b45b;
    display: flex;
    margin-right: .4rem;
  }
  .hf-icon svg { width: 17px; height: 17px; }
  
  /* Buttons - Full width stacked */
  .hero-btns-mobile { 
    display: flex;
    flex-direction: column;
    gap: .65rem;
    width: 100%;
    margin-bottom: 1.1rem;
  }
  .btn-hero-primary, .btn-hero-outline { 
    width: 100%;
    padding: .75rem 1.3rem; 
    font-size: .84rem;
    border-radius: 8px;
    justify-content: center;
    text-align: center;
  }
  
  /* Image */
  .hero-img-box { border-radius: 14px; }
  .hero-main-img { 
    min-height: 240px; 
    max-height: 320px;
    border-radius: 14px;
  }
  .hero-logo-badge { 
    bottom: .95rem; 
    right: .95rem; 
    padding: .38rem .65rem;
    border-radius: 9px;
  }
  .hero-logo-badge img { height: 20px !important; }
  
  /* Stats Bar */
  .hero-stats-bar { padding: 0 .85rem .9rem; }
  .hsb-inner { 
    grid-template-columns: repeat(2, 1fr);
    border-radius: 11px;
  }
  .hsb-item { padding: .8rem .34rem; }
  .hsb-val { font-size: 1.05rem; }
  .hsb-label { font-size: .58rem; line-height: 1.37; }
  .hsb-stars { font-size: .74rem; margin-top: .14rem; }
}

/* iPhone 14 Pro Max (376px - 430px) */
@media (min-width: 376px) and (max-width: 430px) {
  .hero { padding-top: 74px; }
  .hero-inner { padding: 1.5rem 1rem 1rem; gap: .75rem; }
  
  /* Badge */
  .hero-badge { 
    font-size: .68rem; 
    padding: .28rem .72rem; 
    margin-bottom: 1rem; 
    gap: 7px;
    display: inline-flex;
    width: auto;
  }
  .badge-dot { width: 7px; height: 7px; }
  
  /* Title */
  .hero-title { 
    font-size: 1.45rem; 
    margin-bottom: .85rem;
    line-height: 1.22;
  }
  
  /* Subtitle */
  .hero-sub { 
    font-size: .8rem; 
    margin-bottom: 1rem;
    line-height: 1.65;
  }
  
  /* Features - Vertical Stack */
  .hero-features { 
    display: flex;
    flex-direction: column;
    gap: .52rem; 
    margin-bottom: 1.15rem;
    align-items: stretch;
  }
  .hf-item { 
    padding: .52rem .72rem; 
    font-size: .76rem; 
    border-radius: 8px;
    background: rgba(24,180,91,0.08);
    border: 1px solid rgba(24,180,91,0.2);
    width: 100%;
    justify-content: flex-start;
  }
  .hf-icon { 
    color: #18b45b;
    display: flex;
    margin-right: .42rem;
  }
  .hf-icon svg { width: 17px; height: 17px; }
  
  /* Buttons - Full width stacked */
  .hero-btns-mobile { 
    display: flex;
    flex-direction: column;
    gap: .68rem;
    width: 100%;
    margin-bottom: 1.15rem;
  }
  .btn-hero-primary, .btn-hero-outline { 
    width: 100%;
    padding: .78rem 1.35rem; 
    font-size: .86rem;
    border-radius: 8px;
    justify-content: center;
    text-align: center;
  }
  
  /* Image */
  .hero-img-box { border-radius: 14px; }
  .hero-main-img { 
    min-height: 250px; 
    max-height: 340px;
    border-radius: 14px;
  }
  .hero-logo-badge { 
    bottom: 1rem; 
    right: 1rem; 
    padding: .4rem .68rem;
    border-radius: 9px;
  }
  .hero-logo-badge img { height: 20px !important; }
  
  /* Stats Bar */
  .hero-stats-bar { padding: 0 .9rem .92rem; }
  .hsb-inner { 
    grid-template-columns: repeat(2, 1fr);
    border-radius: 11px;
  }
  .hsb-item { padding: .82rem .36rem; }
  .hsb-val { font-size: 1.08rem; }
  .hsb-label { font-size: .6rem; line-height: 1.38; }
  .hsb-stars { font-size: .76rem; margin-top: .15rem; }
}
HEROCSSEOF

echo "[4/8] Restoring original Hero.jsx ..."
cat > "$SRC/components/Sections/Hero.jsx" << 'HEROJSXEOF'
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import heroStudents from "../../assets/hero-students.jpg/WhatsApp Image 2026-05-23 at 09.41.02.jpeg";
import './Hero.css';

const HeroParticles = () => {
  const containerRef = useRef(null);
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    while (container.firstChild) container.removeChild(container.firstChild);
    const PARTICLES = [
      { color: 'rgba(24,180,91,0.6)',   minSize: 3, maxSize: 6,  count: 14 },
      { color: 'rgba(255,255,255,0.2)', minSize: 1, maxSize: 3,  count: 12 },
      { color: 'rgba(24,180,91,0.25)',  minSize: 6, maxSize: 10, count: 5  },
    ];
    PARTICLES.forEach(({ color, minSize, maxSize, count }) => {
      for (let i = 0; i < count; i++) {
        const p = document.createElement('div');
        const size = minSize + Math.random() * (maxSize - minSize);
        const duration = 8 + Math.random() * 12;
        const delay = Math.random() * 8;
        const xMove = (Math.random() - 0.5) * 80;
        const yMove = -(40 + Math.random() * 80);
        Object.assign(p.style, {
          position: 'absolute', width: size + 'px', height: size + 'px',
          borderRadius: '50%', background: color,
          boxShadow: size > 5 ? `0 0 ${size * 3}px ${color}` : 'none',
          left: Math.random() * 100 + '%', top: Math.random() * 100 + '%',
          animation: `heroParticleFloat ${duration}s ease-in-out ${delay}s infinite`,
          '--xMove': xMove + 'px', '--yMove': yMove + 'px', pointerEvents: 'none',
        });
        container.appendChild(p);
      }
    });
    return () => { while (container.firstChild) container.removeChild(container.firstChild); };
  }, []);
  return <div ref={containerRef} style={{ position:'absolute', inset:0, overflow:'hidden', pointerEvents:'none', zIndex:0 }} />;
};

const Counter = ({ target, suffix = '', duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      obs.disconnect();
      const start = Date.now();
      const tick = () => {
        const elapsed = Date.now() - start;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        setCount(Math.round(target * ease));
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target, duration]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

const Hero = () => {
  const { user } = useAuth();
  return (
    <section className="hero" id="home">
      <div className="hero-bg">
        <div className="hero-orb orb-1" />
        <div className="hero-orb orb-2" />
        <div className="hero-grid" />
        <HeroParticles />
      </div>
      <div className="hero-inner">
        <div className="hero-left">
          <div className="hero-badge">
            <span className="badge-dot" />
            India's #1&nbsp;&nbsp;Learn-by-Working Ecosystem for Students
          </div>
          <h1 className="hero-title">
            Learn In-Demand Skills.<br />
            Work on Real Projects.<br />
            <span className="highlight">Earn Before You Graduate.</span>
          </h1>
          <p className="hero-sub">
            Mentor-led training, live client projects and stipend opportunities — powered by WeIntern.
          </p>
          <div className="hero-features">
            {[
              { icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>, label:'Mentor Guided' },
              { icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>, label:'Live Client Projects' },
              { icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>, label:'Stipend Opportunities' },
              { icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>, label:'Real Portfolio' },
              { icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>, label:'Career Growth' },
            ].map((f,i) => (
              <div key={i} className="hf-item">
                <span className="hf-icon">{f.icon}</span>
                <span>{f.label}</span>
              </div>
            ))}
          </div>
          {/* Desktop buttons — hidden on mobile */}
          <div className="hero-btns hero-btns-desktop">
            <a href="#courses" className="btn-hero-primary" onClick={e=>{e.preventDefault();document.getElementById('courses')?.scrollIntoView({behavior:'smooth'})}}>Explore Courses →</a>
            <a href="#contact" className="btn-hero-outline" onClick={e=>{e.preventDefault();document.getElementById('contact')?.scrollIntoView({behavior:'smooth'})}}>Start Your Journey →</a>
          </div>
        </div>

        {/* CENTER — Big Image */}
        <div className="hero-center">
          <div className="hero-img-box">
            <img src="/hero-students.jpg" alt="WeIntern Students" className="hero-main-img" onError={e=>{e.target.style.display='none';e.target.nextSibling.style.display='flex'}}/>
            <div className="hero-img-fallback" style={{display:'none'}}>
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="rgba(24,180,91,0.5)" strokeWidth="1"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              <p>Place hero-students.jpg in /public/</p>
            </div>
            {/* Logo badge */}
            <div className="hero-logo-badge">
              <img src="/welogo.png" alt="WeIntern" style={{height:24,filter:'brightness(0) invert(1)'}}/>
            </div>
          </div>
        </div>

        {/* RIGHT — Stats */}
        <div className="hero-stats-side">
          {[
            { icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#18b45b" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>, val:'2,000+', label:'Student Impact' },
            { icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#18b45b" strokeWidth="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>, val:'100+', label:'Live Projects' },
            { icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#18b45b" strokeWidth="1.5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>, val:'₹5 Lakh+', label:'Paid in Stipends' },
            { icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#18b45b" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>, val:'5+', label:'College Partners' },
            { icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#18b45b" strokeWidth="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>, val:'4.8/5', label:'Student Rating' },
          ].map((s,i) => (
            <div key={i} className="hss-item">
              <div className="hss-icon">{s.icon}</div>
              <div>
                <strong>{s.val}</strong>
                <span>{s.label}</span>
                {s.val === '4.8/5' && <div className="hss-stars">★★★★★</div>}
              </div>
            </div>
          ))}
        </div>

        {/* Mobile-only buttons — shown below image on mobile */}
        <div className="hero-btns hero-btns-mobile">
          <a href="#courses" className="btn-hero-primary" onClick={e=>{e.preventDefault();document.getElementById('courses')?.scrollIntoView({behavior:'smooth'})}}>Explore Courses →</a>
          <a href="#contact" className="btn-hero-outline" onClick={e=>{e.preventDefault();document.getElementById('contact')?.scrollIntoView({behavior:'smooth'})}}>Start Your Journey →</a>
        </div>
      </div>
      

      <div className="hero-stats-bar">
        <div className="hsb-inner">
          {[
            {val:'₹5 Lakh+', label:'Paid in Stipends', color:'#18b45b'},
            {val:'75%', label:'of Project Value Goes to Students', color:'#18b45b'},
            {val:'100+', label:'Live Projects', color:'#2563eb'},
            {val:'2,000+', label:'Student Impact', color:'#7c3aed'},
            {val:'5+', label:'College Partners', color:'#7c3aed'},
            {val:'4.8/5', label:'Student Rating', color:'#f59e0b', stars:true},
          ].map((s,i)=>(
            <div key={i} className="hsb-item">
              <div className="hsb-val" style={{color:s.color}}>{s.val}</div>
              <div className="hsb-label">{s.label}</div>
              {s.stars && <div className="hsb-stars">★★★★★</div>}
            </div>
          ))}
        </div>
      </div>
      
    </section>
  );
};

export default Hero;
HEROJSXEOF

echo "[5/8] Writing courseExtras.js ..."
mkdir -p "$SRC/data"
cat > "$SRC/data/courseExtras.js" << 'EXTRASEOF'
// Generated helper data for the per-course detail page.
// PLACEHOLDER CONTENT: mentor emails, video links, and material
// download URLs below are placeholders so the page renders correctly.
// Replace them with your real data -- search for "REPLACE ME" markers.

export const slugify = (str = '') =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const hashStr = (str = '') =>
  str.split('').reduce((a, c) => a + c.charCodeAt(0), 0);

// ── Tech / tool icon lookup (used in "Skills You Will Master") ──
// Falls back to a generic code icon if a tool name isn't recognized.
const TECH_ICON_MAP = {
  html: 'logos:html-5', html5: 'logos:html-5',
  css: 'logos:css-3', css3: 'logos:css-3',
  javascript: 'logos:javascript', js: 'logos:javascript',
  typescript: 'logos:typescript-icon', ts: 'logos:typescript-icon',
  react: 'logos:react', 'react.js': 'logos:react', reactjs: 'logos:react',
  'react native': 'logos:react',
  vue: 'logos:vue', 'vue.js': 'logos:vue',
  angular: 'logos:angular-icon',
  node: 'logos:nodejs-icon', 'node.js': 'logos:nodejs-icon', nodejs: 'logos:nodejs-icon',
  express: 'logos:express',
  mongodb: 'logos:mongodb-icon', mongo: 'logos:mongodb-icon',
  mysql: 'logos:mysql', postgresql: 'logos:postgresql', postgres: 'logos:postgresql',
  firebase: 'logos:firebase',
  python: 'logos:python',
  django: 'logos:django-icon', flask: 'logos:flask',
  java: 'logos:java',
  kotlin: 'logos:kotlin-icon',
  swift: 'logos:swift',
  flutter: 'logos:flutter',
  android: 'logos:android-icon',
  ios: 'mdi:apple',
  git: 'logos:git-icon', github: 'mdi:github',
  docker: 'logos:docker-icon',
  kubernetes: 'logos:kubernetes',
  aws: 'logos:aws',
  azure: 'logos:microsoft-azure',
  'google cloud': 'logos:google-cloud', gcp: 'logos:google-cloud',
  figma: 'logos:figma',
  'adobe xd': 'logos:adobe-xd', xd: 'logos:adobe-xd',
  photoshop: 'logos:adobe-photoshop',
  illustrator: 'logos:adobe-illustrator',
  tailwind: 'logos:tailwindcss-icon', 'tailwind css': 'logos:tailwindcss-icon',
  bootstrap: 'logos:bootstrap',
  redux: 'logos:redux',
  graphql: 'logos:graphql',
  jenkins: 'logos:jenkins',
  linux: 'logos:linux-tux',
  'google ads': 'logos:google-ads', seo: 'mdi:magnify-scan',
  'google analytics': 'logos:google-analytics',
  excel: 'logos:microsoft-excel', 'power bi': 'logos:microsoft-power-bi',
  tableau: 'logos:tableau-icon',
  pandas: 'logos:pandas', numpy: 'logos:numpy',
  tensorflow: 'logos:tensorflow', pytorch: 'logos:pytorch-icon',
  'machine learning': 'mdi:brain', ml: 'mdi:brain',
};

export const getTechIcon = (toolName = '') => {
  const key = toolName.trim().toLowerCase();
  return TECH_ICON_MAP[key] || 'mdi:code-tags';
};

// ── Company Partners (shown on every course page) ──────────────
// REPLACE ME: swap in your real hiring/college partner names + logos.
export const PARTNERS = [
  { name: 'TechCorp Solutions', icon: 'mdi:domain' },
  { name: 'InnovateX', icon: 'mdi:rocket-launch-outline' },
  { name: 'CloudNine Systems', icon: 'mdi:cloud-outline' },
  { name: 'ByteWorks', icon: 'mdi:code-braces' },
  { name: 'NexGen Labs', icon: 'mdi:flask-outline' },
  { name: 'Pixel Studio', icon: 'mdi:palette-outline' },
  { name: 'DataSphere', icon: 'mdi:database-outline' },
  { name: 'CodeCraft Inc', icon: 'mdi:laptop' },
];

// ── Why choose this course (4 value props shown under hero) ─────
export const WHY_CHOOSE = [
  { icon: 'mdi:book-open-page-variant-outline', title: 'Comprehensive Curriculum', desc: 'From basics to advanced concepts covering all essential technologies' },
  { icon: 'mdi:code-tags', title: 'Hands-on Projects', desc: 'Build real-world projects and strengthen your portfolio' },
  { icon: 'mdi:infinity', title: 'Lifetime Access', desc: 'Access course materials anytime, anywhere' },
  { icon: 'mdi:certificate-outline', title: 'Industry Recognized', desc: 'Earn a certificate that boosts your career' },
];

// ── Mentors ──────────────────────────────────────────────────────
// REPLACE ME: swap in your real mentors' names/emails/bios.
const MENTOR_POOL = [
  { name: 'Aditya Sharma', role: 'Senior Software Engineer', years: 6, bio: 'Has led product teams at two Series-B startups and mentored 300+ interns into full-time roles.', avatarIcon: 'mdi:account-tie' },
  { name: 'Priya Verma', role: 'Product Designer', years: 5, bio: 'Design lead with experience shipping consumer apps used by millions; passionate about teaching design fundamentals.', avatarIcon: 'mdi:account-tie-woman' },
  { name: 'Rohan Mehta', role: 'Data Scientist', years: 7, bio: 'Worked on ML pipelines at scale; enjoys breaking down complex data concepts into practical, hands-on lessons.', avatarIcon: 'mdi:account-tie' },
  { name: 'Sneha Kapoor', role: 'DevOps Lead', years: 6, bio: 'Manages production infrastructure for high-traffic platforms; focuses on real-world, battle-tested practices.', avatarIcon: 'mdi:account-tie-woman' },
  { name: 'Karan Malhotra', role: 'Full Stack Engineer', years: 5, bio: 'Built and shipped 20+ production applications; mentors students through real client project delivery.', avatarIcon: 'mdi:account-tie' },
  { name: 'Ananya Iyer', role: 'Marketing Strategist', years: 6, bio: 'Runs performance marketing for D2C brands; teaches through live campaign case studies.', avatarIcon: 'mdi:account-tie-woman' },
];

export const getMentor = (course) => {
  const idx = hashStr(course.title) % MENTOR_POOL.length;
  const m = MENTOR_POOL[idx];
  const emailSlug = slugify(m.name).replace(/-/g, '.');
  return {
    ...m,
    email: `${emailSlug}@we-intern.in`, // REPLACE ME
    yearOfStudy: null,
  };
};

// ── Roadmap (reuses curriculum data when available) ─────────────
export const getRoadmap = (course, details) => {
  if (details?.curriculum?.length) {
    return details.curriculum.map((c) => ({
      phase: c.week,
      title: c.title,
      topics: c.topics,
    }));
  }
  return [
    { phase: 'Phase 1', title: 'Fundamentals & Setup', topics: ['Environment setup', 'Core concepts', 'Basic exercises'] },
    { phase: 'Phase 2', title: 'Applied Practice', topics: ['Real-world patterns', 'Guided projects', 'Code review'] },
    { phase: 'Phase 3', title: 'Real Client Projects', topics: ['Client requirements', 'Delivery', 'Portfolio building'] },
  ];
};

// ── Demo lecture videos ──────────────────────────────────────────
// REPLACE ME: set videoUrl to your real YouTube/Vimeo links.
export const getVideos = (course, details) => {
  const source = details?.curriculum?.slice(0, 3) || [
    { title: 'Course Introduction' },
    { title: 'Core Concepts Walkthrough' },
    { title: 'Live Project Demo' },
  ];
  return source.map((c, i) => ({
    title: `${c.title} — Demo Lecture`,
    duration: ['08:45', '14:20', '11:05'][i] || '10:00',
    videoUrl: '', // REPLACE ME
  }));
};

// ── Student testimonials ─────────────────────────────────────────
// REPLACE ME: swap in real student quotes once available.
const TESTIMONIAL_NAMES = [
  { name: 'Ishaan Gupta', batch: 'B.Tech CSE, 2025' },
  { name: 'Riya Desai', batch: 'BCA, 2024' },
  { name: 'Vikram Nair', batch: 'B.Tech IT, 2025' },
];

export const getTestimonials = (course) => [
  { ...TESTIMONIAL_NAMES[0], rating: 5, quote: `The ${course.title} course gave me real project experience I could actually show in interviews — not just certificates.` },
  { ...TESTIMONIAL_NAMES[1], rating: 5, quote: `Mentors were genuinely invested in helping us. The ${course.title} curriculum felt practical from day one.` },
  { ...TESTIMONIAL_NAMES[2], rating: 4, quote: `Best decision I made this year. I landed my first internship offer right after finishing this course.` },
];

// ── Free downloadable study materials ────────────────────────────
// REPLACE ME: set downloadUrl to your real hosted PDF/resource links.
export const getMaterials = (course, details) => {
  const weeks = details?.curriculum?.map((c) => c.week) || ['Phase 1', 'Phase 2'];
  const items = weeks.map((w) => ({ title: `${w} — Notes & Slides (PDF)`, type: 'PDF', downloadUrl: '' }));
  return [
    ...items,
    { title: 'Complete Cheat Sheet', type: 'PDF', downloadUrl: '' },
    { title: 'Practice Assignments', type: 'ZIP', downloadUrl: '' },
    { title: 'Reference Links & Resources', type: 'DOC', downloadUrl: '' },
  ];
};

// ── Prerequisites ─────────────────────────────────────────────────
export const getPrerequisites = (course) => {
  const base = ['A laptop with a stable internet connection', 'Willingness to learn and practice consistently'];
  const level = (course.level || 'beginner').toLowerCase();
  const toolHint = Array.isArray(course.tools) && course.tools.length
    ? `Basic familiarity with ${course.tools[0]} is helpful but not required`
    : null;

  if (level === 'beginner') return ['No prior experience required', ...base];
  if (level === 'intermediate') return ['Basic programming/technical fundamentals', ...(toolHint ? [toolHint] : []), ...base];
  return ['Solid understanding of programming fundamentals', 'Prior exposure to related tools recommended', ...base];
};
EXTRASEOF

echo "[6/8] Writing new light-theme CoursePage.jsx + CoursePage.css ..."
mkdir -p "$SRC/pages"
cat > "$SRC/pages/CoursePage.jsx" << 'PAGEEOF'
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useAuth } from '../context/AuthContext';
import { useCourses } from '../context/CoursesContext';
import { COURSE_DETAILS } from '../components/Sections/CourseDetail';
import { EnrollModal } from '../components/Sections/Courses';
import Navbar from '../components/Layout/Navbar';
import toast from 'react-hot-toast';
import {
  slugify,
  getMentor,
  getRoadmap,
  getVideos,
  getTestimonials,
  getMaterials,
  getPrerequisites,
  getTechIcon,
  PARTNERS,
  WHY_CHOOSE,
} from '../data/courseExtras';
import './CoursePage.css';

const buildFallbackDetails = (course) => ({
  icon: course.icon || 'mdi:school',
  tagline: course.tagline || course.desc || 'Professional course by WeIntern',
  price: course.price || 0,
  duration: course.duration || 'Flexible',
  level: (course.level || 'beginner').charAt(0).toUpperCase() + (course.level || 'beginner').slice(1),
  language: course.language || 'English + Hindi',
  certificate: true,
  stipend: true,
  about:
    course.about ||
    course.desc ||
    course.tagline ||
    'This course is designed by industry experts to give you real-world skills and hands-on experience.',
  tools: Array.isArray(course.tools)
    ? course.tools
    : (course.tools || '').split(',').map((t) => t.trim()).filter(Boolean),
  curriculum: [
    { week: 'Phase 1', title: 'Fundamentals & Setup', topics: ['Environment setup', 'Core concepts', 'Basic projects', 'Best practices'] },
    { week: 'Phase 2', title: 'Intermediate Topics', topics: ['Advanced features', 'Real patterns', 'Code review', 'Debugging'] },
    { week: 'Phase 3', title: 'Real Client Projects', topics: ['Client requirements', 'Project execution', 'Delivery', 'Portfolio'] },
  ],
});

const Stars = ({ count }) => (
  <div className="cp-stars">
    {Array.from({ length: 5 }).map((_, i) => (
      <Icon key={i} icon="mdi:star" width={14} height={14} color={i < count ? '#f59e0b' : '#e2e5ee'} />
    ))}
  </div>
);

const CoursePage = () => {
  const { slug } = useParams();
  const { activeCourses } = useCourses();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [enrollCourseData, setEnrollCourseData] = useState(null);

  const course = activeCourses.find((c) => slugify(c.title) === slug);

  if (!course) {
    return (
      <div className="cp-page">
        <Navbar />
        <div className="cp-notfound">
          <h2>Course not found</h2>
          <p>This course may have been removed or renamed.</p>
          <Link to="/" className="cp-btn cp-btn-primary">Back to all courses</Link>
        </div>
      </div>
    );
  }

  const details = COURSE_DETAILS[course.title] || buildFallbackDetails(course);
  const originalPrice = course.originalPrice || Math.round((course.price || details.price) * 1.2);
  const offerPrice = course.price || details.price;
  const discount = Math.round(((originalPrice - offerPrice) / originalPrice) * 100);

  const mentor = getMentor(course);
  const roadmap = getRoadmap(course, details);
  const videos = getVideos(course, details);
  const testimonials = getTestimonials(course);
  const materials = getMaterials(course, details);
  const prerequisites = getPrerequisites(course);

  const handleEnroll = () => {
    if (!user) {
      toast('Please login or register to enroll', { icon: 'ℹ️' });
      navigate('/login');
      return;
    }
    setEnrollCourseData(course);
  };

  return (
    <div className="cp-page">
      <Navbar />

      {/* Hero */}
      <div className="cp-hero">
        <div className="cp-hero-inner">
          <div className="cp-hero-left">
            <div className="cp-hero-badge">
              <span className="cp-hero-badge-icon"><Icon icon={details.icon} width={16} height={16} /></span>
              CERTIFICATION COURSE
            </div>
            <h1 className="cp-hero-title">{course.title}</h1>
            <p className="cp-hero-tagline">{details.tagline}</p>

            <div className="cp-hero-badges">
              <span className="cp-badge"><Icon icon="mdi:clock-outline" width={14} height={14} /> {details.duration}</span>
              <span className="cp-badge"><Icon icon="mdi:chart-bar" width={14} height={14} /> {details.level}</span>
              <span className="cp-badge"><Icon icon="mdi:web" width={14} height={14} /> {details.language}</span>
              {details.certificate && <span className="cp-badge"><Icon icon="mdi:certificate-outline" width={14} height={14} /> Certificate</span>}
            </div>

            <div className="cp-hero-price-row">
              <span className="cp-price-old">₹{Number(originalPrice).toLocaleString('en-IN')}</span>
              <span className="cp-price-new">₹{Number(offerPrice).toLocaleString('en-IN')}</span>
              <span className="cp-price-discount">{discount}% OFF</span>
              <button className="cp-btn cp-btn-primary" onClick={handleEnroll}>
                Enroll Now <Icon icon="mdi:arrow-right" width={16} height={16} />
              </button>
            </div>
          </div>

          <div className="cp-hero-right">
            <div className="cp-hero-illustration">
              <div className="cp-hi-glow" />
              <div className="cp-hi-monitor">
                <div className="cp-hi-monitor-bar" />
                <div className="cp-hi-lines">
                  {[...Array(6)].map((_, i) => <div key={i} className="cp-hi-line" style={{ width: `${55 + (i % 3) * 15}%` }} />)}
                </div>
              </div>
              <div className="cp-hi-tag cp-hi-tag-1"><Icon icon="mdi:code-tags" width={20} height={20} /></div>
              <div className="cp-hi-tag cp-hi-tag-2"><Icon icon={details.icon} width={20} height={20} /></div>
            </div>
          </div>
        </div>
      </div>

      {/* Why choose */}
      <div className="cp-why-strip">
        <div className="cp-why-inner">
          {WHY_CHOOSE.map((w, i) => (
            <div className="cp-why-item" key={i}>
              <div className="cp-why-icon"><Icon icon={w.icon} width={22} height={22} /></div>
              <div>
                <h4>{w.title}</h4>
                <p>{w.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="cp-body">
        {/* Skills you will master */}
        {!!details.tools?.length && (
          <section className="cp-section cp-skills-section">
            <span className="cp-section-eyebrow">— What You'll Learn —</span>
            <h2 className="cp-section-title cp-center">Skills You Will Master</h2>
            <div className="cp-skills-grid">
              {details.tools.map((t) => (
                <div className="cp-skill-card" key={t}>
                  <div className="cp-skill-icon"><Icon icon={getTechIcon(t)} width={30} height={30} /></div>
                  <h4>{t}</h4>
                  <p>Build practical skills with {t} used in real projects.</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* About */}
        <section className="cp-section">
          <span className="cp-section-eyebrow">Overview</span>
          <h2 className="cp-section-title">About this course</h2>
          <p className="cp-about-text">{details.about}</p>
        </section>

        {/* Prerequisites */}
        <section className="cp-section">
          <span className="cp-section-eyebrow">Before you start</span>
          <h2 className="cp-section-title">Requirements to get started</h2>
          <ul className="cp-check-list">
            {prerequisites.map((p, i) => (
              <li key={i}><Icon icon="mdi:check-circle" width={18} height={18} /> {p}</li>
            ))}
          </ul>
        </section>

        {/* Roadmap */}
        <section className="cp-section">
          <span className="cp-section-eyebrow">Curriculum</span>
          <h2 className="cp-section-title">Course Roadmap & Topics</h2>
          <div className="cp-roadmap">
            {roadmap.map((r, i) => (
              <div className="cp-roadmap-step" key={i}>
                <div className="cp-roadmap-marker">{i + 1}</div>
                <div className="cp-roadmap-content">
                  <span className="cp-roadmap-phase">{r.phase}</span>
                  <h3 className="cp-roadmap-title">{r.title}</h3>
                  <div className="cp-roadmap-topics">
                    {r.topics.map((t) => <span key={t} className="cp-topic-chip">{t}</span>)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Demo Lecture Videos */}
        <section className="cp-section">
          <span className="cp-section-eyebrow">Preview</span>
          <h2 className="cp-section-title">Demo Lecture Videos</h2>
          <div className="cp-video-grid">
            {videos.map((v, i) => (
              <div className="cp-video-card" key={i}>
                <div className="cp-video-thumb">
                  {v.videoUrl ? (
                    <a href={v.videoUrl} target="_blank" rel="noopener noreferrer" className="cp-video-play">
                      <Icon icon="mdi:play-circle" width={44} height={44} />
                    </a>
                  ) : (
                    <span className="cp-video-soon">Demo coming soon</span>
                  )}
                </div>
                <div className="cp-video-info">
                  <p className="cp-video-title">{v.title}</p>
                  <span className="cp-video-duration">{v.duration}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Mentor */}
        <section className="cp-section">
          <span className="cp-section-eyebrow">Meet your guide</span>
          <h2 className="cp-section-title">Your Mentor</h2>
          <div className="cp-mentor-card">
            <div className="cp-mentor-avatar"><Icon icon={mentor.avatarIcon} width={34} height={34} /></div>
            <div className="cp-mentor-info">
              <h3>{mentor.name}</h3>
              <p className="cp-mentor-role">{mentor.role} · {mentor.years}+ years experience</p>
              <p className="cp-mentor-bio">{mentor.bio}</p>
              <a href={`mailto:${mentor.email}`} className="cp-mentor-email">
                <Icon icon="mdi:email-outline" width={14} height={14} /> {mentor.email}
              </a>
            </div>
          </div>
        </section>

        {/* Study Materials */}
        <section className="cp-section">
          <span className="cp-section-eyebrow">Resources</span>
          <h2 className="cp-section-title">Free Study Materials</h2>
          <div className="cp-materials-grid">
            {materials.map((m, i) => (
              <div className="cp-material-card" key={i}>
                <Icon icon="mdi:file-download-outline" width={22} height={22} />
                <span className="cp-material-title">{m.title}</span>
                {m.downloadUrl ? (
                  <a href={m.downloadUrl} className="cp-material-btn" download>Download</a>
                ) : (
                  <span className="cp-material-btn cp-material-btn-disabled">Coming soon</span>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="cp-section">
          <span className="cp-section-eyebrow">Real feedback</span>
          <h2 className="cp-section-title">Student Testimonials</h2>
          <div className="cp-testimonial-grid">
            {testimonials.map((t, i) => (
              <div className="cp-testimonial-card" key={i}>
                <Stars count={t.rating} />
                <p className="cp-testimonial-quote">"{t.quote}"</p>
                <p className="cp-testimonial-name">{t.name}</p>
                <p className="cp-testimonial-batch">{t.batch}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Partners */}
        <section className="cp-section cp-partners-section">
          <span className="cp-section-eyebrow">Trusted by</span>
          <h2 className="cp-section-title cp-center">Our Company Partners</h2>
          <div className="cp-partners-row">
            {PARTNERS.map((p) => (
              <div className="cp-partner-chip" key={p.name}>
                <Icon icon={p.icon} width={20} height={20} /><span>{p.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom CTA */}
        <div className="cp-bottom-cta">
          <div>
            <span className="cp-price-new" style={{ fontSize: '1.4rem' }}>₹{Number(offerPrice).toLocaleString('en-IN')}</span>
            <span className="cp-price-old" style={{ marginLeft: 10 }}>₹{Number(originalPrice).toLocaleString('en-IN')}</span>
          </div>
          <button className="cp-btn cp-btn-primary" onClick={handleEnroll}>
            Enroll Now <Icon icon="mdi:arrow-right" width={16} height={16} />
          </button>
        </div>
      </div>

      {enrollCourseData && (
        <EnrollModal course={enrollCourseData} onClose={() => setEnrollCourseData(null)} />
      )}
    </div>
  );
};

export default CoursePage;
PAGEEOF
cat > "$SRC/pages/CoursePage.css" << 'CSSEOF'
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

.cp-page {
  min-height: 100vh;
  background: #f7f8fb;
  color: #1a2036;
  font-family: 'Inter', sans-serif;
}
.cp-page * { font-family: 'Inter', sans-serif; }

/* ── Hero ────────────────────────────────────────────── */
.cp-hero {
  position: relative;
  padding: 106px 24px 40px;
  background: linear-gradient(120deg, #ff8a4c 0%, #ff6b35 55%, #ff5722 100%);
  overflow: hidden;
}

.cp-hero-inner {
  max-width: 1160px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 32px;
  align-items: center;
}

.cp-hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: rgba(255, 255, 255, 0.16);
  border: 1px solid rgba(255, 255, 255, 0.28);
  color: #fff;
  padding: 8px 16px 8px 8px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.06em;
  margin-bottom: 20px;
}
.cp-hero-badge-icon {
  width: 26px; height: 26px; border-radius: 8px;
  background: linear-gradient(135deg, #ffd23f, #ff9d1f);
  color: #1a2036;
  display: flex; align-items: center; justify-content: center;
}

.cp-hero-title {
  font-size: clamp(2rem, 4vw, 2.9rem);
  font-weight: 800;
  color: #fff;
  line-height: 1.15;
  letter-spacing: -0.02em;
  margin: 0 0 14px;
}

.cp-hero-tagline {
  color: rgba(255, 255, 255, 0.92);
  font-size: 1.02rem;
  line-height: 1.5;
  margin: 0 0 24px;
  max-width: 46ch;
}

.cp-hero-badges { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 26px; }
.cp-badge {
  display: inline-flex; align-items: center; gap: 6px;
  background: rgba(255, 255, 255, 0.16);
  border: 1px solid rgba(255, 255, 255, 0.22);
  color: #fff; padding: 7px 14px; border-radius: 999px;
  font-size: 12.5px; font-weight: 600;
}

.cp-hero-price-row { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; }
.cp-price-old { color: rgba(255, 255, 255, 0.65); text-decoration: line-through; font-size: 15px; font-weight: 500; }
.cp-price-new { color: #fff; font-size: 1.9rem; font-weight: 800; }
.cp-price-discount {
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: #fff; font-size: 11.5px; font-weight: 700;
  padding: 4px 10px; border-radius: 7px;
}

.cp-btn {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 13px 26px; border-radius: 12px;
  font-weight: 700; font-size: 14.5px; border: none;
  cursor: pointer; text-decoration: none;
  font-family: 'Inter', sans-serif;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.cp-btn-primary {
  background: linear-gradient(135deg, #ffd23f, #ff9d1f);
  color: #1a2036;
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.15);
}
.cp-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 28px rgba(0, 0, 0, 0.22); }

/* ── Hero illustration (right side) ─────────────────── */
.cp-hero-right { display: flex; align-items: center; justify-content: center; }
.cp-hero-illustration { position: relative; width: 100%; max-width: 380px; aspect-ratio: 1.1/1; }
.cp-hi-glow {
  position: absolute; inset: -20px;
  background: radial-gradient(circle, rgba(255,255,255,0.28), transparent 65%);
  border-radius: 50%;
}
.cp-hi-monitor {
  position: relative;
  background: #1a2036;
  border-radius: 16px;
  padding: 18px 20px;
  box-shadow: 0 24px 50px rgba(0, 0, 0, 0.28);
  transform: translateY(10%);
}
.cp-hi-monitor-bar { display: flex; gap: 6px; margin-bottom: 14px; }
.cp-hi-monitor-bar::before, .cp-hi-monitor-bar::after, .cp-hi-monitor-bar {
  content: ''; width: 8px; height: 8px; border-radius: 50%; background: #ff5f56;
}
.cp-hi-lines { display: flex; flex-direction: column; gap: 9px; }
.cp-hi-line { height: 8px; border-radius: 4px; background: linear-gradient(90deg, #ffd23f, #6366f1); opacity: 0.85; }
.cp-hi-tag {
  position: absolute;
  width: 46px; height: 46px; border-radius: 12px;
  background: #1a2036; color: #ffd23f;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.25);
}
.cp-hi-tag-1 { top: -6px; right: 4%; transform: rotate(-6deg); }
.cp-hi-tag-2 { bottom: 6%; left: -4%; transform: rotate(6deg); background: #fff; color: #ff6b35; }

/* ── Why choose strip ────────────────────────────────── */
.cp-why-strip { background: #fdfaf5; border-bottom: 1px solid #f0ece2; }
.cp-why-inner {
  max-width: 1160px; margin: 0 auto;
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 28px;
  padding: 32px 24px;
}
.cp-why-item { display: flex; align-items: flex-start; gap: 12px; }
.cp-why-icon {
  width: 42px; height: 42px; flex-shrink: 0; border-radius: 12px;
  background: linear-gradient(135deg, #ff8a4c, #ff5722);
  color: #fff; display: flex; align-items: center; justify-content: center;
}
.cp-why-item h4 { font-size: 14.5px; font-weight: 700; margin: 0 0 4px; color: #1a2036; }
.cp-why-item p { font-size: 12.5px; color: #6b7280; line-height: 1.5; margin: 0; }

/* ── Body / sections ─────────────────────────────────── */
.cp-body { max-width: 980px; margin: 0 auto; padding: 52px 24px 90px; }
.cp-section { margin-bottom: 56px; }
.cp-center { text-align: center; }

.cp-section-eyebrow {
  display: block;
  font-size: 12px; font-weight: 700; letter-spacing: 0.08em;
  text-transform: uppercase; color: #ff6b35; margin-bottom: 8px;
}
.cp-skills-section .cp-section-eyebrow { text-align: center; }

.cp-section-title { font-size: 1.5rem; font-weight: 800; color: #1a2036; margin: 0 0 24px; letter-spacing: -0.01em; }

.cp-about-text { color: #4b5468; line-height: 1.75; font-size: 15.5px; }

/* ── Skills grid ─────────────────────────────────────── */
.cp-skills-grid {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
  gap: 16px;
}
.cp-skill-card {
  background: #fff; border: 1px solid #eef0f5; border-radius: 16px;
  padding: 20px 18px; transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
}
.cp-skill-card:hover { transform: translateY(-4px); box-shadow: 0 14px 30px rgba(0,0,0,0.08); border-color: #ffd8b8; }
.cp-skill-icon {
  width: 52px; height: 52px; border-radius: 14px;
  background: #f7f8fb; display: flex; align-items: center; justify-content: center;
  margin-bottom: 14px;
}
.cp-skill-card h4 { font-size: 15px; font-weight: 700; color: #1a2036; margin: 0 0 6px; }
.cp-skill-card p { font-size: 12.5px; color: #6b7280; line-height: 1.5; margin: 0; }

/* ── Prereqs ─────────────────────────────────────────── */
.cp-check-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px; }
.cp-check-list li {
  display: flex; align-items: center; gap: 12px;
  color: #374151; font-size: 14.5px; font-weight: 500;
  background: #fff; border: 1px solid #eef0f5;
  padding: 13px 16px; border-radius: 12px;
}
.cp-check-list li svg { color: #22c55e; flex-shrink: 0; }

/* ── Roadmap ─────────────────────────────────────────── */
.cp-roadmap { display: flex; flex-direction: column; }
.cp-roadmap-step { display: flex; gap: 16px; position: relative; padding-bottom: 28px; }
.cp-roadmap-step:not(:last-child)::before {
  content: ''; position: absolute; left: 17px; top: 38px; bottom: 0; width: 2px;
  background: linear-gradient(180deg, #ffd8b8, transparent);
}
.cp-roadmap-marker {
  width: 36px; height: 36px; border-radius: 50%;
  background: linear-gradient(135deg, #ff8a4c, #ff5722);
  color: #fff; font-weight: 800; font-size: 14px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  box-shadow: 0 6px 16px rgba(255, 107, 53, 0.28);
}
.cp-roadmap-content { background: #fff; border: 1px solid #eef0f5; border-radius: 14px; padding: 16px 18px; flex: 1; }
.cp-roadmap-phase { color: #ff6b35; font-size: 11.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; }
.cp-roadmap-title { color: #1a2036; font-size: 16px; font-weight: 700; margin: 5px 0 12px; }
.cp-roadmap-topics { display: flex; flex-wrap: wrap; gap: 7px; }
.cp-topic-chip { background: #f7f8fb; color: #4b5468; font-size: 11.5px; font-weight: 500; padding: 5px 11px; border-radius: 999px; }

/* ── Videos ──────────────────────────────────────────── */
.cp-video-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); gap: 18px; }
.cp-video-card { background: #fff; border-radius: 16px; overflow: hidden; border: 1px solid #eef0f5; transition: transform 0.18s ease, box-shadow 0.18s ease; }
.cp-video-card:hover { transform: translateY(-4px); box-shadow: 0 14px 30px rgba(0,0,0,0.08); }
.cp-video-thumb {
  height: 128px;
  background: linear-gradient(135deg, #fff0e6, #ffe0cc);
  display: flex; align-items: center; justify-content: center;
}
.cp-video-play { color: #ff6b35; display: flex; }
.cp-video-soon { color: #9aa0b4; font-size: 12px; font-weight: 600; background: #fff; padding: 6px 12px; border-radius: 999px; }
.cp-video-info { padding: 14px 16px; }
.cp-video-title { font-size: 13.5px; font-weight: 600; color: #1a2036; margin: 0 0 5px; }
.cp-video-duration { font-size: 11.5px; color: #9aa0b4; font-weight: 500; }

/* ── Mentor ──────────────────────────────────────────── */
.cp-mentor-card {
  display: flex; gap: 20px;
  background: #fff; border: 1px solid #eef0f5; border-radius: 18px; padding: 26px;
}
.cp-mentor-avatar {
  width: 68px; height: 68px; border-radius: 50%;
  background: linear-gradient(135deg, #ff8a4c, #ff5722);
  color: #fff; display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  box-shadow: 0 8px 20px rgba(255, 107, 53, 0.25);
}
.cp-mentor-info h3 { margin: 0 0 4px; color: #1a2036; font-size: 17px; font-weight: 700; }
.cp-mentor-role { color: #ff6b35; font-size: 13px; font-weight: 600; margin: 0 0 8px; }
.cp-mentor-bio { color: #4b5468; font-size: 13.5px; line-height: 1.65; margin: 0 0 12px; }
.cp-mentor-email { color: #6366f1; font-size: 13px; font-weight: 600; display: inline-flex; align-items: center; gap: 6px; text-decoration: none; }
.cp-mentor-email:hover { text-decoration: underline; }

/* ── Materials ───────────────────────────────────────── */
.cp-materials-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 14px; }
.cp-material-card {
  display: flex; align-items: center; gap: 12px;
  background: #fff; border: 1px solid #eef0f5; border-radius: 12px; padding: 14px 16px; color: #374151;
}
.cp-material-card svg { color: #ff6b35; flex-shrink: 0; }
.cp-material-title { flex: 1; font-size: 13.5px; font-weight: 600; }
.cp-material-btn {
  font-size: 11.5px; font-weight: 700;
  background: linear-gradient(135deg, #ffd23f, #ff9d1f);
  color: #1a2036; padding: 6px 12px; border-radius: 8px; text-decoration: none; flex-shrink: 0;
}
.cp-material-btn-disabled { background: #f1f2f6; color: #9aa0b4; }

/* ── Testimonials ────────────────────────────────────── */
.cp-testimonial-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 18px; }
.cp-testimonial-card {
  position: relative; background: #fff; border: 1px solid #eef0f5; border-radius: 16px; padding: 22px 20px 20px;
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}
.cp-testimonial-card:hover { transform: translateY(-3px); box-shadow: 0 14px 30px rgba(0,0,0,0.08); }
.cp-testimonial-card::before {
  content: '\201C'; position: absolute; top: 6px; right: 16px; font-size: 48px; font-weight: 800;
  color: #fbe3d3; line-height: 1; font-family: Georgia, serif;
}
.cp-stars { display: flex; gap: 2px; margin-bottom: 12px; }
.cp-testimonial-quote { color: #4b5468; font-size: 13.5px; line-height: 1.65; margin: 0 0 14px; }
.cp-testimonial-name { color: #1a2036; font-size: 13.5px; font-weight: 700; margin: 0; }
.cp-testimonial-batch { color: #9aa0b4; font-size: 12px; margin: 2px 0 0; }

/* ── Partners ────────────────────────────────────────── */
.cp-partners-section { text-align: center; }
.cp-partners-row { display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; }
.cp-partner-chip {
  display: flex; align-items: center; gap: 9px;
  background: #fff; border: 1px solid #eef0f5; color: #374151;
  padding: 11px 18px; border-radius: 12px; font-size: 13px; font-weight: 600;
  transition: transform 0.15s ease, border-color 0.15s ease;
}
.cp-partner-chip:hover { transform: translateY(-2px); border-color: #ffd8b8; }
.cp-partner-chip svg { color: #ff6b35; }

/* ── Bottom CTA ──────────────────────────────────────── */
.cp-bottom-cta {
  display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 18px;
  background: linear-gradient(120deg, #ff8a4c, #ff5722);
  border-radius: 18px; padding: 24px 28px; margin-top: 44px;
}
.cp-bottom-cta .cp-price-new { color: #fff; }
.cp-bottom-cta .cp-price-old { color: rgba(255,255,255,0.7); }

.cp-notfound {
  min-height: 60vh; display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 14px; text-align: center; padding: 24px;
}
.cp-notfound h2 { font-weight: 800; font-size: 1.5rem; color: #1a2036; }

@media (max-width: 900px) {
  .cp-hero-inner { grid-template-columns: 1fr; }
  .cp-hero-right { order: -1; max-width: 260px; margin: 0 auto 8px; }
  .cp-why-inner { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 560px) {
  .cp-hero { padding: 92px 18px 32px; }
  .cp-hero-price-row { flex-direction: column; align-items: flex-start; gap: 12px; }
  .cp-hero-price-row .cp-btn { width: 100%; justify-content: center; }
  .cp-why-inner { grid-template-columns: 1fr; padding: 24px 18px; }
  .cp-body { padding: 40px 18px 70px; }
  .cp-mentor-card { flex-direction: column; text-align: center; align-items: center; }
  .cp-bottom-cta { flex-direction: column; text-align: center; }
}
CSSEOF

echo "[7/8] Patching CourseDetail.jsx (export COURSE_DETAILS) and Courses.jsx (export EnrollModal, same-tab navigation on card click) ..."
python3 << 'PYEOF1'
# --- CourseDetail.jsx ---
path = "frontend/src/components/Sections/CourseDetail.jsx"
with open(path) as f:
    content = f.read()
if "export const COURSE_DETAILS" not in content:
    old = "const COURSE_DETAILS = {"
    new = "export const COURSE_DETAILS = {"
    if old in content:
        content = content.replace(old, new, 1)
        with open(path, "w") as f:
            f.write(content)
        print("   Exported COURSE_DETAILS.")
    else:
        print("   WARNING: could not find COURSE_DETAILS -- export it manually.")
else:
    print("   COURSE_DETAILS already exported -- skipping.")

# --- Courses.jsx ---
path = "frontend/src/components/Sections/Courses.jsx"
with open(path) as f:
    content = f.read()

changed = False

old_export = "const EnrollModal = ({ course, onClose }) => {"
new_export = "export const EnrollModal = ({ course, onClose }) => {"
if new_export in content:
    print("   EnrollModal already exported -- skipping.")
elif old_export in content:
    content = content.replace(old_export, new_export, 1)
    changed = True
    print("   Exported EnrollModal.")
else:
    print("   WARNING: could not find EnrollModal -- export it manually.")

import_marker = 'import { Icon } from "@iconify/react";'
slugify_import = 'import { slugify } from "../../data/courseExtras";'
if slugify_import in content:
    print("   slugify import already present -- skipping.")
elif import_marker in content:
    content = content.replace(import_marker, import_marker + "\n" + slugify_import, 1)
    changed = True
    print("   Added slugify import.")
else:
    print("   WARNING: could not find Icon import -- add slugify import manually.")

new_click = "onClick={() => navigate(`/courses/${slugify(c.title)}`)}"
old_click_v1 = 'onClick={() => setDetailCourse(c)}'
old_click_v2 = "onClick={() => window.open(`/courses/${slugify(c.title)}`, '_blank', 'noopener,noreferrer')}"
if new_click in content:
    print("   Card click already uses same-tab navigation -- skipping.")
elif old_click_v2 in content:
    content = content.replace(old_click_v2, new_click, 1)
    changed = True
    print("   Card click switched from new-tab to same-tab navigation.")
elif old_click_v1 in content:
    content = content.replace(old_click_v1, new_click, 1)
    changed = True
    print("   Card click now navigates to the course page (same tab).")
else:
    print("   WARNING: could not find the card onClick handler -- update it manually.")

if changed:
    with open(path, "w") as f:
        f.write(content)
PYEOF1

echo "[8/8] Patching App.jsx (import CoursePage, add route) ..."
python3 << 'PYEOF2'
path = "frontend/src/App.jsx"
with open(path) as f:
    content = f.read()

changed = False
import_marker = "import Admin from './components/Admin/Admin';"
course_import = "import CoursePage from './pages/CoursePage';"
if course_import in content:
    print("   CoursePage import already present -- skipping.")
elif import_marker in content:
    content = content.replace(import_marker, import_marker + "\n" + course_import, 1)
    changed = True
    print("   Added CoursePage import.")
else:
    print("   WARNING: could not find Admin import -- add CoursePage import manually.")

route_marker = '      {/* About Us - standalone page without footer */}'
new_route = '      {/* Course detail page */}\n      <Route path="/courses/:slug" element={<CoursePage />} />\n\n'
if '/courses/:slug' in content:
    print("   Route already present -- skipping.")
elif route_marker in content:
    content = content.replace(route_marker, new_route + route_marker, 1)
    changed = True
    print("   Added /courses/:slug route.")
else:
    print("   WARNING: could not find route insertion point -- add route manually.")

if changed:
    with open(path, "w") as f:
        f.write(content)
PYEOF2

echo ""
echo "Done. Next steps:"
echo "   cd frontend && npm install lucide-react"
echo "   npm start"
echo "   Click a course card -- it should navigate to the course page in the SAME tab,"
echo "   with the light orange-hero design matching your reference."
echo ""
echo "To deploy:"
echo "   git add ."
echo "   git commit -m \"feat: redesign course page (light theme, same-tab nav), revert homepage navbar/hero\""
echo "   git push origin main"
