async function branch(plaq){

    const url = 'http://localhost:5000/all-paths-limited/' + plaq;

    const response = await fetch(url)
    const data = await response.json()



    return data;
}



const randomColor = () => {
   let color = '#';
   for (let i = 0; i < 6; i++){
      const random = Math.random();
      const bit = (random * 16) | 0;
      color += (bit).toString(16);
   };

   return color;
 };



let map;



async function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: new google.maps.LatLng(0, 0),
    zoom: 3,
  });



  all_paths_limited = await branch("1");

  for(let i = 0; i<all_paths_limited.length;i++){

      let path = [];

      for(let j = 0; j<all_paths_limited[i][0].length;j++){
          let cord  = new google.maps.LatLng(all_paths_limited[i][0][j][0], all_paths_limited[i][0][j][1]);
          path.push(cord)
      }

      let color = randomColor();

        const line = new google.maps.Polyline({
        path: path,
        strokeColor: color,
        strokeOpacity: 1.0,
        strokeWeight: 3,
        map, map
        })

        console.log(path)

  }
}




window.initMap = initMap;
