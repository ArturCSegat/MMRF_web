// FILE FOR OPERATIONS REGARDING DOM ELEMENTS

// this functin will also handle setting the session cookie for some reason 
// TODO: fix this lates it is stupid
async function read_files(){
    let data = new FormData();
    const input = document.getElementById("file_entry");
    data.append("rede", input.files[0]);
    await fetch("http://localhost:1337/upload_csv/", {method: "POST", credentials: "include", body: data})
    window.location.reload()
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

function handle_mode_click(){
    const modes = ["BRANCH", "CUT"];
    const current_mode = get_mode();
    for (let i = 0; i<modes.length; i++){
        if (modes[i] === current_mode){
            if (i === 1){ // 2 is the lenght of modes - 1
                i = -1 // must be -1 because it will be incremanted soon
            }
            set_mode(modes[i+1])
            return
        }
    }
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
    const selectedCables = Array.from(selectCable.selectedOptions).map(option => parseInt(option.value));

    const selectBox = document.getElementById('spliceboxes');
    const selectedBoxes = Array.from(selectBox.selectedOptions).map(option => parseInt(option.value));

    const selectUspliter = document.getElementById('uspliters');
    const selectedUspliters = Array.from(selectUspliter.selectedOptions).map(option => parseInt(option.value));

    const selectBspliter = document.getElementById('uspliters');
    const selectedBspliters = Array.from(selectBspliter.selectedOptions).map(option => parseInt(option.value));

    return {cables:selectedCables, boxes: selectedBoxes, uspliters: selectedUspliters, bspliters: selectedBspliters}
}


window.onload = fill_selects
window.handle_mode_click = handle_mode_click;
window.read_files = read_files;
export { get_limit, get_mode, set_mode, show_download_button, hide_download_button, get_selected }
