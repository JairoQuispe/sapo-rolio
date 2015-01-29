var Game = new Phaser.Game(800,600, Phaser.AUTO, 'game-container');

Game.state.add('game', GameState);
Game.state.start('game');