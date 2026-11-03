"use strict";

// Personalisasi nama tamu melalui URL, contoh: ?to=Bapak%20Andi
const guestNameElement = document.getElementById("guestName");
const guestParams = new URLSearchParams(window.location.search);
const guestName = (guestParams.get("to") || "").trim();
if (guestNameElement && guestName) {
  guestNameElement.textContent = guestName;
}


const coverImage = document.getElementById("coverImage");
const pages = document.getElementById("pages");
const music = document.getElementById("weddingMusic");
const musicToggle = document.getElementById("musicToggle");
const musicLabel = document.getElementById("musicLabel");

// Waktu resepsi: Sabtu, 21 November 2026 pukul 11.00 WIB.
const targetDate = new Date("2026-11-21T11:00:00+07:00").getTime();

function openInvitation() {
  if (pages) pages.scrollIntoView({ behavior: "smooth" });
  playMusic();
}

if (coverImage) {
  coverImage.addEventListener("click", openInvitation);
  coverImage.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openInvitation();
    }
  });
}

async function playMusic() {
  if (!music) return;
  try {
    await music.play();
    musicToggle?.classList.add("is-playing");
    musicToggle?.setAttribute("aria-pressed", "true");
    musicToggle?.setAttribute("aria-label", "Jeda musik undangan");
    if (musicLabel) musicLabel.textContent = "Musik Aktif";
  } catch (error) {
    musicToggle?.classList.remove("is-playing");
    musicToggle?.setAttribute("aria-pressed", "false");
    if (musicLabel) musicLabel.textContent = "Putar Musik";
    console.warn("Musik belum dapat diputar. Periksa file lagu/music.mp3.", error);
  }
}

function pauseMusic() {
  if (!music) return;
  music.pause();
  musicToggle?.classList.remove("is-playing");
  musicToggle?.setAttribute("aria-pressed", "false");
  musicToggle?.setAttribute("aria-label", "Putar musik undangan");
  if (musicLabel) musicLabel.textContent = "Putar Musik";
}

if (musicToggle) {
  musicToggle.addEventListener("click", () => {
    if (music && music.paused) playMusic();
    else pauseMusic();
  });
}

const countdownInterval = window.setInterval(updateCountdown, 1000);

function updateCountdown() {
  const distance = targetDate - Date.now();
  const ids = ["days", "hours", "minutes", "seconds"];

  if (distance <= 0) {
    ids.forEach((id) => {
      const element = document.getElementById(id);
      if (element) element.textContent = "00";
    });
    const countdown = document.getElementById("weddingCountdown");
    if (countdown) countdown.setAttribute("aria-label", "Acara telah dimulai");
    window.clearInterval(countdownInterval);
    return;
  }

  const values = [
    Math.floor(distance / 86400000),
    Math.floor((distance % 86400000) / 3600000),
    Math.floor((distance % 3600000) / 60000),
    Math.floor((distance % 60000) / 1000)
  ];

  ids.forEach((id, index) => {
    const element = document.getElementById(id);
    if (element) element.textContent = String(values[index]).padStart(2, "0");
  });
}

updateCountdown();

const rsvpForm = document.getElementById("rsvpForm");
if (rsvpForm) {
  rsvpForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = document.getElementById("guestName")?.value.trim() || "";
    const attendance = document.querySelector('input[name="attendance"]:checked')?.value || "";
    const count = document.getElementById("guestCount")?.value || "1";
    const message = `Assalamu’alaikum. Saya ${name}, konfirmasi kehadiran untuk pernikahan Yoga & Afriyani pada 21 November 2026. Kehadiran: ${attendance}. Jumlah tamu: ${count}.`;
    window.open("https://wa.me/?text=" + encodeURIComponent(message), "_blank", "noopener,noreferrer");
  });
}


// Salin nomor rekening Bank Mandiri Afriyani dari tombol pada halaman Wedding Gift.
const copyAccountButton = document.getElementById("copyAccountButton");
const copyAccountStatus = document.getElementById("copyAccountStatus");
const accountNumber = "1080031967384";

async function copyAccountNumber() {
  let copied = false;
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(accountNumber);
      copied = true;
    }
  } catch (error) {
    console.warn("Clipboard API tidak tersedia, mencoba metode alternatif.", error);
  }

  // Fallback untuk halaman yang dibuka langsung melalui file:// atau browser lama.
  if (!copied) {
    const temporaryInput = document.createElement("textarea");
    temporaryInput.value = accountNumber;
    temporaryInput.setAttribute("readonly", "");
    temporaryInput.style.position = "fixed";
    temporaryInput.style.opacity = "0";
    temporaryInput.style.left = "-9999px";
    document.body.appendChild(temporaryInput);
    temporaryInput.select();
    temporaryInput.setSelectionRange(0, temporaryInput.value.length);
    try {
      copied = document.execCommand("copy");
    } catch (error) {
      copied = false;
    }
    temporaryInput.remove();
  }

  if (copyAccountStatus) {
    copyAccountStatus.textContent = copied
      ? "Nomor rekening berhasil disalin!"
      : "Belum berhasil menyalin. Silakan salin: " + accountNumber;
    copyAccountStatus.classList.add("is-visible");
    window.setTimeout(() => copyAccountStatus.classList.remove("is-visible"), 2800);
  }
  if (!copied) window.prompt("Salin nomor rekening berikut:", accountNumber);
}

if (copyAccountButton) {
  copyAccountButton.addEventListener("click", copyAccountNumber);
}


/* Efek muncul perlahan saat bagian undangan masuk ke layar */
(function setupGentleReveal() {
  const items = document.querySelectorAll(".pages > img, .event-image-wrap, .gift-image-wrap, .rsvp");
  if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    items.forEach((item) => item.classList.add("is-visible"));
    return;
  }
  items.forEach((item) => item.classList.add("reveal-on-scroll"));
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -35px 0px" });
  items.forEach((item) => observer.observe(item));
})();

/* Navigasi memakai durasi gulir yang sedikit lebih lambat dan halus. */
document.querySelectorAll(".bottom-nav a").forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;
    event.preventDefault();
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      target.scrollIntoView();
      return;
    }
    const start = window.scrollY;
    const end = start + target.getBoundingClientRect().top;
    const distance = end - start;
    const duration = 950;
    let startTime = null;
    function animateScroll(timestamp) {
      if (startTime === null) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      window.scrollTo(0, start + distance * eased);
      if (progress < 1) window.requestAnimationFrame(animateScroll);
    }
    window.requestAnimationFrame(animateScroll);
    history.replaceState(null, "", link.getAttribute("href"));
  });
});

/* Tandai menu yang sedang dibuka agar navigasi terasa lebih jelas. */
(function setupActiveNavigation() {
  const links = Array.from(document.querySelectorAll(".bottom-nav a"));
  const sections = links
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);
  if (!("IntersectionObserver" in window)) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((link) => {
        const active = link.getAttribute("href") === "#" + entry.target.id;
        if (active) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    });
  }, { rootMargin: "-25% 0px -55% 0px", threshold: 0 });
  sections.forEach((section) => observer.observe(section));
})();


// Salin nomor DANA Afriyani.
const copyDanaButton = document.getElementById("copyDanaButton");
const copyDanaStatus = document.getElementById("copyDanaStatus");
const danaNumber = "082260100513";
if (copyDanaButton) {
  copyDanaButton.addEventListener("click", async () => {
    let copied = false;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(danaNumber);
        copied = true;
      }
    } catch (error) { console.warn("Clipboard DANA gagal, mencoba metode alternatif.", error); }
    if (!copied) {
      const temporaryInput = document.createElement("textarea");
      temporaryInput.value = danaNumber; temporaryInput.setAttribute("readonly", "");
      temporaryInput.style.position = "fixed"; temporaryInput.style.opacity = "0"; temporaryInput.style.left = "-9999px";
      document.body.appendChild(temporaryInput); temporaryInput.select(); temporaryInput.setSelectionRange(0, temporaryInput.value.length);
      try { copied = document.execCommand("copy"); } catch (error) { copied = false; }
      temporaryInput.remove();
    }
    if (copyDanaStatus) copyDanaStatus.textContent = copied ? "Nomor DANA berhasil disalin!" : "Silakan salin nomor: " + danaNumber;
    if (!copied) window.prompt("Salin nomor DANA berikut:", danaNumber);
  });
}
