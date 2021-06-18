var BootScene = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function BootScene() {
        Phaser.Scene.call(this, {
            key: 'BootScene'
        });

    },

    init: function(data){
        console.log(data)
        if (jQuery.isEmptyObject(data)){
            this.catParty = new catParty();
        }
        else{
            this.catParty = data.catParty;
        }
        console.log(this.catParty);
    },

    preload: function () {
        this.load.image('tiles', 'assets/map/Mapset.png');
        this.load.image('chefCat', 'assets/cats/chefCat.png');
        this.load.image('chefCatCircle', 'assets/cats/chefCatCircle.png');
        this.load.image('knightCat', 'assets/cats/knightCatCircle.png');
        this.load.image('knightCatCircle', 'assets/cats/knightCatCircle.png');
        this.load.image('mechaCat', 'assets/cats/mechaCat.png');
        this.load.image('mechaCatCircle', 'assets/cats/mechaCatCircle.png');
    },

    create: function () {
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

        var text = this.add.text(1280 / 2 - 200,
            200, "Neko Land Saga", {
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

        text1.on('pointerdown', () => {
            this.scene.start('WorldScene', {
                "catParty" : this.catParty,
                "level" : 0
            });
        });

        var text2 = this.add.text(145,
            710, "CAT GACHA", {
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
    initialize: function WorldScene(data) {
        Phaser.Scene.call(this, {
            key: 'WorldScene'
        });
    },

    init: function(data){
        if (data != null && data.level === 0){
            this.currentLevel = 0;
        }
        else{
            this.currentLevel = data.level
        }
        console.log(data);
        this.catParty = data.catParty;
        this.allUnits = []; //the all units array stores the enemy and the cats
    },

    preload: function () {
        //load based on the level
        if (this.currentLevel === 0){
            this.load.tilemapTiledJSON('testground', 'assets/map/testground.json');
            var chefCat = new Cat("Chef Cat", "The best chef in town, makes the best cat food!",4, [], 49, 32, 26, 5, "chefCat", "chefCatCircle");
            this.catParty.obtainNewCat(chefCat); 
            this.catParty.swapCat(0, 0);

            var knightCat = new Cat('Knight Cat', "This cat somehow found some knight armor and a sword, then believed that it is a knight...", 4, [], 30, 50, 50,  8, "knightCat", "knightCatCircle");
            this.catParty.obtainNewCat(knightCat);
            this.catParty.swapCat(1, 1);
        }
        
    },

    create: function () {
        if (this.currentLevel === 0){
            var testground = this.make.tilemap({
                key: 'testground'
            });
            var tiles = testground.addTilesetImage('Mapset', 'tiles');
            var traverseLayer = testground.createLayer('traverseLayer', tiles, 0, 0);
            var blockedLayer = testground.createLayer('blockedLayer', tiles, 0, 0);
            blockedLayer.setCollisionByExclusion([-1]);
            this.cameras.main.roundPixels = true;
            
            for (var i = 0; i < this.catParty.currentTeam.length; i++){
                if (i === 0){
                    var tempCat0 = this.physics.add.image(750 + i*200, 800, this.catParty.currentTeam[i].photoCircle);
                    tempCat0.setCircle(64);
                    tempCat0.setCollideWorldBounds(true);
                    tempCat0.setBounce(1);
                    tempCat0.setInteractive();
                    tempCat0.unitInformation = this.catParty.currentTeam[i];
                    this.physics.add.collider(tempCat0, blockedLayer);
                    tempCat0.on('pointerover', () => {
                        console.log(tempCat0.unitInformation);
                    })
                    this.allUnits.push(tempCat0);
                }
                if (i === 1){
                    var tempCat1 = this.physics.add.image(750 + i*200, 800, this.catParty.currentTeam[i].photoCircle);
                    tempCat1.setCircle(64);
                    tempCat1.setCollideWorldBounds(true);
                    tempCat1.setBounce(1);
                    tempCat1.setInteractive();
                    tempCat1.unitInformation = this.catParty.currentTeam[i];
                    this.physics.add.collider(tempCat1, blockedLayer);
                    tempCat1.on('pointerover', () => {
                        console.log(tempCat1.unitInformation);
                    })
                    this.allUnits.push(tempCat1);
                }
                if (i === 2){
                    var tempCat2 = this.physics.add.image(750 + i*200, 800, this.catParty.currentTeam[i].photoCircle);
                    tempCat2.setCircle(64);
                    tempCat2.setCollideWorldBounds(true);
                    tempCat2.setBounce(1);
                    tempCat2.setInteractive();
                    tempCat2.unitInformation = this.catParty.currentTeam[i];
                    this.physics.add.collider(tempCat2, blockedLayer);
                    tempCat2.on('pointerover', () => {
                        console.log(tempCat2.unitInformation);
                    })
                    this.allUnits.push(tempCat2);
                }
                if (i === 3){
                    var tempCat3 = this.physics.add.image(750 + i*200, 800, this.catParty.currentTeam[i].photoCircle);
                    tempCat3.setCircle(64);
                    tempCat3.setCollideWorldBounds(true);
                    tempCat3.setBounce(1);
                    tempCat3.setInteractive();
                    tempCat3.unitInformation = this.catParty.currentTeam[i];
                    this.physics.add.collider(tempCat3, blockedLayer);
                    tempCat3.on('pointerover', () => {
                        console.log(tempCat3.unitInformation);
                    })
                    this.allUnits.push(tempCat3);
                }
            }

            //enemy spawns for this current level
            var enemyInformation = new Enemy("Mecha Cat", "This cat does not know how to operate this machinery at all. Be careful.", [], 100, 50, 60, 3);
            var tempEnemy = this.physics.add.image(750, 150, "mechaCatCircle"); 
            tempEnemy.setCircle(64);
            tempEnemy.setCollideWorldBounds(true);
            tempEnemy.setBounce(1);
            tempEnemy.setInteractive();
            tempEnemy.unitInformation = enemyInformation;
            this.physics.add.collider(tempEnemy, blockedLayer);
            tempEnemy.on('pointerover', () => {
                console.log(tempEnemy.unitInformation);
            })
            this.allUnits.push(tempEnemy);
            

            //collide with all other units 
            for (var i = 0; i < this.allUnits.length; i++){
                for (j = i; j < this.allUnits.length; j++){
                    this.physics.add.collider(this.allUnits[i], this.allUnits[j]);
                }
            }

            console.log(this.allUnits);

        }
    },

    update: function () {
        //some core logic goes in here, requires to be updated frame by frame such as cameras

    },
});

class catParty {
    constructor() {
        this.allCats = []; 
        this.currentTeam = [];
        this.totalCatFood = 0;
    }

    //search for a cat reference inside the all cats array and place it inside the current cat array
    swapCat(indexCurrent, indexAllCats){
        this.currentTeam[indexCurrent] = this.allCats[indexAllCats]; 
    }

    obtainNewCat(cat){
        this.allCats.push(cat);
    }

    obtainCatFood(amount){
        this.totalCatFood += amount; 
    }

    
}

class Cat {
    constructor(name, description, rarity, skillArray, HP, ATK, DEF, WT, photo, photoCircle) {
        this.name = name; 
        this.description = description;
        this.rarity = rarity; 
        this.skillArray = skillArray;
        this.maxHP = HP; 
        this.HP = this.maxHP; 
        this.ATK = ATK;
        this.DEF = DEF;
        this.WT = WT;
        this.status = null; //current status being affected 
        this.photo = photo; 
        this.photoCircle = photoCircle;
        this.type = "cat";
    }

    removeStatus(){
        this.status = null;
    }

    inflictStatus(status){
        this.status = status;
    }
}

class Enemy {
    constructor(name, description, skillArray, HP, ATK, DEF, WT) {
        this.name = name;
        this.description = description;
        this.skillArray = skillArray;
        this.maxHP = HP;
        this.HP = this.maxHP;
        this.ATK = ATK;
        this.DEF = DEF;
        this.WT = WT; //weights affects movement speed etc. 
        this.status = null;
        this.type = "enemy";
    }
}

class Skill {
    constructor(name, description){
        this.name = name;
        this.description = description;
    }
}

class Status {
    constructor(name, description){
        this.name = name;
        this.description = description;
    }
}