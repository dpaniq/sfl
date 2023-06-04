import {
  getStats
} from "./src/utils/stats.js";
import {
  makeTables
} from "./src/utils/html.js";

async function runApp() {
  makeTables(await getStats())
}

// Start application
runApp()