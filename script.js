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
    // === Countries Cache (খুব কম পরিবর্তন হয়) ===
    const cachedCountries = localStorage.getItem(CACHE_KEY_COUNTRIES);
    
    if (cachedCountries) {
      countries = JSON.parse(cachedCountries);
    } else {
      const countryRes = await fetch("https://restcountries.com/v3.1/all?fields=name,currencies");
      const countryData = await countryRes.json();

      countries = countryData
        .filter(c => c.currencies)
        .map(c => {
          const code = Object.keys(c.currencies)[0];
          return {
            country: c.name.common,
            code: code
          };
        })
        .sort((a, b) => a.country.localeCompare(b.country));

      localStorage.setItem(CACHE_KEY_COUNTRIES, JSON.stringify(countries));
    }

    // === Exchange Rates Cache (প্রতি ৩০ মিনিটে আপডেট) ===
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
        console.log("✅ Fresh rates loaded and cached");
      }
    }

    renderTable();

  } catch (err) {
    console.error("Error:", err);
    
    // ক্যাশে থাকলে তবুও দেখাবে
    if (Object.keys(rates).length > 0) {
      renderTable();
    } else {
      tbody.innerHTML = `
        <tr>
          <td colspan="3" style="text-align:center; color:red;">
            Failed to load exchange rates.<br>
            <small>Please check your internet connection.</small>
          </td>
        </tr>`;
    }
  }
}

function renderTable() {
  const amount = Number(amountInput.value) || 100;
  const search = searchInput.value.toLowerCase().trim();

  tbody.innerHTML = "";
