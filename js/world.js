var BootScene = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: 
    function BootScene(){
        Phaser.Scene.call(this, {key: 'BootScene'});
    },

    preload: function(){
        this.load.image('tiles', 'assets/map/Mapset.png');
        
        this.load.tilemapTiledJSON('testground', 'assets/map/testground.json');

    },

    create: function(){
        this.cameras.main.setBackgroundColor('rgba(250, 218, 94, 1)');
        this.graphics = this.add.graphics();
        this.graphics.lineStyle(1, 0xffffff);
        this.graphics.fillStyle(0x031f4c, 1);       

        this.graphics.strokeRect(90, 600, 300, 50);
        this.graphics.fillRect(90, 600, 300, 50);

        this.graphics.strokeRect(90, 700, 300, 50);
        this.graphics.fillRect(90, 700, 300, 50);

        this.graphics.strokeRect(90, 800, 300, 50);
        this.graphics.fillRect(90, 800, 300, 50);
        
        this.graphics.strokeRect(90, 900, 300, 50);
        this.graphics.fillRect(90, 900, 300, 50);

        var text = this.add.text(1280/2 - 200,
			200, "World Calling: Three Realms", {
				color: "#000000",
				align: "center",
				fontWeight: 'bold',
				font: '60px Arial',
				wordWrap: {
					width: 800,
					useAdvancedWrap: true
				}
        }).setInteractive();
        
        var text1 = this.add.text(185,
			610, "    START    ", {
				color: "#ffffff",
				align: "center",
				fontWeight: 'bold',
				font: '32px Arial',
				wordWrap: {
					width: 800,
					useAdvancedWrap: true
				}
        }).setInteractive();

        text1.on('pointerdown', ()=>{
            this.scene.start('WorldScene');
        });

        var text2 = this.add.text(185,
			710, "LOAD", {
				color: "#ffffff",
				align: "center",
				fontWeight: 'bold',
				font: '32px Arial',
				wordWrap: {
					width: 800,
					useAdvancedWrap: true
				}
        }).setInteractive();

        var text3 = this.add.text(185,
			810, "ABOUT", {
				color: "#ffffff",
				align: "center",
				fontWeight: 'bold',
				font: '32px Arial',
				wordWrap: {
					width: 800,
					useAdvancedWrap: true
				}
        }).setInteractive();

        var text4 = this.add.text(185,
			910, "HELP", {
				color: "#ffffff",
				align: "center",
				fontWeight: 'bold',
				font: '32px Arial',
				wordWrap: {
					width: 800,
					useAdvancedWrap: true
				}
        }).setInteractive();
    }

});

var WorldScene = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize:
    function WorldScene(){
        Phaser.Scene.call(this, { key: 'WorldScene'});
    },

    preload: function(){

    },

    create: function(){
        var testground = this.make.tilemap({ key: 'testground'});
        var tiles = testground.addTilesetImage('Mapset','tiles');
        var traverseLayer = testground.createLayer('traverseLayer', tiles, 0, 0);
        var blockedLayer = testground.createLayer('blockedLayer', tiles, 0, 0);
        blockedLayer.setCollisionByExclusion([-1]);
    },

    update: function (){

    },
});