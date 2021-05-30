function BattleUnit(name) {
    this.name = name;
    var health = 100;
    var rechargeTime = 1000 * health / 100;
    this.won = () => {
        console.log(this.name + ':', 'I won!');
        clearInterval(runId);
    };
    var damage = () => {
        // https://stackoverflow.com/questions/4959975/generate-random-number-between-two-numbers-in-javascript
        // if critical chance is bigger than random(0, 100) then multiply damage with damage multiplier
        if (criticalChance() >= Math.random() * 101) {
            console.log('Critical damage!');
            return health / 100 * this.damageMultiplier;
        } else
            return health / 100;
    };
    // calculate critical chance for damage multiplier
    var criticalChance = () => { return 10 - health / 10; };
    // we provide function for other units to attack ourselves; kinda stupid :)
    this.applyDamage = (dmg) => {
        health -= dmg;
        console.log(this.name, 'got hit! Damage:', dmg, '- Health:', health);
        //return health;
        if (health <= 0) {
            console.log(this.name + ':', 'I\'m dead!');
            clearInterval(runId);
            return 'dead';
        } else {
            return 'alive';
        }
    };
    // running interval with function that checks recharge time and activate attack when fully recharged
    var runId = setInterval(() => {
        if (rechargeTime >= 1000 * health / 100) {
            // we attacked so we need to reset recharge time
            rechargeTime = 0;
            this.attack(this, damage());
        } else {
            rechargeTime += 1;
        }
    }, 1);
}

BattleUnit.prototype.damageMultiplier = Math.ceil(Math.random() * 5);

// check if there is anyone left to attack then choose random unit to attack
// make sure not to attack ourselves
// only one unit in array means we are alone means we won
BattleUnit.prototype.attack = (attacker, dmg) => {
    // https://stackoverflow.com/questions/2532218/pick-random-property-from-a-javascript-object
    var keys = Object.keys(BattleUnit.prototype.allUnits);
    if (keys.length == 1) {
        attacker.won();
        return;
    }
    // https://stackoverflow.com/questions/5767325/how-can-i-remove-a-specific-item-from-an-array
    // we won't attack ourselves
    keys = keys.filter(e => e !== attacker.name);

    // https://stackoverflow.com/questions/4959975/generate-random-number-between-two-numbers-in-javascript
    var rndUnit = Math.floor(Math.random() * keys.length);
    console.log(attacker.name, 'attacked', keys[rndUnit]);
    // https://stackoverflow.com/questions/711536/javascript-define-a-variable-if-it-doesnt-exist
    var attackerStats = BattleUnit.prototype.stats[attacker.name] || { attacker: 0, victim: 0 };
    var victimStats = BattleUnit.prototype.stats[keys[rndUnit]] || { attacker: 0, victim: 0 };
    attackerStats.attacker++;
    victimStats.victim++;
    BattleUnit.prototype.stats[attacker.name] = attackerStats;
    BattleUnit.prototype.stats[keys[rndUnit]] = victimStats;
    console.log(BattleUnit.prototype.stats);
    if (BattleUnit.prototype.allUnits[keys[rndUnit]].applyDamage(dmg) == 'dead') {
        // https://stackoverflow.com/questions/208105/how-do-i-remove-a-property-from-a-javascript-object
        delete BattleUnit.prototype.allUnits[keys[rndUnit]];
    }
};

BattleUnit.prototype.stats = {};

// https://stackoverflow.com/questions/1535631/static-variables-in-javascript
// https://stackoverflow.com/questions/15174187/properties-of-javascript-function-objects
// https://stackoverflow.com/questions/572897/how-does-javascript-prototype-work
// https://stackoverflow.com/questions/19526456/get-all-instances-of-class-in-javascript
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/new
// https://stackoverflow.com/questions/4166616/understanding-the-difference-between-object-create-and-new-somefunction
BattleUnit.prototype.allUnits = { 'Unit1': new BattleUnit('Unit1'), 
                                    'Unit2': new BattleUnit('Unit2'), 
                                    'Unit3': new BattleUnit('Unit3'), 
                                    'Unit4': new BattleUnit('Unit4'), 
                                    'Unit5': new BattleUnit('Unit5') 
                                };
