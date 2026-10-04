const cars = [
  {
    id: "volvo-xc60",
    make: "Volvo",
    model: "XC60",
    trim: "B5 Plus AWD",
    year: 2023,
    price: 38950,
    miles: 18420,
    body: "SUV",
    fuel: "Hybrid",
    transmission: "Automatic",
    category: "certified",
    badge: "Just arrived",
    image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=850&q=80",
    alt: "Silver Volvo SUV parked outdoors",
  },
  {
    id: "bmw-330i",
    make: "BMW",
    model: "3 Series",
    trim: "330i xDrive",
    year: 2022,
    price: 32900,
    miles: 24650,
    body: "Sedan",
    fuel: "Gas",
    transmission: "Automatic",
    category: "certified",
    badge: "Northstar certified",
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=850&q=80",
    alt: "Blue BMW sedan",
  },
  {
    id: "toyota-rav4",
    make: "Toyota",
    model: "RAV4",
    trim: "Hybrid XLE Premium",
    year: 2024,
    price: 36450,
    miles: 6200,
    body: "SUV",
    fuel: "Hybrid",
    transmission: "Automatic",
    category: "new",
    badge: "Low mileage",
    image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=850&q=80",
    alt: "White Toyota RAV4",
  },
  {
    id: "honda-civic",
    make: "Honda",
    model: "Civic",
    trim: "Sport",
    year: 2023,
    price: 24900,
    miles: 11200,
    body: "Sedan",
    fuel: "Gas",
    transmission: "Automatic",
    category: "new",
    badge: "Great value",
    image: "https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?auto=format&fit=crop&w=850&q=80",
    alt: "Modern dark-colored sedan",
  },
  {
    id: "tesla-model-y",
    make: "Tesla",
    model: "Model Y",
    trim: "Long Range AWD",
    year: 2023,
    price: 41900,
    miles: 15600,
    body: "SUV",
    fuel: "Electric",
    transmission: "Automatic",
    category: "certified",
    badge: "All electric",
    image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=850&q=80",
    alt: "White electric car",
  },
  {
    id: "jeep-wrangler",
    make: "Jeep",
    model: "Wrangler",
    trim: "Sahara 4x4",
    year: 2022,
    price: 34750,
    miles: 29100,
    body: "SUV",
    fuel: "Gas",
    transmission: "Automatic",
    category: "certified",
    badge: "Ready for anywhere",
    image: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=850&q=80",
    alt: "Dark SUV on a scenic road",
  },
];

const grid = document.querySelector("#car-grid");
const emptyState = document.querySelector("#empty-state");
const searchForm = document.querySelector("#search-form");
const makeFilter = document.querySelector("#make-filter");
const bodyFilter = document.querySelector("#body-filter");
const priceFilter = document.querySelector("#price-filter");
const sortSelect = document.querySelector("#sort-select");
const dialog = document.querySelector("#contact-dialog");
const dialogCarName = document.querySelector("#dialog-car-name");
const contactForm = document.querySelector("#contact-form");
const formSuccess = document.querySelector("#form-success");
let activeCategory = "all";
let quickSearch = "";
const favorites = new Set();

function formatPrice(price) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

function getVisibleCars() {
  let visibleCars = cars.filter((car) => {
    const matchesMake = !makeFilter.value || car.make === makeFilter.value;
    const matchesBody = !bodyFilter.value || car.body === bodyFilter.value;
    const matchesPrice = !priceFilter.value || car.price <= Number(priceFilter.value);
    const matchesCategory = activeCategory === "all" || car.category === activeCategory;
    const matchesQuick =
      !quickSearch ||
      (quickSearch === "SUV" && car.body === "SUV") ||
      (quickSearch === "under-25000" && car.price < 25000) ||
      (quickSearch === "hybrid" && ["Hybrid", "Electric"].includes(car.fuel));
    return matchesMake && matchesBody && matchesPrice && matchesCategory && matchesQuick;
  });

  if (sortSelect.value === "price-low") visibleCars.sort((a, b) => a.price - b.price);
  if (sortSelect.value === "price-high") visibleCars.sort((a, b) => b.price - a.price);
  if (sortSelect.value === "year-new") visibleCars.sort((a, b) => b.year - a.year);
  return visibleCars;
}

function renderCars() {
  const visibleCars = getVisibleCars();
  emptyState.hidden = visibleCars.length > 0;
  grid.innerHTML = visibleCars.map((car) => `
    <article class="car-card">
      <div class="car-photo">
        <img src="${car.image}" alt="${car.alt}" loading="lazy" />
        <span class="car-badge">${car.badge}</span>
        <button class="favorite-button" type="button" data-favorite="${car.id}" aria-label="Save ${car.year} ${car.make} ${car.model}" aria-pressed="${favorites.has(car.id)}">${favorites.has(car.id) ? "♥" : "♡"}</button>
      </div>
      <div class="car-info">
        <div class="car-title-row"><h3>${car.year} ${car.make} ${car.model}</h3><span class="price">${formatPrice(car.price)}</span></div>
        <p class="car-subtitle">${car.trim}</p>
        <div class="car-specs"><span>${car.miles.toLocaleString()} mi</span><span>${car.transmission}</span><span>${car.fuel}</span></div>
        <div class="car-card-bottom"><span class="certified-note">${car.category === "certified" ? "✓ Northstar checked" : "✓ 150-point inspected"}</span><button class="drive-link" type="button" data-test-drive="${car.id}">Book a test drive</button></div>
      </div>
    </article>
  `).join("");
}

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  quickSearch = "";
  renderCars();
  document.querySelector("#inventory").scrollIntoView({ behavior: "smooth" });
});

for (const filter of [makeFilter, bodyFilter, priceFilter, sortSelect]) {
  filter.addEventListener("change", () => {
    quickSearch = "";
    renderCars();
  });
}

document.querySelectorAll(".tab-button").forEach((button) => {
  button.addEventListener("click", () => {
    activeCategory = button.dataset.category;
    document.querySelectorAll(".tab-button").forEach((tab) => {
      tab.classList.toggle("selected", tab === button);
    });
    renderCars();
  });
});

document.querySelectorAll("[data-quick]").forEach((button) => {
  button.addEventListener("click", () => {
    quickSearch = button.dataset.quick;
    makeFilter.value = "";
    bodyFilter.value = "";
    priceFilter.value = "";
    activeCategory = "all";
    document.querySelectorAll(".tab-button").forEach((tab) => {
      tab.classList.toggle("selected", tab.dataset.category === "all");
    });
    renderCars();
  });
});

grid.addEventListener("click", (event) => {
  const favoriteButton = event.target.closest("[data-favorite]");
  if (favoriteButton) {
    const carId = favoriteButton.dataset.favorite;
    favorites.has(carId) ? favorites.delete(carId) : favorites.add(carId);
    renderCars();
    return;
  }

  const testDriveButton = event.target.closest("[data-test-drive]");
  if (testDriveButton) {
    const car = cars.find((item) => item.id === testDriveButton.dataset.testDrive);
    dialogCarName.textContent = `Request a test drive for the ${car.year} ${car.make} ${car.model} ${car.trim}.`;
    contactForm.hidden = false;
    formSuccess.hidden = true;
    dialog.showModal();
  }
});

document.querySelector(".dialog-close").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});
contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  contactForm.hidden = true;
  formSuccess.hidden = false;
});

const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector("#main-nav");
menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  mainNav.classList.toggle("open", !isOpen);
});
mainNav.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    menuToggle.setAttribute("aria-expanded", "false");
    mainNav.classList.remove("open");
  }
});

renderCars();
