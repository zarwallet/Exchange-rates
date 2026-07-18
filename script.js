const tbody = document.getElementById("tbody");
const amountInput = document.getElementById("amount");
const searchInput = document.getElementById("search");

let countries = [];
let rates = {};

// ক্যাশিং কনফিগারেশন
const CACHE_KEY_RATES = "exchange_rates_cache";
const CACHE_KEY_COUNTRIES = "countries_cache";
const CACHE_KEY_LAST_UPDATE = "last_update_time";
const CACHE_DURATION = 30 * 60 * 1000; // ৩০ মিনিট

async function loadData() {
  try {
    // === Countries (এখন স্থির লিস্ট + ক্যাশ) ===
    const cachedCountries = localStorage.getItem(CACHE_KEY_COUNTRIES);
    
    if (cachedCountries) {
      countries = JSON.parse(cachedCountries);
      console.log("✅ Cached countries loaded");
    } else {
      // ফলব্যাক: জনপ্রিয় কারেন্সি লিস্ট (স্থির)
      countries = [
        { country: "United States", code: "USD" },
        { country: "Eurozone", code: "EUR" },
        { country: "United Kingdom", code: "GBP" },
        { country: "India", code: "INR" },
        { country: "Japan", code: "JPY" },
        { country: "China", code: "CNY" },
        { country: "Saudi Arabia", code: "SAR" },
        { country: "Canada", code: "CAD" },
        { country: "Australia", code: "AUD" },
        { country: "Singapore", code: "SGD" },
        { country: "Malaysia", code: "MYR" },
        { country: "UAE", code: "AED" },
        { country: "Pakistan", code: "PKR" },
        { country: "Nepal", code: "NPR" },
        { country: "Sri Lanka", code: "LKR" },
        { country: "Thailand", code: "THB" },
        { country: "South Korea", code: "KRW" }
      ];
      localStorage.setItem(CACHE_KEY_COUNTRIES, JSON.stringify(countries));
    }

    // === Exchange Rates Cache ===
    const cachedRates = localStorage.getItem(CACHE_KEY_RATES);
    const cacheTime = localStorage.getItem(CACHE_KEY_LAST_UPDATE);
    const now = Date.now();

    if (cachedRates && cacheTime && (now - parseInt(cacheTime) < CACHE_DURATION)) {
      rates = JSON.parse(cachedRates);
      console.log("✅ Cached rates loaded");
    } else {
      const rateRes = await fetch("https://open.er-api.com/v6/latest/BDT");
      const rateData = await rateRes.json();

      if (rateData.result === "success") {
        rates = rateData.rates;
        localStorage.setItem(CACHE_KEY_RATES, JSON.stringify(rates));
        localStorage.setItem(CACHE_KEY_LAST_UPDATE, now.toString());
        console.log("✅ Fresh rates loaded");
      }
    }

    renderTable();

  } catch (err) {
    console.error("Error:", err);
    if (Object.keys(rates).length > 0) {
      renderTable();
    } else {
      tbody.innerHTML = `
        <tr>
          <td colspan="3" style="text-align:center; color:red; padding:20px;">
            Unable to load data.<br>
            <small>Please check internet connection and refresh.</small>
          </td>
        </tr>`;
    }
  }
}

function renderTable() {
  const amount = Number(amountInput.value) || 100;
  const search = searchInput.value.toLowerCase().trim();

  tbody.innerHTML = "";

  const filtered = countries.filter(c =>
    c.country.toLowerCase().includes(search) || 
    c.code.toLowerCase().includes(search)
  );

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="3" style="text-align:center;">No matching currency found</td></tr>`;
    return;
  }

  filtered.forEach(c => {
    const rate = rates[c.code];
    if (!rate) return;

    const converted = (amount * rate).toFixed(2);

    tbody.innerHTML += `
      <tr>
        <td>${c.country}</td>
        <td><strong>${c.code}</strong></td>
        <td>${converted}</td>
      </tr>`;
  });
}

// Event Listeners
amountInput.addEventListener("input", renderTable);
searchInput.addEventListener("input", renderTable);

window.addEventListener("load", loadData);
