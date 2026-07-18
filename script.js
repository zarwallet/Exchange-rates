const tbody = document.getElementById("tbody");
const amountInput = document.getElementById("amount");
const searchInput = document.getElementById("search");
const lastUpdated = document.getElementById("lastUpdated");

let countries = [];
let rates = {};

// Cache settings
const CACHE_KEY_RATES = "exchange_rates_cache";
const CACHE_KEY_COUNTRIES = "countries_cache";
const CACHE_KEY_LAST_UPDATE = "last_update_time";
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

async function loadData() {
  try {
    const cachedCountries = localStorage.getItem(CACHE_KEY_COUNTRIES);
    
    if (cachedCountries) {
      countries = JSON.parse(cachedCountries);
    } else {
      countries = [
        { country: "Bangladesh", code: "BDT" },
        { country: "United States", code: "USD" },
        { country: "Eurozone", code: "EUR" },
        { country: "United Kingdom", code: "GBP" },
        { country: "India", code: "INR" },
        { country: "Japan", code: "JPY" },
        { country: "China", code: "CNY" },
        { country: "Saudi Arabia", code: "SAR" },
        { country: "United Arab Emirates", code: "AED" },
        { country: "Canada", code: "CAD" },
        { country: "Australia", code: "AUD" },
        { country: "Singapore", code: "SGD" },
        { country: "Malaysia", code: "MYR" },
        { country: "Pakistan", code: "PKR" },
        { country: "Nepal", code: "NPR" },
        { country: "Sri Lanka", code: "LKR" },
        { country: "Thailand", code: "THB" },
        { country: "South Korea", code: "KRW" },
        { country: "Kuwait", code: "KWD" },
        { country: "Qatar", code: "QAR" },
        { country: "Oman", code: "OMR" },
        { country: "Bahrain", code: "BHD" },
        { country: "Russia", code: "RUB" },
        { country: "Turkey", code: "TRY" },
        { country: "Egypt", code: "EGP" },
        { country: "South Africa", code: "ZAR" }
      ];
      localStorage.setItem(CACHE_KEY_COUNTRIES, JSON.stringify(countries));
    }

    const cachedRates = localStorage.getItem(CACHE_KEY_RATES);
    const cacheTime = localStorage.getItem(CACHE_KEY_LAST_UPDATE);
    const now = Date.now();

    if (cachedRates && cacheTime && (now - parseInt(cacheTime) < CACHE_DURATION)) {
      rates = JSON.parse(cachedRates);
    } else {
      const response = await fetch("https://open.er-api.com/v6/latest/BDT");
      const data = await response.json();

      if (data.result === "success") {
        rates = data.rates;
        localStorage.setItem(CACHE_KEY_RATES, JSON.stringify(rates));
        localStorage.setItem(CACHE_KEY_LAST_UPDATE, now.toString());
      }
    }

    renderTable();

  } catch (error) {
    console.error(error);
    if (Object.keys(rates).length > 0) renderTable();
  }
}

function renderTable() {
  const multiplier = Number(amountInput.value) || 1;
  const baseBDT = 100;
  const searchTerm = searchInput.value.toLowerCase().trim();

  tbody.innerHTML = "";

  const filtered = countries.filter(c => 
    c.country.toLowerCase().includes(searchTerm) || 
    c.code.toLowerCase().includes(searchTerm)
  );

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="3" style="text-align:center;">No results found</td></tr>`;
    return;
  }

  filtered.forEach(c => {
    const rate = rates[c.code];
    if (!rate) return;

    const finalAmount = (baseBDT * rate * multiplier).toFixed(2);

    tbody.innerHTML += `
      <tr>
        <td>${c.country}</td>
        <td><strong>${c.code}</strong></td>
        <td>${finalAmount}</td>
      </tr>`;
  });

  lastUpdated.textContent = `Last updated: ${new Date().toLocaleString()}`;
}

// Event listeners
amountInput.addEventListener("input", renderTable);
searchInput.addEventListener("input", renderTable);

window.addEventListener("load", loadData);
