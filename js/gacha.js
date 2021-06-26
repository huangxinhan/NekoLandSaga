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
        this.cameras.main.setBackgroundColor('rgba(250, 218, 94, 1)');
        this.backgroundImage = this.physics.add.image(790, 482, 'nekolandsaga');
        this.graphics = this.add.graphics();
        this.graphics.lineStyle(1, 0xffffff);
        this.graphics.fillStyle(0x031f4c, 1);

        this.graphics.strokeRect(90, 300, 300, 50);
        this.graphics.fillRect(90, 300, 300, 50);

        this.graphics.strokeRect(90, 400, 300, 50);
        this.graphics.fillRect(90, 400, 300, 50);


        var text = this.add.text(85,
            130, "Cat Gacha", {
                color: "#000000",
                align: "center",
                fontWeight: 'bold',
                font: '60px Arial',
                wordWrap: {
                    width: 800,
                    useAdvancedWrap: true
                }
            }).setInteractive();

        var text1 = this.add.text(145,
            310, "Play Gacha!", {
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
            this.playGacha();
        });

        var text2 = this.add.text(175,
            410, "Return", {
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
            this.scene.start('BootScene', {
                "catParty": this.catParty
            })
        });

        this.threeStarCats = [];
        this.fourStarCats = [];
        this.fiveStarCats = [];

        this.threeStarCats.push(new Cat("ChainSaw Cat", 1, "Beware of this dangerous cat (the chainsaw is likely just a toy.)", "☆☆☆", [], 14, 16, 13, 5, "chainsawCat", "chainsawCatCircle"));
        this.fourStarCats.push(new Cat("Chef Cat", 1, "The best chef in town, makes the best cat food!", "☆☆☆☆", [], 49, 132, 26, 5, "chefCat", "chefCatCircle"));
        this.fourStarCats.push(new Cat('Knight Cat', 1, "This cat somehow found some knight armor and a sword, then believed that it is a knight...", "☆☆☆☆", [], 30, 50, 50, 6, "knightCat", "knightCatCircle"));
        this.fiveStarCats.push(new Cat("Mecha Cat", 1, "This cat does not know how to operate this machinery at all. Be careful.", "☆☆☆☆☆", [], 100, 50, 60, 3, "mechaCat", "mechaCatCircle"));
        this.fiveStarCats.push(new Cat("Twin Cats", 1, "These cats hold some kind of divine power.", "☆☆☆☆☆", [], 30, 25, 10, 1, "twinCat", "twinCatCircle"));
        this.fiveStarCats.push(new Cat("Wizard Cat", 1, "This wizard cat is about to summon a demon... or so it believed.", "☆☆☆☆☆", [], 20, 40, 6, 3, "wizardCat", "wizardCatCircle"));
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
                        alert("congratulations! You got Cat Food x 5!");
                        alreadyHas = true;
                        this.catParty.obtainCatFood(5);
                    }
                }
                if (alreadyHas === false) {
                    alert("Congratulations! You got: " + obtainedCat.name + "!");
                    this.catParty.obtainNewCat(obtainedCat);
                }
            } else if (randomInteger > 60 && randomInteger <= 90) {
                var randomCat = this.fourStarCats[Math.floor(Math.random() * this.fourStarCats.length)];
                var obtainedCat = JSON.parse(JSON.stringify(randomCat));
                var alreadyHas = false;
                for (var i = 0; i < this.catParty.allCats.length; i++) {
                    if (obtainedCat.name === this.catParty.allCats[i].name) {
                        alert("congratulations! You got Cat Food x 5!");
                        alreadyHas = true;
                        this.catParty.obtainCatFood(5);
                    }
                }
                if (alreadyHas === false) {
                    alert("Congratulations! You got: " + obtainedCat.name + "!");
                    this.catParty.obtainNewCat(obtainedCat);
                }
            } else {
                var randomCat = this.fiveStarCats[Math.floor(Math.random() * this.fiveStarCats.length)];
                var obtainedCat = JSON.parse(JSON.stringify(randomCat));
                var alreadyHas = false;
                for (var i = 0; i < this.catParty.allCats.length; i++) {
                    if (obtainedCat.name === this.catParty.allCats[i].name) {
                        alert("congratulations! You got Cat Food x 5!");
                        alreadyHas = true;
                        this.catParty.obtainCatFood(5);
                    }
                }
                if (alreadyHas === false) {
                    alert("Congratulations! You got: " + obtainedCat.name + "!");
                    this.catParty.obtainNewCat(obtainedCat);
                }
            }
        } else {
            alert("not enough cat food! 5x Cat Foods per roll! You current have: " + this.catParty.totalCatFood + " cat food!");
        }
    }

});