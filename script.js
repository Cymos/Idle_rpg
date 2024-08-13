let totalMiningAttempts = 0;
let stoneAttempts = 0;
let goldAttempts = 0;
let silverAttempts = 0;
let stoneSuccess = 0;
let goldSuccess = 0;
let silverSuccess = 0;

let stoneMasteryLevel = 1;
let goldMasteryLevel = 1;
let silverMasteryLevel = 1;
const masteryThresholds = [10, 50, 100]; // thresholds for increasing mastery level

let stone = 0;
let gold = 0;
let silver = 0;
let miningXP = 0;
let miningLevel = 1;
let xpToNextMiningLevel = 10;
let pickaxeLevel = 1;
let actions = 1; // start with 1 action
let actionUpgradeCost = 5; // cost to upgrade actions
let isIdleMode = true;

// level that resources are unlocked at
const goldUnlockLevel = 3;
const silverUnlockLevel = 5;

// Update the UI with the current resource counts
function updateResources() {
    document.getElementById('stone').textContent = stone;
    document.getElementById('gold').textContent = gold;
    document.getElementById('silver').textContent = silver;

    // update stats section
    document.getElementById('statsStoneAttempts').textContent = stoneAttempts;
    document.getElementById('masteryStone').textContent = stoneMasteryLevel;
    document.getElementById('statsGoldAttempts').textContent = goldAttempts;
    document.getElementById('masteryGold').textContent = goldMasteryLevel;
    document.getElementById('statsSilverAttempts').textContent = silverAttempts;
    document.getElementById('masterySilver').textContent = silverMasteryLevel;
}

function updateLevelInfo() {
    document.getElementById('miningLevel').textContent = miningLevel;
    document.getElementById('miningXP').textContent = miningXP;
    document.getElementById('xpToNextMiningLevel').textContent = xpToNextMiningLevel;

    // update xp bar width
    const xpBar = document.getElementById('xpBar');
    const xpPercentage = (miningXP / xpToNextMiningLevel) * 100;
    xpBar.style.width = xpPercentage + '%';

    // unlock resources based on level
    if (miningLevel >= goldUnlockLevel) {
        document.getElementById('goldRadio').disabled = false;
        document.getElementById('goldResource').style.display = 'block';
    }
    if (miningLevel >= silverUnlockLevel) {
        document.getElementById('silverRadio').disabled = false;
        document.getElementById('silverResource').style.display = 'block';
    }
    updateSuccessChances();
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

// functions to increase mastery level when thresholds are met and to provide rewards based on mastery level
function increaseMastery(resource) {
    let masteryLevel = 1;
    let successCount = 0;

    switch (resource) {
        case 'stone':
            successCount = stoneSucces;
            masteryLevel = stoneMasteryLevel;
            break;
        case 'gold':
            successCount = goldSuccess;
            masteryLevel = goldMasteryLevel;
            break;
        case 'silver':
            successCount = silverSuccess;
            masteryLevel = silverMasteryLevel;
            break;
    }
    // check mastery thresholds
    if (successCount >= masteryThresholds[masteryLevel - 1] && masteryLevel < masteryThresholds.length) {
        masteryLevel++;
        switch (resource) {
            case 'stone':
                stoneMasteryLevel = masteryLevel;
                break;
            case 'gold':
                goldMasteryLevel = masteryLevel;
                break;
            case 'silver':
                silverMasteryLevel = masteryLevel;
                break;
        }
        showNotification(`Congratulations! You've reached Mastery Level ${masteryLevel} for ${resource}!`, 'success');
    }
}

// Simulate the mining process
function mine() {
    if (isIdleMode) {
        idleMine();
    } else {
        manualMine();
    }
}

function idleMine() {
    const mineButton = document.getElementById('mineButton');
    mineButton.disabled = true;

    // adjust the cooldown time based on the number of actions
    const cooldownTime = 6000 * actions;
    const intervalTime = 100; // update every 100ms (0.1 seconds)
    let elapsedTime = 0;

    // loop through the number of actions and mine resources each time
    for (let i = 0; i < actions; i++) {
        setTimeout(() => {
            mineResources();        
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

    mineResources();

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

function mineResources() {
    const selectedResource = document.querySelector('input[name="resource"]:checked').value;

    const stoneChance = getStoneChance();
    const goldChance = getGoldChance();
    const silverChance = getSilverChance();

    switch (selectedResource) {
        case 'stone':
            stoneAttempts++;
            if (Math.random() < getStoneChance()) {
                stone+=(pickaxeLevel+miningLevel) * stoneMasteryLevel;
                gainXP(100 * stoneMasteryLevel);
                showNotification('You mined some stone!', 'success');
            } else {
                showNotification('Mining action failed!', 'warning');
            }
            break;
        case 'gold':
            goldAttempts++;
            if (miningLevel >= goldUnlockLevel && Math.random() < getGoldChance()) {
                gold+=(pickaxeLevel+miningLevel * goldMasteryLevel);
                gainXP(2 * goldMasteryLevel);
                showNotification('You mined some gold!', 'success');
            } else {
                showNotification('Mining gold failed or is not unlocked yet!', 'warning');
            }
            break;
        case 'silver':
            silverAttempts++;
            if (miningLevel >= silverUnlockLevel && Math.random() < getSilverChance()) {
                silver+=(pickaxeLevel+miningLevel)*silverMasteryLevel;
                gainXP(3 * silverMasteryLevel);
                showNotification('You mined some silver!', 'success');
            } else {
                showNotification('Mining silver failed or is not unlocked yet!', 'warning');
            }
            break;
        default:
            showNotification('Unknown resource selected!', 'error');
            break;
    }
    updateResources();
}

function getStoneChance() {
    // base chance is 80%, increased with mastery
    return Math.min(0.8 + (pickaxeLevel - 1) * 0.05 + (miningLevel - 1) * 0.01 + (stoneMasteryLevel - 1) * 0.05, 1.0);
}

function getGoldChance() {
    return Math.min(0.2 + (pickaxeLevel - 1) * 0.03 + (miningLevel - goldUnlockLevel) * 0.01 + (goldMasteryLevel - 1) * 0.03, 1.0);
}

function getSilverChance() {
    return Math.min(0.5 + (pickaxeLevel - 1) * 0.02 + (miningLevel - silverUnlockLevel) * 0.01 + (silverMasteryLevel - 1) * 0.04, 1.0);
}

function updateSuccessChances() {
    document.getElementById('stoneChance').textContent = (getStoneChance() * 100).toFixed(1) + '%';
    if (miningLevel >= goldUnlockLevel) {
        document.getElementById('goldChance').textContent = (getGoldChance() * 100).toFixed(1) + '%';
    }
    if (miningLevel >= silverUnlockLevel) {
        document.getElementById('silverChance').textContent = (getSilverChance() * 100).toFixed(1) + '%';
    }
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