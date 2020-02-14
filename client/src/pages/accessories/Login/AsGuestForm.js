import React, { useContext, useState, useRef } from "react";
import { Context } from "../../../data/Context";
import validate from "../../../utils/validator";
import { Alert } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignInAlt } from "@fortawesome/free-solid-svg-icons";
import LocalizedStrings from "react-localization";

const text = new LocalizedStrings({
    en: {
        header: "Sign In as a Guest",
        placeholder: "Guestname",
        submit: "Sign In",
        alertHeader: "Be advised to register",
        alertBody: "As a guest you will not be able to create your own group, receive notifications, and change the language. Consider registering and logging in as a user."
    },
    ru: {
        header: "Войти как Гость",
        placeholder: "Имя гостя",
        submit: "Войти",
        alertHeader: "Рекомендуем зарегистрироваться",
        alertBody: "В качестве гостя вы не сможете создать собственную группу, получать уведомления и изменять язык. Рассмотрите возможность регистрации и входа в систему как пользователь."
    }
})

export function AsGuestForm(props) {
    const context = useContext(Context);
    const [error, setError] = useState("");
    const input = useRef(null);

    const clearError = () => {
        if (error)
            setError("");
    }
    const submit = () => {
        let newError = validate.name(input.current.value, context.lang);
        if (newError)
            setError(newError);
        else {
            //send request
        }
    }
    const keyPressed = ev => {
        if (ev.which === 13)
            submit();
    }
    text.setLanguage(context.lang);
    return <div className="loginframe">
        <h5 className="text-secondary text-center mb-5">{text.header}</h5>
        <div className="signbox">
            <div className="input-group mb-3">
                <input className="form-control" onKeyPress={keyPressed} placeholder={text.placeholder}
                    name="name" ref={input} />
                <div className="form-control-append">
                    <button className="btn btn-outline-primary" onClick={submit}>
                        <FontAwesomeIcon icon={faSignInAlt} /> {text.submit}</button>
                </div>
            </div>
            {
                error && <Alert variant="danger" onClose={clearError} dismissible>
                    {error}
                </Alert>
            }
            <div className="alert alert-warning">
                <div className="alert-heading h4">{text.alertHeader}</div>
                <hr />
                <p>{text.alertBody}</p>
            </div>
        </div>
    </div>
}
