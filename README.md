#Project 1. Connect Four
The purpose of this project is to build the infrastructure for an interactive game which builds upon our HTML, CSS, JavaScript and jQuery skills. 

![Image](https://upload.wikimedia.org/wikipedia/en/thumb/7/79/Connect_4_Board_and_Box.jpg/250px-Connect_4_Board_and_Box.jpg)

[Connect Four](https://en.wikipedia.org/wiki/Connect_Four) is a great starting point since it requires features found in many web sites and applications such as:

- identifying users, tracking user status, alternating turns (interacting with site visitor)
- dynamically building the page elements (drawing an on-screen board)
- updating the HTML based on user actions (selecting a place to add a token)
- selecting items on the page (validating player moves, choosing a cell, clicking a button)
- displaying messages (game status, player progress, error messages, help text)

##Minimal Viable Product
To show basic functionality and understanding of the underlying technologies, the following features were required to meet MPV status (checked items are those completed in this project):

1. (DONE) An interactive board which renders on page load
2. (MODIFIED - *) A way for players to mark an empty space on their turn
3. (DONE) The turns should alternate (red, black, red, black, etc.)
4. (DONE) A player should not be able to mark a space that has already been played
5. (DONE) Announce a winner if a player gets four tokens in a row, horizontally or vertically

(*2 - This initial version of the game let's players add to any empty space, instead of the bottom-most empty space in the chosen column. I wasn't able to figure but didn't want this to stop me from out working on other parts of the game.)

Once this goal was met other features could be added to improve the UX and features:

1. \(Optional) The game should announce a winner if a player gets four tokens in a row diagonally
2. \(Optional) The game should end when there is a winner, or if the game is a tie
3. (DONE) \(Optional) The game should report the end state

##Project Planning
I started the project by first learning the rules of the game (and [playing a few rounds](http://www.connectfour.org/)), followed by writing user stories. The user stories were very helpful in understanding the player’s expectations and building pseudo code to implement each story. Even though I didn’t use all the stories, they helped to focus the work, and provide stretch goals for a more functional game.

* [user stories](https://github.com/TwistedOrange/connect4/issues)

###GUI Design - User Interface and Style
I then created a basic GUI with the MVP in mind plus a few added features. The design as kept intentionally simple as I knew I could tweak the layout, colors, and fonts later after the MVP was completed.

* [GUI design](https://github.com/TwistedOrange/project1/blob/master/wireframe.jpg) - wireframe (built with [Gliffy Chrome extension](https://chrome.google.com/webstore/detail/gliffy-diagrams/bhmicilclplefnflapjmnngmkkkkpfad?hl=en))

![wire frame](https://github.com/TwistedOrange/project1/blob/master/wireframe-small.png)

###Challenges
The interactivity of Connect Four had many similiarities with the [Memory Game w02d05](https://github.com/ga-students/wdi-remote-matey/tree/master/unit_01/w02d05/student_labs/memory_jquery_lab_day_solution) which we completed earlier. My version didn't work, but I knew I had to understand its inner workings to reach MVP status for Connect Four. I spent quite a bit of time debugging Memory Game, adding `console.log` messages, editing it, and using the browser webdev tools to understand the logic.

I then realized it was using classes as labels that represented the game's state at any point in time. I had worked with state machines before, so this resonated with me and I could proceed with developing the Connect Four code on my own.

###Code Structure
The third step was to draft an outline of the HTML and JavaScript code. The HTML was built to mimic the wireframe with enough structure to write develop the code framework. I added/changed classes multiple times as I thought through the structure. Initially I used `<ul><li>` as the board rows and columns, then simplified it to a set of `<div>` grids that was forced into the required dimensions (6 rows, 7 columns) by CSS. After studying the previous [memory game](https://github.com/ga-students/wdi-remote-matey/tree/master/unit_01/w02d05/student_labs/memory_jquery_lab_day_solution), I felt this layout was simpler to manage and iterate through in code.

The JavaScript `script.js` was grouped into three objects; game data, UI, and the board itself. The three objects and their methods are listed below:

* manageData object
	- resetGame(): Run on ‘game start’, initializes data, calls buildBoard()
	- savePlayerName(): Manages `form` to save player names overwriting generic names
	- togglePlayer(): Hands over play to other player if certain conditions are met
	- checkForWin(): Test board for winning play if current player has 4+ pieces played

* manageBoard object
	- buildBoard(): Dynamically builds the board at game start
	- isAvailable(): Checks if the selected cell is available for play
	- cellClicked(): Event tied to each cell, changes game state based on defined rules
	- addToken(): Inserts current player’s token `img` into the selected cell

* manageUI object
	- showHelp(): Manages two buttons; Help and Trivia to display text on screen
	- showMessage(): Manages all messages written to screen

###State Diagram
As mentioned in the above Challenges section, a critical piece in making the game interactive was understanding its asynchronous states, and identifying the relationships for each part of the game. Players can start anywhere on the board so being able to work with any sequence of events was critical.

I designed this [state diagram](https://github.com/TwistedOrange/project1/blob/master/state-diagram.jpg) to represent the game flow from start to end. This made it easier for me to breakdown what needs to happen at each stage. I could also independently test each state even though other parts of the game weren't completed. Manually editing the HTML from the browser developer console was very helpful in testing before committing to code.

![state diagram](https://github.com/TwistedOrange/project1/blob/master/state-diagram-small.png)

Using the memory game as inspiration, I defined these four states:

* empty
* player1
* player2
* win

Each state is defined as a class assigned to each of the 42 cells at different points in the game. These classes are not used as style elements (not defined in CSS), though they could also be used for that purpose. The states (classes) were added to the respective cell to keep track of (1) cells available for play, (2) cells owned by each player, and (3) cells that make up a winning combination.

When the board is first rendered (at game start), all cells are tagged with classes ‘.space’ and ‘.empty’. Of all the classes assigned to a `<div>` only class ‘.space’ is defined as an actual CSS style. I also added a designator for row and col so I could later figure out the winner. Here are some samples of how a given cell (at column 2, row 5) changes state from game start ('empty') to game end ('win'). 

`<div class=‘c2r5 space empty’></div>`

`<div class=‘c2r5 space player1’></div>`

`<div class=‘c2r5 space player1 win’></div>`

`<div class=‘c2r4 space player1 win’></div>`

`<div class=‘c2r3 space player1 win’></div>`

`<div class=‘c2r2 space player1 win’></div`

Since each cell was defined with its own event function, the code knows which cell was chosen. When a cell is clicked, the code checks to see it is available for play. It does this by checking the status of the cell; who owns it and is it empty.

`if ( $(cell).hasClass(‘empty’) ) { }`

If this statement is true, the cell is available for the current player to add their token. If it is false (cell is not empty) a message is written to the page, and the player selects another cell.

Once the token is added, the ‘empty’ class is replaced with the class of the current player - ‘player1’ or ‘player2’ to designated ownership.

`<div class="c2 space player2"><img src="images/purpledot.png"></div>`
(cell c2 is owned by player2 and shows that player’s game token)

###Choosing a Winner

Using the state machine to track ownership (status) of each cell, makes it easier to determine when to check for the winner. In Connect Four a winner has to have at least four playing pieces on the board. I used this to tell if it’s time to check for a winning play.

`if ( $(‘.player1’).length === 4 ) { }`

This statement returns the number of times the class ‘player1’ is used on the page. Since the code only adds this class after a token has been played, it represents how many cells are owned by each player. Once either player has placed four tokens on the board, I run `manageData.checkForWinner()` method to see if the current player has won the game.

If the current player wins, the game is stopped (events are disabled), and a winning message is displayed.

Unfortunately I wasn't able to figure out the right set of code to determine the winning pattern. A winning pattern is four consecutive tokens for the current player so I prematurely end the game on any four tokens on the board.

###Improvements

Getting to the MVP stage was a larger task than I first thought so I didn’t have time to add more functionality. Additional improvements would be:

- [ ] Force the token to occupy the bottom-most available cell in the column (instead of any selected cell)
- [ ] Restarting the game without reloading the page
- [ ] Allowing players to choose their token
- [ ] Finishing the form to show real player names instead of player1 v. player2
- [ ] Much improved styling
- [ ] Allow for other board configurations (more rows/cols)
- [ ] Allow player to play against the computer
- [ ] Keeping score
- [ ] Saving a game to return to later
- [ ] Leaderboard showing past high scores (player name, date, and score)
