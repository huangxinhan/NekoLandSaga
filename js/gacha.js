var GachaScene = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function GachaScene() {
        Phaser.Scene.call(this, {
            key: 'GachaScene'
        });
    },

    init: function (data) {
        console.log(data);
        this.catParty = data.catParty;
        console.log(this.catParty);
    },

    preload: function () {},

    create: function () {
        this.cameras.main.setBackgroundColor('rgba(250, 255, 219, 1)');
        //this.backgroundImage = this.physics.add.image(790, 482, 'nekolandsaga');
        this.graphics = this.add.graphics();
        this.graphics.lineStyle(1, 0xffffff);
        this.graphics.fillStyle(0x031f4c, 1);

        var catGachaText = this.physics.add.image(240, 200, 'catGachaText');

        var lureCat = this.physics.add.image(240, 350, 'lureCat').setInteractive();
        lureCat.on('pointerdown', () => {
            this.playGacha();
        });

        lureCat.on('pointerover', () => {
            lureCat.setTint("0xf2b3ff");
        })

        lureCat.on('pointerout', () => {
            lureCat.clearTint();
        });

        var returnToMainMenu = this.physics.add.image(240, 450, 'returnToMainMenu').setInteractive();
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

        this.catFoodText = this.add.text(110, 520, "Cat Food Left: " + this.catParty.totalCatFood, {
            color: "#000000",
            align: "center",
            fontWeight: 'bold',
            font: '32px Arial',
            wordWrap: {
                width: 800,
                useAdvancedWrap: true
            }
        }).setInteractive();

        this.rateText = this.add.text(1100, 30, "Rates:" + "\n" + "\n" +
            "☆☆☆ Cat: 60%" + "\n" + "\n" +
            "☆☆☆☆ Cat: 30%" + "\n" + "\n" +
            "☆☆☆☆☆ Cat: 10%" + "\n" + "\n" +
            "Mecha Cat ☆☆☆☆☆ Available Now!" + "\n" + "\n" + "High attack power! Inflicts massive AOE damage to nearby enemies!", {
                color: "#000000",
                align: "center",
                fontWeight: 'bold',
                font: '28px Arial',
                wordWrap: {
                    width: 500,
                    useAdvancedWrap: true
                }
            }).setInteractive();


        this.threeStarCats = [];
        this.fourStarCats = [];
        this.fiveStarCats = [];

        this.threeStarCats.push(new Cat("Soldier Cat", 1, "Terra", "Definitely a well-trained veteran, with many decades of combat experience.", "☆☆☆", new Skill("Sniping Tactics", "Deals 20 damage to the last enemy target.", 2), 20, 18, 16, 5, "soldierCat", "soldierCatCircle"));
        this.threeStarCats.push(new Cat("Jogging Cat", 1, "Anemo", "This cat is practicing for the annual Cat Marathon sponsored by Billionaire Cat. If he wins 1st place, he can finally get a pair of running shoes.", "☆☆☆", new Skill("Building up Stamina", "Upon activating the skill, unit can start its move phase again. (This move phase is treated as one turn)", 6), 15, 13, 13, 3, 'joggingCat', 'joggingCatCircle'));
        this.threeStarCats.push(new Cat("Chainsaw Cat", 1, "Terra", "Beware of this dangerous cat (the chainsaw is likely just a toy.)", "☆☆☆", new Skill("It's a real chainsaw!", "Inflicts 'Rage' status on itself for 1 turn.", 3), 14, 21, 10, 5, "chainsawCat", "chainsawCatCircle"));
        this.threeStarCats.push(new Cat("Homeowner Cats", 1, "Terra", "Through Billionaire Cat's 'Donate a Home' program, these lucky cats are able to secure their own cardboard house!", "☆☆☆", new Skill("Home Sweet Home", "Inflicts 'Iron Wall' status on itself for 1 turn. Recovers 25% HP.", 3), 23, 14, 20, 10, "homeownerCats", "homeownerCatsCircle"));
        this.threeStarCats.push(new Cat("Fishing Cat", 1, "Aqua", "Fishing is this cat's favorite hobby. However, the pond that this cat frequents is actually a hot spring.", "☆☆☆", new Skill("Catch of the day?", "Recovers a small amount of HP for all cats within 500 range of this unit.", 3), 15, 6, 21, 7, "fishingCat", "fishingCatCircle"));
        this.fourStarCats.push(new Cat("Chef Cat", 1, "Light", "The best chef in town, makes the best cat food!", "☆☆☆☆", new Skill("Some catfood for you!", "Recovers some HP for all cats.", 2), 20, 13, 26, 6, "chefCat", "chefCatCircle"));
        this.fourStarCats.push(new Cat('Scientist Cat', "Aqua", 1, "Genius of the century, accidently discovered the secrets of the universe!", "☆☆☆☆", new Skill("Toxic Chemicals", "Inflicts 'Poison' status on the last enemy target for 3 turns.", 1), 20, 29, 17, 3, 'scienceCat', 'scienceCatCircle'));
        this.fourStarCats.push(new Cat("Sumo Cat", 1, "Terra", "This immovable legendary cat is the world's greatest sumo master... as well as the world's most famous competitive eater.", "☆☆☆☆", new Skill("Immovable Rock", "Inflicts 'Iron Wall' status on itself for 5 turns. Recovers 50% HP.", 10), 27, 16, 28, 9, 'sumoCat', 'sumoCatCircle'));
        this.fourStarCats.push(new Cat("Billionaire Cat", "Dark", 1, "This is the richest cat ever. Pretty sure his name is Henry or something. This is the only cat that can afford shoes. If you ask kindly, he may even give you three dollars.", "☆☆☆☆", new Skill("Tax Evasion", "Activating this skill will yield a +20% cat food reward increase (Can be stacked).", 15), 15, 15, 15, 3, 'billionaireCat', 'billionaireCatCircle'));
        this.fourStarCats.push(new Cat('Knight Cat', 1, "Terra", "This cat somehow found some knight armor and a sword, then believed that it is a knight...", "☆☆☆☆", new Skill("Piercing Sword", "Inflicts 'Rage' status on itself for 1 turn.", 1), 25, 25, 25, 7, "knightCat", "knightCatCircle"));
        this.fiveStarCats.push(new Cat("Mecha Cat", 1, "Anemo", "This cat does not know how to operate this machinery at all. Be careful.", "☆☆☆☆☆", new Skill("Bullet Hell", "Inflicts massive AOE damage to all opponents within 500 range. Damage is increased for every cat within 500 range of the unit.", 5), 17, 39, 13, 5, "mechaCat", "mechaCatCircle"));
        this.fiveStarCats.push(new Cat("Twin Cats", 1, "None", "These cats hold some kind of divine power.", "☆☆☆☆☆", new Skill("Celestial Providence", "Upon activating the skill, unit can start its move phase again. (This move phase is treated as one turn)", 2), 33, 33, 12, 1, "twinCat", "twinCatCircle"));
        this.fiveStarCats.push(new Cat("Wizard Cat", 1, "Dark", "This wizard cat is about to summon a demon... or so it believed.", "☆☆☆☆☆", new Skill("Dark Summoning Arts", "Increase energy count by 5 for all cats within 800 range, except for Wizard Cat", 5), 20, 32, 26, 3, "wizardCat", "wizardCatCircle"));
        this.fiveStarCats.push(new Cat("Hesitant Cat", 1,"Light", "Its master demanded it to leap off a cliff and fly high to reach the stars above. However, as cats lack the wings for flight, this cat is hesitant to take that leap of faith.", "☆☆☆☆☆", new Skill("Have some Courage!", "Inflicts 18% of last enemy target's current HP as damage to the last enemy target. If there are at least 2 cat allies nearby, damage is increased from 18% to 30%.", 1), 28, 30, 26, 5, "hesitantCat", "hesitantCatCircle"));
        this.fiveStarCats.push(new Cat("Sushi Master Cat", "Terra", 1, "This cat has trained for over 500 years to make the world's finest sushi.", "☆☆☆☆☆", new Skill("All You Can Eat", "Fully recovers HP for cats within 500 range. Applies 'Satisfied' status to all cats within 500 range for 1 turn.", 5), 48, 13, 38, 10, 'sushiMasterCat', 'sushiMasterCatCircle'));

        this.allGachaCats = this.threeStarCats.concat(this.fourStarCats, this.fiveStarCats);
        this.dictionary = []; //associative array

        for (var i = 0; i < this.allGachaCats.length; i++) {
            this.dictionary[this.allGachaCats[i].name] = {
                image: this.physics.add.image(750, 500, this.allGachaCats[i].photo),
                name: this.allGachaCats[i].name
            }
            this.dictionary[this.allGachaCats[i].name].image.visible = false;
        }

        this.mechaCatPromotion = this.physics.add.image(1325, 700, "mechaCat");
        this.mechaCatPromotion.alpha = 0.3;

    },

    playGacha: function () {
        if (this.catParty.totalCatFood >= 5) {
            this.catParty.totalCatFood -= 5;
            var randomInteger = Math.floor(Math.random() * 100) + 1;
            if (randomInteger <= 60) {
                var randomCat = this.threeStarCats[Math.floor(Math.random() * this.threeStarCats.length)];
                var obtainedCat = JSON.parse(JSON.stringify(randomCat));
                var alreadyHas = false;
                for (var i = 0; i < this.catParty.allCats.length; i++) {
                    if (obtainedCat.name === this.catParty.allCats[i].name) {
                        this.dictionary[obtainedCat.name].image.visible = true;
                        this.sleep(200).then(() => {
                            //alert("Congratulations! You got: " + obtainedCat.name + " " + obtainedCat.rarity + "!" + " Your " + obtainedCat.name + "'s enhance level has increased by 1, and its stats has increased!");
                            this.dictionary[obtainedCat.name].image.visible = false;
                        })
                        this.catParty.allCats[i].enhanced++;
                        var randomPick = Math.floor(Math.random() * 100) + 1;
                        if (randomPick <= 33) {
                            this.catParty.allCats[i].HP++;
                            this.catParty.allCats[i].maxHP++;
                        } else if (randomPick > 33 && randomPick <= 66) {
                            this.catParty.allCats[i].ATK++;
                        } else {
                            this.catParty.allCats[i].DEF++;
                        }
                        alreadyHas = true;
                        this.catParty.obtainCatFood(5);
                    }
                }
                if (alreadyHas === false) {
                    this.dictionary[obtainedCat.name].image.visible = true;
                    this.sleep(200).then(() => {
                        //alert("Congratulations! You got: " + obtainedCat.name + " " + obtainedCat.rarity + "!");
                        this.dictionary[obtainedCat.name].image.visible = false;
                    });
                    this.catParty.obtainNewCat(obtainedCat);
                }
            } else if (randomInteger > 60 && randomInteger <= 90) {
                var randomCat = this.fourStarCats[Math.floor(Math.random() * this.fourStarCats.length)];
                var obtainedCat = JSON.parse(JSON.stringify(randomCat));
                var alreadyHas = false;
                for (var i = 0; i < this.catParty.allCats.length; i++) {
                    if (obtainedCat.name === this.catParty.allCats[i].name) {
                        this.dictionary[obtainedCat.name].image.visible = true;
                        this.sleep(200).then(() => {
                            //alert("Congratulations! You got: " + obtainedCat.name + " " + obtainedCat.rarity + "!" + " Your " + obtainedCat.name + "'s enhance level has increased by 1, and its stats has increased!");
                            this.dictionary[obtainedCat.name].image.visible = false;
                        })
                        this.catParty.allCats[i].enhanced++;
                        var randomPick = Math.floor(Math.random() * 100) + 1;
                        if (randomPick <= 33) {
                            this.catParty.allCats[i].HP++;
                            this.catParty.allCats[i].maxHP++;
                        } else if (randomPick > 33 && randomPick <= 66) {
                            this.catParty.allCats[i].ATK++;
                        } else {
                            this.catParty.allCats[i].DEF++;
                        }
                        alreadyHas = true;
                        this.catParty.obtainCatFood(5);
                    }
                }
                if (alreadyHas === false) {
                    this.dictionary[obtainedCat.name].image.visible = true;
                    this.sleep(200).then(() => {
                        //alert("Congratulations! You got: " + obtainedCat.name + " " + obtainedCat.rarity + "!");
                        this.dictionary[obtainedCat.name].image.visible = false;
                    });
                    this.catParty.obtainNewCat(obtainedCat);
                }
            } else {
                var randomCat = this.fiveStarCats[Math.floor(Math.random() * this.fiveStarCats.length)];
                var obtainedCat = JSON.parse(JSON.stringify(randomCat));
                var alreadyHas = false;
                for (var i = 0; i < this.catParty.allCats.length; i++) {
                    if (obtainedCat.name === this.catParty.allCats[i].name) {
                        this.dictionary[obtainedCat.name].image.visible = true;
                        this.sleep(200).then(() => {
                            //alert("Congratulations! You got: " + obtainedCat.name + " " + obtainedCat.rarity + "!" + " Your " + obtainedCat.name + "'s enhance level has increased by 1, and its stats has increased!");
                            this.dictionary[obtainedCat.name].image.visible = false;
                        })
                        this.catParty.allCats[i].enhanced++;
                        var randomPick = Math.floor(Math.random() * 100) + 1;
                        if (randomPick <= 33) {
                            this.catParty.allCats[i].HP++;
                            this.catParty.allCats[i].maxHP++;
                        } else if (randomPick > 33 && randomPick <= 66) {
                            this.catParty.allCats[i].ATK++;
                        } else {
                            this.catParty.allCats[i].DEF++;
                        }
                        alreadyHas = true;
                        this.catParty.obtainCatFood(5);
                    }
                }
                if (alreadyHas === false) {
                    this.dictionary[obtainedCat.name].image.visible = true;
                    this.sleep(200).then(() => {
                        //alert("Congratulations! You got: " + obtainedCat.name + " " + obtainedCat.rarity + "!");
                        this.dictionary[obtainedCat.name].image.visible = false;
                    });
                    this.catParty.obtainNewCat(obtainedCat);
                }
            }
        } else {
            alert("not enough cat food! 5x Cat Foods per roll! You current have: " + this.catParty.totalCatFood + " cat food!");
        }
        this.catFoodText.setText("Cat Food Left: " + this.catParty.totalCatFood);
    },

    sleep: function (ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

});