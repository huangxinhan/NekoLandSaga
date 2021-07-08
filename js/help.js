var HelpScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize: function HelpScene() {
        Phaser.Scene.call(this, {
            key: 'HelpScene'
        });

    },

    init: function (data) {
        console.log(data)
        this.catParty = data.catParty;

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

        var nekolandsagaText = this.physics.add.image(400, 210, 'nekolandsagaText');

        var catGallery = this.physics.add.image(400, 350, 'catGallery').setInteractive();
        catGallery.on('pointerdown', () => {
            this.buttonClick.play();
            //to be implemented
        });

        catGallery.on('pointerover', () => {
            this.buttonHover.play();
            catGallery.setTint("0xf2b3ff");
        });

        catGallery.on('pointerout', () => {
            catGallery.clearTint();
        });

        var enemyGallery = this.physics.add.image(400, 450, 'enemyGallery').setInteractive();
        enemyGallery.on('pointerdown', () => {
            this.buttonClick.play();
        });

        enemyGallery.on('pointerover', () => {
            this.buttonHover.play();
            enemyGallery.setTint("0xf2b3ff");
        })

        enemyGallery.on('pointerout', () => {
            enemyGallery.clearTint();
        });

        var returnToMainMenu = this.physics.add.image(400, 550, 'returnToMainMenu').setInteractive();
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