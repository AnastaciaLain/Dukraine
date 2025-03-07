let game;
let gameState; 

// set up territory board
let grid = [];
let gridSize = 40;
let boxSize = 10;
let startX = 380;
let startY = 189;

// Assets folder
let img;
let debateImg;
let cloodImg;

// Game buttons
let allButtons = [];
let buttonX;
let buttonY;
let buttonZ;
let buttonNewLeader;
let buttonNegotiatePeace;
let buttonContinueFighting;
let resourceShopButton;
let shopButtons = []; // Initialize shopButtons as an empty array

let canMakeMoves = true; // Doesn't work but should've prevented player from making moves, actually i think i removed it from where it was used since it didn't work
let shopVisible = false;

// Game state tracking
let playerMoves = 0;
let turnCounter = 0;

// Event shit
let eventText = "";
let eventTextTimeout = null;
let currentTurnEvents = [];
let randomEvents = [];


function preload() {
    img = loadImage('assets/main.png');
    debateImg = loadImage('assets/debate.png');
    cloodImg = loadImage('assets/clood.png');
}

function setupMainGame() {
    player = new Character('Du', 100, 80, 40);
    enemy = new Character('Z', 9999, 9999, 9999);
    game = new Game(player, enemy); // apparently needed for the concept

    initializeGrid();
    createNegotiationButtons();
    setupRandomEvents();
}

function drawMainGamePage() {
    background(255);
    image(img, 0, 0, width, height);
    image(cloodImg, 0, 0, width, height);
    drawGrid();
    drawPlayerStats();
    drawNationSympathy();
    drawEventText();
}

function initializeGrid() {
    grid = [];
    let enemyPercentage = 0.65;
    
    for (let i = 0; i < gridSize; i++) {
        if (i < gridSize * enemyPercentage) {
            grid.push({ owner: 'enemy' }); // since top-left is start, enemy goes from top-left to bottom-right 65% of the way through
        } else {
            grid.push({ owner: 'player' });
        }
    }
}

function removeAllButtons() {
    allButtons.forEach(button => {
        if (button) button.remove();
    });
    allButtons = [];
  }
  
  function setup() {
      createCanvas(640, 360);
      setupIntroPage();
      gameState = GAME_STATES.INTRO;
      
      setupRandomEvents();
  }
  


function createNegotiationButtons() { // sends to rhetoricGame with slogans
    buttonX = createButton('Negotiate with X');
    buttonX.position(3, 220);
    buttonX.mousePressed(() => {
        gameState = "rhetoricGame";
        setupRhetoricGame();
    });
    buttonY = createButton('Negotiate with Y');
    buttonY.position(200, 296);
    buttonY.mousePressed(() => {
        gameState = "rhetoricGameY";
        setupRhetoricGame();
    });

    buttonZ = createButton('Negotiate with Z');
    buttonZ.position(520, 230);
    buttonZ.mousePressed(() => {
        gameState = "rhetoricGameZ";
        setupRhetoricGame();
    });

    resourceShopButton = createButton("Resource Shop"); // and shop for good measure
    resourceShopButton.position(400, 255);
    resourceShopButton.mousePressed(showResourceShop);
}

function drawPlayerStats() {
    fill(0);
    textSize(16);
    textAlign(RIGHT);
    
    let stats = [
        { label: "Turn:        ", value: turnCounter, y: 10 },
        { label: "Money:    ", value: player.money, y: 30 },
        { label: "Guns:      ", value: player.guns, y: 50 },
        { label: "Journalist Power:      ", value: player.journalistPower, y: 70 }
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
        { id: 'X', y: 260 },
        { id: 'Y', y: 280 }
    ];
    
    nations.forEach(nation => {
        if (rhetoricGamePlayed[nation.id]) {
            text(`${nation.id} Sympathy: ${nationSympathy[nation.id]}`, 20, nation.y);
        }
    });
}

// remember to check the logicjs and top let if you're messing with these numbers holy shit
function drawGrid() {
    for (let i = 0; i < gridSize; i++) { // gridsize up top
        let x = startX + (i % 10) * boxSize;
        let y = startY + Math.floor(i / 10) * boxSize;
        
        if (grid[i].owner === 'player') {
            fill(0, 255, 0);     // Green for player
        } else if (grid[i].owner === 'enemy') {
            fill(255, 0, 0);     // Red for enemy
        } else {
            fill(0, 0, 255);     // Blue for neutral (not gonna happen, but i mean)
        }
        
        rect(x, y, boxSize, boxSize); // just wanted it up top where i could easily fuck with it, but then it got more and more annoying to scroll between)
    }
}

function findConvertibleEnemySquares() { //copilot saved me
    let convertible = []; // array to shove the actually available enemy squares into
    for (let i = 0; i < gridSize; i++) {
        if (grid[i].owner === 'enemy') { // checks ownership, then when confirmed
            let adjacentToPlayer = neighbors.some(neighbor => grid[neighbor] && grid[neighbor].owner === 'player'); // check all neighbours (in logic.js) to see if they are owned by player
            if (adjacentToPlayer) { // if green
                convertible.push(i); // you can now make this red one pushable
            }
        }
    }
    return convertible;
}

function triggerRandomEvent() {
    if (Math.random() < 0.6) {
        let randomEvent = randomEvents[Math.floor(Math.random() * randomEvents.length)];
        randomEvent.effects.call(randomEvent);
        currentTurnEvents.push(randomEvent); // Save event for display
    }
}

function clearTurnEvents() {
    currentTurnEvents = []; // Clear events from last turn
}

function drawEventText() {
    if (eventText) {
        fill(0);
        rect(0, height/2 - 80, width, 40);
        fill(255);
        textSize(16);
        textAlign(CENTER, CENTER);
        text(eventText, width/2, height/2 - 60);
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
                displayEventText(this.description);
            }
        ),
        new Event(
            "Popular Support",
            "Your people rally behind your cause, offering support.",
            function() {
                player.journalistPower += 20;
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
                player.journalistPower += 20;
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

function convertGreenToRed() {
    let playerSquares = grid.filter(square => square.owner === 'player');
    if (playerSquares.length > 0) {
        let randomSquare = playerSquares[Math.floor(Math.random() * playerSquares.length)];
        randomSquare.owner = 'enemy';
    }
}

function we15yet() {
    if (turnCounter >= 15) {
        convertGreenToRed();
        convertGreenToRed();
        convertGreenToRed();
    }
}

function showResourceShop() {
    // Buy guns with money
    let buyGunsButton = createButton("Buy Guns (50 Money - 35 Guns)");
    buyGunsButton.position(400, 280);
    buyGunsButton.mousePressed(function() {
        if (player.money >= 50) {
            player.money -= 50;
            player.guns += 35;
            displayEventText("Purchased 35 guns for 50 money");
        } else {
            displayEventText("Not enough money to buy guns");
        }
    });
    shopButtons.push(buyGunsButton);
    

    let buyJPButton = createButton("Buy JP (20 Money - 55 JP)");
    buyJPButton.position(400, 305);
    buyJPButton.mousePressed(function() {
        if (player.money >= 20) { 
            player.money -= 20;
            player.journalistPower += 55;
            displayEventText("Purchased 55 journalist power for 20 money");
        } else {
            displayEventText("Not enough money to buy journalist power");
        }
    });
    shopButtons.push(buyJPButton);
    
    let closeShopButton = createButton("Close Shop");
    closeShopButton.position(400, 330);
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

function checkGameOver() {
    let allRed = grid.every(square => square.owner === 'enemy'); // doesnt work but fuck it
    if (allRed) {
        startGameOver();
    }
}