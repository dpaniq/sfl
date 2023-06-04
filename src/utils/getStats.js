export async function getStats(year) {
  return await fetch(`./sources/${year}.json`)
    .then(response => response.json())
    .then(data => {
      console.log(data)
      return data
    })
    .catch(error => {
      console.log(error)
      return {}
    });
}