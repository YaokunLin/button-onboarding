const express = require("express");
const { postgraphile } = require("postgraphile");
const app = express();
app.use(
    postgraphile("postgres://postgres:password@localhost:5432/todo_db", "todo_schema", 
        {
            watchPg: true,
            graphiql: true,
            enhanceGraphiql: true,
            allowExplain: true,
        }
    )
);

//http://localhost:8000/graphiql
app.listen(process.env.PORT || 8000);