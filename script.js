const tbody = document.getElementById("tbody");
const amountInput = document.getElementById("amount");
const searchInput = document.getElementById("search");

const countries = [
  { country: "Bangladesh", code: "BDT", symbol: "৳" },
  { country: "United States", code: "USD", symbol: "$" },
  { country: "India", code: "INR", symbol: "₹" },
  { country: "Pakistan", code: "PKR", symbol: "₨" },
  { country: "Saudi Arabia", code: "SAR", symbol: "﷼" },
  { country: "United Arab Emirates", code: "AED", symbol: "د.إ" },
  { country: "South Africa", code: "ZAR", symbol: "R" },
  { country: "United Kingdom", code: "GBP", symbol: "£" },
  { country: "Japan", code: "JPY", symbol: "¥" },
  { country: "Canada", code: "CAD", symbol: "C$" }
];

let rates = {};

fetch("rates.json")
  .then(res => res.json())
  .then(data => {
    rates = data.rates;
    loadTable();
  });

function loadTable() {
  tbody.innerHTML = "";

  const amount = Number(amountInput.value) || 100;
  const search = searchInput.value.toLowerCase();

  countries
    .filter(c =>
      c.country.toLowerCase().includes(search) ||
      c.code.toLowerCase().includes(search)
    )
    .forEach(c => {
      const value = (rates[c.code] || 0) * amount;

      tbody.innerHTML += `
      <tr>
        <td>${c.country}</td>
        <td>${c.code}</td>
        <td>${c.symbol}${value.toFixed(2)}</td>
      </tr>`;
    });
}

amountInput.addEventListener("input", loadTable);
searchInput.addEventListener("input", loadTable);
