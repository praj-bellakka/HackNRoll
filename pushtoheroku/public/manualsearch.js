function searchAddressByName() {
    var name = document.getElementById("search").value;

    if (name) {
        document.getElementById("manualsearchresults").innerHTML = "";

        $.ajax({
            url: 'https://developers.onemap.sg/commonapi/search?searchVal=' + name + '&returnGeom=Y&getAddrDetails=Y&pageNum=1',
            success: function (result) {
                var resultsarr = result.results;
                var manualsearchresults = document.getElementById("manualsearchresults");

                for(i = 0; i <resultsarr.length; i += 1) {
                    if(resultsarr[i].SEARCHVAL == name.toUpperCase()) {
                        //run filter and show results
                        break;
                    }else {
                    }
                }
            }
        });
    }
}

