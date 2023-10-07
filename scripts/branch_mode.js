import { request_builder } from "./request_builder.js"
import { API_HOST, SELF_HOST } from "./host_envs.js"
import { get_limit, show_download_button, hide_download_button, get_selected } from "./dom_elements.js"
import { get_empty_prop } from "./cut_mode.js"

let all_clients = []
let all_paths = []
let olt = {lat: null, lng: null}

async function closest_poste(position, map){
    let end_point = "/closest-node/"
    let poste_response = await request_builder(end_point, "POST", {lat: position.lat, lng: position.lng,}) 
    const poste_pair = poste_response["closest-pair"]

    if (poste_pair.dist > get_limit()){
        alert("cliente invalido, viola o limite de distancia ao alcançar a rede")
        throw new Error("invalid client")
    }

    const house_icon = new L.icon({iconUrl: SELF_HOST + "/styles/marker_icons/house.png", iconSize: [50, 50]})
    const client_marker = new L.marker([position.lat, position.lng], {title: "client", icon: house_icon})
    client_marker.addTo(map)

    const poste_icon = new L.icon({iconUrl: SELF_HOST + "/styles/marker_icons/poste.png", iconSize: [40, 40]})
    const poste_marker = new L.marker([poste_pair.node.lat, poste_pair.node.lng], {title: "poste", icon: poste_icon})
    poste_marker.addTo(map)

    const poste_cord = new L.LatLng(poste_pair.node.lat, poste_pair.node.lng)

    const line = new L.Polyline([position, poste_cord], {
        color: 'green',
        weight: 3,
        opacity: 1,
        smoothFactor: 1
    })
    map.addLayer(line);
    return poste_pair
}


async function get_branches_from(poste, cost, limit){
    const end_point = "/limited-branching/"
    const paths = await request_builder(end_point, "POST", {node: {id: poste},
        cost: cost,
        limit: limit
    });
    return paths.paths;
}


async function downloadFile(){
        if (get_empty_prop(olt) !== null){
            alert('invalid OLT')
            return
        }
        const selected = get_selected()
        const data = {
            Paths: all_paths,
            OLT: olt,
            Clients: all_clients,
            Cable_id:selected.cable,
            Splicebox_id:selected.box,
            Uspliters_id:selected.uspliters,
            Bspliters_id:selected.bspliters
        }
        const a = document.createElement('a');
        

        const response = await fetch(API_HOST + "/txt-sub-graph/", {
            method:"POST",
            credentials:'include',
            body:JSON.stringify(data)
        })

        const file = await response.blob()
        a.href= URL.createObjectURL(file);
        a.download = "instance";
        a.click();
        URL.revokeObjectURL(a.href);
        // clears module vairables for generation of next instance
        all_clients = []
        all_paths = []
    }


async function handle_click_branch(position, map){    
    if (get_empty_prop(olt) !== null){
        olt.lat = position.lat
        olt.lng = position.lng
        // new google.maps.Marker({
        //     position: position,
        //     label: "OLT",
        //     map: map,
        // });
        const olt_icon = new L.icon({iconUrl: SELF_HOST + "/styles/marker_icons/olt.png", iconSize: [40, 40]})
        const olt_marker = new L.marker([position.lat, position.lng], {title: "OLT", icon:olt_icon})
        olt_marker.addTo(map)
        return
    }
    try{
        let poste = await closest_poste(position, map);

        let pathing = await get_branches_from(poste.node.id, poste.dist, get_limit());
        // draw_branching_lines(pathing, map);
        show_download_button();
        all_clients.push({lat: position.lat, lng: position.lng})
        all_paths.push(pathing)
    }
    catch {
        return
    }
}
const handle_click_download = async () => { 
    // acutualy handles the download button not the map itself
    await downloadFile();
    hide_download_button();
    return;
}

export { handle_click_branch, handle_click_download }
