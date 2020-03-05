import React, { Component } from "react";
import { Context } from "../data/Context";
import "./accessories/Room/room.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faArrowLeft, faGlobe, faUserFriends, faVolumeMute, faVolumeUp } from "@fortawesome/free-solid-svg-icons";
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
        this.setState({ menuopen: true });
    }
    closemenu = () => this.setState({ menuopen: false });
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
                    <img src={`/img/${this.context.icon}.svg`} width={32} style={{ padding: "1px" }}
                        className="mr-3 rounded-circle bg-light" alt="icon" />
                    <span className="navbar-brand">{this.context.name}</span>
                </nav>
                <div id="names" className="text-light">
                    <div className="p-2 pl-3 pr-3">
                        <img src="/img/man.svg" width={32} style={{ padding: "1px" }}
                            className="mr-3 rounded-circle bg-light" alt="user" />
                        <span>Supercalifragilisticexpialidocious</span>
                    </div>
                </div>
                <div id="menubtns" className="row">
                    <div className="col btn btn-dark">
                        <FontAwesomeIcon size="2x" color="#f8f9fa" icon={faGlobe} />
                    </div>
                    <div className="col btn btn-dark">
                        <FontAwesomeIcon size="2x" color="#f8f9fa" icon={faUserFriends} />
                    </div>
                    <div className="col btn btn-dark">
                        <FontAwesomeIcon size="2x" color="#f8f9fa" icon={faVolumeMute}/>
                    </div>
                </div>
            </div>
        </div>
    }
    componentDidMount() {
        window.scrollTo(0, document.body.scrollHeight);
    }
}