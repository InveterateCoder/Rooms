import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faMicrophone, faUserFriends, faVolumeMute, faVolumeUp } from "@fortawesome/free-solid-svg-icons";

const text = {
    en: "Register to Enable",
    ru: "Регистрируйтесь, чтобы Включить "
};
const supportAlert = {
    en: "Sorry, your browser is not supported.",
    ru: "Извините, ваш браузер не поддерживается."
}
const mediaSupport = {
    en: "Something went wrong. Check your microphone and the permissions.",
    ru: "Что-то пошло не так. Проверьте свой микрофон и разрешения."
}
const voiceSupport = 'RTCPeerConnection' in window && 'mediaDevices' in navigator;

export function Menu(props) {
    const users = props.users;
    users.sort(function (a, b) {
        if (a.name < b.name)
            return -1;
        if (a.name > b.name)
            return 1;
        return 0;
    });
    const formUser = user => {
        let selected = !props.public && props.selusers.includes(user);
        return <div className={`p-2 pl-3 pr-3${user.guid ? " text-muted" : props.registered ? ` user${selected ? " selected" : ""}` : ""}`}
            key={user.guid ? user.guid : user.id} onClick={!user.guid && props.registered ? () => props.userClicked(user) : null}>
            <img src={`/img/${user.icon}.${user.guid ? "m" : selected ? "light" : "dark"}.svg`} draggable={false}
                className="mr-3 rounded-circle" alt="icon" />
            <span>{user.name}</span>
        </div>
    }
    const setPublic = () => {
        if (!props.public) props.setPublic(true);
        else if (props.selusers.length > 0) props.setPublic(false);
    }
    const voiceClick = () => {
        if (!voiceSupport) alert(supportAlert[props.lang]);
        else {
            if (props.voiceActive)
                props.voicButtonClick(null);
            else {
                navigator.mediaDevices.getUserMedia({ video: false, audio: true })
                    .then(stream => {
                        props.voicButtonClick(stream);
                    }).catch(() => {
                        alert(mediaSupport[props.lang]);
                    })
            }
        }
    }
    return <div id="roommenu" ref={props.menu} tabIndex={-1} className={`bg-dark${props.open ? " menuopen" : ""}`} onBlur={props.closemenu}>
        <nav className="navbar navbar-expand bg-dark navbar-dark">
            <button onClick={props.closemenu} className="btnmenu btn btn-outline-light mr-3"><FontAwesomeIcon icon={faBars} /></button>
            <img src={`/img/${props.icon}.dark.svg`} draggable={false}
                className="mr-3 rounded-circle" alt="icon" />
            <span className={`navbar-brand${props.registered ? "" : " text-muted"}`}>{props.name}</span>
        </nav>
        <div id="names" className="text-light">
            {
                users.map(user => formUser(user))
            }
        </div>
        <div id="menubtns" className="row">
            <div className={`col btn btn-${props.voiceActive ? "danger" : "dark"}`} onClick={voiceClick}>
                <FontAwesomeIcon size="2x" color="#f8f9fa" icon={faMicrophone} /> {props.voiceOnline}
            </div>
            {
                props.registered
                    ? <div className={`col btn btn-dark${props.public ? "" : " active"}`}
                        onClick={setPublic}>
                        <FontAwesomeIcon size="2x" color="#f8f9fa" icon={faUserFriends} />
                    </div>
                    : <div className="col text-warning p-2 text-center" style={{ fontSize: ".8rem" }}>
                        {text[props.lang]}
                    </div>
            }
            <div className={`col btn btn-dark${props.sound ? " active" : ""}`} onClick={props.soundClicked}>
                <FontAwesomeIcon size="2x" color="#f8f9fa" icon={props.sound ? faVolumeUp : faVolumeMute} />
            </div>
        </div>
    </div>
}