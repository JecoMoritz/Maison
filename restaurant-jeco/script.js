// Filter menu berdasarkan kategori
const filterButtons = document.querySelectorAll('.filter-btn');
const menuCards = document.querySelectorAll('.menu-card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        const filter = button.dataset.filter;

        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        menuCards.forEach(card => {
            const category = card.dataset.category;
            card.style.display = filter === 'all' || category === filter ? '' : 'none';
        });
    });
});

// Modal video pada bagian Gallery
const videoModal = document.getElementById('videoModal');
const playVideo = document.getElementById('playVideo');
const closeModal = document.getElementById('closeModal');

function openVideo() {
    videoModal.classList.add('show');
    videoModal.setAttribute('aria-hidden', 'false');
}

function closeVideo() {
    videoModal.classList.remove('show');
    videoModal.setAttribute('aria-hidden', 'true');
    const video = videoModal.querySelector('video');
    video.pause();
    video.currentTime = 0;
}

playVideo.addEventListener('click', openVideo);
closeModal.addEventListener('click', closeVideo);

videoModal.addEventListener('click', event => {
    if (event.target === videoModal) {
        closeVideo();
    }
});

// Form reservasi sederhana
const reservationForm = document.getElementById('reservationForm');
const formMessage = document.getElementById('formMessage');

reservationForm.addEventListener('submit', event => {
    event.preventDefault();

    const name = document.getElementById('name').value.trim();
    const date = document.getElementById('date').value;
    const guests = document.getElementById('guests').value;

    if (!name || !date || !guests) {
        formMessage.textContent = 'Lengkapi data reservasi terlebih dahulu.';
        return;
    }

    formMessage.textContent = `Reservasi untuk ${name}, ${guests} orang pada ${date} berhasil dicatat (demo).`;
    reservationForm.reset();
});
