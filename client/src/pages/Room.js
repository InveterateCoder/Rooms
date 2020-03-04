import React, { Component } from "react";
import { Context } from "../data/Context";
import "./accessories/Room/room.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Flag from "react-flags";

export class Room extends Component {
    static contextType = Context;
    constructor(props) {
        super(props);
        this.state = {
            flag: "gb",
            name: "Lorem ipsum dolor sit amet, consectetuer",
            menuopen: false
        }
        this.menu = React.createRef();
    }
    openmenu = () => {
        this.menu.current.focus();
        this.setState({menuopen: true});
    }
    closemenu = () => this.setState({menuopen: false});
    render() {
        return <div id="room">
            <div id="roomcont" className="container-fluid">
                <nav className="navbar navbar-expand bg-dark navbar-dark">
                    <button onClick={this.openmenu} className="btnmenu btn btn-dark mr-3"><FontAwesomeIcon icon={faArrowRight} /></button>
                    <Flag className="mr-3" name={this.state.flag} format="png" pngSize={24} shiny={true} basePath="/img" />
                    <span className="navbar-brand">{this.state.name}</span>
                </nav>
                <input id="input" type="text" className="form-control" placeholder="Type a message..." />
                <div>
                    <p>First</p><p>Hello</p><p>Hello</p><p>Hello</p><p>Hello</p>
                    <p>Hello</p><p>Hello</p><p>Hello</p><p>Hello</p><p>Hello</p>
                    <p>Hello</p><p>Hello</p><p>Hello</p><p>Hello</p><p>Hello</p>
                    <p>Hello</p><p>Hello</p><p>Hello</p><p>Hello</p><p>Hello</p>
                    <p>Hello</p><p>Hello</p><p>Hello</p><p>Hello</p><p>Hello</p>
                    <p>Hello</p>
                    <p>Hello</p>
                    <p>Hello</p>
                    <p>Last</p>
                </div>
            </div>
            <div id="roommenu" ref={this.menu} tabIndex={-1} className={`bg-dark${this.state.menuopen ? " menuopen" : ""}`} onBlur={this.closemenu}>
                <nav className="navbar navbar-expand bg-dark navbar-dark">
                    <button onClick={this.closemenu} className="btnmenu btn btn-dark mr-3"><FontAwesomeIcon icon={faArrowLeft} /></button>
                    <img src="/img/user.svg" width={30} className="mr-2 rounded-circle bg-light p-1" />
                    <span className="navbar-brand">{this.context.name}</span>
                </nav>
            </div>
        </div>
    }
    componentDidMount(){
        window.scrollTo(0, document.body.scrollHeight);
    }
}