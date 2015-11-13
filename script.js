alert("moi");

// pikkuruutulista = tiles
// isoruutulista = squares

var tiles[][] = [];
var squares[][] = [];
tiles[5][5] = [];
tiles[5][5].push([62.123,23.123]);
alert(tiles[5][5]);

// pikkuruutujen skaala d, isot D, pitää olla 10^a
var d = 1000;
var D = 100;

// kynnysetäisyys
var THRESHOLD = 10;

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
			         	sortTiles(json);
			        },
			     error:function(){
			         alert("Error");
			     }      
			});
  return 1;
}

function sortTiles(json) {
  
}

function calcDistance(posx,posy,x,y) {
  
}
