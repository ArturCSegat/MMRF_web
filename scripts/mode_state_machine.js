import { get_mode, set_mode } from "./dom_elements.js"
import { handle_click_cut, get_empty_prop } from "./cut_mode.js"
import { handle_click_branch } from "./branch_mode.js"

// this will handle any clicks given to the map element and determine what to do with them
// will also auto change modes without user input 


async function click_state_machine(position, postes, square_limits, map){
    const initial_mode = get_mode();
    if (initial_mode === "BRANCH"){
        await handle_click_branch(position, square_limits, map)
    }
    if (initial_mode === "CUT"){
        handle_click_cut(position, square_limits, get_empty_prop(square_limits), map) 
    }
}


export { click_state_machine }
