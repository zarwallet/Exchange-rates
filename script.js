const rates = {
  BDT: 1,
  USD: 0.0082,
  EUR: 0.0070,
  INR: 0.70,
  PKR: 2.35,
  SAR: 0.031,
  AED: 0.030,
  ZAR: 0.145
};

const countries = [
  { country: "Bangladesh", code: "BDT", symbol: "৳" },
  { country: "United States", code: "USD", symbol: "$" },
  { country: "Eurozone", code: "EUR", symbol: "€" },
  { country: "India", code: "INR", symbol: "₹" },
  { country: "Pakistan", code: "PKR", symbol: "₨" },
  { country: "Saudi Arabia", code: "SAR", symbol: "﷼" },
  { country: "United Arab Emirates", code: "AED", symbol: "د.إ" },
  { country: "South Africa", code: "ZAR", symbol: "R" }
];

const tbody = document.getElementById("tbody");
const amountInput = document.getElementById("amount");
const searchInput = document.getElementById("search");

function loadTable() {
  tbody.innerHTML = "";

  const amount = parseFloat(amountInput.value) || 100;
  const search = searchInput.value.toLowerCase();

  countries
    .filter(c =>
      c.country.toLowerCase().includes(search) ||
      c.code.toLowerCase().includes(search)
    )
    .forEach(c => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${c.country}</td>
        <td>${c.code}</td>
        <td>${c.symbol}${(amount * rates[c.code]).toFixed(2)}</td>
      `;

      tbody.appendChild(tr);
    });
}

amountInput.addEventListener("input", loadTable);
searchInput.addEventListener("input", loadTable);

loadTable();
