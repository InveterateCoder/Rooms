import React, { Component } from "react";
import { Context } from "../data/Context";
import "./accessories/Room/room.css";
import { Menu } from "./accessories/Room/Menu";
import { Content } from "./accessories/Room/Content";

const fakeUsers = [
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
            selusers: [],
        }
        this.menu = React.createRef();
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
    render() {
        return <div id="room">
            <Content lang={this.context.lang} openmenu={this.openmenu} flag={this.state.flag}
                roomname={this.state.roomname} />
            <Menu registered={this.context.registered} lang={this.context.lang} menu={this.menu} open={this.state.menuopen} closemenu={this.closemenu}
                icon={this.state.icon} name={this.state.name} users={this.state.users} selusers={this.state.selusers}
                userClicked={this.userClicked} public={this.state.public} setPublic={this.setPublic} />
        </div>
    }
    componentDidMount() {
        window.scrollTo(0, document.body.scrollHeight);
    }
}