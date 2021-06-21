var BootScene = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function BootScene() {
        Phaser.Scene.call(this, {
            key: 'BootScene'
        });

    },

    init: function (data) {
        console.log(data)
        if (jQuery.isEmptyObject(data)) {
            this.catParty = new catParty();
        } else {
            this.catParty = data.catParty;
        }
        console.log(this.catParty);
    },

    preload: function () {
        this.load.image('tiles', 'assets/map/Mapset.png');
        this.load.image('useSkill', 'assets/text/useSkill.png');
        this.load.image('skipTurn', 'assets/text/skipTurn.png');
        this.load.image('chefCat', 'assets/cats/chefCat.png');
        this.load.image('chefCatCircle', 'assets/cats/chefCatCircle.png');
        this.load.image('knightCat', 'assets/cats/knightCatCircle.png');
        this.load.image('knightCatCircle', 'assets/cats/knightCatCircle.png');
        this.load.image('mechaCat', 'assets/cats/mechaCat.png');
        this.load.image('mechaCatCircle', 'assets/cats/mechaCatCircle.png');
        this.load.image('sideMenu', 'assets/text/sideMenu.png')
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
                "catParty": this.catParty,
                "level": 0
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

    init: function (data) {
        if (data != null && data.level === 0) {
            this.currentLevel = 0;
        } else {
            this.currentLevel = data.level
        }
        console.log(data);
        this.catParty = data.catParty;
        this.allUnits = []; //the all units array stores the enemy and the cats

        //move phase active, indicating all cats are now moving
        this.movePhase = false;
        //skill phase active, indicating that the current cat can use a skill
        this.skillPhase = false;
        //enemyphase 
        this.enemyPhase = false;
        //amount of catfood 
        this.catFoodGained = 0;
        //whether or not unit is colliding, limits the amount of damage delt at one time 
        this.isColliding = false;
    },

    preload: function () {
        //load based on the level
        if (this.currentLevel === 0) {
            this.load.tilemapTiledJSON('testground', 'assets/map/testground.json');
            var chefCat = new Cat("Chef Cat", 1, "The best chef in town, makes the best cat food!", 4, [], 49, 32, 26, 5, "chefCat", "chefCatCircle");
            this.catParty.obtainNewCat(chefCat);
            this.catParty.swapCat(0, 0);

            var knightCat = new Cat('Knight Cat', 1, "This cat somehow found some knight armor and a sword, then believed that it is a knight...", 4, [], 30, 50, 50, 6, "knightCat", "knightCatCircle");
            this.catParty.obtainNewCat(knightCat);
            this.catParty.swapCat(1, 1);
        }

    },

    create: function () {
        if (this.currentLevel === 0) {
            var testground = this.make.tilemap({
                key: 'testground'
            });
            var tiles = testground.addTilesetImage('Mapset', 'tiles');
            this.traverseLayer = testground.createLayer('traverseLayer', tiles, 0, 0);
            this.blockedLayer = testground.createLayer('blockedLayer', tiles, 0, 0);
            this.blockedLayer.setCollisionByExclusion([-1]);
            this.cameras.main.roundPixels = true;

            this.spawnCats();

            //enemy spawns for this current level
            var enemyInformation = new Enemy("Mecha Cat", 5, "This cat does not know how to operate this machinery at all. Be careful.", [], 100, 50, 60, 3);
            this.spawnEnemies(enemyInformation, 750, 150, "mechaCatCircle");


            //collide with all other units 
            this.setUnitCollision();

            console.log(this.allUnits);
            //turn counter
            this.index = -1;
            this.currentCat = this.allUnits[0];
            this.currentEnemy = null;
            this.input.on('pointerdown', () => {
                console.log(this.allUnits[this.index].unitInformation.name);
                if (this.movePhase === false && this.skillPhase === false && this.enemyPhase === false) {
                    this.fireCat(); //will be changed to this.fireCat();
                }
            });



            this.hideLine = false;
            this.graphics = this.add.graphics({
                lineStyle: {
                    width: 4,
                    color: 0xaa00aa
                }
            });
            this.line = new Phaser.Geom.Line(this.currentCat.x, this.currentCat.y, 550, 300);
            this.input.on('pointermove', (pointer) => {
                this.line.x2 = pointer.x;
                this.line.y2 = pointer.y;
                this.redraw();
            });

            this.redraw();

            this.sideMenu = this.physics.add.image(1430, 480, 'sideMenu');

            this.useSkillButton = this.physics.add.image(1430, 805, 'useSkill');
            this.useSkillButton.setInteractive();
            this.useSkillButton.visible = false;
            this.useSkillButton.on('pointerdown', () => {
                if (this.skillPhase === true) {
                    this.useSkill();
                }

            });

            this.skipTurnButton = this.physics.add.image(1430, 900, 'skipTurn');
            this.skipTurnButton.setInteractive();
            this.skipTurnButton.visible = false;
            this.skipTurnButton.on('pointerdown', () => {
                if (this.skillPhase === true) {
                    this.skipTurn();
                }
            });

            this.announcementText = this.add.text(500, 50, "", {
                color: "#000000",
                align: "center",
                fontWeight: 'bold',
                font: '32px Arial',
                wordWrap: {
                    width: 1000,
                    useAdvancedWrap: true
                }
            });

            this.nextTurn();

        }
    },

    unitCollision: function (unit1, unit2) {

        if (unit1.unitInformation.type === unit2.unitInformation.type) {
            return; //nothing happens 
        } else if (this.isColliding === false) {
            //we do calculations here for damage delt 
            if (this.movePhase === true) {
                //if the player is moving, player deals dmg to enemy 
                if (unit1.unitInformation.type === "cat") {
                    //then deal dmg to unit2
                    console.log("damage delt!!");
                    console.log(unit1.unitInformation);
                    console.log(unit2.unitInformation);
                } else if (unit2.unitInformation.type === "cat") {
                    //then deal dmg to unit1
                    console.log("damage delt!!");
                    console.log(unit1.unitInformation);
                    console.log(unit2.unitInformation);
                }
                this.isColliding = true;
            } else if (this.enemyPhase === true) {
                //if the enemy is moving, dmg to be delt to the player
                if (unit1.unitInformation.type === "enemy") {
                    //then deal dmg to unit 2
                    console.log("damage delt!!");
                    console.log(unit1.unitInformation);
                    console.log(unit2.unitInformation);
                } else if (unit2.unitInformation.type === "enemy") {
                    //then deal dmg to unit 1 
                    console.log("damage delt!!");
                    console.log(unit1.unitInformation);
                    console.log(unit2.unitInformation);
                }
                this.isColliding = true;
            }
        }
    },

    setUnitCollision: function () {
        //collide with all other units 
        for (var i = 0; i < this.allUnits.length; i++) {
            for (j = i; j < this.allUnits.length; j++) {
                this.physics.add.collider(this.allUnits[i], this.allUnits[j], this.unitCollision, false, this); //need an event handler method here for damage calcs
            }
        }
    },


    redraw: function () {
        if (this.hideLine === false && this.ManhattanDistance(this.input.activePointer.x, this.input.activePointer.y, this.currentCat.x, this.currentCat.y) <= 500) {
            this.graphics.clear();
            this.graphics.strokeLineShape(this.line);
        }
        if (this.ManhattanDistance(this.input.activePointer.x, this.input.activePointer.y, this.currentCat.x, this.currentCat.y) > 500) {
            this.graphics.clear();
        }
    },

    fireCat: function () {
        var manhattanDistance = this.ManhattanDistance(this.input.activePointer.x, this.input.activePointer.y, this.currentCat.x, this.currentCat.y);
        //can reach up to 250 speed in total 
        if (manhattanDistance > 500) {
            return; //don't fire if that is the acase
        }
        var power = manhattanDistance * 1.5;
        this.physics.moveToObject(this.currentCat, this.input.activePointer, power);
        //update checking if taking turn
        this.movePhase = true;
    },

    ManhattanDistance: function (x1, y1, x2, y2) {
        var distance = Math.abs(x2 - x1) + Math.abs(y2 - y1);
        return distance;
    },

    nextTurn: function () {
        //main turn system function
        if (this.checkEndBattle()) {
            this.endBattle();
            return;
        }

        do {
            this.index++;
            if (this.index >= this.allUnits.length) {
                this.index = 0;
            }
        } while (!this.allUnits[this.index].unitInformation.status === "dead")

        //if player
        if (this.allUnits[this.index].unitInformation.type === "cat") {
            this.hideLine = false;
            this.currentCat = this.allUnits[this.index];
            this.line = new Phaser.Geom.Line(this.currentCat.x, this.currentCat.y, 550, 300);
            this.announcementText.setText(this.currentCat.unitInformation.name + "'s Turn")
        }
        //else it is the enemy
        else {
            this.graphics.clear();
            this.hideLine = true;
            this.currentEnemy = this.allUnits[this.index];
            //temporarily forget about enemy AI, make enemy phase true; 
            this.enemyPhase = true;
            this.enemyPhase = false;
            this.announcementText.setText(this.currentEnemy.unitInformation.name + "'s Turn")
            this.nextTurn();
        }

        return;

    },

    useSkill: function () {
        console.log("used skill");
        this.announcementText.setText(this.currentCat.unitInformation.name + " used a skill!")
        this.sleep(3000).then(() => {
            this.skillPhase = false;
            this.nextTurn();
        });
    },

    skipTurn: function () {
        console.log("turn skipped");
        this.announcementText.setText(this.currentCat.unitInformation.name + " skips its turn!")
        this.sleep(3000).then(() => {
            this.skillPhase = false;
            this.nextTurn();
        });
    },

    checkEndBattle: function () {
        var deathCounter = 0;
        for (var i = 0; i < this.allUnits.length; i++) {
            if (this.allUnits[i].unitInformation.HP <= 0 && this.allUnits[i].unitInformation.type === "cat") {
                deathCounter++;
            }
        }
        if (deathCounter === this.catParty.currentTeam.length) {
            return true;
        }
        return false;
    },

    endBattle: function () {

    },

    sleep: function (ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    update: function () {
        // //some core logic goes in here, requires to be updated frame by frame such as cameras
        if (this.movePhase == true && (Math.abs(Math.floor(this.currentCat.body.velocity.x)) < 1) && (Math.abs(Math.floor(this.currentCat.body.velocity.y)) < 1)) {
            console.log("its now zero");
            this.announcementText.setText(this.currentCat.unitInformation.name + " is ready to use a skill!");
            this.movePhase = false;
            this.skillPhase = true;
            this.isColliding = false;
        }

        if (this.movePhase == true || this.skillPhase == true) {
            this.graphics.clear();
        }

        if (this.skillPhase == true) {
            this.useSkillButton.visible = true;
            this.skipTurnButton.visible = true;
        } else {
            this.useSkillButton.visible = false;
            this.skipTurnButton.visible = false;
        }

    },

    spawnEnemies: function (enemyInformation, x, y, name) {

        var tempEnemy = this.physics.add.image(x, y, name);
        tempEnemy.setCircle(64);
        tempEnemy.setCollideWorldBounds(true);
        tempEnemy.setBounce(1);
        tempEnemy.setInteractive();
        tempEnemy.setMass(enemyInformation.WT)
        tempEnemy.setDrag(100);
        tempEnemy.unitInformation = enemyInformation;
        this.physics.add.collider(tempEnemy, this.blockedLayer);
        tempEnemy.on('pointerover', () => {
            console.log(tempEnemy.unitInformation);
        });
        tempEnemy.damageText = this.add.text(500, 50, "234", {
            color: "#FF0000",
            align: "center",
            fontWeight: 'bold',
            font: '32px Arial',
            wordWrap: {
                width: 1000,
                useAdvancedWrap: true
            }
        }).visible = false;

        tempEnemy.healText = this.add.text(500, 50, "234", {
            color: "#00FF00",
            align: "center",
            fontWeight: 'bold',
            font: '32px Arial',
            wordWrap: {
                width: 1000,
                useAdvancedWrap: true
            }
        }).visible = false;
        this.allUnits.push(tempEnemy);
    },

    wallCollision: function () {
        //console.log(this.currentCat.body.velocity);
    },


    spawnCats: function () {
        for (var i = 0; i < this.catParty.currentTeam.length; i++) {
            if (i === 0) {
                var tempCat0 = this.physics.add.image(750 + i * 200, 800, this.catParty.currentTeam[i].photoCircle);
                tempCat0.setCircle(64);
                tempCat0.setCollideWorldBounds(true);
                tempCat0.setBounce(1);
                tempCat0.setInteractive();
                tempCat0.setMass(this.catParty.currentTeam[i].WT)
                tempCat0.setDrag(100);
                tempCat0.unitInformation = this.catParty.currentTeam[i];
                this.physics.add.collider(tempCat0, this.blockedLayer, this.wallCollision, false, this);
                tempCat0.on('pointerover', () => {
                    console.log(tempCat0.unitInformation);
                });
                tempCat0.damageText = this.add.text(500, 50, "234", {
                    color: "#FF0000",
                    align: "center",
                    fontWeight: 'bold',
                    font: '32px Arial',
                    wordWrap: {
                        width: 1000,
                        useAdvancedWrap: true
                    }
                }).visible = false;

                tempCat0.healText = this.add.text(500, 50, "234", {
                    color: "#00FF00",
                    align: "center",
                    fontWeight: 'bold',
                    font: '32px Arial',
                    wordWrap: {
                        width: 1000,
                        useAdvancedWrap: true
                    }
                }).visible = false;
                this.allUnits.push(tempCat0);
            }
            if (i === 1) {
                var tempCat1 = this.physics.add.image(750 + i * 200, 800, this.catParty.currentTeam[i].photoCircle);
                tempCat1.setCircle(64);
                tempCat1.setCollideWorldBounds(true);
                tempCat1.setBounce(1);
                tempCat1.setInteractive();
                tempCat1.setMass(this.catParty.currentTeam[i].WT);
                tempCat1.setDrag(100);
                tempCat1.unitInformation = this.catParty.currentTeam[i];
                this.physics.add.collider(tempCat1, this.blockedLayer, this.wallCollision, false, this);
                tempCat1.on('pointerover', () => {
                    console.log(tempCat1.unitInformation);
                });
                tempCat1.damageText = this.add.text(500, 50, "234", {
                    color: "#FF0000",
                    align: "center",
                    fontWeight: 'bold',
                    font: '32px Arial',
                    wordWrap: {
                        width: 1000,
                        useAdvancedWrap: true
                    }
                }).visible = false;

                tempCat1.healText = this.add.text(500, 50, "234", {
                    color: "#00FF00",
                    align: "center",
                    fontWeight: 'bold',
                    font: '32px Arial',
                    wordWrap: {
                        width: 1000,
                        useAdvancedWrap: true
                    }
                }).visible = false;
                this.allUnits.push(tempCat1);
            }
            if (i === 2) {
                var tempCat2 = this.physics.add.image(750 + i * 200, 800, this.catParty.currentTeam[i].photoCircle);
                tempCat2.setCircle(64);
                tempCat2.setCollideWorldBounds(true);
                tempCat2.setBounce(1);
                tempCat2.setInteractive();
                tempCat2.setMass(this.catParty.currentTeam[i].WT)
                tempCat2.unitInformation = this.catParty.currentTeam[i];
                tempCat2.setDrag(100);
                this.physics.add.collider(tempCat2, this.blockedLayer, this.wallCollision, false, this);
                tempCat2.on('pointerover', () => {
                    console.log(tempCat2.unitInformation);
                })
                tempCat2.damageText = this.add.text(500, 50, "234", {
                    color: "#FF0000",
                    align: "center",
                    fontWeight: 'bold',
                    font: '32px Arial',
                    wordWrap: {
                        width: 1000,
                        useAdvancedWrap: true
                    }
                }).visible = false;

                tempCat2.healText = this.add.text(500, 50, "234", {
                    color: "#00FF00",
                    align: "center",
                    fontWeight: 'bold',
                    font: '32px Arial',
                    wordWrap: {
                        width: 1000,
                        useAdvancedWrap: true
                    }
                }).visible = false;
                this.allUnits.push(tempCat2);
            }
            if (i === 3) {
                var tempCat3 = this.physics.add.image(750 + i * 200, 800, this.catParty.currentTeam[i].photoCircle);
                tempCat3.setCircle(64);
                tempCat3.setCollideWorldBounds(true);
                tempCat3.setBounce(1);
                tempCat3.setInteractive();
                tempCat3.setMass(this.catParty.currentTeam[i].WT)
                tempCat3.unitInformation = this.catParty.currentTeam[i];
                tempCat3.setDrag(100);
                this.physics.add.collider(tempCat3, this.blockedLayer, this.wallCollision, false, this);
                tempCat3.on('pointerover', () => {
                    console.log(tempCat3.unitInformation);
                });
                tempCat3.damageText = this.add.text(500, 50, "234", {
                    color: "#FF0000",
                    align: "center",
                    fontWeight: 'bold',
                    font: '32px Arial',
                    wordWrap: {
                        width: 1000,
                        useAdvancedWrap: true
                    }
                }).visible = false;

                tempCat3.healText = this.add.text(500, 50, "234", {
                    color: "#00FF00",
                    align: "center",
                    fontWeight: 'bold',
                    font: '32px Arial',
                    wordWrap: {
                        width: 1000,
                        useAdvancedWrap: true
                    }
                }).visible = false;
                this.allUnits.push(tempCat3);
            }
        }
    }
});

class catParty {
    constructor() {
        this.allCats = [];
        this.currentTeam = [];
        this.totalCatFood = 0;
    }

    //search for a cat reference inside the all cats array and place it inside the current cat array
    swapCat(indexCurrent, indexAllCats) {
        this.currentTeam[indexCurrent] = this.allCats[indexAllCats];
    }

    obtainNewCat(cat) {
        this.allCats.push(cat);
    }

    obtainCatFood(amount) {
        this.totalCatFood += amount;
    }


}

class Cat {
    constructor(name, level, description, rarity, skillArray, HP, ATK, DEF, WT, photo, photoCircle) {
        this.name = name;
        this.level = level;
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
        this.exp = 0;
    }

    removeStatus() {
        this.status = null;
    }

    inflictStatus(status) {
        this.status = status;
    }
}

class Enemy {
    constructor(name, level, description, skillArray, HP, ATK, DEF, WT) {
        this.name = name;
        this.level = level;
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
    constructor(name, description) {
        this.name = name;
        this.description = description;
    }
}

class Status {
    constructor(name, description) {
        this.name = name;
        this.description = description;
    }
}