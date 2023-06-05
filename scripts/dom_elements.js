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

window.handle_mode_click = handle_mode_click;
window.read_files = read_files;
export { get_limit, get_mode, set_mode, show_download_button, hide_download_button }
