import {
  getStats
} from "./src/utils/getStats.js";

console.log('Start application')

const list = {
  2023: await getStats("2023")
}

console.log(list)


console.log('Application stopped')