let xmlHttp = new XMLHttpRequest();
xmlHttp.onreadystatechange = function () 
{
	if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
	{
		document.getElementById('result').textContent = xmlHttp.responseText;
	}
	if (xmlHttp.status == 404)
	{
		console.log('Error!');
	}
}
// CarPark Available Lots
// xmlHttp.open("GET", 'https://www.ura.gov.sg/uraDataService/invokeUraDS?service=Car_Park_Availability', true); 

// CarPark Prices
xmlHttp.open("GET", 'https://cors-anywhere.herokuapp.com/https://www.ura.gov.sg/uraDataService/invokeUraDS?service=Car_Park_Details', true); 

xmlHttp.setRequestHeader('AccessKey', '8b274253-49d1-42e5-84a9-0e7691de84c6');
xmlHttp.setRequestHeader('Token', 'eYJ72--K-ss7+-1M4spAjUDnAa6eNsuX1s474wHtS9v18B0q4645mKe-988edc8e52RDh3uVe6sSWXh-8TpB7Z95ZK7d9PeZDbdz');
xmlHttp.send();

/* Geolocate function */
/* Set up the initial map center and zoom level */
let map = L.map('map', {
	center: [1.40, 100], // EDIT latitude, longitude to re-center map
	zoom: 12,  // Zoom level goesfrom 1 to 18 -- decrease to zoom out, increase to zoom in
	scrollWheelZoom: true,
	tap: false
});

function onAccuratePositionError (event) {
	addStatus(event.message, 'error');
}

function onAccuratePositionProgress (event) {
	let message = `Progressing … (Accuracy: ${event.accuracy})`;
	//addStatus(message, 'progressing');
	console.log(message);
}

function onAccuratePositionFound (event) {
	let message = `Most accurate position found (Accuracy: ${event.accuracy})`;
	//addStatus(message, 'done');
	map.setView(event.latlng, 12);
	L.marker(event.latlng).addTo(map)
	.bindPopup("Some pointers can be added here"); // EDIT pop-up text message;
	console.log(message);
}
/*
function addStatus (message, className) {
	var ul = document.getElementById('status'),
		li = document.createElement('li');
	li.appendChild(document.createTextNode(message));
	ul.className = className;
	ul.appendChild(li);
} */

map.on('accuratepositionprogress', onAccuratePositionProgress);
map.on('accuratepositionfound', onAccuratePositionFound);
map.on('accuratepositionerror', onAccuratePositionError);

map.findAccuratePosition({
	maxWait: 10000,
	desiredAccuracy: 20
});




/* display basemap tiles -- see others at https://leaflet-extras.github.io/leaflet-providers/preview/ */
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>'
}).addTo(map);

/* Display a point marker with pop-up text */
//L.marker([1.43, 103.83]).addTo(map) // EDIT latitude, longitude to re-position marker


