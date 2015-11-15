alert("moi");

// pikkuruutulista = tiles
// isoruutulista = squares

var tiles = [];

// pikkuruutujen skaala d, isot D, pitää olla 10^a
var d = 1000;
var D = 100;

// kynnysetäisyys
var THRESHOLD = 100;

// oma sijainti
var testgps = {"coords":{"latitude":60.18539,"longitude":24.82695}};

function checkTiles(gps) {
  var posx = gps.coords.longitude;
  var posy = gps.coords.latitude;
  var x = Math.floor(posx*d);
  var y = Math.floor(posy*d);
  var t = "SUOJATIEDATAA:<br>";
  for (j = y-1; j < y+1; j++) {
    for (i = x-1; i < x+1; i++) {
      if (!(tiles[j])) {
        // ladataan isosta ruudusta dataa
        if (!loadSquares(i/d,j/d)) {
          alert("EI PYSTYTTY LATAAMAAN TIETOA");
          return -1;
        }
      }
      else if (!(tiles[j][i])) {
      	if (!loadSquares(i/d,j/d)) {
          alert("EI PYSTYTTY LATAAMAAN TIETOA");
          return -1;
        }
      }
      // pikkuruudun data on alustettu
      // apumuuttuja tekstille
      
      // testataan vielä, onko tyhjä vai onko lista
      for (k = 0; k < tiles[j][i].length; k++) {
      	alert("paljonko suojateitä ruudussa?   "+tiles[j][i].length);
        if (calcDistance(posx,posy,tiles[j][i][k].x,tiles[j][i][k].y) < THRESHOLD) {
          alert("OLET SUOJATIELLÄ");
        }
        t = t+"Suojatie etäisyydellä:"+Math.sqrt(calcDistance(posx,posy,tiles[j][i][k].x,tiles[j][i][k].y)).toFixed(3)+"<br>";
      }
      $("#sandbox").text(t)
    }
  }
}

function loadSquares(x,y) {
  // initialize all tiles, some might be left uninitialized
  x = Math.floor(x*D);
  y = Math.floor(y*D);
  xd = x*10;
  yd = y*10;
  alert("Aloitetaan tiles alustus alkuindeksit: y:"+yd+" x:"+xd);
  for (jj=yd; jj<yd+10; jj++) {
  	for (ii=xd; ii<xd+10; ii++) {
  		if (!(tiles[jj])) {
  			tiles[jj] = [];
  		}
  		if (!(tiles[jj][ii])) {
  			tiles[jj][ii] = [];
  		}
  	}
  }
  alert("Alustus päättynyt, indeksit: y"+jj+" x:"+ii);
  x = x/D;
  y = y/D;
  var x2 = x+0.01;
  var y2 = y+0.01;
  
  $.ajax({
			     url:"http://overpass-api.de/api/interpreter?data=[out:json];node%20[%22highway%22=%22crossing%22]("+y+","+x+","+y2+","+x2+");%20out%3B",
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
	for (iii = 0; iii<json.length-1; iii++) {
		x = Math.floor(json[iii].lon*d);
		y = Math.floor(json[iii].lat*d);
		tiles[y][x].push({"x":json[iii].lon,"y":json[iii].lat});	
	}
	
	
  
}

function calcDistance(posx,posy,x,y) {
	var R = 6371000;
	return ((posx-x).toRadians()*R)^2+((posy-y).toRadians()*R)^2;
}

checkTiles(testgps);
