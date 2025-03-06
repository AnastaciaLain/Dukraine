/**
 * Game states for better readability
 */
let GAME_STATES = {
  INTRO: "intro",
  MAIN_GAME: "mainGame",
  RHETORIC_X: "rhetoricGame",
  RHETORIC_X_INIT: "rhetoricGameInitialized",
  RHETORIC_Y: "rhetoricGameY",
  RHETORIC_Y_INIT: "rhetoricGameYInitialized",
  RHETORIC_Z: "rhetoricGameZ",
  RHETORIC_Z_INIT: "rhetoricGameZInitialized",
  RHETORIC_NEW_LEADER: "rhetoricGameNewLeader",
  RHETORIC_NEW_LEADER_INIT: "rhetoricGameNewLeaderInitialized",
  END: "end"
};

let gameState; 
let allButtons = [];


/**
* Create a button that's tracked for easy removal
* @param {string} label - Button text
* @returns {p5.Element} - Button element
*/
function createGameButton(label) {
  let button = createButton(label);
  allButtons.push(button);
  return button;
}

/**
* Remove all buttons
*/
function removeAllButtons() {
  allButtons.forEach(button => {
      if (button) button.remove();
  });
  allButtons = [];
  
  // Also clear any rhetoric game buttons
  if (typeof clearRhetoricGameButtons === 'function') {
      clearRhetoricGameButtons();
  }
}

function setup() {
    createCanvas(640, 360);
    setupIntroPage();
    gameState = GAME_STATES.INTRO;
    
    // Initialize random events
    setupRandomEvents();
}

// Modify drawMainGamePage in 0004mainGame.js to include event text
function drawMainGamePage() {
    background(255);
    image(img, 0, 0, width, height);
    drawGrid();
    drawPlayerStats();
    drawNationSympathy();
    drawEventText(); // Add this line
}

/**
* p5.js draw function - handles game state rendering
*/
function draw() {
    switch (gameState) {
        case GAME_STATES.INTRO:
            drawIntroPage();
            break;
            
        case GAME_STATES.MAIN_GAME:
            drawMainGamePage();
            break;
      // Rhetoric game states
      case GAME_STATES.RHETORIC_X:
        initializeRhetoricGame(GAME_STATES.RHETORIC_X_INIT);
        break;
        
    case GAME_STATES.RHETORIC_X_INIT:
        drawRhetoricGamePage();
        break;
        
    case GAME_STATES.RHETORIC_Y:
        initializeRhetoricGame(GAME_STATES.RHETORIC_Y_INIT);
        break;
        
    case GAME_STATES.RHETORIC_Y_INIT:
        drawRhetoricGamePage();
        break;
        
    case GAME_STATES.RHETORIC_Z:
        initializeRhetoricGame(GAME_STATES.RHETORIC_Z_INIT);
        break;
        
    case GAME_STATES.RHETORIC_Z_INIT:
        drawRhetoricGamePage();
        break;
        
    case GAME_STATES.RHETORIC_NEW_LEADER:
        initializeRhetoricGame(GAME_STATES.RHETORIC_NEW_LEADER_INIT);
        break;
        
    case GAME_STATES.RHETORIC_NEW_LEADER_INIT:
        drawRhetoricGamePage();
        break;
          
      case GAME_STATES.END:
          drawEndPage();
          break;
  }
}

/**
* Helper function to initialize rhetoric games
* @param {string} initializedState - The state to transition to
*/
function initializeRhetoricGame(initializedState) {
  setupRhetoricGame();
  gameState = initializedState;
}