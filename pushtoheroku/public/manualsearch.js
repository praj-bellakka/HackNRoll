function searchAddressByName() {
    var name = document.getElementById("search").value;
    document.getElementById("startlocation").innerHTML = name;

    if (name) {
        document.getElementById("manualsearchresults").innerHTML = "";

        $.ajax({
            url: 'https://developers.onemap.sg/commonapi/search?searchVal=' + name + '&returnGeom=Y&getAddrDetails=Y&pageNum=1',
            success: function (result) {
                //Set result to a variable for writing
                console.log(result);

                var resultsarr = result.results;
                for(i = 0; i <resultsarr.length; i += 1) {
                    if(resultsarr[i].SEARCHVAL == name.toUpperCase()) {
                        document.getElementById("manualsearchresults").innerHTML = resultsarr[i].SEARCHVAL + " X: " + resultsarr[i].X + " Y: " + resultsarr[i].Y + "<br>";
                        break;
                    }else {
                        document.getElementById("manualsearchresults").innerHTML += resultsarr[i].SEARCHVAL + " X: " + resultsarr[i].X + " Y: " + resultsarr[i].Y + "<br>";
                    }
                }
            }
        });
    }
}

