var PartyScene = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function PartyScene() {
        Phaser.Scene.call(this, {
            key: 'PartyScene'
        });
    },

    init: function (data) {
        console.log(data);
        this.catParty = data.catParty;
        console.log(this.catParty);
        //whether or not selection mode is on
        this.selectionMode = false;
        this.currentSlot = 0; //the slot to switch

        //positions to move the cats into
        this.position1 = [140, 250];
        this.position2 = [340, 250];
        this.position3 = [540, 250];
        this.position4 = [740, 250];
        this.positions = [];
        //stores all the positions
        this.positions.push(this.position1, this.position2, this.position3, this.position4);
        //stores all the party images
        this.partyImages = [];
    },

    preload: function () {},

    create: function () {
        this.cameras.main.setBackgroundColor('rgba(250, 255, 219, 1)');
        //this.backgroundImage = this.physics.add.image(790, 482, 'nekolandsaga');
        this.graphics = this.add.graphics();
        this.graphics.lineStyle(1, 0xffffff);
        this.graphics.fillStyle(0x031f4c, 1);

        this.graphics.strokeRect(890, 40, 300, 50);
        this.graphics.fillRect(890, 40, 300, 50);

        this.graphics.strokeRect(890, 235, 300, 50);
        this.graphics.fillRect(890, 235, 300, 50);

        this.sideMenu = this.physics.add.image(1430, 480, 'sideMenu');
        this.placeholder1 = this.physics.add.image(140, 250, 'placeholder').setInteractive();
        this.placeholder2 = this.physics.add.image(340, 250, 'placeholder').setInteractive();
        this.placeholder3 = this.physics.add.image(540, 250, 'placeholder').setInteractive();
        this.placeholder4 = this.physics.add.image(740, 250, 'placeholder').setInteractive();
        this.placeholder1.on('pointerdown', () => {
            this.selectionMode = true;
            this.currentSlot = 0;
        });
        this.placeholder2.on('pointerdown', () => {
            this.selectionMode = true;
            this.currentSlot = 1;
        });
        this.placeholder3.on('pointerdown', () => {
            this.selectionMode = true;
            this.currentSlot = 2;
        });
        this.placeholder4.on('pointerdown', () => {
            this.selectionMode = true;
            this.currentSlot = 3;
        });
        //this.placeholder5 = this.physics.add.image(140, 475, 'placeholder');

        var counter = -1;
        var dictionary = []; //associative array
        for (var i = 0; i < this.catParty.allCats.length; i++) {
            counter++;
            dictionary[i] = {
                image: this.physics.add.image(140 + ((i % 5) * 200), 475 + (Math.floor(counter / 5) * 150),
                    this.catParty.allCats[i].photoCircle).setInteractive(),
                index: i,
                name: this.catParty.allCats[i].name
            }
        }

        //adding current team images
        for(var i = 0; i < this.catParty.currentTeam.length; i++){
            this.partyImages[i] = this.physics.add.image(this.positions[i][0], this.positions[i][1], 
                this.catParty.currentTeam[i].photoCircle);
        }

        //will make them interactive here, 20 lines of code in total
        for (var i = 0; i < dictionary.length; i++) {
            switch (i) {
                case 0:
                    dictionary[i].image.on('pointerdown', () => {
                        if (this.selectionMode === true){
                            this.catParty.swapCat(this.currentSlot, 0);
                            if (this.partyImages[this.currentSlot] != null){
                                this.partyImages[this.currentSlot].destroy();
                            }
                            this.partyImages[this.currentSlot] = this.physics.add.image(this.positions[this.currentSlot][0], this.positions[this.currentSlot][1], 
                                this.catParty.allCats[this.currentSlot].photoCircle);
                        }
                    })
                    break;
                case 1:
                    break;
                case 2:
                    break;
                case 3:
                    break;
                case 4:
                    break;
                case 5:
                    break;
                case 6:
                    break;
                case 7:
                    break;
                case 8:
                    break;
                case 9:
                    break;
                case 10:
                    break;
                case 11:
                    break;
                case 12:
                    break;
                case 13:
                    break;
                case 14:
                    break;
                case 15:
                    break;
                case 16:
                    break;
                case 17:
                    break;
                case 18:
                    break;
                case 19:
                    break;
                case 20:
                    break;
            }
        }


        this.sideMenuText = this.add.text(1300, 25, "", {
            color: "#FFFFFF",
            align: "left",
            fontWeight: 'bold',
            font: '28px Arial',
            wordWrap: {
                width: 275,
                useAdvancedWrap: true
            }
        });

        var textParty = this.add.text(85,
            130, "Current Party", {
                color: "#000000",
                align: "center",
                fontWeight: 'bold',
                font: '40px Arial',
                wordWrap: {
                    width: 800,
                    useAdvancedWrap: true
                }
            }).setInteractive();

        var textAllCats = this.add.text(85,
            350, "All Cats", {
                color: "#000000",
                align: "center",
                fontWeight: 'bold',
                font: '40px Arial',
                wordWrap: {
                    width: 800,
                    useAdvancedWrap: true
                }
            }).setInteractive();

        var text = this.add.text(85,
            30, "Manage Team", {
                color: "#000000",
                align: "center",
                fontWeight: 'bold',
                font: '60px Arial',
                wordWrap: {
                    width: 800,
                    useAdvancedWrap: true
                }
            }).setInteractive();

        var text1 = this.add.text(985,
            50, "Return", {
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
            this.scene.start('BootScene', {
                "catParty": this.catParty
            })
        });

        var removeText = this.add.text(985,
            245, "Remove", {
                color: "#ffffff",
                align: "center",
                fontWeight: 'bold',
                font: '32px Arial',
                wordWrap: {
                    width: 800,
                    useAdvancedWrap: true
                }
            }).setInteractive();
    },

    resetText: function (temp) {
        if (temp.type === "cat") {
            this.sideMenuText.setText("Name: " + temp.name + "\n" + "\n" +
                "Level: " + temp.level + "\n" + "\n" +
                "EXP: " + temp.exp + "\n" + "\n" +
                "HP: " + temp.HP + "/" + temp.maxHP + "\n" + "\n" + "\n" +
                "Skill: " + "\n" + "\n" +
                "Attack: " + temp.ATK + "\n" + "\n" +
                "Defense: " + temp.DEF + "\n" + "\n" +
                "Weight: " + temp.WT + "\n" + "\n" +
                "Description: " + temp.description);
        }
    }
});