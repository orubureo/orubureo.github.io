import { flights } from "./data.js";

const form = document.getElementById("searchForm");
const originInput = document.getElementById("origin");
const destinationInput = document.getElementById("destination");
const dateInput = document.getElementById("date");
const priceHint = document.getElementById("priceHint");
const resultsContainer = document.getElementById("results");
const swapBtn = document.getElementById("swapBtn");
const resetBtn = document.getElementById("resetBtn");

// prevent past dates
dateInput.min = new Date().toISOString().split("T")[0];

/* =========================
   DATA STATE
========================= */
let allFlights = flights;
let currentList = [...allFlights];

/* =========================
   RENDER FLIGHTS
========================= */
function renderFlights(list) {
  resultsContainer.innerHTML = "";

  if (!list.length) {
    resultsContainer.innerHTML = `
      <div class="empty-state">
        <p class="title">No flights found</p>
        <p class="subtitle">Try a different route or date</p>
      </div>
    `;
    return;
  }

  list.forEach((flight) => {
    const card = document.createElement("div");
    card.className = "flight-card";

    card.innerHTML = `
      <div class="flight-main">

        <div class="flight-top">
          <h3 class="airline">${flight.airline}</h3>
          <span class="badge">Available</span>
        </div>

        <div class="route">
          <span class="city">${flight.origin}</span>
          <span class="arrow">→</span>
          <span class="city">${flight.destination}</span>
        </div>

        <div class="meta">
          <div>
            <p class="label">Departure</p>
            <p class="value">${flight.departureTime}</p>
          </div>

          <div>
            <p class="label">Arrival</p>
            <p class="value">${flight.arrivalTime}</p>
          </div>
        </div>

      </div>

      <div class="flight-side">

        <div class="price-box">
          <p class="price">₦${Number(flight.price).toLocaleString()}</p>
          <p class="hint">per passenger</p>
        </div>

        <button class="btn btn-primary select-seat-btn">
          Book Flight
        </button>

      </div>
    `;

    /* =========================
       IMPORTANT FIX: STORE OBJECT
    ========================= */
    card.querySelector(".select-seat-btn").addEventListener("click", () => {
      const safeFlight = {
        id: flight.id,
        airline: flight.airline,
        origin: flight.origin,
        destination: flight.destination,
        departureTime: flight.departureTime,
        arrivalTime: flight.arrivalTime,
        price: flight.price,
      };

      localStorage.setItem("selectedFlight", JSON.stringify(safeFlight));

      localStorage.removeItem("selectedSeats");
      localStorage.removeItem("latestBooking");

      window.location.href = "seats.html";
    });

    resultsContainer.appendChild(card);
  });
}

/* =========================
   INITIAL LOAD
========================= */
renderFlights(allFlights);

/* =========================
   FILTER LOGIC
========================= */
function filterFlights() {
  const origin = originInput.value.trim().toLowerCase();
  const destination = destinationInput.value.trim().toLowerCase();

  currentList = allFlights.filter((flight) => {
    const matchOrigin = origin
      ? flight.origin.toLowerCase().includes(origin)
      : true;

    const matchDestination = destination
      ? flight.destination.toLowerCase().includes(destination)
      : true;

    return matchOrigin && matchDestination;
  });

  renderFlights(currentList);
}

/* =========================
   RESET
========================= */
function resetSearch() {
  originInput.value = "";
  destinationInput.value = "";
  dateInput.value = "";
  priceHint.innerText = "";

  currentList = [...allFlights];
  renderFlights(allFlights);
}

/* =========================
   LIVE FILTER
========================= */
originInput.addEventListener("input", filterFlights);
destinationInput.addEventListener("input", filterFlights);

/* =========================
   PRICE PREVIEW
========================= */
function estimatePrice(origin, destination) {
  if (!origin || !destination) return null;

  const base = 50000;
  const seed = origin.charCodeAt(0) + destination.charCodeAt(0);
  const random = (seed * 9301 + 49297) % 50000;

  return base + random;
}

function updatePricePreview() {
  const origin = originInput.value.trim().toLowerCase();
  const destination = destinationInput.value.trim().toLowerCase();

  const price = estimatePrice(origin, destination);

  priceHint.innerText = price
    ? "Estimated from ₦" + price.toLocaleString()
    : "";
}

originInput.addEventListener("input", updatePricePreview);
destinationInput.addEventListener("input", updatePricePreview);

/* =========================
   SWAP UX
========================= */
if (swapBtn) {
  swapBtn.addEventListener("click", () => {
    const temp = originInput.value;
    originInput.value = destinationInput.value;
    destinationInput.value = temp;

    filterFlights();
    updatePricePreview();

    swapBtn.classList.add("rotate-180");
    setTimeout(() => swapBtn.classList.remove("rotate-180"), 200);
  });
}

/* =========================
   RESET BUTTON
========================= */
if (resetBtn) {
  resetBtn.addEventListener("click", resetSearch);
}

/* =========================
   FORM SUBMIT
========================= */
form.addEventListener("submit", (e) => {
  e.preventDefault();
  filterFlights();
});
