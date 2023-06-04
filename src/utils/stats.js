export async function getStatsByYear(year) {
  return await fetch(`./sources/${year}.json`)
    .then(response => response.json())
    .then(mapStatsToFront)
    .then(data => {
      console.log(data)
      return data
    })
    .catch(error => {
      console.log(error)
      return {}
    });
}

function mapStatsToFront(object) {
  return Object.entries(object).reduce((acc, values) => {

    return acc
  }), [])
}

function mapPlayerStats(name, values) {
  return {
    name,
    games: values["И"],
    passes: values["П"],
    points: values["О"],
    totalScore: values["+/-"],
    totalMVP: values["MVP"]
  }
}


// Example From
const from = {
  "С.Фёдоров": {
    "И": 16,
    "Г": 16,
    "П": 30,
    "О": 46,
    "+/-": 18,
    "MVP": 0
  }
}

// To
const to = {
  name: '<name></name>',
  games: 0,
  passes: 0,
  points: 0,
  totalScore: 0,
  totalMVP: 0
}