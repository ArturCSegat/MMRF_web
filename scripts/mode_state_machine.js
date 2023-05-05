// this will handle any clicks given to the map element and determine what to do with them
// will also auto change modes without user input 
import { get_mode, set_mode } from "./dom_elements.js"
import { handle_click_create } from "./create_mode.js"
import { handle_click_cut, get_empty_prop } from "./cut_mode.js"
import { handle_click_branch } from "./branch_mode.js"


async function click_state_machine(position, postes, square_limits, map){
    const initial_mode = get_mode();
    console.log("state");
    if (initial_mode === "BRANCH"){
        await handle_click_branch(position, square_limits, map)
    }
    if (initial_mode === "CUT"){
        console.log("sq limits", square_limits);
        handle_click_cut(position, square_limits, get_empty_prop(square_limits), map) 
    }
    if (initial_mode === "CREATE"){
        await handle_click_create(position, postes, map)
    }
}


export { click_state_machine }
