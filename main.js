import {
  getStatsByYear
} from "./src/utils/stats.js";
import {
  makeTables
} from "./src/utils/html.js";


const list = [
  await getStatsByYear("2023")
]

function runApp() {
  makeTables(list)
}

// Start application
runApp()