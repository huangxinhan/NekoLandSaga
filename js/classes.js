class catParty {
    constructor() {
        this.allCats = [];
        this.currentTeam = [];
        this.totalCatFood = 0;
    }

    //search for a cat reference inside the all cats array and place it inside the current cat array
    swapCat(indexCurrent, indexAllCats) {
        this.currentTeam[indexCurrent] = this.allCats[indexAllCats];
    }

    obtainNewCat(cat) {
        this.allCats.push(cat);
    }

    obtainCatFood(amount) {
        this.totalCatFood += amount;
    }

    resetCats() {
        for (var i = 0; i < this.allCats.length; i++) {
            this.allCats[i].HP = this.allCats[i].maxHP;
            this.allCats[i].status = "none";
        }
    }


}

class Cat {
    constructor(name, level, description, rarity, skill, HP, ATK, DEF, WT, photo, photoCircle) {
        this.name = name;
        this.level = level;
        this.description = description;
        this.rarity = rarity;
        this.skill = skill;
        this.maxHP = HP;
        this.HP = this.maxHP;
        this.ATK = ATK;
        this.DEF = DEF;
        this.WT = WT;
        this.status = "none"; //current status being affected 
        this.photo = photo;
        this.photoCircle = photoCircle;
        this.type = "cat";
        this.exp = 0;
    }

    removeStatus() {
        this.status = null;
    }

    inflictStatus(status) {
        this.status = status;
    }
}

class Enemy {
    constructor(name, level, description, skill, HP, ATK, DEF, WT) {
        this.name = name;
        this.level = level;
        this.description = description;
        this.skill = skill;
        this.maxHP = HP;
        this.HP = this.maxHP;
        this.ATK = ATK;
        this.DEF = DEF;
        this.WT = WT; //weights affects movement speed etc. 
        this.status = "none";
        this.type = "enemy";
    }
}

class Skill {
    constructor(name, description) {
        this.name = name;
        this.description = description;
    }
}

class Status {
    constructor(name, description) {
        this.name = name;
        this.description = description;
    }
}

class HealthBar {

    constructor(scene, x, y, hp) {
        this.bar = new Phaser.GameObjects.Graphics(scene);

        this.x = x;
        this.y = y;
        this.value = hp;
        this.p = 76 / 100;
        this.maxHP = hp;
        this.draw();

        scene.add.existing(this.bar);
    }

    decrease(amount) {
        this.value -= amount;

        if (this.value < 0) {
            this.value = 0;
        }

        this.draw();

        return (this.value === 0);
    }

    increase(amount) {
        this.value += amount;

        if (this.value >= this.maxHP) {
            this.value = this.maxHP;
        }
        this.draw();
    }

    draw() {

        this.bar.clear();

        //  BG
        this.bar.fillStyle(0x000000);
        this.bar.fillRect(this.x, this.y, 200, 16);

        //  Health

        this.bar.fillStyle(0xffffff);
        this.bar.fillRect(this.x + 2, this.y + 2, 196, 12);

        if (this.value / this.maxHP < 0.25) {
            this.bar.fillStyle(0xff0000);
        } else {
            this.bar.fillStyle(0x00ff00);
        }

        var d = (this.value / this.maxHP) * 2 * 100;
        if (d <= 0) {
            d = 2;
        }
        if (d % 2 > 0) {
            d = d + 1;
        }

        if (d > 200) {
            d = 200;
        }

        this.bar.fillRect(this.x + 2, this.y + 2, d, 12);
    }

    draw2(hp, maxhp) {

        this.value = hp;
        this.maxHP = maxhp;
        this.bar.clear();

        //  BG
        this.bar.fillStyle(0x000000);
        this.bar.fillRect(this.x, this.y, 200, 16);

        //  Health
        this.bar.fillStyle(0xffffff);
        this.bar.fillRect(this.x + 2, this.y + 2, 196, 12);

        if (this.value / this.maxHP < 0.25) {
            this.bar.fillStyle(0xff0000);
        } else {
            this.bar.fillStyle(0x00ff00);
        }

        var d = (this.value / this.maxHP) * 2 * 100;
        if (d <= 0) {
            d = 2;
        }
        if (d % 2 > 0) {
            d = d + 1;
        }

        if (d > 200) {
            d = 200;
        }

        this.bar.fillRect(this.x + 2, this.y + 2, d, 12);
    }

}