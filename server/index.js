// imports here for express and pg
const express = require(`express`);
const app = express();
const path = require(`path`);
const PORT = 3000;
const pg = require(`pg`);
const client = new pg.Client(
  process.env.DATABASE_URL || `postgres://localhost/acme_notes_db`
);

// static routes here (you only need these for deployment)

// app routes here
app.get("/api/notes", async (req, res, next) => {
  try {
    const SQL = `;
        SELECT * FROM notes;
    `;
    const response = await client.query(SQL);
    res.send(response.rows);
  } catch (error) {
    console.error(error);
  }
});

app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "../client/dist/index.html"))
);

app.use(express.static(path.join(__dirname, "../client/dist")));

// create your init function
const init = async () => {
  try {
    await client.connect();
    const SQL = `DROP TABLE IF EXISTS notes;
    CREATE TABLE notes(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    txt VARCHAR(255),
    starred BOOLEAN DEFAULT FALSE);
    INSERT INTO notes(txt, starred) VALUES('learn express', false);
    INSERT INTO notes(txt, starred) VALUES('write SQL queries', true);
    INSERT INTO notes(txt) VALUES('create routes');
    `;
    await client.query(SQL);
    console.log(`data seeded`);
    app.listen(PORT, () =>
      console.log(`I am listening to port number ${PORT}`)
    );
  } catch (error) {
    console.error(error);
  }
};
// init function invocation
init();
