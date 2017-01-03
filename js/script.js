//console.log('hi js');

/*
Manages the game data: score, player name, current player, player's token
*/
const manageData = {
  currentPlayer: 0,
  token: ["<img src='images/greendot.png'>", "<img src='images/purpledot.png'>"],
  currentToken: 0,
  theBoard: Array(42).fill(''),
  gameWon: false,
  score: Array(2).fill(0),
  playerNames: ['Monica', 'Ronnie'],
  playerID: ['player1', 'player2'],

  resetGame: function () {
    // clears all game data for new game
    currentPlayer = 0;
    currentToken = 0;
    // change this to actual player names if available (stored somewhere)
    // playerNames = ['player1', 'player2'];
    gameWon = false;
    theBoard: Array(42).fill(''),
    score = Array(2).fill(0);

    manageBoard.buildBoard();
    manageUI.showMessage('Active player: ' + manageData.playerNames[manageData.currentPlayer], true);
    $('.play1').addClass('p1');
  },

  // Change players & add colored border to new active player
  togglePlayer: function() {
    if ( this.currentPlayer === 0 ) {
      this.currentPlayer = 1;
      // highlight image of current player
      $('.play2').addClass('p2');
      $('.play1').removeClass('p1');
    }
    else {
      this.currentPlayer = 0;
      // highlight image of current player
      $('.play1').addClass('p1');
      $('.play2').removeClass('p2');
    }
    this.currentToken = this.currentPlayer;
  },

  // For current player, look at their board pieces and see if
  //   they have the right pattern to win (4-horz, 4 vert)
  // Return TRUE: current player has a winning pattern
  // Return FALSE: current player does not have winning pattern
  checkforWin: function() {
    //console.log('manageData.checkforWin()');
    let activePlayer =  manageData.playerID[manageData.currentPlayer];
    activePlayer = "." + activePlayer;

    let minToWin = 4;

    // Does active player have min set of played cells to determine winner?
    //  checks cells with class name of current player (.player1 or .player2)
    if ( $(activePlayer).length < minToWin ) {
      console.log('checkForWin(), player: ' + manageData.playerNames[manageData.currentPlayer]);
      return false;
    }

    // Yes,  active player has at least 4 occupied cells
    console.log('checkForWin(), did ' + manageData.playerNames[manageData.currentPlayer] + ' win?');

    // REFACTOR - check board for horz or vert placement
    // CODE HERE
    manageData.gameWon = true;

    return manageData.gameWon;
  }
};

const manageBoard = {
  // create board with row/col and click events
  buildBoard: function() {
    let col = row = 0;

    // clear the board
    $('#game').html('');

    // console.log('managedBoard.buildBoard()');
    // console.log('theBoard: ' + manageData.theBoard);
    $.each(manageData.theBoard, function(index, cell) {
      // add two classes 1) style, 2) initial state 'empty'
      var $newCell = $('<div><div>')
        .addClass('col'+ col + ' row' + row)
        .addClass('space empty')
        .on('click', function() {
          // add click event to each cell
          manageBoard.cellClicked(this);
        });

      $('#game').append($newCell);

      // increment row/col labels to identify cell location within the board
      col += 1;
      if ( col == 7 ) {
        col = 0;
        row += 1;
      }
    });
  },

  isAvailable: function(cell) {
  // check if current selected cell can be played
  //  class 'empty' added initially to all cells to show their state as available
    if ( $(cell).hasClass('empty') && !manageData.gameWon ) {
      return true;
    }
    return false;
  },

  cellClicked: function(cell) {
    // 1. Activated from event handler on each cell
    // 2. If current cell is empty, it's available for currentPlayer
    // 3. Change cell state to playerX (X=1 or 2), remove 'empty' state
    // 4. check board for win
    // 5. If no winner, give board to other player
    // 6. If winner, announce the name and lock the board
    //console.log('cellClicked() = ', cell);

    // game has been won, but board is still alive (actie click events)
    if ( manageData.gameWon ) {
      // deactivate all the 'empty' cells
      // $('.empty').off('click', manageData.resetGame());
      // $('.player1').off('click', manageData.resetGame());
      // $('.player2').off('click', manageData.resetGame());
      // $('.win').off('click', manageData.resetGame());
      return false;
    }

    manageUI.showMessage('Active player: ' + manageData.playerNames[currentPlayer], true);

    // highlight player's photo

    // classes: '.empty', '.player1', '.player2', '.win'
    if ( ! manageBoard.isAvailable(cell) ) {
      manageUI.showMessage("[ Selected cell is not available ]", false);
    } else {
      // yes, selected cell is available
      manageUI.showMessage("");

      // change state of selected cell to current player
      // remove previous 'empty' class since it's now occupied
      let playerClass = manageData.playerID[manageData.currentPlayer];
      $(cell).addClass(playerClass).removeClass('empty');

      // REFACTOR - fix this to add token to next avail cell in selected col.

      // add current player's token to the board
      let newToken = manageData.token[manageData.currentPlayer];
      $(cell).html(newToken)

      // 1. Has current player won the game?
      // 2a. If YES, announce winner, lock board from further play
      // 2b. If NO, swap players, write next player's name to board
      if ( manageData.checkforWin() === true ) {
        // yes current player won the game
        manageUI.showMessage("WINNER is: " + manageData.playerNames[manageData.currentPlayer], true);

        // disable the board from further play - remove click events
        $('.start').off('click', manageData.resetGame);
        // reload page to play game again -- REFACTOR THIS
      } else {
        // no winner yet, swap players and continue
        manageData.togglePlayer();
        manageUI.showMessage("Active player: " + manageData.playerNames[manageData.currentPlayer], true);
      }
    }
  }
};

const manageUI = {

  showRules: function() {
    console.log('show rules');
    $('.rules').show();
    // $('.trivia').hide();
  },

  showTrivia: function() {
    console.log('show trivia');
    $('.trivia').show();
    $('.rules').hide();
  },

  showMessage: function(msg, bMsgType) {
    if ( msg.length === 0 ) {
      $('.statusMsg').html('')
      $('.errMsg').html('');
      return true;
    }

    if ( bMsgType ) {
      $('.statusMsg').html(msg) ;
    } else {
      $('.errMsg').html(msg) ;
    }
  },

  savePlayerName: function() {
    // 1. Read form with player names
    // 2. Save player names for display
    console.log('savePlayerName()');
  },

  // An empty cell is selected:
  // (1) place current player's token in that spot
  // (2) check for a win,
  // (3) if win - announce winner, else give play to other player
  addToken: function(cell) {
    console.log('add token for player: '+manageData.currentPlayer);

    let tokenImg = manageData.token[manageData.currentPlayer];
    $(cell).html(tokenImg);

    if ( manageData.checkforWin() === true ) {
      manageData.gameWon = true;
    } else {

    }
  },
};

/**************
  Configure listen events for various actions on page load
**************/
window.onload = function() {
  console.log('window loaded');

  // $('#btnRules').on('click',manageUI.showRules);
  // $('#btnTrivia').on('click',manageUI.showTrivia);

  $('.start').on('click', manageData.resetGame);

  $('.close').on('click', function() {
    $('.notes').hide();
  });

  // $('.frmSave').on('click', manageUI.savePlayerName);
}
