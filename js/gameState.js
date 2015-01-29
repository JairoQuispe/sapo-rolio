
var GameState = { preload : preload, create : create, update : update};

function preload(){
		
	Game.load.image('fondo', 'img/bg2.png');
	Game.load.image('laser', 'img/laser.png'); // 33x12
	Game.load.spritesheet('rolio','img/sapazo.png',66,81);
	Game.load.image('zombie', 'img/zombie-2.png');
	//390,81
	Game.load.image('carrito', 'img/carrito2.png');
	//Game.load.audio('viento', 'img/sounds/viento.mp3');
}
var sonidoViento;
var rolio;
var facing = 'right';
var bulletTime = 0;
var lasers;
var cantidadLasers = 5;
var firingTimer = 0;
function create(){

	Game.physics.startSystem(Phaser.Physics.ARCADE);
	
	//sonidoViento = Game.add.audio('viento');
	//sonidoViento.onDecoded.add(start, this);
	//AGREGANDO EL FONDO
	Game.add.image(0,0,'fondo');

	// AGREGANDO LASER A ROLIO EL SAPITO MALO
	lasers = Game.add.group();
	lasers.enableBody = true;
	lasers.physicsBodyType = Phaser.Physics.ARCADE;
	lasers.createMultiple(1, 'laser');
	lasers.setAll('anchor.x',0.5);
	lasers.setAll('anchor.y', 1);
	lasers.setAll('outofBoundsKill', true);
	lasers.setAll('checkWorldBounds', true);


	rolio = Game.add.sprite(100, Game.world.height -50, 'rolio');
	rolio.anchor.setTo(0.5, 0.5);
	Game.physics.enable(rolio, Phaser.Physics.ARCADE);


	zombies = Game.add.group();
	zombies.enableBody = true;
	zombies.physicsBodyType = Phaser.Physics.ARCADE;
	zombie = zombies.create(250,Game.world.height -100,'zombie');
	zombie = zombies.create(550,Game.world.height -100,'zombie');
	//AGREGANDO ROLIO AL JUEGO
	//me.rolio = me.game.add.sprite(100, me.game.world.height -150, 'rolio');
	//me.rolio.animations.add('derecha', [0,4,3,2,5,1], 10, true);
	//me.rolio.animations.play('derecha');

	//me.rolio.animations.add('derecha', [1,2,3,4,5,6], 8.9, true);
	rolio.animations.add('derecha', [8,9,10,11,12], 8.9, true);
	rolio.animations.add('izquierda', [6,5,4,3,2,1], 8.9, true);
	//Game.add.image(560, Game.world.height -150,'zombie');
	//AGREGANDO GRAVEDAD
	
	//Game.physics.arcade.enable(me.rolio);
	rolio.body.collideWorldBounds = true;
	//EVENTO DEL TECLADO
	//var rolioDerecha = me.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
	//rolioDerecha.onDown.add(me.derecha, me);
	//var spaceKey = me.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
       //spaceKey.onDown.add(me.jump, me);
       	
        /*var text = "Juega con el rolio Rolio";
        /var style = {
        	font: '42px Arial',
        	fill: '#45FFBF',
        	align: 'center'
        }
        var t = Game.add.text(Game.world.centerX, Game.world.centerY, text, style);

        t.anchor.setTo(0.5, 0.5);*/
    //this.game.camera.follow(this.rolio);   
    fireButton = Game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR); 

}
	/*derecha: function(){
		this.rolio.animations.play('derecha');
		this.rolio.body.velocity.x = 50;

	},
	jump: function() {
        this.rolio.body.velocity.y = -110;
    },*/

function update(){

	//console.log("actualizando");
	rolio.body.velocity.x = 0;
   	rolio.body.velocity.y = 0;
   	rolio.body.angularVelocity = 0;
    if (Game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
	    {
	    	rolio.animations.play('izquierda');
	        rolio.body.velocity.x = -80;
	        if (fireButton.isDown){ dispararLaserIzquierda() }
	        if (facing != 'left') {
	        	//this.rolio.animations.play('izquierda');
	        	facing = 'left';
	        }
	        console.log(facing);
	    }
	else if (Game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
	    {
	        rolio.body.velocity.x = 80;
	        if (fireButton.isDown){ dispararLaserDerecha() }
	        if (facing != 'right') {
	        	rolio.animations.play('derecha');
	        	facing = 'right';
	        	console.log(facing);
	        }
	        
		}

	else{
		
		if (facing != 'idle')
	       {
		       	console.log("está en " + facing);
	            rolio.animations.stop();
	            if (facing == 'left')
	            {
	                rolio.frame = 6;
	            }
	            else if (facing == 'right')
	            {
	                rolio.frame = 7;
	            }
	            facing = 'idle';
	        }

	}

	if (rolio.frame == 7 && fireButton.isDown) {
		dispararLaserDerecha ();
	}
	if (rolio.frame == 6 && fireButton.isDown) {
		dispararLaserIzquierda ()
	}
	Game.physics.arcade.overlap(lasers, zombies, zombiesHit, null, this);

}

function zombiesHit (laser, zombie){

	resetearLaser (laser);
	zombie.kill();
	var fondo = document.getElementById('wrapper');
	fondo.style.background = 'yellow';
	Game.add.text(100, Game.world.centerY -50, 'GANASTE! \n UN CARRITO SANGUCHERO', {
        	font: '38px Arial',
        	fill: '#45FFBF',
        	align: 'center'
        });
	Game.add.sprite(250, Game.world.height -270 , 'carrito');
	lasers.createMultiple(cantidadLasers,'laser');
	console.log('GANASTE 5 BALAS COÑO DE TU MADRE');
}

function start(){
	//sonidoViento.fadeIn(4000);
}

function dispararLaserIzquierda () {

    //  To avoid them being allowed to fire too fast we set a time limit
    if (Game.time.now > bulletTime) {
        //  Grab the first bullet we can from the pool
        laser = lasers.getFirstExists(false);
        if (laser)
        {
            //  And fire it
            laser.reset(rolio.x - 21, rolio.y - 12);
            laser.body.velocity.x = -500;
            bulletTime = Game.time.now + 220;

        }
        
    }

}
function dispararLaserDerecha () {

    //  To avoid them being allowed to fire too fast we set a time limit
    if (Game.time.now > bulletTime) {
        //  Grab the first bullet we can from the pool
        laser = lasers.getFirstExists(false);
        if (laser)
        {
            //  And fire it
            laser.reset(rolio.x + 22, rolio.y - 12);
            laser.body.velocity.x = 500;
            bulletTime = Game.time.now + 200;
        }

    }
}
function resetearLaser (laser) {
	console.log("se gano un laser ");
    laser.kill();
}