import { flights } from "./data.js";

document.getElementById("date").min = new Date().toISOString().split("T")[0];

/* SEARCH */
document.getElementById("searchForm").addEventListener("submit", function (e) {
  e.preventDefault();

  let origin = document.getElementById("origin").value.trim().toLowerCase();
  let destination = document
    .getElementById("destination")
    .value.trim()
    .toLowerCase();

  let date = document.getElementById("date").value;

  if (!origin || !destination) {
    alert("Please fill in origin, destination.");
    return;
  }

  let results = flights.filter(
    (flight) =>
      flight.origin.toLowerCase() === origin &&
      flight.destination.toLowerCase() === destination,
  );

  localStorage.setItem("searchDate", date);
  localStorage.setItem("results", JSON.stringify(results));

  window.location.href = "results.html";
});
