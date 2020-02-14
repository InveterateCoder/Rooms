import React, { Component } from 'react';
import { Context } from "./data/Context";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { SignIn } from "./pages/SignIn";
import { Pager } from "./Pager";

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            jwt: "some",
            registered: true,
            creds: {
                name: "Arthur",
                email: "inveterate.coder@gmail.com",
                icon: "man",
            },
            room: {
                name: "",
                description: "",
                country: "gb",
                password: "",
                limit: 20
            },
            lang: "en",
            filters: {
                en: "English",
                ru: "Русский"
            }
        }
    }
    changeCredentials = data => {
        //newpassword to be considered
        this.setState({
            creds: {
                name: data.name ? data.name : this.state.creds.name,
                email: data.email ? data.email : this.state.creds.email,
                icon: data.icon ? data.icon : this.state.creds.icon,
                filters: data.filters ? data.filters : this.state.creds.filters
            }
        });
    }
    changeFilters = filters => {
        this.setState(filters);
    }
    changeRoom = data => {
        //room change here
        this.setState({ room: data });
    }
    setLanguage = lang => {
        //todo save state in memory
        this.setState({ lang: lang });
    }
    signOut = () => {
        this.setState({
            jwt: null,
            registered: false
        })
    }
    render() {
        return <Context.Provider value={{
            jwt: this.state.jwt, registered: this.state.registered, lang: this.state.lang,
            filters: this.state.filters, creds: this.state.creds, room: this.state.room,
            signOut: this.signOut, changeFilters: this.changeFilters,
            setLanguage: this.setLanguage, changeCredentials: this.changeCredentials,
            changeRoom: this.changeRoom
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