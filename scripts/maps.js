import { click_state_machine, session_mode_machine } from "./mode_state_machine.js";
import { set_mode } from "./dom_elements.js";
import { downloadFile } from "./branch_mode.js"; 

async function initMap() { // square_cord is an arra that stores the cordinates for a diagonal of the cut square_cord
    set_mode("CUT");
    let square_limits = {top: null, bot: null}
    let olt = {lat: null, lng: null}

    let map = new L.map('map', { center: [-29.91113120515485, -50.70384997933515], zoom:10})
    let layer = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
    map.addLayer(layer)

    map.on("click", (event) => {
        click_state_machine(event.latlng, square_limits, olt, map); 
    });

    await session_mode_machine(map)
    
    const handle_click_download = async () => { 
        // acutualy handles the download button not the map itself
        await downloadFile();
        return;
    }

    document.getElementById("download").addEventListener("click", handle_click_download);
}


window.onload = initMap;
