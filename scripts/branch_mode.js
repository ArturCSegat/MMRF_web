import { request_builder } from "./request_builder.js"
import { draw_branching_lines, get_color } from "./draw.js"
import { get_limit, show_download_button, hide_download_button } from "./dom_elements.js"
import { PathTxtFileWriter } from "./PathTxtFileWriter.js"


async function closest_poste(position, map){
    let end_point = "/closest-node/"
    let poste_pair = await request_builder(end_point, "POST", {lat: position.lat, lng: position.lng,}) 

    let poste_cord = new google.maps.LatLng(poste_pair.node.lat, poste_pair.node.lng); 
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
    return poste_pair
}


async function get_branches_from(poste, cost, limit, square_limits){
    const end_point = "/spread-radius/"
    const paths = await request_builder(end_point, "POST", {node: {id: poste}, cost: cost, limit: limit, square: square_limits})
    return paths;
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
    
    const handle_click = () => { // acutualy handles the download button not the map itself
        // create_and_download_text_file(JSON.stringify(pathing), "pathing");
        let file_writer = new PathTxtFileWriter(`paths_from_${poste.node.id}`);
        file_writer.handleWritesFromPathingSet(pathing);
        file_writer.downloadFile();
        hide_download_button();
        return;
    }

    document.getElementById("download").addEventListener("click", handle_click);

}


export { handle_click_branch }
