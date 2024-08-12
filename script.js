// define some basic variables and functions to simulate the mining process
// define resources
let gold = 0;
let silver = 0;
let miningXP = 0;
let miningLevel = 1;
let xpToNextMiningLevel = 10;
let pickaxeLevel = 1;
let actions = 1; // start with 1 action
let actionUpgradeCost = 5; // cost to upgrade actions
let isIdleMode = true;

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
    showNotification(`Congratulations! You've reached Mining Level ${miningLevel}!`);
    updateLevelInfo();
}

function showNotification(message, type = 'success') {
    const notificationArea = document.getElementById('notificationArea');
    const notification = document.createElement('div');
    notification.className = 'notification-' + type;
    notification.textContent = message;
    notificationArea.appendChild(notification);
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            notificationArea.removeChild(notification);
        }, 600); // !! Matches the css transition duration
    }, 3000);
}

/* Usage examples:
showNotification('Congrats! You\'ve reached level 2!');
showNotification('Not enough gold to buy the tool.', 'warning');
showNotification('Error processiong the request.', 'error');
*/

// Simulate the mining process
function mine() {
    if (isIdleMode) {
        idleMine();
    } else {
        manualMine();
    }
}

function idleMine() {
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
            mineButton.textContent = 'Auto';
            mineButton.disabled = false;
            countdownBar.style.width = '0%'; // reset the countdown bar
        } else {
            mineButton.textContent = `Wait ${(remainingTime / 1000).toFixed(1)} seconds`;
        }
    }, intervalTime); // update the countdown bar every 100ms
}

function manualMine() {
    const manualMineButton = document.getElementById('manualMineButton');
    manualMineButton.disabled = true;

    const cooldownTime = 2000; // Manual mining now has a 2 sec cooldown
    const intervalTime = 100; // Updates every 0.1 seconds
    let elapsedTime = 0;

    const goldChance = Math.random();
    const silverChance = Math.random();

    if (goldChance > 0.8) {
        gold += pickaxeLevel * miningLevel;
        gainXP(2)
    }

    if (silverChance > 0.5) {
        silver += pickaxeLevel * miningLevel
        gainXP(1);
    }
    updateResources();

    const manualCountdownBar = document.getElementById('manualCountdownBar');

    const countdownInterval = setInterval(() => {
        elapsedTime += intervalTime;
        const remainingTime = cooldownTime - elapsedTime;
        const countdownWidth = (remainingTime / cooldownTime) * 100;
        manualCountdownBar.style.width = countdownWidth + '%';

        if (elapsedTime >= cooldownTime) {
            clearInterval(countdownInterval);
            manualMineButton.textContent = 'Mine';
            manualMineButton.disabled = false;
            manualCountdownBar.style.width = '0%';
        } else {
            manualMineButton.textContent = `Wait ${(remainingTime / 1000).toFixed(1)} seconds`;
        }
    }, intervalTime); // update countdown bar every 100ms
}

function toggleMode() {
    isIdleMode = !isIdleMode;

    const modeButton = document.getElementById('toggleModeButton');
    const mineButton = document.getElementById('mineButton');
    const manualMiningDiv = document.getElementById('manualMining');

    if (isIdleMode) {
        modeButton.textContent = 'Switch to Manual Mining';
        mineButton.style.display = 'inline-block';
        manualMiningDiv.style.display = 'none';
    } else {
        modeButton.textContent = 'Switch to Idle Mining';
        mineButton.style.display = 'none';
        manualMiningDiv.style.display = 'inline-block';
    }
}

function buyPickaxe() {
    const pickaxeCost = 10;
    if (gold >= pickaxeCost) {
        gold -= pickaxeCost;
        pickaxeLevel++;
        updateResources();
        updatePickaxeLevel();
        showNotification('You bought a new pickaxe!', 'success');
    } else {
        showNotification("Not enough gold!", 'warning');
    }
}

function buyActionUpgrade() {
    if (gold >= actionUpgradeCost) {
        gold -= actionUpgradeCost;
        actions++;
        actionUpgradeCost += 2; // increase the cost for the next upgrade
        updateResources();
        updateActionInfo();
        showNotification('You increased your actions', 'success');
    } else {
        showNotification('Not enough gold!', 'warning');
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
document.getElementById('manualMineButton').addEventListener('click', mine);
document.getElementById('toggleModeButton').addEventListener('click', toggleMode);
document.getElementById('buyPickaxe').addEventListener('click', buyPickaxe);
document.getElementById('buyActionUpgrade').addEventListener('click', buyActionUpgrade);