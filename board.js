//refreshCSS();
var div = document.getElementById("main");
var display =0 ;
function hide(){
    if(display == 0){
        div.style.display = 'none';
        display =1;
    }else{
        div.style.display = 'block';
        display =0;
    }
}
var white_wins = 0;
var black_wins = 0;
var is_first_check = true;
var board = new Array(8);
var firstname = $('#first_player').val();
var secondname = $('#second_player').val();
var eat = document.getElementById("eat");
var error = document.getElementById("error");
var queen = document.getElementById("queen");
//var winning = document.getElementById("winning");

var starter = $('#starter');

for (var i = 0; i < 8; i++) {
  board[i] = new Array(8);
}

var slot;
const a = "A";
for (var i = 0; i < 8; i++) {
  for (var j = 0; j < 8; j++) {
    var rowNumber = i + 1;
    var colLetter = String.fromCharCode(a.charCodeAt(0) + j);
    slot = colLetter + rowNumber;
    board[i][j] = document.getElementById(slot);
  }
}

var spans = document.getElementsByClassName("circle");
Array.from(spans).forEach(function(span) {
  span.addEventListener("click", function() {
    span.parentNode.click();
  });
});
//document.addEventListener("DOMContentLoaded", function () {
function initialize() {
    
    is_first_check = true;
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            board[i][j].classList.remove("show_stone_black");
            board[i][j].classList.remove("show_stone_white");
            board[i][j].classList.remove("black_queen");
            board[i][j].classList.remove("white_queen");
        }
        
    }

    for (var j = 0; j < 8; j += 2) {
        board[0][j].classList.add("show_stone_white");
        board[2][j].classList.add("show_stone_white");
        board[6][j].classList.add("show_stone_black");
    }
    for (var j = 1; j < 8; j += 2) {
        board[1][j].classList.add("show_stone_white");
        board[5][j].classList.add("show_stone_black");
        board[7][j].classList.add("show_stone_black");
    }
}
document.getElementById("form").addEventListener("click", function () {
  
  initialize();
});

document.addEventListener("DOMContentLoaded", function () {
 
    var currentPlayer = "black"; // Let Black begin
    var firstButton = null;
    var blackFirstMove = false;
    var whiteFirstMove = false;
    var doubleJumpInProgress = false;


    function changePlayer() {
      currentPlayer = (currentPlayer == "black") ? "white" : "black";
      if(currentPlayer == "black"){
         starter.text(secondname + 's' + " turn ");
      }
      else {
        starter.text(firstname + 's' + " turn ");
      }
    }

    function checkWin() {
      var whitePieces = document.querySelectorAll(".show_stone_white",".white_queen");
      var blackPieces = document.querySelectorAll(".show_stone_black",".black_queen");
      var whiteQueens = document.querySelectorAll(".white_queen");
      var blackQueens = document.querySelectorAll(".black_queen");
    
      if (whitePieces.length === 0 && whiteQueens.length == 0 && is_first_check) {
         // document.getElementById("bwin").classList.add("endb");
         // winning.play();
          document.getElementById("bwin").classList.add("endb");
          black_wins++;
          is_first_check = false;
          var bwin = document.getElementById("bwin");
          bwin.textContent = secondname + " is the WINNER! Click for another game";
          
        } else if (blackPieces.length === 0 && blackQueens.length == 0 && is_first_check) {
         // winning.play();
          document.getElementById("wwin").classList.add("endw");
          white_wins++;
          is_first_check = false;
          var wwin = document.getElementById("wwin");
          wwin.textContent  = firstname + " is the WINNER! Click for another game";
                    

      }
    }
//starter.text('Cell already has a piece');

    function canMoveTo(row, col, currentPlayer) {
        
        var isBlack = currentPlayer === "black";
        var isWhite = currentPlayer === "white";
        
        var isWhiteOccupied = board[row][col].classList.contains("show_stone_white");
        var isBlackOccupied = board[row][col].classList.contains("show_stone_black");
        var firsti = (parseInt(firstButton.id.charAt(1)) - 1);

        if (isBlack ) {
            if ((!isBlackOccupied && row < firsti) && (!isWhiteOccupied)){
                starter.text('Nice Move :)');
                return true;
            } else if (!firstButton.classList.contains("black_queen") && row > firsti){
                
                error.play();
               // starter.text('Invalid Move, Try Again'); 
                starter.text('Checker cannot go back'); 

            }
        
        
        } else if (isWhite) {
            if (!isWhiteOccupied && row > firsti && (!isBlackOccupied)) {
                starter.text('Nice Move :)');
                return true;
            }  else if (!firstButton.classList.contains("white_queen") && row < firsti){
                
                error.play();
               // starter.text('Invalid Move, Try Again'); 
                starter.text('Checker cannot go back'); 

            }
        }
        
       
        return false;
       
    }
    
    function queenMoves(row, col, currentPlayer) {
        
        var validMoves = [];
        var directions = [
            { dx: 1, dy: 1 },
            { dx: 1, dy: -1 },
            { dx: -1, dy: 1 },
            { dx: -1, dy: -1 }
        ];
    
        for (var d = 0; d < directions.length; d++) {
            var dx = directions[d].dx;
            var dy = directions[d].dy;
    
            var newRow = row + dx;
            var newCol = col + dy;
            // add a note that it shouldnt move to a place if in the way no capture or there are same team piece
            while (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
                var move = board[newRow][newCol];
                var target = move.classList.contains("show_stone_white","white_queen") ? "white"
                    : move.classList.contains("show_stone_black","black_queen")? "black" : null;
    
                if (!target) {
                    validMoves.push({ row: newRow, col: newCol });
                } else if (currentPlayer !== target) {
                    var jumpRow = newRow + dx;
                    var jumpCol = newCol + dy;
    
                    if (jumpRow >= 0 && jumpRow < 8 && jumpCol >= 0 && jumpCol < 8) {
                        var jumpSquare = board[jumpRow][jumpCol];
                        if (!jumpSquare.classList.contains("show_stone_white") &&!jumpSquare.classList.contains("show_stone_black") &&
                            !jumpSquare.classList.contains("white_queen") && !jumpSquare.classList.contains("black_queen")) {
                            validMoves.push({row: jumpRow,col: jumpCol,captured: true});

                        }
                    }
                    break; 
                }else if(target){
                    error.play();
                    starter.text("Invalid King move");

                }
                 else { 
                    starter.text("King cannot jump over own team")
                    break; // Kings can't jump over their own pieces or kings
                }
    
                newRow += dx;
                newCol += dy;
            }
        }
         // Filter out moves that capture own team's pieces
            validMoves = validMoves.filter(move => {
                var targetCell = board[move.row][move.col];
                return !(currentPlayer === "black" && targetCell.classList.contains("show_stone_black","black_queen")) &&
                    !(currentPlayer === "white" && targetCell.classList.contains("show_stone_white","white_queen"));
            });
    
        return validMoves;
    }

  
    var doubleJumpInProgress = false;
    var doubleJumpValidMoves = []; // Declare the variable here
    document.addEventListener("click", function(event) {
        if (doubleJumpInProgress && event.target === firstButton) {
            doubleJumpInProgress = false;
            changePlayer();
            checkWin();
            firstButton = null;
           // starter.text(currentPlayer === "black" ? secondname + " turn" : firstname + " turn");
        }
    });
    

    var moveCountB = 0;
    var moveCountW = 0;

    var firstJump = null;

    function handleButtonClick(event) {
        if (event.  target.tagName === 'BUTTON') {
            var clickedButton = event.target;
            var btnId = clickedButton.id;
            var i = parseInt(btnId.charAt(1)) - 1;
            var j = btnId.charCodeAt(0) - a.charCodeAt(0);
            var doublejumpeDone= false;

            if (!firstButton) {
                if (firstJump)
                    if ((firstJump !=clickedButton) )
                    {
                        return;
                    }
                    checkWin();
                if ((clickedButton.classList.contains("show_stone_" + currentPlayer))|| 
                    (clickedButton.classList.contains("black_queen") || clickedButton.classList.contains("white_queen"))) {
                    firstButton = clickedButton;
                }
            } else {
                var firsti = parseInt(firstButton.id.charAt(1)) - 1;
                var firstj = firstButton.id.charCodeAt(0) - a.charCodeAt(0);

                var dx = Math.abs(i - firsti);
                var dy = Math.abs(j - firstj);
            
                if (((i-1== firsti || i+1 == firsti) && (j-1== firstj || j+1==firstj)) && canMoveTo(i,j,currentPlayer) && ((!board[i][j].classList.contains("show_stone_white") && (!board[i][j].classList.contains("show_stone_black")))) && (!firstButton.classList.contains("white_queen")) && (!firstButton.classList.contains("black_queen")) && !clickedButton.classList.contains("white_queen","black_queen") && firstJump== null) {
                    // Normal move
                   
                    clickedButton.classList = firstButton.classList;
                    firstButton.classList.remove("show_stone_white", "show_stone_black");
                    changePlayer();
                } else if ((dx === 2 && dy === 2 && canMoveTo(i, j, currentPlayer))  && !firstButton.classList.contains("white_queen") && !firstButton.classList.contains("black_queen") && !clickedButton.classList.contains("white_queen") && !clickedButton.classList.contains("black_queen")) {
                    // Capture move
                    var middleRow = (i + firsti) / 2;
                    var middleCol = (j + firstj) / 2;
                    var enemyPiece = board[middleRow][middleCol];
                    var isEnemyWhite = enemyPiece.classList.contains("show_stone_white");
                    var isEnemyBlack = enemyPiece.classList.contains("show_stone_black");

                        if ((currentPlayer === "black" && isEnemyWhite) || ((currentPlayer === "black") && board[middleRow][middleCol].classList.contains("white_queen") && canMoveTo(i, j, currentPlayer)) ) {
                            if (board[middleRow][middleCol].classList.contains("white_queen")) {
                                clickedButton.classList = firstButton.classList;
                                firstButton.classList.remove("show_stone_black");
                                board[middleRow][middleCol].classList.remove("white_queen");
                               // changePlayer();
                               eat.play(); 
                               changePlayer();

                            } else {
                                clickedButton.classList = firstButton.classList;
                                firstButton.classList.remove("show_stone_black");
                                board[middleRow][middleCol].classList.remove("show_stone_white");
                                eat.play(); 
                                moveCountB++;
                                checkWin();
                                if(moveCountB == 1 ){
                                    if(i> 1 && 1 < j && j < 6){
                                        var middler = ((i-2) + i) / 2;
                                        var middlec = ((j-2) + j) / 2;
                                        var middlec2 = ((j+2)+ j )/ 2;
                                        if (!board[i][j].classList.contains("black_queen","white_queen") && canMoveTo(i-2, j+2, currentPlayer) && board[middler][middlec2].classList.contains("show_stone_white") || canMoveTo(i-2, j-2, currentPlayer)&& board[middler][middlec].classList.contains("show_stone_white")) {
                                            currentPlayer = "black";
                                            firstJump = clickedButton;
                                            starter.text("Double jump must be done");
                                        } else {
                                            currentPlayer = "white";
                                        }
                                        
                                    }else if(j == 6 || j == 7){
                                        var middler = ((i-2) + i) / 2;
                                        var middlec = ((j-2) + j) / 2;
                                        var middlec2 = ((j+2)+ j )/ 2;
                                        if (!board[i][j].classList.contains("black_queen","white_queen") &&(canMoveTo(i-2, j-2, currentPlayer)&& board[middler][middlec].classList.contains("show_stone_white"))) {
                                            currentPlayer = "black";
                                            firstJump = clickedButton;
                                            starter.text("Double jump must be done");
                                        } else {
                                            currentPlayer = "white";
                                        }
                                    }else if(j == 0 || j==1){
                                        var middler = ((i-2) + i) / 2;
                                        var middlec = ((j-2) + j) / 2;
                                        var middlec2 = ((j+2)+ j )/ 2;
                                        if (!board[i][j].classList.contains("black_queen","white_queen") &&(canMoveTo(i-2, j+2, currentPlayer)&& board[middler][middlec].classList.contains("show_stone_white"))) {
                                            currentPlayer = "black";
                                            firstJump = clickedButton;
                                            starter.text("Double jump must be done");
                                        } else {
                                            currentPlayer = "white";
                                        }
                                    }
                                     else {
                                        currentPlayer = "white";
                                    }
                                }
                                // he has done a double jump 
                                if(moveCountB == 2){
                                    firstJump = null;
                                    doublejumpeDone = true;
                                    currentPlayer = "white";
                                    moveCountB = 0;
                                }
                                
                                board[firsti][firstj].classList.remove("black_queen", "white_queen");
                                board[firsti][firstj].classList.remove("show_stone_white", "show_stone_black");  
                            }
                        }else if ((currentPlayer === "white" && isEnemyBlack) || (currentPlayer === "white") && board[middleRow][middleCol].classList.contains("black_queen") && canMoveTo(i, j, currentPlayer) ) {
                                if (board[middleRow][middleCol].classList.contains("black_queen")) {
                                    clickedButton.classList = firstButton.classList;
                                    firstButton.classList.remove("show_stone_white");
                                    board[middleRow][middleCol].classList.remove("black_queen");
                                    eat.play(); 
                                    changePlayer();
                                } else {
                                    clickedButton.classList = firstButton.classList;
                                    firstButton.classList.remove("show_stone_white");
                                    board[middleRow][middleCol].classList.remove("show_stone_black");
                                    eat.play(); 
                                    moveCountW++;
                                    checkWin();
                                   // firstJump = clickedButton;
                                    if(moveCountW == 1){
                                        if(1 < i && i < 6 && (1 < j) &&  (j < 6)){
                                            var middlerW = ((i+2) + i) / 2;
                                            var middlecW = ((j-2) + j) / 2;
                                            var middlec2W = ((j+2)+ j )/ 2;
                                            if(i==5 && (!board[i][j].classList.contains("black_queen","white_queen")) && canMoveTo(i+2, j+2, currentPlayer)&& board[middlerW][middlec2W].classList.contains("show_stone_black") || canMoveTo(i+2, j-2, currentPlayer)&& board[middlerW][middlecW].classList.contains("show_stone_black")){
                                                currentPlayer = "white";
                                                firstJump = clickedButton;
                                                starter.text("Double jump must be done");
                                            }
                                            if ((!board[i][j].classList.contains("black_queen","white_queen")) && canMoveTo(i+2, j+2, currentPlayer)&& board[middlerW][middlec2W].classList.contains("show_stone_black") || canMoveTo(i+2, j-2, currentPlayer)&& board[middlerW][middlecW].classList.contains("show_stone_black")) {
                                                currentPlayer = "white";
                                                firstJump = clickedButton;
                                                starter.text("Double jump must be done");
                                            } else{ 
                                                currentPlayer = "black";
                                            }
                                        } else if(j == 7 || j == 6){
                                                var middlerW = ((i+2) + i) / 2;
                                                var middlecW = ((j-2) + j) / 2;
                                                var middlec2W = ((j+2)+ j )/ 2;
                                                if (!board[i][j].classList.contains("black_queen","white_queen") && (canMoveTo(i+2, j-2, currentPlayer)&& board[middlerW][middlecW].classList.contains("show_stone_black"))) {
                                                    currentPlayer = "white";
                                                    firstJump = clickedButton;
                                                    starter.text("Double jump must be done");
                                                } else {
                                                    currentPlayer = "black";
                                            }
                                            }else if(j == 1 || j== 0){
                                                if (!board[i][j].classList.contains("black_queen","white_queen") && (canMoveTo(i+2, j+2, currentPlayer)&& board[middlerW][middlecW].classList.contains("show_stone_black"))) {
                                                    currentPlayer = "white";
                                                    firstJump = clickedButton;
                                                    starter.text("Double jump must be done");

                                                } else {
                                                    currentPlayer = "black";
                                                }
                                            } else if((i == 0 && j == 0) || (i==0 && j==6)){
                                            if (!board[i][j].classList.contains("black_queen","white_queen") && canMoveTo(i+2, j+2, currentPlayer&& board[middlerW][middlec2W].classList.contains("show_stone_black") )|| (canMoveTo(i+2, j-2, currentPlayer)&& board[middlerW][middlecW].classList.contains("show_stone_black"))) {
                                                currentPlayer = "white";
                                                firstJump = clickedButton;
                                                starter.text("Double jump must be done");

                                            } else{ 
                                                currentPlayer = "black";
                                            }
                                        }else {
                                            currentPlayer = "black";
                                        }
                                    }else {
                                        currentPlayer = "black";
                                    }
                                    if(moveCountW == 2){
                                        firstJump = null;
                                        doublejumpeDone = true;
                                        currentPlayer = "black";
                                        moveCountW = 0;
                                    }
                                
                                board[firsti][firstj].classList.remove("black_queen", "white_queen");
                                board[firsti][firstj].classList.remove("show_stone_white", "show_stone_black");
                            }
                        }
                        checkWin();
                }else if (firstButton.classList.contains("black_queen") || firstButton.classList.contains("white_queen")) {
                   
                    var queenValidMoves = queenMoves(firsti, firstj, currentPlayer);

                    for (var k = 0; k < queenValidMoves.length; k++) {
                        if (queenValidMoves[k].row === i && queenValidMoves[k].col === j) {
                            // Valid queen move
                            if(firstButton.classList.contains("black_queen")){
                                clickedButton.classList = firstButton.classList;
                                firstButton.classList.remove("black_queen");
                               // firstButton.classList.remove("show_stone_white","white_queen");
                                //board[i-1]
                                if((firsti - i) > 0 && (j - firstj) > 0) { // forward right
                                    board[i+1][j-1].classList.remove("show_stone_white","white_queen");
                                } else if((i - firsti) > 0 && (j - firstj ) > 0) {// backward right
                                    board[i-1][j-1].classList.remove("show_stone_white","white_queen");
                                } else if((i - firsti) > 0 && ( firstj - j ) > 0) {//backward left
                                    board[i-1][j+1].classList.remove("show_stone_white","white_queen");
                                }else if(( firsti- i) > 0 && (firstj - j )> 0) { // forward left
                                    board[i+1][j+1].classList.remove("show_stone_white","white_queen");
                                }
                            
                              //  firstButton.classList.remove("black_queen","white_queen");
                                doubleJumpInProgress = true; // Set for double jumps
                               // changePlayer();
                                //eat.play();
                            }else if(firstButton.classList.contains("white_queen")){
                                clickedButton.classList = firstButton.classList;
                                firstButton.classList.remove("white_queen");
                               // firstButton.classList.remove("show_stone_white","white_queen");
                                //board[i-1]
                                if((firsti - i) > 0 && (j - firstj) > 0) { // forward right
                                    board[firsti-1][firstj+1].classList.remove("show_stone_black","black_queen");
                                } else if((i - firsti) > 0 && (j - firstj )>0) {// backward right
                                    board[firsti+1][firstj+1].classList.remove("show_stone_black","black_queen");
                                } else if((i - firsti) > 0 && ( firstj - j )>0) {//backward left
                                    board[firsti+1][firstj-1].classList.remove("show_stone_black","black_queen");
                                } else if(( firsti- i) > 0 && (firstj - j )>0) { // forward left
                                    board[firsti+1][firstj-1].classList.remove("show_stone_black","black_queen");
                                }
                                //board[middr][middC]
                                doubleJumpInProgress = true; // Set for double jumps
                               // changePlayer();
                              //  eat.play();
                            }
                           /* if (queenValidMoves[k]) {
                                var jumpedRow = queenValidMoves[k].row;
                                var jumpedCol = queenValidMoves[k].col;  
                                if(firstButton.classList.contains("black_queen")){   
                                    board[jumpedRow][jumpedCol].classList.remove("black_queen");
                                    board[jumpedRow][jumpedCol].classList.remove("show_stone_white","show_stone_black");
                                    eat.play(); 
                                    doubleJumpInProgress = true; // Set for double jumps
                                }else{
                                    board[jumpedRow][jumpedCol].classList.remove("white_queen");
                                    board[jumpedRow][jumpedCol].classList.remove("show_stone_black","show_stone_white");
                                    eat.play(); 
                                    doubleJumpInProgress = true; // Set for double jumps
                                }

                                changePlayer();
                            }*/
                            board[i][j].classList = clickedButton.classList; // Update the original queen cll
                           // changePlayer();
                             // Check if double jump is possible from new position
                            if (doubleJumpInProgress) {
                                doubleJumpValidMoves = queenMoves(i, j, currentPlayer);
                                if (doubleJumpValidMoves.length > 0) {
                                    // Store the queen's position for double jump
                                    firstButton = clickedButton;
                                    checkWin();
                                    return; // Wait for player's next move
                                } else {
                                    doubleJumpInProgress = false; // No more double jumps
                                    if(currentPlayer== "black"){
                                        currentPlayer = "white";
                                    } else{
                                        currentPlayer = "black";

                                    }
                                }
                            }
                            else {
                                if(currentPlayer== "black"){
                                    currentPlayer = "white";
                                } else{
                                    currentPlayer = "black";

                                }
                            }
                            break;
                        }
                    }
                   // changePlayer();
                }
                checkWin();
                firstButton = null;
            }

            if (clickedButton.id.charAt(1) === '1' && clickedButton.classList.contains("show_stone_black")) {
                clickedButton.classList.add("black_queen");
                clickedButton.classList.remove("show_stone_black");
                queen.play();

            } else if (clickedButton.id.charAt(1) === '8' && clickedButton.classList.contains("show_stone_white")) {
                clickedButton.classList.add("white_queen");
                clickedButton.classList.remove("show_stone_white");
                queen.play();
            }
            

            checkWin();
        }
    }
    
    board.forEach(function(row) {
        row.forEach(function(button) {
            button.addEventListener("click", handleButtonClick);
        });
    });
});

$(document).ready(function () {
    $('body > *:not(#form)').css('display', 'none');
});

var white = $('#white_name');
var black = $('#black_name');
$('#start').click(function() {
    firstname = $('#first_player').val();
    secondname = $('#second_player').val();
    if(firstname== "" || secondname== "" ){
        alert("Neither of the names can be empty");
    }else {
        white.text(firstname + " " + white_wins);
        black.text(secondname  + " " + black_wins);
        
        starter.text(secondname + ' Starts!');
        $('body > *:not(#form)').css('display', 'block');
        var f = $('#form');
        f.css('display', 'none');
        f.css('opacity', '0');
        f.css('transition', 'visibility 0s, opacity 0.3s ease-in-out');
    }
});
$('#bwin').on('click',function() {
    initialize();
    var bwin = $('#bwin');
    white.text(firstname + " " + white_wins);
    black.text(secondname  + " " + black_wins);
    bwin.removeClass('endb');
    bwin.text(secondname + " is the WINNER! Click for another game");
});
$('#wwin').on('click',function() {
    initialize();
    var wwin = $('#wwin');
    white.text(firstname + " " + white_wins);
    black.text(secondname  + " " + black_wins);
    wwin.removeClass('endw');
    
});
