let flights = JSON.parse(localStorage.getItem("results")) || [];

let container = document.getElementById("results");

if (flights.length === 0) {
  container.innerHTML = `
  <div class="text-center py-10 opacity-70">
    <p class="text-lg">No flights found</p>
    <p class="text-sm">Try a different route or date</p>
  </div>
  `;
}

flights.forEach((flight) => {
  let card = document.createElement("div");

  card.className =
    "card bg-base-200/80 backdrop-blur-md border border-base-300 shadow-lg p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:shadow-xl hover:-translate-y-1 transition duration-300";

  card.innerHTML = `
  <div <div class="flex flex-col md:items-end gap-3 w-full md:w-auto">
    <h3 class="text-xl font-semibold">${flight.airline}</h3>
    
    <p class="font-medium">
      ${flight.origin} → ${flight.destination}
    </p>

    <p class="text-sm opacity-70">
      ${flight.departureTime} - ${flight.arrivalTime}
    </p>
  </div>

  <div class="flex flex-col md:items-end gap-10 w-full md:w-auto">
    
    <p class="text-xl md:text-2xl font-bold text-primary">
      ₦${Number(flight.price).toLocaleString()}
    </p>

    <button class="btn btn-primary btn-sm md:btn-md w-full md:w-auto">
      Select Seat
    </button>

  </div>
 `;

  card.querySelector("button").addEventListener("click", () => {
    // ✅ Save selected flight
    localStorage.setItem("selectedFlight", flight.id);

    // ✅ CLEAR previously selected seats
    localStorage.removeItem("selectedSeats");

    // (optional but smart)
    localStorage.removeItem("latestBooking");

    window.location.href = "seats.html";
  });

  container.appendChild(card);
});
