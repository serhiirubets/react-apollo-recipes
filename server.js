const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools')

// Mongo models
const Recipe = require('./models/Recipe');
const User = require('./models/User');

// For graphql schema
const { typeDefs } = require('./schema');
const { resolvers } = require('./resolvers');

require('dotenv').config();

const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
})

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log('DB connected'))
    .catch((error) => console.error(error));


const app = express();

app.use(cors({
    credentials: true,
    origin: '*'
}));

// Set up JWT authentication middleware
app.use(async (req, res, next) => {
    const token = req.headers.authorization;
    if (token !== 'null') {
        try {
            const currentUser = await jwt.verify(token, process.env.SECRET);
            req.currentUser = currentUser;
        } catch (error) {
            console.error('error');
        }
    }

    next();
});

// Create GraphiQL application
// app.use('/graphiql', graphiqlExpress({endpointURL: '/graphql'}))

// Connect schemas with Graphql
app.use('/graphql', bodyParser.json(), graphqlExpress(({ currentUser }) => ({
    schema,
    context: {
        Recipe,
        User,
        currentUser
    }
})))

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    })
}
const PORT = process.env.PORT || 4444;

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});