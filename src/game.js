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
		blue_overlay: [0,0]
	});
	
	Crafty.sprite(40,"assets/red_overlay.png",{
		red_overlay: [0,0]
	});
	
	Crafty.sprite(54, "assets/red_army.png",{
		redWarrior:[0,0],
		redMage:[0,1]
	});
	
	Crafty.sprite(54, "assets/blue_army.png",{
		blueWarrior:[0,0],
		blueMage:[0,1]
	});
	
	Crafty.sprite(10, "assets/blue_endturn.png",{
		blue_endTurn:[0,0, 10, 3]
	});
	
	Crafty.sprite(10, "assets/red_endturn.png",{
		red_endTurn:[0,0, 10, 3]
	});
    
    Crafty.sprite(100, "assets/sidebar.png",{
        sideBar:[0,0,2,4]
    });
	unitBoard = [[]],
	terrainBoard = [[]],
	gameBoardWidth = 400,
	gameBoardHeight = 400,
	gameBoardTileWidth = 10,
	gameBoardTileHeight = 10,
	turn = 0,
	NORTH = 0,
	EAST = 1,
	SOUTH = 2,
	WEST = 3,
	currentPiece = null,
	moveMask = []
	attackMask = [],
	consoleCount= 0,
	button = [],
	moveRange = null,
	attackRange = null
    sideBar = null,test = null;
	
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
			movePoints: null,
			
			init: function(){
				if(!this.has("2D")) this.addComponent("2D");
			},
			
			placeUnit: function(theYTile, theXTile, theFace){
				if(unitBoard[theYTile][theXTile]==null)
				{
					this.movePoints -= this.getDistanceToTile(theXTile, theYTile);
					unitBoard[this.yTile][this.xTile] = null;
					unitBoard[theYTile][theXTile]=this;
					this.xTile = theXTile;
					this.yTile = theYTile;
					this.face = theFace;
					this.render();
				}
			},
            attack: function(){
                this.movePoints = 0;
            },
            
			hurt: function(damage){
                this.hp -= damage;
                this.render();
            },
			render: function(){
                if(this.hp>0){
                    x$('#console').top(consoleCount++ + ' Rendering unit at x tile: ' + this.xTile + ' and y tile: ' + this.yTile);
                    this.attr({x: (this.xTile * 40)+4, y: (this.yTile * 40)-16, z: 7});
                    this.attr({x: (this.xTile * 40)+4, y: (this.yTile * 40)-16, z: 7});
                }else{
                    unitBoard[this.yTile][this.xTile] = null;
                    this.destroy();
                    x$('#console').top(consoleCount++ + ' Dead unit at x tile: ' + this.xTile + ' and y tile: ' + this.yTile);
                }
			},		
			
			setColour: function(){
				if(this.has("red")){
					this.colour = 'red';
				}else{ 
					this.colour = 'blue';
				}			
			},
			
			findMoveRange: function(){
				var theMoveRange = [];
				var theMinMoveRange = Math.min(this.range, this.movePoints);
				// find distances orthogonal to position
				if(this.yTile - theMinMoveRange >= 0){
					// gotta check for units and walkable terrain
					if(unitBoard[this.yTile - theMinMoveRange][this.xTile]== null && terrainBoard[this.yTile - theMinMoveRange][this.xTile].indexOf('lava')<0){
						theMoveRange.push([this.yTile - theMinMoveRange, this.xTile]);
					}
				}
				
				if(this.yTile + theMinMoveRange <= gameBoardTileHeight){
					if(unitBoard[this.yTile + theMinMoveRange][this.xTile]== null && terrainBoard[this.yTile + theMinMoveRange][this.xTile].indexOf('lava')<0){
						theMoveRange.push([this.yTile + theMinMoveRange, this.xTile]);
					}					
				}
				
				if(this.xTile - theMinMoveRange >= 0){
					// gotta check for units and walkable terrain
					if(unitBoard[this.yTile][this.xTile-theMinMoveRange]== null && terrainBoard[this.yTile][this.xTile - theMinMoveRange].indexOf('lava')<0){
						theMoveRange.push([this.yTile, this.xTile-theMinMoveRange]);
					}
				}
				
				if(this.xTile + theMinMoveRange <= gameBoardTileWidth){
					if(unitBoard[this.yTile][this.xTile+theMinMoveRange]== null && terrainBoard[this.yTile][this.xTile + theMinMoveRange].indexOf('lava')<0){
						theMoveRange.push([this.yTile, this.xTile+theMinMoveRange]);
					}					
				}
				
				return theMoveRange;
			},
            
            findAttackRange: function(){
                var theAttackRange = [];
  				// find distances orthogonal to position
				if(this.yTile - 1 >= 0){
					// gotta check for units and walkable terrain
					if(unitBoard[this.yTile - 1][this.xTile]!= null){
                        if(unitBoard[this.yTile - 1][this.xTile].colour != this.colour){
                            theAttackRange.push([this.yTile - 1, this.xTile]);
                        }
					}
				}
				
				if(this.yTile + 1 <= gameBoardTileHeight){
					if(unitBoard[this.yTile + 1][this.xTile]!= null){
                        if(unitBoard[this.yTile + 1][this.xTile].colour != this.colour){
                            theAttackRange.push([this.yTile + 1, this.xTile]);
                        }
					}					
				}
				
				if(this.xTile - 1 >= 0){
					// gotta check for units and walkable terrain
					if(unitBoard[this.yTile][this.xTile-1]!= null){
                        if(unitBoard[this.yTile][this.xTile-1].colour != this.colour){
                            theAttackRange.push([this.yTile, this.xTile-1]);
                        }
					}
				}
				
				if(this.xTile + 1 <= gameBoardTileWidth){
					if(unitBoard[this.yTile][this.xTile+1]!= null){
                        if(unitBoard[this.yTile][this.xTile+1].colour != this.colour){
                            theAttackRange.push([this.yTile, this.xTile+1]);
                        }
					}					
				}
				
				return theAttackRange;              
            },
			
			getDistanceToTile:function(theTileRow, theTileColumn){
				var move = 0;
				move += Math.abs(this.xTile - theTileRow);
				move += Math.abs(this.yTile - theTileColumn);
				return move;
			},
			
			resetMovePoints:function()
			{
				this.movePoints = this.range;
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
				this.movePoints = 1;
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
				this.movePoints = 1;
				this.xTile = 0;
				this.yTile = 0;
				this.placeUnit(0,0, NORTH);
			},
		});
		// ***************** ENTITY DEFINITIONS ENDS ***************** 
		
		
		x$('#console').top("Starting new game");
		//generate board
		// TODO Make width and height into constants for tile size
		unitBoard = initBoardValues(10,10);
		terrainBoard = initBoardValues(10,10);
		for(var i = 0; i < 10; i++){
			for(var j = 0; j < 10; j++){
				if(i==0 || i==9 || j ==0 || j==9){
					terrainBoard[i][j] = 'lava0';
					Crafty.e('2D, canvas,lava0').attr({x: i * 40, y: j * 40, z: 2});
				}else{
					var theTile = createWalkableTerrain();
					terrainBoard[i][j] = theTile;
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
				
		resetAllUnitsMovePoints();
		
		button[0] = Crafty.e('canvas, 2D, red_endTurn, mouse').attr({x: 450, y: 370, z: 10});
		button[0].bind('click',function(){
			x$('#console').top(consoleCount++ + ' End turn');
			changeTurn();
		});
		
        sideBar = Crafty.e('canvas,2D, sideBar').attr({x:400, y:0,z:0});
        test = Crafty.e("2D, DOM, text").attr({x: 220, y: 200}).text("hello").font("30pt Arial");
		Crafty.addEvent(this, Crafty.stage.elem, "mousedown", function(e){
			x$('#console').top(consoleCount++ + ' Fired mouse down');
			var column = Math.floor((e.clientX - Crafty.stage.x) / 40);
			var row = Math.floor((e.clientY - Crafty.stage.y) / 40);
			
			
			if(currentPiece){
				// unselect unit
				if(unitBoard[row][column]==currentPiece){
					destroyMoveOverlay();
					currentPiece = null;
				}
				
				if(checkMovement(row, column, moveRange)){
				// move selected unit 
					currentPiece.placeUnit(row,column);
					destroyMoveOverlay();
					currentPiece = null;
				}
                
                if(checkAttack(row,column, attackRange)){
 				// attack selected unit 
                    currentPiece.attack();
					unitBoard[row][column].hurt(10);
					destroyMoveOverlay();
					currentPiece = null;               
                }
			}else{
				// focus on selected unit
				if(unitBoard[row][column]!=null){
					if(turn == 0 && unitBoard[row][column].colour=='red'){
						currentPiece = unitBoard[row][column];
						moveRange = currentPiece.findMoveRange();
						(moveRange.length>0)?showMoveable(moveRange):currentPiece = null;
                        if(currentPiece){
                            attackRange = currentPiece.findAttackRange();
                            if(attackRange.length>0)showAttackable(attackRange);
                        }
						
					}else if(turn == 1 && unitBoard[row][column].colour=='blue'){
						currentPiece = unitBoard[row][column];
						moveRange = currentPiece.findMoveRange();
						(moveRange.length>0)?showMoveable(moveRange):currentPiece = null;
                        if(currentPiece){
                            attackRange = currentPiece.findAttackRange();
                            if(attackRange.length>0)showAttackable(attackRange);
                        }
					}
				}
			}
		});
	});
	function resetAllUnitsMovePoints(){
		// gonna need a unit array to just go through instead of double looping
		for(var i=0;i<unitBoard.length;i++){
			for(var j=0;j<unitBoard[i].length;j++){
				if(unitBoard[i][j]!=null){
					unitBoard[i][j].resetMovePoints();
				}
			}
		}
	}
	
	function destroyMoveOverlay(){
		for(var i=0;i<moveMask.length;i++){
			moveMask[i].destroy();
		}	
	}
	
	function checkMovement(rowClicked,columnClicked, movementArray){
		var flag = false;
		for(var i=0;i<movementArray.length;i++){
			if(movementArray[i][0] == rowClicked && movementArray[i][1] == columnClicked){
				flag = true;
				break;
			}
		}
		return flag;
	}
    
    function checkAttack(rowClicked, columnClicked, attackArray){
 		var flag = false;
		for(var i=0;i<attackArray.length;i++){
			if(attackArray[i][0] == rowClicked && attackArray[i][1] == columnClicked){
				flag = true;
				break;
			}
		}
		return flag;   
    }
	
	function changeTurn(){
		if(turn){
			button[0].removeComponent('blue_endTurn');
			button[0].addComponent('red_endTurn');
		}else{
			button[0].removeComponent('red_endTurn');
			button[0].addComponent('blue_endTurn');
		}
		turn = !turn;
		destroyMoveOverlay();
		currentPiece = null;
		resetAllUnitsMovePoints();
	}
	
	function initBoardValues(xTiles,yTiles){
		var outerArray = [];
		for(var i=0;i<xTiles;i++){
			var innerArray = [];
			for(var j=0;j<yTiles;j++){
				innerArray[j] = null;
			}
			outerArray[i] = innerArray;
		}
		return outerArray;
	}
	
	function showMoveable(movementArray){
		if(currentPiece){
			for(var i=0;i<movementArray.length;i++){
				moveMask.push(Crafty.e('2D, canvas, blue_overlay').attr({x: (movementArray[i][1])*40, y: (movementArray[i][0])*40, z: 4}));
			}
		}
	}
    
    function showAttackable(attackArray){
 		if(currentPiece){
			for(var i=0;i<attackArray.length;i++){
				moveMask.push(Crafty.e('2D, canvas, red_overlay').attr({x: (attackArray[i][1])*40, y: (attackArray[i][0])*40, z: 4}));
			}
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