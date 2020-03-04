import React, { Component } from 'react';
import { Context } from "./data/Context";
import { Route, Switch } from "react-router-dom";
import { Preloader } from "./Preloader";
import { Home } from "./Home";
import { Room } from "./pages/Room";
import { Get } from "./utils/requests";
import urls from "./utils/Urls";
import Countries from "./data/countries"

export default class App extends Component {
    constructor(props) {
        super(props);
        let filters = localStorage.getItem("filters");
        filters = filters ? JSON.parse(filters) : {};
        let registered = localStorage.getItem("registered");
        let lang = localStorage.getItem("lang");
        if (!lang || !registered)
            lang = this.bestLang();
        this.state = {
            jwt: localStorage.getItem("jwt"),
            registered: registered,
            name: "",
            room: {
                name: "",
                description: "",
                country: "gb",
                password: "",
                limit: 20
            },
            lang: lang,
            filters: filters,
            c_codes: registered ? localStorage.getItem("c_codes") : null,
            icon: registered ? localStorage.getItem("icon") || "user" : "user",
            perpage: registered ? localStorage.getItem("perpage") || 30 : 30,
            openin: registered ? localStorage.getItem("opin") || "nw" : "nw"
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
    signInAsGuest = (jwt, name) => {
        localStorage.setItem("jwt", jwt);
        this.setState({ jwt, name }, () => this.props.history.replace("/lobby/1"));
    }
    signInAsUser = data => {
        localStorage.setItem("jwt", data.jwt);
        localStorage.setItem("registered", true);
        let codes = this.getCountries(this.state.filters);
        localStorage.setItem("c_codes", codes);
        this.setState({
            jwt: data.jwt,
            registered: true,
            name: data.name,
            room: !data.room ? this.state.room : {
                ...data.room,
                password: data.room.password ? data.room.password : "",
                description: data.room.description ? data.room.description : ""
            },
            lang: localStorage.getItem("lang") || this.bestLang(),
            c_codes: codes
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
        let codes = this.getCountries(filters);
        localStorage.setItem("c_codes", codes);
        this.setState({ filters, c_codes: codes });
    }
    getCountries = filters => {
        let keys = Object.keys(filters);
        let c_codes = new Set();
        keys.forEach(key => {
            for (let value of Object.values(Countries))
                if (value.langs.includes(key)) c_codes.add(value.code);
        });
        let codes = "";
        if (c_codes.size > 0)
            codes = Array.from(c_codes).reduce((a, b) => a + '_' + b);
        return codes;
    }
    changeRoom = data => {
        if (data)
            this.setState({ room: data });
        else
            this.setState({
                room: {
                    name: "",
                    description: "",
                    country: "gb",
                    password: "",
                    limit: 20
                }
            });
    }
    setLanguage = lang => {
        localStorage.setItem("lang", lang);
        this.setState({ lang: lang });
    }
    setPerpage = perpage => {
        localStorage.setItem("perpage", perpage);
        this.setState({ perpage });
    }
    setOpenIn = value => {
        localStorage.setItem("opin", value);
        this.setState({ openin: value });
    }
    signOut = () => {
        localStorage.removeItem("jwt");
        localStorage.removeItem("registered");
        localStorage.removeItem("c_codes");
        this.setState({
            jwt: null,
            registered: false,
            lang: this.bestLang()
        });
    }
    render() {
        return <Context.Provider value={{
            ...this.state,
            signOut: this.signOut, changeFilters: this.changeFilters,
            setLanguage: this.setLanguage, changeAccaunt: this.changeAccaunt,
            changeRoom: this.changeRoom, changeIcon: this.changeIcon,
            userRegistered: this.userRegistered, signInAsUser: this.signInAsUser,
            signInAsGuest: this.signInAsGuest, setPerpage: this.setPerpage,
            setOpenIn: this.setOpenIn
        }}>
            {
                this.state.jwt && !this.state.name
                    ? <Preloader />
                    : <Switch>
                        {
                            this.state.jwt && <Route path="/room/:room" component={Room} />
                        }
                        <Route path="/" component={Home} />
                    </Switch>
            }
        </Context.Provider>
    }
    componentDidMount() {
        if (this.state.jwt) {
            Get(urls.accountInfo, this.state.lang, this.state.jwt)
                .then(data => {
                    if (data) {
                        if (this.state.registered)
                            this.setState({
                                name: data.name,
                                room: !data.room ? this.state.room : {
                                    ...data.room,
                                    password: data.room.password ? data.room.password : "",
                                    description: data.room.description ? data.room.description : ""
                                }
                            });
                        else this.setState({name: data});
                    }
                    else this.signOut();
                }).catch(() => {
                    this.signOut();
                    this.props.history.replace("/fatal")
                });
        }
    }
}