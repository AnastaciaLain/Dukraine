let introPage = {}; // Object to hold all things related to the intro page

function setupIntroPage(){
    introPage.button = createButton("Defend thy CAHNTREE!!1!");
    introPage.button.position(width / 2, 270);
    introPage.button.mousePressed(function(){
        gameState = "mainGame";
        introPage.button.remove();
        setupMainGame();
    });
}

function drawIntroPage() {
    background("blue");
    
    fill("yellow");
    noStroke();
    rect(width / 2 - 125, 0, 70, height);
    rect(0, 140, width, 70);
    
    fill(0);
    textSize(25);
    textAlign(CENTER, CENTER);
    text("A sudden invasion?! You are the frontlines!", width / 2, height / 1.9);
    textSize(20);
    text("it seems that Z will stop at nothing.", width / 2, height / 2.2);
}