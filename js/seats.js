let seatsContainer = document.getElementById("seats");
if (seatsContainer) {
  let selectedSeats = JSON.parse(localStorage.getItem("selectedSeats")) || [];

  let seatLetters = ["A", "B", "C", "D", "E", "F"];

  let selectedFlight = localStorage.getItem("selectedFlight");

  let flights = JSON.parse(localStorage.getItem("results")) || [];
  let selectedFlightData = flights.find((f) => f.id == selectedFlight);

  let seatPrice = selectedFlightData?.price || 50000;

  let bookings = JSON.parse(localStorage.getItem("bookings")) || [];

  let bookedSeats = bookings
    .filter((b) => b.flightId === selectedFlight)
    .flatMap((b) => b.seatNumbers || [b.seatNumber]);

  for (let row = 1; row <= 6; row++) {
    for (let col = 0; col < 7; col++) {
      // create aisle
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

      // booked seats
      if (bookedSeats.includes(seatLabel)) {
        seat.disabled = true;
        seat.classList.add("booked");
      }

      // ✅ RESTORE SELECTED SEATS (THIS IS WHAT YOU WERE MISSING)
      if (selectedSeats.includes(seatLabel)) {
        seat.classList.add("selected");
      }

      // ✅ MULTI-SEAT TOGGLE LOGIC
      seat.addEventListener("click", () => {
        if (selectedSeats.includes(seatLabel)) {
          // remove seat
          selectedSeats = selectedSeats.filter((s) => s !== seatLabel);
          seat.classList.remove("selected");
        } else {
          // limit seats
          if (selectedSeats.length >= 5) {
            alert("Maximum 5 seats allowed");
            return;
          }

          // add seat
          selectedSeats.push(seatLabel);
          seat.classList.add("selected");
        }

        // save
        localStorage.setItem("selectedSeats", JSON.stringify(selectedSeats));

        // ✅ update total price
        updateTotalPrice();
      });

      seatsContainer.appendChild(seat);
    }
  }

  function updateTotalPrice() {
    let total = selectedSeats.length * seatPrice;

    let priceEl = document.getElementById("totalPrice");
    let countEl = document.getElementById("seatCount");

    if (priceEl) {
      priceEl.textContent = total.toLocaleString();
    }

    if (countEl) {
      countEl.textContent = selectedSeats.length;
    }
  }

  // run on load
  updateTotalPrice();
}

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
