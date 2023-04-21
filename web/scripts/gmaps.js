async function branch(plaq, square_cord){

  console.log(square_cord);

  const body = JSON.stringify({plaq:plaq, lat1: square_cord[0].lat, lng1: square_cord[0].lng, lat2: square_cord[1].lat, lng2: square_cord[1].lng});



  const url = 'http://localhost:5000/all-paths-limited/';

  const method = "POST";

  const headers = {'Content-Type': 'application/json'};

  const request = await fetch(url, {method:method, body:body, headers:headers})
  
  console.log("request = ", body)

  const data = await request.json();

  return data;

}

async function postEdge(){

  const fp = document.getElementById('fPlaq');
  const fplaq = parseInt(fp.value);

  const np = document.getElementById('nPlaq');
  const nplaq = parseInt(np.value);


  const distance = document.getElementById('distance').value;

  const body = JSON.stringify({fplaq: fplaq, nplaq: nplaq, distance:distance});


  const url = 'http://localhost:5000/add-edge';

  const method = "POST";

  const headers = {'Content-Type': 'application/json'};

  const request = await fetch(url, {method:method, body:body, headers:headers})

  const data = await request.json();

  console.log(data);

}

async function postPoste(location, map){

  let plaq = Math.floor(Math.random() * 500);

  let marker = new google.maps.Marker({

    position: location,
    label: plaq.toString(),
    map: map,
  });

  let lat = marker.getPosition().lat();
  let lng = marker.getPosition().lng();


  let coord = {x:parseFloat(lat), y:parseFloat(lng)}


  const body = JSON.stringify({fplaq: plaq, fcoord: coord});


  const url = 'http://localhost:5000/add-vertex';

  const method = "POST";

  const headers = {'Content-Type': 'application/json'};

  const request = await fetch(url, {method:method, body:body, headers:headers})

  const data = await request.json();

  console.log(data)




}

async function handleClick(location, square_cord, map) {


    console.log("hc ran");


  let marker = new google.maps.Marker({

    position: location,
    map: map,
  });

  let lat = marker.getPosition().lat();
  let lng = marker.getPosition().lng();

  const body = JSON.stringify({lat: lat, lng: lng});

  const url = 'http://localhost:5000/closest-poste/';

  const method = "POST";

  const headers = {'Content-Type': 'application/json'};

  const request = await fetch(url, {method:method, body:body, headers:headers})

  const data = await request.json();

  let cord = new google.maps.LatLng(data[1][0], data[1][1]);

  let marker_poste = new google.maps.Marker({

    position: cord,
    label: data[0].toString(),
    map: map,
  });

  let c = new google.maps.Polyline({
    path: [location, cord],
    strokeColor: '#008000',
    strokeOpacity: 1.0,
    strokeWeight: 3,
    map, map
  })

  draw_line(data[0],square_cord, map)
}

async function draw_line(start, square_cord, map){

  let all_paths_limited = await branch(start.toString(), square_cord);



  for(let i = 0; i<all_paths_limited.length;i++){

      let path = [];

      for(let j = 0; j<all_paths_limited[i][0].length;j++){
          let cord  = new google.maps.LatLng(all_paths_limited[i][0][j][0], all_paths_limited[i][0][j][1]);
          path.push(cord)
      }


        const line = new google.maps.Polyline({
        path: path,
        strokeColor: '#0000ff',
        strokeOpacity: 1.0,
        strokeWeight: 3,
        map, map
        })

        console.log(path)
  }

}

function draw_square(square_cord, map){

  let a = square_cord[0];
  let b = square_cord[1];
  let inv_a = {lat: a.lat, lng: b.lng};
  let inv_b = {lat: b.lat, lng: a.lng};

  let path = [a, inv_a, b, inv_b, a];

  const line = new google.maps.Polyline({
    path: path,
    strokeColor: '#0000ff',
    strokeOpacity: 1.0,
    strokeWeight: 3,
    map, map
  });


}

async function dissectData(square_cord){




}

function cut(){initMap("cut", []);}
function draw(){initMap("draw");}
function see(){initMap("see");}

async function initMap(mode=null, square_cord=null) { // square_cord is an arra that stores the cordinates for a diagonal of the cut square_cord


  let map = new google.maps.Map(document.getElementById("map"), {
    center: new google.maps.LatLng(0, 0),
    zoom: 3,
  });



  google.maps.event.addListener(map, "click", (event) => {
    if(mode === "see"){

      handleClick(event.latLng, square_cord, map);
    }
    if(mode === "draw"){
      postPoste(event.latLng, map);
    }
    if(mode === "cut"){
      let marker = new google.maps.Marker({

        position: event.latLng,
        map: map,
      });

      let lat = marker.getPosition().lat();
      let lng = marker.getPosition().lng();

      let cord = {lat:lat, lng:lng}

      square_cord.push(cord);

      if (square_cord.length >= 2){
        draw_square(square_cord, map);
        mode = "see"
      }
    }

  });

}




window.initMap = initMap;
