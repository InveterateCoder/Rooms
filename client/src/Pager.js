import React, { useContext, useState } from "react";
import { Context } from "./data/Context";
import { Route, Switch, Redirect, withRouter } from "react-router-dom";
import { TopMenu } from "./TopMenu";
import { Lobby } from "./pages/Lobby";
import { Account } from "./pages/Account";
import { MyRoom } from "./pages/MyRoom";

const TopMenuWithRouter = withRouter(TopMenu);
export function Pager(props) {
    const context = useContext(Context);
    if (!context.jwt) {
        props.history.replace("/signin/guest");
        return null;
    }
    return <>
        <TopMenuWithRouter />
        <Switch>
            <Route path="/lobby/:page([1-9]\d*)" exact={true} component={Lobby} />
            <Route path="/account" exact={true} component={Account} />
            <Route path="/myroom" exact={true} component={MyRoom} />
            <Redirect to="/lobby/1" />
        </Switch>
    </>
}