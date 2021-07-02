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
            this.catParty.obtainCatFood(60);
        } else {
            this.catParty = data.catParty;
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
        this.load.image('tiles', 'assets/map/Mapset.png');
        this.load.image('useSkill', 'assets/text/useSkill.png');
        this.load.image('skipTurn', 'assets/text/skipTurn.png');
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
    },

    create: function () {
        this.cameras.main.setBackgroundColor('rgba(250, 218, 94, 1)');
        this.backgroundImage = this.physics.add.image(790, 482, 'nekolandsaga');
        this.graphics = this.add.graphics();
        this.graphics.lineStyle(1, 0xffffff);
        this.graphics.fillStyle(0x031f4c, 1);

        var nekolandsagaText = this.physics.add.image(400, 210, 'nekolandsagaText');

        var levelSelection = this.physics.add.image(400, 350, 'levelSelection').setInteractive();
        levelSelection.on('pointerdown', () => {
            this.scene.start('WorldScene', {
                "catParty": this.catParty,
                "level": 0
            });
        });

        levelSelection.on('pointerover', () => {
            levelSelection.setTint("0xf2b3ff");
        })

        levelSelection.on('pointerout', () => {
            levelSelection.clearTint();
        })

        var catGacha = this.physics.add.image(400, 450, 'catGacha').setInteractive();
        catGacha.on('pointerdown', () => {
            this.scene.start('GachaScene', {
                "catParty": this.catParty
            })
        });

        catGacha.on('pointerover', () => {
            catGacha.setTint("0xf2b3ff");
        })

        catGacha.on('pointerout', () => {
            catGacha.clearTint();
        });

        var manageTeam = this.physics.add.image(400, 550, 'manageTeam').setInteractive();
        manageTeam.on('pointerdown', () => {
            this.scene.start("PartyScene", {
                "catParty": this.catParty
            })
        });

        manageTeam.on('pointerover', () => {
            manageTeam.setTint("0xf2b3ff");
        })

        manageTeam.on('pointerout', () => {
            manageTeam.clearTint();
        });

        var help = this.physics.add.image(400, 650, 'help').setInteractive();

        help.on('pointerover', () => {
            help.setTint("0xf2b3ff");
        })

        help.on('pointerout', () => {
            help.clearTint();
        });

    }

});