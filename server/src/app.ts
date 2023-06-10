import express, { Express } from 'express'
import cors from 'cors'

import todoRoutes from './routes'
import gamesRoutes from './routes/games'

import { Database } from 'sqlite3'
var md5 = require('md5')

const app: Express = express()
var db: Database = require("./db.js")
const PORT: string | number = process.env.PORT || 4000

app.use(cors())
app.use(todoRoutes)
app.use(gamesRoutes)

app.get("/api/users", (req, res, next) => {
    console.log('USERS')
    var sql = "select * from user"
    var params: any[] = []
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": rows
        })
    });
});

function makeid(length: number) {
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


app.post("/api/users", async (req, res, next) => {
    console.log('YERERE')
    var insert = 'INSERT INTO user (name, email, password) VALUES (?,?,?)'
    db.run(insert, ["admin", `${makeid(5)}@example.com`, md5("admin123456")])


    db.run("DELETE FROM user", (res, error) => {
        console.log(res)
        console.log('ok, i delete all users')
    })

    console.log('res done')
    res.status(200).json({})
    return;

});

app.listen(PORT, () =>
    console.log(`Server running on http://localhost:${PORT}`)
)