var DialogScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:
        function DialogScene(){
            Phaser.Scene.call(this, {
                key: "DialogScene"
            });
        },
    
    init: function(data){
        console.log(data);
        this.currentDialogStatus = data.dialogStatus;
    },
    
    create: function(){
        this.dialogBox = this.add.sprite(640, 850, 'dialogBox').setInteractive();
        this.convoText = this.add.text(240, 810, "", {
            color: "#000000",
            align: "center",
            fontWeight: 'bold',
            font: "22px Arial",
            wordWrap: {
                width:800,
                useAdvancedWrap: true
            }
        }).setInteractive();
        this.convoName = this.add.text(400, 760, "", {
            color: "#ffffff",
            align: "center",
            fontWeight: 'bold',
            font: "30px Arial",
            wordWrap: {
                width:800,
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
        "Now, use your mouse pointer to fling the cat coin in whichever direction you like. The longer the indication line, the higher your fling power.", null];

            //click anywhere
        this.input.on("pointerdown", ()=>{
            switch(this.currentDialogStatus){
                case "tutorial1": 
                this.currentIndex++;
                this.convoText.text = this.convo0[this.currentIndex];
                this.convoName.text = "Neko Guide";
                if(this.convo0[this.currentIndex] === null){
                    this.currentIndex = -1;
                    this.scene.sleep('DialogScene');
                    this.scene.resume('WorldScene');
                }
            }
        })
    },


    //create all the conversations here, and then set interactive to update accordingly
    

});