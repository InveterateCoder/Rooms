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
            lang: "en",
            filters: {
                en: "English",
                ru: "Русский"
            },
            icon: "user"
        }
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
        this.setState({
            icon: icon
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
            filters: this.state.filters, user: this.state.user, room: this.state.room,
            signOut: this.signOut, changeFilters: this.changeFilters, icon: this.state.icon,
            setLanguage: this.setLanguage, changeUser: this.changeUser,
            changeRoom: this.changeRoom, changeIcon: this.changeIcon, deleteUser: this.deleteUser
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