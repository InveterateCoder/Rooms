import React, { Component } from "react";
import { Context } from "../data/Context";
import { Preloader } from "../Preloader";
import { Menu } from "./accessories/Room/Menu";
import { Toast } from "react-bootstrap";
import Flag from "react-flags";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faInfoCircle, faExclamationTriangle, faSignInAlt, faArrowCircleDown } from "@fortawesome/free-solid-svg-icons";
import LocalizedStrings from "react-localization";
import Password from "react-type-password";
import validator from "../utils/validator";
import * as signalR from "@aspnet/signalr";

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
        months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        renamed: "was renamed to",
        changedIcon: "has changed icon.",
        roomnameChanged: "The room's name has changed.",
        flagChanged: "The room's flag has changed.",
        bothChanged: "The room's name and flag have changed."
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
        months: ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"],
        renamed: "был переименован в",
        changedIcon: "изменил значок.",
        roomnameChanged: "Название комнаты изменилось.",
        flagChanged: "Флаг комнаты изменился.",
        bothChanged: "Название комнаты и флаг изменились."
    }
})
const pub = '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="globe" class="svg-inline--fa fa-globe fa-w-16 " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512" color="#007bff"><path fill="currentColor" d="M336.5 160C322 70.7 287.8 8 248 8s-74 62.7-88.5 152h177zM152 256c0 22.2 1.2 43.5 3.3 64h185.3c2.1-20.5 3.3-41.8 3.3-64s-1.2-43.5-3.3-64H155.3c-2.1 20.5-3.3 41.8-3.3 64zm324.7-96c-28.6-67.9-86.5-120.4-158-141.6 24.4 33.8 41.2 84.7 50 141.6h108zM177.2 18.4C105.8 39.6 47.8 92.1 19.3 160h108c8.7-56.9 25.5-107.8 49.9-141.6zM487.4 192H372.7c2.1 21 3.3 42.5 3.3 64s-1.2 43-3.3 64h114.6c5.5-20.5 8.6-41.8 8.6-64s-3.1-43.5-8.5-64zM120 256c0-21.5 1.2-43 3.3-64H8.6C3.2 212.5 0 233.8 0 256s3.2 43.5 8.6 64h114.6c-2-21-3.2-42.5-3.2-64zm39.5 96c14.5 89.3 48.7 152 88.5 152s74-62.7 88.5-152h-177zm159.3 141.6c71.4-21.2 129.4-73.7 158-141.6h-108c-8.8 56.9-25.6 107.8-50 141.6zM19.3 352c28.6 67.9 86.5 120.4 158 141.6-24.4-33.8-41.2-84.7-50-141.6h-108z"></path></svg>';
const sec = '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="user-friends" class="svg-inline--fa fa-user-friends fa-w-20 " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" color="#17a2b8"><path fill="currentColor" d="M192 256c61.9 0 112-50.1 112-112S253.9 32 192 32 80 82.1 80 144s50.1 112 112 112zm76.8 32h-8.3c-20.8 10-43.9 16-68.5 16s-47.6-6-68.5-16h-8.3C51.6 288 0 339.6 0 403.2V432c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48v-28.8c0-63.6-51.6-115.2-115.2-115.2zM480 256c53 0 96-43 96-96s-43-96-96-96-96 43-96 96 43 96 96 96zm48 32h-3.8c-13.9 4.8-28.6 8-44.2 8s-30.3-3.2-44.2-8H432c-20.4 0-39.2 5.9-55.7 15.4 24.4 26.3 39.7 61.2 39.7 99.8v38.4c0 2.2-.5 4.3-.6 6.4H592c26.5 0 48-21.5 48-48 0-61.9-50.1-112-112-112z"></path></svg>';
export class Room extends Component {
    static contextType = Context;
    constructor(props, context) {
        super(props, context);
        this.state = {
            failed: "",
            warning: "",
            loading: true,
            blocked: false,
            password: "",
            myId: 0,
            name: context.name,
            icon: context.icon,
            flag: "??",
            roomname: null,
            users: [],
            menuopen: false,
            public: true,
            selusers: [],
            toasts: [],
            sound: null,
            scrolledDown: true
        }
        this.msgsCount = 50;
        this.oldestMsgTime = null;
        this.connection = new signalR.HubConnectionBuilder().withUrl("/hubs/rooms",
            { accessTokenFactory: () => context.jwt }).configureLogging(signalR.LogLevel.Error).build();
        this.connection.onclose(() => this.setState({ failed: text.wrong }));
        this.connection.on("addUser", this.addUser);
        this.connection.on("removeUser", this.removeUser);
        this.connection.on("recieveMessage", this.recieveMessage);
        this.connection.on("roomDeleted", this.roomDeleted);
        this.connection.on("userRemoved", this.userRemoved);
        this.connection.on("usernameChanged", this.usernameChanged);
        this.connection.on("iconChanged", this.iconChanged);
        this.connection.on("roomChanged", this.roomChanged);
        this.menu = React.createRef();
        this.msgpanel = React.createRef();
        this.toastsRef = React.createRef();
        this.toastTimer = null;
    }
    openmenu = () => {
        this.menu.current.focus();
        this.setState({ menuopen: true });
    }
    closemenu = () => this.setState({ menuopen: false });
    windowScrolled = () => {
        let scrTop = document.scrollingElement.scrollTop;
        let scrHeight = document.scrollingElement.scrollHeight;
        let cliHeight = document.scrollingElement.clientHeight;
        if (scrTop === 0 && this.oldestMsgTime) {
            this.connection.invoke("GetMessages", this.oldestMsgTime, this.msgsCount).then(msgs => {
                if (msgs && msgs.length > 0) {
                    this.fillMessages(msgs);
                    document.scrollingElement.scrollTo(0, document.scrollingElement.scrollHeight - scrHeight);
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
            this.setState({ sound: null });
        else
            this.setState({ sound: new Audio(window.location.origin + "/msg.mp3") });
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
                    users: data.payload.users
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
                this.setState({ warning: text.limit });
                break;
            case "noroom":
                this.setState({ warning: text.noroom });
                break;
            default:
                this.setState({ failed: data.code });
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
                this.setState({ failed: err.message });
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
        this.toastTimer = setTimeout(() => {
            this.toastsRef.current.scrollTo(0, this.toastsRef.current.scrollHeight);
        }, 200);
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
    formMessage = (msg, today) => {
        let time = "";
        if (today) time = this.formTime(msg.time, today);
        let elem = document.createElement("div");
        elem.className = "media p-3 mb-3";
        elem.innerHTML = `<img src="/img/${msg.icon}.m.svg" alt="icon" class="mr-3" />
        <div class="media-body">
        <h5 class="text-secondary">${msg.secret ? sec : pub}${msg.sender}<small class="ml-2">${time ? "<code>" + time + "</code>" : "&#8987;"}</small></h5>
        <p class="mb-0">${msg.text}</p>
        </div>`;
        return elem;
    }
    notify = msg => {
        let id = Date.now();
        let date = new Date(id);
        let time = `${date.getHours()}:${date.getMinutes()}`;
        let timeoutId = setTimeout(() => this.removeNotification(id), 7000);
        this.setState({ toasts: [...this.state.toasts, [id, time, msg, timeoutId]] });
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
    sendMsg = target => {
        let val = target.value.trim();
        if (!val) return;
        if (val.length > 2000) {
            this.notify(text.exceeds);
            return;
        }
        target.value = "";
        let ids = this.state.selusers.length > 0 && !this.state.public ? this.state.selusers.map(u => u.id) : null;
        let msg = {
            sender: this.context.name,
            icon: this.context.icon,
            secret: ids !== null,
            text: val
        }
        let element = this.formMessage(msg, null);
        this.appendMessage(element);
        document.scrollingElement.scrollTo(0, document.scrollingElement.scrollHeight);
        this.connection.invoke("SendMessage", val, ids).then(resp => {
            if (!resp || isNaN(resp)) this.setState({ failed: text.wrong });
            else
                element.getElementsByTagName("small")[0].innerHTML = `<code>${this.formTime(resp, new Date())}</code>`;
        }).catch(err => this.setState({ failed: err.message || text.wrong }));
    }
    msgInputKeyPressed = ev => {
        if (ev.which === 13)
            this.sendMsg(ev.target);
    }
    recieveMessage = msg => {
        this.appendMessage(this.formMessage(msg, new Date()));
        if (this.state.sound) this.state.sound.play();
        if (this.state.scrolledDown) document.scrollingElement.scrollTo(0, document.scrollingElement.scrollHeight);
    }
    roomDeleted = () => {
        this.connection.stop();
        this.setState({ warning: text.deleted });
    }
    userRemoved = () => {
        this.connection.stop();
        this.setState({ warning: text.userRemoved });
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
    render() {
        text.setLanguage(this.context.lang);
        if (this.state.failed || this.state.warning) return <div id="failed">
            <FontAwesomeIcon icon={faExclamationTriangle} size="4x" color={this.state.warning ? "orange" : "red"} />
            <h5 className={`mt-3 text-${this.state.warning ? "warning" : "danger"} h5`}>{this.state.warning ? this.state.warning : this.state.failed}</h5>
        </div>
        else if (this.state.loading) return <Preloader />
        else if (this.state.blocked) return <div id="roompass">
            <h4 className="text-info mb-4">Room's password</h4>
            <div className="input-group" onKeyPress={this.passwordKeyPressed}>
                <Password className="form-control" placeholder="Enter password" value={this.state.password}
                    onChange={this.passwordChanged} />
                <div className="input-group-append">
                    <button className="btn btn-primary" onClick={this.confirmPassword}>
                        <FontAwesomeIcon icon={faSignInAlt} />
                    </button>
                </div>
            </div>
        </div>
        else return <div id="room">
            <div ref={this.toastsRef}>
                {this.fillToasts()}
            </div>
            {!this.state.scrolledDown && <button id="scrollDown" className="btn btn-dark"
                onClick={() => document.scrollingElement.scrollTo(0, document.scrollingElement.scrollHeight)}><FontAwesomeIcon icon={faArrowCircleDown} /></button>}
            <div id="roomcont" className="container-fluid">
                <nav className="navbar navbar-expand bg-dark navbar-dark">
                    <button onClick={this.openmenu} className="btnmenu btn btn-dark mr-3"><FontAwesomeIcon icon={faArrowRight} /></button>
                    <Flag className="mr-3" name={this.state.flag} format="png" pngSize={24} shiny={true} basePath="/img" />
                    <span className="navbar-brand">{this.state.roomname}</span>
                </nav>
                <input id="input" type="text" onKeyPress={this.msgInputKeyPressed} className="form-control" placeholder={text.placeholder} />
                <div ref={this.msgpanel} id="msgpanel"></div>
            </div>
            <Menu registered={this.context.registered} lang={this.context.lang} menu={this.menu} open={this.state.menuopen}
                closemenu={this.closemenu} icon={this.state.icon} name={this.state.name} users={this.state.users}
                selusers={this.state.selusers} userClicked={this.userClicked} public={this.state.public}
                setPublic={this.setPublic} sound={this.state.sound} soundClicked={this.soundClicked} />
        </div>
    }
    async componentDidMount() {
        window.addEventListener("scroll", this.windowScrolled);
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
        window.removeEventListener("scroll", this.windowScrolled);
        this.connection.stop();
    }
}