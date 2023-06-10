"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./routes"));
const games_1 = __importDefault(require("./routes/games"));
var md5 = require('md5');
const app = (0, express_1.default)();
var db = require("./db.js");
const PORT = process.env.PORT || 4000;
app.use((0, cors_1.default)());
app.use(routes_1.default);
app.use(games_1.default);
app.get("/api/users", (req, res, next) => {
    console.log('USERS');
    var sql = "select * from user";
    var params = [];
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": rows
        });
    });
});
function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}
console.log(makeid(5));
app.post("/api/users", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('YERERE');
    var insert = 'INSERT INTO user (name, email, password) VALUES (?,?,?)';
    db.run(insert, ["admin", `${makeid(5)}@example.com`, md5("admin123456")]);
    db.run("DELETE FROM user", (res, error) => {
        console.log(res);
        console.log('ok, i delete all users');
    });
    console.log('res done');
    res.status(200).json({});
    return;
}));
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
