const express = require('express');
const {graphqlHTTP} = require('express-graphql');
const cors = require("cors");
const schema = require('./schema');
const { upload } = require('./crud');
const uploadServer = require('apollo-upload-server');

const { apolloUploadExpress } = uploadServer;

const app = express();

app.use(cors());

app.use(
    '/graphql',
    apolloUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }),
    graphqlHTTP({
        schema,
        graphiql: true
    }));

app.listen(8081, () => {
    // query response
})

