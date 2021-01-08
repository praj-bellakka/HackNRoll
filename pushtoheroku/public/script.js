document.getElementById("search").addEventListener("keyup", searchAddressByName);
document.getElementById("vehCat").addEventListener("change", sortVehCat)

var storefiltered = [];

/* Geolocate function */
/* Set up the initial map center and zoom level */
let map = L.map('map', {
	center: [1.427, 103.834], // EDIT latitude, longitude to re-center map
	zoom: 12,  // Zoom level goesfrom 1 to 18 -- decrease to zoom out, increase to zoom in
	scrollWheelZoom: true,
	tap: false
});

function onAccuratePositionError(event) {
	//addStatus(event.message, 'error');]
	console.log(event);
}

function onAccuratePositionProgress(event) {
	let message = `Progressing … (Accuracy: ${event.accuracy})`;
	//addStatus(message, 'progressing');
	console.log(message);
}

function onAccuratePositionFound(event) {
	let message = `Most accurate position found (Accuracy: ${event.accuracy})`;
	//addStatus(message, 'done');
	map.setView(event.latlng, 12);
	console.log(event.latlng);
	L.marker(event.latlng).addTo(map)
		.bindPopup("Some pointers can be added here"); // EDIT pop-up text message;
	console.log(message);

	// Initialization

	// $.ajax({
	// 	url: 'https://developers.onemap.sg/commonapi/convert/4326to3414?latitude=' + event.latlng.lat + '&longitude=' + event.latlng.lng,
	// 	success: function (result) {
	// 		//Set result to a variable for writing
	// 		console.log(result);
	// 	}
	// });

	var cv = new SVY21();

	// Computing SVY21 from Lat/Lon
	var result = cv.computeSVY21(event.latlng.lat, event.latlng.lng); //svy21

	let xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function () {
		let uraData;
		if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
			uraData = JSON.parse(xmlHttp.responseText);
			console.log(result);
			parseData(uraData.Result, result.E, result.N);
		}
		if (xmlHttp.status == 404) {
			console.log('Error!');
		}
	}
	// CarPark Available Lots
	// xmlHttp.open("GET", 'https://www.ura.gov.sg/uraDataService/invokeUraDS?service=Car_Park_Availability', true); 

	// CarPark Prices
	xmlHttp.open("GET", 'https://proxyhnr.herokuapp.com/https://www.ura.gov.sg/uraDataService/invokeUraDS?service=Car_Park_Details', true);

	xmlHttp.setRequestHeader('AccessKey', 'df63daf5-906c-4fd2-b008-77d84f3416f5');
	xmlHttp.setRequestHeader('Token', '48xDCsNXGzhAj7e-640KUgh7dP4t0V04B6tu6x73Fe-ZdMd98fM6n0f99fse4ccVtwB02p45vj524D2f8xdDBdr2p8cF8wf0H378');
	xmlHttp.send();
}

function manualSearch() {
	var e = this.getAttribute("e");
	var n = this.getAttribute("n");

	let xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function () {
		let uraData;
		if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
			uraData = JSON.parse(xmlHttp.responseText);
			console.log(result);
			parseData(uraData.Result, e, n);
		}
		if (xmlHttp.status == 404) {
			console.log('Error!');
		}
	}
	// CarPark Available Lots
	// xmlHttp.open("GET", 'https://www.ura.gov.sg/uraDataService/invokeUraDS?service=Car_Park_Availability', true); 

	// CarPark Prices
	xmlHttp.open("GET", 'https://proxyhnr.herokuapp.com/https://www.ura.gov.sg/uraDataService/invokeUraDS?service=Car_Park_Details', true);

	xmlHttp.setRequestHeader('AccessKey', 'df63daf5-906c-4fd2-b008-77d84f3416f5');
	xmlHttp.setRequestHeader('Token', '48xDCsNXGzhAj7e-640KUgh7dP4t0V04B6tu6x73Fe-ZdMd98fM6n0f99fse4ccVtwB02p45vj524D2f8xdDBdr2p8cF8wf0H378');
	xmlHttp.send();
}

function geolocater() {
	document.getElementById("startlocation").innerHTML = "Your Location";
	map.on('accuratepositionprogress', onAccuratePositionProgress);
	map.on('accuratepositionfound', onAccuratePositionFound);
	map.on('accuratepositionerror', onAccuratePositionError);

	map.findAccuratePosition({
		maxWait: 10000,
		desiredAccuracy: 20
	});

}

function searchAddressByName() {
	var name = document.getElementById("search").value;

	if (name) {
		document.getElementById("manualsearchresults").innerHTML = "";

		$.ajax({
			url: 'https://developers.onemap.sg/commonapi/search?searchVal=' + name + '&returnGeom=Y&getAddrDetails=Y&pageNum=1',
			success: function (result) {
				console.log(result);
				var resultsarr = result.results;
				var manualsearchresults = document.getElementById("manualsearchresults");

				for (i = 0; i < resultsarr.length; i += 1) {
					var btn = document.createElement("button");
					btn.innerHTML = resultsarr[i].SEARCHVAL;
					btn.setAttribute("n", resultsarr[i].Y);
					btn.setAttribute("e", resultsarr[i].X);
					btn.addEventListener("click", manualSearch);
					manualsearchresults.appendChild(btn);
				}
			}
		});
	}
}

function sortVehCat() {
	var selectedCat = document.getElementById("vehCat").value;

	if (selectedCat == "All") {
		document.getElementById("result").innerHTML = "";
		storefiltered.forEach((card, idx) => {
			console.log(card, idx);
			createCard(card, idx);
		});
	} else {
		var newCards = storefiltered.filter(lot => lot.vehCat == selectedCat);
		document.getElementById("result").innerHTML = "";
		newCards.forEach((card, idx) => {
			console.log(card, idx);
			createCard(card, idx);
		});
	}
}

/* Set up Map functions */

//determines how strict the filter is in SVY terms
let filterStrength = 2000;

/* parseData receives the object of parking data from the AJAX request */
function parseData(obj, N, E) {

	let nSVYcoord = N;
	let eSVYcoord = E;

	document.getElementById("vehCat").selectedIndex = 0;
	document.getElementById("result").innerHTML = "";

	var CurrCoordinates =

		obj.sort((a, b) => {
			//convert the cost per hour in dollars to a flat string using regex operations
			if (a.weekdayRate.replace(/(^\$|,)/g, '') === b.weekdayRate.replace(/(^\$|,)/g, '')) {
				//If two elements have same weekday costs, then the parking lot with more lots will win
				return b.parkCapacity - a.parkCapacity;
			} else {
				//If two elements have different rates, then the cheaper lot will win
				return a.weekdayRate.replace(/(^\$|,)/g, '') - b.weekdayRate.replace(/(^\$|,)/g, '');
			}
		})
	//Get the current coordinates in SVY format
	// let cv = new SVY21();
	// //console.log(map);
	// let lat = map._lastCenter.lat;
	// let lng = map._lastCenter.lng;
	// //console.log(lat, lng)
	// let nSVYcoord = cv.computeSVY21(lat, lng).N;
	// let eSVYcoord = cv.computeSVY21(lat, lng).E;
	// console.log(nSVYcoord, eSVYcoord);
	//console.log(obj[0].geometries[0].coordinates.split(',')[0]);

	//clean the parking lot data to ensure no null entries
	let cleanedDataset = obj.filter(event => !!event);
	//remove index 1310 as the dataset is blank
	let deletedIdx = cleanedDataset.splice(1310, 1);
	//filter the parking lots to the ones nearby
	let filteredParkingLots = cleanedDataset.filter((e) => {
		console.log("filtering...");

		let coordinateObj;
		if (e !== null) {
			coordinateObj = e.geometries[0].coordinates.split(',');
		}

		//console.log(coordinateObj[1], e, idx);
		return ((coordinateObj[0] <= nSVYcoord + filterStrength &&
			coordinateObj[0] >= nSVYcoord - filterStrength) && (coordinateObj[1] <= eSVYcoord + filterStrength &&
				coordinateObj[1] >= eSVYcoord - filterStrength));
	});

	filteredParkingLots.forEach((card, idx) => {
		console.log(card, idx);
		createCard(card, idx);
	});

	storefiltered = [];

	filteredParkingLots.forEach(lot => {
		storefiltered.push(lot);
	})
	//console.log(storefiltered);
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


function updateGUI(data, func = null) {
	/* Various filters are implemented here! */
	/*Filter by vehicle category TODO */

	data.forEach((card, index) => {
		console.log(card, index);
		createCard(card, index);
	})

}

let resultCard = document.getElementById('result');

function createCard(data, index) {

	/* TODO: Fix marker placement -broken due to inaccurate coordinate conversion
	//add markers to the map
	//find the lat and long
	var cv = new SVY21();
	let coord = cv.computeLatLon(data.geometries[0].coordinates[0], data.geometries[0].coordinates[1]);
	console.log(coord);
	L.marker({lat: coord.lat, lng: coord.lon}).addTo(map).bindPopup(`lat: ${coord.lat}, lng: ${coord.lon}`)
	*/
	const card = document.createElement('div');
	card.classList.add('card');
	let parkingRate;
	let dayOfWeek = generateDayofWeek();
	//console.log(index, data)
	if (dayOfWeek > 0 && dayOfWeek < 6) parkingRate = data.weekdayRate;
	else if (dayOfWeek == 0) parkingRate = data.satdayRate;
	else parkingRate = data.sunPHRate;
	card.innerHTML = `
	  <div class="card">
	  	<h2>Location: ${data.ppName.toLowerCase()}   Carpark ID: ${data.ppCode}</h2>
		<h3>Parking Capacity: ${data.parkCapacity}</h3>
		</br>
		<p>Parking Rate: ${parkingRate} per ${dayOfWeek > 0 && dayOfWeek < 6 ?
			data.weekdayMin : data.dayOfWeek == 0
				? data.satdayMin : data.sunPHMin}
			</br>
			The rate is given as: ${data.remarks}</p>
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