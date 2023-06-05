async function request_builder(end_point, method, payload){
    const host = "http://localhost:1337"
    const url = host + end_point;
    console.log(url, method, JSON.stringify(payload))
    const request = await fetch(url, {method:method,  headers:{'Content-Type': 'application/json', "Access-Control-Allow-Origin" : "*"}, body:JSON.stringify(payload)})
    const data = await request.json()
    for (let prop in data){
        let valid_data = data[prop]
        console.log(valid_data)
        return valid_data
    }
}
export { request_builder }
