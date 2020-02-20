import React, { useContext } from "react";
import { Context } from "./data/Context";
import { Route, Redirect, Switch, withRouter } from "react-router-dom";
import { TopMenu } from "./TopMenu";
import { SignIn } from "./pages/SignIn";
import { Fatal } from "./Fatal";
import { EConfirm } from "./EConfirm";
import { Lobby } from "./pages/Lobby";
import { Account } from "./pages/Account";
import { MyRoom } from "./pages/MyRoom";

const TopMenuWithRouter = withRouter(TopMenu);

export function Home(props) {
    const context = useContext(Context);
    let routes = [];
    if(context.jwt){
        routes.push(<Route key="lobby" path="/lobby/:page(\d+)" exact={true} component={Lobby} />);
        if(context.registered){
            routes.push(<Route key="account" path="/account" exact={true} component={Account} />);
            routes.push(<Route key="myroom" path="/myroom" exact={true} component={MyRoom} />);
        }
        routes.push(<Redirect key="tolobby" to="/lobby/1" />);
    } else routes.push(<Redirect key="tosign" to="/signin/guest" />);
    return <>
        {
            context.jwt && <TopMenuWithRouter />
        }
        <Switch>
            {
                !context.registered && <Route path="/signin/:as" component={SignIn} />
            }
            <Route path="/fatal" component={Fatal} />
            <Route path="/econfirm/:number(\d{9})" exact={true} strict={true} component={EConfirm} />
            {routes}
        </Switch>
    </>
}