/* Geolocate function */
/* Set up the initial map center and zoom level */
let map = L.map('map', {
	center: [1.427, 103.834], // EDIT latitude, longitude to re-center map
	zoom: 12,  // Zoom level goesfrom 1 to 18 -- decrease to zoom out, increase to zoom in
	scrollWheelZoom: true,
	tap: false
});

function onAccuratePositionError (event) {
	//addStatus(event.message, 'error');]
	console.log(event);
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

map.on('accuratepositionprogress', onAccuratePositionProgress);
map.on('accuratepositionfound', onAccuratePositionFound);
map.on('accuratepositionerror', onAccuratePositionError);

map.findAccuratePosition({
	maxWait: 10000,
	desiredAccuracy: 20
});

/* Set up Map functions */

let xmlHttp = new XMLHttpRequest();
xmlHttp.onreadystatechange = function () 
{
	let uraData;
	if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
	{
		//document.getElementById('result').textContent = xmlHttp.responseText;
		uraData = JSON.parse(xmlHttp.responseText);
		parseData(uraData.Result);
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

//determines how strict the filter is in SVY terms
let filterStrength = 10000;

/* parseData receives the object of parking data from the AJAX request */
function parseData(obj) {
	obj.sort((a, b) => {
		//convert the cost per hour in dollars to a flat string using regex operations
		if (a.weekdayRate.replace(/(^\$|,)/g,'') === b.weekdayRate.replace(/(^\$|,)/g,'')) {
			//If two elements have same weekday costs, then the parking lot with more lots will win
			return b.parkCapacity - a.parkCapacity;
		} else {
			//If two elements have different rates, then the cheaper lot will win
			return a.weekdayRate.replace(/(^\$|,)/g,'') - b.weekdayRate.replace(/(^\$|,)/g,'');
		}
	})
	//Get the current coordinates in SVY format
	let cv = new SVY21();
	//console.log(map);
	let lat = map._lastCenter.lat;
	let lng = map._lastCenter.lng;
	//console.log(lat, lng)
	let nSVYcoord = cv.computeSVY21(lat, lng).N;
	let eSVYcoord = cv.computeSVY21(lat, lng).E;
	console.log(nSVYcoord, eSVYcoord);
	//console.log(obj[0].geometries[0].coordinates.split(',')[0]);

	//clean the parking lot data to ensure no null entries
	let cleanedDataset = obj.filter(event => !!event);
	//remove index 1310 as the dataset is blank
	let deletedIdx = cleanedDataset.splice(1310, 1);
	//filter the parking lots to the ones nearby
	let filteredParkingLots = cleanedDataset.filter((e) => {
		
		let coordinateObj;
		if(e !== null) {
		  coordinateObj = e.geometries[0].coordinates.split(',');
		}
		
		//console.log(coordinateObj[1], e, idx);
		return ((coordinateObj[0] <= nSVYcoord + filterStrength &&
		coordinateObj[0] >= nSVYcoord - filterStrength) && (coordinateObj[1] <= eSVYcoord + filterStrength &&
		coordinateObj[1] >= eSVYcoord - filterStrength));
	}).forEach((card, idx) => {
		console.log(card, idx);
		createCard(card, idx);
	})
	console.log(filteredParkingLots);
	//filterNearestCarParks(nSVYcoord, eSVYcoord, obj);
}

/* This function determines the current day 
The function returns the following based on the current day
0 - Sunday .... 6 - Saturday 		
*/
function generateDayofWeek() {
	let date = new Date();
	let dayOfWeek = date.getDay();
	return dayOfWeek;
	//console.log(dayOfWeek);
}
generateDayofWeek();
/* This function takes in the latitude and longtitude of the current location, and filters 
	howMany nearst carparks using the URA filter*/

function updateGUI (nSVYcoord, eSVYcoord, obj) {
	
}	

let resultCard = document.getElementById('result');

function createCard(data, index) {
	const card = document.createElement('div');
	card.classList.add('card');
	let parkingRate;
	let dayOfWeek = generateDayofWeek();
	console.log(index, data)
	if (dayOfWeek > 0 && dayOfWeek < 6) parkingRate = data.weekdayRate;
		else if (dayOfWeek == 0) parkingRate = data.satdayRate;
		else parkingRate = data.sunPHRate;
	card.innerHTML = `
	  <div class="card">
	  	<h2>Location: ${data.ppName}   Carpark ID: ${data.ppCode}</h2>
		<h3>Parking Capacity: ${data.parkCapacity}</h3>
		  <p>Parking Rate: ${parkingRate} per ${dayOfWeek > 0 && dayOfWeek < 6 ? 
			data.weekdayMin : data.dayOfWeek == 0 
			? data.satdayMin : data.sunPHMin} - The rate is given as: ${data.remarks}</p>
		</div>
	  </div>
	`;
  
	//cardsEl.push(card);
	resultCard.appendChild(card);
	//updateCurrentText();
   }

/* display basemap tiles -- see others at https://leaflet-extras.github.io/leaflet-providers/preview/ */
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>'
}).addTo(map);

/* Display a point marker with pop-up text */
//L.marker([1.43, 103.83]).addTo(map) // EDIT latitude, longitude to re-position marker




