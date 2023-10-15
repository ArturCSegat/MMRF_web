import { set_mode, read_files } from "./dom_elements.js";
import { draw_square } from "./draw.js";
import { SELF_HOST } from "./host_envs.js";

function get_empty_prop(square){
        for (let coord in square){
            if (square[coord] === null){
                return coord
            }
        }
    return null;
}


function handle_click_cut(position, square_limits, square_prop, olt, map){
    // new google.maps.Marker({    // marks the click
    //     position: position,
    //     map: map
    // });
    
    if (get_empty_prop(square_limits) != null){
        square_limits[square_prop] = position
        new L.marker([position.lat, position.lng]).addTo(map)
        if (square_prop === "bot") {
            draw_square(square_limits, map);
        }
        return;
    }
    if (olt.lat === null || olt.lng === null) {
        olt.lat = position.lat
        olt.lng = position.lng
        const olt_icon = new L.icon({iconUrl: SELF_HOST + "/styles/marker_icons/olt.png", iconSize: [40, 40]})
        new L.marker([position.lat, position.lng], {title: "OLT", icon:olt_icon}).addTo(map)
    }
    set_mode("BRANCH")
    document.getElementById("file_container").style.display = "flex"

    document.getElementById("file_entry").addEventListener("change", async () => {
        read_files(square_limits, olt, map)
        document.getElementById("new-session-button").style.display = "flex"
    });
}

export { handle_click_cut, get_empty_prop }
