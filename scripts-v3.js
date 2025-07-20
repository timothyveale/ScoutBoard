
let data = [];

async function loadData() {
  data = await fetch('spar_extended_data.json').then(res => res.json());
  populateYearFilter(data);
  updateStandings();

  document.getElementById('yearFilter').addEventListener('change', updateStandings);
}

function populateYearFilter(data) {
  const yearSet = [...new Set(data.map(d => d['Draft Year']))].sort((a, b) => a - b);
  const select = document.getElementById('yearFilter');
  yearSet.forEach(year => {
    const option = document.createElement('option');
    option.value = year;
    option.textContent = year;
    select.appendChild(option);
  });
}

function updateStandings() {
  const selectedYears = Array.from(document.getElementById('yearFilter').selectedOptions)
    .map(opt => parseInt(opt.value));

  const filteredData = selectedYears.length
    ? data.filter(d => selectedYears.includes(d['Draft Year']))
    : data;

  const teamMap = {};

  filteredData.forEach(player => {
    const team = player['Draft Team'];
    const spar = parseFloat(player['Career SPAR']) || 0;

    if (!teamMap[team]) {
      teamMap[team] = { team, totalSPAR: 0, count: 0 };
    }

    teamMap[team].totalSPAR += spar;
    teamMap[team].count += 1;
  });

  const sortedTeams = Object.values(teamMap).sort((a, b) => b.totalSPAR - a.totalSPAR);

  const tbody = document.querySelector('#standingsTable tbody');
  tbody.innerHTML = sortedTeams.map(row => `
    <tr>
      <td>${row.team}</td>
      <td>${row.totalSPAR.toFixed(1)}</td>
      <td>${row.count}</td>
    </tr>
  `).join('');
}

window.onload = loadData;
