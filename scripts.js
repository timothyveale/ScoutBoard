async function loadData() {
  const sparData = await fetch('spar_extended_data.json').then(res => res.json());

  populateFilters(sparData);
  renderTable(sparData);

  document.querySelectorAll('select').forEach(select => {
    select.addEventListener('change', () => {
      const filtered = filterData(sparData);
      renderTable(filtered);
    });
  });
}

function populateFilters(data) {
  const getUniqueSorted = key => [...new Set(data.map(d => d[key]))].filter(v => v !== null).sort();

  fillSelect('teamFilter', getUniqueSorted('Draft Team'), 'All Teams');
  fillSelect('yearFilter', getUniqueSorted('Draft Year'), 'All Years');
  fillSelect('roundFilter', getUniqueSorted('Round'), 'All Rounds');
  fillSelect('positionFilter', getUniqueSorted('Position Type'), 'All Positions');
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
  return data.filter(d =>
    (!team || d['Draft Team'] === team) &&
    (!year || d['Draft Year'].toString() === year) &&
    (!round || d['Round'].toString() === round) &&
    (!position || d['Position Type'] === position)
  );
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
