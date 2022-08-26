async function branch(plaq){

  const url = 'http://localhost:5000/all-paths-limited/' + plaq;

  const response = await fetch(url)
  const data = await response.json()

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

async function handleClick(location, map) {


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

  draw_line(data[0], map)
}

async function draw_line(start, map){

  let all_paths_limited = await branch(start.toString());


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

async function initMap(start=null) {


  let map = new google.maps.Map(document.getElementById("map"), {
    center: new google.maps.LatLng(0, 0),
    zoom: 3,
  });

  google.maps.event.addListener(map, "click", (event) => {
    handleClick(event.latLng, map);
  });

}




window.initMap = initMap;
