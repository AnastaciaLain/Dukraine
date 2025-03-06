// for some reason has to exist or game breaks
let game;

// set up territory board
let grid = [];
let gridSize = 40;
let boxSize = 10;
let startX = 380;
let startY = 189;

// Assets folder
let img;
let debateImg;

// Game buttons
let buttonX, buttonY, buttonZ, buttonNewLeader, buttonNegotiatePeace, buttonContinueFighting, resourceShopButton;

let shopButtons = [];
let shopVisible = false;

// Game state tracking
let playerMoves = 0;
let turnCounter = 0;
let canMakeMoves = true; //hopefully im making this work //nevermind i might not even have to

// Event shit
let eventText = "";
let eventTextTimeout = null;
let currentTurnEvents = [];
let randomEvents = [];

/**
 * Preload game assets
 */
function preload() {
    img = loadImage('assets/main.png');
    debateImg = loadImage('assets/debate.png');
}

function setupMainGame() {
    // Initialize player and enemy
    player = new Character('Du', 100, 60, 40);
    enemy = new Character('Z', 9999, 9999, 9999);
    
    // Create game instance
    game = new Game(player, enemy);

    // Initialize grid with ownership
    initializeGrid();
    
    // Create negotiation buttons
    createNegotiationButtons();
    
    // Set up random events
    setupRandomEvents();
    
    // Add resource conversion button to main game
}

/**
 * Initialize the game grid
 */
function initializeGrid() {
    grid = [];
    let enemyPercentage = 0.65;
    
    for (let i = 0; i < gridSize; i++) {
        if (i < gridSize * enemyPercentage) {
            grid.push({ owner: 'enemy' });
        } else {
            grid.push({ owner: 'player' });
        }
    }
}

/**
 * Create all negotiation buttons
 */
function createNegotiationButtons() {
    // X negotiation button
    buttonX = createGameButton('Negotiate with X');
    buttonX.position(3, 220);
    buttonX.mousePressed(() => {
        gameState = "rhetoricGame";
        setupRhetoricGame();
    });
    
    // Y negotiation button
    buttonY = createGameButton('Negotiate with Y');
    buttonY.position(200, 296);
    buttonY.mousePressed(() => {
        gameState = "rhetoricGameY";
        setupRhetoricGame();
    });
    
    // Z negotiation button
    buttonZ = createGameButton('Negotiate with Z');
    buttonZ.position(520, 230);
    buttonZ.mousePressed(() => {
        gameState = "rhetoricGameZ";
        setupRhetoricGame();
    });

    resourceShopButton = createGameButton("Resource Shop");
    resourceShopButton.position(400, 255);
    resourceShopButton.mousePressed(showResourceShop);
}

/**
 * Draw the main game screen
 */
function drawMainGamePage() {
    background(255);
    image(img, 0, 0, width, height);
    drawGrid();
    drawPlayerStats();
    drawNationSympathy();
}

/**
 * Draw player statistics
 */
function drawPlayerStats() {
    fill(0);
    textSize(16);
    textAlign(RIGHT);
    
    let stats = [
        { label: "Turn:    ", value: turnCounter, y: 10 },
        { label: "Money:", value: player.money, y: 30 },
        { label: "Guns:  ", value: player.guns, y: 50 },
        { label: "Journalist Power:  ", value: player.journalistPower, y: 70 }
    ];
    
    stats.forEach(stat => {
        text(`${stat.label}    ${stat.value}`, 410, stat.y);
    });
}

/**
 * Draw nation sympathy values if they've been interacted with
 */
function drawNationSympathy() {
    if (typeof nationSympathy === 'undefined') return;
    
    fill(0);
    textSize(16);
    textAlign(LEFT);
    
    let nations = [
        { id: 'X', y: 320 },
        { id: 'Y', y: 340 }
    ];
    
    nations.forEach(nation => {
        if (rhetoricGamePlayed[nation.id]) {
            text(`${nation.id} Sympathy: ${nationSympathy[nation.id]}`, 20, nation.y);
        }
    });
}

/**
 * Draw the game grid
 */
function drawGrid() {
    for (let i = 0; i < gridSize; i++) {
        let x = startX + (i % 10) * boxSize;
        let y = startY + Math.floor(i / 10) * boxSize;
        
        // Set color based on owner
        if (grid[i].owner === 'player') {
            fill(0, 255, 0);     // Green for player
        } else if (grid[i].owner === 'enemy') {
            fill(255, 0, 0);     // Red for enemy
        } else {
            fill(0, 0, 255);     // Blue for neutral
        }
        
        rect(x, y, boxSize, boxSize);
    }
}

function findConvertibleEnemySquares() {
    let convertible = [];
    for (let i = 0; i < gridSize; i++) {
        if (grid[i].owner === 'enemy') {
            let neighbors = getNeighbors(i);
            let adjacentToPlayer = neighbors.some(neighbor => grid[neighbor] && grid[neighbor].owner === 'player');
            if (adjacentToPlayer) {
                convertible.push(i);
            }
        }
    }
    return convertible;
}

function displayEventText(text) {
    eventText = text;
    
    // Clear any existing timeout
    if (eventTextTimeout) {
        clearTimeout(eventTextTimeout);
    }
    
    // Set timeout to clear text after 5 seconds
    eventTextTimeout = setTimeout(() => {
        eventText = "";
    }, 5000);
}

function triggerRandomEvent() {
    // Don't trigger random events during special turn events
    if (currentTurnEvents.length > 0 || turnCounter === 15 || turnCounter === 20) return;
    
    // 70% chance of random event
    if (Math.random() < 0.7) {
        let randomEvent = randomEvents[Math.floor(Math.random() * randomEvents.length)];
        randomEvent.effects.call(randomEvent);
        
        // Add to current turn events
        currentTurnEvents.push(randomEvent);
    }
}

function clearTurnEvents() {
    currentTurnEvents = [];
}

// Draw event text at bottom of screen
function drawEventText() {
    if (eventText) {
        fill(0);
        rect(0, height - 40, width, 40);
        fill(255);
        textSize(16);
        textAlign(CENTER, CENTER);
        text(eventText, width/2, height - 20);
    }
}

function setupRandomEvents() {
    randomEvents = [
        new Event(
            "Supply Train",
            "A supply train has arrived with additional weapons.",
            function() {
                player.guns += 25;
                displayEventText(this.description);
            }
        ),
        new Event(
            "Foreign Aid",
            "Foreign aid has boosted your financial reserves.",
            function() {
                player.money += 40;
                displayEventText(this.description);
            }
        ),
        new Event(
            "Media Coverage",
            "International media has increased coverage of your cause.",
            function() {
                player.journalistPower += 20;
                player.sympathy += 5;
                displayEventText(this.description);
            }
        ),
        new Event(
            "Popular Support",
            "Your people rally behind your cause, offering support.",
            function() {
                player.sympathy += 10;
                displayEventText(this.description);
            }
        ),
        new Event(
            "Tactical Setback",
            "Your forces have experienced a tactical setback.",
            function() {
                player.guns = Math.max(0, player.guns - 15);
                displayEventText(this.description);
            }
        ),
        new Event(
            "Economic Pressure",
            "Economic sanctions have affected your reserves.",
            function() {
                player.money = Math.max(0, player.money - 20);
                displayEventText(this.description);
            }
        ),
        new Event(
            "Propaganda Campaign",
            "Enemy propaganda has diminished public support.",
            function() {
                player.sympathy = Math.max(0, player.sympathy - 8);
                displayEventText(this.description);
            }
        ),
        new Event(
            "Military Intelligence",
            "Military intelligence provides strategic advantage.",
            function() {
                // Convert one enemy tile to player if possible
                let enemySquares = findConvertibleEnemySquares();
                if (enemySquares.length > 0) {
                    let randomSquare = enemySquares[Math.floor(Math.random() * enemySquares.length)];
                    takeOverLand('player', randomSquare);
                    displayEventText(this.description + " You've gained territory!");
                } else {
                    displayEventText(this.description + " But no territory could be gained.");
                }
            }
        )
    ];
}

function triggerEvent15() {
    displayEventText("X is holding an election with a new popular leader that seems to be indifferent to the struggles of dU.");
    
    // Create New Leader button if it doesn't exist
    if (!buttonNewLeader) {
        buttonNewLeader = createGameButton('Negotiate with New Leader');
        buttonNewLeader.position(500, 400);
        buttonNewLeader.mousePressed(function(){
            gameState = "rhetoricGameNewLeader";
            setupRhetoricGame();
        });
    }
    
    // Update X nation's state
    nations.X.turn += 1;
    nations.X.eventID = 15;
}

function triggerEvent20() {
    displayEventText("The new leader has won the election and will start supporting your enemy, Z.");
    
    // Remove New Leader button if it exists
    if (buttonNewLeader) {
        buttonNewLeader.remove();
    }
    
    // Negatively impact player resources
    player.guns = Math.max(0, player.guns - 30);
    player.journalistPower = Math.max(0, player.journalistPower - 20);
    player.sympathy = Math.max(0, player.sympathy - 15);
    
    // Update nation relationships
    nations.X.sympathy = Math.max(0, nations.X.sympathy - 30);
    nations.X.power = 0.5;  // Reduced support from X
    nations.Z.power = 0.2;  // Z starts giving some guns
    
    // Convert some player tiles to enemy
    let playerSquares = grid.reduce((acc, square, index) => 
        square.owner === 'player' ? [...acc, index] : acc, []);
    
    // Take 3 random player squares
    for (let i = 0; i < 3 && playerSquares.length > 0; i++) {
        let randomIndex = Math.floor(Math.random() * playerSquares.length);
        let squareToTake = playerSquares[randomIndex];
        
        takeOverLand('enemy', squareToTake);
        // Remove this square from possible future selections
        playerSquares.splice(randomIndex, 1);
    }
    
    // Update X nation's state
    nations.X.turn += 1;
    nations.X.eventID = 20;
}

function showResourceShop() {
    
    // Buy guns with money
    let buyGunsButton = createGameButton("Buy Guns (50 Money → 25 Guns)");
    buyGunsButton.position(400, 50);
    buyGunsButton.mousePressed(function() {
        if (player.money >= 50) {
            player.money -= 50;
            player.guns += 25;
            displayEventText("Purchased 25 guns for 50 money");
        } else {
            displayEventText("Not enough money to buy guns");
        }
    });
    shopButtons.push(buyGunsButton);
    
    // Buy journalist power with money
    let buyJPButton = createGameButton("Buy JP (40 Money → 15 JP)");
    buyJPButton.position(400, 80);
    buyJPButton.mousePressed(function() {
        if (player.money >= 40) {
            player.money -= 40;
            player.journalistPower += 15;
            displayEventText("Purchased 15 journalist power for 40 money");
        } else {
            displayEventText("Not enough money to buy journalist power");
        }
    });
    shopButtons.push(buyJPButton);
    
    // Close shop button
    let closeShopButton = createGameButton("Close Shop");
    closeShopButton.position(400, 110);
    closeShopButton.mousePressed(hideResourceShop);
    shopButtons.push(closeShopButton);
}

function hideResourceShop() {
    shopVisible = false;
    shopButtons.forEach(button => {
        if (button) button.remove();
    });
    shopButtons = [];
}