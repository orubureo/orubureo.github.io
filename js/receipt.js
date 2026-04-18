let booking = JSON.parse(localStorage.getItem("latestBooking"));

let container = document.getElementById("receiptDetails");

if (!booking) {
  container.innerHTML = `
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
      <span class="total-amount">₦${booking.totalAmount.toLocaleString()}</span>
    </div>

  </div>`;

  showAlert("Payment Successful 🎉", "success");

  let qrContainer = document.getElementById("qrcode");

  if (qrContainer) {
    qrContainer.innerHTML = ""; // ✅ clear old QR first

    new QRCode(qrContainer, {
      text: `BookingID:${booking.bookingId}|Flight:${booking.flightId}|Seats:${booking.seatNumbers.join(",")}`,
      width: 120,
      height: 120,
    });
  }
}

// Alert pop up
function showAlert(message, type = "info") {
  let alertBox = document.getElementById("alertBox");

  let alert = document.createElement("div");
  alert.className = `custom-alert ${type}`;

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

let homeBtn = document.getElementById("Home");
if (homeBtn) {
  homeBtn.addEventListener("click", () => {
    window.location.href = "index.html";
  });
}

document.getElementById("downloadBtn").addEventListener("click", async () => {
  if (!booking) {
    showAlert("No booking to download", "error");
    return;
  }

  const element = document.querySelector(".max-w-lg");

  if (!element) {
    console.error("Receipt container not found");
    return;
  }

  // ✅ FIX: temporarily force safe colors (no oklch)
  element.classList.add("pdf-mode");

  let opt = {
    margin: 0.5,
    filename: `Flight_Receipt_${booking.bookingId}.pdf`,
    image: { type: "jpeg", quality: 1 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
  };

  try {
    await html2pdf().set(opt).from(element).save();
  } catch (err) {
    console.error("PDF error:", err);
    showAlert("Download failed", "error");
  }

  // ✅ restore original UI after download
  element.classList.remove("pdf-mode");
});
