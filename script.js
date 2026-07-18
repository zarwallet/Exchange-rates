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
        { country: "Afghanistan", code: "AFN" },
        { country: "Albania", code: "ALL" },
        { country: "Algeria", code: "DZD" },
        { country: "Argentina", code: "ARS" },
        { country: "Australia", code: "AUD" },
        { country: "Bangladesh", code: "BDT" },
        { country: "Bahrain", code: "BHD" },
        { country: "Brazil", code: "BRL" },
        { country: "Canada", code: "CAD" },
        { country: "Chile", code: "CLP" },
        { country: "China", code: "CNY" },
        { country: "Colombia", code: "COP" },
        { country: "Czech Republic", code: "CZK" },
        { country: "Denmark", code: "DKK" },
        { country: "Egypt", code: "EGP" },
        { country: "Eurozone", code: "EUR" },
        { country: "United Kingdom", code: "GBP" },
        { country: "Hong Kong", code: "HKD" },
        { country: "Hungary", code: "HUF" },
        { country: "India", code: "INR" },
        { country: "Indonesia", code: "IDR" },
        { country: "Israel", code: "ILS" },
        { country: "Japan", code: "JPY" },
        { country: "Kenya", code: "KES" },
        { country: "Kuwait", code: "KWD" },
        { country: "Malaysia", code: "MYR" },
        { country: "Mexico", code: "MXN" },
        { country: "Morocco", code: "MAD" },
        { country: "Nepal", code: "NPR" },
        { country: "New Zealand", code: "NZD" },
        { country: "Nigeria", code: "NGN" },
        { country: "Norway", code: "NOK" },
        { country: "Oman", code: "OMR" },
        { country: "Pakistan", code: "PKR" },
        { country: "Peru", code: "PEN" },
        { country: "Philippines", code: "PHP" },
        { country: "Poland", code: "PLN" },
        { country: "Qatar", code: "QAR" },
        { country: "Romania", code: "RON" },
        { country: "Russia", code: "RUB" },
        { country: "Saudi Arabia", code: "SAR" },
        { country: "Singapore", code: "SGD" },
        { country: "South Africa", code: "ZAR" },
        { country: "South Korea", code: "KRW" },
        { country: "Sri Lanka", code: "LKR" },
        { country: "Sweden", code: "SEK" },
        { country: "Switzerland", code: "CHF" },
        { country: "Thailand", code: "THB" },
        { country: "Turkey", code: "TRY" },
        { country: "United Arab Emirates", code: "AED" },
        { country: "United States", code: "USD" },
        { country: "Vietnam", code: "VND" },
        { country: "Ukraine", code: "UAH" },
        { country: "Uganda", code: "UGX" },
        { country: "Tanzania", code: "TZS" },
        { country: "Tunisia", code: "TND" },
        { country: "Trinidad and Tobago", code: "TTD" },
        { country: "Venezuela", code: "VES" },
        { country: "Zambia", code: "ZMW" },
        { country: "Zimbabwe", code: "ZWL" }
      ];
      localStorage.setItem(CACHE_KEY_COUNTRIES, JSON.stringify(countries));
    }

    // Fetch rates based on BDT
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
  const zarMultiplier = Number(amountInput.value) || 1;
  const baseBDT = 100;
  const searchTerm = searchInput.value.toLowerCase().trim();

  tbody.innerHTML = "";

  const filtered = countries.filter(c => 
    c.country.toLowerCase().includes(searchTerm) || 
    c.code.toLowerCase().includes(searchTerm)
  );

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="3" style="text-align:center; padding:20px;">No results found</td></tr>`;
    return;
  }

  filtered.forEach(c => {
    const rate = rates[c.code];
    if (!rate) return;

    const finalRate = (baseBDT * rate * zarMultiplier).toFixed(2);

    tbody.innerHTML += `
      <tr>
        <td>${c.country}</td>
        <td><strong>${c.code}</strong></td>
        <td>${finalRate}</td>
      </tr>`;
  });

  lastUpdated.textContent = `Last updated: ${new Date().toLocaleString()}`;
}

// Event Listeners
amountInput.addEventListener("input", renderTable);
searchInput.addEventListener("input", renderTable);

window.addEventListener("load", loadData);
