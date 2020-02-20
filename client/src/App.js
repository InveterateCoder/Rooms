import React, { Component } from 'react';
import { Context } from "./data/Context";
import { Route, Switch } from "react-router-dom";
import { Preloader } from "./Preloader";
import { Home } from "./Home";
import { Get } from "./utils/requests";
import urls from "./utils/Urls";

export default class App extends Component {
    constructor(props) {
        super(props);
        let filters = localStorage.getItem("filters");
        filters = filters ? JSON.parse(filters) : {};
        this.state = {
            jwt: localStorage.getItem("jwt"),
            registered: localStorage.getItem("registered"),
            name: "",
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
        this.setState({ jwt }, () => this.props.history.replace("/lobby/1"));
    }
    signInAsUser = data => {
        localStorage.setItem("jwt", data.jwt);
        localStorage.setItem("registered", true);
        this.setState({
            jwt: data.jwt,
            registered: true,
            name: data.name,
            room: data.room ? data.room : this.state.room
        }, () => this.props.history.replace("/lobby/1"));
    }
    userRegistered = data => {
        localStorage.setItem("jwt", data.jwt);
        localStorage.setItem("registered", true);
        this.setState({
            jwt: data.jwt,
            registered: true,
            name: data.name
        });
    }
    changeAccaunt = (jwt, name) => {
        localStorage.setItem("jwt", jwt);
        this.setState({
            jwt: jwt,
            name: name
        });
        this.setState({ name: name });
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
        if(data)
            this.setState({ room: data });
        else
            this.setState({ room: {
                name: "",
                description: "",
                country: "gb",
                password: "",
                limit: 20
            }});
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
        return <Context.Provider value={{
            jwt: this.state.jwt, registered: this.state.registered, lang: this.state.lang,
            filters: this.state.filters, name: this.state.name, room: this.state.room,
            signOut: this.signOut, changeFilters: this.changeFilters, icon: this.state.icon,
            setLanguage: this.setLanguage, changeAccaunt: this.changeAccaunt,
            changeRoom: this.changeRoom, changeIcon: this.changeIcon,
            userRegistered: this.userRegistered, signInAsUser: this.signInAsUser,
            signInAsGuest: this.signInAsGuest
        }}>
            {
                this.state.registered && !this.state.name
                    ? <Preloader />
                    : <Switch>
                        <Route path="/" component={Home} />
                    </Switch>
            }
        </Context.Provider>
    }
    componentDidMount() {
        if (this.state.registered && this.state.jwt) {
            Get(urls.accountInfo, this.state.lang, this.state.jwt)
                .then(data => {
                    if (data)
                        this.setState({
                            name: data.name,
                            room: !data.room ? this.state.room : {
                                name: data.room.name,
                                country: data.room.country,
                                limit: data.room.limit,
                                password: data.room.password ? data.room.password : "",
                                description: data.room.description ? data.room.description : ""
                            }
                        });
                    else this.signOut();
                }).catch(() => this.signOut());
        }
    }
}