import { request_builder } from "./request_builder.js"
import { draw_branching_lines, get_color } from "./draw.js"
import { get_limit, show_download_button, hide_download_button, get_selected } from "./dom_elements.js"

let all_clients = []
let all_paths = []


async function closest_poste(position, map){
    let end_point = "/closest-node/"
    let poste_pair = await request_builder(end_point, "POST", {lat: position.lat, lng: position.lng,}) 

    let poste_cord = new google.maps.LatLng(poste_pair["closest-pair"].node.lat,
        poste_pair["closest-pair"].node.lng); 

    new google.maps.Marker({                // creates marker at postions of closest poste
        position: poste_cord,
        map: map,
    });

    new google.maps.Polyline({              // connect branching and user's click
        path: [position, poste_cord],
        strokeColor: get_color(poste_pair.dist, get_limit()),
        strokeOpacity: 1.0,
        strokeWeight: 3,
        map: map

    })
    return poste_pair["closest-pair"]
}


async function get_branches_from(poste, cost, limit, square_limits){
    const end_point = "/spread-radius/"
    const paths = await request_builder(end_point, "POST", {node: {id: poste},
        cost: cost,
        limit: limit, square: square_limits});
    return paths.paths;
}


async function downloadFile(){
        const selected = get_selected()
        const data = {
            Paths: all_paths,
            Clients: all_clients,
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
        map: map,
    });

    let poste = await closest_poste(position, map);

    let limiter = {top: null, bot: null}
    if (square_limits.top === null && square_limits.bot === null){
        limiter.top = {lat: 90.0, lng: -180.0}
        limiter.bot = {lat: -90.0, lng: 180.0}
    } else {
        limiter = square_limits
    }

    let pathing = await get_branches_from(poste.node.id, poste.dist, get_limit(), limiter);
    draw_branching_lines(pathing, map);
    show_download_button();
    all_clients.push({lat: position.lat, lng: position.lng})
    all_paths.push(pathing)
    console.log("cs")
    console.log(all_clients)
    console.log("ps")
    console.log(all_paths)
}
const handle_click_download = async () => { 
    // acutualy handles the download button not the map itself
    await downloadFile();
    hide_download_button();
    return;
}

export { handle_click_branch, handle_click_download }
