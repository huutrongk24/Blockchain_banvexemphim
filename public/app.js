const movies = [
  {
    id: "qheist",
    title: "The Quantum Heist",
    duration: 120,
    rating: "C18",
    genre: "Hành động",
    country: "US",
    year: 2025,
    state: "now",
    poster:
      "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?auto=format&fit=crop&w=400&q=60",
    trailer: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    cast: "Chris Lee, Maya Tran",
    director: "A. Russo",
    lang: "Tiếng Anh - Phụ đề",
    desc: "Đội siêu trộm xuyên đa vũ trụ đột nhập ngân hàng lượng tử.",
    showtimes: [
      { cinema: "Galaxy Nguyễn Du", room: "Screen 1", date: "2025-12-15", times: ["10:00", "14:30", "20:15"] },
      { cinema: "BHD Bitexco", room: "IMAX", date: "2025-12-16", times: ["18:00", "21:00"] }
    ]
  },
  {
    id: "deepsea",
    title: "Deep Sea Echoes",
    duration: 110,
    rating: "C13",
    genre: "Kinh dị",
    country: "US",
    year: 2024,
    state: "now",
    poster:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=400&q=60",
    trailer: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    cast: "Nora Hsu, Daniel Kim",
    director: "S. Villeneuve",
    lang: "Tiếng Anh",
    desc: "Con tàu thám hiểm gặp sinh vật lạ dưới đáy đại dương.",
    showtimes: [
      { cinema: "CGV Landmark", room: "4DX", date: "2025-12-14", times: ["09:30", "13:00", "19:45"] }
    ]
  },
  {
    id: "lovelane",
    title: "Love in Neon Lane",
    duration: 98,
    rating: "P",
    genre: "Tình cảm",
    country: "VN",
    year: 2025,
    state: "soon",
    poster:
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=400&q=60",
    trailer: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    cast: "Khánh Linh, Đức Minh",
    director: "Phạm Hoàng",
    lang: "Tiếng Việt",
    desc: "Chuyện tình ở phố đèn neon Sài Gòn.",
    showtimes: []
  }
];

let selectedMovie = movies[0];
let selectedShowtime = null;
let selectedSeats = [];

const seatLayout = Array.from({ length: 72 }, (_, i) => ({
  code: `A${i + 1}`,
  vip: (i + 1) % 10 === 0,
  booked: i % 13 === 0
}));

const currency = (n) => n.toLocaleString("vi-VN") + " đ";

const views = document.querySelectorAll(".view");
const navButtons = document.querySelectorAll("[data-view]");

navButtons.forEach((btn) => {
  btn.addEventListener("click", () => switchView(btn.dataset.view));
});

function switchView(viewId) {
  views.forEach((v) => v.classList.remove("active"));
  const target = document.getElementById(viewId);
  if (target) target.classList.add("active");

  if (viewId === "movies") renderMovies();
  if (viewId === "movie-detail") renderDetail(selectedMovie);
  if (viewId === "showtime") renderShowtimes();
  if (viewId === "seats") renderSeats();
  if (viewId === "payment") renderPayment();
  if (viewId === "ticket") renderTicket();
  if (viewId === "history") renderHistory();
  if (viewId === "profile") renderProfile();
  if (viewId === "home") renderHome();
  if (viewId === "admin") renderAdmin("movies");
}

function renderHome() {
  fillGrid("now-playing", movies.filter((m) => m.state === "now"));
  fillGrid("coming-soon", movies.filter((m) => m.state === "soon"));
}

function fillGrid(containerId, list) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";
  list.forEach((m) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img class="poster" src="${m.poster}" alt="${m.title}">
      <div>
        <strong>${m.title}</strong>
        <p class="muted">${m.duration} phút • ${m.rating}</p>
      </div>
      <div class="chip-row">
        <span class="chip">${m.genre}</span>
        <span class="chip">${m.country}</span>
      </div>
      <div class="chip-row">
        <button class="secondary small" data-action="detail">Chi tiết</button>
        <button class="primary small" data-action="book">Đặt vé</button>
      </div>
    `;
    card.querySelector('[data-action="detail"]').onclick = () => {
      selectedMovie = m;
      switchView("movie-detail");
    };
    card.querySelector('[data-action="book"]').onclick = () => {
      selectedMovie = m;
      switchView("showtime");
    };
    container.appendChild(card);
  });
}

function renderMovies() {
  const genre = document.getElementById("filter-genre").value;
  const country = document.getElementById("filter-country").value;
  const year = document.getElementById("filter-year").value;
  const state = document.getElementById("filter-state").value;

  let list = [...movies];
  if (genre) list = list.filter((m) => m.genre === genre);
  if (country) list = list.filter((m) => m.country === country);
  if (year) list = list.filter((m) => String(m.year) === year);
  if (state) list = list.filter((m) => m.state === state);

  fillGrid("movie-list", list);
}

function renderDetail(movie) {
  document.getElementById("detail-title").textContent = movie.title;
  document.getElementById("detail-trailer").src = movie.trailer;
  document.getElementById("detail-poster").src = movie.poster;
  document.getElementById("detail-duration").textContent = `${movie.duration} phút`;
  document.getElementById("detail-rating").textContent = movie.rating;
  document.getElementById("detail-cast").textContent = movie.cast;
  document.getElementById("detail-director").textContent = movie.director;
  document.getElementById("detail-genre").textContent = movie.genre;
  document.getElementById("detail-lang").textContent = movie.lang;
  document.getElementById("detail-desc").textContent = movie.desc;

  const grid = document.getElementById("detail-showtimes");
  grid.innerHTML = "";
  movie.showtimes.forEach((s) => {
    const card = document.createElement("div");
    card.className = "showtime-card";
    card.innerHTML = `
      <strong>${s.cinema}</strong>
      <p class="muted">${s.room} • ${s.date}</p>
      <div class="chip-row">${s.times
        .map((t) => `<button class="chip" data-time="${t}">${t}</button>`)
        .join("")}</div>
    `;
    card.querySelectorAll(".chip").forEach((chip) => {
      chip.onclick = () => {
        selectedShowtime = { ...s, time: chip.dataset.time, movieTitle: movie.title };
        switchView("seats");
      };
    });
    grid.appendChild(card);
  });
}

function renderShowtimes() {
  const list = document.getElementById("cinema-list");
  list.innerHTML = "";
  selectedMovie.showtimes.forEach((s) => {
    const card = document.createElement("div");
    card.className = "showtime-card";
    card.innerHTML = `
      <strong>${selectedMovie.title}</strong>
      <p class="muted">${s.cinema} • ${s.room}</p>
      <p class="muted">${s.date}</p>
      <div class="chip-row">${s.times
        .map((t) => `<button class="chip" data-time="${t}">${t}</button>`)
        .join("")}</div>
    `;
    card.querySelectorAll(".chip").forEach((chip) => {
      chip.onclick = () => {
        selectedShowtime = { ...s, time: chip.dataset.time, movieTitle: selectedMovie.title };
        switchView("seats");
      };
    });
    list.appendChild(card);
  });
}

function renderSeats() {
  const map = document.getElementById("seat-map");
  map.innerHTML = "";
  selectedSeats = [];
  seatLayout.forEach((seat) => {
    const el = document.createElement("div");
    el.className = "seat";
    if (seat.vip) el.classList.add("vip");
    if (seat.booked) el.classList.add("booked");
    el.title = seat.code;
    el.onclick = () => {
      if (seat.booked) return;
      el.classList.toggle("selected");
      if (selectedSeats.includes(seat.code)) {
        selectedSeats = selectedSeats.filter((c) => c !== seat.code);
      } else {
        selectedSeats.push(seat.code);
      }
      updateSummary();
    };
    map.appendChild(el);
  });
  updateSummary();
}

function updateSummary() {
  const price = selectedSeats.reduce((sum, code) => {
    const isVip = code.endsWith("0");
    return sum + (isVip ? 120000 : 90000);
  }, 0);
  document.getElementById("summary-movie").textContent = selectedMovie.title;
  document.getElementById("summary-theater").textContent = selectedShowtime
    ? `${selectedShowtime.cinema} - ${selectedShowtime.room}`
    : "-";
  document.getElementById("summary-time").textContent = selectedShowtime
    ? `${selectedShowtime.date} ${selectedShowtime.time}`
    : "-";
  document.getElementById("summary-seats").textContent = selectedSeats.join(", ") || "-";
  document.getElementById("summary-total").textContent = currency(price);
}

function renderPayment() {
  const price = selectedSeats.length * 90000;
  document.getElementById("pay-movie").textContent = selectedMovie.title;
  document.getElementById("pay-theater").textContent = selectedShowtime
    ? `${selectedShowtime.cinema} - ${selectedShowtime.room}`
    : "-";
  document.getElementById("pay-time").textContent = selectedShowtime
    ? `${selectedShowtime.date} ${selectedShowtime.time}`
    : "-";
  document.getElementById("pay-seats").textContent = selectedSeats.join(", ");
  document.getElementById("pay-total").textContent = currency(price);
}

function renderTicket() {
  document.getElementById("ticket-movie").textContent = selectedMovie.title;
  document.getElementById("ticket-theater").textContent = selectedShowtime
    ? `${selectedShowtime.cinema} - ${selectedShowtime.room}`
    : "-";
  document.getElementById("ticket-time").textContent = selectedShowtime
    ? `${selectedShowtime.date} ${selectedShowtime.time}`
    : "-";
  document.getElementById("ticket-seats").textContent = selectedSeats.join(", ");
}

function renderHistory() {
  const list = document.getElementById("history-list");
  list.innerHTML = "";
  const items = [
    { movie: "The Quantum Heist", cinema: "Galaxy", time: "2025-12-01 19:00", seats: "A1,A2" },
    { movie: "Deep Sea Echoes", cinema: "CGV", time: "2025-11-20 21:00", seats: "B5,B6" }
  ];
  items.forEach((i) => {
    const row = document.createElement("div");
    row.className = "item";
    row.innerHTML = `
      <div>
        <strong>${i.movie}</strong>
        <p class="muted">${i.cinema} • ${i.time}</p>
        <p class="muted">Ghế: ${i.seats}</p>
      </div>
      <button class="secondary small">Xem vé</button>
    `;
    list.appendChild(row);
  });
}

function renderProfile() {
  const list = document.getElementById("profile-tickets");
  list.innerHTML = "";
  ["The Quantum Heist", "Deep Sea Echoes"].forEach((m) => {
    const item = document.createElement("div");
    item.className = "item";
    item.innerHTML = `
      <div>
        <strong>${m}</strong>
        <p class="muted">Galaxy Nguyễn Du • 20:00</p>
      </div>
      <button class="secondary small">Xem vé</button>
    `;
    list.appendChild(item);
  });
}

function renderAdmin(tab = "movies") {
  const content = document.getElementById("admin-content");
  content.innerHTML = "";
  document.querySelectorAll("[data-admin]").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.admin === tab);
    btn.onclick = () => renderAdmin(btn.dataset.admin);
  });

  if (tab === "movies") {
    movies.forEach((m) => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <strong>${m.title}</strong>
        <p class="muted">${m.genre} • ${m.duration} phút</p>
        <div class="chip-row">
          <button class="secondary small">Sửa</button>
          <button class="secondary small">Xóa</button>
        </div>
      `;
      content.appendChild(card);
    });
    const add = document.createElement("div");
    add.className = "card";
    add.innerHTML = `
      <strong>Thêm phim</strong>
      <p class="muted">Upload poster, trailer</p>
      <button class="primary small">+ Thêm mới</button>
    `;
    content.appendChild(add);
  }

  if (tab === "showtimes") {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <strong>Tạo suất chiếu</strong>
      <p class="muted">Chọn rạp, phòng, phim, ngày giờ</p>
      <button class="primary small">Tạo</button>
    `;
    content.appendChild(card);
  }

  if (tab === "rooms") {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <strong>Phòng chiếu</strong>
      <p class="muted">Số ghế, số hàng, ghế VIP</p>
      <button class="secondary small">Cấu hình</button>
    `;
    content.appendChild(card);
  }

  if (tab === "stats") {
    ["Vé đã bán", "Doanh thu", "Suất đông khách"].forEach((title) => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <strong>${title}</strong>
        <p class="muted">Demo số liệu</p>
        <h3>${Math.floor(Math.random() * 5000)}</h3>
      `;
      content.appendChild(card);
    });
  }
}

renderHome();
switchView("home");

