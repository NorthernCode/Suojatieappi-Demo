alert("moi");

// pikkuruutulista = tiles
// isoruutulista = squares

var tiles = {};

// pikkuruutujen skaala d, isot D, pitää olla 10^a
var d = 1000;
var D = 100;

// kynnysetäisyys
var THRESHOLD = 100;

// oma sijainti
var mikkeligps = {"coords":{"latitude":61.68879,"longitude":27.27311}};

function checkTiles(gps) {
  var posx = gps.coords.longitude;
  var posy = gps.coords.latitude;
  var x = Math.floor(posx*d);
  var y = Math.floor(posy*d);
  for (i = x-1; i < x+1; i++) { 
    for (j = y-1; i < y+1; j++) {
    	alert("checktiles loop: x: "+i+"  y:"+j);
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
      var t;
      // testataan vielä, onko tyhjä vai onko lista
      alert("listan tila:"+tiles[j])
      for (k = 0; k < tiles[j][i].length; k++) {
        if (calcDistance(posx,posy,tiles[j][i][k].x,tiles[j][i][k].y) < THRESHOLD) {
          alert("OLET SUOJATIELLÄ");
        }
        t = t+"Suojatie etäisyydellä:"+Math.sqrt(calcDistance(posx,posy,tiles[j][i][k].x,tiles[j][i][k].y)).toFixed(3)+"<br>";
      }
      $("#sandbox").text("t")
    }
  }
}

function loadSquares(x,y) {
  // initialize all tiles, some might be left uninitialized
  x = Math.floor(x*D);
  y = Math.floor(y*D);
  alert("x:"+x+"    y:"+y);
  xd = x*10;
  yd = y*10;
  for (j=yd; j<yd+10; j++) {
  	for (i=xd; i<xd+10; i++) {
  		if (!(tiles[j])) {
  			tiles[j] = {};
  		}
  		if (!(tiles[j][i])) {
  			tiles[j][i] = {};
  		}
  	}
  }
  alert("example test at indexs j="+j"+: "+tiles[j]+"   another at index j="j+4"+: "+tiles[j+4]);
  x = x/D;
  y = y/D;
  var x2 = x+0.1;
  var y2 = y+0.1;
  
  $.ajax({
			     url:"http://overpass-api.de/api/interpreter?data=[out:json];node%20[%22highway%22=%22crossing%22]("+x+","+y+","+x2+","+y2+");%20out%3B",
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
		tiles[y][x].push({"x":json[i].lon,"y":json[i].lat});	
	}
	
	
  
}

function calcDistance(posx,posy,x,y) {
	var R = 6371000;
	return ((posx-x).toRadians()*R)^2+((posy-y).toRadians()*R)^2;
}

checkTiles(mikkeligps);
