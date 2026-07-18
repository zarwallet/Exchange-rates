const tbody = document.getElementById("tbody");
const amountInput = document.getElementById("amount");
const searchInput = document.getElementById("search");

let countries = [];
let rates = {};

async function loadData() {
  try {
    const countryRes = await fetch("https://restcountries.com/v3.1/all?fields=name,currencies");
    const countryData = await countryRes.json();

    const rateRes = await fetch("https://open.er-api.com/v6/latest/BDT");
    const rateData = await rateRes.json();

    rates = rateData.rates;

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

    renderTable();

  } catch (err) {
    tbody.innerHTML =
      "<tr><td colspan='3'>Failed to load exchange rates.</td></tr>";
  }
}

function renderTable() {

  const amount = Number(amountInput.value) || 100;
  const search = searchInput.value.toLowerCase();

  tbody.innerHTML = "";

  countries
    .filter(c =>
      c.country.toLowerCase().includes(search) ||
      c.code.toLowerCase().includes(search)
    )
    .forEach(c => {

      const rate = rates[c.code];

      if (!rate) return;

      tbody.innerHTML += `
      <tr>
        <td>${c.country}</td>
        <td>${c.code}</td>
        <td>${(amount * rate).toFixed(2)}</td>
      </tr>`;
    });

}

amountInput.addEventListener("input", renderTable);
searchInput.addEventListener("input", renderTable);

loadData();
