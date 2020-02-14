import React, { useContext, useState } from "react";
import { Context } from "../data/Context";
import { Avatar } from "./accessories/Forms/Avatar";
import { FormGroup } from "./accessories/Forms/FormGroup";
import { PasswordGroup } from "./accessories/Forms/PasswordGroup";
import {FilterGroup} from "./accessories/Forms/FilterGroup";
import validator from "../utils/validator";
import LocalizedStrings from "react-localization";

const text = new LocalizedStrings({
    en: {
        email: "Email",
        name: "Username",
        filters: "Filters",
        filtersHolder: "Select language",
        add: "Add",
        current: "Current password",
        submit: "Apply",
        notifications: "Notifications",
        notifs: {
            true: "On",
            false: "Off"
        },
        language: "Language",
        cancel: "Cancel"
    },
    ru: {
        email: "Эл. почта",
        name: "Пользователь",
        filters: "Фильтры",
        filtersHolder: "Выберете язык",
        add: "Добавить",
        current: "Текущий пароль",
        submit: "Применить",
        notifications: "Уведомления",
        notifs: {
            true: "Вкл.",
            false: "Выкл."
        },
        language: "Язык",
        cancel: "Отмена"
    }
});

export function Account(props) {
    const context = useContext(Context);
    const [form, setForm] = useState({
        icon: context.creds.icon,
        email: context.creds.email,
        name: context.creds.name,
        newpassword: "",
        filters: context.creds.filters
    });
    const [errors, setErrors] = useState({
        email: "",
        name: ""
    });
    const selectIcon = name => {
        setForm({ ...form, icon: name });
    }
    const inputChanged = ev => {
        let name = ev.target.name;
        let value = ev.target.value;
        setErrors({
            ...errors,
            [name]: validator[name](value, context.lang)
        });
        setForm({
            ...form,
            [name]: value
        });
    }
    const newPasswordChanged = pswd => {
        if(form.newpassword !== pswd)
            setForm({
                ...form,
                newpassword:pswd
            });
    }
    const addFilter = (key, value) => {
        setForm({...form, filters:{...form.filters, [key]: value}});
    }
    const deleteFilter = key => {
        let temp = {}
        for (let kkey in form.filters)
            if(kkey !== key) temp[kkey] = form.filters[kkey];
        setForm({...form, filters:temp})
    }

    const toggleNotif = () => context.setNotifications(!context.notifs);
    
    const selectLanguage = ev => {
        let value = ev.target.value;
        setErrors({
            email: validator.email(form.email, value),
            name: validator.name(form.name, value),
        });
        context.setLanguage(value);
    }
    const filtersChanged = () => {
        let locf = Object.keys(form.filters);
        let sysf = Object.keys(context.creds.filters);
        if(locf.length !== sysf.length)
            return true;
        for(let lockey of locf){
            if(!sysf.includes(lockey))
                return true;
        }
        return false;
    }
    const hasFormChanged = () => {
        if (form.newpassword !== "" || filtersChanged() || form.email !== context.creds.email ||
            form.name !== context.creds.name || form.icon !== context.creds.icon)
            return true;
        return false;
    }
    const isValid = () => {
        if (!errors.email && !errors.name)
            return true;
        return false;
    }

    const cancelChanges = () => {
        setForm({
            icon: context.creds.icon,
            email: context.creds.email,
            name: context.creds.name,
            newpassword: "",
            filters: context.creds.filters
        });
        setErrors({
            email: "",
            name: ""
        });
    }
    const apply = () => {
        if (isValid() && hasFormChanged()) {
            context.changeCredentials({
                email: form.email !== context.creds.email ? form.email : null,
                name: form.name !== context.creds.name ? form.name : null,
                icon: form.icon !== context.creds.icon ? form.icon : null,
                newpassword: form.newpassword ? form.newpassword : null,
                filters: filtersChanged() ? form.filters : null
            });
            setForm({...form, newpassword:""});
        }
    }
    text.setLanguage(context.lang);
    return <div className="container formpage">
        <Avatar image={form.icon} selectImage={selectIcon} />
        <FormGroup type="text" label={text.email} value={form.email} name="email"
            inputChanged={inputChanged} error={errors.email} />
        <FormGroup type="text" label={text.name} value={form.name} name="name"
            inputChanged={inputChanged} error={errors.name} />
        <PasswordGroup type="password" lang={context.lang} newpassword={form.newpassword}
            onChange={newPasswordChanged} />
        <FilterGroup label={text.filters} holder={text.filtersHolder} add={text.add}
            addFilter={addFilter} deleteFilter={deleteFilter} filters={form.filters} />
        <div id="conf_acc_change" className={`${hasFormChanged() ? "" : "invisible"}`}>
            <button className="btn btn-outline-secondary mr-2" onClick={cancelChanges}>{text.cancel}</button>
            <button onClick={apply} disabled={!isValid()}
                className={`btn btn-outline-${!isValid() ? "secondary disabled" : "primary"}`}>
                    {text.submit}</button>
        </div>
        <hr />
        <FormGroup type="switch" label={text.notifications} toggleNotif={toggleNotif}
            switchlabel={text.notifs[context.notifs]} />
        <FormGroup type="select" label={text.language} lang={context.lang} selectLanguage={selectLanguage} />
    </div>
}