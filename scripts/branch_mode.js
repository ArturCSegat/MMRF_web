import { request_builder } from "./request_builder.js"
import { draw_branching_lines, get_color } from "./draw.js"
import { get_limit, show_download_button, hide_download_button, get_selected } from "./dom_elements.js"

let all_clients = []
let all_paths = []
let all_entry_nodes_ids = [] 


async function closest_poste(position, map){
    let end_point = "/closest-node/"
    let poste_pair = await request_builder(end_point, "POST", {lat: position.lat, lng: position.lng,}) 

    let poste_cord = new google.maps.LatLng(poste_pair["closest-pair"].node.lat,
        poste_pair["closest-pair"].node.lng); 

    new google.maps.Marker({                // creates marker at postions of closest poste
        position: poste_cord,
        label: "poste",
        map: map,
    });

    new google.maps.Polyline({              // connect branching and user's click
        path: [position, poste_cord],
        strokeColor: get_color(poste_pair["closest-pair"].dist, get_limit()),
        strokeOpacity: 1.0,
        strokeWeight: 3,
        map: map

    })
    return poste_pair["closest-pair"]
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
        const selected = get_selected()
        const data = {
            Paths: all_paths,
            Clients: all_clients,
            Entrys: all_entry_nodes_ids, 
            Cables:selected.cables,
            Boxes:selected.boxes,
            Uspliters:selected.uspliters, Bspliters:selected.bspliters}
        console.log(JSON.stringify(data))
        const a = document.createElement('a');
        const response = await fetch("http://localhost:1337/txt-sub-graph/", {
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


async function handle_click_branch(position, square_limits, map){    
    new google.maps.Marker({                // creates marker at postions of user's click
        position: position,
        label: "client",
        map: map,
    });

    let poste = await closest_poste(position, map);

    let pathing = await get_branches_from(poste.node.id, poste.dist, get_limit());
    draw_branching_lines(pathing, map);
    show_download_button();
    all_entry_nodes_ids.push(poste.node.id)
    all_clients.push({lat: position.lat, lng: position.lng})
    all_paths.push(pathing)
}
const handle_click_download = async () => { 
    // acutualy handles the download button not the map itself
    await downloadFile();
    hide_download_button();
    return;
}

export { handle_click_branch, handle_click_download }
