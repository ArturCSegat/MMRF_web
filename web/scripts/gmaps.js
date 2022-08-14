async function branch(plaq){

  const url = 'http://localhost:5000/all-paths-limited/' + plaq;

  const response = await fetch(url)
  const data = await response.json()

  return data;
}   

async function postEdge(){

  const fp = document.getElementById('fPlaq');
  const fplaq = parseInt(fp.value);

  const fc = document.getElementById('fcoord');

  const fco = fc.value.split(" ");

  const fcoord = {x: parseFloat(fco[0]), y: parseFloat(fco[1])};

  const np = document.getElementById('nPlaq');
  const nplaq = parseInt(np.value);

  const nc = document.getElementById('ncoord');

  const nco = nc.value.split(" ");

  const ncoord = {x: parseFloat(nco[0]), y: parseFloat(nco[1])};

  const distance = document.getElementById('distance').value;

  const body = JSON.stringify({fplaq: fplaq, fcoord: fcoord, nplaq: nplaq, ncoord: ncoord, distance:distance});


  const url = 'http://localhost:5000/add-edge';

  const method = "POST";

  const headers = {'Content-Type': 'application/json'};
  
  const request = await fetch(url, {method:method, body:body, headers:headers})

  const data = await request.json();

  console.log(data);

}

async function postPoste(lat, lng){

  let plaq = Math.floor(Math.random() * 500);

  let coord = {x:parseFloat(lat), y:parseFloat(lng)}

  
  const body = JSON.stringify({fplaq: plaq, fcoord: coord});


  const url = 'http://localhost:5000/add-vertex';

  const method = "POST";

  const headers = {'Content-Type': 'application/json'};
  
  const request = await fetch(url, {method:method, body:body, headers:headers})

  const data = await request.json();

  console.log(data)




}

function addMarker(location, map) {
  // Add the marker at the clicked location, and add the next-available label
  // from the array of alphabetical characters.

  console.log(location.lat)

  let marker = new google.maps.Marker({
    position: location,
    map: map,
  });

  let lat = marker.getPosition().lat();
  let lng = marker.getPosition().lng();   

  postPoste(lat, lng);

}

async function initMap() {


  let map = new google.maps.Map(document.getElementById("map"), {
    center: new google.maps.LatLng(0, 0),
    zoom: 3,
  });

  google.maps.event.addListener(map, "click", (event) => {
    addMarker(event.latLng, map);
  });

  
/*   let all_paths_limited = await branch("139120");
  
  for(let i = 0; i<all_paths_limited.length;i++){

      let path = [];

      for(let j = 0; j<all_paths_limited[i][0].length;j++){
          let cord  = new google.maps.LatLng(all_paths_limited[i][0][j][0], all_paths_limited[i][0][j][1]);
          path.push(cord)
      }
      
        const line = new google.maps.Polyline({
        path: path,
        strokeColor: "#FF0000",
        strokeOpacity: 1.0,
        strokeWeight: 3,
        map, map
        }) 

        console.log(path)
      
  } */
}




window.initMap = initMap;