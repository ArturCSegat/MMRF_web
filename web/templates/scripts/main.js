async function sayHello(){
    const url = 'http://localhost:5000/hello'; // the URL to send the HTTP request to
    const response = await fetch(url)
    const data = await response.text(); // or response.json() if your server returns JSON
    console.log(data);
    
}


async function postPoste(){

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