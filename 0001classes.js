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
        this.sympathy = 50; // More for leaders than for players
    }
}

function displayEventText(text) { // shouldve been a class if we're standardizing but fuck it
    eventText = text;
    
    // Clear any existing timeout
    if (eventTextTimeout) {
        clearTimeout(eventTextTimeout);
    }
    
    // Set timeout to clear text after 5 seconds
    eventTextTimeout = setTimeout(() => {
        eventText = "";
    }, 7000);
}