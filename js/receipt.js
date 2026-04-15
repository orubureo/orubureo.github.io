let booking = JSON.parse(localStorage.getItem("latestBooking"));

let container = document.getElementById("receiptDetails");

if (!booking) {
  document.getElementById("receiptDetails").innerHTML = `
    <p class="text-red-500">No booking found.</p>
  `;
} else {
  document.getElementById("receiptDetails").innerHTML = `
  <div class="flex flex-col gap-4">

    <div class="divider">Flight Info</div>

    <div class="grid grid-cols-2 gap-3 text-sm">
      <p class="opacity-70">Airline</p>
      <p class="font-medium">${booking.flightAirline}</p>

      <p class="opacity-70">Flight ID</p>
      <p class="font-medium">${booking.flightId}</p>

      <p class="opacity-70">Date</p>
      <p class="font-medium">${booking.flightDate}</p>

      <p class="opacity-70">Seats</p>
      <p class="font-medium">${booking.seatNumbers.join(", ")}</p>
    </div>

    <div class="divider">Passenger</div>

    <div class="grid grid-cols-2 gap-3 text-sm">
      <p class="opacity-70">Name</p>
      <p class="font-medium">${booking.passengerName}</p>

      <p class="opacity-70">Booking ID</p>
      <p class="font-medium">${booking.bookingId}</p>

      <p class="opacity-70">Booked On</p>
      <p class="font-medium">${booking.bookingDate}</p>
    </div>

    <div class="divider">Payment</div>

    <div class="flex justify-between items-center text-lg font-bold">
      <span>Total Paid</span>
      <span class="text-primary">₦${booking.totalAmount.toLocaleString()}</span>
    </div>

  </div>`;
  showAlert("Payment Successful 🎉", "success");
}

// Alert pop up
function showAlert(message, type = "info") {
  let alertBox = document.getElementById("alertBox");

  let alert = document.createElement("div");
  alert.className = `alert alert-${type} shadow-lg`;

  alert.innerHTML = `
    <span>${message}</span>
  `;

  alertBox.innerHTML = ""; // clears old alerts
  alertBox.appendChild(alert);

  // Auto remove after 3 seconds
  setTimeout(() => {
    alert.remove();
  }, 3000);
}

document.getElementById("Home").addEventListener("click", () => {
  window.location.href = "index.html";
});
