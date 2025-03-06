let introPage = {}; // Object to hold all things related to the intro page

function setupIntroPage(){
    // Things we need to do once, before the intro page is drawn
    introPage.button = createGameButton("Defend thy CANTREE!!1!"); // Create a button
    introPage.button.position(width / 2.7, height / 1.5); // Adjusted position
    introPage.button.mousePressed(function(){
        gameState = "mainGame";
        introPage.button.remove();
        setupMainGame();
    });
}

function drawIntroPage(){
    background("blue");
    fill("white");
    textSize(25);
    textAlign(CENTER, CENTER);
    text("A sudden invasion?! You are the frontlines!", width / 2, height / 2);
    textSize(20);
    text("it seems that Z will stop at nothing.", width / 2, height / 2.3);
}