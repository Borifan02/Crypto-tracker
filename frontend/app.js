const coinsBody = document.getElementById('coinsBody');
const refreshBtn = document.getElementById('refreshBtn');
const searchInput = document.getElementById('search');
const filterSelect = document.getElementById('filter');
const detailTitle = document.getElementById('detailTitle');
const chartDays = document.getElementById('chartDays');
const priceChartCanvas = document.getElementById('priceChart');

let coinsData = [];
let priceChart;

// Fetch top 10 coins from backend
async function fetchCoins() {
  try {
    const res = await fetch('/api/coins');
    if (!res.ok) throw new Error('Failed to fetch coins');
    coinsData = await res.json();
    displayCoins(coinsData);
  } catch (err) {
    coinsBody.innerHTML = `<tr><td colspan="7">Failed to load data. Make sure backend is running.</td></tr>`;
    console.error(err);
  }
}

// Display coins in table
function displayCoins(data) {
  coinsBody.innerHTML = '';
  data.forEach((coin, i) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${i+1}</td>
      <td>${coin.name} (${coin.symbol.toUpperCase()})</td>
      <td>$${coin.current_price.toLocaleString()}</td>
      <td style="color:${coin.price_change_percentage_24h >=0 ? 'limegreen':'red'}">${coin.price_change_percentage_24h.toFixed(2)}%</td>
      <td>$${coin.market_cap.toLocaleString()}</td>
      <td>$${coin.total_volume.toLocaleString()}</td>
      <td><canvas id="spark${i}" width="100" height="30"></canvas></td>
    `;
    coinsBody.appendChild(tr);

    // Sparkline chart
    const ctx = document.getElementById(`spark${i}`).getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: coin.sparkline_in_7d.price.map((_, idx) => idx),
        datasets: [{
          data: coin.sparkline_in_7d.price,
          borderColor: 'cyan',
          borderWidth: 1,
          fill: false,
          pointRadius: 0
        }]
      },
      options: { responsive: false, plugins: { legend: { display: false } }, elements: { line: { tension: 0.3 } }, scales: { x: { display: false }, y: { display: false } } }
    });

    // Click row to show main chart
    tr.addEventListener('click', () => loadCoinChart(coin.id, coin.name));
  });
}

// Load detailed chart for selected coin
async function loadCoinChart(coinId, coinName) {
  try {
    detailTitle.textContent = `${coinName} Price Chart`;
    const days = chartDays.value;
    const res = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`);
    const data = await res.json();
    const labels = data.prices.map(p => new Date(p[0]).toLocaleDateString());
    const prices = data.prices.map(p => p[1]);

    if(priceChart) priceChart.destroy();

    const ctx = priceChartCanvas.getContext('2d');
    priceChart = new Chart(ctx, {
      type: 'line',
      data: { labels, datasets: [{ label: coinName, data: prices, borderColor:'lime', backgroundColor:'rgba(0,255,0,0.1)', fill:true }] },
      options: { responsive:true, plugins:{ legend:{ display:true } } }
    });
  } catch(err){
    console.error(err);
    detailTitle.textContent = `Failed to load chart for ${coinName}`;
  }
}

// Event listeners
refreshBtn.addEventListener('click', fetchCoins);
searchInput.addEventListener('input', () => {
  const term = searchInput.value.toLowerCase();
  displayCoins(coinsData.filter(c => c.name.toLowerCase().includes(term) || c.symbol.toLowerCase().includes(term)));
});
filterSelect.addEventListener('change', () => {
  let filtered = [...coinsData];
  if(filterSelect.value==='gainers') filtered.sort((a,b)=>b.price_change_percentage_24h-a.price_change_percentage_24h);
  if(filterSelect.value==='losers') filtered.sort((a,b)=>a.price_change_percentage_24h-a.price_change_percentage_24h);
  if(filterSelect.value==='topcap') filtered.sort((a,b)=>b.market_cap-a.market_cap);
  displayCoins(filtered);
});
chartDays.addEventListener('change', () => {
  const coinName = detailTitle.textContent.split(' Price Chart')[0];
  const coin = coinsData.find(c => c.name===coinName);
  if(coin) loadCoinChart(coin.id, coin.name);
});

// Initial fetch
fetchCoins();
