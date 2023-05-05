import { request_builder } from "./request_builder.js"
import { draw_branching_lines } from "./draw.js"
import { get_limit } from "./dom_elements.js"
import { get_empty_prop } from "./cut_mode.js"


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
        strokeColor: '#0000ff',
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
}


export { handle_click_branch }
