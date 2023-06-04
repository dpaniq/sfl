export async function getStats() {
  return fetch('./sfl.json')
    .then(async response => response.json())
    .then(data => {
      console.log(data);
      return data;
    })
    .then(data => {
      const years = {};

      for (const [year, list] of Object.entries(data)) {
        years[year] = mapStatsToFront(list);
      }

      return years;
    })
    .then(data => {
      console.log(data);
      return data;
    })
    .catch(error => {
      console.log(error);
      return {};
    });
}

export async function getStatsByYear(year: string): Promise<any> {
  const stats = await getStats() as any
  console.log(stats)
  return stats?.[year];
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
  return Object.entries(rows).reduce((acc, [name, values]) => [...acc, mapPlayerStats(name, values)], []);
}

function mapPlayerStats(name, values) {
  return {
    name,
    games: values['И'], // Игр
    passes: values['П'], // Пасов
    points: values['О'], // Очков
    totalScore: values['+/-'], // Очков за все
    totalMVP: values.MVP,
  };
}
