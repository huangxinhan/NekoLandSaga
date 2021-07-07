var ancientCivilizationScene = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function BootScene() {
        Phaser.Scene.call(this, {
            key: 'ancientCivilizationScene'
        });

    },

    init: function (data) {
        this.catParty = data.catParty;
        console.log(this.catParty);
    },

    preload: function () {},

    create: function () {
        this.cameras.main.setBackgroundColor('rgba(250, 255, 219, 1)');

        this.graphics = this.add.graphics();
        this.graphics.lineStyle(1, 0xffffff);
        this.graphics.fillStyle(0x031f4c, 1);

        var nekolandsagaText = this.physics.add.image(400, 120, 'nekolandsagaText');
        var promotionOddCat = this.physics.add.image(1270, 650, 'oddCat');
        promotionOddCat.alpha = 0.3;
        promotionOddCat.scale = 0.7;

        this.rateText = this.add.text(1050, 330, "Clear all levels in Arc 1 to obtain" + "\n" +
            "Odd Cat ★★★★★", {
                color: "#000000",
                align: "center",
                fontWeight: 'bold',
                font: '28px Arial',
                wordWrap: {
                    width: 500,
                    useAdvancedWrap: true
                }
            }).setInteractive();

        var arc1level1 = this.physics.add.image(400, 250, 'arc1level1').setInteractive();
        arc1level1.on('pointerdown', () => {
            if (this.catParty.currentTeam.length == 0) {
                alert("Must have at least one cat on your team to proceed!");
            } else {
                this.scene.start('WorldScene', {
                    "catParty": this.catParty,
                    "level": 0
                });
            }
        });

        arc1level1.on('pointerover', () => {
            arc1level1.setTint("0xf2b3ff");
        })

        arc1level1.on('pointerout', () => {
            arc1level1.clearTint();
        });

        var arc1level2 = this.physics.add.image(400, 350, 'arc1level2');
        arc1level2.on('pointerdown', () => {
            this.scene.start('WorldScene', {
                "catParty": this.catParty,
                "level": 2
            });
        });

        arc1level2.on('pointerover', () => {
            arc1level2.setTint("0xf2b3ff");
        })

        arc1level2.on('pointerout', () => {
            arc1level2.clearTint();
        });

        var arc1level3 = this.physics.add.image(400, 450, 'arc1level3');
        arc1level3.on('pointerdown', () => {
            this.scene.start('WorldScene', {
                "catParty": this.catParty,
                "level": 3
            });
        });

        arc1level3.on('pointerover', () => {
            arc1level3.setTint("0xf2b3ff");
        })

        arc1level3.on('pointerout', () => {
            arc1level3.clearTint();
        });

        var arc1level4 = this.physics.add.image(400, 550, 'arc1level4');
        arc1level4.on('pointerdown', () => {
            this.scene.start('WorldScene', {
                "catParty": this.catParty,
                "level": 4
            });
        });

        arc1level4.on('pointerover', () => {
            arc1level4.setTint("0xf2b3ff");
        })

        arc1level4.on('pointerout', () => {
            arc1level4.clearTint();
        });

        var arc1level5 = this.physics.add.image(400, 650, 'arc1level5');
        arc1level5.on('pointerdown', () => {
            this.scene.start('WorldScene', {
                "catParty": this.catParty,
                "level": 2
            });
        });

        arc1level5.on('pointerover', () => {
            arc1level5.setTint("0xf2b3ff");
        })

        arc1level5.on('pointerout', () => {
            arc1level5.clearTint();
        });

        var arc1level6 = this.physics.add.image(400, 750, 'arc1level6');
        arc1level6.on('pointerdown', () => {
            this.scene.start('WorldScene', {
                "catParty": this.catParty,
                "level": 6
            });
        });

        arc1level6.on('pointerover', () => {
            arc1level6.setTint("0xf2b3ff");
        })

        arc1level6.on('pointerout', () => {
            arc1level6.clearTint();
        });

        var arc1level7 = this.physics.add.image(400, 850, 'arc1level7');
        arc1level7.on('pointerdown', () => {
            this.scene.start('WorldScene', {
                "catParty": this.catParty,
                "level": 7
            });
        });

        arc1level7.on('pointerover', () => {
            arc1level7.setTint("0xf2b3ff");
        })

        arc1level7.on('pointerout', () => {
            arc1level7.clearTint();
        });

        var returnToMainMenu = this.physics.add.image(1250, 250, 'returnToMainMenu').setInteractive();
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


        if (this.catParty.levelsPassed >= 1) {
            arc1level2.setInteractive();
        }
        if (this.catParty.levelsPassed >= 2) {
            arc1level3.setInteractive();
        }
        if (this.catParty.levelsPassed >= 3) {
            arc1level4.setInteractive();
        }
        if (this.catParty.levelsPassed >= 4) {
            arc1level5.setInteractive();
        }
        if (this.catParty.levelsPassed >= 5) {
            arc1level6.setInteractive();
        }
        if (this.catParty.levelsPassed >= 6) {
            arc1level7.setInteractive();
        }


    }

});