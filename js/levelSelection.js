var LevelSelectionScene = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function BootScene() {
        Phaser.Scene.call(this, {
            key: 'LevelSelectionScene'
        });

    },

    init: function (data) {
        this.catParty = data.catParty;
        console.log(this.catParty);
    },

    preload: function () {
    },

    create: function () {
        this.cameras.main.setBackgroundColor('rgba(250, 218, 94, 1)');
        this.backgroundImage = this.physics.add.image(790, 482, 'nekolandsaga');
        this.graphics = this.add.graphics();
        this.graphics.lineStyle(1, 0xffffff);
        this.graphics.fillStyle(0x031f4c, 1);

        var nekolandsagaText = this.physics.add.image(400, 210, 'nekolandsagaText');

        var levelSelection = this.physics.add.image(400, 350, 'arc1').setInteractive();
        levelSelection.on('pointerdown', () => {
            this.scene.start('ancientCivilizationScene', {
                "catParty": this.catParty,
                "level": this.catParty.levelsPassed
            });
        });

        levelSelection.on('pointerover', () => {
            levelSelection.setTint("0xf2b3ff");
        })

        levelSelection.on('pointerout', () => {
            levelSelection.clearTint();
        })

        var returnToMainMenu = this.physics.add.image(400, 450, 'returnToMainMenu').setInteractive();
        returnToMainMenu.on('pointerdown', () => {
            this.scene.start('BootScene', {
                "catParty": this.catParty
            })
        });

        returnToMainMenu.on('pointerover', () => {
            returnToMainMenu.setTint("0xf2b3ff");
        })

        returnToMainMenu.on('pointerout', () => {
            returnToMainMenu.clearTint();
        });

    }

});