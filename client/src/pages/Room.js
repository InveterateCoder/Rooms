import React, { Component } from "react";
import { Context } from "../data/Context";
import "./accessories/Room/room.css";
import { Menu } from "./accessories/Room/Menu";
import { Content } from "./accessories/Room/Content";

export class Room extends Component {
    static contextType = Context;
    constructor(props, context) {
        super(props, context);
        this.state = {
            flag: "gb",
            name: context.name,
            icon: context.icon,
            roomname: "Lorem ipsum dolor sit amet, consectetuer",
            menuopen: false
        }
        this.menu = React.createRef();
    }
    openmenu = () => {
        this.menu.current.focus();
        this.setState({ menuopen: true });
    }
    closemenu = () => this.setState({ menuopen: false });
    render() {
        return <div id="room">
            <Content openmenu={this.openmenu} flag={this.state.flag}
                roomname={this.state.roomname} />
            <Menu menu={this.menu} open={this.state.menuopen} closemenu={this.closemenu}
                icon={this.state.icon} name={this.state.name} />
        </div>
    }
    componentDidMount() {
        window.scrollTo(0, document.body.scrollHeight);
    }
}