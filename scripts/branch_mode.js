import { request_builder } from "./request_builder.js"
import { draw_branching_lines } from "./draw.js"
import { get_limit, show_download_button, hide_download_button } from "./dom_elements.js"
import { create_and_download_text_file } from "./text_file_handler.js"


async function closest_poste(position){
    let url = "http://localhost:1337/closest-node/"
    let closest = await request_builder(url, "POST", {lat: position.lat, lng: position.lng,}) 
    return closest
}


async function get_branches_from(poste, limit, square_limits){
    const url = "http://localhost:1337/spread-radius/"
    const paths = await request_builder(url, "POST", {node: {id: poste}, limit: limit, square: square_limits})
    return paths;
}


async function handle_click_branch(position, square_limits, map){    
    console.log("lol hc ran");                  // nostalgic value

    new google.maps.Marker({                // creates marker at postions of user's click
        position: position,
        map: map,
    });

    let poste = await closest_poste(position);
    console.log("poste", poste.id, poste);
    let poste_cord = new google.maps.LatLng(poste.lat, poste.lng); 
    new google.maps.Marker({                // creates marker at postions of closest poste
        position: poste_cord,
        map: map,
    });

    new google.maps.Polyline({              // connect branching and user's click
        path: [position, poste_cord],
        strokeColor: '#ffff00',
        strokeOpacity: 1.0,
        strokeWeight: 3,
        map: map

    })

    if (square_limits.top === null && square_limits.bot === null){
        square_limits.top = {lat: 90.0, lng: -180.0}
        square_limits.bot = {lat: -90.0, lng: 180.0}
    }

    let pathing = await get_branches_from(poste.id, get_limit(), square_limits);
    draw_branching_lines(pathing, map);
    show_download_button();
    
    const handle_click = () => {
        console.log("donwloading", JSON.stringify(pathing), "original", pathing)
        create_and_download_text_file(JSON.stringify(pathing), "pathing");
        hide_download_button();
        document.getElementById("download").removeEventListener("click", handle_click);
        return;
    }

    document.getElementById("download").addEventListener("click", handle_click);

}


export { handle_click_branch }
