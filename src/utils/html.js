// H
function makeH(num, textContent) {
  const h = document.createElement(`h${num}`) // h2
  h.textContent = textContent
  return h
}

// Table
export function makeTables(list) {
  const sectionTables = document.getElementById('tables');
  for (const [year, rows] of Object.entries(list)) {
    const table = makeTable(year, rows)
    sectionTables.appendChild(table)
    table.before(makeH(2, `Table for ${year}`))
  }
}


function makeTable(year, rows) {
  const table = document.createElement('table')
  table.setAttribute('data-year', year)
  table.appendChild(makeThead())
  table.appendChild(makeTbody(rows))
  return table
}


function makeThead() {
  const thead = document.createElement('thead')
  const tr = makeTr(['/', 'Игр', 'Passes:', 'Points:', 'Score:', 'MVP:'], true)
  thead.appendChild(tr)
  return thead
}


function makeTbody(rows) {
  const tbody = document.createElement('tbody')

  for (const row of rows) {
    tbody.appendChild(makeTr([
      row.name,
      row.games,
      row.passes,
      row.points,
      row.totalScore,
      row.totalMVP
    ]))
  }
  return tbody
}


function makeTr(tdContentArray, isHead = false) {
  const tr = document.createElement('tr')

  for (const tdContent of tdContentArray) {
    if (isHead) {
      tr.appendChild(makeTh(tdContent))
    } else {
      tr.appendChild(makeTd(tdContent))
    }
  }

  return tr
}

function makeTh(content) {
  const th = document.createElement('th')
  th.textContent = content
  return th
}

function makeTd(content) {
  const td = document.createElement('td')
  td.textContent = content
  return td
}

function makeHr() {
  return document.createElement('hr')
}