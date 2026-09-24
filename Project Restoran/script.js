const projects = [
  {
    title: "Muhammad Rojak",
    description: "Website restoran menggunakan HTML, CSS, dan JavaScript.",
    image: "assets/img/muhammad-rojak.svg",
    link: "index.html",
  },
  {
    title: "Tugas Hyperlink",
    description: "Latihan membuat link antar halaman menggunakan HTML.",
    image: "assets/img/muhammad-rojak.svg",
    link: "index.html",
  },
  {
    title: "Tugas Restoran",
    description:
      "Latihan menampilkan gambar, audio, dan video pada halaman web.",
    image: "assets/img/muhammad-rojak.svg",
    link: "index.html",
  },
];

const gallery = document.getElementById("gallery");

projects.forEach(function (project) {
  gallery.innerHTML += `
        <div class="card">
            <img src="${project.image}" alt="${project.title}">
            <h2>${project.title}</h2>
            <p>${project.description}</p>
            <a class="button" href="${project.link}">Lihat Project</a>
        </div>
    `;
});
