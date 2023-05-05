// This file handles drawing various shapes to the gogle maps canvas

function draw_square(square_cord, map){     // draws a square on a given google maps object
    const a = square_cord.top;
    const b = square_cord.bot;
    const inv_a = {lat: a.lat, lng: b.lng}; 
    const inv_b = {lat: b.lat, lng: a.lng};
    const path = [a, inv_a, b, inv_b, a];
    console.log("drawing", path);

    const line = new google.maps.Polyline({
        path: path,
        strokeColor: '#ff0000',
        strokeOpacity: 1.0,
        strokeWeight: 3,
        map: map
    });
}

function draw_branching_lines(node_paths, map){
    console.log("drawlin ran");
    let len = node_paths.length;
    for(let i = 0; i<len; ++i){
        let path = node_paths[i];
        let drawable_path = [];        // the path wont come in a drawable state due to JSON, and the gmaps api, so we do this
        path.Nodes.forEach(poste => {
           drawable_path.push({lat: poste.lat, lng: poste.lng});
        });
        console.log(i, "is", drawable_path)
        const line = new google.maps.Polyline({
            path: drawable_path,
            strokeColor: '#00ff00',
            strokeOpacity: 1.0,
            strokeWeight: 3,
            map: map
        });
    }
}


export { draw_square, draw_branching_lines }
