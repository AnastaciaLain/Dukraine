function mousePressed() {
    for (let i = 0; i < gridSize; i++) {
        let x = startX + (i % 10) * boxSize;
        let y = startY + Math.floor(i / 10) * boxSize;

        if (mouseX > x && mouseX < x + boxSize && mouseY > y && mouseY < y + boxSize) {
            if (grid[i].owner === 'enemy') {
                if (player.guns >= 25) {
                    let neighbors = getNeighbors(i);
                    let adjacentToPlayer = neighbors.some(neighbor => grid[neighbor] && grid[neighbor].owner === 'player');

                    if (adjacentToPlayer) {
                    takeOverLand('player', i);
                    player.guns -= 25; // Decrease the number of guns
                    playerMoves++;
                    console.log(`Player moves: ${playerMoves}`);
                    
                    if (playerMoves >= 2) {
                        playerMoves = 0;
                        
                        let peacePactButton = createButton('Negotiate Peace'); // what could go wrong
                        let continueWarButton = createButton('Continue Fighting'); // at the same time, what could go wrong :)

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
function getNeighbors(index) {
    let neighbors = [];
    let col = index % 10; //remaining
    let row = Math.floor(index / 10);

    if (col > 0) neighbors.push(index - 1); // Left, returns index of square to the left
    if (col < 9) neighbors.push(index + 1); // Right
    if (row > 0) neighbors.push(index - 10); // Up
    if (row < 9) neighbors.push(index + 10); // Down, returns index of square below

    return neighbors;
}


function initiatePeacePact() {
    // Remove negotiation buttons
    this.remove();
    // Find and remove the other button
    for (let btn of document.getElementsByTagName('button')) { //why getElementsByTagName idk, ask copilot
        if (btn.innerHTML === 'Continue Fighting') { // why innerHTML is the only thing that works idk ask copilot
            btn.remove(); // i had difficulties removing a freaking button?!
            break;
        }
    }
    displayEventText("It seems there are no security-guarantees planned for this. Are you sure?");
    
    // Create confirmation buttons
    let confirmButton = createButton("Yes. Trust.");
    confirmButton.position(width/3, height/2 + 50);
    confirmButton.mousePressed(confirmPeacePact);
    
    let cancelButton = createButton('No, go back'); 
    cancelButton.position(width/2 + 50, height/2 + 50);
    cancelButton.mousePressed(cancelPeacePact); // this kinda breaks tbf, could refer to ContinueWar, but cant be assed to do more weird button removal
}

function confirmPeacePact() {
    this.remove();
    for (let btn of document.getElementsByTagName('button')) { //copilot
        if (btn.innerHTML === 'No, go back') {
            btn.remove();
            break;
        }
    }
    removeAllButtons();
    
    // Simulate 20 turns passing
    turnCounter += 20;
    
    // Create a button to continue
    let continueButton = createButton('Continue');
    continueButton.position(width/2 - 50, height/2 + 100);
    continueButton.mousePressed(function() {
        continueButton.remove(); 
        
        // dramatic effect/twist pause
        setTimeout(function() {
            turnCounter += 25;
            startGameOver();
        }, 3000);
    });
    playTurn(); // going to the new turn
}

function cancelPeacePact() {
    this.remove();
    for (let btn of document.getElementsByTagName('button')) { //copilot
        if (btn.innerHTML === 'Yes. Trust.') {
            btn.remove();
            break;
        }
    }
    removeAllButtons();
    
    // Restore original negotiation buttons
    let peacePactButton = createButton('Negotiate Peace');
    peacePactButton.position(width/2 - 150, height/2 + 100);
    peacePactButton.mousePressed(initiatePeacePact);
    
    let continueWarButton = createButton('Continue Fighting');
    continueWarButton.position(width/2 + 50, height/2 + 100);
    continueWarButton.mousePressed(continueWarfare);
}


function continueWarfare() {
    // Remove negotiation buttons
    this.remove();
    for (let btn of document.getElementsByTagName('button')) { //copilot
        if (btn.innerHTML === 'Negotiate Peace') {
            btn.remove();
            break;
        }
    }

    // Enemy takes 2 random green squares (makes sure theyre green first)
    let playerSquares = grid.reduce((acc, square, index) =>  // identify squares owned by player
        square.owner === 'player' ? [...acc, index] : acc, []);  // creates new array with accumulated, and adds index to keep track of player squares
    
    for (let i = 0; i < 2 && playerSquares.length > 0; i++) {
        let randomIndex = Math.floor(Math.random() * playerSquares.length);
        let squareToTake = playerSquares[randomIndex];
        playerSquares.splice(randomIndex, 1); // Ensure they're not taking their own squares
        takeOverLand('enemy', squareToTake); // finally turning them red
    }

    resetRhetoricGameAvailability();
    showMainGameButtons();
    clearTurnEvents();
    
    gameState = "mainGame";
    
    turnCounter++;

    // Check for turn-specific events
    if (turnCounter === 1) { // probably shouldve just done switch statements again but whatever
        triggerEvent1();
    } else if (turnCounter === 3) {
        triggerEvent3();
    } else if (turnCounter === 7) {
        triggerEvent7();
    } else if (turnCounter === 8) {
        triggerEvent8();
    } else if (turnCounter === 12) {
        triggerEvent12();
    } else {
        // Trigger random event
        triggerRandomEvent();
    }

    // Call playTurn to handle the enemy's turn
    playTurn();
}

function startGameOver() {

    // Turn ALL squares red
    for (let i = 0; i < grid.length; i++) {
        grid[i].owner = 'enemy';
    }



    // Return to main drawing but end game
    gameState = "end";
    drawMainGamePage();
    textSize(32);
    fill(255, 0, 0);
    textAlign(CENTER, CENTER);
    text("Game Over", width / 2.1, height / 2.8);
    removeAllButtons();
}

function takeOverLand(character, index) {
    if (grid[index].owner !== character) {
        grid[index].owner = character;
    }
}

function playTurn() {
    we15yet();
    checkGameOver();
}

// Define event functions
function triggerEvent1() {
    displayEventText("The attack was thankfully expected, and they made less progress than anticipated.");
    player.guns += 30;
}

function triggerEvent3() {
    displayEventText("A slow stalemate seems to be forming, this could take a long while.");
}

function triggerEvent7() {
    displayEventText("X is holding an election with a new popular candidate.");
    
    // Create New Leader button if it doesn't exist
    if (!buttonNewLeader) {
        buttonNewLeader = createButton('Negotiate with New Leader');
        buttonNewLeader.position(3, 250);
        buttonNewLeader.mousePressed(function(){
            gameState = "rhetoricGameNewLeader";
            setupRhetoricGame();
        });
    }
}

function triggerEvent8() {
    displayEventText("The new candidate seems unsympathetic to the struggles of dU.");
}

function triggerEvent12() {
    displayEventText("The new leader has won the election and will start supporting your enemy, Z.");
    
    // No more negotiating with X
    if (buttonNewLeader) {
        buttonNewLeader.remove();
    }
    if (buttonX) {
        buttonX.remove();
    }
    
    // Negatively impact player resources
    player.guns -= 30;
    player.journalistPower -= 20;
    
    // Update nation relationships
    nationSympathy[NATION_X] -= 51;
    nationSympathy[NATION_X] = Math.max(0, nationSympathy[NATION_X]);
    nationSympathy[NATION_Y] += 20;
    nationSympathy[NATION_Y] = Math.min(110, nationSympathy[NATION_Y]);
    }
}

