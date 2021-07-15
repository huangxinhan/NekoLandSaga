var BootScene = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function BootScene() {
        Phaser.Scene.call(this, {
            key: 'BootScene'
        });

    },

    init: function (data) {
        if (!jQuery.isEmptyObject(data)) {
            this.catParty = data.catParty
        } else {
            var tempCatParty = JSON.parse(localStorage.getItem('catParty'));
            console.log(tempCatParty);
            if (tempCatParty) {
                this.catParty = new catParty();
                this.catParty.allCats = tempCatParty.allCats;
                this.catParty.currentTeam = tempCatParty.currentTeam;
                this.catParty.totalCatFood = tempCatParty.totalCatFood;
                this.catParty.tutorialCompleted = tempCatParty.tutorialCompleted;
                this.catParty.levelsPassed = tempCatParty.levelsPassed;
            } else {
                //new Game, initialize cat party
                this.catParty = new catParty();
                this.catParty.obtainCatFood(25);
            }
        }
        console.log(this.catParty);
    },

    preload: function () {
        this.load.image("nekolandsaga", 'assets/text/nekolandsaga.png');
        this.load.image('placeholder', 'assets/text/placeholder.png');
        this.load.image('topMenu', 'assets/text/topMenu.png');
        this.load.image('highlight', 'assets/text/highlight.png');
        this.load.image('catGacha', 'assets/text/catGacha.png');
        this.load.image('manageTeamText', 'assets/text/manageTeamText.png');
        this.load.image('catGachaText', 'assets/text/catGachaText.png');
        this.load.image('help', 'assets/text/help.png');
        this.load.image('nekolandsagaText', 'assets/text/nekolandsagaText.png');
        this.load.image('levelSelection', 'assets/text/levelSelection.png');
        this.load.image('lureCat', 'assets/text/lureCat.png');
        this.load.image('manageTeam', 'assets/text/manageTeam.png');
        this.load.image('removeFromParty', 'assets/text/removeFromParty.png');
        this.load.image('returnToMainMenu', 'assets/text/returnToMainMenu.png');
        this.load.image('arc1', 'assets/text/arc1.png');
        this.load.image('arc1level1', 'assets/text/arc1level1.png');
        this.load.image('arc1level2', 'assets/text/arc1level2.png');
        this.load.image('arc1level3', 'assets/text/arc1level3.png');
        this.load.image('arc1level4', 'assets/text/arc1level4.png');
        this.load.image('arc1level5', 'assets/text/arc1level5.png');
        this.load.image('arc1level6', 'assets/text/arc1level6.png');
        this.load.image('arc1level7', 'assets/text/arc1level7.png');
        this.load.image('dialogBox', 'assets/text/dialogBox.png');
        this.load.image('tiles', 'assets/map/Mapset.png');
        this.load.image('useSkill', 'assets/text/useSkill.png');
        this.load.image('skipTurn', 'assets/text/skipTurn.png');
        this.load.image('saveGame', 'assets/text/saveGame.png');
        this.load.image('catGallery', 'assets/text/catGallery.png');
        this.load.image('enemyGallery', 'assets/text/enemyGallery.png');
        this.load.image('minimapButton', 'assets/text/minimapButton.png');
        this.load.image('rectangle', 'assets/text/rectangle.png');
        this.load.image('quitButton', 'assets/text/quitButton.png');
        this.load.image('trainingArena', 'assets/text/trainingArena.png');
        this.load.image('apotheosisChallenge', 'assets/text/apotheosisChallenge.png');

        //Cats
        this.load.image('chefCat', 'assets/cats/chefCat.png');
        this.load.image('chefCatCircle', 'assets/cats/chefCatCircle.png');
        this.load.image('knightCat', 'assets/cats/knightCat.png');
        this.load.image('knightCatCircle', 'assets/cats/knightCatCircle.png');
        this.load.image('mechaCat', 'assets/cats/mechaCat.png');
        this.load.image('mechaCatCircle', 'assets/cats/mechaCatCircle.png');
        this.load.image('sideMenu', 'assets/text/sideMenu.png');
        this.load.image('chainsawCat', 'assets/cats/chainsawCat.png');
        this.load.image('chainsawCatCircle', 'assets/cats/chainsawCatCircle.png');
        this.load.image('wizardCat', 'assets/cats/wizardCat.png');
        this.load.image('wizardCatCircle', 'assets/cats/wizardCatCircle.png');
        this.load.image('twinCat', 'assets/cats/twinCat.png');
        this.load.image('twinCatCircle', 'assets/cats/twinCatCircle.png');
        this.load.image('soldierCat', 'assets/cats/soldierCat.png');
        this.load.image('soldierCatCircle', 'assets/cats/soldierCatCircle.png');
        this.load.image('scienceCat', 'assets/cats/scienceCat.png');
        this.load.image('scienceCatCircle', 'assets/cats/scienceCatCircle.png');
        this.load.image('sumoCat', 'assets/cats/sumoCat.png');
        this.load.image('sumoCatCircle', 'assets/cats/sumoCatCircle.png');
        this.load.image('hesitantCat', 'assets/cats/hesitantCat.png');
        this.load.image('hesitantCatCircle', 'assets/cats/hesitantCatCircle.png');
        this.load.image('billionaireCat', 'assets/cats/billionaireCat.png');
        this.load.image('billionaireCatCircle', 'assets/cats/billionaireCatCircle.png');
        this.load.image('sushiMasterCat', 'assets/cats/sushiMasterCat.png');
        this.load.image('sushiMasterCatCircle', 'assets/cats/sushiMasterCatCircle.png');
        this.load.image('joggingCat', 'assets/cats/joggingCat.png');
        this.load.image('joggingCatCircle', 'assets/cats/joggingCatCircle.png');
        this.load.image('fishingCat', 'assets/cats/fishingCat.png');
        this.load.image('fishingCatCircle', 'assets/cats/fishingCatCircle.png');
        this.load.image('homeownerCats', 'assets/cats/homeownerCats.png');
        this.load.image('homeownerCatsCircle', 'assets/cats/homeownerCatscircle.png');

        //enemies
        this.load.image('oddAnteater', 'assets/enemies/oddAnteater.png');
        this.load.image('oddAnteaterCircle', 'assets/enemies/oddAnteaterCircle.png');
        this.load.image('oddBird', 'assets/enemies/oddBird.png');
        this.load.image('oddBirdCircle', 'assets/enemies/oddBirdCircle.png');
        this.load.image('oddCat', 'assets/enemies/oddCat.png');
        this.load.image('oddCatCircle', 'assets/enemies/oddCatCircle.png');
        this.load.image('oddSnake', 'assets/enemies/oddSnake.png');
        this.load.image('oddSnakeCircle', 'assets/enemies/oddSnakeCircle.png');
        this.load.image('oddRabbit', 'assets/enemies/oddRabbit.png');
        this.load.image('oddRabbitCircle', 'assets/enemies/oddRabbitCircle.png');
        this.load.image('oddFox', 'assets/enemies/oddFox.png');
        this.load.image('oddFoxCircle', 'assets/enemies/oddFoxCircle.png');
        this.load.image('oddGoat', 'assets/enemies/oddGoat.png');
        this.load.image('oddGoatCircle', 'assets/enemies/oddGoatCircle.png');
        this.load.image('restingDog', 'assets/enemies/restingDog.png');
        this.load.image('restingDogCircle', 'assets/enemies/restingDogCircle.png');
        this.load.image('sageDog', 'assets/enemies/sageDog.png');
        this.load.image('sageDogCircle', 'assets/enemies/sageDogCircle.png');
        this.load.image('warriorDog', 'assets/enemies/warriorDog.png');
        this.load.image('warriorDogCircle', 'assets/enemies/warriorDogCircle.png');
        this.load.image('spyDog', 'assets/enemies/spyDog.png');
        this.load.image('spyDogCircle', 'assets/enemies/spyDogCircle.png');
        this.load.image('stuffedDog', 'assets/enemies/stuffedDog.png');
        this.load.image('stuffedDogCircle', 'assets/enemies/stuffedDogCircle.png');
        this.load.image('tankDog', 'assets/enemies/tankDog.png');
        this.load.image('tankDogCircle', 'assets/enemies/tankDogCircle.png');
        this.load.image('thiefDog', 'assets/enemies/thiefDog.png');
        this.load.image('thiefDogCircle', 'assets/enemies/thiefDogCircle.png');
        this.load.image('gangsterDog', 'assets/enemies/gangsterDog.png');
        this.load.image('gangsterDogCircle', 'assets/enemies/gangsterDogCircle.png');

        //audio
        this.load.audio('coinCollide', 'assets/sfx/coinCollide.mp3');
        this.load.audio('buttonHover', 'assets/sfx/buttonHover.mp3');
        this.load.audio('buttonClick', 'assets/sfx/buttonClick.mp3');
    },

    create: function () {
        if (this.catParty.tutorialCompleted == false) {
            this.scene.start('WorldScene', {
                "catParty": this.catParty,
                "level": 0
            });
        }

        this.buttonHover = this.sound.add('buttonHover');
        this.buttonClick = this.sound.add('buttonClick');
        this.cameras.main.setBackgroundColor('rgba(250, 218, 94, 1)');
        this.backgroundImage = this.physics.add.image(790, 482, 'nekolandsaga');
        this.graphics = this.add.graphics();
        this.graphics.lineStyle(1, 0xffffff);
        this.graphics.fillStyle(0x031f4c, 1);

        var nekolandsagaText = this.physics.add.image(400, 210, 'nekolandsagaText');

        var levelSelection = this.physics.add.image(400, 350, 'levelSelection').setInteractive();
        levelSelection.on('pointerdown', () => {
            this.buttonClick.play();
            this.scene.start('LevelSelectionScene', {
                "catParty": this.catParty,
                "level": 0
            });
        });

        levelSelection.on('pointerover', () => {
            this.buttonHover.play();
            levelSelection.setTint("0xf2b3ff");
        })

        levelSelection.on('pointerout', () => {
            levelSelection.clearTint();
        })

        var catGacha = this.physics.add.image(400, 450, 'catGacha').setInteractive();
        catGacha.on('pointerdown', () => {
            this.buttonClick.play();
            this.scene.start('GachaScene', {
                "catParty": this.catParty
            })
        });

        catGacha.on('pointerover', () => {
            this.buttonHover.play();
            catGacha.setTint("0xf2b3ff");
        })

        catGacha.on('pointerout', () => {
            catGacha.clearTint();
        });

        var manageTeam = this.physics.add.image(400, 550, 'manageTeam').setInteractive();
        manageTeam.on('pointerdown', () => {
            this.buttonClick.play();
            this.scene.start("PartyScene", {
                "catParty": this.catParty
            })
        });

        manageTeam.on('pointerover', () => {
            this.buttonHover.play();
            manageTeam.setTint("0xf2b3ff");
        })

        manageTeam.on('pointerout', () => {
            manageTeam.clearTint();
        });

        var help = this.physics.add.image(400, 650, 'help').setInteractive();

        help.on('pointerdown', () => {
            this.buttonClick.play();
            this.scene.start("HelpScene", {
                "catParty": this.catParty
            })
        });

        help.on('pointerover', () => {
            this.buttonHover.play();
            help.setTint("0xf2b3ff");
        });

        help.on('pointerout', () => {
            help.clearTint();
        });

        var saveGame = this.physics.add.image(1350, 150, 'saveGame').setInteractive();

        saveGame.on('pointerdown', () => {
            alert("Game Saved!");
            localStorage.setItem('catParty', JSON.stringify(this.catParty));
            this.buttonClick.play();

        });

        saveGame.on('pointerover', () => {
            this.buttonHover.play();
            saveGame.setTint("0xf2b3ff");
        });

        saveGame.on('pointerout', () => {
            saveGame.clearTint();
        })
    }

});