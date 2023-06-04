export async function getStats(year) {
  return await fetch(`./sources/sfl.json`)
    .then(response => response.json())
    .then(data => {
      console.log(data)
      return data
    })
    .then(data => {
      const years = {}

      for (const [year, list] of Object.entries(data)) {
        years[year] = mapStatsToFront(list)
      }

      return years
    })
    .then(data => {
      console.log(data)
      return data
    })
    .catch(error => {
      console.log(error)
      return {}
    });
}


/**
 * From
 * {
    "С.Фёдоров": {
      "И": 16,
      "Г": 16,
      "П": 30,
      "О": 46,
      "+/-": 18,
      "MVP": 0
    }
  }

  To
  {
    name: '',
    games: 0,
    passes: 0,
    points: 0,
    totalScore: 0,
    totalMVP: 0
  }
 */
function mapStatsToFront(rows) {
  return Object.entries(rows).reduce((acc, [name, values]) => {
    return [...acc, mapPlayerStats(name, values)]
  }, [])
}

function mapPlayerStats(name, values) {
  return {
    name,
    games: values["И"], // Игр
    passes: values["П"], // Пасов
    points: values["О"], // Очков
    totalScore: values["+/-"], // Очков за все
    totalMVP: values["MVP"]
  }
}