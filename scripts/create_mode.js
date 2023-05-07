import {request_builder} from "./request_builder.js"

async function handle_click_create(position, postes, map) {
    console.log("len is ", postes.length);
    console.log("nodes is", postes);
    if (postes === undefined || postes.length === 0){
        const click_marker_bad = new google.maps.Marker({
            position: position,
            label: "1",
            map: map,
        });
        const poste = {id: 1, lat: position.lat, lng: position.lng}
        postes.push(poste)
        return
    }
    console.log(postes)
    const last_poste = postes[postes.length - 1]
    const new_id = parseInt(last_poste.id) + 1
    const click_marker = new google.maps.Marker({
        position: position,
        label: new_id.toString(),
        map: map,
    });
    const poste = {id: new_id, lat: parseFloat(click_marker.getPosition().lat()), lng: parseFloat(click_marker.getPosition().lng())}
    postes.push(poste)

    new google.maps.Polyline({
        path: [position, new google.maps.LatLng(last_poste['lat'],last_poste['lng'])],
        strokeColor: '#0000ff',
        strokeOpacity: 1.0,
        strokeWeight: 3,
        map: map
    });
    await post_edge({node1: last_poste, node2: poste})
}


async function post_edge(edge){
    const url = 'http://localhost:1337/add-edge';
    const data = await request_builder(url, "POST", edge)
    console.log(data);
}


export { handle_click_create }
