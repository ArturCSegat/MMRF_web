import { get_mode, set_mode, fill_selects } from "./dom_elements.js"
import { handle_click_cut, get_empty_prop } from "./cut_mode.js"
import { handle_click_branch } from "./branch_mode.js"
import { draw_infostructure_lines } from "./draw.js";

// this will handle any clicks given to the map element and determine what to do with them
// will also auto change modes without user input 


async function click_state_machine(position, square_limits, map){
    const initial_mode = get_mode();
    if (initial_mode === "BRANCH"){
        await handle_click_branch(position, map)
    }
    if (initial_mode === "CUT"){
        handle_click_cut(position, square_limits, get_empty_prop(square_limits), map) 
    }
}


async function session_mode_machine(map){
    const valid_session = 200
    const no_session = 401
    const session = await fetch("http://localhost:1337/has-session/", {credentials: "include"})
    if (session.status == valid_session){
        set_mode("BRANCH")
        document.getElementById("file_container").style.visibility = "hidden"
        const response = await fetch("http://localhost:1337/drawable-paths/", {credentials: "include"})
        const response_data = await response.json()
        draw_infostructure_lines(response_data.drawablePaths, map)
        let new_session_button = document.getElementById("new-session-button")
        new_session_button.style.visibility = "visible"
        fill_selects()
    }
    if (session.status == no_session){
        set_mode("CUT")
        fill_selects()
    }
}

export { click_state_machine, session_mode_machine }
