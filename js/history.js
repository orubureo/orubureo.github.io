const container = document.getElementById("bookings");
let bookings = JSON.parse(localStorage.getItem("bookings")) || [];

/* =========================
   EMPTY STATE
========================= */
if (bookings.length === 0) {
  container.innerHTML = `
    <div class="empty-state">
      <p class="text-lg font-semibold">No bookings yet</p>
      <p>Start by booking a flight ✈️</p>
    </div>
  `;
}

/* =========================
   RENDER BOOKINGS
========================= */
bookings
  .slice()
  .reverse()
  .forEach((booking) => {
    const card = document.createElement("div");
    card.className = "booking-card";

    card.innerHTML = `
      <!-- TOP -->
      <div class="booking-top">
        <h3 class="booking-airline">${booking.flightAirline || "Airline"}</h3>
        <span class="booking-price">₦${(booking.totalAmount || 0).toLocaleString()}</span>
      </div>

      <!-- ROUTE -->
      <div class="booking-route">
        <strong>${booking.flightId}</strong>
        <span>•</span>
        <span>${booking.flightDate}</span>
      </div>

      <!-- DETAILS -->
      <div class="booking-details">
        <div>
          <span>Passenger</span><br/>
          <strong>${booking.passengerName}</strong>
        </div>

        <div>
          <span>Seats</span><br/>
          <strong>${(booking.seatNumbers || [booking.seatNumber]).join(", ")}</strong>
        </div>

        <div>
          <span>Booked On</span><br/>
          <strong>${booking.bookingDate}</strong>
        </div>

        <div>
          <span>Status</span><br/>
          <strong class="text-green-500">Confirmed</strong>
        </div>
      </div>

      <!-- ACTION -->
      <button class="btn btn-error btn-sm mt-2 cancel-btn">
        Cancel Booking
      </button>
    `;

    /* CANCEL BUTTON */
    card.querySelector(".cancel-btn").addEventListener("click", () => {
      cancelBooking(booking.bookingId);
    });

    container.appendChild(card);
  });

/* =========================
   CANCEL FUNCTION
========================= */
function cancelBooking(id) {
  let bookings = JSON.parse(localStorage.getItem("bookings")) || [];

  let updated = bookings.filter((b) => b.bookingId !== id);

  localStorage.setItem("bookings", JSON.stringify(updated));

  location.reload();
}
