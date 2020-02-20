import LocalizedStrings from "react-localization";
const text = new LocalizedStrings({
    en:{
        emailTaken: "This email is already in use. Please use another one.",
        confEmailNotFound: "It seems you haven't registered yet or your confirmation period has expired. Please register.",
        emailOrPassInc: "The email address or password is incorrect.",
        badName: "Wrong name format.",
        notRegistered: "User not registered.",
        emptyRequest: "Empty request.",
        noRoom: "No room found."
    },
    ru:{
        emailTaken: "Этот электронный адрес уже используется. Пожалуйста, используйте другой.",
        confEmailNotFound: "Кажется, вы еще не зарегистрировались или ваш период подтверждения истек. Пожалуйста, зарегистрируйтесь.",
        emailOrPassInc: "Адрес электронной почты или пароль неверны.",
        badName: "Неправильный формат имени.",
        notRegistered: "Пользователь не зарегистрирован.",
        emptyRequest: "Пустой запрос.",
        noRoom: "Комната не найдена."
    }
});

export default text;