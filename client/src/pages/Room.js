import React, { Component } from "react";
import "./accessories/Room/room.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import Flag from "react-flags";

export class Room extends Component {
    constructor(props) {
        super(props);
        this.state = {
            flag: "gb",
            name: "Lorem ipsum dolor sit amet, consectetuer"
        }
    }
    render() {
        return <div id="room">
            <div id="roomcont" className="container-fluid">
                <nav className="navbar navbar-expand bg-dark navbar-dark">
                    <button id="btnopen" className="btn btn-dark mr-3"><FontAwesomeIcon icon={faArrowRight} /></button>
                    <span className="navbar-text mr-3"><Flag name={this.state.flag} format="png" pngSize={24} shiny={true} basePath="/img" /></span>
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
            <div id="roommenu" className="bg-dark">
            </div>
        </div>
    }
}