let flightId = localStorage.getItem("selectedFlight");
let flights = JSON.parse(localStorage.getItem("results")) || [];
let selectedFlight = flights.find((f) => f.id == flightId);

let date = localStorage.getItem("searchDate") || "";
let selectedSeats = JSON.parse(localStorage.getItem("selectedSeats")) || [];
let seatPrice = selectedFlight?.price || 50000;
let totalPrice = selectedSeats.length * seatPrice;

/* SHOW FLIGHT DETAILS */
document.getElementById("seatInfo").innerHTML = `
<div class="flex flex-col gap-2">
  <p><strong>Airline:</strong> ${selectedFlight.airline}</p>
  <p><strong>Flight Number:</strong> ${selectedFlight.id}</p>
  <p><strong>Date:</strong> ${date}</p>
  <p><strong>Seats:</strong> ${selectedSeats.join(", ")}</p>
  <p><strong>Total:</strong> ₦${totalPrice.toLocaleString()}</p>
</div>
`;

// Alert pop up
function showAlert(message, type = "info") {
  let alertBox = document.getElementById("alertBox");

  let alert = document.createElement("div");
  alert.className = `alert alert-${type} mb-2`;

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

// Card Validation
let paymentMethod = document.getElementById("paymentMethod");
let cardDetails = document.getElementById("cardDetails");

paymentMethod.addEventListener("change", () => {
  if (paymentMethod.value === "card") {
    cardDetails.classList.remove("hidden");
  } else {
    cardDetails.classList.add("hidden");
  }
});

let cardNumberInput = document.getElementById("cardNumber");

// Format Card
cardNumberInput.addEventListener("input", (e) => {
  let value = e.target.value.replace(/\D/g, ""); // remove non-digits
  value = value.substring(0, 16); // limit to 16 digits

  let formatted = value.match(/.{1,4}/g)?.join(" ") || value;

  e.target.value = formatted;
});

// Format expiry date
let expiryInput = document.getElementById("expiry");

expiryInput.addEventListener("input", (e) => {
  let value = e.target.value.replace(/\D/g, "").substring(0, 4);

  if (value.length >= 3) {
    value = value.slice(0, 2) + "/" + value.slice(2);
  }

  e.target.value = value;
});

// CVV
let cvvInput = document.getElementById("cvv");

cvvInput.addEventListener("input", (e) => {
  e.target.value = e.target.value.replace(/\D/g, "").substring(0, 3);
});

let bookBtn = document.getElementById("bookBtn");

document.getElementById("bookBtn").addEventListener("click", () => {
  let name = document.getElementById("passengerName").value;
  let payment = document.getElementById("paymentMethod").value;

  if (!name) {
    showAlert("Please enter passenger name", "error");
    return;
  }

  if (!payment) {
    showAlert("Select payment method");
    return;
  }

  // Card validation
  if (payment === "card") {
    let cardNumber = document
      .getElementById("cardNumber")
      .value.replace(/\s/g, "");
    let expiry = document.getElementById("expiry").value;
    let cvv = document.getElementById("cvv").value;

    if (cardNumber.length !== 16) {
      showAlert("Card number must be 16 digits", "error");
      return;
    }

    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
      showAlert("Expiry must be in MM/YY format", "error");
      return;
    }

    if (cvv.length !== 3) {
      showAlert("CVV must be 3 digits", "error");
      return;
    }
  }

  bookBtn.innerHTML = `
  Processing...<span class="loading loading-spinner"></span>
  `;
  bookBtn.disabled = true;

  setTimeout(() => {
    let flight = localStorage.getItem("selectedFlight");

    let flights = JSON.parse(localStorage.getItem("results")) || [];

    let selectedFlight = flights.find((f) => f.id == flight);

    let bookings = JSON.parse(localStorage.getItem("bookings")) || [];

    let booking = {
      bookingId: Date.now(),
      flightId: flight,
      passengerName: name,
      seatNumbers: selectedSeats,
      flightDate: date,
      bookingDate: new Date().toLocaleString(),
      flightAirline: selectedFlight.airline,
      totalAmount: totalPrice,
    };

    bookings.push(booking);

    // ✅ SAVE FULL BOOKINGS LIST
    localStorage.setItem("bookings", JSON.stringify(bookings));

    // ✅ SAVE LAST BOOKING
    localStorage.setItem("latestBooking", JSON.stringify(booking));

    showAlert("Booking successful!", "success");

    window.location.href = "receipt.html";
  }, 3000);
});
