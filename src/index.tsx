import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { BrowserRouter as Router, Route, Link, Switch, Redirect } from "react-router-dom";
import * as serviceWorker from './serviceWorker';
import Dashboard from './components/Dashboard/Dashboard';
import SpotifyLandingPage from './components/Spotify/SpotifyLandingPage/SpotifyLandingPage';
import SpotifyAuth from './components/Spotify/SpotifyAuth/SpotifyAuth';

const Routes = 
    <Router>
        <div>
            <Switch>
                <Route path="/" exact render={() => {
                    console.log('Access Token Status: ' + localStorage.getItem('access_token'));
                    if (localStorage.getItem('access_token') === null) {
                        return <Redirect to="/spotify/"/>
                    }
                    return <Dashboard/>
                }} />
                <Route path="/spotify/auth/" component={SpotifyAuth} />
                <Route path="/spotify" component={SpotifyLandingPage} />
                <Route path="/dashboard/" component={Dashboard} />
            </Switch>
        </div>
    </Router>
ReactDOM.render(Routes, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
