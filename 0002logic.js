function mousePressed() {
    for (let i = 0; i < gridSize; i++) {
        let x = startX + (i % 10) * boxSize;
        let y = startY + Math.floor(i / 10) * boxSize;

        if (mouseX > x && mouseX < x + boxSize && mouseY > y && mouseY < y + boxSize) {
            if (grid[i].owner === 'enemy') {
                let neighbors = getNeighbors(i);
                let adjacentToPlayer = neighbors.some(neighbor => grid[neighbor] && grid[neighbor].owner === 'player');

                if (adjacentToPlayer && player.guns >= 25) {
                    takeOverLand('player', i);
                    player.guns -= 25; // Decrease the number of guns
                    playerMoves++;
                    console.log(`Player moves: ${playerMoves}`);
                    
                    if (playerMoves >= 2) {
                        playerMoves = 0;
                        
                        let peacePactButton = createGameButton('Negotiate Peace');
                        let continueWarButton = createGameButton('Continue Fighting');

                        peacePactButton.position(width/2 - 150, height/2 + 100);
                        peacePactButton.mousePressed(initiatePeacePact);
                        continueWarButton.position(width/2 + 50, height/2 + 100);
                        continueWarButton.mousePressed(continueWarfare);
                    }
                    break; // Exit the loop after taking over land
                }
            }
        }
    }
}

function initiatePeacePact() {
    // Remove negotiation buttons
    this.remove();
    // Find and remove the other button
    for (let btn of document.getElementsByTagName('button')) {
        if (btn.innerHTML === 'Continue Fighting') {
            btn.remove();
            break;
        }
    }

    // Create confirmation dialog
    textSize(24);
    fill(255);
    textAlign(CENTER, CENTER);
    text("Are you sure you want to negotiate peace with Z?", width/2, height/2 - 50);
    text("It seems there are no security-guarantees planned for this.", width/2, height/2 - 20);
    
    // Create confirmation buttons
    let confirmButton = createGameButton("Yes, I'm sure");
    confirmButton.position(width/2 - 150, height/2 + 50);
    confirmButton.mousePressed(confirmPeacePact);
    
    let cancelButton = createGameButton('No, go back');
    cancelButton.position(width/2 + 50, height/2 + 50);
    cancelButton.mousePressed(cancelPeacePact);
}

function confirmPeacePact() {
    // Remove confirmation buttons
    removeAllButtons();
    
    // Simulate 20 turns passing
    turnCounter += 20;
    
    // Create a button to continue
    let continueButton = createGameButton('Continue');
    continueButton.position(width/2 - 50, height/2 + 100);
    continueButton.mousePressed(startGameOver);
}

function cancelPeacePact() {
    // Remove confirmation buttons
    removeAllButtons();
    
    // Restore original negotiation buttons
    let peacePactButton = createGameButton('Negotiate Peace');
    peacePactButton.position(width/2 - 150, height/2 + 100);
    peacePactButton.mousePressed(initiatePeacePact);
    
    let continueWarButton = createGameButton('Continue Fighting');
    continueWarButton.position(width/2 + 50, height/2 + 100);
    continueWarButton.mousePressed(continueWarfare);
}


function continueWarfare() {
    // Remove negotiation buttons
    this.remove();
    // Find and remove the other button
    for (let btn of document.getElementsByTagName('button')) {
        if (btn.innerHTML === 'Negotiate Peace') {
            btn.remove();
            turnCounter += 1;
            break;
        }
    }

    // Enemy takes 2 random green squares
    let playerSquares = grid.reduce((acc, square, index) => 
        square.owner === 'player' ? [...acc, index] : acc, []);
    
    // Take 2 random green squares
    for (let i = 0; i < 2 && playerSquares.length > 0; i++) {
        let randomIndex = Math.floor(Math.random() * playerSquares.length);
        let squareToTake = playerSquares[randomIndex];
        
        takeOverLand('enemy', squareToTake);
        // Remove this square from possible future selections
        playerSquares.splice(randomIndex, 1);
    }

    // Reset rhetoric game availability for the new turn
    resetRhetoricGameAvailability();
    showMainGameButtons();
    
    // Clear turn events
    clearTurnEvents();
    
    // Return to main game state
    gameState = "mainGame";
    
    // Check for turn-specific events
    if (turnCounter === 15) {
        triggerEvent15();
    } else if (turnCounter === 20) {
        triggerEvent20();
    } else {
        // Trigger random event
        triggerRandomEvent();
    }
}

function startGameOver() {

    // Turn ALL squares red
    for (let i = 0; i < grid.length; i++) {
        grid[i].owner = 'enemy';
    }

    textSize(32);
    fill(255, 0, 0);
    textAlign(CENTER, CENTER);
    text("Game Over", width / 2, height / 2);

    // Return to main drawing but end game
    gameState = "end";
    drawMainGamePage();
    removeAllButtons();
}

function takeOverLand(character, index) {
    if (grid[index].owner !== character) {
        grid[index].owner = character;
    }
}

function playTurn() {
    if (game.turn === 'enemy') {
        text("Enemy's turn is active", 10, 10);
        let moves = 0;
        while (moves < 2) {
            // Find all player squares adjacent to enemy squares
            let validChoices = [];
            for (let i = 0; i < gridSize; i++) {
                if (grid[i].owner === 'player') {
                    let neighbors = getNeighbors(i);
                    for (let neighbor of neighbors) {
                        if (grid[neighbor] && grid[neighbor].owner === 'enemy') {
                            validChoices.push(i);
                            break;
                        }
                    }
                }
            }

            // Pick a random valid choice
            if (validChoices.length > 0) {
                let choice = validChoices[Math.floor(Math.random() * validChoices.length)];
                takeOverLand('enemy', choice);
                moves++;
                console.log(`Enemy moves: ${moves}`);
            } else {
                break; // No valid choices left
            }
        }

        game.turn = 'player';
        console.log("Player's turn starts");

        // Check for events
        if (turnCounter === 15) {
            triggerEvent15();
        } else if (turnCounter === 25) {
            triggerEvent25();
        }
    }
    game.checkGameOver();
}

function getNeighbors(index) {
    let neighbors = [];
    let col = index % 10;
    let row = Math.floor(index / 10);

    if (col > 0) neighbors.push(index - 1); // Left
    if (col < 4) neighbors.push(index + 1); // Right
    if (row > 0) neighbors.push(index - 10); // Up
    if (row < 3) neighbors.push(index + 10); // Down

    return neighbors;
}
