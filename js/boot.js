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
            this.catParty.obtainCatFood(20);
        } else {
            this.catParty = data.catParty;
        }
        console.log(this.catParty);
    },

    preload: function () {
        this.load.image("nekolandsaga", 'assets/text/nekolandsaga.png');
        this.load.image('placeholder', 'assets/text/placeholder.png');
        this.load.image('tiles', 'assets/map/Mapset.png');
        this.load.image('useSkill', 'assets/text/useSkill.png');
        this.load.image('skipTurn', 'assets/text/skipTurn.png');
        this.load.image('chefCat', 'assets/cats/chefCat.png');
        this.load.image('chefCatCircle', 'assets/cats/chefCatCircle.png');
        this.load.image('knightCat', 'assets/cats/knightCatCircle.png');
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
    },

    create: function () {
        this.cameras.main.setBackgroundColor('rgba(250, 218, 94, 1)');
        this.backgroundImage = this.physics.add.image(790, 482, 'nekolandsaga');
        this.graphics = this.add.graphics();
        this.graphics.lineStyle(1, 0xffffff);
        this.graphics.fillStyle(0x031f4c, 1);

        this.graphics.strokeRect(90, 300, 300, 50);
        this.graphics.fillRect(90, 300, 300, 50);

        this.graphics.strokeRect(90, 400, 300, 50);
        this.graphics.fillRect(90, 400, 300, 50);

        this.graphics.strokeRect(90, 500, 300, 50);
        this.graphics.fillRect(90, 500, 300, 50);

        this.graphics.strokeRect(90, 600, 300, 50);
        this.graphics.fillRect(90, 600, 300, 50);

        var text = this.add.text(85,
            130, "Neko Land Saga", {
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
            310, "    START    ", {
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
            410, "CAT GACHA", {
                color: "#ffffff",
                align: "center",
                fontWeight: 'bold',
                font: '32px Arial',
                wordWrap: {
                    width: 800,
                    useAdvancedWrap: true
                }
            }).setInteractive();
        text2.on('pointerdown', () => {
            this.scene.start('GachaScene', {
                "catParty": this.catParty
            })
        })

        var text3 = this.add.text(125,
            510, "MANAGE TEAM", {
                color: "#ffffff",
                align: "center",
                fontWeight: 'bold',
                font: '32px Arial',
                wordWrap: {
                    width: 800,
                    useAdvancedWrap: true
                }
            }).setInteractive();
        text3.on('pointerdown', () => {
            this.scene.start("PartyScene", {
                "catParty": this.catParty
            })
        })

        var text4 = this.add.text(185,
            610, "HELP", {
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