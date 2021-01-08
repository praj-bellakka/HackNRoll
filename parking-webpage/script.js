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
xmlHttp.setRequestHeader('Token', '8291uZPU7nQ2vR6j74-g22F-h2R8y88eeVt-eG62eJE08dMu65cG-jpKbRHz4jTNj87medFeTa691t4444d-2-4dhx-72A8r7e');
xmlHttp.send();

 /* Set up the initial map center and zoom level */
 var map = L.map('map', {
    center: [1.43, 103.83], // EDIT latitude, longitude to re-center map
    zoom: 12,  // Zoom level goesfrom 1 to 18 -- decrease to zoom out, increase to zoom in
    scrollWheelZoom: false,
    tap: false
  });

  /* display basemap tiles -- see others at https://leaflet-extras.github.io/leaflet-providers/preview/ */
  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>'
  }).addTo(map);

  /* Display a point marker with pop-up text */
  L.marker([1.43, 103.83]).addTo(map) // EDIT latitude, longitude to re-position marker
  .bindPopup("Insert pop-up text here"); // EDIT pop-up text message
