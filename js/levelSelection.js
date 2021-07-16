var LevelSelectionScene = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function LevelSelectionScene() {
        Phaser.Scene.call(this, {
            key: 'LevelSelectionScene'
        });

    },

    init: function (data) {
        this.catParty = data.catParty;
        console.log(this.catParty);
    },

    preload: function () {},

    create: function () {
        this.buttonHover = this.sound.add('buttonHover');
        this.buttonClick = this.sound.add('buttonClick');
        this.cameras.main.setBackgroundColor('rgba(250, 218, 94, 1)');
        this.backgroundImage = this.physics.add.image(790, 482, 'nekolandsaga');
        this.graphics = this.add.graphics();
        this.graphics.lineStyle(1, 0xffffff);
        this.graphics.fillStyle(0x031f4c, 1);

        var nekolandsagaText = this.physics.add.image(400, 110, 'nekolandsagaText');

        this.rateText = this.add.text(970, 130, "Get Cat Food x100" + "\n" + "\n" +"for clearing the Apotheosis Challenge!", {
            color: "#000000",
            align: "center",
            fontWeight: 'bold',
            font: '28px Arial',
            wordWrap: {
                width: 600,
                useAdvancedWrap: true
            }
        }).setInteractive();

        var levelSelection = this.physics.add.image(400, 200, 'arc1').setInteractive();
        levelSelection.on('pointerdown', () => {
            this.buttonClick.play();
            this.scene.start('ancientCivilizationScene', {
                "catParty": this.catParty,
                "level": this.catParty.levelsPassed
            });
        });

        levelSelection.on('pointerover', () => {
            this.buttonHover.play();
            levelSelection.setTint("0xf2b3ff");
        })

        levelSelection.on('pointerout', () => {
            levelSelection.clearTint();
        });

        var trainingArena = this.physics.add.image(400, 300, 'trainingArena').setInteractive();
        trainingArena.on('pointerdown', () => {
            this.buttonClick.play();
            if (this.catParty.currentTeam.length == 0) {
                alert("Must have at least one cat on your team to proceed!");
            } else {
                this.scene.start('WorldScene', {
                    "catParty": this.catParty,
                    "level": "trainingArena"
                });
            }
        });

        trainingArena.on('pointerover', () => {
            this.buttonHover.play();
            trainingArena.setTint("0xf2b3ff");
        })

        trainingArena.on('pointerout', () => {
            trainingArena.clearTint();
        });

        var apotheosisChallenge = this.physics.add.image(400, 400, 'apotheosisChallenge').setInteractive();
        apotheosisChallenge.on('pointerdown', () => {
            this.buttonClick.play();
            this.scene.start('WorldScene', {
                "catParty": this.catParty,
                "level": "apotheosisChallenge"
            })
        });

        apotheosisChallenge.on('pointerover', () => {
            this.buttonHover.play();
            apotheosisChallenge.setTint("0xf2b3ff");
        })

        apotheosisChallenge.on('pointerout', () => {
            apotheosisChallenge.clearTint();
        });



        var returnToMainMenu = this.physics.add.image(400, 700, 'returnToMainMenu').setInteractive();
        returnToMainMenu.on('pointerdown', () => {
            this.buttonClick.play();
            this.scene.start('BootScene', {
                "catParty": this.catParty
            })
        });

        returnToMainMenu.on('pointerover', () => {
            this.buttonHover.play();
            returnToMainMenu.setTint("0xf2b3ff");
        })

        returnToMainMenu.on('pointerout', () => {
            returnToMainMenu.clearTint();
        });

    }

});