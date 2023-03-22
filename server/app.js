const express = require("express");
const { postgraphile } = require("postgraphile");
const cors = require('cors');
const app = express();
app.use(cors());

app.use(
    postgraphile("postgres://postgres:password@localhost:5432/todo_db", "todo_schema", 
        {
            watchPg: true,
            graphiql: true,
            enhanceGraphiql: true,
            allowExplain: true,
            exportGqlSchemaPath:"schema.graphql"
        }
    )
);

//http://localhost:8000/graphiql
app.listen(process.env.PORT || 8000);