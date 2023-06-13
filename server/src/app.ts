
import "reflect-metadata"
import express, { Express } from 'express'
import cors from 'cors'

// import todoRoutes from './routes'
import gamesRoutes from './routes/games'
import usersRoutes from './routes/users'

import { makeId } from '@utils/string'
import md5 from 'md5';
import { Database } from './db'

const app: Express = express()

const PORT: string | number = process.env.PORT || 4000

app.use(cors())
// app.use(todoRoutes)
app.use(gamesRoutes, usersRoutes)

app.get("/api/users", (req, res, next) => {
    console.log('USERS')
    var sql = "select * from user"
    var params: any[] = []
    Database.all(sql, params, (err, rows) => {
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



app.post("/api/users", async (req, res, next) => {
    console.log('YERERE')
    var insert = 'INSERT INTO user (name, email, password) VALUES (?,?,?)'
    db.run(insert, ["admin", `${makeId(5)}@example.com`, md5("admin123456")])

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