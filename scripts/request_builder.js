import { API_HOST } from "./host_envs.js";

async function request_builder(end_point, method, payload){
    const host = API_HOST 
    const url = host + end_point;
    const request = await fetch(url, {method:method,  credentials:"include", body:JSON.stringify(payload)})
    const data = await request.json()
    return data
}
export { request_builder }
