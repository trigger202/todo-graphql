var express = require('express');
var cors = require('cors');
var path = require('path');
// const Schema = require('./dgraph/Schema');

var express = require('express');
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Query {
    Todo(id : String ): Todo
    Todos:[Todo]
  }
  type Todo {
      title:String!
      body:String!
      complete: Boolean!
  }
`);

const todoList = [
  {
    title: 'Clean room',
    body: 'make sure I do this this task (Clean room)',
    complete: false,
  },
  {
    title: 'Read about GraphQL',
    body: 'make sure I do this this task (GraphQL)',
    complete: false,
  },

  {
    title: 'Read for 10mins',
    body: 'make sure I do this this task (Read)',
    complete: false,
  },
];
// The root provides a resolver function for each API endpoint
var root = {
  Todo: ({ id }) => {
    if (id) {
      return todoList.find((item) => item.title === id);
    } else {
      return todoList[0];
    }
  },
  Todos: (root, args, context) => {
    return todoList;
  },
};

const OpenApiValidator = require('express-openapi-validator').OpenApiValidator;

const app = express();
const PORT = 9595;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

//enable pre-flight across-the-board
app.options('*', cors());

app.use(express.static(path.join(__dirname, 'public')));
const spec = path.join(__dirname, 'openapi.yaml');
app.use('/spec', express.static(spec));

// 1. Install the OpenApiValidator on your express app
new OpenApiValidator({
  apiSpec: './openapi.yaml',
});

app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);

app.listen(PORT, function () {
  console.log(`Listening on ${PORT}`);
});
