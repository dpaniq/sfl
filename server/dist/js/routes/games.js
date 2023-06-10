"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sfl_json_1 = __importDefault(require("../sources/sfl.json"));
const date_fns_1 = require("date-fns");
const router = (0, express_1.Router)();
router.get('/migration/:year', (req, res) => {
    console.log(req.params);
    console.log(req.query);
    const { year } = req.params;
    const startSeason = new Date(`${year}-12-01`);
    const initialSaturday = (0, date_fns_1.isSaturday)(startSeason)
        ? startSeason
        : (0, date_fns_1.nextSaturday)(startSeason);
    const games = sfl_json_1.default[year];
    if (games) {
        for (const [name, player] of Object.entries(games)) {
            // for (const game in range(player.games)) {
            //   console.log()
            // }
            let leftGames = player.games;
            let dateGame = initialSaturday;
            do {
                console.log(`${name} played on ${dateGame}`);
                dateGame = (0, date_fns_1.previousSaturday)(dateGame);
                leftGames--;
            } while (leftGames);
            break;
        }
    }
    console.log(startSeason);
    console.log(year);
    new Date();
    res.status(200).json(sfl_json_1.default[year]);
});
// router
exports.default = router;
