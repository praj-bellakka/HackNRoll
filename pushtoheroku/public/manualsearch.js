function searchAddressByName() {
    var name = document.getElementById("search").value;

    if (name) {
        document.getElementById("manualsearchresults").innerHTML = "";

        $.ajax({
            url: 'https://developers.onemap.sg/commonapi/search?searchVal=' + name + '&returnGeom=Y&getAddrDetails=Y&pageNum=1',
            success: function (result) {
                //Set result to a variable for writing
                console.log(result);

                var resultsarr = result.results;

                resultsarr.forEach(location => {
                    document.getElementById("manualsearchresults").innerHTML += location.SEARCHVAL + " X: " + location.X + " Y: " + location.Y + "<br>";
                })
            }
        });
    }
}

