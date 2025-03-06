let NATION_X = 'X';
let NATION_Y = 'Y';
let NATION_Z = 'Z';
let NATION_NEW_LEADER = 'NewLeader';

// Sympathy scales for nations
let nationSympathy = {
    [NATION_X]: 50,
    [NATION_Y]: 50
};

// Track if rhetoric games have been played
let rhetoricGamePlayed = {
    [NATION_X]: false,
    [NATION_Y]: false,
    [NATION_Z]: false,
    [NATION_NEW_LEADER]: false
};

let nationGunBonus = {
    [NATION_X]: 1.5,  // Nation X gives most guns (150%)
    [NATION_Y]: 1.1,  // Nation Y gives more guns (110%)
    [NATION_Z]: 0.0,  // Nation Z gives no guns
    [NATION_NEW_LEADER]: 1.0  // New candidate gives normal amount
};

let rhetoricGamePlayedThisTurn = false;

// Dulensky slogans
let slogans = [
    "I need ammunition, not a ride.",
    "This might be the last time you see me alive",
    "Nobody is going to break us",
    "Look at us, everything is possible.",
    "Hang your kids' photos, and look at them each time you are making a decision",
    "Do prove that you are with us. Do prove that you will not let us go.",
    "We are a peaceful people!",
    "Nobody is going to break us; we're strong",
    "We're ready for anything."
];
let sloganButtons = [];


function resetRhetoricGameAvailability() {
        rhetoricGamePlayedThisTurn = false;
}

// Animation variables
let debateScreenY = 0;
let buttonAnimationOffset = 0;

/**
 * Get random effect based on nation
 * @param {string} nation - The nation being negotiated with
 * @returns {Object} - Effect object with guns, journalistPower, sympathy, money
 */
function getRandomEffect(nation) {
    // Base ranges for effects
    let ranges = {
        positive: [10, 50],
        neutral: [-10, 30],
        negative: [-30, 0]
    };
    
    let effect = {};
    
    switch(nation) {
        case NATION_Z:
            // Z only gives negative effects
            effect = {
                guns: randomInt(ranges.negative[0], ranges.negative[1]),
                journalistPower: randomInt(ranges.negative[0], ranges.negative[1]),
                sympathy: randomInt(ranges.negative[0], ranges.negative[1]) / 2, // Slower sympathy gain
                money: randomInt(ranges.negative[0], ranges.negative[1])
            };
            break;
            
        case NATION_X:
            // X gives more sympathy but less guns
            effect = {
                guns: Math.floor(randomInt(ranges.positive[0], ranges.positive[1]) * nationGunBonus[nation]),
                journalistPower: randomInt(ranges.positive[0], ranges.positive[1]),
                sympathy: randomInt(15, 25) / 2, // Slower sympathy gain
                money: randomInt(ranges.positive[0], ranges.positive[1])
            };
            break;
            
        case NATION_Y:
            // Y gives more guns after event20
            effect = {
                guns: Math.floor(randomInt(ranges.positive[0], ranges.positive[1]) * nationGunBonus[nation]),
                journalistPower: randomInt(ranges.positive[0], ranges.positive[1]),
                sympathy: randomInt(5, 15) / 2, // Slower sympathy gain
                money: randomInt(ranges.positive[0], ranges.positive[1])
            };
            break;
            
        case NATION_NEW_LEADER:
            // New Leader is initially open to negotiation
            effect = {
                guns: randomInt(ranges.neutral[0], ranges.neutral[1]),
                journalistPower: randomInt(ranges.neutral[0], ranges.neutral[1]),
                sympathy: randomInt(0, 10) / 2, // Slower sympathy gain
                money: randomInt(ranges.neutral[0], ranges.neutral[1])
            };
            break;
            
        default:
            effect = {
                guns: randomInt(ranges.positive[0], ranges.positive[1]),
                journalistPower: randomInt(ranges.neutral[0], ranges.neutral[1]),
                sympathy: randomInt(ranges.neutral[0], ranges.neutral[1]) / 2, // Slower sympathy gain
                money: randomInt(ranges.neutral[0], ranges.neutral[1])
            };
    }
    
    return effect;
}

/**
 * Get random integer between min and max (inclusive)
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} - Random integer
 */
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Get random selection of slogans
 * @param {number} count - Number of slogans to return
 * @returns {Array} - Array of slogan strings
 */
function getRandomSlogans(count) {
    let shuffled = [...slogans].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

/**
 * Hide all main game negotiation buttons
 */
function hideMainGameButtons() {
    let buttons = [buttonX, buttonY, buttonZ, buttonNewLeader, resourceShopButton];
    buttons.forEach(button => {
        if (button) button.hide();
    });
}

function showMainGameButtons() {
    if (!rhetoricGamePlayedThisTurn) {
        if (buttonX) buttonX.show();
        if (buttonY) buttonY.show();
        if (buttonZ) buttonZ.show();
        if (buttonNewLeader) buttonNewLeader.show();
        if (resourceShopButton) resourceShopButton.show();
    }
}

/**
 * Determine which nation the current rhetoric game is for
 * @returns {string} - Nation identifier
 */
function getCurrentNation() {
    let stateMap = {
        "rhetoricGame": NATION_X,
        "rhetoricGameInitialized": NATION_X,
        "rhetoricGameY": NATION_Y,
        "rhetoricGameYInitialized": NATION_Y,
        "rhetoricGameZ": NATION_Z,
        "rhetoricGameZInitialized": NATION_Z,
        "rhetoricGameNewLeader": NATION_NEW_LEADER,
        "rhetoricGameNewLeaderInitialized": NATION_NEW_LEADER
    };
    
    return stateMap[gameState] || "Unknown";
}

/**
 * Set up the rhetoric game screen and buttons
 */
function setupRhetoricGame() {
    // Reset debate screen sliding effect
    debateScreenY = height;
    
    // Hide main game buttons
    hideMainGameButtons();

    // Clear any existing buttons first
    clearRhetoricGameButtons();
    
    // Determine which nation we're negotiating with
    let nation = getCurrentNation();
    
    // Create slogan buttons
    let options = getRandomSlogans(3);
    options.forEach((slogan, i) => {
        let effect = getRandomEffect(nation);
        
        let button = createGameButton(slogan);
        // Fixed position with no animation initially
        button.position(50, 150 + 50);
        button.style('width', '300px');
        button.style('padding', '10px');
        button.mousePressed(function() {
            // Disable all buttons after use
            sloganButtons.forEach(btn => {
                if (btn) {
                    btn.attribute('disabled', 'true');
                    btn.style('opacity', '0.5');
                }
            });
            
            // Mark this rhetoric game as played
            rhetoricGamePlayedThisTurn = true;
            
            // Update X / Y sympathy
            if (nation === NATION_X || nation === NATION_Y) {
                nationSympathy[nation] += effect.sympathy;
                // Clamp between 0-100
                nationSympathy[nation] = Math.max(0, Math.min(100, nationSympathy[nation]));
                
                // Mark this nation's rhetoric game as played
                rhetoricGamePlayed[nation] = true;
            }

            applyEffect(effect);
            displayEffect(effect, nation);
            
            setTimeout(function() {
                gameState = "mainGame";
                clearRhetoricGameButtons();
                showMainGameButtons();
                drawMainGamePage();
            }, 2000);
        });
        sloganButtons.push(button);
    });
}

/**
 * Draw the rhetoric game screen
 */
function drawRhetoricGamePage() {
    image(debateImg, 0, 0, width, height);
    
    // Slide in the debate screen
    if (debateScreenY > 0) {
        debateScreenY -= 10;
        if (debateScreenY < 0) debateScreenY = 0;
    }
    
    // Update button positions
    sloganButtons.forEach((button, i) => {
        if (button) {
            button.position(50, 75 + (i * 80) + buttonAnimationOffset);
        }
    });
    
    // Display which nation you're negotiating with
    fill(5, 5, 5);
    textSize(16);
    textAlign(RIGHT)
    
    let nation = getCurrentNation();
    let nationText = "Negotiating";
    
    if (nation === NATION_X || nation === NATION_Y) {
        nationText = `Negotiating with ${nation} (Sympathy: ${nationSympathy[nation]})`;
    } else if (nation === NATION_Z) {
        nationText = `Negotiating with ${nation} (Sympathy: 0)`;
    } else if (nation === NATION_NEW_LEADER) {
        nationText = "Negotiating with New Leader";
    }
    
    text(nationText, 610, 55);
}

/**
 * Apply effect to player stats
 * @param {Object} effect - Effect object with guns, journalistPower, sympathy, money
 */
function applyEffect(effect) {
    // Apply effects
    player.guns += effect.guns + Math.floor(effect.journalistPower * 0.5); // Journalist power helps gun acquisition
    player.journalistPower += effect.journalistPower;
    player.sympathy += effect.sympathy;
    player.money += effect.money;
    
    // Ensure values don't go below zero
    player.guns = Math.max(0, player.guns);
    player.journalistPower = Math.max(0, player.journalistPower);
    player.sympathy = Math.max(0, player.sympathy);
    player.money = Math.max(0, player.money);
    
    console.log(`Guns: ${player.guns}, Journalist Power: ${player.journalistPower}, Sympathy: ${player.sympathy}, Money: ${player.money}`);
}

/**
 * Display effect on screen
 * @param {Object} effect - Effect object with guns, journalistPower, sympathy, money
 * @param {string} nation - Nation identifier
 */
function displayEffect(effect, nation) {
    fill(0);
    textSize(20);
    textAlign(CENTER, CENTER);
    
    let formatChange = (value) => `${value >= 0 ? '+' : ''}${value}`;
    
    // Make negative effects more visible for Z
    let textColor = (nation === NATION_Z) ? color(255, 0, 0) : color(0);
    fill(textColor);
    
    text(`Guns: ${formatChange(effect.guns)}`, width / 2, height / 2 - 40);
    text(`Journalist Power: ${formatChange(effect.journalistPower)}`, width / 2, height / 2 - 20);
    text(`Sympathy: ${formatChange(effect.sympathy)}`, width / 2, height / 2);
    text(`Money: ${formatChange(effect.money)}`, width / 2, height / 2 + 20);
    
    if (nation === NATION_X || nation === NATION_Y) {
        text(`${nation}'s Sympathy: ${nationSympathy[nation]}`, width / 2, height / 2 + 60);
    }
    
    // For nation Z, add warning text
    if (nation === NATION_Z) {
        fill(255, 0, 0);
        text("Z always harms your resources!", width / 2, height / 2 + 60);
    }
}

/**
 * Clear all rhetoric game buttons
 */
function clearRhetoricGameButtons() {
    sloganButtons.forEach(button => {
        if (button) button.remove();
    });
    sloganButtons = [];
}
