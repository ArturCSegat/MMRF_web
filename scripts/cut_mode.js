import { set_mode, read_files } from "./dom_elements.js";
import { draw_square } from "./draw.js";

function get_empty_prop(square){
        for (let coord in square){
            if (square[coord] === null){
                return coord
            }
        }
    return null;
}


function handle_click_cut(position, square_limits, square_prop, map){
    // new google.maps.Marker({    // marks the click
    //     position: position,
    //     map: map
    // });
    const corner_marker = new L.marker([position.lat, position.lng])
    corner_marker.addTo(map)

    square_limits[square_prop] = position
    
    if (get_empty_prop(square_limits) != null){
        return;
    }
    draw_square(square_limits, map);
    set_mode("BRANCH")
    document.getElementById("file_container").style.display = "flex"

    document.getElementById("file_entry").addEventListener("change", async () => {
        console.log(JSON.stringify(square_limits))
        read_files(square_limits, map)
        document.getElementById("new-session-button").style.display = "flex"
    });
}

export { handle_click_cut, get_empty_prop }
