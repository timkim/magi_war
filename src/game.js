window.onload = function() {
	Crafty.init(50,200,200);
	Crafty.canvas();
	
	Crafty.sprite(20, "assets/terrain.png",{
		dirt0: [0,0],
		dirt1: [1,0],
		grass0: [0,1],
		lava0: [0,2],
		lava1: [1,2],
		stone0: [0,3],
		stone1: [1,3],
		water0: [0,4],
	});
	
	Crafty.sprite(18, "assets/red_army.png",{
		redWarrior:[0,0],
		redMage:[0,1]
	});
	
	Crafty.sprite(18, "assets/blue_army.png",{
		blueWarrior:[0,0],
		blueMage:[0,1]
	});
	var boards = [];
	
	Crafty.scene("game", function(){
		
		//generate board
		for(var i = 0; i < 10; i++){
			for(var j = 0; j < 10; j++){
				Crafty.e('2D, canvas, redWarrior').attr({x: i * 20, y: j * 20, z: 3});
				Crafty.e('2D, canvas,'+createRandomTerrain()).attr({x: i * 20, y: j * 20, z: 2});
			}
		}

	});
	function createRandomTerrain(){
		var num = Math.floor(Math.random()*8);
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
		}
		return theTile;
	}
	Crafty.scene("game");//start the game
};