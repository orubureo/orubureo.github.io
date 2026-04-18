let seatsContainer = document.getElementById("seats");

if (seatsContainer) {
  let selectedSeats = JSON.parse(localStorage.getItem("selectedSeats")) || [];

  let seatLetters = ["A", "B", "C", "D", "E", "F"];

  // ✅ GET FULL OBJECT
  let selectedFlight = JSON.parse(localStorage.getItem("selectedFlight"));

  // 🚨 SAFETY CHECK (THIS WAS MISSING)
  if (!selectedFlight) {
    alert("No flight selected. Redirecting...");
    window.location.href = "index.html";
  }

  let flightId = selectedFlight.id;
  let seatPrice = Number(selectedFlight.price) || 50000;

  let bookings = JSON.parse(localStorage.getItem("bookings")) || [];

  let bookedSeats = bookings
    .filter((b) => b.flightId === flightId)
    .flatMap((b) => b.seatNumbers || [b.seatNumber]);

  // ✅ CLEAR BEFORE RENDER (IMPORTANT)
  seatsContainer.innerHTML = "";

  for (let row = 1; row <= 6; row++) {
    for (let col = 0; col < 7; col++) {
      if (col === 3) {
        let aisle = document.createElement("div");
        seatsContainer.appendChild(aisle);
        continue;
      }

      let seat = document.createElement("button");

      let letter = seatLetters[col < 3 ? col : col - 1];
      let seatLabel = row + letter;

      seat.textContent = seatLabel;
      seat.className = "seat-btn";

      // booked
      if (bookedSeats.includes(seatLabel)) {
        seat.disabled = true;
        seat.classList.add("booked");
      }

      // restore selected
      if (selectedSeats.includes(seatLabel)) {
        seat.classList.add("selected");
      }

      seat.addEventListener("click", () => {
        if (selectedSeats.includes(seatLabel)) {
          selectedSeats = selectedSeats.filter((s) => s !== seatLabel);
          seat.classList.remove("selected");
        } else {
          if (selectedSeats.length >= 5) {
            alert("Maximum 5 seats allowed");
            return;
          }

          selectedSeats.push(seatLabel);
          seat.classList.add("selected");
        }

        localStorage.setItem("selectedSeats", JSON.stringify(selectedSeats));
        updateTotalPrice();
      });

      seatsContainer.appendChild(seat);
    }
  }

  function updateTotalPrice() {
    let total = selectedSeats.length * seatPrice;

    let priceEl = document.getElementById("totalPrice");
    let countEl = document.getElementById("seatCount");

    if (priceEl) priceEl.textContent = `${total.toLocaleString()}`;
    if (countEl) countEl.textContent = selectedSeats.length;
  }

  updateTotalPrice();
}

/* CONTINUE BUTTON */
let continueBtn = document.getElementById("continueBtn");

if (continueBtn) {
  continueBtn.addEventListener("click", () => {
    let selectedSeats = JSON.parse(localStorage.getItem("selectedSeats")) || [];

    if (selectedSeats.length === 0) {
      alert("Please select at least one seat.");
      return;
    }

    window.location.href = "booking.html";
  });
}
