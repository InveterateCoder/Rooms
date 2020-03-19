import React, { useContext, useState, useEffect } from "react";
import { Context } from "../data/Context";
import { Avatar } from "./accessories/Forms/Avatar";
import { FormGroup } from "./accessories/Forms/FormGroup";
import { PasswordGroup } from "./accessories/Forms/PasswordGroup";
import { FilterGroup } from "./accessories/Forms/FilterGroup";
import { Delete } from "./accessories/Forms/Delete";
import validator from "../utils/validator";
import LocalizedStrings from "react-localization";
import { Loading } from "../Loading";
import { Post, Get } from "../utils/requests";
import urls from "../utils/Urls";
import * as signalR from "@aspnet/signalr";

const text = new LocalizedStrings({
    en: {
        name: "Username",
        filters: "Filters",
        filtersHolder: "Select language",
        add: "Add",
        current: "Current password",
        submit: "Apply",
        language: "Language",
        perpage: "Rooms per page",
        cancel: "Cancel",
        delete: "Delete",
        confirm: "Are you sure you want to delete your account?",
        openin: "Open in",
        opinopts: {
            "nw": "New window",
            "nt": "New tab",
            "st": "Same tab"
        }
    },
    ru: {
        name: "Пользователь",
        filters: "Фильтры",
        filtersHolder: "Выберете язык",
        add: "Добавить",
        current: "Текущий пароль",
        submit: "Применить",
        language: "Язык",
        perpage: "Комнат на стр.",
        cancel: "Отмена",
        delete: "Удалить",
        confirm: "Вы уверены, что хотите удалить свой аккаунт?",
        openin: "Открывать в",
        opinopts: {
            "nw": "Новое окно",
            "nt": "Новая вкладка",
            "st": "Та же вкладка"
        }
    }
});
let connection = null;

export function Account(props) {
    const context = useContext(Context);
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState(context.name);
    const [newpassword, setNewPassword] = useState("");
    const [nameError, setNameError] = useState("");
    useEffect(() => {
        connection = new signalR.HubConnectionBuilder().withUrl("/hubs/rooms",
            { accessTokenFactory: () => context.jwt }).configureLogging(signalR.LogLevel.Error).build();
        connection.start();
        return () => {
            connection.stop();
            connection = null;
        }
    }, []);
    const nameChanged = ev => {
        setName(ev.target.value);
        setNameError(validator.name(ev.target.value, context.lang));
    }
    const newPasswordChanged = pswd => {
        if (newpassword !== pswd)
            setNewPassword(pswd);
    }
    const selectLanguage = ev => {
        setNameError(validator.name(name, ev.target.value));
        connection.invoke("ChangeLanguage", ev.target.value).catch(err => alert(err.message));
        context.setLanguage(ev.target.value);
    }
    const hasFormChanged = () => {
        if (newpassword !== "" || name !== context.name)
            return true;
        return false;
    }
    const isValid = () => {
        if (!nameError)
            return true;
        return false;
    }

    const cancelChanges = () => {
        setNameError("");
        setName(context.name);
    }
    const apply = () => {
        if (isValid() && hasFormChanged()) {
            setLoading(true);
            Post(urls.accountChange,
                { name: name !== context.name ? name : null, password: newpassword ? newpassword : null },
                context.lang, context.jwt).then(jwt => {
                    if (jwt) {
                        context.changeAccaunt(jwt, name);
                        setNewPassword("");
                    }
                    setLoading(false);
                }).catch(() => props.history.push("/fatal"));
        }
    }
    const deleteAccount = () => {
        Get(urls.accountDelete, context.lang, context.jwt)
            .then(success => {
                if (success)
                    context.signOut();
            }).catch(() => props.history.push("/fatal"));
    }
    const changeIcon = icon => {
        connection.invoke("ChangeIcon", icon).catch(err => alert(err.message));
        context.changeIcon(icon)
    }
    text.setLanguage(context.lang);
    return <div className="container formpage">
        <Avatar image={context.icon} selectImage={icon => changeIcon(icon)} />
        <FormGroup type="text" label={text.name} value={name} name="name"
            inputChanged={nameChanged} error={nameError} />
        <PasswordGroup type="password" lang={context.lang} newpassword={newpassword}
            onChange={newPasswordChanged} />
        <div id="conf_acc_change" className={`${hasFormChanged() ? "" : "invisible"}`}>
            <button className="btn btn-outline-secondary mr-2" onClick={cancelChanges}>{text.cancel}</button>
            {
                name
                    ? <button onClick={apply} disabled={!isValid()}
                        className={`btn btn-outline-${!isValid() ? "secondary disabled" : "primary"}`}>
                        {text.submit}</button>
                    : <Delete confirm={text.confirm} delete={text.delete} cancel={text.cancel} onDelete={deleteAccount} />
            }
        </div>
        <hr /><br />
        <FilterGroup label={text.filters} holder={text.filtersHolder} add={text.add} />
        <br />
        <FormGroup type="select" label={text.perpage} value={context.perpage}
            onChange={ev => context.setPerpage(ev.target.value)}
            opts={{ 10: 10, 30: 30, 50: 50 }} />
        <br />
        <FormGroup type="select" label={text.openin} value={context.openin}
            onChange={ev => context.setOpenIn(ev.target.value)}
            opts={{ ...text.opinopts }} />
        <br />
        <FormGroup type="select" label={text.language} value={context.lang} onChange={selectLanguage}
            opts={{ en: "English", ru: "Русский" }} />
        {
            loading && <Loading />
        }
    </div>
}