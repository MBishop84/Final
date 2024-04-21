const PORT = process.env.PORT;

const app = require("./app");
const knex = require("./db/connection");

const listener = () => console.log(`Listening on Port ${PORT}!`);

knex.migrate
  .latest()
  .then((migrations) => {
    console.log("migrations", migrations);
    knex.seed.run();
    app.listen(PORT, listener);
  })
  .catch(console.error);