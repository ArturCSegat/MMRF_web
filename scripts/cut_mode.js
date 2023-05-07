import { set_mode } from "./dom_elements.js";
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
    console.log("cutting");
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

}

export { handle_click_cut, get_empty_prop }
