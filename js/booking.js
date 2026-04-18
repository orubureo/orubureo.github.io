/* =========================
   GET DATA
========================= */

const selectedFlight = JSON.parse(localStorage.getItem("selectedFlight"));

if (!selectedFlight) {
  alert("No flight selected");
  window.location.href = "index.html";
}

const flightId = selectedFlight.id;
const seatPrice = Number(selectedFlight.price) || 50000;

const date = localStorage.getItem("searchDate") || "";
const selectedSeats = JSON.parse(localStorage.getItem("selectedSeats")) || [];

const totalPrice = selectedSeats.length * seatPrice;

/* =========================
   FLIGHT SUMMARY
========================= */

const seatInfo = document.getElementById("seatInfo");

if (seatInfo) {
  seatInfo.innerHTML = `
    <div class="seat-top">
      <h2 class="seat-airline">${selectedFlight.airline || "Airline"}</h2>
      <span class="seat-badge">CONFIRMED ROUTE</span>
    </div>

    <div class="seat-body">
      <div class="seat-row">
        <span>Flight No</span>
        <strong>${flightId}</strong>
      </div>

      <div class="seat-row">
        <span>Date</span>
        <strong>${date}</strong>
      </div>

      <div class="seat-row">
        <span>Seats</span>
        <strong>${selectedSeats.join(", ") || "-"}</strong>
      </div>

      <hr class="seat-divider"/>

      <div class="seat-total">
        <span>Total</span>
        <span>₦${totalPrice.toLocaleString()}</span>
      </div>
    </div>
  `;
}

/* =========================
   ALERT SYSTEM
========================= */

function showAlert(message, type = "info") {
  const alertBox = document.getElementById("alertBox");
  if (!alertBox) return;

  const alert = document.createElement("div");
  alert.className = `alert-box ${type}`;
  alert.textContent = message;

  alertBox.appendChild(alert);

  // auto remove
  setTimeout(() => {
    alert.classList.add("fade-out");
    setTimeout(() => alert.remove(), 250);
  }, 3000);

  // limit max alerts (clean UI)
  if (alertBox.children.length > 3) {
    alertBox.removeChild(alertBox.firstChild);
  }
}

/* =========================
   PAYMENT TOGGLE
========================= */

const paymentMethod = document.getElementById("paymentMethod");
const cardDetails = document.getElementById("cardDetails");

if (paymentMethod && cardDetails) {
  paymentMethod.addEventListener("change", () => {
    cardDetails.classList.toggle("hidden", paymentMethod.value !== "card");
  });
}

/* =========================
   INPUT FORMATTING
========================= */

const cardNumberInput = document.getElementById("cardNumber");
const expiryInput = document.getElementById("expiry");
const cvvInput = document.getElementById("cvv");

if (cardNumberInput) {
  cardNumberInput.addEventListener("input", (e) => {
    let value = e.target.value.replace(/\D/g, "").slice(0, 16);
    e.target.value = value.match(/.{1,4}/g)?.join(" ") || value;

    updateCardPreview();
  });
}

if (expiryInput) {
  expiryInput.addEventListener("input", (e) => {
    let value = e.target.value.replace(/\D/g, "").slice(0, 4);

    if (value.length >= 3) {
      value = value.slice(0, 2) + "/" + value.slice(2);
    }

    e.target.value = value;

    updateCardPreview();
  });
}

if (cvvInput) {
  cvvInput.addEventListener("input", (e) => {
    e.target.value = e.target.value.replace(/\D/g, "").slice(0, 3);
  });
}

/* =========================
   LIVE CARD PREVIEW
========================= */

const nameInput = document.getElementById("passengerName");

const numberPreview = document.querySelector(".card-number-preview");
const expiryPreview = document.querySelector(".card-expiry");
const namePreview = document.querySelector(".card-name");

function updateCardPreview() {
  if (cardNumberInput && numberPreview) {
    numberPreview.textContent = cardNumberInput.value || "•••• •••• •••• ••••";
  }

  if (expiryInput && expiryPreview) {
    expiryPreview.textContent = expiryInput.value || "MM/YY";
  }

  if (nameInput && namePreview) {
    namePreview.textContent = nameInput.value.toUpperCase() || "YOUR NAME";
  }
}

if (nameInput) {
  nameInput.addEventListener("input", updateCardPreview);
}

/* =========================
   BOOKING LOGIC
========================= */

const bookBtn = document.getElementById("bookBtn");

if (bookBtn) {
  bookBtn.addEventListener("click", () => {
    const name = document.getElementById("passengerName").value.trim();
    const payment = paymentMethod?.value;

    if (!name) {
      showAlert("Enter passenger name", "error");
      return;
    }

    if (!payment) {
      showAlert("Select payment method", "error");
      return;
    }

    // card validation
    if (payment === "card") {
      const number = cardNumberInput.value.replace(/\s/g, "");
      const exp = expiryInput.value;
      const cvv = cvvInput.value;

      if (number.length !== 16) {
        showAlert("Invalid card number", "error");
        return;
      }

      if (!/^\d{2}\/\d{2}$/.test(exp)) {
        showAlert("Invalid expiry format", "error");
        return;
      }

      if (cvv.length !== 3) {
        showAlert("Invalid CVV", "error");
        return;
      }
    }

    // loading state
    bookBtn.classList.add("loading");
    bookBtn.disabled = true;

    setTimeout(() => {
      const bookings = JSON.parse(localStorage.getItem("bookings")) || [];

      const booking = {
        bookingId: Date.now(),
        flightId,
        passengerName: name,
        seatNumbers: selectedSeats,
        flightDate: date,
        bookingDate: new Date().toLocaleString(),
        flightAirline: selectedFlight.airline || "Unknown",
        totalAmount: totalPrice,
      };

      bookings.push(booking);

      localStorage.setItem("bookings", JSON.stringify(bookings));
      localStorage.setItem("latestBooking", JSON.stringify(booking));

      showAlert("Booking successful!", "success");

      window.location.href = "receipt.html";
    }, 2000);
  });
}
