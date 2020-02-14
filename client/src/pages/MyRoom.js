import React, { useContext, useState } from "react";
import { Context } from "../data/Context";
import validator from "../utils/validator";
import { FlagGroup } from "./accessories/Forms/FlagGroup";
import { FormGroup } from "./accessories/Forms/FormGroup";
import { PasswordGroup } from "./accessories/Forms/PasswordGroup";
import LocalizedStrings from "react-localization";

const text = new LocalizedStrings({
    en: {
        choose: "Choose country",
        set: "Set",
        name: "Name",
        description: "Description",
        active: "Active users",
        pswdholder: "Account password",
        cancel: "Cancel",
        apply: "Apply",
        create: "Create",
        delete: "Delete"
    },
    ru: {
        choose: "Выберите страну",
        set: "Установить",
        name: "Название",
        description: "Описание",
        active: "Активных пользователей",
        pswdholder: "Пароль от аккаунта",
        cancel: "Отмена",
        apply: "Применить",
        create: "Создать",
        delete: "Удалить"
    }
})

export function MyRoom(props) {
    const context = useContext(Context);
    const [rcountry, setRCountry] = useState(context.room.country);
    const [rpassword, setRPassword] = useState(context.room.password);
    const [rname, setRName] = useState(context.room.name);
    const [rdescription, setRDescription] = useState(() => ({
        description: context.room.description,
        error: validator.description(context.room.description, context.lang)
    }));
    const [rnameError, setRNameError] = useState(() => validator.name(rname, context.lang));
    const [rlimit, setRLimit] = useState(context.room.limit);
    const setCountry = code => {
        if (rcountry !== code)
            setRCountry(code);
    }
    const nameChanged = ev => {
        if (rname !== ev.target.value) {
            setRName(ev.target.value);
            setRNameError(validator.name(ev.target.value, context.lang));
        }
    }
    const descriptionChanged = ev => {
        setRDescription({
            description: ev.target.value,
            error: validator.description(ev.target.value, context.lang)
        })
    }
    const rpasswordChanged = pswd => {
        if (rpassword !== pswd)
            setRPassword(pswd);
    }
    const limitChanged = ev => {
        if (ev.target.value >= 2 && ev.target.value <= 50)
            setRLimit(ev.target.value);
    }
    const hasFormChanged = () => {
        if (rcountry !== context.room.country ||
            rname !== context.room.name ||
            rpassword !== context.room.password ||
            rlimit !== context.room.limit ||
            rdescription.description !== context.room.description)
            return true;
        return false;
    }
    const isValid = () => {
        if (rdescription.error || rnameError)
            return false;
        return true;
    }
    const cancelChanges = () => {
        setRCountry(context.room.country);
        setRPassword(context.room.password);
        setRName(context.room.name);
        setRDescription({
            description: context.room.description,
            error: validator.description(context.room.description, context.lang)
        });
        setRNameError(validator.name(context.room.name, context.lang));
        setRLimit(context.room.limit);
    }
    const apply = () => {
        let isdelete = context.room.name && !rname;
        context.changeRoom({
            country: rcountry,
            name: rname,
            limit: rlimit,
            password: isdelete ? "" : rpassword,
            description: isdelete ? "" : rdescription.description
        });
        if (isdelete) {
            setRPassword("");
            setRDescription({ description: "", error: "" });
        }
    }
    text.setLanguage(context.lang);
    return <div className="container formpage">
        <FlagGroup country={rcountry} lock={rpassword} setCountry={setCountry}
            holder={text.choose} add={text.set} />
        <FormGroup type="text" label={text.name} value={rname} inputChanged={nameChanged} error={rnameError} />
        <div className="form-group pt-4 mb-5">
            <label className="h5">{text.description}</label>
            <textarea onChange={descriptionChanged} className="form-control" rows="3" value={rdescription.description} />
            <p className="text-danger"><small>{rdescription.error}</small></p>
        </div>
        <PasswordGroup lang={context.lang} newpassword={rpassword} onChange={rpasswordChanged} />
        <div className="form-group mt-5">
            <label className="h5">{text.active} <span className="badge badge-dark ml-2 p-2">{rlimit}</span></label>
            <input type="range" className="custom-range" min="2" max="50"
                onChange={limitChanged} value={rlimit} id="roomrange" />
        </div>
        <div id="conf_acc_change" className={`${!hasFormChanged() ? "invisible" : ""}`}>
            <button onClick={cancelChanges} className="btn btn-outline-secondary mr-2">{text.cancel}</button>
            {
                context.room.name && !rname
                    ? <button onClick={apply}
                        className="btn btn-danger">{text.delete}</button>
                    : <button disabled={!isValid()} onClick={apply}
                        className={`btn btn-outline-${!isValid() ? "secondary disabled" : "primary"}`}>
                        {context.room.name ? text.apply : text.create}</button>
            }
        </div>
    </div>
}