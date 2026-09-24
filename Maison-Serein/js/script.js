/* ==========================================================
   MAISON SEREIN - script.js
   Satu file dipakai semua halaman. Setiap fitur dicek dulu
   (if elemen ada) supaya tidak error di halaman lain.
   ========================================================== */

/* 1. NAVBAR MOBILE: tombol hamburger membuka/menutup menu */
const navToggle = document.getElementById("navToggle");
const mainNav = document.getElementById("mainNav");

if (navToggle && mainNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", isOpen);
  });
}

/* 2. FILTER MENU: tampilkan kartu sesuai data-category */
const filterButtons = document.querySelectorAll(".filter-btn");
const menuItems = document.querySelectorAll(".menu-item");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter; // "all", "appetizer", dst.

    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    menuItems.forEach((item) => {
      const show = filter === "all" || item.dataset.category === filter;
      item.hidden = !show; // atribut hidden menyembunyikan elemen
    });
  });
});

/* 3. LIGHTBOX GALLERY: klik gambar untuk memperbesar */
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxClose = document.getElementById("lightboxClose");

if (lightbox) {
  document.querySelectorAll(".gallery-item img").forEach((img) => {
    img.addEventListener("click", () => {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add("show");
      lightbox.setAttribute("aria-hidden", "false");
    });
  });

  const closeLightbox = () => {
    lightbox.classList.remove("show");
    lightbox.setAttribute("aria-hidden", "true");
  };
  lightboxClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
  });
}

/* 4. HELPER VALIDASI */
// Tampilkan pesan error di bawah field, dan tandai field dengan garis merah
function setError(id, message) {
  const input = document.getElementById(id);
  const error = document.getElementById(id + "Error");
  error.textContent = message;
  input.classList.toggle("invalid", message !== "");
  return message === ""; // true jika valid
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* 5. FORM CONTACT */
const contactForm = document.getElementById("contactForm");

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault(); // cegah halaman reload

    const name = document.getElementById("cName").value.trim();
    const email = document.getElementById("cEmail").value.trim();
    const message = document.getElementById("cMessage").value.trim();

    const results = [
      setError("cName", name.length < 2 ? "Nama minimal 2 karakter." : ""),
      setError(
        "cEmail",
        !emailPattern.test(email) ? "Masukkan email yang valid." : "",
      ),
      setError(
        "cMessage",
        message.length < 10 ? "Pesan minimal 10 karakter." : "",
      ),
    ];

    const success = document.getElementById("contactSuccess");
    if (results.every(Boolean)) {
      success.textContent = `Terima kasih, ${name}. Pesan Anda sudah terkirim.`;
      contactForm.reset();
    } else {
      success.textContent = "";
    }
  });
}

/* 6. FORM RESERVATION */
const reservationForm = document.getElementById("reservationForm");

if (reservationForm) {
  // Tanggal sebelum hari ini tidak bisa dipilih
  const dateInput = document.getElementById("rDate");
  const today = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  const todayText = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
  dateInput.min = todayText;

  reservationForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.getElementById("rName").value.trim();
    const email = document.getElementById("rEmail").value.trim();
    const phone = document.getElementById("rPhone").value.replace(/[\s-]/g, "");
    const date = dateInput.value;
    const time = document.getElementById("rTime").value;
    const guests = Number(document.getElementById("rGuests").value);

    // Cek tanggal: tidak boleh lampau, dan Senin restoran tutup
    let dateError = "";
    if (!date) dateError = "Pilih tanggal.";
    else if (date < todayText) dateError = "Tanggal tidak boleh sudah lewat.";
    else if (new Date(date + "T00:00").getDay() === 1)
      dateError = "Kami tutup hari Senin.";

    const results = [
      setError("rName", name.length < 2 ? "Nama minimal 2 karakter." : ""),
      setError(
        "rEmail",
        !emailPattern.test(email) ? "Masukkan email yang valid." : "",
      ),
      setError(
        "rPhone",
        !/^\+?\d{9,15}$/.test(phone) ? "Nomor telepon 9 sampai 15 angka." : "",
      ),
      setError("rDate", dateError),
      setError("rTime", time === "" ? "Pilih waktu." : ""),
      setError(
        "rGuests",
        !(guests >= 1 && guests <= 20) ? "Jumlah tamu 1 sampai 20." : "",
      ),
    ];

    const success = document.getElementById("reservationSuccess");
    if (results.every(Boolean)) {
      success.textContent = `Reservasi diterima. ${name}, kami tunggu ${guests} tamu pada ${date} pukul ${time}. Konfirmasi dikirim ke ${email}.`;
      reservationForm.reset();
    } else {
      success.textContent = "";
    }
  });
}

/* 7. GAMBAR GAGAL DIMUAT: ganti dengan kotak beige agar layout tidak rusak */
document.querySelectorAll("img").forEach((img) => {
  img.addEventListener(
    "error",
    () => {
      img.src =
        "data:image/svg+xml;utf8," +
        encodeURIComponent(
          '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><rect width="100%" height="100%" fill="#e9dfcd"/>' +
            '<text x="50%" y="50%" fill="#7a5a2c" font-family="Georgia" font-size="22" text-anchor="middle">Gambar tidak tersedia</text></svg>',
        );
    },
    { once: true },
  );
});
/* ===== VIDEO SLIDESHOW dari foto gallery ===== */
(function () {
  const images = [
    {
      src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1400&q=80",
      alt: "Ruang makan utama",
      caption: "Main dining room",
    },
    {
      src: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1400&q=80",
      alt: "Steak au poivre",
      caption: "Steak au poivre",
    },
    {
      src: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1400&q=80",
      alt: "Sudut ruang makan",
      caption: "Corner dining room",
    },
    {
      src: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=1400&q=80",
      alt: "Truffle risotto",
      caption: "Truffle risotto",
    },
    {
      src: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1400&q=80",
      alt: "Meja untuk berdua",
      caption: "Workspace",
    },
    {
      src: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=1400&q=80",
      alt: "Tiramisu",
      caption: "Tiramisu",
    },
    {
      src: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1400&q=80",
      alt: "Hidangan utama",
      caption: "Main Course",
    },
    {
      src: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=1400&q=80",
      alt: "Salmon lemon butter",
      caption: "Salmon lemon butter",
    },
    {
      src: "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1400&q=80",
      alt: "Suasana malam hari",
      caption: "Evening ambiance",
    },
  ];

  const stage = document.getElementById("videoStage");
  if (!stage) return;
  const audio_SRC =
    "Maison-Serein\\audio\\HoliznaCC0 - Calm Currents ( Lofi , Relax , Calm ).mp3";

  const player = document.getElementById("videoPlayer");
  const playBtn = document.getElementById("vPlayPause");
  const progress = document.getElementById("vProgress");
  const fill = document.getElementById("vProgressFill");
  const timeEl = document.getElementById("vTime");
  const fsBtn = document.getElementById("vFullscreen");
  // ⭐ AUDIO: buat elemen audio + tombol mute
  const audio = new Audio(audio_SRC);
  audio.loop = true; // ulang otomatis
  audio.volume = 0.6; // 0.0 s/d 1.0
  audio.muted = true; // WAJIB: browser blokir autoplay bersuara
  audio.preload = "auto";

  const muteBtn = document.getElementById("vMute");
  muteBtn.classList.add("muted"); // mulai dalam kondisi mute

  const SLIDE_MS = 5000;
  const TOTAL_MS = images.length * SLIDE_MS;

  images.forEach((img, i) => {
    const slide = document.createElement("div");
    slide.className = "v-slide";

    const el = document.createElement("img");
    el.src = img.src;
    el.alt = img.alt;
    el.loading = i === 0 ? "eager" : "lazy";
    el.decoding = "async";

    const cap = document.createElement("span");
    cap.className = "v-caption";
    cap.textContent = img.caption;

    slide.append(el, cap);
    stage.appendChild(slide);
  });

  const slides = stage.querySelectorAll(".v-slide");
  let current = 0,
    playing = false,
    rafId = null,
    startTime = 0,
    elapsed = 0;

  const fmt = (ms) => {
    const s = Math.max(0, Math.floor(ms / 1000));
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  };

  function showSlide(i) {
    slides.forEach((s, k) => s.classList.toggle("active", k === i));
  }

  function updateHUD() {
    fill.style.width = (elapsed / TOTAL_MS) * 100 + "%";
    timeEl.textContent = `${fmt(elapsed)} / ${fmt(TOTAL_MS)}`;
  }

  function tick(now) {
    elapsed = now - startTime;
    if (elapsed >= TOTAL_MS) {
      elapsed = 0;
      startTime = now;
      current = 0;
      showSlide(0);
    } else {
      const idx = Math.floor(elapsed / SLIDE_MS);
      if (idx !== current) {
        current = idx;
        showSlide(current);
      }
    }
    updateHUD();
    rafId = requestAnimationFrame(tick);
  }

  function play() {
    if (playing) return;
    playing = true;
    playBtn.classList.add("playing");
    startTime = performance.now() - elapsed;
    audio.play().catch(() => {
      /* diabaikan kalau browser masih block */
    });
    rafId = requestAnimationFrame(tick);
  }

  function pause() {
    if (!playing) return;
    playing = false;
    playBtn.classList.remove("playing");
    audio.pause();
    cancelAnimationFrame(rafId);
  }

  playBtn.addEventListener("click", () => (playing ? pause() : play()));
  muteBtn.addEventListener("click", () => {
    audio.muted = !audio.muted;
    muteBtn.classList.toggle("muted", audio.muted);

    if (!audio.muted && playing) {
      audio.play().catch(() => {});
    }
  });
  progress.addEventListener("click", (e) => {
    const rect = progress.getBoundingClientRect();
    const pct = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    elapsed = pct * TOTAL_MS;
    startTime = performance.now() - elapsed;
    current = Math.min(images.length - 1, Math.floor(elapsed / SLIDE_MS));
    showSlide(current);
    updateHUD();
  });

  fsBtn.addEventListener("click", () => {
    if (!document.fullscreenElement) player.requestFullscreen?.();
    else document.exitFullscreen?.();
  });

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => (e.isIntersecting ? play() : pause()));
    },
    { threshold: 0.4 },
  );
  io.observe(player);

  showSlide(0);
  updateHUD();
})();
