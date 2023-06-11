const CREATE_TABLE_GAMES = `
  CREATE TABLE games (
    saturday DATE,
    id INTEGER NOT NULL,
    goals SMALLINT,
    passes SMALLINT,
    mvp BOOLEAN,
    FOREIGN KEY(id) REFERENCES users(id)
  )
`;

function setGame(id: number, date: Date,) {
  const query = 'INSERT INTO user (name, email, password) VALUES (?,?,?)'
  return []
}