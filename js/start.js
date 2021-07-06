var config = {
    type: Phaser.GRAPHICS,
    parent: 'content',
    width: 1580,
    height: 964,
    roundPixels: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false // set to true to view zones
        }
    },
    scene: [
        BootScene,
        WorldScene,
        GachaScene,
        PartyScene,
        LevelSelectionScene,
        ancientCivilizationScene
    ]
};
var game = new Phaser.Game(config);