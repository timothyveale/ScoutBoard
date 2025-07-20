let currentSort = { column: null, ascending: true };
let currentData = [];

async function loadData() {
  const sparData = await fetch('spar_extended_data.json').then(res => res.json());

  currentData = sparData;
  populateFilters(sparData);
  renderTable(sparData);

  document.querySelectorAll('select, input').forEach(input => {
    input.addEventListener('input', () => {
      const filtered = filterData(sparData);
      currentData = filtered;
      renderTable(filtered);
    });
  });

  document.querySelectorAll('#dataTable thead th').forEach((th, index) => {
    th.addEventListener('click', () => {
      const key = th.dataset.key;
      if (!key) return;
      if (currentSort.column === key) {
        currentSort.ascending = !currentSort.ascending;
      } else {
        currentSort = { column: key, ascending: true };
      }
      const sorted = sortData([...currentData], key, currentSort.ascending);
      renderTable(sorted);
    });
  });
}

function populateFilters(data) {
  const getUniqueSorted = key => [...new Set(data.map(d => d[key]))].filter(v => v !== null).sort();

  fillSelect('teamFilter', getUniqueSorted('Draft Team'), 'Any Team');
  fillSelect('yearFilter', getUniqueSorted('Draft Year'), 'Any Year');
  fillSelect('roundFilter', getUniqueSorted('Round'), 'Any Round');
  fillSelect('positionFilter', getUniqueSorted('Position Type'), 'Any Position');
  fillSelect('playerFilter', getUniqueSorted('Player'), 'Any Player');
  fillSelect('draftPosFilter', getUniqueSorted('Draft Position'), 'Any Position');
}

function fillSelect(id, items, allLabel) {
  const select = document.getElementById(id);
  select.innerHTML = `<option value="">${allLabel}</option>` + items.map(i => `<option value="${i}">${i}</option>`).join('');
}

function filterData(data) {
  const team = document.getElementById('teamFilter').value;
  const year = document.getElementById('yearFilter').value;
  const round = document.getElementById('roundFilter').value;
  const position = document.getElementById('positionFilter').value;
  const player = document.getElementById('playerFilter').value;
  const draftPos = document.getElementById('draftPosFilter').value;
  const sparMin = parseFloat(document.getElementById('sparMinFilter').value);
  const sparMax = parseFloat(document.getElementById('sparMaxFilter').value);

  return data.filter(d =>
    (!team || d['Draft Team'] === team) &&
    (!year || d['Draft Year'].toString() === year) &&
    (!round || d['Round'].toString() === round) &&
    (!position || d['Position Type'] === position) &&
    (!player || d['Player'] === player) &&
    (!draftPos || d['Draft Position'] === draftPos) &&
    (isNaN(sparMin) || parseFloat(d['Career SPAR']) >= sparMin) &&
    (isNaN(sparMax) || parseFloat(d['Career SPAR']) <= sparMax)
  );
}

function sortData(data, key, ascending) {
  return data.sort((a, b) => {
    let valA = a[key], valB = b[key];
    if (!isNaN(valA) && !isNaN(valB)) {
      valA = parseFloat(valA);
      valB = parseFloat(valB);
    } else {
      valA = valA?.toString().toLowerCase();
      valB = valB?.toString().toLowerCase();
    }
    if (valA < valB) return ascending ? -1 : 1;
    if (valA > valB) return ascending ? 1 : -1;
    return 0;
  });
}

function renderTable(data) {
  const tbody = document.querySelector('#dataTable tbody');
  tbody.innerHTML = data.map(d => `
    <tr>
      <td>${d.Player}</td>
      <td>${d['Draft Year']}</td>
      <td>${d['Draft Team']}</td>
      <td>${d.Round}</td>
      <td>${d['Overall Pick']}</td>
      <td>${d['Draft Position']}</td>
      <td>${d['First NHL Season'] || ''}</td>
      <td>${d['Last NHL Season'] || ''}</td>
      <td>${d.Position}</td>
      <td>${d['Position Type']}</td>
      <td>${d['Career SPAR']}</td>
      <td>${d['Total SPAR']}</td>
      <td>${d['Players Drafted']}</td>
    </tr>`).join('');
}

window.onload = loadData;
