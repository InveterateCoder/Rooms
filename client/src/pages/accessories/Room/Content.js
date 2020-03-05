import React from "react";
import Flag from "react-flags";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

const text = {
    en: "Type a message...",
    ru: "Введите сообщение ..."
};

export function Content(props) {
    return <div id="roomcont" className="container-fluid">
        <nav className="navbar navbar-expand bg-dark navbar-dark">
            <button onClick={props.openmenu} className="btnmenu btn btn-dark mr-3"><FontAwesomeIcon icon={faArrowRight} /></button>
            <Flag className="mr-3" name={props.flag} format="png" pngSize={24} shiny={true} basePath="/img" />
            <span className="navbar-brand">{props.roomname}</span>
        </nav>
        <input id="input" type="text" className="form-control" placeholder={text[props.lang]} />
        <div>
            <div className="media p-3">
                <img src="/img/user.svg" alt="icon" className="mr-3" style={{ width: "60px" }} />
                <div className="media-body">
                    <h4>John Doe <small><i className="text-muted">February 19, 2016</i></small></h4>
                    <p>To create a media object, add the .media class to a container element, and place media content inside a child container with the .media-body class. Add padding and margins as needed, with the spacing utilities:</p>
                </div>
            </div>
        </div>
    </div>
}