let container = document.getElementById("bookings");

let bookings = JSON.parse(localStorage.getItem("bookings")) || [];

if (bookings.length === 0) {
  container.innerHTML = "<p>No bookings yet.</p>";
}

bookings.forEach((booking) => {
  let card = document.createElement("div");

  card.className = "bookings-card";

  card.innerHTML = `
  <div class="flex flex-col gap-5 border-none">
    <p class="text-5xl">${booking.flightAirline}</p>
    <p><strong>Passenger Name:</strong> ${booking.passengerName}</p>
    <p><strong>Flight Number:</strong> ${booking.flightId}</p>
    <p><strong>Seats:</strong> ${(booking.seatNumbers || [booking.seatNumber]).join(", ")}</p>
    <p><strong>Booking Date:</strong> ${booking.bookingDate}</p>
    <p><strong>Flight Date:</strong> ${booking.flightDate}</p>
    <p><strong>Total Paid:</strong> ₦${(booking.totalAmount || 0).toLocaleString()}</p>
    </div>
    <button>
      Cancel Booking
    </button>
  `;

  card.querySelector("button").addEventListener("click", () => {
    cancelBooking(booking.bookingId);
  });

  container.appendChild(card);
});

function cancelBooking(id) {
  let bookings = JSON.parse(localStorage.getItem("bookings")) || [];

  let updated = bookings.filter((b) => b.bookingId !== id);

  localStorage.setItem("bookings", JSON.stringify(updated));

  location.reload();
}
