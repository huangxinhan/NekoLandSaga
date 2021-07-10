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
        this.buttonHover = this.sound.add('buttonHover');
        this.buttonClick = this.sound.add('buttonClick');
        this.cameras.main.setBackgroundColor('rgba(250, 255, 219, 1)');
        //this.backgroundImage = this.physics.add.image(790, 482, 'nekolandsaga');
        this.graphics = this.add.graphics();
        this.graphics.lineStyle(1, 0xffffff);
        this.graphics.fillStyle(0x031f4c, 1);
        this.highlight = this.physics.add.image(0, 0, 'highlight').setInteractive();
        this.highlight.visible = false;

        this.sideMenu = this.physics.add.image(1430, 480, 'sideMenu');
        this.placeholder1 = this.physics.add.image(140, 250, 'placeholder').setInteractive();
        this.placeholder2 = this.physics.add.image(340, 250, 'placeholder').setInteractive();
        this.placeholder3 = this.physics.add.image(540, 250, 'placeholder').setInteractive();
        this.placeholder4 = this.physics.add.image(740, 250, 'placeholder').setInteractive();
        this.placeholder1.on('pointerover', () => {
            if (this.catParty.currentTeam[0] != null) {
                this.resetText(this.catParty.currentTeam[0]);
            }
        });
        this.placeholder2.on('pointerover', () => {
            if (this.catParty.currentTeam[1] != null) {
                this.resetText(this.catParty.currentTeam[1]);
            }
        });
        this.placeholder3.on('pointerover', () => {
            if (this.catParty.currentTeam[2] != null) {
                this.resetText(this.catParty.currentTeam[2]);
            }
        });
        this.placeholder4.on('pointerover', () => {
            if (this.catParty.currentTeam[3] != null) {
                this.resetText(this.catParty.currentTeam[3]);
            }
        });

        this.placeholder1.on('pointerdown', () => {
            this.buttonClick.play();
            this.highlight.visible = true;
            this.highlight.x = this.position1[0];
            this.highlight.y = this.position1[1];
            this.selectionMode = true;
            this.currentSlot = 0;
            console.log(this.currentSlot)
        });
        this.placeholder2.on('pointerdown', () => {
            this.buttonClick.play();
            this.highlight.visible = true;
            this.highlight.x = this.position2[0];
            this.highlight.y = this.position2[1];
            this.selectionMode = true;
            this.currentSlot = 1;
            console.log(this.currentSlot)
        });
        this.placeholder3.on('pointerdown', () => {
            this.buttonClick.play();
            this.highlight.visible = true;
            this.highlight.x = this.position3[0];
            this.highlight.y = this.position3[1];
            this.selectionMode = true;
            this.currentSlot = 2;
            console.log(this.currentSlot)
        });
        this.placeholder4.on('pointerdown', () => {
            this.buttonClick.play();
            this.highlight.visible = true;
            this.highlight.x = this.position4[0];
            this.highlight.y = this.position4[1];
            this.selectionMode = true;
            this.currentSlot = 3;
            console.log(this.currentSlot)
        });
        //this.placeholder5 = this.physics.add.image(140, 475, 'placeholder');

        var counter = -1;
        this.dictionary = []; //associative array
        for (var i = 0; i < this.catParty.allCats.length; i++) {
            counter++;
            this.dictionary[i] = {
                image: this.physics.add.image(140 + ((i % 5) * 200), 475 + (Math.floor(counter / 5) * 150),
                    this.catParty.allCats[i].photoCircle).setInteractive(),
                index: i,
                name: this.catParty.allCats[i].name
            }
        }

        //adding current team images
        for (var i = 0; i < this.catParty.currentTeam.length; i++) {
            this.partyImages[i] = this.physics.add.image(this.positions[i][0], this.positions[i][1],
                this.catParty.currentTeam[i].photoCircle);
        }

        //will make them interactive here, 20 lines of code in total
        for (var i = 0; i < this.dictionary.length; i++) {
            switch (i) {
                case 0:
                    this.addInteractions(0);
                    break;
                case 1:
                    this.addInteractions(1);
                    break;
                case 2:
                    this.addInteractions(2);
                    break;
                case 3:
                    this.addInteractions(3);
                    break;
                case 4:
                    this.addInteractions(4);
                    break;
                case 5:
                    this.addInteractions(5);
                    break;
                case 6:
                    this.addInteractions(6);
                    break;
                case 7:
                    this.addInteractions(7);
                    break;
                case 8:
                    this.addInteractions(8);
                    break;
                case 9:
                    this.addInteractions(9);
                    break;
                case 10:
                    this.addInteractions(10);
                    break;
                case 11:
                    this.addInteractions(11);
                    break;
                case 12:
                    this.addInteractions(12);
                    break;
                case 13:
                    this.addInteractions(13);
                    break;
                case 14:
                    this.addInteractions(14);
                    break;
                case 15:
                    this.addInteractions(15);
                    break;
                case 16:
                    this.addInteractions(16);
                    break;
                case 17:
                    this.addInteractions(17);
                    break;
                case 18:
                    this.addInteractions(18);
                    break;
                case 19:
                    this.addInteractions(19);
                    break;
                case 20:
                    this.addInteractions(20);
                    break;
            }
        }


        this.sideMenuText = this.add.text(1300, 25, "", {
            color: "#FFFFFF",
            align: "left",
            fontWeight: 'bold',
            font: '20px Arial',
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

        var manageTeamText = this.physics.add.image(350, 60, 'manageTeamText');


        var returnToMainMenu = this.physics.add.image(1070, 60, 'returnToMainMenu').setInteractive();
        returnToMainMenu.on('pointerdown', () => {
            this.buttonClick.play();
            this.organizeTeam();
            localStorage.setItem('catParty', JSON.stringify(this.catParty));
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

        var removeFromParty = this.physics.add.image(1070, 250, 'removeFromParty').setInteractive();
        removeFromParty.on('pointerdown', () => {
            this.buttonClick.play();
            if (this.selectionMode === true) {
                this.catParty.currentTeam[this.currentSlot] = null; //empty out that cat
                this.partyImages[this.currentSlot].destroy();
                this.selectionMode = false;
                this.highlight.visible = false;
            }
        });

        removeFromParty.on('pointerover', () => {
            this.buttonHover.play();
            removeFromParty.setTint("0xf2b3ff");
        })

        removeFromParty.on('pointerout', () => {
            removeFromParty.clearTint();
        });

    },

    addInteractions: function (index) {
        this.dictionary[index].image.on('pointerover', () => {
            this.resetText(this.catParty.allCats[index]);
        })
        this.dictionary[index].image.on('pointerdown', () => {
            this.buttonClick.play();
            if (this.selectionMode === true) {
                var sameCat = false;
                for (var i = 0; i < this.catParty.currentTeam.length; i++){
                    if (this.catParty.currentTeam[i] != null && this.catParty.currentTeam[i].name === this.catParty.allCats[index].name){
                        sameCat = true;
                        break;
                    }
                }
                if (sameCat == true){
                    this.selectionMode = false;
                    this.highlight.visible = false;
                    alert("Team slot not selected or cat is already in party!");
                }
                else{
                    this.catParty.swapCat(this.currentSlot, index);
                    if (this.partyImages[this.currentSlot] != null) {
                        this.partyImages[this.currentSlot].destroy();
                    }
                    this.partyImages[this.currentSlot] = this.physics.add.image(this.positions[this.currentSlot][0], this.positions[this.currentSlot][1],
                        this.catParty.allCats[index].photoCircle);
                    this.selectionMode = false;
                    this.highlight.visible = false;
                }
            }
        })
    },

    resetText: function (temp) {
        if (temp.type === "cat") {
            this.sideMenuText.setText(temp.name + "\n" + "\n" +
                "Rarity: " + temp.rarity + "\n" + "\n" +
                "Element: " + temp.element + "\n" + "\n" +
                "Level: " + temp.level + "\n" + "\n" +
                "Enhance Level: " + temp.enhanced + "\n" + "\n" +
                "EXP: " + temp.exp + "\n" + "\n" +
                "HP: " + temp.HP + "/" + temp.maxHP + "\n" + "\n" +
                "Skill: " + temp.skill.name + "\n" + "\n" + temp.skill.description + "\n" + "\n" + "\n" + "\n" + "\n" + "Energy Cost: " + temp.skill.energyCost + "\n" + "\n" +
                "Attack: " + temp.ATK + "\n" + "\n" +
                "Defense: " + temp.DEF + "\n" + "\n" +
                "Weight: " + temp.WT + "\n" + "\n" +
                "Description: " + temp.description);
        }
    },

    organizeTeam: function () {
        var tempArray = [];
        this.catParty.currentTeam.forEach((element) => {
            if (!!element) {
                tempArray.push(element);
            }
        });
        this.catParty.currentTeam = tempArray;
    }
});