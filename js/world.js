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
        console.log(this.currentLevel);
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

        this.sideTurnCounter = 0;

        //locks skill if victory
        this.victory = false;
        this.defeat = false;

        this.boxGenerated = false;
        this.buttonLock = false;
        this.turnCounter = 0;
        this.richCatMultiplier = 1;
        this.physics.world.setFPS(60);
    },

    preload: function () {
        this.apotheosis = this.sound.add('apotheosis', {loop: true, volume: 0.4});
        this.battleTheme = this.sound.add('battleTheme', {loop: true, volume: 0.2});
        //load based on the level
        if (this.currentLevel === 0) {
            this.load.tilemapTiledJSON('tutorial', 'assets/map/tutorial.json');
            this.bossStage = false;
            this.enemyCount = 1;
            this.battleTheme.play();
        } else if (this.currentLevel === 1) {
            this.load.tilemapTiledJSON('level1', 'assets/map/level1.json');
            this.bossStage = true;
            this.enemyCount = 9;
            this.battleTheme.play();
        } else if (this.currentLevel === 2) {
            this.load.tilemapTiledJSON('level2', 'assets/map/level2.json');
            this.bossStage = true;
            this.enemyCount = 12;
            this.battleTheme.play();
        } else if (this.currentLevel === 3) {
            this.load.tilemapTiledJSON('level3', 'assets/map/level3.json');
            this.bossStage = true;
            this.enemyCount = 5;
            this.battleTheme.play();
        } else if (this.currentLevel === 4) {
            this.load.tilemapTiledJSON('level4', 'assets/map/level4.json');
            this.bossStage = true;
            this.enemyCount = 20;
            this.battleTheme.play();
        } else if (this.currentLevel === 5) {
            this.load.tilemapTiledJSON('level5', 'assets/map/level5.json');
            this.bossStage = true;
            this.enemyCount = 10;
            this.battleTheme.play();
        } else if (this.currentLevel === 6) {
            this.load.tilemapTiledJSON('level6', 'assets/map/level6.json');
            this.bossStage = true;
            this.enemyCount = 10;
            this.battleTheme.play();
        } else if (this.currentLevel === 7) {
            this.load.tilemapTiledJSON('level7', 'assets/map/level7.json');
            this.bossStage = true;
            this.enemyCount = 10;
            this.apotheosis.play();
        } else if (this.currentLevel === "apotheosisChallenge") {
            this.load.tilemapTiledJSON('level7', 'assets/map/level7.json');
            this.bossStage = false;
            this.enemyCount = 7;
            this.apotheosis.play();
        } else if (this.currentLevel === "trainingArena") {
            this.load.tilemapTiledJSON('training', 'assets/map/training.json');
            this.bossStage = false;
            this.enemyCount = 12;
            this.battleTheme.play();
        }


    },

    create: function () {
        this.sleep(1000).then(() => {
            this.boxGenerated = true;
        });
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
            console.log(this.catParty);
            this.generateEnemyInfo("Warrior Dog", 5, "Anemo", "", [new EnemySkill("Recover", "recovers 25% of user's max HP"), new EnemySkill("Warning", "This skill does nothing.")],
            30, 15, 25, 5, "normalSkill", 1280, 1300, "warriorDogCircle");

            this.cameras.main.setBounds(0, 0, tutorial.widthInPixels, tutorial.heightInPixels);

            this.setup();
            console.log(this.catParty);
            this.setUnitCollisionAndLine();

            this.nextTurn();
        } else if (this.currentLevel === "trainingArena") {
            var training = this.make.tilemap({
                key: 'training'
            });
            var tiles = training.addTilesetImage('Mapset', 'tiles');
            this.traverseLayer = training.createStaticLayer('traverseLayer', tiles, 0, 0);
            this.blockedLayer = training.createStaticLayer('blockedLayer', tiles, 0, 0);
            this.blockedLayer.setCollisionByExclusion([-1]);
            this.cameras.main.roundPixels = true;

            //enemy spawns for this current level
            this.enemiesInfo = [];

            this.generateEnemyInfo("Training Dog", 36, "Terra", "", [new EnemySkill("Recover", "recovers 25% of user's max HP")], 18, 13, 12, 5, "normal", 1280 - 200, 300, "warriorDogCircle");
            this.generateEnemyInfo("Training Dog", 37, "Terra", "", [new EnemySkill("Recover", "recovers 25% of user's max HP")], 16, 16, 12, 5, "normal", 1280 - 400, 500, "sageDogCircle");
            this.generateEnemyInfo("Training Dog", 34, "Terra", "", [new EnemySkill("Recover", "recovers 25% of user's max HP")], 18, 12, 13, 5, "normal", 1280 - 600, 800, "spyDogCircle");
            this.generateEnemyInfo("Training Dog", 32, "Terra", "", [new EnemySkill("Recover", "recovers 25% of user's max HP")], 17, 18, 12, 5, "normal", 1280 - 800, 200, "stuffedDogCircle");
            this.generateEnemyInfo("Training Dog", 37, "Terra", "", [new EnemySkill("Recover", "recovers 25% of user's max HP")], 13, 13, 13, 5, "normal", 1280 + 200, 900, "restingDogCircle");
            this.generateEnemyInfo("Training Dog", 32, "Terra", "", [new EnemySkill("Recover", "recovers 25% of user's max HP")], 19, 14, 12, 5, "normal", 1280 + 400, 1800, "gangsterDogCircle");
            this.generateEnemyInfo("Training Dog", 34, "Terra", "", [new EnemySkill("Recover", "recovers 25% of user's max HP")], 19, 16, 13, 5, "normal", 1280 + 600, 1500, "warriorDogCircle");
            this.generateEnemyInfo("Training Dog", 34, "Terra", "", [new EnemySkill("Recover", "recovers 25% of user's max HP")], 19, 13, 13, 5, "normal", 1280 + 800, 1300, "restingDogCircle");
            this.generateEnemyInfo("Training Dog", 35, "Terra", "", [new EnemySkill("Recover", "recovers 25% of user's max HP")], 17, 18, 12, 5, "normal", 1280 + 300, 2800, "thiefDogCircle");
            this.generateEnemyInfo("Training Dog", 36, "Terra", "", [new EnemySkill("Recover", "recovers 25% of user's max HP")], 16, 19, 12, 5, "normal", 1280 + 600, 3200, "thiefDogCircle");
            this.generateEnemyInfo("Training Dog", 38, "Terra", "", [new EnemySkill("Recover", "recovers 25% of user's max HP")], 18, 14, 13, 5, "normal", 1280 - 300, 3100, "restingDogCircle");
            this.generateEnemyInfo("Training Dog", 32, "Terra", "", [new EnemySkill("Recover", "recovers 25% of user's max HP")], 17, 17, 12, 5, "normal", 1280 - 600, 2900, "gangsterDogCircle");

            this.cameras.main.setBounds(0, 0, training.widthInPixels, training.heightInPixels);

            this.setup();

            this.setUnitCollisionAndLine();

            this.nextTurn();
        } else if (this.currentLevel === "apotheosisChallenge") {
            var level7 = this.make.tilemap({
                key: 'level7'
            });
            var tiles = level7.addTilesetImage('Mapset', 'tiles');
            this.traverseLayer = level7.createStaticLayer('traverseLayer', tiles, 0, 0);
            this.blockedLayer = level7.createStaticLayer('blockedLayer', tiles, 0, 0);
            this.blockedLayer.setCollisionByExclusion([-1]);
            this.cameras.main.roundPixels = true;

            this.enemiesInfo = [];
            this.generateEnemyInfo("Incarnation of Melancholy", 50, "Light", "", [new EnemySkill("Endless Nightmare", "Reduces opponent's HP to 1.")
            ], 1550, 87, 106, 1, "normalSkill", 1280, 635, "oddGoatCircle");
            this.generateEnemyInfo("Incarnation of Malice", 50, "Dark", "", [new EnemySkill("Energy Drain", "Decreases all of opponent's energy counter by 1."),
                new EnemySkill("Odd Sludge", "Inflicts massive AOE damage to all opponents. All opponents poisoned.")
            ], 286, 77, 84, 5, "oddCat", 1280, 1175, "oddCatCircle");
            this.generateEnemyInfo("Incarnation of Wrath", 50, "Anemo", "", [new EnemySkill("Odd Storm", "Odd Bird can start its movephase again after the end of its turn."),
                new EnemySkill("Ominous Tempest", "Inflicts massive AOE damage to all opponents. Reduces their energy count by 1.")
            ], 250, 63, 56, 1, "oddBird", 1280 - 500, 1175, "oddBirdCircle");
            this.generateEnemyInfo("Incarnation of Pride", 50, "Terra", "", [new EnemySkill("Odd Storm", "Odd Bird can start its movephase again after the end of its turn."),
                new EnemySkill("Ominous Tempest", "Inflicts massive AOE damage to all opponents. Reduces their energy count by 1.")
            ], 259, 128, 66, 2, "normal", 1280 + 500, 1175, "oddSnakeCircle");
            this.generateEnemyInfo("Incarnation of Delusions", 50, "Light", "", [new EnemySkill("Odd Flame", "Deals 25% damage to enemies within 800 Range. Inflicts burn on targets."),
                new EnemySkill("Odd Waters", "Heals 25% of max HP to allies within 800 Range. Applies 'Calm Mind' to those allies.")
            ], 275, 73, 66, 3, "oddFox", 1280, 2535, "oddFoxCircle");
            this.generateEnemyInfo("Incarnation of Greed", 50, "Light", "", [new EnemySkill("Odd Flame", "Deals 25% damage to enemies within 800 Range. Inflicts burn on targets.")], 215, 79, 60, 1, "normalSkill", 1280 - 500, 3300, "oddRabbitCircle");
            this.generateEnemyInfo("Incarnation of Sloth", 50, "Aqua", "", [new EnemySkill("Odd Recovery", "recovers 25% of user's max HP")], 396, 68, 95, 7, "normalSkill", 1280 + 500, 3300, "oddAnteaterCircle");


            this.cameras.main.setBounds(0, 0, level7.widthInPixels, level7.heightInPixels);

            this.setup();
            this.setUnitCollisionAndLine();
            //identify the boss
            this.identifyBoss("Odd Ram");

            this.nextTurn();
        } else if (this.currentLevel === 1) {
            var level1 = this.make.tilemap({
                key: 'level1'
            });
            var tiles = level1.addTilesetImage('Mapset', 'tiles');
            this.traverseLayer = level1.createStaticLayer('traverseLayer', tiles, 0, 0);
            this.blockedLayer = level1.createStaticLayer('blockedLayer', tiles, 0, 0);
            this.blockedLayer.setCollisionByExclusion([-1]);
            this.cameras.main.roundPixels = true;

            //enemy spawns for this current level
            this.enemiesInfo = [];
            this.generateEnemyInfo("Odd Anteater", 10, "Aqua", "", [new EnemySkill("Recover", "recovers 25% of user's max HP")], 35, 15, 20, 7, "normalSkill", 1280, 356, "oddAnteaterCircle");
            this.generateEnemyInfo("Terra Warrior Dog", 8, "Terra", "", [new EnemySkill("Recover", "recovers 25% of user's max HP")], 19, 13, 15, 8, "normal", 1280, 1300, "warriorDogCircle");
            this.generateEnemyInfo("Anemo Warrior Dog", 8, "Anemo", "", [new EnemySkill("Recover", "recovers 25% of user's max HP")], 19, 14, 13, 2, "seeker", 896 - 128 - 128, 980, "warriorDogCircle");
            this.generateEnemyInfo("Aqua Warrior Dog", 8, "Aqua", "", [new EnemySkill("Recover", "recovers 25% of user's max HP")], 18, 12, 17, 5, "seeker", 1554 + 128 + 128 + 128, 980, "warriorDogCircle");
            this.generateEnemyInfo("Terra Warrior Dog", 5, "Terra", "", [new EnemySkill("Recover", "recovers 25% of user's max HP")], 15, 13, 17, 8, "normal", 896 - 128 - 128, 2200, "warriorDogCircle");
            this.generateEnemyInfo("Anemo Warrior Dog", 5, "Anemo", "", [new EnemySkill("Recover", "recovers 25% of user's max HP")], 13, 12, 13, 2, "normal", 1554 + 128 + 128 + 128, 2200, "warriorDogCircle");
            this.generateEnemyInfo("Spy Dog", 5, "Terra", "", [new EnemySkill("Recover", "recovers 25% of user's max HP")], 12, 9, 13, 3, "seeker", 1280, 3000, "spyDogCircle");
            this.generateEnemyInfo("Anemo Warrior Dog", 5, "Anemo", "", [new EnemySkill("Recover", "recovers 25% of user's max HP")], 12, 8, 10, 2, "normal", 896 - 128 - 128, 3800, "warriorDogCircle");
            this.generateEnemyInfo("Anemo Warrior Dog", 5, "Anemo", "", [new EnemySkill("Recover", "recovers 25% of user's max HP")], 13, 8, 10, 2, "normal", 1554 + 128 + 128 + 128, 3800, "warriorDogCircle");

            this.cameras.main.setBounds(0, 0, level1.widthInPixels, level1.heightInPixels);

            this.setup();

            this.setUnitCollisionAndLine();

            //identify the boss
            this.identifyBoss("Odd Anteater");

            console.log(this.boss.unitInformation);

            this.nextTurn();

        } else if (this.currentLevel === 2) {
            var level2 = this.make.tilemap({
                key: 'level2'
            });
            var tiles = level2.addTilesetImage('Mapset', 'tiles');
            this.traverseLayer = level2.createStaticLayer('traverseLayer', tiles, 0, 0);
            this.blockedLayer = level2.createStaticLayer('blockedLayer', tiles, 0, 0);
            this.blockedLayer.setCollisionByExclusion([-1]);
            this.cameras.main.roundPixels = true;

            this.enemiesInfo = [];
            this.generateEnemyInfo("Odd Rabbit", 12, "Light", "", [new EnemySkill("Odd Flame", "Deals 25% damage to enemies within 800 Range. Inflicts burn on targets.")], 56, 29, 18, 1, "normalSkill", 1280, 356, "oddRabbitCircle");
            this.generateEnemyInfo("Super Spy Dog", 7, "Dark", "", [new EnemySkill("Enraged", "Inflicts 'rage' status to self.")], 20, 15, 13, 3, "normalSkill", 1280 - 900, 4250, "spyDogCircle");
            this.generateEnemyInfo("Super Spy Dog", 7, "Dark", "", [new EnemySkill("Enraged", "Inflicts 'rage' status to self.")], 20, 15, 13, 3, "normalSkill", 1280 + 900, 4250, "spyDogCircle");
            this.generateEnemyInfo("Super Spy Dog", 7, "Dark", "", [new EnemySkill("Enraged", "Inflicts 'rage' status to self.")], 20, 15, 13, 3, "normalSkill", 1280 - 900, 4700, "spyDogCircle");
            this.generateEnemyInfo("Super Spy Dog", 7, "Dark", "", [new EnemySkill("Enraged", "Inflicts 'rage' status to self.")], 20, 15, 13, 3, "normalSkill", 1280 + 900, 4700, "spyDogCircle");
            this.generateEnemyInfo("Wise Dog", 10, "Light", "", [new EnemySkill("Wall of Healing", "recovers 25% HP for all allies nearby.")], 20, 3, 23, 3, "immovableSkill", 1280, 3100, "sageDogCircle");
            this.generateEnemyInfo("Strong Warrior Dog", 9, "Anemo", "", [], 18, 23, 11, 5, "normal", 1280, 4200, "warriorDogCircle");
            this.generateEnemyInfo("Tough Warrior Dog", 9, "Terra", "", [], 38, 13, 25, 5, "normal", 1280 - 800, 3100, "warriorDogCircle");
            this.generateEnemyInfo("Smart Warrior Dog", 9, "Aqua", "", [], 25, 23, 15, 5, "normal", 1280 + 800, 3100, "warriorDogCircle");
            this.generateEnemyInfo("Guard Dog", 9, "Terra", "", [], 25, 13, 15, 5, "normal", 1280 - 660, 2100, "warriorDogCircle");
            this.generateEnemyInfo("Guard Dog", 9, "Terra", "", [], 25, 13, 15, 5, "normal", 1280 + 660, 2100, "warriorDogCircle");

            this.generateEnemyInfo("Guard Dog", 9, "Terra", "", [], 25, 13, 15, 5, "normal", 1280 - 760, 1300, "warriorDogCircle");
            this.generateEnemyInfo("Guard Dog", 9, "Terra", "", [], 25, 13, 15, 5, "normal", 1280 + 760, 1300, "warriorDogCircle");

            this.generateEnemyInfo("Guard Dog", 9, "Terra", "", [], 25, 13, 15, 5, "normal", 1280 - 760, 800, "warriorDogCircle");
            this.generateEnemyInfo("Guard Dog", 9, "Terra", "", [], 25, 13, 15, 5, "normal", 1280 + 760, 800, "warriorDogCircle");


            this.cameras.main.setBounds(0, 0, level2.widthInPixels, level2.heightInPixels);

            this.setup();
            this.setUnitCollisionAndLine();
            //identify the boss
            this.identifyBoss("Odd Rabbit");

            console.log(this.boss.unitInformation);

            this.nextTurn();
        } else if (this.currentLevel === 3) {
            var level3 = this.make.tilemap({
                key: 'level3'
            });
            var tiles = level3.addTilesetImage('Mapset', 'tiles');
            this.traverseLayer = level3.createStaticLayer('traverseLayer', tiles, 0, 0);
            this.blockedLayer = level3.createStaticLayer('blockedLayer', tiles, 0, 0);
            this.blockedLayer.setCollisionByExclusion([-1]);
            this.cameras.main.roundPixels = true;

            this.enemiesInfo = [];
            this.generateEnemyInfo("Odd Fox", 18, "Light", "", [new EnemySkill("Odd Flame", "Deals 25% damage to enemies within 800 Range. Inflicts burn on targets."),
                new EnemySkill("Odd Waters", "Heals 25% of max HP to allies within 800 Range. Applies 'Calm Mind' to those allies.")
            ], 74, 23, 25, 3, "oddFox", 1280, 735, "oddFoxCircle");
            this.generateEnemyInfo("Sage Dog", 18, "Light", "", [new EnemySkill("Ruin", "Summons 'Warrior Dog'")], 22, 19, 29, 1, "immovableSkill", 1280 - 128, 250, "sageDogCircle");
            this.generateEnemyInfo("Wise Dog", 18, "Light", "", [new EnemySkill("Wall of Healing", "Summons 'Warrior Dog'")], 22, 19, 29, 1, "immovableSkill", 1280 + 128, 250, "sageDogCircle");
            this.generateEnemyInfo("Incarnation of Greed", 16, "Light", "", [new EnemySkill("Odd Flame", "Deals 25% damage to enemies within 800 Range. Inflicts burn on targets.")], 40, 29, 20, 1, "normalSkill", 1280 - 800, 1000, "oddRabbitCircle");
            this.generateEnemyInfo("Incarnation of Sloth", 16, "Aqua", "", [new EnemySkill("Recover", "recovers 25% of user's max HP")], 48, 20, 25, 7, "normalSkill", 1280 + 800, 1000, "oddAnteaterCircle");
            this.generateEnemyInfo("Stuffed Dog", 15, "Dark", "", [new EnemySkill("Recover"), "Heals 25% of unit's max HP."], 50, 8, 48, 10, "normalSkill", 1280 - 800, 1600, "stuffedDogCircle");
            this.generateEnemyInfo("Stuffed Dog", 15, "Dark", "", [new EnemySkill("Recover"), "Heals 25% of unit's max HP."], 50, 8, 48, 10, "normalSkill", 1280 + 800, 1600, "stuffedDogCircle");


            this.cameras.main.setBounds(0, 0, level3.widthInPixels, level3.heightInPixels);

            this.setup();
            this.setUnitCollisionAndLine();
            //identify the boss
            this.identifyBoss("Odd Fox");

            for (var i = 0; i < this.allUnits.length; i++) {
                if (this.allUnits[i].unitInformation.name == "Stuffed Dog") {
                    this.allUnits[i].unitInformation.status = new Status("backup", "waiting to be summoned", 1); //backup means to be summoned, count meant the turn it will be summoned
                    this.allUnits[i].setInteractive(false);
                    this.allUnits[i].setActive(false).setVisible(false);
                    this.allUnits[i].x = -9999;
                    this.allUnits[i].y = -9999;
                }
            }
            console.log(this.boss.unitInformation);

            this.nextTurn();

        } else if (this.currentLevel === 4) {
            var level4 = this.make.tilemap({
                key: 'level4'
            });
            var tiles = level4.addTilesetImage('Mapset', 'tiles');
            this.traverseLayer = level4.createStaticLayer('traverseLayer', tiles, 0, 0);
            this.blockedLayer = level4.createStaticLayer('blockedLayer', tiles, 0, 0);
            this.blockedLayer.setCollisionByExclusion([-1]);
            this.cameras.main.roundPixels = true;

            this.enemiesInfo = [];
            this.generateEnemyInfo("Odd Bird", 29, "Anemo", "", [new EnemySkill("Odd Storm", "Odd Bird can start its movephase again after the end of its turn."),
                new EnemySkill("Ominous Tempest", "Inflicts massive AOE damage to all opponents. Reduces their energy count by 1.")
            ], 136, 21, 29, 1, "oddBird", 1280, 635, "oddBirdCircle");
            this.generateEnemyInfo("Incarnation of Delusion", 23, "Light", "", [new EnemySkill("Odd Flame", "Deals 25% damage to enemies within 800 Range. Inflicts burn on targets."),
                new EnemySkill("Odd Waters", "Heals 25% of max HP to allies within 800 Range. Applies 'Calm Mind' to those allies.")
            ], 90, 43, 26, 3, "oddFox", 1280 - 500, 735, "oddFoxCircle");
            this.generateEnemyInfo("Incarnation of Delusion", 23, "Light", "", [new EnemySkill("Odd Flame", "Deals 25% damage to enemies within 800 Range. Inflicts burn on targets."),
                new EnemySkill("Odd Waters", "Heals 25% of max HP to allies within 800 Range. Applies 'Calm Mind' to those allies.")
            ], 90, 43, 26, 3, "oddFox", 1280 + 500, 735, "oddFoxCircle");
            this.generateEnemyInfo("Tank Dog", 21, "Terra", "", [new EnemySkill("Fire!!"), "Deals 5% of max HP as damage to the last target. Applies Burned status."], 40, 31, 28, 10, "normalSkill", 1280 - 400, 3735, "tankDogCircle");
            this.generateEnemyInfo("Tank Dog", 22, "Terra", "", [new EnemySkill("Fire!!"), "Deals 5% of max HP as damage to the last target. Applies Burned status."], 42, 32, 29, 10, "normalSkill", 1280 - 400 + 266, 3735, "tankDogCircle");
            this.generateEnemyInfo("Tank Dog", 23, "Terra", "", [new EnemySkill("Fire!!"), "Deals 5% of max HP as damage to the last target. Applies Burned status."], 44, 33, 30, 10, "normalSkill", 1280 - 400 + 266 + 266, 3735, "tankDogCircle");
            this.generateEnemyInfo("Tank Dog", 24, "Terra", "", [new EnemySkill("Fire!!"), "Deals 5% of max HP as damage to the last target. Applies Burned status."], 46, 34, 31, 10, "normalSkill", 1280 - 400 + 266 + 266 + 266, 3735, "tankDogCircle");
            this.generateEnemyInfo("Wise Dog", 25, "Light", "", [new EnemySkill("Wall of Healing", "Summons 'Warrior Dog'")], 49, 28, 19, 1, "immovableSkill", 1280 - 400 - 128 * 3, 4100, "sageDogCircle");
            this.generateEnemyInfo("Wise Dog", 25, "Light", "", [new EnemySkill("Wall of Healing", "Summons 'Warrior Dog'")], 49, 28, 19, 1, "immovableSkill", 1280 - 400 + 266 + 266 + 266 + 128 * 3, 4100, "sageDogCircle");
            this.generateEnemyInfo("Sleepy Dog", 28, "Terra", "", [new EnemySkill("Sleep...", "Refreshes all status changes for nearby enemies")], 15, 50, 16, 5, "immovableSkill", 1280, 2800, "restingDogCircle");
            this.generateEnemyInfo("Tank Dog", 21, "Terra", "", [new EnemySkill("Fire!!"), "Deals 5% of max HP as damage to the last target. Applies Burned status."], 40, 27, 28, 10, "normalSkill", 1280 - 400, 2435, "tankDogCircle");
            this.generateEnemyInfo("Tank Dog", 22, "Terra", "", [new EnemySkill("Fire!!"), "Deals 5% of max HP as damage to the last target. Applies Burned status."], 42, 28, 29, 10, "normalSkill", 1280 - 400 + 266, 2435, "tankDogCircle");
            this.generateEnemyInfo("Tank Dog", 23, "Terra", "", [new EnemySkill("Fire!!"), "Deals 5% of max HP as damage to the last target. Applies Burned status."], 44, 29, 30, 10, "normalSkill", 1280 - 400 + 266 + 266, 2435, "tankDogCircle");
            this.generateEnemyInfo("Tank Dog", 24, "Terra", "", [new EnemySkill("Fire!!"), "Deals 5% of max HP as damage to the last target. Applies Burned status."], 46, 30, 31, 10, "normalSkill", 1280 - 400 + 266 + 266 + 266, 2435, "tankDogCircle");
            this.generateEnemyInfo("Skilled Warrior Dog", 24, "Anemo", "", [], 54, 31, 27, 5, "seeker", 1280, 4200, "warriorDogCircle");
            this.generateEnemyInfo("Skilled Warrior Dog", 26, "Anemo", "", [], 54, 31, 27, 5, "seeker", 1280, 4200, "warriorDogCircle");

            this.cameras.main.setBounds(0, 0, level4.widthInPixels, level4.heightInPixels);

            this.setup();
            this.setUnitCollisionAndLine();
            //identify the boss
            this.identifyBoss("Odd Bird");

            for (var i = 0; i < this.allUnits.length; i++) {
                if (this.allUnits[i].unitInformation.name == "Skilled Warrior Dog") {
                    this.allUnits[i].unitInformation.status = new Status("backup", "waiting to be summoned", 1); //backup means to be summoned, count meant the turn it will be summoned
                    this.allUnits[i].setInteractive(false);
                    this.allUnits[i].setActive(false).setVisible(false);
                    this.allUnits[i].x = -9999;
                    this.allUnits[i].y = -9999;
                }
            }
            this.nextTurn();

        } else if (this.currentLevel == 5) {
            var level5 = this.make.tilemap({
                key: 'level5'
            });
            var tiles = level5.addTilesetImage('Mapset', 'tiles');
            this.traverseLayer = level5.createStaticLayer('traverseLayer', tiles, 0, 0);
            this.blockedLayer = level5.createStaticLayer('blockedLayer', tiles, 0, 0);
            this.blockedLayer.setCollisionByExclusion([-1]);
            this.cameras.main.roundPixels = true;

            this.enemiesInfo = [];
            this.generateEnemyInfo("Odd Snake", 34, "Terra", "", [new EnemySkill("Odd Storm", "Odd Bird can start its movephase again after the end of its turn."),
                new EnemySkill("Ominous Tempest", "Inflicts massive AOE damage to all opponents. Reduces their energy count by 1.")
            ], 109, 74, 36, 2, "normal", 1280, 635, "oddSnakeCircle");
            this.generateEnemyInfo("Thief Dog", 31, "Anemo", "", [], 54, 31, 24, 3, "normal", 1280 - 750, 4035, "thiefDogCircle");
            this.generateEnemyInfo("Thief Dog", 31, "Anemo", "", [], 54, 31, 24, 3, "normal", 1280 + 750, 4035, "thiefDogCircle");
            this.generateEnemyInfo("Thief Dog", 31, "Anemo", "", [], 54, 31, 24, 3, "normal", 1280 - 875, 2550, "thiefDogCircle");
            this.generateEnemyInfo("Thief Dog", 31, "Anemo", "", [], 54, 31, 24, 3, "normal", 1280 + 875, 2550, "thiefDogCircle");
            this.generateEnemyInfo("Gangster Dog", 32, "Dark", "", [], 74, 36, 25, 3, "normal", 1280 - 400, 3535, "gangsterDogCircle");
            this.generateEnemyInfo("Gangster Dog", 32, "Dark", "", [], 74, 36, 25, 3, "normal", 1280 + 400, 3535, "gangsterDogCircle");
            this.generateEnemyInfo("Gangster Dog", 32, "Dark", "", [], 74, 36, 25, 3, "normal", 1280 - 400, 2835, "gangsterDogCircle");
            this.generateEnemyInfo("Gangster Dog", 32, "Dark", "", [], 74, 36, 25, 3, "normal", 1280 + 400, 2835, "gangsterDogCircle");
            this.generateEnemyInfo("Gangster Dog", 32, "Dark", "", [], 74, 36, 25, 3, "normal", 1280 - 400, 2335, "gangsterDogCircle");
            this.generateEnemyInfo("Gangster Dog", 32, "Dark", "", [], 74, 36, 25, 3, "normal", 1280 + 400, 2335, "gangsterDogCircle");
            this.generateEnemyInfo("Gangster Dog", 33, "Dark", "", [], 77, 38, 26, 6, "normal", 1280 - 400, 4700, "gangsterDogCircle");
            this.generateEnemyInfo("Gangster Dog", 33, "Dark", "", [], 77, 38, 26, 6, "normal", 1280 + 400, 4700, "gangsterDogCircle");

            this.cameras.main.setBounds(0, 0, level5.widthInPixels, level5.heightInPixels);

            this.setup();
            this.setUnitCollisionAndLine();
            //identify the boss
            this.identifyBoss("Odd Snake");

            this.nextTurn();
        } else if (this.currentLevel == 6) {
            var level6 = this.make.tilemap({
                key: 'level6'
            });
            var tiles = level6.addTilesetImage('Mapset', 'tiles');
            this.traverseLayer = level6.createStaticLayer('traverseLayer', tiles, 0, 0);
            this.blockedLayer = level6.createStaticLayer('blockedLayer', tiles, 0, 0);
            this.blockedLayer.setCollisionByExclusion([-1]);
            this.cameras.main.roundPixels = true;

            this.enemiesInfo = [];
            this.generateEnemyInfo("Odd Cat", 37, "Dark", "", [new EnemySkill("Energy Drain", "Decreases all of opponent's energy counter by 1."),
                new EnemySkill("Odd Sludge", "Inflicts massive AOE damage to all opponents. All opponents poisoned.")
            ], 179, 58, 66, 5, "oddCat", 1280, 635, "oddCatCircle");
            this.generateEnemyInfo("Incarnation of Wrath", 35, "Anemo", "", [new EnemySkill("Odd Storm", "Odd Bird can start its movephase again after the end of its turn."),
                new EnemySkill("Ominous Tempest", "Inflicts massive AOE damage to all opponents. Reduces their energy count by 1.")
            ], 150, 35, 39, 1, "oddBird", 1280 - 600, 1175, "oddBirdCircle");
            this.generateEnemyInfo("Incarnation of Pride", 35, "Terra", "", [new EnemySkill("Odd Storm", "Odd Bird can start its movephase again after the end of its turn."),
                new EnemySkill("Ominous Tempest", "Inflicts massive AOE damage to all opponents. Reduces their energy count by 1.")
            ], 129, 77, 38, 2, "normal", 1280 + 600, 1175, "oddSnakeCircle");
            this.generateEnemyInfo("Sleepy Dog", 36, "Terra", "", [new EnemySkill("Sleep...", "Refreshes all status changes for nearby enemies")], 287, 50, 275, 5, "immovableSkill", 1280, 2800, "restingDogCircle");

            this.generateEnemyInfo("Sage Dog", 28, "Light", "", [new EnemySkill("Ruin", "Summons 'Warrior Dog'")], 52, 49, 79, 1, "immovableSkill", 1280 - 880, 1550, "sageDogCircle");
            this.generateEnemyInfo("Wise Dog", 28, "Light", "", [new EnemySkill("Wall of Healing", "Summons 'Warrior Dog'")], 52, 49, 79, 1, "immovableSkill", 1280 + 880, 1550, "sageDogCircle");
            this.generateEnemyInfo("Sage Dog", 28, "Light", "", [new EnemySkill("Ruin", "Summons 'Warrior Dog'")], 52, 49, 79, 1, "immovableSkill", 1280 - 780, 3050, "sageDogCircle");
            this.generateEnemyInfo("Wise Dog", 28, "Light", "", [new EnemySkill("Wall of Healing", "Summons 'Warrior Dog'")], 52, 49, 79, 1, "immovableSkill", 1280 + 780, 3050, "sageDogCircle");
            this.generateEnemyInfo("Sage Dog", 28, "Light", "", [new EnemySkill("Ruin", "Summons 'Warrior Dog'")], 52, 49, 79, 1, "immovableSkill", 1280 - 880, 4550, "sageDogCircle");
            this.generateEnemyInfo("Wise Dog", 28, "Light", "", [new EnemySkill("Wall of Healing", "Summons 'Warrior Dog'")], 52, 49, 79, 1, "immovableSkill", 1280 + 880, 4550, "sageDogCircle");

            this.cameras.main.setBounds(0, 0, level6.widthInPixels, level6.heightInPixels);

            this.setup();
            this.setUnitCollisionAndLine();
            //identify the boss
            this.identifyBoss("Odd Cat");

            this.nextTurn();
        } else if (this.currentLevel == 7) {
            var level7 = this.make.tilemap({
                key: 'level7'
            });
            var tiles = level7.addTilesetImage('Mapset', 'tiles');
            this.traverseLayer = level7.createStaticLayer('traverseLayer', tiles, 0, 0);
            this.blockedLayer = level7.createStaticLayer('blockedLayer', tiles, 0, 0);
            this.blockedLayer.setCollisionByExclusion([-1]);
            this.cameras.main.roundPixels = true;

            this.enemiesInfo = [];
            this.generateEnemyInfo("Odd Ram", 40, "Light", "", [new EnemySkill("Endless Nightmare", "Reduces opponent's HP to 1.")
            ], 550, 48, 86, 1, "normalSkill", 1280, 635, "oddGoatCircle");
            this.generateEnemyInfo("Incarnation of Melancholy", 39, "Light", "", [new EnemySkill("Endless Nightmare", "Reduces opponent's HP to 1.")
            ], 350, 42, 56, 1, "normalSkill", 1280 - 300, 935, "oddGoatCircle");
            this.generateEnemyInfo("Incarnation of Melancholy", 39, "Light", "", [new EnemySkill("Endless Nightmare", "Reduces opponent's HP to 1.")
            ], 350, 42, 56, 1, "normalSkill", 1280 + 300, 935, "oddGoatCircle");
            this.generateEnemyInfo("Incarnation of Malice", 37, "Dark", "", [new EnemySkill("Energy Drain", "Decreases all of opponent's energy counter by 1."),
                new EnemySkill("Odd Sludge", "Inflicts massive AOE damage to all opponents. All opponents poisoned.")
            ], 179, 58, 66, 5, "oddCat", 1280, 1175, "oddCatCircle");
            this.generateEnemyInfo("Incarnation of Wrath", 35, "Anemo", "", [new EnemySkill("Odd Storm", "Odd Bird can start its movephase again after the end of its turn."),
                new EnemySkill("Ominous Tempest", "Inflicts massive AOE damage to all opponents. Reduces their energy count by 1.")
            ], 150, 35, 39, 1, "oddBird", 1280 - 500, 1175, "oddBirdCircle");
            this.generateEnemyInfo("Incarnation of Wrath", 35, "Anemo", "", [new EnemySkill("Odd Storm", "Odd Bird can start its movephase again after the end of its turn."),
                new EnemySkill("Ominous Tempest", "Inflicts massive AOE damage to all opponents. Reduces their energy count by 1.")
            ], 150, 35, 39, 1, "oddBird", 1280 + 500, 1175, "oddBirdCircle");
            this.generateEnemyInfo("Commander Dog", 38, "Terra", "", [new EnemySkill("Fire!!"), "Deals 5% of max HP as damage to the last target. Applies Burned status."], 100, 51, 78, 10, "normalSkill", 1280, 3735, "tankDogCircle");
            this.generateEnemyInfo("Incarnation of Greed", 36, "Light", "", [new EnemySkill("Odd Flame", "Deals 25% damage to enemies within 800 Range. Inflicts burn on targets.")], 179, 59, 50, 1, "normalSkill", 1280 - 500, 3800, "oddRabbitCircle");
            this.generateEnemyInfo("Incarnation of Sloth", 36, "Aqua", "", [new EnemySkill("Recover", "recovers 25% of user's max HP")], 296, 48, 65, 7, "normalSkill", 1280 + 500, 3800, "oddAnteaterCircle");
            this.generateEnemyInfo("Flying Dog", 36, "Anemo", "", [], 79, 59, 50, 1, "normal", 1280 - 500, 3300, "flyingDogCircle");
            this.generateEnemyInfo("Flying Dog", 37, "Anemo", "", [], 96, 48, 65, 1, "normal", 1280 + 500, 3300, "flyingDogCircle");
            this.generateEnemyInfo("Flying Dog", 36, "Anemo", "", [], 79, 59, 50, 1, "normal", 1280 - 500, 2800, "flyingDogCircle");
            this.generateEnemyInfo("Flying Dog", 37, "Anemo", "", [], 96, 48, 65, 1, "normal", 1280 + 500, 2800, "flyingDogCircle");
            this.generateEnemyInfo("Flying Dog", 36, "Anemo", "", [], 79, 59, 50, 1, "normal", 1280 - 500, 2300, "flyingDogCircle");
            this.generateEnemyInfo("Flying Dog", 37, "Anemo", "", [], 96, 48, 65, 1, "normal", 1280 + 500, 2300, "flyingDogCircle");
            this.generateEnemyInfo("Flying Dog", 36, "Anemo", "", [], 79, 59, 50, 1, "normal", 1280 - 500, 1700, "flyingDogCircle");
            this.generateEnemyInfo("Flying Dog", 37, "Anemo", "", [], 96, 48, 65, 1, "normal", 1280 + 500, 1700, "flyingDogCircle");

            this.cameras.main.setBounds(0, 0, level7.widthInPixels, level7.heightInPixels);

            this.setup();
            this.setUnitCollisionAndLine();
            //identify the boss
            this.identifyBoss("Odd Ram");

            this.nextTurn();
        }
    },

    identifyBoss: function (unitName) {
        for (var i = 0; i < this.allUnits.length; i++) {
            if (this.allUnits[i].unitInformation.name == unitName) {
                this.boss = this.allUnits[i];
            }
        }
    },

    generateEnemyInfo: function (name, level, type, description, skillArray, HP, ATK, DEF, WT, AIType, spawnX, spawnY, image) {
        var enemyInformation = {
            info: new Enemy(name, level, type, description, skillArray, HP, ATK, DEF, WT, AIType),
            spawnX: spawnX,
            spawnY: spawnY,
            image: image
        }
        this.enemiesInfo.push(enemyInformation);
    },

    setup: function () {

        this.coinCollide = this.sound.add('coinCollide');
        this.buttonHover = this.sound.add('buttonHover');
        this.buttonClick = this.sound.add('buttonClick');

        console.log(this.currentLevel);

        if (this.currentLevel == "trainingArena") {
            this.spawnCats(920, 4500);
        }

        if (this.currentLevel == 0) {
            this.spawnCats(1280, 1580);
        }

        if (this.currentLevel == 1) {
            this.spawnCats(1180, 4500);
        }

        if (this.currentLevel == 2) {
            this.spawnCats(920, 4500);
        }

        if (this.currentLevel == 3) {
            this.spawnCats(920, 2500);
        }

        if (this.currentLevel == 4) {
            this.spawnCats(920, 4500);
        }

        if (this.currentLevel == 5 || this.currentLevel == 6 || this.currentLevel == 7 || this.currentLevel == "apotheosisChallenge") {
            this.spawnCats(990, 4500);
        }



        for (var i = 0; i < this.enemiesInfo.length; i++) {
            this.spawnEnemies(this.enemiesInfo[i].info, this.enemiesInfo[i].spawnX, this.enemiesInfo[i].spawnY, this.enemiesInfo[i].image);
        }

        this.enemiesInfo = []; //clear array for now

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
            acceleration: 0.10,
            drag: 0.003,
            maxSpeed: 1.5
        };

        this.controls = new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig);

        this.minimap = this.cameras.add(-125, -220, 400, 850).setZoom(0.1).setName('mini');
        this.minimap.scrollX = 500;
        this.minimap.scrollY = 500;
        this.minimap.ignore(this.announcementText);
        this.minimap.ignore(this.topMenu);
        this.minimap.ignore(this.sideMenu);
        this.minimap.ignore(this.sideMenuText);
        this.minimap.ignore(this.useSkillButton);
        this.minimap.ignore(this.skipTurnButton);
        for (var i = 0; i < this.catIcons.length; i++) {
            this.minimap.ignore(this.catIcons[i]);
        }
        this.minimap.visible = false;

        this.minimapON = false;

        this.minimapButton = this.physics.add.image(1200, 50, 'minimapButton').setInteractive();
        this.minimapButton.setScrollFactor(0);
        this.minimapButton.on("pointerover", () => {
            this.buttonHover.play();
            this.minimapButton.setTint("0xf2b3ff");
        });

        this.minimapButton.on("pointerout", () => {
            this.minimapButton.clearTint();
        });

        this.minimapButton.on('pointerdown', () => {
            if (this.minimapON == false) {
                this.minimap.visible = true;
                this.minimapON = true;
            } else {
                this.minimap.visible = false;
                this.minimapON = false;
            }
            this.buttonClick.play();
        })

        this.minimap.ignore(this.minimapButton);

        this.rectangle = this.physics.add.image(790, 482, 'rectangle').setInteractive();

        this.cameras.main.ignore(this.rectangle);

        this.quitButton = this.physics.add.image(1550, 20, 'quitButton').setInteractive();
        this.quitButton.setScrollFactor(0);
        this.quitButton.on('pointerover', () => {
            this.buttonHover.play();
            this.quitButton.setTint("0xf2b3ff");
        })
        this.quitButton.on('pointerout', () => {
            this.quitButton.clearTint();
        })
        this.quitButton.on('pointerdown', () => {
            this.buttonClick.play();
            this.endBattle();
        })

        this.minimap.ignore(this.quitButton);
        this.minimap.ignore(this.healthBar.bar);

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
        this.sleep(2000).then(() => {
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
                    this.sleep(3000).then(() => {
                        this.currentCat.healText.visible = false;
                    });
                }
            } else {
                console.log("gained exp!")
                this.currentCat.healText.visible = true;
                this.currentCat.healText.setText("EXP + " + expGain);
                this.sleep(3000).then(() => {
                    this.currentCat.healText.visible = false;
                });
                this.currentCat.unitInformation.exp += expGain;
            }
        }
    },

    unitCollision: function (unit1, unit2) {
        if (unit1.unitInformation.status.name != "dead" && unit2.unitInformation.status.name != "dead" && unit1.unitInformation.status.name != "backup" && unit2.unitInformation.status.name != "backup") {
            this.coinCollide.play();
        }
        if (unit1.unitInformation.type === unit2.unitInformation.type) {
            return; //nothing happens 
        } else {
            //we do calculations here for damage delt 
            if (this.movePhase === true) {
                //if the player is moving, player deals dmg to enemy 
                if (unit1.unitInformation.type === "cat" && unit2.unitInformation.isHit == false && unit2.unitInformation.status.name != "dead") {
                    unit2.unitInformation.isHit = true;
                    var damage = this.calculateDamage(unit1.unitInformation.ATK, unit2.unitInformation.DEF, unit1.body.velocity.x, unit1.body.velocity.y, unit2.body.velocity.x, unit2.body.velocity.y);
                    damage = this.calculateStatusAndElementalDamage(unit1, unit2, damage);
                    this.gainExp(this.damageDealingInteractions(unit2, damage), unit2.unitInformation.level);
                    unit1.unitInformation.lastTarget = unit2;

                } else if (unit2.unitInformation.type === "cat" && unit1.unitInformation.isHit == false && unit1.unitInformation.status.name != "dead") {
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
                if (unit1.unitInformation.type === "enemy" && unit2.unitInformation.isHit == false && unit2.unitInformation.status.name != "dead") {
                    unit2.unitInformation.isHit = true;
                    var damage = this.calculateDamage(unit1.unitInformation.ATK, unit2.unitInformation.DEF, unit1.body.velocity.x, unit1.body.velocity.y, unit2.body.velocity.x, unit2.body.velocity.y);
                    damage = this.calculateStatusAndElementalDamage(unit1, unit2, damage);
                    this.damageDealingInteractions(unit2, damage);
                    unit1.unitInformation.lastTarget = unit2;

                } else if (unit2.unitInformation.type === "enemy" && unit1.unitInformation.isHit == false && unit1.unitInformation.status.name != "dead") {
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
            damage = Math.floor(damage * 0.05);
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
        if (unit2.unitInformation.status.name != "dead") {
            if (unit1.unitInformation.type === "cat") {
                this.gainExp(this.damageDealingInteractions(unit2, damage), unit2.unitInformation.level);
            } else {
                this.damageDealingInteractions(unit2, damage);
            }
            this.checkEndBattle();
            this.checkEndBattleVictory();
        } else {
            console.log("turn skipped");
            this.announcementText.setText("Target not found!");
        }

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
                "Current Energy: " + temp.unitInformation.energy + "\n" + "\n" +
                "Attack: " + temp.unitInformation.ATK + "\n" + "\n" +
                "Defense: " + temp.unitInformation.DEF + "\n" + "\n" +
                "Weight: " + temp.unitInformation.WT + "\n" + "\n" +
                "Status: " + temp.unitInformation.status.name + "\n" + "\n" + temp.unitInformation.status.description + "\n" + "\n" + "Turns Left: " + temp.unitInformation.status.numberOfTurns + "\n" + "\n" +
                "Enhance Level: " + temp.unitInformation.enhanced);
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
        if (this.hideLine === false && this.ManhattanDistance(this.input.mousePointer.worldX, this.input.mousePointer.worldY, this.currentCat.x, this.currentCat.y) <= 675) {
            this.graphics.clear();
            this.graphics.strokeLineShape(this.line);
        }
        if (this.ManhattanDistance(this.input.mousePointer.worldX, this.input.mousePointer.worldY, this.currentCat.x, this.currentCat.y) > 675) {
            this.graphics.clear();
        }
    },

    fireCat: function () {
        var manhattanDistance = this.ManhattanDistance(this.input.mousePointer.worldX, this.input.mousePointer.worldY, this.currentCat.x, this.currentCat.y);
        //can reach up to 250 speed in total 
        if (manhattanDistance > 675) {
            return; //don't fire if that is the acase
        }
        var power = manhattanDistance * 1.05;
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
        if (unit.unitInformation.status.name == "Burned") {
            console.log("burnt!");
            var damage = Math.floor(unit.unitInformation.maxHP * 0.08);
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

        if (this.currentLevel == 3) {
            if (this.sideTurnCounter == 2) {
                var magic = 1;
                for (var i = 0; i < this.allUnits.length; i++) {
                    if (this.allUnits[i].unitInformation.name == "Stuffed Dog") {
                        magic = magic * -1;
                        this.allUnits[i].setInteractive(true);
                        this.allUnits[i].setActive(true).setVisible(true);
                        this.allUnits[i].x = 1280 - 800 * magic
                        this.allUnits[i].y = 1600
                        this.allUnits[i].unitInformation.status = new Status("None", "", "∞");
                    }
                }

            }
        }

        if (this.currentLevel == 4) {
            if (this.sideTurnCounter == 5) {
                var magic = 1;
                for (var i = 0; i < this.allUnits.length; i++) {
                    if (this.allUnits[i].unitInformation.name == "Skilled Warrior Dog") {
                        magic = magic * -1;
                        this.allUnits[i].setInteractive(true);
                        this.allUnits[i].setActive(true).setVisible(true);
                        this.allUnits[i].x = 1280 - 800 * magic
                        this.allUnits[i].y = 4700;
                        this.allUnits[i].unitInformation.status = new Status("None", "", "∞");
                    }
                }

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
            if (this.index == 0) {
                this.sideTurnCounter++;
            }
            if (this.index >= this.allUnits.length) {
                this.index = 0;
            }
            if (this.allUnits[this.index].unitInformation.status.name != "dead" && this.allUnits[this.index].unitInformation.status.name != "backup") {
                console.log(this.index)
                console.log(this.allUnits[this.index].unitInformation.name);
                break;
            }
        }

        this.cameras.main.startFollow(this.allUnits[this.index]);
        //if player
        if (this.allUnits[this.index].unitInformation.type === "cat") {
            //if the previous turn was an enemy 
            //camera focus zoom onto the player
            this.hideLine = false;
            this.currentCat = this.allUnits[this.index];
            this.dealStatusEffectDamage(this.currentCat);
            if (this.currentCat.unitInformation.status.name == "dead") {
                this.nextTurn();
            }
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
            if (this.currentEnemy.unitInformation.status.name == "dead") {
                this.nextTurn();
            }
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
        console.log(this.currentEnemy.unitInformation.AIType)
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
                    this.physics.moveToObject(this.currentEnemy, selectedCat, 500 * (2.2 - (this.currentCat.unitInformation.WT * 0.1)));
                    this.enemyMovePhase = true;
                } else {
                    this.announcementText.setText(this.currentEnemy.unitInformation.name + " skips its turn!");
                    this.sleep(1000).then(() => {
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
                    this.physics.moveToObject(this.currentEnemy, selectedCat, 500 * (2.2 - (this.currentCat.unitInformation.WT * 0.1)));
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
                    this.physics.moveToObject(this.currentEnemy, selectedCat, 500 * (2.2 - (this.currentCat.unitInformation.WT * 0.1)));
                    this.enemyMovePhase = true;
                } else {
                    this.enemyMovePhase = false;
                    //this.enemySkillPhase = true;
                    //this.enemyUseSkill();
                    this.announcementText.setText(this.currentEnemy.unitInformation.name + " stays still...");
                    this.sleep(1200).then(() => {
                        this.enemyPhase = false;
                        this.nextTurn();
                    });
                }
                break;

            case "immovable":
                this.announcementText.setText(this.currentEnemy.unitInformation.name + " stays still...");
                this.sleep(1200).then(() => {
                    this.enemyPhase = false;
                    this.nextTurn();
                });
                break;

            case "immovableSkill":
                this.enemyMovePhase = false;
                this.enemySkillPhase = true;
                this.enemyUseSkill();
                break;

            case "oddCat":
            case "oddBird":
            case "oddFox":
                for (var i = 0; i < this.allUnits.length; i++) {
                    if (this.allUnits[i].unitInformation.type == "cat" && this.ManhattanDistance(this.allUnits[i].x, this.allUnits[i].y, this.currentEnemy.x, this.currentEnemy.y) <= 1250 &&
                        this.allUnits[i].unitInformation.status.name != "dead") {
                        selectedCat = this.allUnits[i];
                        break;
                    }
                }
                if (selectedCat != null) {
                    this.physics.moveToObject(this.currentEnemy, selectedCat, 500 * (2.2 - (this.currentCat.unitInformation.WT * 0.1)));
                    this.enemyMovePhase = true;
                } else {
                    this.enemyMovePhase = false;
                    this.announcementText.setText(this.currentEnemy.unitInformation.name + " stays still...");
                    this.sleep(1200).then(() => {
                        this.enemyPhase = false;
                        this.nextTurn();
                    });
                }
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
                this.sleep(1000).then(() => {
                    this.enemyPhase = false;
                    this.nextTurn();
                });
                break;
            case "oddCat":
                this.enemySkillPhase = false;
                var dualSkill = 1;
                var random = Math.floor(Math.random() * 101);
                if (random < 50) {
                    dualSkill = 0;
                }
                this.announcementText.setText(this.currentEnemy.unitInformation.name + " used '" + this.currentEnemy.unitInformation.skill[dualSkill].name + "'!");
                switch (this.currentEnemy.unitInformation.skill[dualSkill].name) {
                    case "Odd Sludge":
                        for (var i = 0; i < this.allUnits.length; i++) {
                            if (this.allUnits[i].unitInformation.type == "cat") {
                                this.dealEffectDamage(this.currentEnemy, this.allUnits[i], Math.floor(this.allUnits[i].unitInformation.maxHP * 0.25));
                                if (this.allUnits[i].unitInformation.status.name != "dead") {
                                    this.allUnits[i].unitInformation.status = new Status("Poisoned", "Takes 3% poison damage each turn.", 10);
                                }
                            }
                        };
                        break;
                    case "Energy Drain":
                        for (var i = 0; i < this.allUnits.length; i++) {
                            if (this.allUnits[i].unitInformation.type == "cat") {
                                if (this.allUnits[i].unitInformation.status.name != "dead" && this.allUnits[i].unitInformation.energy > 0) {
                                    this.allUnits[i].unitInformation.energy--;
                                }
                            }
                        };
                        break;
                }
                this.sleep(1000).then(() => {
                    this.enemyPhase = false;
                    this.nextTurn();
                });
                break;
            case "oddBird":
                this.enemySkillPhase = false;
                var dualSkill = 1;
                var random = Math.floor(Math.random() * 101);
                if (random < 50) {
                    dualSkill = 0;
                }
                this.announcementText.setText(this.currentEnemy.unitInformation.name + " used '" + this.currentEnemy.unitInformation.skill[dualSkill].name + "'!");
                switch (this.currentEnemy.unitInformation.skill[dualSkill].name) {
                    case "Odd Storm":
                        this.index--;
                        break;
                    case "Ominous Tempest":
                        for (var i = 0; i < this.allUnits.length; i++) {
                            if (this.allUnits[i].unitInformation.type == "cat" && this.ManhattanDistance(this.allUnits[i].x, this.allUnits[i].y, this.currentEnemy.x, this.currentEnemy.y) <= 800) {
                                this.dealEffectDamage(this.currentEnemy, this.allUnits[i], Math.floor(this.allUnits[i].unitInformation.maxHP * 0.10));
                                if (this.allUnits[i].unitInformation.status.name != "dead" && this.allUnits[i].unitInformation.energy > 0) {
                                    this.allUnits[i].unitInformation.energy--;
                                }
                            }
                        };
                        break;
                }
                this.sleep(1200).then(() => {
                    this.enemyPhase = false;
                    this.nextTurn();
                });
                break;
            case "oddFox":
                this.enemySkillPhase = false;
                var dualSkill = 1;
                var random = Math.floor(Math.random() * 101);
                if (random < 50) {
                    dualSkill = 0;
                }
                this.announcementText.setText(this.currentEnemy.unitInformation.name + " used '" + this.currentEnemy.unitInformation.skill[dualSkill].name + "'!");
                switch (this.currentEnemy.unitInformation.skill[dualSkill].name) {
                    case "Odd Waters":
                        for (var i = 0; i < this.allUnits.length; i++) {
                            if (this.allUnits[i].unitInformation.type == "enemy" && this.ManhattanDistance(this.allUnits[i].x, this.allUnits[i].y, this.currentEnemy.x, this.currentEnemy.y) <= 1000 &&
                                this.allUnits[i].unitInformation.status.name != "dead") {
                                this.allUnits[i].unitInformation.HP += Math.floor(this.allUnits[i].unitInformation.maxHP * 0.25);
                                if (this.allUnits[i].unitInformation.HP > this.allUnits[i].unitInformation.maxHP) {
                                    this.allUnits[i].unitInformation.HP = this.allUnits[i].unitInformation.maxHP;
                                } else {
                                    if (this.sideMenuText.text.includes(this.allUnits[i].unitInformation.name)) {
                                        this.healthBar.increase(Math.floor(this.allUnits[i].unitInformation.maxHP * 0.25));
                                        this.resetText(this.allUnits[i]);
                                    }
                                }
                                this.allUnits[i].healText.setText("+" + Math.floor(this.allUnits[i].unitInformation.maxHP * 0.25));
                                this.allUnits[i].healText.visible = true;
                            }
                        }
                        this.sleep(1200).then(() => {
                            for (var i = 0; i < this.allUnits.length; i++) {
                                this.allUnits[i].healText.visible = false;
                            }
                        });
                        break;
                    case "Odd Flame":
                        for (var i = 0; i < this.allUnits.length; i++) {
                            if (this.allUnits[i].unitInformation.type == "cat" && this.ManhattanDistance(this.allUnits[i].x, this.allUnits[i].y, this.currentEnemy.x, this.currentEnemy.y) <= 800) {
                                this.dealEffectDamage(this.currentEnemy, this.allUnits[i], Math.floor(this.allUnits[i].unitInformation.maxHP * 0.25));
                                if (this.allUnits[i].unitInformation.status.name != "dead") {
                                    this.allUnits[i].unitInformation.status = new Status("Burned", "Takes 8% burn damage each turn.", 1);
                                }
                            }
                        };
                }
                this.sleep(1200).then(() => {
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
                        this.sleep(2000).then(() => {
                            this.currentEnemy.healText.visible = false;
                        });
                        break;
                    case "odd Recovery":
                        this.currentEnemy.unitInformation.HP += Math.floor(this.currentEnemy.unitInformation.maxHP * 0.5);
                        if (this.currentEnemy.unitInformation.HP > this.currentEnemy.unitInformation.maxHP) {
                            this.currentEnemy.unitInformation.HP = this.currentEnemy.unitInformation.maxHP;
                        } else {
                            if (this.sideMenuText.text.includes(this.currentEnemy.unitInformation.name)) {
                                this.healthBar.increase(Math.floor(this.currentEnemy.unitInformation.maxHP * 0.5));
                                this.resetText(this.currentEnemy);
                            }
                        }
                        this.currentEnemy.healText.setText("+" + Math.floor(this.currentEnemy.unitInformation.maxHP * 0.5));
                        this.currentEnemy.healText.visible = true;
                        this.sleep(2000).then(() => {
                            this.currentEnemy.healText.visible = false;
                        });
                        break;
                    case "Endless Nightmare":
                        for (var i = 0; i < this.allUnits.length; i++) {
                            if (this.allUnits[i].unitInformation.type == "cat" && this.ManhattanDistance(this.allUnits[i].x, this.allUnits[i].y, this.currentEnemy.x, this.currentEnemy.y) <= 500) {
                                this.dealEffectDamage(this.currentEnemy, this.allUnits[i], Math.floor(this.allUnits[i].unitInformation.HP * 0.99));
                            }
                        };
                        break; 
                    case "Odd Flame":
                        for (var i = 0; i < this.allUnits.length; i++) {
                            if (this.allUnits[i].unitInformation.type == "cat" && this.ManhattanDistance(this.allUnits[i].x, this.allUnits[i].y, this.currentEnemy.x, this.currentEnemy.y) <= 800) {
                                this.dealEffectDamage(this.currentEnemy, this.allUnits[i], Math.floor(this.allUnits[i].unitInformation.maxHP * 0.25));
                                if (this.allUnits[i].unitInformation.status.name != "dead") {
                                    this.allUnits[i].unitInformation.status = new Status("Burned", "Takes 8% burn damage each turn.", 1);
                                }
                            }
                        };
                        break;
                    case "Fire!!":
                        for (var i = 0; i < this.allUnits.length; i++) {
                            if (this.allUnits[i].unitInformation.type == "cat" && this.ManhattanDistance(this.allUnits[i].x, this.allUnits[i].y, this.currentEnemy.x, this.currentEnemy.y) <= 800) {
                                this.dealEffectDamage(this.currentEnemy, this.allUnits[i], Math.floor(this.allUnits[i].unitInformation.maxHP * 0.05));
                                if (this.allUnits[i].unitInformation.status.name != "dead") {
                                    this.allUnits[i].unitInformation.status = new Status("Burned", "Takes 8% burn damage each turn.", 10);
                                }
                            }
                        };
                        break;
                    case "Sleep...":
                        for (var i = 0; i < this.allUnits.length; i++) {
                            if (this.allUnits[i].unitInformation.type == "cat" && this.ManhattanDistance(this.allUnits[i].x, this.allUnits[i].y, this.currentEnemy.x, this.currentEnemy.y) <= 2000) {
                                if (this.allUnits[i].unitInformation.status.name != "dead") {
                                    this.allUnits[i].unitInformation.status = new Status("Sleepy", "Dosing", 1);
                                }
                            }
                        }
                        break;
                    case "Summoning I":
                        if (this.turnCounter % 1 == 0) {
                            this.generateEnemyInfo("Summoned Warrior Dog", 10, "Terra", "", [], 35, 15, 20, 7, "seeker", 1280 - 600, 1056, "oddAnteaterCircle");
                            for (var i = 0; i < this.enemiesInfo.length; i++) {
                                this.spawnEnemies(this.enemiesInfo[i].info, this.enemiesInfo[i].spawnX, this.enemiesInfo[i].spawnY, this.enemiesInfo[i].image);
                            }
                            this.enemiesInfo = [];
                            this.setUnitCollisionAndLine();
                        }
                        break;
                    case "Summoning II":
                        if (this.turnCounter % 2 == 0) {
                            this.generateEnemyInfo("Stuffed Dog", 10, "Terra", "", [], 50, 13, 26, 10, "seeker", 1280 + 600, 1056, "stuffedDogCircle");
                            for (var i = 0; i < this.enemiesInfo.length; i++) {
                                this.spawnEnemies(this.enemiesInfo[i].info, this.enemiesInfo[i].spawnX, this.enemiesInfo[i].spawnY, this.enemiesInfo[i].image);
                            }
                            this.enemiesInfo = [];
                            this.setUnitCollisionAndLine();
                        }
                        break;
                    case "Enraged":
                        this.currentEnemy.unitInformation.status = new Status("Rage", "Increases normal attack damage delt to opponents by 50%", 2);
                        this.resetText(this.currentEnemy);
                        break;
                    case "Ruin":
                        for (var i = 0; i < this.allUnits.length; i++) {
                            if (this.allUnits[i].unitInformation.type == "cat" && this.ManhattanDistance(this.allUnits[i].x, this.allUnits[i].y, this.currentEnemy.x, this.currentEnemy.y) <= 800) {
                                this.dealEffectDamage(this.currentEnemy, this.allUnits[i], Math.floor(this.allUnits[i].unitInformation.maxHP * 0.1));
                                if (this.allUnits[i].unitInformation.status.name != "dead") {
                                    this.allUnits[i].unitInformation.status = new Status("Burned", "Takes 8% burn damage each turn.", 5);
                                }
                            }
                        };
                        break;
                    case "Wall of Healing":
                        for (var i = 0; i < this.allUnits.length; i++) {
                            if (this.allUnits[i].unitInformation.type == "enemy" && this.ManhattanDistance(this.allUnits[i].x, this.allUnits[i].y, this.currentEnemy.x, this.currentEnemy.y) <= 1000 &&
                                this.allUnits[i].unitInformation.status.name != "dead") {
                                this.allUnits[i].unitInformation.HP += Math.floor(this.allUnits[i].unitInformation.maxHP * 0.25);
                                if (this.allUnits[i].unitInformation.HP > this.allUnits[i].unitInformation.maxHP) {
                                    this.allUnits[i].unitInformation.HP = this.allUnits[i].unitInformation.maxHP;
                                } else {
                                    if (this.sideMenuText.text.includes(this.allUnits[i].unitInformation.name)) {
                                        this.healthBar.increase(Math.floor(this.allUnits[i].unitInformation.maxHP * 0.25));
                                        this.resetText(this.allUnits[i]);
                                    }
                                }
                                this.allUnits[i].healText.setText("+" + Math.floor(this.allUnits[i].unitInformation.maxHP * 0.25));
                                this.allUnits[i].healText.visible = true;
                            }
                        }
                        this.sleep(2000).then(() => {
                            for (var i = 0; i < this.allUnits.length; i++) {
                                this.allUnits[i].healText.visible = false;
                            }
                        });
                        break;

                }
                this.sleep(1500).then(() => {
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
                        if (this.allUnits[i].unitInformation.type == "cat" && this.allUnits[i].unitInformation.status.name != "dead") {
                            this.allUnits[i].unitInformation.HP += Math.floor(this.allUnits[i].unitInformation.maxHP * 0.35);
                            if (this.allUnits[i].unitInformation.HP > this.allUnits[i].unitInformation.maxHP) {
                                this.allUnits[i].unitInformation.HP = this.allUnits[i].unitInformation.maxHP;
                            } else {
                                if (this.sideMenuText.text.includes(this.allUnits[i].unitInformation.name)) {
                                    this.healthBar.increase(Math.floor(this.allUnits[i].unitInformation.maxHP * 0.35));
                                    this.resetText(this.allUnits[i]);
                                }
                            }
                            this.allUnits[i].healText.setText("+" + Math.floor(this.allUnits[i].unitInformation.maxHP * 0.35));
                            this.allUnits[i].healText.visible = true;
                            this.allUnits[i].unitInformation.status = new Status("Satisfied", "A satisfied Cat.", 1);
                        }
                    }
                    this.sleep(2000).then(() => {
                        for (var i = 0; i < this.allUnits.length; i++) {
                            this.allUnits[i].healText.visible = false;
                        }
                    });
                    break;
                case "Toxic Chemicals":
                    if (this.currentCat.unitInformation.lastTarget != null && this.currentCat.unitInformation.lastTarget.unitInformation.status.name != "dead") {
                        this.currentCat.unitInformation.lastTarget.unitInformation.status = new Status("Poisoned", "Depletes 3% of the user's max HP each turn.", 3);
                        this.resetText(this.currentCat.unitInformation.lastTarget);
                    } else {
                        this.announcementText.setText("No Target Found!");
                    }
                    break;
                case "Immovable Rock":
                    this.currentCat.unitInformation.status = new Status("Iron Wall", "Any physical damage delt to unit is decreased by 95%", 5);
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
                    this.sleep(2000).then(() => {
                        this.currentCat.healText.visible = false;
                    });
                    break;
                case "Home Sweet Home":
                    this.currentCat.unitInformation.status = new Status("Iron Wall", "Any physical damage delt to unit is decreased by 95%", 1);
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
                    this.sleep(2000).then(() => {
                        this.currentCat.healText.visible = false;
                    });
                    break;
                case "Tax Evasion":
                    //increase the catfood, not yet set. 
                    this.richCatMultiplier = this.richCatMultiplier * 1.2;
                    break;
                case "Piercing Sword":
                    this.currentCat.unitInformation.status = new Status("Rage", "Increases normal attack damage delt to opponents by 50%", 2);
                    this.resetText(this.currentCat);
                    break;
                case "Bullet Hell":
                    var numberOfCats = 0;
                    for (var i = 0; i < this.allUnits.length; i++) {
                        if (this.allUnits[i].unitInformation.type == "cat" && this.ManhattanDistance(this.allUnits[i].x, this.allUnits[i].y, this.currentCat.x, this.currentCat.y) <= 850) {
                            numberOfCats++;
                        }
                    }
                    for (var i = 0; i < this.allUnits.length; i++) {
                        if (this.allUnits[i].unitInformation.type == "enemy" && this.ManhattanDistance(this.allUnits[i].x, this.allUnits[i].y, this.currentCat.x, this.currentCat.y) <= 850 &&
                            this.allUnits[i].unitInformation.status.name != "dead") {
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
                        if (this.allUnits[i].unitInformation.type == "cat" && this.ManhattanDistance(this.allUnits[i].x, this.allUnits[i].y, this.currentCat.x, this.currentCat.y) <= 800 &&
                            this.allUnits[i].unitInformation.status.name != "dead") {
                            this.allUnits[i].unitInformation.energy += 5;
                        }
                    }
                    break;
                case "Have some Courage!":
                    if (this.currentCat.unitInformation.lastTarget != null) {
                        var numberOfCats = -1;
                        for (var i = 0; i < this.allUnits.length; i++) {
                            if (this.allUnits[i].unitInformation.type == "cat" && this.ManhattanDistance(this.allUnits[i].x, this.allUnits[i].y, this.currentCat.x, this.currentCat.y) <= 500) {
                                numberOfCats++;
                            }
                        }

                        if (numberOfCats < 2) {
                            this.dealEffectDamage(this.currentCat, this.currentCat.unitInformation.lastTarget, Math.floor(this.currentCat.unitInformation.lastTarget.unitInformation.HP * 0.3));
                        } else if (numberOfCats >= 2) {
                            this.dealEffectDamage(this.currentCat, this.currentCat.unitInformation.lastTarget, Math.floor(this.currentCat.unitInformation.lastTarget.unitInformation.HP * 0.5));
                        }

                    } else {
                        this.announcementText.setText("No Target Found!");
                    }
                    break;
                case "All You Can Eat":
                    for (var i = 0; i < this.allUnits.length; i++) {
                        if (this.allUnits[i].unitInformation.type == "cat" &&
                            this.allUnits[i].unitInformation.name != "Sushi Master Cat" && this.allUnits[i].unitInformation.status.name != "dead") {
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
                    this.sleep(2000).then(() => {
                        for (var i = 0; i < this.allUnits.length; i++) {
                            this.allUnits[i].healText.visible = false;
                        }
                    });
                    break;
                case "Catch of the day?":
                    for (var i = 0; i < this.allUnits.length; i++) {
                        if (this.allUnits[i].unitInformation.type == "cat" && this.ManhattanDistance(this.allUnits[i].x, this.allUnits[i].y, this.currentCat.x, this.currentCat.y) <= 500 &&
                            this.allUnits[i].unitInformation.name != "Fishing Cat" && this.allUnits[i].unitInformation.status.name != "dead") {

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
                    this.sleep(2000).then(() => {
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

        this.sleep(1500).then(() => {
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
        this.sleep(1000).then(() => {
            this.skillPhase = false;
            this.buttonLock = false;
            this.nextTurn();
        });
    },

    checkEndBattle: function () {
        var deathCounter = 0;
        for (var i = 0; i < this.allUnits.length; i++) {
            if (this.allUnits[i].unitInformation.status.name == "dead" && this.allUnits[i].unitInformation.type === "cat") {
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
        this.apotheosis.stop();
        this.battleTheme.stop();
        console.log("battle ends");
        this.announcementText.setText("Defeated...");
        this.catParty.resetCats();
        for (var i = 0; i < this.allUnits.length; i++) {
            if (this.allUnits[i].unitInformation.type === "cat") {
                for (var j = 0; j < this.catParty.allCats.length; j++) {
                    if (this.catParty.allCats[j].name === this.allUnits[i].unitInformation.name) {
                        console.log("changed cat party!")
                        this.catParty.allCats[j] = this.allUnits[i].unitInformation;
                    }
                }
            }
        }
        if (this.currentLevel == 0) {
            this.catParty.currentTeam = [];
            this.catParty.tutorialCompleted = true;
        }
        this.scene.pause('WorldScene');
        localStorage.setItem('catParty', JSON.stringify(this.catParty));
        this.sleep(3000).then(() => {
            this.scene.start('BootScene', {
                "catParty": this.catParty
            })
        });

    },

    endBattleVictory: function () {
        this.apotheosis.stop();
        this.battleTheme.stop();
        this.victory = true;
        this.catParty.resetCats();
        for (var i = 0; i < this.allUnits.length; i++) {
            if (this.allUnits[i].unitInformation.type === "cat") {
                for (var j = 0; j < this.catParty.allCats.length; j++) {
                    if (this.catParty.allCats[j].name === this.allUnits[i].unitInformation.name) {
                        this.catParty.allCats[j] = this.allUnits[i].unitInformation;
                    }
                }
            }
        }

        this.announcementText.setText("Victory!!");
        if (this.currentLevel == 0) {
            this.catParty.currentTeam = [];
            this.catParty.tutorialCompleted = true;
        }
        if (this.currentLevel == 1 && this.catParty.levelsPassed == 0) {
            this.catParty.obtainCatFood(Math.floor(10 * this.richCatMultiplier));
            if (this.catParty.levelsPassed < 1) {
                this.catParty.levelsPassed = 1;
            }
        }
        if (this.currentLevel == 2 && this.catParty.levelsPassed == 1) {
            this.catParty.obtainCatFood(Math.floor(10 * this.richCatMultiplier));
            if (this.catParty.levelsPassed < 2) {
                this.catParty.levelsPassed = 2;
            }
        }
        if (this.currentLevel == 3 && this.catParty.levelsPassed == 2) {
            this.catParty.obtainCatFood(Math.floor(10 * this.richCatMultiplier));
            if (this.catParty.levelsPassed < 3) {
                this.catParty.levelsPassed = 3;
            }
        }
        if (this.currentLevel == 4 && this.catParty.levelsPassed == 3) {
            this.catParty.obtainCatFood(Math.floor(10 * this.richCatMultiplier));
            if (this.catParty.levelsPassed < 4) {
                this.catParty.levelsPassed = 4;
            }
        }
        if (this.currentLevel == 5 && this.catParty.levelsPassed == 4) {
            this.catParty.obtainCatFood(Math.floor(10 * this.richCatMultiplier));
            if (this.catParty.levelsPassed < 5) {
                this.catParty.levelsPassed = 5;
            }
        }
        if (this.currentLevel == 6 && this.catParty.levelsPassed == 5) {
            this.catParty.obtainCatFood(Math.floor(10 * this.richCatMultiplier));
            if (this.catParty.levelsPassed < 6) {
                this.catParty.levelsPassed = 6;
            }
        }
        if (this.currentLevel == 7 && this.catParty.levelsPassed == 6) {
            this.catParty.obtainCatFood(Math.floor(10 * this.richCatMultiplier));
            if (this.catParty.levelsPassed < 7) {
                this.catParty.levelsPassed = 7;
            }
        }
        if (this.currentLevel == "apotheosisChallenge"){
            this.catParty.obtainCatFood(Math.floor(100 * this.richCatMultiplier));
        }
        localStorage.setItem('catParty', JSON.stringify(this.catParty));
        this.sleep(3000).then(() => {
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

        if (this.boxGenerated == true) {
            this.rectangle.x = this.cameras.main.scrollX + 790;
            this.rectangle.y = this.cameras.main.scrollY + 482;
            //this.physics.moveTo(this.rectangle, this.cameras.main.scrollX + 790, this.cameras.main.scrollY + 482, 3000);
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
        this.physics.add.collider(tempEnemy, this.blockedLayer, this.wallCollision, false, this);
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

    wallCollision: function (cat) {
        console.log(cat.unitInformation);
        if (cat.unitInformation.status.name != "dead" && cat.unitInformation.status.name != "backup") {
            this.coinCollide.play();
        }
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
                        "Current Energy: " + tempCat0.unitInformation.energy + "\n" + "\n" +
                        "Attack: " + tempCat0.unitInformation.ATK + "\n" + "\n" +
                        "Defense: " + tempCat0.unitInformation.DEF + "\n" + "\n" +
                        "Weight: " + tempCat0.unitInformation.WT + "\n" + "\n" +
                        "Status: " + tempCat0.unitInformation.status.name + "\n" + "\n" + tempCat0.unitInformation.status.description + "\n" + "\n" + "Turns Left: " + tempCat0.unitInformation.status.numberOfTurns + "\n" + "\n" +
                        "Enhance Level: " + tempCat0.unitInformation.enhanced
                    )
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
                        "Current Energy: " + tempCat1.unitInformation.energy + "\n" + "\n" +
                        "Attack: " + tempCat1.unitInformation.ATK + "\n" + "\n" +
                        "Defense: " + tempCat1.unitInformation.DEF + "\n" + "\n" +
                        "Weight: " + tempCat1.unitInformation.WT + "\n" + "\n" +
                        "Status: " + tempCat1.unitInformation.status.name + "\n" + "\n" + tempCat1.unitInformation.status.description + "\n" + "\n" + "Turns Left: " + tempCat1.unitInformation.status.numberOfTurns + "\n" + "\n" +
                        "Enhance Level: " + tempCat1.unitInformation.enhanced
                    )
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
                        "Current Energy: " + tempCat2.unitInformation.energy + "\n" + "\n" +
                        "Attack: " + tempCat2.unitInformation.ATK + "\n" + "\n" +
                        "Defense: " + tempCat2.unitInformation.DEF + "\n" + "\n" +
                        "Weight: " + tempCat2.unitInformation.WT + "\n" + "\n" +
                        "Status: " + tempCat2.unitInformation.status.name + "\n" + "\n" + tempCat2.unitInformation.status.description + "\n" + "\n" + "Turns Left: " + tempCat2.unitInformation.status.numberOfTurns + "\n" + "\n" +
                        "Enhance Level: " + tempCat2.unitInformation.enhanced)
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
                        "Current Energy: " + tempCat3.unitInformation.energy + "\n" + "\n" +
                        "Attack: " + tempCat3.unitInformation.ATK + "\n" + "\n" +
                        "Defense: " + tempCat3.unitInformation.DEF + "\n" + "\n" +
                        "Weight: " + tempCat3.unitInformation.WT + "\n" + "\n" +
                        "Status: " + tempCat3.unitInformation.status.name + "\n" + "\n" + tempCat3.unitInformation.status.description + "\n" + "\n" + "Turns Left: " + tempCat3.unitInformation.status.numberOfTurns + "\n" + "\n" +
                        "Enhance Level: " + tempCat3.unitInformation.enhanced)
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