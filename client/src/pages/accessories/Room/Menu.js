import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faGlobe, faUserFriends, faVolumeMute, faVolumeUp } from "@fortawesome/free-solid-svg-icons";

export function Menu(props) {
    return <div id="roommenu" ref={props.menu} tabIndex={-1} className={`bg-dark${props.open ? " menuopen" : ""}`} onBlur={props.closemenu}>
        <nav className="navbar navbar-expand bg-dark navbar-dark">
            <button onClick={props.closemenu} className="btnmenu btn btn-dark mr-3"><FontAwesomeIcon icon={faArrowLeft} /></button>
            <img src={`/img/${props.icon}.svg`} width={32} style={{ padding: "1px" }}
                className="mr-3 rounded-circle bg-light" alt="icon" />
            <span className="navbar-brand">{props.name}</span>
        </nav>
        <div id="names" className="text-light">
            <div className="p-2 pl-3 pr-3">
                <img src="/img/man.svg" width={32} style={{ padding: "1px" }}
                    className="mr-3 rounded-circle bg-light" alt="icon" />
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
                <FontAwesomeIcon size="2x" color="#f8f9fa" icon={faVolumeMute} />
            </div>
        </div>
    </div>
}