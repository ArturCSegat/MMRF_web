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
    new google.maps.Marker({    // marks the click
        position: position,
        map: map
    });

    square_limits[square_prop] = position
    
    if (get_empty_prop(square_limits) != null){
        return;
    }
    draw_square(square_limits, map);
    set_mode("BRANCH")
    document.getElementById("file_container").style.visibility = "visible"

    document.getElementById("file_entry").addEventListener("change", async () => {
        console.log(JSON.stringify(square_limits))
        await read_files(square_limits)
    });
}

export { handle_click_cut, get_empty_prop }
