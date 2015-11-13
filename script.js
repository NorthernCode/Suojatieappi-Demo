alert("moi");

// pikkuruutulista = tiles
// isoruutulista = squares

var tiles[][] = [];
var squares[][] = [];

// pikkuruutujen skaala d, isot D, pitää olla 10^a
var d = 1000;
var D = 100;

// kynnysetäisyys
var THRESHOLD = 100;

// oma sijainti
var posx = oma x!;
var posy = oma y!;

function checkTiles(posx,posy) {
  var x = Math.floor(posx*d);
  var y = Math.floor(posy*d);
  for (i = x-1; i < x+1; i++) { 
    for (j = y-1; i < y+1, j++) {
      if !tiles[j][i] {
        // ladataan isosta ruudusta dataa
        if !loadSquares(i/(D),j/(D)) {
          alert("EI PYSTYTTY LATAAMAAN TIETOA");
          break;
        }
      }
      // pikkuruudun data on alustettu
      for (k = 0; k < tiles[j][i].length; k++) {
        if (calcDistance(posx,posy,tiles[j][i][k].x,tiles[j][i][k].y) < THRESHOLD) {
          alert("OLET SUOJATIELLÄ");
        }
      }  
    }
  }
}

function loadSquares(x,y) {
  
  $.ajax({
			     url:"http://overpass-api.de/api/interpreter?data=[out:json];node%20[%22highway%22=%22crossing%22]("+x+","+y+","+x+0.1+","+y+0.1+");%20out%3B",
			     dataType: 'json',
			     success:function(json){
			         	sortTiles(json.elements);
			        },
			     error:function(){
			         alert("Error");
			         return 0;
			     }      
			});
  return 1;
}

function sortTiles(json) {
	// iterate over json objects
	// convert crosswalk coordinates to indexes
	var x;
	var y;
	for (i = 0; i<json.length; i++) {
		x = Math.floor(json[i].lon/d);
		y = Math.floor(json[i].lat/d);
		if !tiles[x][y] {
			tiles[x][y] = {};
		}
		tiles[x][y].push({"x":json[i].lon,"y":json[i].lat});	
	}
	
  
}

function calcDistance(posx,posy,x,y) {
	var R = 6371000;
	return ((posx-x).toRadians()*R)^2+((posy-y).toRadians()*R)^2;
}
