// Table
export function makeTables(list) {
  for (const [year, rows] of Object.entries(list)) {
    const table = makeTable(year, rows)
    document.getElementById('tables').appendChild(table)
  }
}


function makeTable(year, rows) {
  const table = document.createElement('table')
  table.appendChild(makeThead())
  table.appendChild(makeTbody(rows))
  return table
}


function makeThead() {
  const thead = document.createElement('thead')
  const tr = makeTr(['', 'Games:', 'Passes:', 'Points:', 'Score:', 'MVP:'])
  thead.appendChild(tr)
  return thead
}


function makeTbody(rows) {
  const tbody = document.createElement('tbody')

  for (const row of rows) {
    tbody.appendChild(makeTr(row))
  }

  tbody.appendChild(tr)
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