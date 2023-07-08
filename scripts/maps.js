import { click_state_machine, session_mode_machine } from "./mode_state_machine.js";
import { set_mode } from "./dom_elements.js";
import { handle_click_download } from "./branch_mode.js"; 

async function initMap() { // square_cord is an arra that stores the cordinates for a diagonal of the cut square_cord
    set_mode("CUT");
    let square_limits = {top: null, bot: null}

    let map = new L.map('map', { center: [-29.91113120515485, -50.70384997933515], zoom:10})
    let layer = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
    map.addLayer(layer)

    map.on("click", (event) => {
        console.log(event.latlng)
        click_state_machine(event.latlng, square_limits, map); 
    });

    await session_mode_machine(map)
    
    document.getElementById("download").addEventListener("click", handle_click_download);
}

window.onload = initMap;
