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
        setupRhetoricGame(GAME_STATES.RHETORIC_X_INIT);
        break;
        
    case GAME_STATES.RHETORIC_X_INIT:
        drawRhetoricGamePage();
        break;
        
    case GAME_STATES.RHETORIC_Y:
        setupRhetoricGame(GAME_STATES.RHETORIC_Y_INIT);
        break;
        
    case GAME_STATES.RHETORIC_Y_INIT:
        drawRhetoricGamePage();
        break;
        
    case GAME_STATES.RHETORIC_Z:
        setupRhetoricGame(GAME_STATES.RHETORIC_Z_INIT);
        break;
        
    case GAME_STATES.RHETORIC_Z_INIT:
        drawRhetoricGamePage();
        break;
        
    case GAME_STATES.RHETORIC_NEW_LEADER:
        setupRhetoricGame(GAME_STATES.RHETORIC_NEW_LEADER_INIT);
        break;
        
    case GAME_STATES.RHETORIC_NEW_LEADER_INIT:
        drawRhetoricGamePage();
        break;
          
      case GAME_STATES.END:
          drawEndPage();
          break;
  }
}
