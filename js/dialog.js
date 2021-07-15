var DialogScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize: function DialogScene() {
        Phaser.Scene.call(this, {
            key: "DialogScene"
        });
    },

    init: function (data) {
        console.log(data);
        this.currentDialogStatus = data.dialogStatus;
    },

    create: function () {
        this.dialogBox = this.add.sprite(640, 850, 'dialogBox').setInteractive();
        this.convoText = this.add.text(240, 810, "", {
            color: "#000000",
            align: "center",
            fontWeight: 'bold',
            font: "22px Arial",
            wordWrap: {
                width: 800,
                useAdvancedWrap: true
            }
        }).setInteractive();
        this.convoName = this.add.text(400, 760, "", {
            color: "#ffffff",
            align: "center",
            fontWeight: 'bold',
            font: "30px Arial",
            wordWrap: {
                width: 800,
                useAdvancedWrap: true
            }
        }).setInteractive();

        this.currentIndex = -1; //index to access the conversation arrays
        this.convo0 = ["Welcome to Neko Land Saga!", "This tutorial will teach you the basics regarding how the game works.", "Here we will go through some basics.",
            "Hover the mouse over your cat coin, and you will see its stats on the right side of the screen. Likewise, you can also hover your mouse over an enemy coin to check its stats.", "The HP, ATK, DEF, and Weight stats will determine how your cat moves and how much damage it can deal/take.",
            "The higher your ATK stat, the more damage your cat will deal upon colliding with an enemy coin!", "Likewise, the higher your defense stat, the less damage your cat will take when an enemy coin collides into you!",
            "There are five elements in this game. Anemo, Terra, Aqua, Light, and Dark. An element may have an elemental advantage over another, allowing it to deal increased damage against the other element, while receiving less damage from the other element.",
            "Anemo has an elemental advantage over Aqua. Aqua has an elemental advantage over Terra. Terra has an elemental advantage over Anemo. Light and Dark types both have an elemental advantage over each other, meaning that they will deal increased damage against each other. However, they also resist elements of their same type.",
            "When your HP hits 0, your cat coin will be destroyed, and you will be unable to use that coin in battle for the rest of the game.", "You are allowed to have a maximum of four cat units on a single team. If your entire team gets wiped out, it's game over.",
            "Phew that was a lot of explaining but let's take a breath and continue.", "During your turn, you will see a line indicating the angle and power you would like to aim your cat coin at.",
            "Upon clicking, your cat coin will fling torwards that direction. If it hits any enemy coins, it will deal damage based on your coin's ATK and velocity. Therefore, the faster your cat coin is traveling, the higher your damage.",
            "Once your cat coin comes to a stop, you may activate your cat's unique skill. The skills will cost a certain amount of energy, so look for that 'energy cost' label on the right side of the screen.",
            "You will get one energy per turn, and using the skill will consume the same amount of energy as the 'energy cost' of the skill.",
            "You may also choose to skip your skill phase by clicking the 'Skip Turn' button.", "Notice that some skills may inflict status effects, look out for what they do!",
            "Lastly, move the camera by pressing up, down, left, right cursor buttons to navigate the map. To focus on a specific cat, click a cat icon on the top left corner.",
            "You can also click on the minimap icon near the top of the screen to reveal a minimap.",
            "Now, use your mouse pointer to fling the cat coin in whichever direction you like. The longer the indication line, the higher your fling power.", null
        ];

        this.convo1 = ["Now, we watch out for our enemy's movements. Some enemies may be aggressive and constantly pursue the player, and some enemies may not move at all.",
            "Warrior Dog will pursue the player, and use its skill whenever possible.", "Some enemies may even have multiple skills, so be very careful!", null
        ]

        this.convo2 = ["Very nice! You've mastered the basics of Neko Land Saga. Defeating an enemy will yield you EXP, and when you reach 100 EXP, you will level up! The stats of the cat will increase with each level up!",
            "Now, after completing this tutorial, head to 'Cat Gacha' on the main menu to lure more cats and have them join your team! You have been provided with 50 cat food as a new player bonus! Go on, try your luck!", null
        ]

        this.convo3 = ["Reinforcements! In some levels, additional reinforcement enemies may appear during specific turns.",
        "Be careful!", null
    ]

        //click anywhere
        this.input.on("pointerdown", () => {
            switch (this.currentDialogStatus) {
                case "tutorial0":
                    this.currentIndex++;
                    this.convoText.text = this.convo0[this.currentIndex];
                    this.convoName.text = "Neko Guide";
                    if (this.convo0[this.currentIndex] === null) {
                        this.currentIndex = -1;
                        this.scene.stop('DialogScene');
                        this.scene.resume('WorldScene');
                    }
                break; 
                case "tutorial1":
                    this.currentIndex++;
                    this.convoText.text = this.convo1[this.currentIndex];
                    this.convoName.text = "Neko Guide";
                    if (this.convo1[this.currentIndex] === null) {
                        this.currentIndex = -1;
                        this.scene.stop('DialogScene');
                        this.scene.resume('WorldScene');
                    }
                break; 
                case "tutorial2":
                    this.currentIndex++;
                    this.convoText.text = this.convo2[this.currentIndex];
                    this.convoName.text = "Neko Guide";
                    if (this.convo2[this.currentIndex] === null) {
                        this.currentIndex = -1;
                        this.scene.stop('DialogScene');
                        this.scene.resume('WorldScene');
                    } 
                break; 
                case "tutorial3":
                    this.currentIndex++;
                    this.convoText.text = this.convo3[this.currentIndex];
                    this.convoName.text = "Neko Guide";
                    if (this.convo3[this.currentIndex] === null) {
                        this.currentIndex = -1;
                        this.scene.stop('DialogScene');
                        this.scene.resume('WorldScene');
                    } 
            }
        })
    },


    //create all the conversations here, and then set interactive to update accordingly


});