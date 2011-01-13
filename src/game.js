window.onload = function() {
	Crafty.init(50,600,400);
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
	
	Crafty.sprite(40,"assets/overlay.png",{
		moveable: [0,0]
	});
	Crafty.sprite(54, "assets/red_army.png",{
		redWarrior:[0,0],
		redMage:[0,1]
	});
	
	Crafty.sprite(54, "assets/blue_army.png",{
		blueWarrior:[0,0],
		blueMage:[0,1]
	});
		
	boards = [[]],
	gameBoardWidth = 400,
	gameBoardHeight = 400,
	turn = 0,
	NORTH = 0,
	EAST = 1,
	SOUTH = 2,
	WEST = 3,
	currentPiece = null,
	moveMask = [],
	consoleCount= 0,
	selected = false;
	
	var redPlayer = Crafty.e();
	var bluePlayer = Crafty.e();
	
	Crafty.scene("game", function(){
	
		// ***************** ENTITY DEFINITIONS START ***************** 
		Crafty.c("player", {
			pieces: null,
			currentPiece: null,
			init: function(){
				this.pieces = [];
			}
		});	
		
		Crafty.c("unit",{
			hp: null,
			maxHp:null,
			face: null,
			range: null,
			xTile: null,
			yTile: null,
			id: null,
			colour: null,
			type: null,
			
			init: function(){
				if(!this.has("2D")) this.addComponent("2D");
			},
			
			placeUnit: function(theYTile, theXTile, theFace){
				if(boards[theYTile][theXTile]==null)
				{
					boards[this.yTile][this.xTile] = null;
					boards[theYTile][theXTile]=this;
					this.xTile = theXTile;
					this.yTile = theYTile;
					this.face = theFace;
					this.render();
				}
			},
			
			render: function(){
				x$('#console').top(consoleCount++ + ' Rendering unit at x tile: ' + this.xTile + ' and y tile: ' + this.yTile);
				this.attr({x: (this.xTile * 40)+4, y: (this.yTile * 40)-16, z: 7});
				this.attr({x: (this.xTile * 40)+4, y: (this.yTile * 40)-16, z: 7});
			},		
			
			setColour: function(){
				if(this.has("red")){
					this.colour = 'red';
				}else{ 
					this.colour = 'blue';
				}			
			},
		});
		
		Crafty.c("warrior",{
			init: function(){
				if(!this.has("unit")) this.addComponent("unit");
				this.setColour();
				this.type = 'Warrior';
				this.addComponent(this.colour + this.type);
				this.hp = 10;
				this.range = 1;
				this.xTile = 0;
				this.yTile = 0;
				this.placeUnit(0,0, NORTH);
			},
		});
		
		Crafty.c("mage",{
			init: function(){
				if(!this.has("unit")) this.addComponent("unit");
				this.setColour();
				this.type = 'Mage';
				this.addComponent(this.colour + this.type);
				this.hp = 10;
				this.range = 1;
				this.xTile = 0;
				this.yTile = 0;
				this.placeUnit(0,0, NORTH);
			},
		});
		// ***************** ENTITY DEFINITIONS ENDS ***************** 
		
		
		x$('#console').top("Starting new game");
		//generate board
		// TODO Make width and height into constants for tile size
		createBoard(10,10);
		for(var i = 0; i < 10; i++){
			for(var j = 0; j < 10; j++){
				if(i==0 || i==9 || j ==0 || j==9){
					Crafty.e('2D, canvas,lava0').attr({x: i * 40, y: j * 40, z: 2});
				}else{
					var theTile = createWalkableTerrain();
					Crafty.e('2D, canvas,'+theTile).attr({x: i * 40, y: j * 40, z: 2});
				}

			}
		}
		var testUnit = Crafty.e('canvas, warrior, red, mouse');
		testUnit.placeUnit(1,1,NORTH);
		
		var testUnit2 = Crafty.e('canvas, mage, red, mouse');
		testUnit2.placeUnit(1,2,NORTH);
		
		var testUnit3 = Crafty.e('canvas, mage, blue, mouse');
		testUnit3.placeUnit(1,3,NORTH);

		var testUnit4 = Crafty.e('canvas, warrior, blue, mouse');
		testUnit4.placeUnit(1,4,NORTH);
				
		Crafty.addEvent(this, Crafty.stage.elem, "mousedown", function(e){
			x$('#console').top(consoleCount++ + ' Fired mouse down');
			var column = Math.floor((e.clientX - Crafty.stage.x) / 40);
			var row = Math.floor((e.clientY - Crafty.stage.y) / 40);
			
			if(currentPiece){
				// move selected unit 
				currentPiece.placeUnit(row,column);
				currentPiece = null;
			}else{
				// focus on selected unit
				if(boards[row][column]!=null){
					if(turn == 0 && boards[row][column].colour=='red'){
						currentPiece = boards[row][column];
					}else if(turn == 1 && boards[row][column].colour=='blue'){
						currentPiece = boards[row][column];
					}
				}
			}
		});
	});
	
	function createBoard(xTiles,yTiles){
		var outerArray = [];
		for(var i=0;i<xTiles;i++){
			var innerArray = [];
			for(var j=0;j<yTiles;j++){
				innerArray[j] = null;
			}
			outerArray[i] = innerArray;
		}
		boards = outerArray;
	}
	
	function showMoveable(){
		if(currentPiece){
			moveMask[0] = Crafty.e('2D, canvas, moveable').attr({x: (currentPiece.xTile-1)*40, y: (currentPiece.yTile-1)*40, z: 4});
			moveMask[1] = Crafty.e('2D, canvas, moveable').attr({x: (currentPiece.xTile)*40, y: (currentPiece.yTile-1)*40, z: 4});
			moveMask[2] = Crafty.e('2D, canvas, moveable').attr({x: (currentPiece.xTile+1)*40, y: (currentPiece.yTile-1)*40, z: 4});
			
			moveMask[3] = Crafty.e('2D, canvas, moveable').attr({x: (currentPiece.xTile-1)*40, y: (currentPiece.yTile)*40, z: 4});
			moveMask[4] = Crafty.e('2D, canvas, moveable').attr({x: (currentPiece.xTile+1)*40, y: (currentPiece.yTile)*40, z: 4});
			
			moveMask[5] = Crafty.e('2D, canvas, moveable').attr({x: (currentPiece.xTile-1)*40, y: (currentPiece.yTile+1)*40, z: 4});
			moveMask[6] = Crafty.e('2D, canvas, moveable').attr({x: (currentPiece.xTile)*40, y: (currentPiece.yTile+1)*40, z: 4});
			moveMask[7] = Crafty.e('2D, canvas, moveable').attr({x: (currentPiece.xTile+1)*40, y: (currentPiece.yTile+1)*40, z: 4});			
		}
	}
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