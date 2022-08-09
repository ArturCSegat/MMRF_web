async function branch(plaq){

    const url = 'http://localhost:5000/all-paths-limited/' + plaq;

    const response = await fetch(url)
    const data = await response.json()

    for(let i = 0; i<data.length;i++){

        for(let j = 0; j<data[i][0].length;j++){
            console.log(data[i][0][j])
        }

        console.log("______________")
    }
}   

let map;

async function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: new google.maps.LatLng(0, 0),
    zoom: 3,
  });

  all_paths_limited = await branch("1");

 

   /*  const line = new google.maps.Polyline({
        path: new google.maps.LatLng(all_paths_limited[i][0]),
        strokeColor: "#FF0000",
        strokeOpacity: 1.0,
        strokeWeight: 3,
    }) */
  }




window.initMap = initMap;