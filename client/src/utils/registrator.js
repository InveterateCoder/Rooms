import Errors from "./Errors";
import {Get, Post} from "./requests";

const urls = {
    signInAsGuest: "/api/sign/guest",

}

export default class {
    constructor(lang){
        Errors.setLanguage(lang);
    }
    async signInAsGuest(name) {
        
    }
    async register(data) {
    }
}