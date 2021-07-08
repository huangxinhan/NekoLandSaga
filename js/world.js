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
        //enemy move phase
        this.enemyMovePhase = false;
        //enemy skill phase
        this.enemySkillPhase = false;
        //amount of catfood 
        this.catFoodGained = 0;
        //current team of cats
        this.currentTeam = [];

        //locks skill if victory
        this.victory = false;
        this.defeat = false;

        this.buttonLock = false;
        this.turnCounter = 0;
        this.physics.world.setFPS(120);
    },

    preload: function () {
        //load based on the level
        if (this.currentLevel === 0) {
            this.load.tilemapTiledJSON('tutorial', 'assets/map/tutorial.json');
            // var chefCat = new Cat("Chef Cat", 1, "The best chef in town, makes the best cat food!", 4, [], 49, 132, 26, 5, "chefCat", "chefCatCircle");
            // this.catParty.obtainNewCat(chefCat);
            // this.catParty.swapCat(0, 0);

            // var knightCat = new Cat('Knight Cat', 1, "This cat somehow found some knight armor and a sword, then believed that it is a knight...", 4, [], 30, 50, 50, 6, "knightCat", "knightCatCircle");
            // this.catParty.obtainNewCat(knightCat);
            // this.catParty.swapCat(1, 1);

            this.bossStage = false;
            this.enemyCount = 1;
        }

    },

    create: function () {
        if (this.currentLevel === 0) {
            var tutorial = this.make.tilemap({
                key: 'tutorial'
            });
            var tiles = tutorial.addTilesetImage('Mapset', 'tiles');
            this.traverseLayer = tutorial.createStaticLayer('traverseLayer', tiles, 0, 0);
            this.blockedLayer = tutorial.createStaticLayer('blockedLayer', tiles, 0, 0);
            this.blockedLayer.setCollisionByExclusion([-1]);
            this.cameras.main.roundPixels = true;

            this.catParty.currentTeam.push(new Cat('Knight Cat', 1, "Terra", "This cat somehow found some knight armor and a sword, then believed that it is a knight...", "☆☆☆☆", new Skill("Piercing Sword", "Inflicts 'Rage' status on itself for 1 turn.", 1), 25, 25, 25, 7, "knightCat", "knightCatCircle"));

            //enemy spawns for this current level
            this.enemiesInfo = [];

            var enemyInformation = {
                info: new Enemy("Warrior Dog", 5, "Anemo", "", [
                    new EnemySkill("Recover", "recovers 25% of user's max HP"), new EnemySkill("Warning", "This skill does nothing.")
                ], 30, 15, 20, 5, "normalSkill"),
                spawnX: 1280,
                spawnY: 1300,
                image: "warriorDogCircle"
            };
            this.enemiesInfo.push(enemyInformation);

            this.cameras.main.setBounds(0, 0, tutorial.widthInPixels, tutorial.heightInPixels);

            this.setup();

            this.setUnitCollisionAndLine();

            this.nextTurn();
        }
    },

    setup: function () {

        this.coinCollide = this.sound.add('coinCollide');
        this.buttonHover = this.sound.add('buttonHover');
        this.buttonClick = this.sound.add('buttonClick');

        if (this.currentLevel == 0) {
            this.spawnCats(1280, 1580);
        }

        for (var i = 0; i < this.enemiesInfo.length; i++) {
            this.spawnEnemies(this.enemiesInfo[i].info, this.enemiesInfo[i].spawnX, this.enemiesInfo[i].spawnY, this.enemiesInfo[i].image);
        }

        console.log(this.allUnits);
        //turn counter
        this.index = -1;
        this.currentCat = this.allUnits[0];
        this.currentEnemy = null;
        this.input.on('pointerdown', () => {
            console.log(this.allUnits[this.index].unitInformation);
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
            this.line.x2 = this.input.mousePointer.worldX;
            this.line.y2 = this.input.mousePointer.worldY;
            this.redraw();
        });

        this.redraw();


        this.sideMenu = this.physics.add.image(1430, 480, 'sideMenu');
        this.sideMenu.setInteractive();
        this.sideMenu.setImmovable(true);
        this.sideMenu.setScrollFactor(0);

        this.sideMenuText = this.add.text(1300, 25, "", {
            color: "#FFFFFF",
            align: "left",
            fontWeight: 'bold',
            font: '18px Arial',
            wordWrap: {
                width: 275,
                useAdvancedWrap: true
            }
        });

        this.sideMenuText.setScrollFactor(0);

        this.useSkillButton = this.physics.add.image(1430, 805, 'useSkill');
        this.useSkillButton.setInteractive();
        this.useSkillButton.visible = false;
        this.useSkillButton.setScrollFactor(0);
        this.useSkillButton.on('pointerdown', () => {
            this.buttonClick.play();
            if (this.skillPhase === true) {
                this.useSkill();
            }
        });

        this.useSkillButton.on('pointerover', () => {
            this.buttonHover.play();
            this.useSkillButton.setTint("0xf2b3ff");
        })

        this.useSkillButton.on('pointerout', () => {
            this.useSkillButton.clearTint();
        });

        this.skipTurnButton = this.physics.add.image(1430, 900, 'skipTurn');
        this.skipTurnButton.setInteractive();
        this.skipTurnButton.visible = false;
        this.skipTurnButton.setScrollFactor(0);
        this.skipTurnButton.on('pointerdown', () => {
            this.buttonClick.play();
            if (this.skillPhase === true) {
                this.skipTurn();
            }
        });

        this.skipTurnButton.on('pointerover', () => {
            this.buttonHover.play();
            this.skipTurnButton.setTint("0xf2b3ff");
        })

        this.skipTurnButton.on('pointerout', () => {
            this.skipTurnButton.clearTint();
        });

        //will have to make sure top menu follows the camera
        this.topMenu = this.physics.add.image(480, 48, 'topMenu');
        this.topMenu.setInteractive();
        this.topMenu.setImmovable(true);
        this.topMenu.setScrollFactor(0);

        this.announcementText = this.add.text(550, 30, "", {
            color: "#ffffff",
            align: "center",
            fontWeight: 'bold',
            font: '32px Arial',
            wordWrap: {
                width: 1000,
                useAdvancedWrap: true
            }
        });

        this.announcementText.setScrollFactor(0);

        this.position1 = [60, 45];
        this.position2 = [185, 45];
        this.position3 = [310, 45];
        this.position4 = [435, 45];

        this.highlight = this.physics.add.image(0, 0, 'highlight').setInteractive();
        this.highlight.setScale(0.7, 0.7);
        this.highlight.setScrollFactor(0);
        this.highlight.visible = false;
        this.catIcons = []; //associative array
        for (var i = 0; i < this.catParty.currentTeam.length; i++) {
            this.catIcons[i] = this.physics.add.image(60 + ((i % 5) * 125), 45, this.catParty.currentTeam[i].photoCircle).setInteractive();
            this.catIcons[i].setScale(0.7, 0.7);
            this.catIcons[i].setScrollFactor(0);
        }

        for (var i = 0; i < this.catIcons.length; i++) {
            switch (i) {
                case 0:
                    this.catIcons[0].on('pointerover', () => {
                        this.buttonHover.play();
                        this.highlight.visible = true;
                        this.highlight.x = this.position1[0];
                        this.highlight.y = this.position1[1];
                    });
                    this.catIcons[0].on('pointerout', () => {
                        this.highlight.visible = false;
                    });
                    this.catIcons[0].on('pointerdown', () => {
                        this.buttonClick.play();
                        if (this.movePhase === false && this.enemyMovePhase === false && this.enemyPhase === false) {
                            this.cameras.main.startFollow(this.currentTeam[0])
                        }
                    });
                    break;
                case 1:
                    this.catIcons[1].on('pointerover', () => {
                        this.buttonHover.play();
                        this.highlight.visible = true;
                        this.highlight.x = this.position2[0];
                        this.highlight.y = this.position2[1];
                    });
                    this.catIcons[1].on('pointerout', () => {
                        this.highlight.visible = false;
                    });
                    this.catIcons[1].on('pointerdown', () => {
                        this.buttonClick.play();
                        if (this.movePhase === false && this.enemyMovePhase === false && this.enemyPhase === false) {
                            this.cameras.main.startFollow(this.currentTeam[1])
                        }
                    });
                    break;
                case 2:
                    this.catIcons[2].on('pointerover', () => {
                        this.buttonHover.play();
                        this.highlight.visible = true;
                        this.highlight.x = this.position3[0];
                        this.highlight.y = this.position3[1];
                    });
                    this.catIcons[2].on('pointerout', () => {
                        this.highlight.visible = false;
                    });
                    this.catIcons[2].on('pointerdown', () => {
                        this.buttonClick.play();
                        if (this.movePhase === false && this.enemyMovePhase === false && this.enemyPhase === false) {
                            this.cameras.main.startFollow(this.currentTeam[2])
                        }
                    });
                    break;
                case 3:
                    this.catIcons[3].on('pointerover', () => {
                        this.buttonHover.play();
                        this.highlight.visible = true;
                        this.highlight.x = this.position4[0];
                        this.highlight.y = this.position4[1];
                    });
                    this.catIcons[3].on('pointerout', () => {
                        this.highlight.visible = false;
                    });
                    this.catIcons[3].on('pointerdown', () => {
                        this.buttonClick.play();
                        if (this.movePhase === false && this.enemyMovePhase === false && this.enemyPhase === false) {
                            this.cameras.main.startFollow(this.currentTeam[3])
                        }
                    });
                    break;
            }
        }

        this.healthBar = new HealthBar(this.scene.get("WorldScene"), 1300, 215, 50);

        this.healthBar.bar.visible = false;

        this.healthBar.bar.setScrollFactor(0);

        this.cameras.main.roundPixels = true; // avoid tile bleed
        var cursors = this.input.keyboard.createCursorKeys();

        this.input.keyboard.on('keydown', () => {
            this.cameras.main.stopFollow();
        });

        var controlConfig = {
            camera: this.cameras.main,
            left: cursors.left,
            right: cursors.right,
            up: cursors.up,
            down: cursors.down,
            acceleration: 0.06,
            drag: 0.003,
            maxSpeed: 1.0
        };

        this.controls = new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig);
    },


    damageDealingInteractions: function (unit2, damage) {
        var success = false;
        unit2.unitInformation.HP -= damage;
        if (unit2.unitInformation.HP <= 0) {
            success = true;
            unit2.unitInformation.HP = 0;
            unit2.unitInformation.status = new Status("dead", "", "∞");
            this.sleep(2000).then(() => {
                unit2.setInteractive(false);
                unit2.setActive(false).setVisible(false);
                unit2.x = -9999;
                unit2.y = -9999;
            });
        }
        if (this.sideMenuText.text.includes(unit2.unitInformation.name)) {
            this.healthBar.decrease(damage);
            this.resetText(unit2);
        }
        console.log(unit2);
        unit2.damageText.setText("-" + damage);
        unit2.damageText.visible = true;
        this.sleep(1000).then(() => {
            unit2.damageText.visible = false;
        });
        return success;
    },

    gainExp: function (success, level) {
        if (success == true) {
            var expGain = 20 * (level - (this.currentCat.unitInformation.level - 1));
            if (expGain <= 0) {
                expGain = 1;
            }
            if (this.currentCat.unitInformation.level == 40) {
                expGain = 0;
            }
            if (expGain + this.currentCat.unitInformation.exp >= 100) {
                this.currentCat.unitInformation.exp = 0;
                console.log("leveld up!")
                if (this.currentCat.unitInformation.level < 40) {
                    console.log("level up!")
                    this.currentCat.unitInformation.level += 1;
                    this.currentCat.unitInformation.ATK += 1;
                    this.currentCat.unitInformation.DEF += 1;
                    this.currentCat.unitInformation.HP += 1;
                    this.currentCat.unitInformation.maxHP += 1;
                    this.currentCat.healText.visible = true;
                    this.currentCat.healText.setText("Level up!");
                    this.sleep(1000).then(() => {
                        this.currentCat.healText.visible = false;
                    });
                }
            } else {
                console.log("gained exp!")
                this.currentCat.healText.visible = true;
                this.currentCat.healText.setText("EXP + " + expGain);
                this.sleep(1000).then(() => {
                    this.currentCat.healText.visible = false;
                });
                this.currentCat.unitInformation.exp += expGain;
            }
        }
    },

    unitCollision: function (unit1, unit2) {
        this.coinCollide.play();
        if (unit1.unitInformation.type === unit2.unitInformation.type) {
            return; //nothing happens 
        } else {
            //we do calculations here for damage delt 
            if (this.movePhase === true) {
                //if the player is moving, player deals dmg to enemy 
                if (unit1.unitInformation.type === "cat" && unit2.unitInformation.isHit == false) {
                    unit2.unitInformation.isHit = true;
                    var damage = this.calculateDamage(unit1.unitInformation.ATK, unit2.unitInformation.DEF, unit1.body.velocity.x, unit1.body.velocity.y, unit2.body.velocity.x, unit2.body.velocity.y);
                    damage = this.calculateStatusAndElementalDamage(unit1, unit2, damage);
                    this.gainExp(this.damageDealingInteractions(unit2, damage), unit2.unitInformation.level);
                    unit1.unitInformation.lastTarget = unit2;

                } else if (unit2.unitInformation.type === "cat" && unit1.unitInformation.isHit == false) {
                    unit1.unitInformation.isHit = true;
                    var damage = this.calculateDamage(unit2.unitInformation.ATK, unit1.unitInformation.DEF, unit2.body.velocity.x, unit2.body.velocity.y, unit1.body.velocity.x, unit1.body.velocity.y);
                    damage = this.calculateStatusAndElementalDamage(unit2, unit1, damage);
                    this.gainExp(this.damageDealingInteractions(unit1, damage), unit2.unitInformation.level);
                    unit2.unitInformation.lastTarget = unit1;
                }
                this.checkEndBattle();
                this.checkEndBattleVictory();
            } else if (this.enemyPhase === true) {
                //if the enemy is moving, dmg to be delt to the player
                if (unit1.unitInformation.type === "enemy" && unit2.unitInformation.isHit == false) {
                    unit2.unitInformation.isHit = true;
                    var damage = this.calculateDamage(unit1.unitInformation.ATK, unit2.unitInformation.DEF, unit1.body.velocity.x, unit1.body.velocity.y, unit2.body.velocity.x, unit2.body.velocity.y);
                    damage = this.calculateStatusAndElementalDamage(unit1, unit2, damage);
                    this.damageDealingInteractions(unit2, damage);
                    unit1.unitInformation.lastTarget = unit2;

                } else if (unit2.unitInformation.type === "enemy" && unit1.unitInformation.isHit == false) {
                    unit1.unitInformation.isHit = true;
                    var damage = this.calculateDamage(unit2.unitInformation.ATK, unit1.unitInformation.DEF, unit2.body.velocity.x, unit2.body.velocity.y, unit1.body.velocity.x, unit1.body.velocity.y);
                    damage = this.calculateStatusAndElementalDamage(unit2, unit1, damage);
                    this.damageDealingInteractions(unit1, damage);
                    unit2.unitInformation.lastTarget = unit1;
                }
                this.checkEndBattle();
                this.checkEndBattleVictory();
            }
        }
    },

    calculateStatusAndElementalDamage: function (unit1, unit2, damage) {
        if (unit1.unitInformation.status.name == "rage") {
            damage = Math.floor(damage * 1.5);
        }
        if (unit2.unitInformation.status.name == "Iron Wall") {
            damage = Math.floor(damage * 0.5);
        }
        if (unit1.unitInformation.element == "Anemo" && unit2.unitInformation.element == "Aqua") {
            damage = Math.floor(damage * 1.5);
        }
        if (unit1.unitInformation.element == "Anemo" && unit2.unitInformation.element == "Terra") {
            damage = Math.floor(damage * 0.75);
        }
        if (unit1.unitInformation.element == "Aqua" && unit2.unitInformation.element == "Terra") {
            damage = Math.floor(damage * 1.5);
        }
        if (unit1.unitInformation.element == "Aqua" && unit2.unitInformation.element == "Anemo") {
            damage = Math.floor(damage * 0.75);
        }
        if (unit1.unitInformation.element == "Terra" && unit2.unitInformation.element == "Anemo") {
            damage = Math.floor(damage * 1.5);
        }
        if (unit1.unitInformation.element == "Terra" && unit2.unitInformation.element == "Aqua") {
            damage = Math.floor(damage * 0.75);
        }
        if (unit1.unitInformation.element == "Dark" && unit2.unitInformation.element == "Light") {
            damage = Math.floor(damage * 2);
        }
        if (unit1.unitInformation.element == "Light" && unit2.unitInformation.element == "Dark") {
            damage = Math.floor(damage * 2);
        }
        if (unit1.unitInformation.element == "Dark" && unit2.unitInformation.element == "Dark") {
            damage = Math.floor(damage * 0.5);
        }
        if (unit1.unitInformation.element == "Light" && unit1.unitInformation.element == "Light") {
            damage = Math.floor(damage * 0.5);
        }

        return damage;
    },

    dealEffectDamage: function (unit1, unit2, damage) {
        if (unit1.unitInformation.type === "cat") {
            this.gainExp(this.damageDealingInteractions(unit2, damage), unit2.unitInformation.level);
        } else {
            this.damageDealingInteractions(unit2);
        }
        this.checkEndBattle();
        this.checkEndBattleVictory();
    },

    calculateDamage: function (attack, defense, velocityX, velocityY, velocity2X, velocity2Y) {
        var totalVelocity = Math.abs(velocityX) + Math.abs(velocityY) + Math.abs(velocity2X) + Math.abs(velocity2Y);
        var damageDelt = Math.floor((2 * attack - defense) * (totalVelocity / 1000));
        if (damageDelt < 0) {
            damageDelt = 0;
        }
        return damageDelt;
    },


    resetText: function (temp) {
        if (temp.unitInformation.type === "enemy") {
            this.sideMenuText.setText(temp.unitInformation.name + "\n" + "\n" +
                "Element: " + temp.unitInformation.element + "\n" + "\n" +
                "Level: " + temp.unitInformation.level + "\n" + "\n" +
                "EXP: MAX" + "\n" + "\n" +
                "HP: " + temp.unitInformation.HP + "/" + temp.unitInformation.maxHP + "\n" + "\n" + "\n" +
                //"Description: " + tempEnemy.unitInformation.description + "\n" + "\n" + "\n" +"\n" +"\n" +"\n" +
                //"Skill: " + temp.unitInformation.skill.name + "\n" + "\n" + temp.unitInformation.skill.description + "\n" + "\n" + "\n" + "\n" + "\n" + "Energy Cost: " + temp.unitInformation.skill.energyCost + "\n" + "\n" +
                "Attack: " + temp.unitInformation.ATK + "\n" + "\n" +
                "Defense: " + temp.unitInformation.DEF + "\n" + "\n" +
                "Weight: " + temp.unitInformation.WT + "\n" + "\n" +
                "Status: " + temp.unitInformation.status.name + "\n" + "\n" + temp.unitInformation.status.description + "\n" + "\n" + "Turns Left: " + temp.unitInformation.status.numberOfTurns);
        } else if (temp.unitInformation.type === "cat") {
            this.sideMenuText.setText(temp.unitInformation.name + "\n" + "\n" +
                "Element: " + temp.unitInformation.element + "\n" + "\n" +
                "Level: " + temp.unitInformation.level + "\n" + "\n" +
                "EXP: " + temp.unitInformation.exp + "\n" + "\n" +
                "HP: " + temp.unitInformation.HP + "/" + temp.unitInformation.maxHP + "\n" + "\n" + "\n" +
                //"Description: " + tempEnemy.unitInformation.description + "\n" + "\n" + "\n" +"\n" +"\n" +"\n" +
                "Skill: " + temp.unitInformation.skill.name + "\n" + "\n" + temp.unitInformation.skill.description + "\n" + "\n" + "\n" + "\n" + "\n" + "Energy Cost: " + temp.unitInformation.skill.energyCost + "\n" + "\n" +
                "Attack: " + temp.unitInformation.ATK + "\n" + "\n" +
                "Defense: " + temp.unitInformation.DEF + "\n" + "\n" +
                "Weight: " + temp.unitInformation.WT + "\n" + "\n" +
                "Status: " + temp.unitInformation.status.name + "\n" + "\n" + temp.unitInformation.status.description + "\n" + "\n" + "Turns Left: " + temp.unitInformation.status.numberOfTurns + "\n" + "\n" +
                "Enhance Level: " + temp.unitInformation.enhanced + "\n" + "\n" +
                "Energy: " + temp.unitInformation.energy);
        }

    },

    setUnitCollisionAndLine: function () {
        //collide with all other units 
        for (var i = 0; i < this.allUnits.length; i++) {
            for (j = i; j < this.allUnits.length; j++) {
                this.physics.add.collider(this.allUnits[i], this.allUnits[j], this.unitCollision, false, this); //need an event handler method here for damage calcs
            }
        }
    },


    redraw: function () {
        if (this.hideLine === false && this.ManhattanDistance(this.input.mousePointer.worldX, this.input.mousePointer.worldY, this.currentCat.x, this.currentCat.y) <= 800) {
            this.graphics.clear();
            this.graphics.strokeLineShape(this.line);
        }
        if (this.ManhattanDistance(this.input.mousePointer.worldX, this.input.mousePointer.worldY, this.currentCat.x, this.currentCat.y) > 500) {
            this.graphics.clear();
        }
    },

    fireCat: function () {
        var manhattanDistance = this.ManhattanDistance(this.input.mousePointer.worldX, this.input.mousePointer.worldY, this.currentCat.x, this.currentCat.y);
        //can reach up to 250 speed in total 
        if (manhattanDistance > 500) {
            return; //don't fire if that is the acase
        }
        var power = manhattanDistance;
        this.physics.moveTo(this.currentCat, this.input.mousePointer.worldX, this.input.mousePointer.worldY, power * (2 - (this.currentCat.unitInformation.WT * 0.1)));
        this.cameras.main.startFollow(this.currentCat);
        //update checking if taking turn
        this.movePhase = true;
    },

    ManhattanDistance: function (x1, y1, x2, y2) {
        var distance = Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));
        //var distance = Math.abs(x2 - x1) + Math.abs(y2 - y1);
        return distance;
    },

    dealStatusEffectDamage: function (unit) {
        if (unit.unitInformation.status.name == "Poisoned") {
            console.log("delt poison damage");
            var damage = Math.floor(unit.unitInformation.maxHP * 0.03);
            this.damageDealingInteractions(unit, damage);
        }
    },

    nextTurn: function () {
        //main turn system function
        this.turnCounter++;

        if (this.currentLevel == 0) {
            switch (this.turnCounter) {
                case 1:
                    this.scene.pause('WorldScene');
                    this.scene.run('DialogScene', {
                        "dialogStatus": "tutorial0"
                    });
                    break;
                case 2:
                    this.scene.pause('WorldScene');
                    this.scene.run('DialogScene', {
                        "dialogStatus": "tutorial1"
                    });
                    break;
                case 3:
                    this.scene.pause('WorldScene');
                    this.scene.run('DialogScene', {
                        "dialogStatus": "tutorial2"
                    });

            }
        }


        this.checkEndBattle()


        this.checkEndBattleVictory();


        // do {
        //     this.index++;
        //     if (this.index >= this.allUnits.length) {
        //         this.index = 0;
        //     }
        // } while (!this.allUnits[this.index].unitInformation.status.name == "dead")

        while (true) {
            this.index++;
            if (this.index >= this.allUnits.length) {
                this.index = 0;
            }
            if (this.allUnits[this.index].unitInformation.status.name != "dead") {
                break;
            }
        }

        this.cameras.main.startFollow(this.allUnits[this.index]);
        //if player
        if (this.allUnits[this.index].unitInformation.type === "cat") {
            //camera focus zoom onto the player
            this.hideLine = false;
            this.currentCat = this.allUnits[this.index];
            this.dealStatusEffectDamage(this.currentCat);
            this.line = new Phaser.Geom.Line(this.currentCat.x, this.currentCat.y, 550, 300);
            this.announcementText.setText(this.currentCat.unitInformation.name + "'s Turn");
            this.allUnits[this.index].unitInformation.energy++;
            this.resetText(this.currentCat);
            if (this.currentCat.unitInformation.status.name != "None") {
                this.currentCat.unitInformation.status.numberOfTurns--;
                if (this.currentCat.unitInformation.status.numberOfTurns == 0) {
                    this.currentCat.unitInformation.status = new Status("None", "", "∞");;
                }
            }
        }
        //else it is the enemy
        else {
            this.graphics.clear();
            this.hideLine = true;
            this.currentEnemy = this.allUnits[this.index];
            this.dealStatusEffectDamage(this.currentEnemy);
            //temporarily forget about enemy AI, make enemy phase true; 
            this.enemyPhase = true;
            this.announcementText.setText(this.currentEnemy.unitInformation.name + "'s Turn");
            if (this.currentEnemy.unitInformation.status.name != "None") {
                this.currentEnemy.unitInformation.status.numberOfTurns--;
                if (this.currentEnemy.unitInformation.status.numberOfTurns == 0) {
                    this.currentEnemy.unitInformation.status = new Status("None", "", "∞");;
                }
            }
            //camera focus zoom onto the enemy first. 
            this.sleep(1000).then(() => {
                this.invokeEnemyAI();
            });
        }

        return;

    },

    invokeEnemyAI: function () {
        switch (this.currentEnemy.unitInformation.AIType) {
            case "normal":
                //normal AIs will go max speed at the nearest cat 
                var selectedCat = null
                for (var i = 0; i < this.allUnits.length; i++) {
                    if (this.allUnits[i].unitInformation.type == "cat" && this.ManhattanDistance(this.allUnits[i].x, this.allUnits[i].y, this.currentEnemy.x, this.currentEnemy.y) <= 1200 &&
                        this.allUnits[i].unitInformation.status.name != "dead") {
                        selectedCat = this.allUnits[i];
                        break;
                    }
                }
                if (selectedCat != null) {
                    this.physics.moveToObject(this.currentEnemy, selectedCat, 500 * (2 - (this.currentCat.unitInformation.WT * 0.1)));
                    this.enemyMovePhase = true;
                } else {
                    this.announcementText.setText(this.currentEnemy.unitInformation.name + " skips its turn!");
                    this.sleep(3000).then(() => {
                        this.enemyPhase = false;
                        this.nextTurn();
                    });
                }
                break;
            case "seeker":
                for (var i = 0; i < this.allUnits.length; i++) {
                    if (this.allUnits[i].unitInformation.type == "cat" && this.ManhattanDistance(this.allUnits[i].x, this.allUnits[i].y, this.currentEnemy.x, this.currentEnemy.y) <= 900 &&
                        this.allUnits[i].unitInformation.status.name != "dead") {
                        selectedCat = this.allUnits[i];
                        break;
                    }
                }
                if (selectedCat != null) {
                    this.physics.moveToObject(this.currentEnemy, selectedCat, 500 * (2 - (this.currentCat.unitInformation.WT * 0.1)));
                    this.enemyMovePhase = true;
                } else {
                    this.physics.moveTo(this.currentEnemy, Math.floor(Math.random() * 1500), Math.floor(Math.random() * 1500), 500 * (2 - (this.currentCat.unitInformation.WT * 0.1)));
                    this.enemyMovePhase = true;
                }
                break;

            case "normalSkill":
                for (var i = 0; i < this.allUnits.length; i++) {
                    if (this.allUnits[i].unitInformation.type == "cat" && this.ManhattanDistance(this.allUnits[i].x, this.allUnits[i].y, this.currentEnemy.x, this.currentEnemy.y) <= 1250 &&
                        this.allUnits[i].unitInformation.status.name != "dead") {
                        selectedCat = this.allUnits[i];
                        break;
                    }
                }
                if (selectedCat != null) {
                    this.physics.moveToObject(this.currentEnemy, selectedCat, 500 * (2 - (this.currentCat.unitInformation.WT * 0.1)));
                    this.enemyMovePhase = true;
                } else {
                    this.enemyMovePhase = false;
                    this.enemySkillPhase = true;
                    this.enemyUseSkill();
                }
                break;

            case "immovable":
                this.announcementText.setText(this.currentEnemy.unitInformation.name + " stays still...");
                this.sleep(3000).then(() => {
                    this.enemyPhase = false;
                    this.nextTurn();
                });
                break;

            case "immovableSkill":
                this.enemyMovePhase = false;
                this.enemySkillPhase = true;
                this.enemyUseSkill();
                break;



        }




    },

    enemyUseSkill: function () {
        console.log("enemy used skill");
        switch (this.currentEnemy.unitInformation.AIType) {
            case "normal":
            case "seeker":
                //then we don't use a skill
                this.enemySkillPhase = false;
                this.announcementText.setText(this.currentEnemy.unitInformation.name + " skips its turn!");
                this.sleep(3000).then(() => {
                    this.enemyPhase = false;
                    this.nextTurn();
                });
                break;
            case "normalSkill":
            case "escapeSkill":
            case "immovableSkill":
                this.enemySkillPhase = false;
                this.announcementText.setText(this.currentEnemy.unitInformation.name + " used '" + this.currentEnemy.unitInformation.skill[0].name + "'!");
                switch (this.currentEnemy.unitInformation.skill[0].name) {
                    case "Recover":
                        this.currentEnemy.unitInformation.HP += Math.floor(this.currentEnemy.unitInformation.maxHP * 0.25);
                        if (this.currentEnemy.unitInformation.HP > this.currentEnemy.unitInformation.maxHP) {
                            this.currentEnemy.unitInformation.HP = this.currentEnemy.unitInformation.maxHP;
                        } else {
                            if (this.sideMenuText.text.includes(this.currentEnemy.unitInformation.name)) {
                                this.healthBar.increase(Math.floor(this.currentEnemy.unitInformation.maxHP * 0.25));
                                this.resetText(this.currentEnemy);
                            }
                        }
                        this.currentEnemy.healText.setText("+" + Math.floor(this.currentEnemy.unitInformation.maxHP * 0.25));
                        this.currentEnemy.healText.visible = true;
                        this.sleep(1000).then(() => {
                            this.currentEnemy.healText.visible = false;
                        });
                        break;
                }
                this.sleep(3000).then(() => {
                    this.enemyPhase = false;
                    this.nextTurn();
                });
                break;
        }

    },

    useSkill: function () {
        console.log("used skill");
        if (this.currentCat.unitInformation.skill.energyCost <= this.currentCat.unitInformation.energy) {
            this.buttonLock = true;
            this.skipTurnButton.visible = false;
            this.useSkillButton.visible = false;
            this.announcementText.setText(this.currentCat.unitInformation.name + " used '" + this.currentCat.unitInformation.skill.name + "'!");
            this.currentCat.unitInformation.energy -= this.currentCat.unitInformation.skill.energyCost;

            switch (this.currentCat.unitInformation.skill.name) {
                case "Sniping Tactics":
                    if (this.currentCat.unitInformation.lastTarget != null) {
                        this.dealEffectDamage(this.currentCat, this.currentCat.unitInformation.lastTarget, 20);
                    }
                    break;
                case "It's a real chainsaw!":
                    this.currentCat.unitInformation.status = new Status("Rage", "Increases normal attack damage delt to opponents by 50%", 2);
                    this.resetText(this.currentCat);
                    break;
                case "Some catfood for you!":
                    for (var i = 0; i < this.allUnits.length; i++) {
                        if (this.allUnits[i].unitInformation.type == "cat") {
                            this.allUnits[i].unitInformation.HP += Math.floor(this.allUnits[i].unitInformation.maxHP * 0.2);
                            if (this.allUnits[i].unitInformation.HP > this.allUnits[i].unitInformation.maxHP) {
                                this.allUnits[i].unitInformation.HP = this.allUnits[i].unitInformation.maxHP;
                            } else {
                                if (this.sideMenuText.text.includes(this.allUnits[i].unitInformation.name)) {
                                    this.healthBar.increase(Math.floor(this.allUnits[i].unitInformation.maxHP * 0.2));
                                    this.resetText(this.allUnits[i]);
                                }
                            }
                            this.allUnits[i].healText.setText("+" + Math.floor(this.allUnits[i].unitInformation.maxHP * 0.2));
                            this.allUnits[i].healText.visible = true;
                        }
                    }
                    this.sleep(1000).then(() => {
                        for (var i = 0; i < this.allUnits.length; i++) {
                            this.allUnits[i].healText.visible = false;
                        }
                    });
                    break;
                case "Toxic Chemicals":
                    if (this.currentCat.unitInformation.lastTarget != null) {
                        this.currentCat.unitInformation.lastTarget.unitInformation.status = new Status("Poisoned", "Depletes 3% of the user's max HP each turn.", 3);
                        this.resetText(this.currentCat.unitInformation.lastTarget);
                    };
                    break;
                case "Immovable Rock":
                    this.currentCat.unitInformation.status = new Status("Iron Wall", "Any physical/effect (excluding status effects) damage delt to unit is decreased by 50%", 5);
                    this.currentCat.unitInformation.HP += Math.floor(this.currentCat.unitInformation.maxHP * 0.5);
                    if (this.currentCat.unitInformation.HP > this.currentCat.unitInformation.maxHP) {
                        this.currentCat.unitInformation.HP = this.currentCat.unitInformation.maxHP;
                    } else {
                        if (this.sideMenuText.text.includes(this.currentCat.unitInformation.name)) {
                            this.healthBar.increase(Math.floor(this.currentCat.unitInformation.maxHP * 0.5));
                            this.resetText(this.currentCat);
                        }
                    }
                    this.currentCat.healText.setText("+" + Math.floor(this.currentCat.unitInformation.maxHP * 0.5));
                    this.currentCat.healText.visible = true;
                    this.sleep(1000).then(() => {
                        this.currentCat.healText.visible = false;
                    });
                    break;
                case "Home Sweet Home":
                    this.currentCat.unitInformation.status = new Status("Iron Wall", "Any physical/effect (excluding status effects) damage delt to unit is decreased by 50%", 1);
                    this.currentCat.unitInformation.HP += Math.floor(this.currentCat.unitInformation.maxHP * 0.25);
                    if (this.currentCat.unitInformation.HP > this.currentCat.unitInformation.maxHP) {
                        this.currentCat.unitInformation.HP = this.currentCat.unitInformation.maxHP;
                    } else {
                        if (this.sideMenuText.text.includes(this.currentCat.unitInformation.name)) {
                            this.healthBar.increase(Math.floor(this.currentCat.unitInformation.maxHP * 0.25));
                            this.resetText(this.currentCat);
                        }
                    }
                    this.currentCat.healText.setText("+" + Math.floor(this.currentCat.unitInformation.maxHP * 0.25));
                    this.currentCat.healText.visible = true;
                    this.sleep(1000).then(() => {
                        this.currentCat.healText.visible = false;
                    });
                    break;
                case "Tax Evasion":
                    //increase the catfood, not yet set. 
                    break;
                case "Piercing Sword":
                    this.currentCat.unitInformation.status = new Status("Rage", "Increases normal attack damage delt to opponents by 50%", 2);
                    this.resetText(this.currentCat);
                    break;
                case "Bullet Hell":
                    var numberOfCats = 0;
                    for (var i = 0; i < this.allUnits.length; i++) {
                        if (this.allUnits[i].unitInformation.type == "cat" && this.ManhattanDistance(this.allUnits[i].x, this.allUnits[i].y, this.currentCat.x, this.currentCat.y) <= 500) {
                            numberOfCats++;
                        }
                    }
                    for (var i = 0; i < this.allUnits.length; i++) {
                        if (this.allUnits[i].unitInformation.type == "enemy" && this.ManhattanDistance(this.allUnits[i].x, this.allUnits[i].y, this.currentCat.x, this.currentCat.y) <= 500) {
                            this.dealEffectDamage(this.currentCat, this.allUnits[i], Math.floor(this.currentCat.unitInformation.ATK * (numberOfCats * 1.21)));
                        }
                    };
                    break;
                case "Celestial Providence":
                    this.index--;
                    break;
                case "Building up Stamina":
                    this.index--;
                    break;
                case "Dark Summoning Arts":
                    for (var i = 0; i < this.allUnits.length; i++) {
                        if (this.allUnits[i].unitInformation.type == "cat" && this.ManhattanDistance(this.allUnits[i].x, this.allUnits[i].y, this.currentCat.x, this.currentCat.y) <= 800) {
                            this.allUnits[i].unitInformation.energy += 5;
                        }
                    }
                    break;
                case "Have some Courage!":
                    var numberOfCats = -1;
                    for (var i = 0; i < this.allUnits.length; i++) {
                        if (this.allUnits[i].unitInformation.type == "cat" && this.ManhattanDistance(this.allUnits[i].x, this.allUnits[i].y, this.currentCat.x, this.currentCat.y) <= 500) {
                            numberOfCats++;
                        }
                    }
                    if (this.currentCat.unitInformation.lastTarget != null) {
                        if (numberOfCats < 2) {
                            this.dealEffectDamage(this.currentCat, this.currentCat.unitInformation.lastTarget, Math.floor(this.currentCat.unitInformation.lastTarget.unitInformation.HP * 0.18));
                        } else if (numberOfCats >= 2) {
                            this.dealEffectDamage(this.currentCat, this.currentCat.unitInformation.lastTarget, Math.floor(this.currentCat.unitInformation.lastTarget.unitInformation.HP * 0.3));
                        }
                    }
                    break;
                case "All You Can Eat":
                    for (var i = 0; i < this.allUnits.length; i++) {
                        if (this.allUnits[i].unitInformation.type == "cat" && this.ManhattanDistance(this.allUnits[i].x, this.allUnits[i].y, this.currentCat.x, this.currentCat.y) <= 500 &&
                            this.allUnits[i].unitInformation.name != "Sushi Master Cat") {
                            this.allUnits[i].unitInformation.status = new Status("Satisfied", "A satisfied Cat.", 1);
                            this.resetText(this.allUnits[i]);

                            var difference = this.allUnits[i].unitInformation.maxHP - this.allUnits[i].unitInformation.HP;
                            this.allUnits[i].unitInformation.HP += difference;
                            if (this.allUnits[i].unitInformation.HP > this.allUnits[i].unitInformation.maxHP) {
                                this.allUnits[i].unitInformation.HP = this.allUnits[i].unitInformation.maxHP;
                            } else {
                                if (this.sideMenuText.text.includes(this.allUnits[i].unitInformation.name)) {
                                    this.healthBar.increase(difference);
                                    this.resetText(this.allUnits[i]);
                                }
                            }
                            this.allUnits[i].healText.setText("+" + 9999);
                            this.allUnits[i].healText.visible = true;
                        };
                    };
                    this.sleep(1000).then(() => {
                        for (var i = 0; i < this.allUnits.length; i++) {
                            this.allUnits[i].healText.visible = false;
                        }
                    });
                    break;
                case "Catch of the day?":
                    for (var i = 0; i < this.allUnits.length; i++) {
                        if (this.allUnits[i].unitInformation.type == "cat" && this.ManhattanDistance(this.allUnits[i].x, this.allUnits[i].y, this.currentCat.x, this.currentCat.y) <= 500 &&
                            this.allUnits[i].unitInformation.name != "Fishing Cat") {

                            this.allUnits[i].unitInformation.HP += Math.floor(this.currentCat.unitInformation.ATK * 0.5);
                            if (this.allUnits[i].unitInformation.HP > this.allUnits[i].unitInformation.maxHP) {
                                this.allUnits[i].unitInformation.HP = this.allUnits[i].unitInformation.maxHP;
                            } else {
                                if (this.sideMenuText.text.includes(this.allUnits[i].unitInformation.name)) {
                                    this.healthBar.increase(difference);
                                    this.resetText(this.allUnits[i]);
                                }
                            }
                            this.allUnits[i].healText.setText("+" + Math.floor(this.currentCat.unitInformation.ATK * 0.5));
                            this.allUnits[i].healText.visible = true;
                        };
                    };
                    this.sleep(1000).then(() => {
                        for (var i = 0; i < this.allUnits.length; i++) {
                            this.allUnits[i].healText.visible = false;
                        }
                    });
                    break;
            }
        } else {
            this.buttonLock = true;
            this.skipTurnButton.visible = false;
            this.useSkillButton.visible = false;
            this.announcementText.setText("Not enough energy to use skill!");
        }

        this.sleep(3000).then(() => {
            this.skillPhase = false;
            this.buttonLock = false;
            this.nextTurn();
        });
    },

    skipTurn: function () {
        console.log("turn skipped");
        this.buttonLock = true;
        this.skipTurnButton.visible = false;
        this.useSkillButton.visible = false;
        this.announcementText.setText(this.currentCat.unitInformation.name + " skips its turn!");
        this.sleep(3000).then(() => {
            this.skillPhase = false;
            this.buttonLock = false;
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
            this.endBattle();
        }

    },

    checkEndBattleVictory: function () {
        if (this.bossStage === false) {
            var deathCounter = 0;
            for (var i = 0; i < this.allUnits.length; i++) {
                if (this.allUnits[i].unitInformation.HP <= 0 && this.allUnits[i].unitInformation.type === "enemy") {
                    deathCounter++;
                }
            }
            if (deathCounter === this.enemyCount) {
                this.endBattleVictory();
            }

        } else if (this.bossStage === true) {
            if (this.boss.unitInformation.HP <= 0) {
                this.endBattleVictory();
            }
        }

    },

    endBattle: function () {
        console.log("battle ends");
        this.catParty.resetCats();
    },

    endBattleVictory: function () {
        this.victory = true;
        this.catParty.resetCats();
        this.announcementText.setText("Victory!!");
        if (this.currentLevel == 0) {
            this.catParty.currentTeam = [];
            this.catParty.tutorialCompleted = true;
        }
        this.sleep(5000).then(() => {
            this.scene.start('BootScene', {
                "catParty": this.catParty
            })
        });
    },

    sleep: function (ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    update: function (time, delta) {
        this.controls.update(delta);
        // //some core logic goes in here, requires to be updated frame by frame such as cameras
        for (var i = 0; i < this.allUnits.length; i++) {
            this.allUnits[i].damageText.x = this.allUnits[i].body.position.x + 40;
            this.allUnits[i].damageText.y = this.allUnits[i].body.position.y - 20;
            this.allUnits[i].healText.x = this.allUnits[i].body.position.x + 40;
            this.allUnits[i].healText.y = this.allUnits[i].body.position.y - 20;
        }

        if (this.victory == false && this.defeat == false && this.movePhase == true && (Math.abs(Math.floor(this.currentCat.body.velocity.x)) < 1) && (Math.abs(Math.floor(this.currentCat.body.velocity.y)) < 1)) {
            console.log("its now zero");
            this.announcementText.setText(this.currentCat.unitInformation.name + " 's skill is ready");
            this.movePhase = false;
            this.skillPhase = true;
            for (var i = 0; i < this.allUnits.length; i++) {
                this.allUnits[i].unitInformation.isHit = false;
            }
        }

        if (this.victory == false && this.defeat == false && this.enemyMovePhase == true && (Math.abs(Math.floor(this.currentEnemy.body.velocity.x)) < 1) && (Math.abs(Math.floor(this.currentEnemy.body.velocity.y)) < 1)) {
            console.log("enemy now slowed down to 0");
            this.enemyMovePhase = false;
            this.enemySkillPhase = true;
            this.enemyUseSkill();
            for (var i = 0; i < this.allUnits.length; i++) {
                this.allUnits[i].unitInformation.isHit = false;
            }
        }

        if (this.movePhase == true || this.skillPhase == true || this.enemyMovePhase == true) {
            this.graphics.clear();
        }

        if (this.skillPhase == true && this.buttonLock == false) {
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
        //tempEnemy.setCollideWorldBounds(true);
        tempEnemy.setBounce(0.5);
        tempEnemy.setInteractive();
        tempEnemy.setMass(enemyInformation.WT)
        tempEnemy.setDrag(100);
        tempEnemy.unitInformation = enemyInformation;
        this.physics.add.collider(tempEnemy, this.blockedLayer);
        //this.physics.add.collider(tempEnemy, this.topMenu);
        tempEnemy.on('pointerover', () => {
            console.log(tempEnemy.unitInformation);
            this.healthBar.bar.visible = true;
            this.healthBar.draw2(tempEnemy.unitInformation.HP, tempEnemy.unitInformation.maxHP);
            this.sideMenuText.setText(tempEnemy.unitInformation.name + "\n" + "\n" +
                "Element: " + tempEnemy.unitInformation.element + "\n" + "\n" +
                "Level: " + tempEnemy.unitInformation.level + "\n" + "\n" +
                "EXP: MAX" + "\n" + "\n" +
                "HP: " + tempEnemy.unitInformation.HP + "/" + tempEnemy.unitInformation.maxHP + "\n" + "\n" + "\n" +
                //"Description: " + tempEnemy.unitInformation.description + "\n" + "\n" + "\n" +"\n" +"\n" +"\n" +
                //"Skill: " + tempEnemy.unitInformation.skill.name + "\n" + "\n" + tempEnemy.unitInformation.skill.description + "\n" + "\n" + "\n" + "\n" + "\n" + "Energy Cost: " + tempEnemy.unitInformation.skill.energyCost + "\n" + "\n" +
                "Attack: " + tempEnemy.unitInformation.ATK + "\n" + "\n" +
                "Defense: " + tempEnemy.unitInformation.DEF + "\n" + "\n" +
                "Weight: " + tempEnemy.unitInformation.WT + "\n" + "\n" +
                "Status: " + tempEnemy.unitInformation.status.name + "\n" + "\n" + tempEnemy.unitInformation.status.description + "\n" + "\n" + "Turns Left: " + tempEnemy.unitInformation.status.numberOfTurns);
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
        });
        tempEnemy.damageText.visible = false;

        tempEnemy.healText = this.add.text(500, 50, "234", {
            color: "#00FF00",
            align: "center",
            fontWeight: 'bold',
            font: '32px Arial',
            wordWrap: {
                width: 1000,
                useAdvancedWrap: true
            }
        });
        tempEnemy.healText.visible = false;
        this.allUnits.push(tempEnemy);
    },

    wallCollision: function () {
        //console.log(this.currentCat.body.velocity);
    },


    spawnCats: function (x, y) {
        for (var i = 0; i < this.catParty.currentTeam.length; i++) {
            if (i === 0) {
                var tempCat0 = this.physics.add.image(x + i * 200, y, this.catParty.currentTeam[i].photoCircle);
                tempCat0.setCircle(64);
                //tempCat0.setCollideWorldBounds(true);
                tempCat0.setBounce(0.5);
                tempCat0.setInteractive();
                tempCat0.setMass(this.catParty.currentTeam[i].WT)
                tempCat0.setDrag(100);
                tempCat0.unitInformation = this.catParty.currentTeam[i];
                this.physics.add.collider(tempCat0, this.blockedLayer, this.wallCollision, false, this);
                //this.physics.add.collider(tempCat0, this.topMenu);
                tempCat0.on('pointerover', () => {
                    console.log(tempCat0.unitInformation);
                    this.healthBar.bar.visible = true;
                    this.healthBar.draw2(tempCat0.unitInformation.HP, tempCat0.unitInformation.maxHP);
                    this.sideMenuText.setText(tempCat0.unitInformation.name + "\n" + "\n" +
                        "Element: " + tempCat0.unitInformation.element + "\n" + "\n" +
                        "Level: " + tempCat0.unitInformation.level + "\n" + "\n" +
                        "EXP: " + tempCat0.unitInformation.exp + "\n" + "\n" +
                        "HP: " + tempCat0.unitInformation.HP + "/" + tempCat0.unitInformation.maxHP + "\n" + "\n" + "\n" +
                        //"Description: " + tempEnemy.unitInformation.description + "\n" + "\n" + "\n" +"\n" +"\n" +"\n" +
                        "Skill: " + tempCat0.unitInformation.skill.name + "\n" + "\n" + tempCat0.unitInformation.skill.description + "\n" + "\n" + "\n" + "\n" + "\n" + "Energy Cost: " + tempCat0.unitInformation.skill.energyCost + "\n" + "\n" +
                        "Attack: " + tempCat0.unitInformation.ATK + "\n" + "\n" +
                        "Defense: " + tempCat0.unitInformation.DEF + "\n" + "\n" +
                        "Weight: " + tempCat0.unitInformation.WT + "\n" + "\n" +
                        "Status: " + tempCat0.unitInformation.status.name + "\n" + "\n" + tempCat0.unitInformation.status.description + "\n" + "\n" + "Turns Left: " + tempCat0.unitInformation.status.numberOfTurns + "\n" + "\n" +
                        "Enhance Level: " + tempCat0.unitInformation.enhanced + "\n" + "\n" +
                        "Energy: " + tempCat0.unitInformation.energy)
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
                });
                tempCat0.damageText.visible = false;

                tempCat0.healText = this.add.text(500, 50, "234", {
                    color: "#00FF00",
                    align: "center",
                    fontWeight: 'bold',
                    font: '32px Arial',
                    wordWrap: {
                        width: 1000,
                        useAdvancedWrap: true
                    }
                });
                tempCat0.healText.visible = false;
                this.allUnits.push(tempCat0);
                this.currentTeam.push(tempCat0);
            }
            if (i === 1) {
                var tempCat1 = this.physics.add.image(x + i * 200, y, this.catParty.currentTeam[i].photoCircle);
                tempCat1.setCircle(64);
                //tempCat1.setCollideWorldBounds(true);
                tempCat1.setBounce(0.5);
                tempCat1.setInteractive();
                tempCat1.setMass(this.catParty.currentTeam[i].WT);
                tempCat1.setDrag(100);
                tempCat1.unitInformation = this.catParty.currentTeam[i];
                this.physics.add.collider(tempCat1, this.blockedLayer, this.wallCollision, false, this);
                //this.physics.add.collider(tempCat1, this.topMenu);
                tempCat1.on('pointerover', () => {
                    console.log(tempCat1.unitInformation);
                    this.healthBar.bar.visible = true;
                    this.healthBar.draw2(tempCat1.unitInformation.HP, tempCat1.unitInformation.maxHP);
                    this.sideMenuText.setText(tempCat1.unitInformation.name + "\n" + "\n" +
                        "Element: " + tempCat1.unitInformation.element + "\n" + "\n" +
                        "Level: " + tempCat1.unitInformation.level + "\n" + "\n" +
                        "EXP: " + tempCat1.unitInformation.exp + "\n" + "\n" +
                        "HP: " + tempCat1.unitInformation.HP + "/" + tempCat1.unitInformation.maxHP + "\n" + "\n" + "\n" +
                        //"Description: " + tempEnemy.unitInformation.description + "\n" + "\n" + "\n" +"\n" +"\n" +"\n" +
                        "Skill: " + tempCat1.unitInformation.skill.name + "\n" + "\n" + tempCat1.unitInformation.skill.description + "\n" + "\n" + "\n" + "\n" + "\n" + "Energy Cost: " + tempCat1.unitInformation.skill.energyCost + "\n" + "\n" +
                        "Attack: " + tempCat1.unitInformation.ATK + "\n" + "\n" +
                        "Defense: " + tempCat1.unitInformation.DEF + "\n" + "\n" +
                        "Weight: " + tempCat1.unitInformation.WT + "\n" + "\n" +
                        "Status: " + tempCat1.unitInformation.status.name + "\n" + "\n" + tempCat1.unitInformation.status.description + "\n" + "\n" + "Turns Left: " + tempCat1.unitInformation.status.numberOfTurns + "\n" + "\n" +
                        "Enhance Level: " + tempCat1.unitInformation.enhanced + "\n" + "\n" +
                        "Energy: " + tempCat1.unitInformation.energy)
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
                });
                tempCat1.damageText.visible = false;

                tempCat1.healText = this.add.text(500, 50, "234", {
                    color: "#00FF00",
                    align: "center",
                    fontWeight: 'bold',
                    font: '32px Arial',
                    wordWrap: {
                        width: 1000,
                        useAdvancedWrap: true
                    }
                });
                tempCat1.healText.visible = false;
                this.allUnits.push(tempCat1);
                this.currentTeam.push(tempCat1);
            }
            if (i === 2) {
                var tempCat2 = this.physics.add.image(x + i * 200, y, this.catParty.currentTeam[i].photoCircle);
                tempCat2.setCircle(64);
                //tempCat2.setCollideWorldBounds(true);
                tempCat2.setBounce(0.5);
                tempCat2.setInteractive();
                tempCat2.setMass(this.catParty.currentTeam[i].WT)
                tempCat2.unitInformation = this.catParty.currentTeam[i];
                tempCat2.setDrag(100);
                this.physics.add.collider(tempCat2, this.blockedLayer, this.wallCollision, false, this);
                //this.physics.add.collider(tempCat2, this.topMenu);
                tempCat2.on('pointerover', () => {
                    console.log(tempCat2.unitInformation);
                    this.healthBar.bar.visible = true;
                    this.healthBar.draw2(tempCat2.unitInformation.HP, tempCat2.unitInformation.maxHP);
                    this.sideMenuText.setText(tempCat2.unitInformation.name + "\n" + "\n" +
                        "Element: " + tempCat2.unitInformation.element + "\n" + "\n" +
                        "Level: " + tempCat2.unitInformation.level + "\n" + "\n" +
                        "EXP: " + tempCat2.unitInformation.exp + "\n" + "\n" +
                        "HP: " + tempCat2.unitInformation.HP + "/" + tempCat2.unitInformation.maxHP + "\n" + "\n" + "\n" +
                        //"Description: " + tempEnemy.unitInformation.description + "\n" + "\n" + "\n" +"\n" +"\n" +"\n" +
                        "Skill: " + tempCat2.unitInformation.skill.name + "\n" + "\n" + tempCat2.unitInformation.skill.description + "\n" + "\n" + "\n" + "\n" + "\n" + "Energy Cost: " + tempCat2.unitInformation.skill.energyCost + "\n" + "\n" +
                        "Attack: " + tempCat2.unitInformation.ATK + "\n" + "\n" +
                        "Defense: " + tempCat2.unitInformation.DEF + "\n" + "\n" +
                        "Weight: " + tempCat2.unitInformation.WT + "\n" + "\n" +
                        "Status: " + tempCat2.unitInformation.status.name + "\n" + "\n" + tempCat2.unitInformation.status.description + "\n" + "\n" + "Turns Left: " + tempCat2.unitInformation.status.numberOfTurns + "\n" + "\n" +
                        "Enhance Level: " + tempCat2.unitInformation.enhanced + "\n" + "\n" +
                        "Energy: " + tempCat2.unitInformation.energy)
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
                });
                tempCat2.damageText.visible = false;

                tempCat2.healText = this.add.text(500, 50, "234", {
                    color: "#00FF00",
                    align: "center",
                    fontWeight: 'bold',
                    font: '32px Arial',
                    wordWrap: {
                        width: 1000,
                        useAdvancedWrap: true
                    }
                });
                tempCat2.healText.visible = false;
                this.allUnits.push(tempCat2);
                this.currentTeam.push(tempCat2);
            }
            if (i === 3) {
                var tempCat3 = this.physics.add.image(x + i * 200, y, this.catParty.currentTeam[i].photoCircle);
                tempCat3.setCircle(64);
                //tempCat3.setCollideWorldBounds(true);
                tempCat3.setBounce(0.5);
                tempCat3.setInteractive();
                tempCat3.setMass(this.catParty.currentTeam[i].WT)
                tempCat3.unitInformation = this.catParty.currentTeam[i];
                tempCat3.setDrag(100);
                this.physics.add.collider(tempCat3, this.blockedLayer, this.wallCollision, false, this);
                //this.physics.add.collider(tempCat3, this.topMenu);
                tempCat3.on('pointerover', () => {
                    console.log(tempCat3.unitInformation);
                    this.healthBar.bar.visible = true;
                    this.healthBar.draw2(tempCat3.unitInformation.HP, tempCat3.unitInformation.maxHP);
                    this.sideMenuText.setText(tempCat3.unitInformation.name + "\n" + "\n" +
                        "Element: " + tempCat3.unitInformation.element + "\n" + "\n" +
                        "Level: " + tempCat3.unitInformation.level + "\n" + "\n" +
                        "EXP: " + tempCat3.unitInformation.exp + "\n" + "\n" +
                        "HP: " + tempCat3.unitInformation.HP + "/" + tempCat3.unitInformation.maxHP + "\n" + "\n" + "\n" +
                        //"Description: " + tempEnemy.unitInformation.description + "\n" + "\n" + "\n" +"\n" +"\n" +"\n" +
                        "Skill: " + tempCat3.unitInformation.skill.name + "\n" + "\n" + tempCat3.unitInformation.skill.description + "\n" + "\n" + "\n" + "\n" + "\n" + "Energy Cost: " + tempCat3.unitInformation.skill.energyCost + "\n" + "\n" +
                        "Attack: " + tempCat3.unitInformation.ATK + "\n" + "\n" +
                        "Defense: " + tempCat3.unitInformation.DEF + "\n" + "\n" +
                        "Weight: " + tempCat3.unitInformation.WT + "\n" + "\n" +
                        "Status: " + tempCat3.unitInformation.status.name + "\n" + "\n" + tempCat3.unitInformation.status.description + "\n" + "\n" + "Turns Left: " + tempCat3.unitInformation.status.numberOfTurns + "\n" + "\n" +
                        "Enhance Level: " + tempCat3.unitInformation.enhanced + "\n" + "\n" +
                        "Energy: " + tempCat3.unitInformation.energy)
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
                });
                tempCat3.damageText.visible = false;

                tempCat3.healText = this.add.text(500, 50, "234", {
                    color: "#00FF00",
                    align: "center",
                    fontWeight: 'bold',
                    font: '32px Arial',
                    wordWrap: {
                        width: 1000,
                        useAdvancedWrap: true
                    }
                });
                tempCat3.healText.visible = false;
                this.allUnits.push(tempCat3);
                this.currentTeam.push(tempCat3);
            }
        }
    }
});