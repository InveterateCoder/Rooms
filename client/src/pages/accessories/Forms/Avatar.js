import React, { Component } from "react";
import { Context } from "../../../data/Context";
import * as signalR from "@aspnet/signalr";
const images = ["woman", "man", "user"];
export class Avatar extends Component {
    static contextType = Context;
    constructor(props, context) {
        super(props, context);
        this.connection = new signalR.HubConnectionBuilder().withUrl("/hubs/rooms",
            { accessTokenFactory: () => context.jwt }).configureLogging(signalR.LogLevel.Error).build();
    }
    clicked = name => {
        this.connection.invoke("ChangeIcon", name);
        this.props.selectImage(name);
    }
    render() {
        return <div className="mb-5">
            <img src={`/img/${this.props.image}.svg`} width={100} className="rounded-circle border acnt-img"
                alt="icon of a person" />
            {
                images.map(name =>
                    name !== this.props.image &&
                    <button key={name} onClick={() => this.clicked(name)} className="align-bottom acnt-img">
                        <img src={`/img/${name}.svg`} width={50} className="rounded-circle border"
                            alt={`icon of a ${name}`} /></button>)
            }
        </div >
    }
    componentDidMount(){
        this.connection.start();
    }
    componentWillUnmount(){
        this.connection.stop();
    }
}