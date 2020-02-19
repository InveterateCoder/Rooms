import React, { useContext, useState } from "react";
import { Context } from "../data/Context";
import { Avatar } from "./accessories/Forms/Avatar";
import { FormGroup } from "./accessories/Forms/FormGroup";
import { PasswordGroup } from "./accessories/Forms/PasswordGroup";
import { FilterGroup } from "./accessories/Forms/FilterGroup";
import { Delete } from "./accessories/Forms/Delete";
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
        cancel: "Cancel",
        delete: "Delete",
        confirm: "Are you sure you want to delete your account?"
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
        cancel: "Отмена",
        delete: "Удалить",
        confirm: "Вы уверены, что хотите удалить свой аккаунт?"
    }
});

export function Account(props) {
    const context = useContext(Context);
    const [form, setForm] = useState({
        email: context.user.email,
        name: context.user.name,
        newpassword: ""
    });
    const [errors, setErrors] = useState({
        email: "",
        name: ""
    });
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
        if (form.newpassword !== pswd)
            setForm({
                ...form,
                newpassword: pswd
            });
    }
    const selectLanguage = ev => {
        let value = ev.target.value;
        setErrors({
            email: validator.email(form.email, value),
            name: validator.name(form.name, value),
        });
        context.setLanguage(value);
    }
    const hasFormChanged = () => {
        if (form.newpassword !== "" || form.email !== context.user.email ||
            form.name !== context.user.name)
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
            email: context.user.email,
            name: context.user.name,
            newpassword: ""
        });
        setErrors({
            email: "",
            name: ""
        });
    }
    const apply = () => {
        if (isValid() && hasFormChanged()) {
            context.changeUser({
                email: form.email !== context.user.email ? form.email : null,
                name: form.name !== context.user.name ? form.name : null,
                newpassword: form.newpassword ? form.newpassword : null
            });
            setForm({ ...form, newpassword: "" });
        }
    }
    text.setLanguage(context.lang);
    return <div className="container formpage">
        <Avatar image={context.icon} selectImage={name => context.changeIcon(name)} />
        <FormGroup type="text" label={text.email} value={form.email} name="email"
            inputChanged={inputChanged} error={errors.email} />
        <FormGroup type="text" label={text.name} value={form.name} name="name"
            inputChanged={inputChanged} error={errors.name} />
        <PasswordGroup type="password" lang={context.lang} newpassword={form.newpassword}
            onChange={newPasswordChanged} />
        <div id="conf_acc_change" className={`${hasFormChanged() ? "" : "invisible"}`}>
            <button className="btn btn-outline-secondary mr-2" onClick={cancelChanges}>{text.cancel}</button>
            {
                form.name
                    ?   <button onClick={apply} disabled={!isValid()}
                            className={`btn btn-outline-${!isValid() ? "secondary disabled" : "primary"}`}>
                                {text.submit}</button>
                    :   <Delete confirm={text.confirm} delete={text.delete} cancel={text.cancel} onDelete={context.deleteUser} />
            }
        </div>
        <hr />
        <FormGroup type="select" label={text.language} lang={context.lang} selectLanguage={selectLanguage} />
        <br/>
        <FilterGroup label={text.filters} holder={text.filtersHolder} add={text.add} />
    </div>
}