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
                filters: {
                    en: "English",
                    ru: "Русский"
                }
            },
            room: {
                name: "",
                description: "",
                country: "gb",
                password: "",
                limit: 20
            },
            lang: "en",
            notifs: false
        }
    }
    changeCredentials = (data, password) => {
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
    changeRoom = (data, password) => {
        //room change here
        this.setState({ room: data });
    }
    setLanguage = lang => {
        //todo save state in memory
        this.setState({ lang: lang });
    }
    setNotifications = status => {
        //todo processing
        this.setState({ notifs: status });
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
            notifs: this.state.notifs, creds: this.state.creds, room: this.state.room,
            setNotifications: this.setNotifications, signOut: this.signOut,
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