import Errors from "./Errors";
export async function Post(addr, data, lang) {
    let resp = await fetch(addr, {
        method: 'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    return await postproc(resp, lang);
}
export async function Get(addr, lang) {
    let resp = await fetch(addr, {
        method: 'get',
        headers: {
            'Accept': 'application/json'
        }
    });
    return await postproc(resp, lang);
}
async function postproc(resp, lang) {
    let data = await resp.json();
    if (resp.status === 200)
        return data;
    if (resp.status === 400 && !data.errors) {
        Errors.setLanguage(lang);
        alert(Errors[data]);
        return null;
    }
    throw data;
}