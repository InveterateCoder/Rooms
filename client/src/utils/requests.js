export async function Post(addr, data) {
    try {
        let resp = await fetch(addr, {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        return await postproc(resp);
    } catch (ex) {
        return { data: ex, fatal: true }
    }
}
export async function Get(addr) {
    try {
        let resp = await fetch(addr, {
            method: 'get',
            headers: {
                'Accept': 'application/json'
            }
        });
        return await postproc(resp);
    } catch (ex) {
        return { data: ex, fatal: true }
    }
}
async function postproc(resp) {
    let data = await resp.json();
    if (resp.status === 200)
        return { data }
    if (resp.status === 400 && !data.errors)
        return { error: data }
    return { data, fatal: true }
}