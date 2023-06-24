import { draw_infostructure_lines } from "./draw.js"

// FILE FOR OPERATIONS REGARDING DOM ELEMENTS

function read_files(limiter, map){
    let data = new FormData();
    const input = document.getElementById("file_entry");
    data.append("rede", input.files[0]);
    data.append("limiter", JSON.stringify(limiter))

    let map_div = document.getElementById("map")
    let map_container = document.getElementById("map-container")
    
    var loading = document.createElement('div')
    loading.className = 'loading-animation'

    map_container.removeChild(map_div)
    map_container.appendChild(loading)

    fetch("http://localhost:1337/upload_csv/", {method: "POST", credentials: "include", body: data, header: {
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data',},
    })
    .then(response => {
        map_container.removeChild(loading)
        map_container.appendChild(map_div)
        response.json().then(response_data => {
            const paths = response_data.drawablePaths
            draw_infostructure_lines(paths, map)
        })
    })
}


function handle_limit_click(){
    let new_limit = prompt("new limit")
    if (new_limit === null || new_limit === ""){
        return
    }
    document.getElementById("limit").innerText = new_limit
}


function get_limit(){
    const limit_obj = document.getElementById("limit")
    return parseFloat(limit_obj.innerHTML)
}


function get_mode(){
    const mode_obj = document.getElementById("mode")
    return mode_obj.innerText
}


function set_mode(mode){
    mode = mode.toUpperCase()
    if (!["BRANCH", "CUT"].includes(mode)){
        mode = "BRANCH"
    }
    document.getElementById("mode").innerText = mode
}

function show_download_button(){
    const dowload_button = document.getElementById("download");
    dowload_button.style.visibility = "visible"
}


function hide_download_button(){
    const dowload_button = document.getElementById("download");
    dowload_button.style.visibility = "hidden"
}


async function fill_selects(){
    let select = document.getElementById("cables")
    const cables_response = await fetch("http://localhost:1337/get-all-cables/")
    const json_cables = await cables_response.json()
    const cables = json_cables.cables
    
    for(let i = 0; i<cables.length; i++){
        let opt = document.createElement('option');
        opt.value = cables[i].id;
        opt.innerHTML = JSON.stringify(cables[i]);
        select.appendChild(opt);
    }


    select = document.getElementById("spliceboxes")
    const boxes_response = await fetch("http://localhost:1337/get-all-spliceboxes/")
    const json_boxes = await boxes_response.json()
    const boxes = json_boxes.boxes
    
    for(let i = 0; i<boxes.length; i++){
        let opt = document.createElement('option');
        opt.value = boxes[i].id;
        opt.innerHTML = JSON.stringify(boxes[i]);
        select.appendChild(opt);
    }

    select = document.getElementById("uspliters")
    const uspliters_response = await fetch("http://localhost:1337/get-all-uspliters/")
    const json_uspliters = await uspliters_response.json()
    const uspliters = json_uspliters.uspliters
    
    for(let i = 0; i<uspliters.length; i++){
        let opt = document.createElement('option');
        opt.value = uspliters[i].id;
        opt.innerHTML = JSON.stringify(uspliters[i]);
        select.appendChild(opt);
    }

    select = document.getElementById("bspliters")
    const bspliters_response = await fetch("http://localhost:1337/get-all-bspliters/")
    const json_bspliters = await bspliters_response.json()
    const bspliters = json_bspliters.bspliters
    
    for(let i = 0; i<bspliters.length; i++){
        let opt = document.createElement('option');
        opt.value = bspliters[i].id;
        opt.innerHTML = JSON.stringify(bspliters[i]);
        select.appendChild(opt);
    }
}


function get_selected(){
    const selectCable = document.getElementById('cables');
    const selectedCables = Array.from(selectCable.selectedOptions).map_div(option => parseInt(option.value));

    const selectBox = document.getElementById('spliceboxes');
    const selectedBoxes = Array.from(selectBox.selectedOptions).map_div(option => parseInt(option.value));

    const selectUspliter = document.getElementById('uspliters');
    const selectedUspliters = Array.from(selectUspliter.selectedOptions).map_div(option => parseInt(option.value));

    const selectBspliter = document.getElementById('bspliters');
    const selectedBspliters = Array.from(selectBspliter.selectedOptions).map_div(option => parseInt(option.value));

    return {cables:selectedCables, boxes: selectedBoxes, uspliters: selectedUspliters, bspliters: selectedBspliters}
}


window.onload = fill_selects
window.read_files = read_files;
window.handle_limit_click = handle_limit_click
export { get_limit, get_mode, set_mode, show_download_button, hide_download_button, get_selected, read_files }
