const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (m) => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#039;"
}[m]));

async function loadFallback() {
  const res = await fetch("site-data.json");
  if (!res.ok) throw new Error("Could not load site data");
  return res.json();
}

async function loadLive() {
  const { initializeApp } = await import("https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js");
  const { getFirestore, doc, getDoc } = await import("https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js");
  const app = initializeApp({
    apiKey: "AIzaSyAqnk0d0aFItz03me45sdp-0x_L4MJLa6Y",
    authDomain: "dominatorsfcbd.firebaseapp.com",
    projectId: "dominatorsfcbd",
    storageBucket: "dominatorsfcbd.firebasestorage.app",
    messagingSenderId: "556800750148",
    appId: "1:556800750148:web:61d909a48e66670af60211",
    measurementId: "G-WGW655RPRY"
  });
  const snap = await Promise.race([
    getDoc(doc(getFirestore(app), "siteContent", "main")),
    new Promise((_, reject) => setTimeout(() => reject(new Error("Firestore timeout")), 4000))
  ]);
  return snap.exists() ? snap.data() : null;
}

function cardHtml(c) {
  return '<article class="person"><img src="' + esc(c.image) + '" alt="' + esc(c.alt || c.name) + '" loading="lazy"><div class="pad"><span class="badge">' + esc(c.badge || "") + '</span><h3>' + esc(c.name || "") + '</h3><p class="muted">' + esc(c.title || "") + '</p></div></article>';
}

function applySite(data) {
  if (!data) return;
  const site = data.site || {};
  const hero = data.hero || {};
  document.querySelectorAll("[data-club]").forEach((el) => { el.textContent = site.clubName || "DOMINATORS FC"; });
  document.querySelectorAll("[data-tagline]").forEach((el) => { el.textContent = hero.tagline || site.tagline || ""; });
  document.querySelectorAll("[data-badge]").forEach((el) => { el.textContent = hero.badge || "Official Football Club"; });
  document.querySelectorAll("[data-logo]").forEach((img) => { img.src = site.logo || "images/logo.jpg"; });
  document.querySelectorAll("[data-year]").forEach((el) => { el.textContent = site.footerYear || "2026"; });
  const fb = document.querySelector("[data-facebook]");
  const ig = document.querySelector("[data-instagram]");
  if (fb) fb.href = site.facebook || "#";
  if (ig) ig.href = site.instagram || "#";
  const dev = document.querySelector("[data-developer]");
  if (dev) {
    dev.href = site.developer || "#";
    dev.textContent = site.developerText || "Developed By Shadman";
  }
  const sections = data.sections || {};
  document.querySelectorAll("[data-cards]").forEach((box) => {
    const cards = (sections[box.dataset.cards] && sections[box.dataset.cards].cards) || [];
    box.innerHTML = cards.map(cardHtml).join("");
  });
  document.querySelectorAll("[data-copy]").forEach((el) => {
    const parts = el.dataset.copy.split(".");
    const value = sections[parts[0]] && sections[parts[0]][parts[1]];
    if (value) el.textContent = value;
  });
  document.querySelectorAll("[data-squads]").forEach((box) => {
    const teams = (sections["permanent-teams"] && sections["permanent-teams"].teams) || [];
    const logo = site.logo || "images/logo.jpg";
    box.innerHTML = teams.map((t) => '<section class="squad-box"><header><img src="' + esc(logo) + '" alt=""><h3>' + esc(t.name) + '</h3></header><ol>' + (t.players || []).map((p) => "<li>" + esc(p) + "</li>").join("") + '</ol></section>').join("");
  });
  document.querySelectorAll("[data-gallery]").forEach((box) => {
    const images = [].concat((sections.gallery && sections.gallery.images) || [], Array.from({length: 13}, (_, i) => ({
      src: "images/match-" + String(i + 1).padStart(2, "0") + ".jpg",
      alt: "Match photo " + (i + 1)
    })));
    const seen = new Set();
    box.innerHTML = images.filter((img) => img.src && !seen.has(img.src) && seen.add(img.src)).map((img, n) => '<button type="button" class="tile" data-full="' + esc(img.src) + '" aria-label="Open photo ' + (n + 1) + '"><img src="' + esc(img.src) + '" alt="' + esc(img.alt || "Gallery") + '" loading="lazy"></button>').join("");
  });
}

function setupNav() {
  const btn = document.querySelector(".menu-btn");
  const links = document.querySelector(".nav-links");
  if (!btn || !links) return;
  btn.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    btn.setAttribute("aria-expanded", open ? "true" : "false");
  });
  links.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => links.classList.remove("open")));
}

function setupLightbox() {
  const box = document.querySelector(".lightbox");
  if (!box) return;
  const img = box.querySelector("img");
  document.addEventListener("click", (e) => {
    const tile = e.target.closest("[data-full]");
    if (!tile) return;
    img.src = tile.dataset.full;
    img.alt = (tile.querySelector("img") || {}).alt || "Gallery photo";
    box.classList.add("open");
  });
  box.addEventListener("click", (e) => {
    if (e.target === box || e.target.closest("button")) box.classList.remove("open");
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  setupNav();
  setupLightbox();
  try { applySite(await loadFallback()); } catch (err) { console.error(err); }
  try {
    const live = await loadLive();
    if (live) applySite(live);
  } catch (err) { console.error(err); }
});
