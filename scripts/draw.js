import { get_limit } from "./dom_elements.js"


// This file handles drawing various shapes to the gogle maps canvas

function draw_square(square_cord, map){     // draws a square on a given google maps object
    const a = square_cord.top;
    const b = square_cord.bot;
    const inv_a = {lat: a.lat, lng: b.lng}; 
    const inv_b = {lat: b.lat, lng: a.lng};
    const path = [a, inv_a, b, inv_b, a];

    const line = new google.maps.Polyline({
        path: path,
        strokeColor: '#ff0000',
        strokeOpacity: 1.0,
        strokeWeight: 3,
        map: map
    });
}


function get_color(offset, max_range){
    // defines the colour range of the paths
    let colors = ["#004d00", "#008000", "#00cc00", "#808000", "#cccc00", "#e60000", "#990000", "#660000"];
    //          dark            lighter   light     yellow      lighter     light     darker    very dark
    //          green           green     green     yellow      yellow      red        red        red
    
    let indexer = 0;
    for (let i = 1; i <= offset && indexer < colors.length - 1; i++){
        i += max_range / 10;  // calculates how many 10%'s of the max the current offset is     
        indexer++;
    }
    return colors[indexer];
}


function draw_branching_lines(node_paths, map){
    let len = node_paths.length;
    for(let i = len - 1; i>=0; --i){
        let path = node_paths[i];
        let drawable_path = [];        // the path wont come in a drawable state due to JSON, and the gmaps api, so we do this
        path.Nodes.forEach(poste => {
           drawable_path.push({lat: poste.lat, lng: poste.lng});
        });
        const line = new google.maps.Polyline({
            path: drawable_path,
            strokeColor: get_color(path.Cost, get_limit()),
            strokeOpacity: 1.0,
            strokeWeight: 3,
            map: map
        });
    }
}


export { get_color, draw_square, draw_branching_lines }
