async function request_builder(end_point, method, payload){
    const host = "http://localhost:1337"
    const url = host + end_point;
    console.log(url, method, JSON.stringify(payload))
    const request = await fetch(url, {method:method,  credentials:"include", body:JSON.stringify(payload)})
    const data = await request.json()
    return data
}
export { request_builder }
