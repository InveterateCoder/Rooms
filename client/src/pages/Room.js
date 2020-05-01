import React, { Component } from "react";
import { Context } from "../data/Context";
import { Preloader } from "../Preloader";
import { Menu } from "./accessories/Room/Menu";
import { Toast } from "react-bootstrap";
import Flag from "react-flags";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faInfoCircle, faExclamationTriangle, faSignInAlt, faArrowCircleDown, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import Spinner from "react-loading";
import LocalizedStrings from "react-localization";
import Password from "react-type-password";
import validator from "../utils/validator";
import * as signalR from "@aspnet/signalr";

function isMobileTablet() {
    var check = false;
    (function (a) {
        //eslint-disable-next-line
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4)))
            check = true;
    })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
}

const text = new LocalizedStrings({
    en: {
        placeholder: "Type a message...",
        today: "Today",
        wrong: "Sorry, something went wrong.",
        noroom: "Sorry, room is not found.",
        limit: "Sorry, room's capacity has reached the limit. Try again later.",
        access: "Access denied. Wrong password.",
        deleted: "The room has been deleted by the owner.",
        userRemoved: "User successfully deleted.",
        message: "Message",
        entered: "entered the room.",
        left: "left the room.",
        exceeds: "Exceeded the message length limit of 2000 characters.",
        newlines: "Message cannot contain more than 10 lines.",
        months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        renamed: "was renamed to",
        changedIcon: "has changed icon.",
        roomnameChanged: "The room's name has changed.",
        flagChanged: "The room's flag has changed.",
        bothChanged: "The room's name and flag have changed.",
        rmspassword: "Room's password",
        pswdplcholder: "Enter password",
        oneInstance: "Something went wrong. Make sure only one instance of the room requires voice connection."
    },
    ru: {
        placeholder: "Введите сообщение ...",
        today: "Сегодня",
        wrong: "Извините, что-то пошло не так.",
        noroom: "Извините, комната не найден.",
        limit: "Извините, вместимость комнаты достигла предела. Попробуйте позже.",
        access: "Доступ запрещен. Неправильный пароль.",
        deleted: "Комната была удалена владельцем.",
        userRemoved: "Пользователь успешно удален.",
        message: "Сообщение",
        entered: "вошел в комнату.",
        left: "покинул комнату.",
        exceeds: "Превышен лимит длины сообщения 2000 символов.",
        newlines: "Сообщение не может содержать более 10 строк.",
        months: ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"],
        renamed: "был переименован в",
        changedIcon: "изменил значок.",
        roomnameChanged: "Название комнаты изменилось.",
        flagChanged: "Флаг комнаты изменился.",
        bothChanged: "Название комнаты и флаг изменились.",
        rmspassword: "Пароль комнаты",
        pswdplcholder: "Введите пароль",
        oneInstance: "Что-то пошло не так. Убедитесь, что только один экземпляр комнаты требует голосового соединения."
    }
})
function sec(theme) {
    return `<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="user-friends" class="svg-inline--fa fa-user-friends fa-w-20 " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" color="${theme === "dark" ? "#f8f9fa" : "#343a40"}"><path fill="currentColor" d="M192 256c61.9 0 112-50.1 112-112S253.9 32 192 32 80 82.1 80 144s50.1 112 112 112zm76.8 32h-8.3c-20.8 10-43.9 16-68.5 16s-47.6-6-68.5-16h-8.3C51.6 288 0 339.6 0 403.2V432c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48v-28.8c0-63.6-51.6-115.2-115.2-115.2zM480 256c53 0 96-43 96-96s-43-96-96-96-96 43-96 96 43 96 96 96zm48 32h-3.8c-13.9 4.8-28.6 8-44.2 8s-30.3-3.2-44.2-8H432c-20.4 0-39.2 5.9-55.7 15.4 24.4 26.3 39.7 61.2 39.7 99.8v38.4c0 2.2-.5 4.3-.6 6.4H592c26.5 0 48-21.5 48-48 0-61.9-50.1-112-112-112z"></path></svg>`;
}
export class Room extends Component {
    static contextType = Context;
    constructor(props, context) {
        super(props, context);
        this.state = {
            failed: null,
            warning: null,
            loading: true,
            blocked: false,
            password: "",
            myId: 0,
            name: context.name,
            icon: context.icon,
            lang: context.lang,
            flag: "??",
            roomname: null,
            users: [],
            menuopen: false,
            public: true,
            selusers: [],
            toasts: [],
            sound: localStorage.getItem("sound") ? true : false,
            scrolledDown: true,
            inputFocused: false,
            fetching: false,
            theme: context.theme,
            voiceOnline: 0,
            micStream: null
        }
        this.msgsCount = 50;
        this.oldestMsgTime = null;
        this.connection = new signalR.HubConnectionBuilder().withUrl("/hubs/rooms",
            { accessTokenFactory: () => context.jwt }).configureLogging(signalR.LogLevel.Error).build();
        this.connection.onclose(() => this.fail(text.wrong));
        this.connection.on("addUser", this.addUser);
        this.connection.on("removeUser", this.removeUser);
        this.connection.on("recieveMessage", this.recieveMessage);
        this.connection.on("roomDeleted", this.roomDeleted);
        this.connection.on("userRemoved", this.userRemoved);
        this.connection.on("usernameChanged", this.usernameChanged);
        this.connection.on("iconChanged", this.iconChanged);
        this.connection.on("roomChanged", this.roomChanged);
        this.connection.on("langChanged", this.langChanged);
        this.connection.on("themeChanged", this.themeChanged);
        this.connection.on("connectVoice", this.connectVoice);
        this.connection.on("offer", this.offer);
        this.connection.on("answer", this.answer);
        this.connection.on("candidate", this.candidate);
        this.connection.on("voiceCount", count => this.setState({ voiceOnline: count }));
        this.connection.on("logout", this.logout);
        this.menu = React.createRef();
        this.msgpanel = React.createRef();
        this.toastsRef = React.createRef();
        this.scrDownBtnRef = React.createRef();
        this.inputRef = React.createRef();
        this.toastTimer = null;
        this.toastsSpaceBottom = 150;
        this.soundMsg = new Audio(window.location.origin + "/msg.ogg");
        this.soundNotif = new Audio(window.location.origin + "/notif.ogg");
        this.inputHeight = 41;
        this.isMobile = isMobileTablet();
        this.voiceConnections = {};
        this.voiceAudios = {};
        this.canSendMessage = true;
    }
    setupRTCPeerConnection = connectionId => {
        let conn = new RTCPeerConnection({
            iceServers: [{
                urls: [
                    "stun:stun.l.google.com:19302",
                    "stun:stun.services.mozilla.com",
                    "stun:stun.skyway.io:3478"
                ]
            }]
        });
        conn.onicecandidate = event => {
            if (event.candidate)
                this.connection.invoke("PipeCandidate", connectionId, event.candidate);
        }
        conn.ontrack = event => {
            if (!this.voiceAudios[connectionId])
                this.voiceAudios[connectionId] = new Audio();
            else this.voiceAudios[connectionId].pause();
            this.voiceAudios[connectionId].srcObject = event.streams[0];
            this.voiceAudios[connectionId].play();
        }
        conn.onconnectionstatechange = () => {
            switch (conn.connectionState) {
                case "disconnected":
                case "failed":
                case "closed":
                    if (this.voiceAudios[connectionId]) {
                        this.voiceAudios[connectionId].pause();
                        delete this.voiceAudios[connectionId];
                    }
                    if (this.voiceConnections[connectionId]) {
                        this.voiceConnections[connectionId].close();
                        delete this.voiceConnections[connectionId];
                    }
            }
        }
        for (const track of this.state.micStream.getTracks())
            conn.addTrack(track, this.state.micStream);
        this.voiceConnections[connectionId] = conn;
        return conn;
    }
    connectVoice = connectionId => {
        let conn = this.setupRTCPeerConnection(connectionId);
        conn.createOffer().then(offer => {
            conn.setLocalDescription(offer);
            this.connection.invoke("PipeOffer", connectionId, offer);
        });
    }
    offer = (connectionId, data) => {
        let conn = this.setupRTCPeerConnection(connectionId);
        conn.setRemoteDescription(data);
        conn.createAnswer().then(answer => {
            conn.setLocalDescription(answer);
            this.connection.invoke("PipeAnswer", connectionId, answer);
        });
    }
    answer = (connectionId, data) => {
        this.voiceConnections[connectionId].setRemoteDescription(data);
    }
    candidate = (connectionId, data) => {
        this.voiceConnections[connectionId].addIceCandidate(data);
    }
    voicButtonClick = stream => {
        if (!stream) {
            this.connection.invoke("DisconnectVoice");
            for (let key in this.voiceAudios) {
                this.voiceAudios[key].pause();
                delete this.voiceAudios[key];
            }
            for (let key in this.voiceConnections) {
                this.voiceConnections[key].close();
                delete this.voiceConnections[key];
            }
            for (let track of this.state.micStream.getTracks())
                track.stop();
            this.setState({ micStream: null });
        } else {
            this.connection.invoke("ConnectVoice").then(() => this.setState({ micStream: stream }))
                .catch(() => alert(text.oneInstance));
        }
    }
    logout = () => {
        this.connection.stop().then(() => {
            for (let key in this.voiceAudios) {
                this.voiceAudios[key].pause();
                delete this.voiceAudios[key];
            }
            for (let key in this.voiceConnections) {
                this.voiceConnections[key].close();
                delete this.voiceConnections[key];
            }
            if (this.state.micStream) {
                for (let track of this.state.micStream.getTracks())
                    track.stop();
                this.setState({ micStream: null });
            }
        });
    }
    fail = (failed, warning) => {
        if (!this.unmounted)
            this.setState({ failed, warning }, this.componentWillUnmount);
    }
    openmenu = () => {
        this.setState({ menuopen: true }, () => {
            this.menu.current.focus();
            this.keyboardResizeTime = true;
            setTimeout(() => this.keyboardResizeTime = false, 300);
        });
    }
    themeChanged = theme => {
        if (theme === "dark" || theme === "light")
            this.setState({ theme }, () => document.body.className = `bg-${theme}`);
    }
    closemenu = () => this.setState({ menuopen: false });
    windowScrolled = () => {
        let scrTop = document.scrollingElement.scrollTop;
        let scrHeight = document.scrollingElement.scrollHeight;
        let cliHeight = document.scrollingElement.clientHeight;
        if (!this.state.fetching && scrTop === 0 && this.oldestMsgTime) {
            this.setState({ fetching: true });
            this.connection.invoke("GetMessages", this.oldestMsgTime, this.msgsCount).then(msgs => {
                if (msgs && msgs.length > 0) {
                    this.fillMessages(msgs);
                    document.scrollingElement.scrollTo(0, document.scrollingElement.scrollHeight - scrHeight);
                    this.setState({ fetching: false });
                }
                if (!msgs || msgs.length < this.msgsCount) this.oldestMsgTime = null;
                else this.oldestMsgTime = msgs[msgs.length - 1].time;
            }).catch(err => this.setState({ failed: err.message || text.wrong }));
        }
        else if (!this.state.scrolledDown && scrTop + cliHeight > scrHeight - 100) this.setState({ scrolledDown: true });
        else if (this.state.scrolledDown && scrTop + cliHeight < scrHeight - 100) this.setState({ scrolledDown: false });
    }
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
    soundClicked = () => {
        if (this.state.sound)
            this.setState({ sound: false }, () => localStorage.removeItem("sound"));
        else
            this.setState({ sound: true }, () => localStorage.setItem("sound", "on"));
    }
    passwordChanged = val => this.setState({ password: val });
    passwordKeyPressed = ev => {
        if (ev.target.tagName === "INPUT" && ev.which === 13)
            this.confirmPassword();
    }
    processEnter = data => {
        switch (data.code) {
            case "ok":
                this.setState({
                    loading: false,
                    blocked: false,
                    myId: data.payload.myId,
                    flag: data.payload.flag,
                    roomname: data.payload.name,
                    users: data.payload.users,
                    voiceOnline: data.payload.voiceUserCount
                }, () => {
                    let length = data.payload.messages.length;
                    if (length < this.msgsCount)
                        this.oldestMsgTime = null;
                    else
                        this.oldestMsgTime = data.payload.messages[length - 1].time;
                    this.fillMessages(data.payload.messages);
                    window.scrollTo(0, document.body.scrollHeight);
                });
                break;
            case "password":
                this.setState({ loading: false, blocked: true });
                break;
            case "limit":
                this.fail(null, text.limit);
                break;
            case "noroom":
                this.fail(null, text.noroom);
                break;
            default:
                this.fail(data.code || text.wrong);
        }
    }
    confirmPassword = () => {
        let err = validator.password(this.state.password, this.context.lang);
        if (err) alert(err);
        else this.setState({ loading: true }, async () => {
            try {
                let data = await this.connection.invoke("Enter", this.props.match.params["room"],
                    this.state.icon, this.state.password, this.msgsCount);
                if (data.code === "password") alert(text.access);
                this.processEnter(data);
            } catch (err) {
                this.fail(err.message || text.wrong);
            }
        });
    }
    fillToasts = () => {
        let toasts = this.state.toasts.map(([id, time, msg]) =>
            <Toast onClose={() => this.removeNotification(id)} key={id}>
                <Toast.Header>
                    <FontAwesomeIcon icon={faInfoCircle} className="mr-2" />
                    <strong className="mr-auto">{text.message}</strong>
                    <small className="ml-3">{time}</small>
                </Toast.Header>
                <Toast.Body>{msg}</Toast.Body>
            </Toast>);
        clearTimeout(this.toastTimer);
        this.toastTimer = setTimeout(() => this.toastsRef.current.scrollTo({ top: 0, left: 0, behavior: "smooth" }), 300);
        return toasts;
    }
    formTime = (ticks, today) => {
        let date = new Date((ticks - 621355968000000000) / 10000);
        let time = "";
        let year = date.getFullYear();
        let month = date.getMonth();
        let day = date.getDate();
        if (year !== today.getFullYear())
            time = `${year}-${month + 1}-${day}, `;
        else if (month !== today.getMonth() || day !== today.getDate())
            time = `${text.months[month]} ${day}, `;
        time += `${date.getHours()}:${date.getMinutes()}`;
        return time;
    }
    msgNameClick = evnt => {
        this.inputRef.current.focus();
        this.inputRef.current.setRangeText(evnt.target.innerText + ' ',
            this.inputRef.current.selectionStart, this.inputRef.current.selectionEnd, "end");
    }
    htmlEncode = text =>
        String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    formMessage = (msg, today, highlight = false) => {
        let msgText = highlight ? this.highlight(msg.text) : this.htmlEncode(msg.text);
        let time = "";
        if (today) time = this.formTime(msg.time, today);
        let elem = document.createElement("div");
        elem.className = "media p-1 mb-1";
        elem.innerHTML = `<span class="mr-2 mt-2 ${msg.icon}"></span>
        <div class="media-body">
        <div class="mb-1">${msg.secret ? sec(this.state.theme) : ""}<span tabindex="-1" class="${!msg.secret ? "ml-1" : ""}">${this.htmlEncode(msg.sender)}</span><small class="ml-2">${time ? "<code>" + time + "</code>" : "&#8987;"}</small></div>
        <pre>${msgText}</pre>
        </div>`;
        elem.querySelector('span[tabindex="-1"]').addEventListener("click", this.msgNameClick);
        return elem;
    }
    notify = msg => {
        let id = Date.now();
        let date = new Date(id);
        let time = `${date.getHours()}:${date.getMinutes()}`;
        let timeoutId = setTimeout(() => this.removeNotification(id), 7000);
        this.setState({ toasts: [[id, time, msg, timeoutId], ...this.state.toasts] },
            () => {
                if (this.state.sound)
                    this.soundNotif.play().catch(() => { });
            });
    }
    removeNotification = id => {
        let notif = this.state.toasts.find(el => el[0] === id);
        clearTimeout(notif[3]);
        this.setState({ toasts: this.state.toasts.filter(t => t[0] !== id) });
    }
    fillMessages = msgs => {
        let today = new Date();
        let panel = this.msgpanel.current;
        msgs.forEach(msg => panel.insertBefore(this.formMessage(msg, today), panel.firstChild));
    }
    appendMessage = msg => this.msgpanel.current.appendChild(msg);
    addUser = usr => {
        this.setState({ users: [...this.state.users, usr] });
        this.notify(`"${usr.name}" ${text.entered}`);
    }
    removeUser = usr => {
        const filter = usr.id ? u => u.id === usr.id : u => u.guid === usr.guid;
        let user = this.state.users.find(filter);
        let selusers = this.state.selusers.filter(u => u !== user);
        let pub = this.state.public;
        if (!pub && selusers.length === 0) pub = !pub;
        this.setState({ users: this.state.users.filter(u => u !== user), selusers: selusers, public: pub });
        this.notify(`"${usr.name}" ${text.left}`);
    }
    regexEscape = text => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    highlight = text => {
        text = this.htmlEncode(text);
        let name = this.htmlEncode(this.state.name);
        let regex = new RegExp(this.regexEscape(name), "g");
        text = text.replace(regex, `<span class="text-info">${name}</span>`);
        this.state.users.forEach(user => {
            name = this.htmlEncode(user.name);
            regex = new RegExp(this.regexEscape(name), "g");
            text = text.replace(regex, `<span class="text-info">${name}</span>`);
        });
        return text;
    }
    sendMsg = () => {
        if(!this.canSendMessage) return;
        let val = this.inputRef.current.value.trim();
        if (!val) return;
        if (val.length > 2000) {
            this.notify(text.exceeds);
            return;
        }
        if ((val.match(/\n/g) || '').length > 10) {
            this.notify(text.newlines);
            return;
        }
        this.inputRef.current.value = "";
        this.inputChanged();
        let ids = this.state.selusers.length > 0 && !this.state.public ? this.state.selusers.map(u => u.id) : null;
        let msg = {
            sender: this.state.name,
            icon: this.state.icon,
            secret: ids !== null,
            text: val
        }
        let element = this.formMessage(msg, null, true);
        this.appendMessage(element);
        document.scrollingElement.scrollTo(0, document.scrollingElement.scrollHeight);
        this.canSendMessage = false;
        setTimeout(() => this.canSendMessage = true, 700);
        this.connection.invoke("SendMessage", val, ids).then(resp => {
            if (!resp || isNaN(resp)) this.setState({ failed: text.wrong });
            else
                element.getElementsByTagName("small")[0].innerHTML = `<code>${this.formTime(resp, new Date())}</code>`;
        }).catch(err => this.fail(err.message || text.wrong));
    }
    msgInputKeyPressed = ev => {
        if (ev.which === 13) {
            if (!this.isMobile && !ev.shiftKey) {
                ev.preventDefault();
                this.sendMsg();
            } else if (ev.target.value[ev.target.value.length - 1] === '\n')
                ev.preventDefault();
        }
    }
    recieveMessage = msg => {
        this.appendMessage(this.formMessage(msg, new Date(), true));
        if (this.state.sound)
            this.soundMsg.play().catch(() => { });
        if (this.state.scrolledDown) document.scrollingElement.scrollTo(0, document.scrollingElement.scrollHeight);
    }
    roomDeleted = () => {
        this.connection.stop();
        this.fail(null, text.deleted);
    }
    userRemoved = () => {
        this.connection.stop();
        this.fail(null, text.userRemoved);
    }
    usernameChanged = creds => {
        if (creds.id === this.state.myId)
            this.setState({ name: creds.name });
        else {
            let users = this.state.users;
            let user = users.find(u => u.id === creds.id);
            if (user) {
                let oldName = user.name;
                users = users.filter(u => u !== user);
                let selusers = this.state.selusers;
                let selincludes = selusers.includes(user);
                if (selincludes)
                    selusers = selusers.filter(u => u !== user);
                user.name = creds.name;
                if (selincludes)
                    selusers = [...selusers, user];
                this.setState({ users: [...users, user], selusers: selusers });
                this.notify(`"${oldName}" ${text.renamed} "${creds.name}"`);
            }
        }
    }
    iconChanged = creds => {
        if (creds.id === this.state.myId)
            this.setState({ icon: creds.icon });
        else {
            let users = this.state.users;
            let user = users.find(u => u.id === creds.id);
            if (user) {
                users = users.filter(u => u !== user);
                let selusers = this.state.selusers;
                let selincludes = selusers.includes(user);
                if (selincludes)
                    selusers = selusers.filter(u => u !== user);
                user.icon = creds.icon;
                if (selincludes)
                    selusers = [...selusers, user];
                this.setState({ users: [...users, user], selusers: selusers });
                this.notify(`"${user.name}" ${text.changedIcon}`);
            }
        }
    }
    roomChanged = creds => {
        if (this.state.flag !== creds.flag && this.state.roomname !== creds.name)
            this.notify(text.bothChanged);
        else if (this.state.flag !== creds.flag)
            this.notify(text.flagChanged);
        else if (this.state.roomname !== creds.name)
            this.notify(text.roomnameChanged);
        this.setState({
            flag: creds.flag,
            roomname: creds.name
        });
    }
    inputChanged = () => {
        this.inputRef.current.style.height = "38px";
        this.inputRef.current.style.height = this.inputRef.current.scrollHeight + 2 + "px";
        let top = this.inputRef.current.scrollTop + this.inputRef.current.offsetHeight;
        if (top - 2 !== this.inputRef.current.scrollHeight && this.inputRef.current.scrollHeight - top < 36)
            this.inputRef.current.scrollTo(0, this.inputRef.current.scrollHeight);
        let newHeigh = this.inputRef.current.offsetHeight;
        if (this.inputMaxed && newHeigh < 161) this.inputMaxed = false;
        if (!this.inputMaxed && newHeigh !== this.inputHeight) {
            if (newHeigh === 161) this.inputMaxed = true;
            this.inputResized(newHeigh - this.inputHeight);
            this.inputHeight = newHeigh;
        }
    }
    inputResized = diff => {
        this.msgpanel.current.style.marginBottom = (parseInt(this.msgpanel.current.style.marginBottom) || 15) + diff + "px";
        if (this.state.scrolledDown)
            document.scrollingElement.scrollTo(0, document.scrollingElement.scrollHeight);
        else
            document.scrollingElement.scrollTo(0, document.scrollingElement.scrollTop + diff);
        let style = getComputedStyle(this.scrDownBtnRef.current);
        this.scrDownBtnRef.current.style.bottom = parseInt(style.bottom) + diff + "px";
        this.toastsSpaceBottom += diff;
        this.toastsRef.current.style.maxHeight = document.scrollingElement.clientHeight - this.toastsSpaceBottom + "px";
    }
    inputBlur = ev => {
        if (ev.relatedTarget && (ev.relatedTarget.id === "sendBtn" ||
            (ev.relatedTarget.tagName === "SPAN" && ev.relatedTarget.tabIndex === -1)))
            ev.target.focus();
        else this.setState({ inputFocused: false });
    }
    langChanged = lang => this.setState({ lang });
    windowResized = () => {
        this.toastsRef.current.style.maxHeight = document.scrollingElement.clientHeight - this.toastsSpaceBottom + "px";
        if (this.state.scrolledDown)
            document.scrollingElement.scrollTo(0, document.scrollingElement.scrollHeight);
        this.inputChanged();
        if (this.state.menuopen && !this.keyboardResizeTime)
            this.setState({ menuopen: false });
    }
    render() {
        text.setLanguage(this.state.lang);
        if (this.state.failed || this.state.warning) return <div id="failed">
            <FontAwesomeIcon icon={faExclamationTriangle} size="4x" color={this.state.warning ? "orange" : "red"} />
            <h5 className={`mt-3 text-${this.state.warning ? "warning" : "danger"} h5`}>{this.state.warning ? this.state.warning : this.state.failed}</h5>
        </div>
        else if (this.state.loading) return <Preloader />
        else if (this.state.blocked) return <div id="roompass">
            <h4 className="text-info mb-4">{text.rmspassword}</h4>
            <div className="input-group" onKeyPress={this.passwordKeyPressed}>
                <Password className="form-control" placeholder={text.pswdplcholder} value={this.state.password}
                    onChange={this.passwordChanged} />
                <div className="input-group-append">
                    <button className="btn btn-primary" onClick={this.confirmPassword}>
                        <FontAwesomeIcon icon={faSignInAlt} />
                    </button>
                </div>
            </div>
        </div>
        else return <div id="room">
            <div id="toasts" ref={this.toastsRef} style={{ visibility: this.state.toasts.length ? "visible" : "hidden" }}>
                {this.fillToasts()}
            </div>
            {this.state.fetching && <div id="fetcher"><Spinner type="cylon" color="white" width="80px" /></div>}
            <button id="scrollDown" style={{ visibility: this.state.scrolledDown ? "hidden" : "visible" }} ref={this.scrDownBtnRef} className="btn btn-primary"
                onClick={() => document.scrollingElement.scrollTo({ top: document.scrollingElement.scrollHeight, left: 0, behavior: "smooth" })}><FontAwesomeIcon icon={faArrowCircleDown} /></button>
            <div id="roomcont" className="container-fluid">
                <nav className="navbar navbar-expand bg-dark navbar-dark">
                    <button onClick={this.openmenu} className="btnmenu btn btn-outline-light mr-3"><FontAwesomeIcon icon={faBars} /></button>
                    <Flag className="mr-3" name={this.state.flag} format="png" pngSize={24} shiny={true} basePath="/img" />
                    <span className="navbar-brand">{this.state.roomname}</span>
                </nav>
                <div id="inpgroup" className={`input-group${this.state.inputFocused ? " focused" : ""}`}>
                    <textarea id="input" ref={this.inputRef} onFocus={() => this.setState({ inputFocused: true })}
                        onInput={this.inputChanged} onKeyPress={this.msgInputKeyPressed} className="form-control"
                        placeholder={text.placeholder} onBlur={this.inputBlur} />
                    <div className="input-group-append">
                        <button id="sendBtn" className={`pl-3 pr-3 btn btn-${this.state.inputFocused ? "success ml-1 mr-1" : "outline-success ml-2"}`} onClick={this.sendMsg}><FontAwesomeIcon icon={faPaperPlane} /></button>
                    </div>
                </div>
                <div ref={this.msgpanel} id="msgpanel" className={`${this.state.theme === "dark" ? "dark" : ""}`}></div>
            </div>
            <Menu voicButtonClick={this.voicButtonClick} voiceActive={this.state.micStream !== null} voiceOnline={this.state.voiceOnline}
                theme={this.state.theme} registered={this.context.registered} lang={this.context.lang} menu={this.menu} open={this.state.menuopen}
                closemenu={this.closemenu} icon={this.state.icon} name={this.state.name} users={this.state.users}
                selusers={this.state.selusers} userClicked={this.userClicked} public={this.state.public}
                setPublic={this.setPublic} sound={this.state.sound} soundClicked={this.soundClicked} />
        </div>
    }
    initToastsMaxHeight = () => {
        if (this.toastsRef.current) {
            this.toastsRef.current.style.maxHeight =
                document.scrollingElement.clientHeight - this.toastsSpaceBottom + "px";
            clearInterval(this.toaster);
        }
    }
    async componentDidMount() {
        window.addEventListener("scroll", this.windowScrolled);
        window.addEventListener("resize", this.windowResized);
        this.toaster = setInterval(this.initToastsMaxHeight, 100);
        try {
            await this.connection.start();
            let data = await this.connection.invoke("Enter", this.props.match.params["room"],
                this.state.icon, null, this.msgsCount);
            this.processEnter(data);
        }
        catch (err) {
            this.setState({ failed: err.message });
        }
    }
    componentWillUnmount() {
        if (!this.unmounted) {
            this.unmounted = true;
            window.removeEventListener("scroll", this.windowScrolled);
            window.removeEventListener("resize", this.windowResized);
            this.connection.stop();
        }
    }
}