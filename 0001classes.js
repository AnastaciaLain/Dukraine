class Game {
    constructor(player, enemy) {
        this.player = player;
        this.enemy = enemy;
        this.turn = 'player';
    }
}



class Event {
    constructor(name, description, effects, requiresButton = false, buttonText = "") {
        this.name = name;
        this.description = description;
        this.effects = effects;
        this.requiresButton = requiresButton;
        this.buttonText = buttonText;
    }
}

class Character {
    constructor(name, money, guns, journalistPower) {
        this.name = name;
        this.money = money;
        this.guns = guns;
        this.journalistPower = journalistPower;
        this.sympathy = 50; // Add sympathy as a direct player attribute
    }
}

let events = {
    event15: new Event(
        "Election",
        "X is holding an election with a new popular leader that seems to be Anti D.",
        function() {
            console.log(this.description);
            displayEventText(this.description);
            
            // Create New Leader button if it doesn't exist
            if (!buttonNewLeader) {
                buttonNewLeader = createGameButton('Negotiate with New Leader');
                buttonNewLeader.position(500, 400);
                buttonNewLeader.mousePressed(function(){
                    gameState = "rhetoricGameNewLeader";
                    setupRhetoricGame();
                });
            }
        }
    ),
    event25: new Event(
        "Support Shift",
        "The new leader has won the election and will start supporting your enemy, Z.",
        function() {
            console.log(this.description);
            displayEventText(this.description);
            
            // Remove New Leader button if it exists
            if (buttonNewLeader) {
                buttonNewLeader.remove();
            }
            
            // Negatively impact player resources
            player.guns = Math.max(0, player.guns - 30);
            player.journalistPower = Math.max(0, player.journalistPower - 20);
            player.sympathy = Math.max(0, player.sympathy - 15);
            
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
        }
    )
};