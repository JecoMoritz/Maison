/* ==========================================================
   MAISON SEREIN - script.js
   Satu file dipakai semua halaman. Setiap fitur dicek dulu
   (if elemen ada) supaya tidak error di halaman lain.
   ========================================================== */

/* 1. NAVBAR MOBILE: tombol hamburger membuka/menutup menu */
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');

if (navToggle && mainNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen);
  });
}

/* 2. FILTER MENU: tampilkan kartu sesuai data-category */
const filterButtons = document.querySelectorAll('.filter-btn');
const menuItems = document.querySelectorAll('.menu-item');

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter; // "all", "appetizer", dst.

    filterButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    menuItems.forEach(item => {
      const show = filter === 'all' || item.dataset.category === filter;
      item.hidden = !show; // atribut hidden menyembunyikan elemen
    });
  });
});

/* 3. LIGHTBOX GALLERY: klik gambar untuk memperbesar */
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');

if (lightbox) {
  document.querySelectorAll('.gallery-item img').forEach(img => {
    img.addEventListener('click', () => {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add('show');
      lightbox.setAttribute('aria-hidden', 'false');
    });
  });

  const closeLightbox = () => {
    lightbox.classList.remove('show');
    lightbox.setAttribute('aria-hidden', 'true');
  };
  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
}

/* 4. HELPER VALIDASI */
// Tampilkan pesan error di bawah field, dan tandai field dengan garis merah
function setError(id, message) {
  const input = document.getElementById(id);
  const error = document.getElementById(id + 'Error');
  error.textContent = message;
  input.classList.toggle('invalid', message !== '');
  return message === ''; // true jika valid
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* 5. FORM CONTACT */
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', event => {
    event.preventDefault(); // cegah halaman reload

    const name = document.getElementById('cName').value.trim();
    const email = document.getElementById('cEmail').value.trim();
    const message = document.getElementById('cMessage').value.trim();

    const results = [
      setError('cName', name.length < 2 ? 'Nama minimal 2 karakter.' : ''),
      setError('cEmail', !emailPattern.test(email) ? 'Masukkan email yang valid.' : ''),
      setError('cMessage', message.length < 10 ? 'Pesan minimal 10 karakter.' : '')
    ];

    const success = document.getElementById('contactSuccess');
    if (results.every(Boolean)) {
      success.textContent = `Terima kasih, ${name}. Pesan Anda sudah terkirim.`;
      contactForm.reset();
    } else {
      success.textContent = '';
    }
  });
}

/* 6. FORM RESERVATION */
const reservationForm = document.getElementById('reservationForm');

if (reservationForm) {
  // Tanggal sebelum hari ini tidak bisa dipilih
  const dateInput = document.getElementById('rDate');
  const today = new Date();
  const pad = n => String(n).padStart(2, '0');
  const todayText = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
  dateInput.min = todayText;

  reservationForm.addEventListener('submit', event => {
    event.preventDefault();

    const name = document.getElementById('rName').value.trim();
    const email = document.getElementById('rEmail').value.trim();
    const phone = document.getElementById('rPhone').value.replace(/[\s-]/g, '');
    const date = dateInput.value;
    const time = document.getElementById('rTime').value;
    const guests = Number(document.getElementById('rGuests').value);

    // Cek tanggal: tidak boleh lampau, dan Senin restoran tutup
    let dateError = '';
    if (!date) dateError = 'Pilih tanggal.';
    else if (date < todayText) dateError = 'Tanggal tidak boleh sudah lewat.';
    else if (new Date(date + 'T00:00').getDay() === 1) dateError = 'Kami tutup hari Senin.';

    const results = [
      setError('rName', name.length < 2 ? 'Nama minimal 2 karakter.' : ''),
      setError('rEmail', !emailPattern.test(email) ? 'Masukkan email yang valid.' : ''),
      setError('rPhone', !/^\+?\d{9,15}$/.test(phone) ? 'Nomor telepon 9 sampai 15 angka.' : ''),
      setError('rDate', dateError),
      setError('rTime', time === '' ? 'Pilih waktu.' : ''),
      setError('rGuests', !(guests >= 1 && guests <= 20) ? 'Jumlah tamu 1 sampai 20.' : '')
    ];

    const success = document.getElementById('reservationSuccess');
    if (results.every(Boolean)) {
      success.textContent = `Reservasi diterima. ${name}, kami tunggu ${guests} tamu pada ${date} pukul ${time}. Konfirmasi dikirim ke ${email}.`;
      reservationForm.reset();
    } else {
      success.textContent = '';
    }
  });
}

/* 7. GAMBAR GAGAL DIMUAT: ganti dengan kotak beige agar layout tidak rusak */
document.querySelectorAll('img').forEach(img => {
  img.addEventListener('error', () => {
    img.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><rect width="100%" height="100%" fill="#e9dfcd"/>' +
      '<text x="50%" y="50%" fill="#7a5a2c" font-family="Georgia" font-size="22" text-anchor="middle">Gambar tidak tersedia</text></svg>');
  }, { once: true });
});
