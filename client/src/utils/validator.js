import validator from "validator";
import LocalizedStrings from "react-localization";
const errors = new LocalizedStrings({
    en: {
        empty: "Please fill out this field.",
        email: "Invalid email address.",
        password: "Password length must be between 6 and 16 characters.",
        name: {
            length: "Name length must be between 4 and 40 characters.",
            junk: "Only dots, dashes and spaces are allowed.",
            first: "First character must be alphanumeric.",
            punctuation: "Incorrect punctuation.",
            continue: "Please continue."
        },
        confirm: "Not confirmed.",
        description: "Maximum length is 200 characters."
    },
    ru: {
        empty: "Пожалуйста, заполните поле.",
        email: "Неверный адрес электронной почты.",
        password: "Длина пароля должна быть от 6 до 16 символов.",
        name: {
            length: "Длина имени должна быть от 4 до 40 символов.",
            junk: "Допускаются только точки, тире и пробелы.",
            first: "Первый символ должен быть буквой или цифрой.",
            punctuation: "Неправильная пунктуация.",
            continue: "Продолжайте, пожалуйста."
        },
        confirm: "Не подтверждён.",
        description: "Максимальная длина 200 символов."
    }
})

export default class {
    static name(data, lang, search = false) {
        errors.setLanguage(lang);
        if (search) {
            if (!data) return false;
            if (data.length > 40) return errors.name.length;
        }
        else if (!data || data.length > 40) return errors.name.length;
        const verify = marks => {
            for(let i = marks.length - 1; i >= 0; i--){
                switch(marks[i]){
                    case '.':
                        if(i > 0) return errors.name.punctuation;
                        break;
                    case '-':
                        if((i > 0 && marks[i - 1] !== ' ') || (i > 1 && marks[i-2] === '-'))
                            return errors.name.punctuation;
                        break;
                    case ' ':
                        if(i > 0 && marks[i - 1] === ' ') return errors.name.punctuation;
                        break;
                    default:;
                }
            }
        }
        let marks = "";
        for (let i = data.length - 1; i >= 0; i--) {
            let char = data.charAt(i);
            if (char === '.' || char === ' ' || char === '-')
                marks = char + marks;
            else {
                if (marks.length) {
                    debugger;
                    let ret = verify(marks);
                    if (ret) return ret;
                    else marks = "";
                }
            }
        }
        if (!(/^[\p{L}\d.\- ]+$/gu).test(data))
            return errors.name.junk;
        let firstchar = data[0];
        if (firstchar === '.' || firstchar === ' ' || firstchar === '-')
            return errors.name.first;
        if (!search) {
            let lastchar = data[data.length - 1];
            if (lastchar === ' ' || lastchar === '-')
                return errors.name.continue;
        }
        if (!search)
            if (data.length < 4)
                return errors.name.length;
        return "";
    }
    static email(data, lang) {
        errors.setLanguage(lang);
        if (validator.isEmpty(data))
            return errors.empty;
        if (!validator.isEmail(data))
            return errors.email;
        return "";
    }
    static password(data, lang) {
        errors.setLanguage(lang);
        if (!validator.isLength(data, { min: 6, max: 16 }))
            return errors.password;
        return "";
    }
    static confirm(password, confirmation, lang) {
        errors.setLanguage(lang);
        if (!validator.isLength(password, { min: 6, max: 16 }) ||
            !validator.isLength(confirmation, { min: 6, max: 16 }))
            return errors.confirm;
        if (password !== confirmation)
            return errors.confirm;
        return "";
    }
    static description(data, lang) {
        errors.setLanguage(lang);
        if (data && data.length > 200)
            return errors.description;
        return "";
    }
}