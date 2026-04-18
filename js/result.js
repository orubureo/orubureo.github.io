let flights = JSON.parse(localStorage.getItem("results")) || [];
let container = document.getElementById("results");

container.innerHTML = "";

if (flights.length === 0) {
  container.innerHTML = `
    <div class="empty-state">
      <p class="title">No flights found</p>
      <p class="subtitle">Try a different route or date</p>
    </div>
  `;
}

flights.forEach((flight) => {
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
        <p class="price">
          ₦${Number(flight.price).toLocaleString()}
        </p>
        <p class="hint">per passenger</p>
      </div>

      <button class="btn btn-primary select-seat-btn">
        Book Flight
      </button>

    </div>
  `;

  card.querySelector(".select-seat-btn").addEventListener("click", () => {
    localStorage.setItem("selectedFlight", flight.id);
    localStorage.removeItem("selectedSeats");
    localStorage.removeItem("latestBooking");

    window.location.href = "seats.html";
  });

  container.appendChild(card);
});
