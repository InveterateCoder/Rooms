import React, { Component } from 'react';
import { Context } from "./data/Context";
import { BrowserRouter as Router, Route, Switch, Redirect, withRouter } from "react-router-dom";
import { Lobby } from "./pages/Lobby";
import { Account } from "./pages/Account";
import { MyRoom } from "./pages/MyRoom";
import { TopMenu } from "./TopMenu";
import { SignIn } from "./pages/SignIn";
import { Fatal } from "./Fatal";
import { EConfirm } from "./EConfirm";

const TopMenuWithRouter = withRouter(TopMenu);

export default class App extends Component {
    constructor(props) {
        super(props);
        let filters = localStorage.getItem("filters");
        filters = filters ? JSON.parse(filters) : {};
        //en: "English",
        //ru: "Русский"
        this.state = {
            jwt: localStorage.getItem("jwt"),
            registered: localStorage.getItem("registered"),
            name: "Arthur",
            room: {
                name: "",
                description: "",
                country: "gb",
                password: "",
                limit: 20
            },
            lang: localStorage.getItem("lang") || this.bestLang(),
            filters: filters,
            icon: localStorage.getItem("icon") || "user"
        }
    }
    bestLang = () => {
        let navlang = navigator.language.toLowerCase();
        if (navlang === "ru" ||
            navlang === "kk" || navlang === "ky" ||
            navlang === "be" || navlang === "uk" ||
            navlang === "uz" || navlang === "mo" ||
            navlang === "tk" || navlang === "tg" ||
            navlang === "ab" || navlang === "oc" ||
            navlang === "hy" || navlang === "az")
            return "ru";
        else return "en";
    }
    signInAsGuest = jwt => {
        localStorage.setItem("jwt", jwt);
        this.setState({ jwt });
    }
    signInAsUser = data => {
        localStorage.setItem("jwt", data.jwt);
        localStorage.setItem("registered", true);
        this.setState({
            jwt: data.jwt,
            registered: true,
            user: data.user,
            room: data.room ? data.room : this.state.room
        });
    }
    userRegistered = data => {
        localStorage.setItem("jwt", data.jwt);
        localStorage.setItem("registered", true);
        this.setState({
            jwt: data.jwt,
            registered: true,
            user: data.user
        });
    }
    changeName = name => {
        this.setState({ name: name });
    }
    deleteUser = () => {
        alert("Deleting")
    }
    changeIcon = icon => {
        localStorage.setItem("icon", icon);
        this.setState({
            icon: icon
        });
    }
    changeFilters = filters => {
        localStorage.setItem("filters", JSON.stringify(filters));
        this.setState({ filters });
    }
    changeRoom = data => {
        //room change here
        this.setState({ room: data });
    }
    setLanguage = lang => {
        localStorage.setItem("lang", lang);
        this.setState({ lang: lang });
    }
    signOut = () => {
        localStorage.removeItem("jwt");
        localStorage.removeItem("registered");
        this.setState({
            jwt: null,
            registered: false
        });
    }
    render() {
        let routes = [];
        if(this.state.jwt){
            routes.push(<Route key="lobby" path="/lobby/:page(\d+)" exact={true} component={Lobby} />);
            if(this.state.registered){
                routes.push(<Route key="account" path="/account" exact={true} component={Account} />);
                routes.push(<Route key="myroom" path="/myroom" exact={true} component={MyRoom} />);
            }
            routes.push(<Redirect key="tolobby" to="/lobby/1" />);
        } else routes.push(<Redirect key="tosign" to="/signin/guest" />);
        
        return <Context.Provider value={{
            jwt: this.state.jwt, registered: this.state.registered, lang: this.state.lang,
            filters: this.state.filters, name: this.state.name, room: this.state.room,
            signOut: this.signOut, changeFilters: this.changeFilters, icon: this.state.icon,
            setLanguage: this.setLanguage, changeName: this.changeName,
            changeRoom: this.changeRoom, changeIcon: this.changeIcon, deleteUser: this.deleteUser,
            userRegistered: this.userRegistered, signInAsUser: this.signInAsUser,
            signInAsGuest: this.signInAsGuest
        }}>
            <Router>
                {
                    this.state.jwt && <TopMenuWithRouter />
                }
                <Switch>
                    {
                        !this.state.registered && <Route path="/signin/:as" component={SignIn} />
                    }
                    <Route path="/fatal" component={Fatal} />
                    <Route path="/econfirm/:number(\d{9})" exact={true} strict={true} component={EConfirm} />
                    {routes}
                </Switch>
            </Router>
        </Context.Provider>
    }
}