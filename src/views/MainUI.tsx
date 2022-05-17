import React from 'react';
import {history} from '../router/router'
import {ConnectedRouter} from 'connected-react-router';
import {Header} from "./Header/Header";
import {Dashboard} from "./Dashboard/Dashboard";
import {
    Switch,
    Route,
    Redirect
} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import "../resources/css/styles.css"

export function MainUI() {

    return <>
        <ConnectedRouter history={history}>
            <div>
                <Header/>
                <Switch>
                    <Route exact path="/dashboard" render={() => <Dashboard/>}/>
                    <Redirect exact from="/" to="/dashboard"/>
                </Switch>
            </div>
        </ConnectedRouter>
    </>
}

