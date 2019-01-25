import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom';
import './index.css';
import App from './components/App';
import Signin from './components/Auth/Signin';
import Signup from './components/Auth/Signup';
import Search from './components/Recipe/Search';
import AddRecipe from './components/Recipe/AddRecipe';
import withSession from './components/withSession';
import NavBar from './components/NavBar';
import Profile from './components/Profile/Profile'
import RecipePage from './components/Recipe/RecipePage';

import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

const client = new ApolloClient({
    uri: 'http://localhost:9999/graphql',
    // uri: "https:/react-apollo-recipes-1.herokuapp.com/graphql",
    fetchOptions: {
        credentials: 'include'
    },
    request: operation => {
        const token = localStorage.getItem('token');
        // add the authorization to the headers
        operation.setContext({
            headers: {
                authorization: token,
            }
        })
    },
    onError: ({ networkError }) => {
        if (networkError) {
            // console.log('NEtwork Error', networkError);
        }
    }
});

const Root = ({ refetch, session }) => (
    <Router>
        <>
            <NavBar session={session} />
            <Switch>
                <Route path="/" exact component={App} />
                <Route path="/search" component={Search} />
                <Route path="/profile" render={() => <Profile session={session} />} />
                <Route path="/recipe/add" render={(props) => <AddRecipe session={session} history={props.history} />} />
                <Route path="/recipes/:_id" component={RecipePage} />
                <Route path="/signin" render={(props) => <Signin refetch={refetch} history={props.history} />} />
                <Route path="/signup" render={(props) => <Signup refetch={refetch} history={props.history} />}/>
                <Redirect to="/" />
            </Switch>
        </>
    </Router>
)

const RootWithSession = withSession(Root)

ReactDOM.render(
    <ApolloProvider client={client}>
        <RootWithSession />
    </ApolloProvider>,
    document.getElementById('root')
);

