import React, { Component } from "react";
import { Context } from "../data/Context";
import "./accessories/Room/room.css";
import { Menu } from "./accessories/Room/Menu";
import Flag from "react-flags";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faGlobe, faUserFriends } from "@fortawesome/free-solid-svg-icons";
import * as signalR from "@aspnet/signalr";

const fakeUsers = [
    {
        id: 3,
        name: "Abraham",
        icon: "man",
        guid: null
    },
    {
        id: 1,
        name: "Loco",
        icon: "woman",
        guid: null
    },
    {
        id: 0,
        name: "Stranger",
        icon: "user",
        guid: "adbadf12345432321"
    },
    {
        id: 2,
        name: "Somebody",
        icon: "man",
        guid: null
    },
    {
        id: 0,
        name: "Come on",
        icon: "user",
        guid: "avddfdfvdaf13434nn"
    }
]

const fakeMsgs = [
    {
        time: 123,
        sender: "Good Gal",
        icon: "woman",
        secret: false,
        text: "Hello everyone!"
    },
    {
        time: 123,
        sender: "Somebody",
        icon: "man",
        secret: true,
        text: "lololo"
    }
]
const text = {
    en: "Type a message...",
    ru: "Введите сообщение ..."
};
const pub = '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="globe" class="svg-inline--fa fa-globe fa-w-16 " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512" color="#007bff"><path fill="currentColor" d="M336.5 160C322 70.7 287.8 8 248 8s-74 62.7-88.5 152h177zM152 256c0 22.2 1.2 43.5 3.3 64h185.3c2.1-20.5 3.3-41.8 3.3-64s-1.2-43.5-3.3-64H155.3c-2.1 20.5-3.3 41.8-3.3 64zm324.7-96c-28.6-67.9-86.5-120.4-158-141.6 24.4 33.8 41.2 84.7 50 141.6h108zM177.2 18.4C105.8 39.6 47.8 92.1 19.3 160h108c8.7-56.9 25.5-107.8 49.9-141.6zM487.4 192H372.7c2.1 21 3.3 42.5 3.3 64s-1.2 43-3.3 64h114.6c5.5-20.5 8.6-41.8 8.6-64s-3.1-43.5-8.5-64zM120 256c0-21.5 1.2-43 3.3-64H8.6C3.2 212.5 0 233.8 0 256s3.2 43.5 8.6 64h114.6c-2-21-3.2-42.5-3.2-64zm39.5 96c14.5 89.3 48.7 152 88.5 152s74-62.7 88.5-152h-177zm159.3 141.6c71.4-21.2 129.4-73.7 158-141.6h-108c-8.8 56.9-25.6 107.8-50 141.6zM19.3 352c28.6 67.9 86.5 120.4 158 141.6-24.4-33.8-41.2-84.7-50-141.6h-108z"></path></svg>';
const sec = '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="user-friends" class="svg-inline--fa fa-user-friends fa-w-20 " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" color="#17a2b8"><path fill="currentColor" d="M192 256c61.9 0 112-50.1 112-112S253.9 32 192 32 80 82.1 80 144s50.1 112 112 112zm76.8 32h-8.3c-20.8 10-43.9 16-68.5 16s-47.6-6-68.5-16h-8.3C51.6 288 0 339.6 0 403.2V432c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48v-28.8c0-63.6-51.6-115.2-115.2-115.2zM480 256c53 0 96-43 96-96s-43-96-96-96-96 43-96 96 43 96 96 96zm48 32h-3.8c-13.9 4.8-28.6 8-44.2 8s-30.3-3.2-44.2-8H432c-20.4 0-39.2 5.9-55.7 15.4 24.4 26.3 39.7 61.2 39.7 99.8v38.4c0 2.2-.5 4.3-.6 6.4H592c26.5 0 48-21.5 48-48 0-61.9-50.1-112-112-112z"></path></svg>';
export class Room extends Component {
    static contextType = Context;
    constructor(props, context) {
        super(props, context);
        this.state = {
            flag: "gb",
            name: context.name,
            icon: context.icon,
            roomname: "Lorem ipsum dolor sit amet, consectetuer",
            menuopen: false,
            users: fakeUsers,
            public: true,
            selusers: []
        }
        this.connection = new signalR.HubConnectionBuilder().withUrl("/hub/rooms",
            { accessTokenFactory: () => context.jwt }).build();
        this.menu = React.createRef();
        this.msgpanel = React.createRef();
    }
    openmenu = () => {
        this.menu.current.focus();
        this.setState({ menuopen: true });
    }
    closemenu = () => this.setState({ menuopen: false });
    setPublic = mode => this.setState({ public: mode });
    userClicked = user => {
        if (this.state.public)
            this.setState({
                selusers: [user],
                public: false
            });
        else {
            let arr;
            if (this.state.selusers.includes(user))
                arr = this.state.selusers.filter(u => u !== user);
            else
                arr = [...this.state.selusers, user];
            this.setState({
                selusers: arr,
                public: !(arr.length > 0)
            });
        }
    }
    formMessage = msg => {
        let time = "time holder";
        let elem = document.createElement("div");
        elem.className="media p-3";
        elem.innerHTML = `<img src="/img/${msg.icon}.m.svg" alt="icon" class="mr-3" draggable="false"/>
        <div class="media-body">
        <h4 class="text-dark"><span class="mr-3">${msg.secret ? sec : pub}</span>${msg.sender} <small><i class="text-muted">${time}</i></small></h4>
        <p>${msg.text}</p>
        </div>`;
        return elem;
    }
    render() {
        return <div id="room">
            <div id="roomcont" className="container-fluid">
                <nav className="navbar navbar-expand bg-dark navbar-dark">
                    <button onClick={this.openmenu} className="btnmenu btn btn-dark mr-3"><FontAwesomeIcon icon={faArrowRight} /></button>
                    <Flag className="mr-3" name={this.state.flag} format="png" pngSize={24} shiny={true} basePath="/img" />
                    <span className="navbar-brand">{this.state.roomname}</span>
                </nav>
                <input id="input" type="text" className="form-control" placeholder={text[this.context.lang]} />
                <div ref={this.msgpanel} id="msgpanel"></div>
            </div>
            <Menu registered={this.context.registered} lang={this.context.lang} menu={this.menu} open={this.state.menuopen} closemenu={this.closemenu}
                icon={this.state.icon} name={this.state.name} users={this.state.users} selusers={this.state.selusers}
                userClicked={this.userClicked} public={this.state.public} setPublic={this.setPublic} />
        </div>
    }
    componentDidMount() {
        this.msgpanel.current.appendChild(this.formMessage(fakeMsgs[0]))
        window.scrollTo(0, document.body.scrollHeight);
    }
}