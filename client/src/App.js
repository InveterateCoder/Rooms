import React, { Component } from 'react';
import { Context } from "./data/Context";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { SignIn } from "./pages/SignIn";
import { Pager } from "./Pager";

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
            user: {
                name: "Arthur",
                email: "inveterate.coder@gmail.com",
            },
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
        if (navlang === "kk" || navlang === "ky" ||
            navlang === "be" || navlang === "uk" ||
            navlang === "uz" || navlang === "mo" ||
            navlang === "tk" || navlang === "tg" ||
            navlang === "ab" || navlang === "oc" ||
            navlang === "hy" || navlang === "az")
            return "ru";
        else return "en";
    }
    signInAsGuest = jwt => {
        alert("trying");
    }
    changeUser = data => {
        //newpassword to be considered
        this.setState({
            user: {
                name: data.name ? data.name : this.state.user.name,
                email: data.email ? data.email : this.state.user.email
            }
        });
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
        this.setState(filters);
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
        })
    }
    render() {
        return <Context.Provider value={{
            jwt: this.state.jwt, registered: this.state.registered, lang: this.state.lang,
            filters: this.state.filters, user: this.state.user, room: this.state.room,
            signOut: this.signOut, changeFilters: this.changeFilters, icon: this.state.icon,
            setLanguage: this.setLanguage, changeUser: this.changeUser,
            changeRoom: this.changeRoom, changeIcon: this.changeIcon, deleteUser: this.deleteUser,
            signInAsGuest: this.signInAsGuest
        }}>
            <Router>
                <Switch>
                    <Route path="/signin/:as" component={SignIn} />} />
                    <Route path="/" component={Pager} />
                </Switch>
            </Router>
        </Context.Provider>
    }
}