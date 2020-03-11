import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faGlobe, faUserFriends, faVolumeMute, faVolumeUp } from "@fortawesome/free-solid-svg-icons";

const text = {
    en: "Register to use secret messages and sound",
    ru: "Зарегистрируйтесь, чтобы использовать секретные сообщения и звук"
};

export function Menu(props) {
    const users = props.users;
    users.sort(function (a, b) {
        if (a.name < b.name)
            return -1;
        if (a.name > b.name)
            return 1;
        return 0;
    });
    return <div id="roommenu" ref={props.menu} tabIndex={-1} className={`bg-dark${props.open ? " menuopen" : ""}`} onBlur={props.closemenu}>
        <nav className="navbar navbar-expand bg-dark navbar-dark">
            <button onClick={props.closemenu} className="btnmenu btn btn-dark mr-3"><FontAwesomeIcon icon={faArrowLeft} /></button>
            <img src={`/img/${props.icon}.svg`} draggable={false}
                className={`mr-3 rounded-circle bg-${props.registered ? "light" : "secondary"}`} alt="icon" />
            <span className={`navbar-brand${props.registered ? "" : " text-muted"}`}>{props.name}</span>
        </nav>
        <div id="names" className="text-light">
            {
                users.map(user => <div className={`p-2 pl-3 pr-3${user.guid ? " text-muted" : props.registered ? ` user${!props.public && props.selusers.includes(user) ? " selected" : ""}` : ""}`}
                    key={user.guid ? user.guid : user.id} onClick={!user.guid && props.registered ? () => props.userClicked(user) : null}>
                    <img src={`/img/${user.icon}.svg`} draggable={false}
                        className={`mr-3 rounded-circle bg-${user.guid ? "secondary" : "light"}`} alt="icon" />
                    <span>{user.name}</span>
                </div>)
            }
        </div>
        {
            props.registered
                ? <div id="menubtns" className="row">
                    <div className={`col btn btn-dark${props.public ? " active" : ""}`}
                        onClick={() => { if (!props.public) props.setPublic(true) }}>
                        <FontAwesomeIcon size="2x" color="#f8f9fa" icon={faGlobe} />
                    </div>
                    <div className={`col btn btn-dark${props.public ? "" : " active"}`}
                        onClick={() => { if (props.public && props.selusers.length > 0) props.setPublic(false) }}>
                        <FontAwesomeIcon size="2x" color="#f8f9fa" icon={faUserFriends} />
                    </div>
                    <div className="col btn btn-dark">
                        <FontAwesomeIcon size="2x" color="#f8f9fa" icon={faVolumeMute} />
                    </div>
                </div>
                : <div id="menubtns">
                    <span className="text-warning p-2">{text[props.lang]}</span>
                </div>
        }
    </div>
}