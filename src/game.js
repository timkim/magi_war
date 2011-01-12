window.onload = function() {
	Crafty.init(50,400,400);
	Crafty.canvas();
	
	Crafty.sprite(40, "assets/terrain.png",{
		dirt0: [0,0],
		dirt1: [1,0],
		grass0: [0,1],
		lava0: [0,2],
		lava1: [1,2],
		stone0: [0,3],
		stone1: [1,3],
		water0: [0,4],
		water1: [1,4]
	});
	
	Crafty.sprite(54, "assets/red_army.png",{
		redWarrior:[0,0],
		redMage:[0,1]
	});
	
	Crafty.sprite(36, "assets/blue_army.png",{
		blueWarrior:[0,0],
		blueMage:[0,1]
	});
	
	var boards = [],
	turn = 0,
	NORTH = 0,
	EAST = 1,
	SOUTH = 2,
	WEST = 3;
	
	var redPlayer = Crafty.e();
	var bluePlayer = Crafty.e();
	
	Crafty.scene("game", function(){
		x$('#console').top("Starting new game");
		//generate board
		// TODO Make width and height into constants for tile size
		for(var i = 0; i < 10; i++){
			for(var j = 0; j < 10; j++){
				if(i==0 || i==9 || j ==0 || j==9){
					Crafty.e('2D, canvas,lava0').attr({x: i * 40, y: j * 40, z: 2});
				}else{
					var theTile = createWalkableTerrain();
					Crafty.e('2D, canvas,'+theTile).attr({x: i * 40, y: j * 40, z: 2});
					
					if(theTile == 'dirt0'){
						Crafty.e('canvas, warrior').placeUnit(i,j);
					}
				}

			}
		}

	});
	
	Crafty.c("player", {
		pieces: null,
		currentPiece: null,
		
		init: function(){
			this.pieces = [];
			this.currentPiece = 0;
		}
		
	});
	
	Crafty.c("warrior",{
		hp: null,
		face: null,
		range: null,
		xTile: null,
		yTile: null,
		id: null,
		
		init: function(){
			if(!this.has("2D")) this.addComponent("2D");
			if(!this.has("redWarrior")) this.addComponent("redWarrior");
			this.hp = 10;
			this.range = 1;
			this.placeUnit(0,0, NORTH);
		},
		
		placeUnit: function(theXTile, theYTile, theFace){
			this.xTile = theXTile;
			this.yTile = theYTile;
			this.face = theFace;
			this.updateUnit();
		},
		
		updateUnit: function(){
			x$('#console').top('Updating unit at x tile: ' + this.xTile + ' and y tile: ' + this.yTile);
			this.attr({x: (this.xTile * 40)+4, y: (this.yTile * 40)-16, z: 3});
			this.attr({x: (this.xTile * 40)+4, y: (this.yTile * 40)-16, z: 3});
		},
	});
	
	function createRandomTerrain(){
		var num = Math.floor(Math.random()*9);
		var theTile = '';
		switch(num){
			case 0: theTile = 'dirt0';
			break;
			
			case 1: theTile = 'dirt1';
			break;
			
			case 2: theTile = 'grass0';
			break;
			
			case 3: theTile = 'lava0';
			break;
			
			case 4: theTile = 'lava1';
			break;
			
			case 5: theTile = 'stone0';
			break;
			
			case 6: theTile = 'stone1';
			break;
			
			case 7: theTile = 'water0';
			break;
			
			case 8: theTile = 'water1';
			break;
		}
		return theTile;
	}
	
	function createImpassableTerrain(){
		var num = Math.floor(Math.random()*4);
		var theTile = '';
		switch(num){		
			case 0: theTile = 'lava0';
			break;
			
			case 1: theTile = 'lava1';
			break;
			
			case 2: theTile = 'water0';
			break;
			
			case 3: theTile = 'water1';
			break;		
		}
		return theTile;	
	}
	
	function createWalkableTerrain(){
		var num = Math.floor(Math.random()*5);
		var theTile = '';
		switch(num){		
			case 0: theTile = 'dirt0';
			break;
			
			case 1: theTile = 'dirt1';
			break;
			
			case 2: theTile = 'grass0';
			break;
			
			case 3: theTile = 'stone0';
			break;
			
			case 4: theTile = 'stone1';
			break;	
		}
		return theTile;		
	}
	Crafty.scene("game");//start the game
};