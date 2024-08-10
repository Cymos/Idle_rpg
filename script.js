// define some basic variables and functions to simulate the mining process
// define resources
let gold = 0;
let silver = 0;
let miningXP = 0;
let miningLevel = 1;
let xpToNextMiningLevel = 10;
let pickaxeLevel = 1;
let actions = 1; // start with 1 action
let actionUpgradeCost = 20; // cost to upgrade actions

// Update the UI with the current resource counts
function updateResources() {
    document.getElementById('gold').textContent = gold;
    document.getElementById('silver').textContent = silver;
}

function updateLevelInfo() {
    document.getElementById('miningLevel').textContent = miningLevel;
    document.getElementById('miningXP').textContent = miningXP;
    document.getElementById('xpToNextMiningLevel').textContent = xpToNextMiningLevel;

    // update xp bar width
    const xpBar = document.getElementById('xpBar');
    const xpPercentage = (miningXP / xpToNextMiningLevel) * 100;
    xpBar.style.width = xpPercentage + '%';
}

function gainXP(amount) {
    miningXP += amount;
    if (miningXP >= xpToNextMiningLevel) {
        miningLevelUp();
    }
    updateLevelInfo();
}

function miningLevelUp() {
    miningLevel++;
    miningXP = 0; // reset xp after levelling up
    xpToNextMiningLevel += 10; // increase the xp needed for the next level
    alert(`Congratulations! You've reached Mining Level ${miningLevel}!`);
}

// Simulate the mining process
function mine() {
    // disable the mine button
    const mineButton = document.getElementById('mineButton');
    mineButton.disabled = true;

    // adjust the cooldown time based on the number of actions
    const cooldownTime = 6000 * actions;
    const intervalTime = 100; // update every 100ms (0.1 seconds)
    let elapsedTime = 0;

    // loop through the number of actions and mine resources each time
    for (let i = 0; i < actions; i++) {
        setTimeout(() => {
            const goldChance = Math.random();
            const silverChance = Math.random();
        
            if (goldChance > 0.8) { // 20% chance to mine gold
                gold++;
                gold += pickaxeLevel * miningLevel;
                gainXP(2); // gain more xp for gold
            }
        
            if (silverChance > 0.5) { // 50% chnace to mine solver
                silver++;
                silver += pickaxeLevel * miningLevel;
                gainXP(1); // gain less xp for silver
            }
        
            updateResources();        
        }, i * 6000); // mine once every 6 seconds for each action
    }

    // countdown progress bar logic
    const countdownBar = document.getElementById('countdownBar');
    
    const countdownInterval = setInterval(() => {
        elapsedTime += intervalTime;
        const remainingTime = cooldownTime - elapsedTime;
        const countdownWidth = (remainingTime / cooldownTime) * 100;
        countdownBar.style.width = countdownWidth + '%';

        if (elapsedTime >= cooldownTime) {
            clearInterval(countdownInterval);
            mineButton.textContent = 'Mine!';
            mineButton.disabled = false;
            countdownBar.style.width = '0%'; // reset the countdown bar
        } else {
            mineButton.textContent = `Wait ${(remainingTime / 1000).toFixed(1)} seconds`;
        }
    }, intervalTime); // update the countdown bar every 100ms
}

    /*
    let countdown = cooldownTime / 1000;
    let countdownWidth = 100;

    // countdown feedback
    mineButton.textContent = `Wait ${countdown} seconds`;
    countdownBar.style.width = countdownWidth + '%';

    const countdownInterval = setInterval(() => {
        countdown --;
        countdownWidth -= 100 / (cooldownTime / 1000); // reduce the width proportionately to the time left
        
        if (countdown > 0) {
            mineButton.textContent = `Wait ${countdown} seconds`;
            countdownBar.style.width = countdownWidth + '%';
        } else {
            mineButton.textContent = 'Mine!';
            mineButton.disabled = false;
            countdownBar.style.width = '0%'; // reset the countdown bar
            clearInterval(countdownInterval);
        }
    }, 1000); */

function buyPickaxe() {
    const pickaxeCost = 10;
    if (gold >= pickaxeCost) {
        gold -= pickaxeCost;
        pickaxeLevel++;
        updateResources();
        updatePickaxeLevel();
    } else {
        alert("Not enough gold!");
    }
}

function buyActionUpgrade() {
    if (gold >= actionUpgradeCost) {
        gold -= actionUpgradeCost;
        actions++;
        actionUpgradeCost += 2; // increase the cost for the next upgrade

        updateResources();
        updateActionInfo();
    } else {
        alert('Not enough gold!');
    }
}

function updateActionInfo() {
    document.getElementById('actions').textContent = actions;
    document.getElementById('actionUpgradeCost').textContent = actionUpgradeCost;
}

function updatePickaxeLevel() {
    document.getElementById('pickaxeLevel').textContent = pickaxeLevel;
}

// Attach event listeners to the 'Mine' button
document.getElementById('mineButton').addEventListener('click', mine);
document.getElementById('buyPickaxe').addEventListener('click', buyPickaxe);
document.getElementById('buyActionUpgrade').addEventListener('click', buyActionUpgrade);