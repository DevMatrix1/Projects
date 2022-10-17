/* check restructure */
// later tasks:
// add music  - Akash's code for ASDF, figure out diffrent music for start and gameover
// transition faster as game progresses???
// how to play guide

//keyboard bindings with tiles - ASDF - same order for all rows
// screen-1: title piano tiles and score on left with main game boxes neeche
// screen-2: pop-out -game over screen with blackout in background with buttons - share ,restart, exit

const audios = document.querySelectorAll('audio');

let playingArea = document.querySelector('.playing-area');
let playing = true;
let gamePlaying = true;
let gameScore = 0;
let highScore = 0;
let board = [];
let myInterval = null;
let gameRows = [];
let timeElapsed = 0;
let gameRowWasEmpty = false;
let gameScoreContainer = document.querySelector("#gameScore");
let currentRow = null;
let startOnce = true;
let speed = 900;
let root = document.querySelector(':root');
let style = getComputedStyle(document.body);

const controls = new Set(['A', 'S', 'D', 'F']);

// moving rows up and out of board using transform tanslate!

function BoardSetup() {
  // generate first 3 rows
  for (let i = 0; i < 3; i++) {
    board.push(generateRow());
  }
  // for(let i=0; i<) board[2]
  // last row is yellow in setup
  let yellowRow = Array(4).fill('yellow');
  board.push(yellowRow);
  console.log('board:', board);

  //filling gameRows 
  let initialRows = playingArea.querySelectorAll('div');
  for (let a = 2; a >= 0; a--) {
    gameRows.push(initialRows[a]);
    console.log("gamerows:", gameRows)
  }
}

//background music
function playBackgroundMusic(){
  const myAudio = document.getElementById("background-music");  
  myAudio.currentTime = 0;
  myAudio.volume = 0.2; 
  myAudio.play();
};

document.addEventListener('click', playBackgroundMusic, {once: true});
document.addEventListener('keypress', playBackgroundMusic, {once: true});
  

// function fillBoard(){
//     for (let outerIndex = 0; outerIndex < 4; outerIndex++){
//         let currentRow = document.createElement('div');
//         for (let innerIndex = 0; innerIndex < 4; innerIndex++){
//             let currentCell = document.createElement('span');
//             currentCell.style.height = '20px';
//             currentCell.style.width = '20px';
//             if (board[outerIndex][innerIndex] == 'white'){
//                 currentCell.style.backgroundColor = "white"
//             } else if (board[outerIndex][innerIndex] == 'black'){
//                 currentCell.style.backgroundColor = "black"
//             } else {
//                 currentCell.style.backgroundColor = "yellow"
//             }
//             currentRow.appendChild(currentCell);
//         }
//         playingArea.appendChild(currentRow);
//     }
// }
//testing purpose only. do not try this at home

// fillBoard();
// makeBoardDisplay();

function makeBoardDisplay() {
  BoardSetup();
  // let firstRow = document.querySelector(".first-row");
  // let secondRow = document.querySelector(".second-row");
  // let thirdRow = document.querySelector(".third-row");
  // let fourthRow = document.querySelector(".fourth-row");
  let rows = document.querySelectorAll('.rows');
  // let boardRows = [firstRow,secondRow,thirdRow,fourthRow]
  for (let i = 0; i < 4; i++) {
    // console.log('should be html element: ', rows[i]);
    let spans = rows[i].querySelectorAll('span');
    // console.log('spans in a row: ', spans);
    for (let j = 0; j < 4; j++) {
      spans[j].style.backgroundColor = board[i][j];
      if (board[i][j] == 'black') {
        spans[j].style.color = 'white';
      }
      if (board[i][j] == 'white') {
        spans[j].style.color = 'white';
      }
      if (board[i][j] == 'yellow') {
        spans[j].style.color = 'yellow';
      }
      // console.log('current row and current span: ',boardRows[i],spans[j])
      // console.log('current span bg color: ',spans[j].style.backgroundColor)
      // console.log('board[i][j] value ',board[i][j])
    }
    // [span.A, span.S, span.D, span.F]
  }

  //adding 4 more rows 
  // for(let i = 0; i<4; i++){
  //     insertNewRowInPlayingArea();
  // }
}

// let thirdRow = document.querySelector(".third-row");
// thirdRow.addEventListener("keypress"), function(){

// }

// thirdRow.addEventListener("click"), function(){

// }

// check if clicked block is white/black,
// continuegame = false if white, mark it as red?;
// else if clicked block is black, generate a new row and add new score

function removeLastRowFromPlayingArea() {
  let divs = playingArea.querySelectorAll('div');
  divs[divs.length - 1].remove();
}

function insertNewRowInPlayingArea(newRow) {
  let newRowDiv = document.createElement('div');
  newRowDiv.classList.add('rows');
  newRowDiv.innerHTML =
    '<span class="A">A</span><span class="S">S</span><span class="D">D</span><span class="F">F</span>';
  //appends element to the beginning of playingArea
  playingArea.prepend(newRowDiv);
  gameRows.push(newRowDiv);

  let spans = newRowDiv.querySelectorAll('span');
  console.log('span hahaha:', spans);
  for (let i = 0; i < 4; i++) {
    spans[i].style.backgroundColor = newRow[i];
    spans[i].style.color = 'white';
    // if(newRow[i] == 'black'){
    //     spans[i].style.color = 'white';
    // }
    // if(newRow[i] == 'white'){
    //     spans[i].style.color = 'white';
    // }
    // console.log("span[i]:", spans[i])
    // if(newRow[i] == 'black'){
    //     console.log("spans[i].style object:",spans[i].style)

    //     spans[i].style.backgroundColor = 'black';
    // } else {
    //     // spans[i].style.backgroundColor = 'white';
    // }
  }
}

//listening to current row
// function currentRowEventListen(event) {
//   // LOGIC left for any row!
//   let element = event.target;
//   let rowIteration = 0;
//   while (playing) {
//     if (element.style.backgroundColor == 'black' && rowIteration == 2) {
//       element.style.backgroundColor = 'grey';
//       // board.push();
//       var newRow = generateRow();
//       console.log('added new row is:', newRow);
//       // adding new row
//       board.splice(0, 0, newRow);
//       // deleting old row
//       board.pop();
//       //playing area - 1. remove last row
//       // 2. insert new Row
//       removeLastRowFromPlayingArea();
//       console.log('should remove last row');
//       insertNewRowInPlayingArea(newRow);

//       console.log('board after black click:', board);
//       rowIteration++;
//     } else if (element.style.backgroundColor == 'white') {
//       playing = false;
//       console.log('game quit message inside generateNewBoard');
//     }
//   }
// }

function selectAndListenCurrentRow() {


  if (gameRows.length === 0) {
    gameRowWasEmpty = true;
    console.log("gameRows.length became 0 ")
    currentRow = null;
    return;
  }

  let currentRowOnCurrentBoard = currentRow = gameRows[0];
  // let currentRowOnCurrentBoard = gameRows[0];
  console.log('currentRowOnCurrentBoard::', currentRowOnCurrentBoard);
  let flag = false;

  currentRowOnCurrentBoard.addEventListener('click', function (event) {
    // console.log("hum yaha nahi aye!!")
    // quit game on no event and wrong event(white) on current row
    flag = true;
    let element = event.target;
    
    if (element.style.backgroundColor == 'black') {
      const audio = document.querySelector(`audio[data-key="${element.textContent}"]`);

      if(audio){
        audio.currentTime = 0;
        audio.play()
      ;}
      element.style.backgroundColor = 'grey';
      gameScore++;
      gameScoreContainer.textContent = gameScore;
      gameRows.shift();

      selectAndListenCurrentRow();
      // gamePlaying = true;
      // return gamePlaying;
    } else if (element.style.backgroundColor == 'white') {
      element.style.backgroundColor = 'red';
      console.log('call in line 241');
      clearInterval(myInterval);
      endGamePopMessage();
      gamePlaying = false;
      return;
      // console.log(
      //   'gameplaying white click inside selectAndListenCurrentRow()',
      //   gamePlaying
      // );


    }

    // if (gamePlaying == false) {
    //   // console.log('radhika test: are we inside gamePlaying');
    //   clearInterval(myInterval);
    //   console.log('call in 255');
    //   endGamePopMessage();
    //   return;
    // }
  });

  //    window.addEventListener("keypress",function(event){
  //       if(timeElapsed == 1)    return;

  //       if(currentRowOnCurrentBoard == null)    return;
  //       console.log("currentRowOnCurrentBoard in keypress inside selectAndListenCurrentRow :",currentRowOnCurrentBoard)
  //       if(!controls.has(event.key.toUpperCase())) return ;
  //       const keyPressed = event.key.toUpperCase();
  //       console.log("eventkey inside selectAndListenCurrentRow", keyPressed);
  //       let spans = currentRowOnCurrentBoard.querySelectorAll('span');
  //       for(let span of spans){
  //         if(span.textContent == keyPressed ){
  //           if(span.style.backgroundColor == 'black'){
  //             span.style.backgroundColor = 'grey';
  //             gameRows.shift();
  //             gameScore++;
  //             gameScoreContainer.textContent = gameScore;      
  //             selectAndListenCurrentRow();

  //           } else if (span.style.backgroundColor == 'white') {
  //             span.style.backgroundColor = 'red';
  //             gamePlaying = false;                                                                                                                                                                                                                             
  //       // console.log(
  //       //   'gameplaying white click inside selectAndListenCurrentRow()',
  //       //   gamePlaying
  //       // );
  //       if (gamePlaying == false) {
  //         console.log('radhika test: currentRowOnCurrentBoard in keypress inside selectAndListenCurrentRow gamePlaying became false, end interval');
  //         // clearInterval(myInterval);
  //       } 
  //     };  
  // }}});

}

//counter for score of the person 

function appendAndDeleteRow(gamePlaying) {
  console.log("log speed:", speed)
  // dynamically change the run interval

  if (speed > 100) {
    speed -= 15;
    clearInterval(myInterval); // stop the setInterval()
    myInterval = setInterval(appendAndDeleteRow, speed, gamePlaying); // start the
  }


  if (timeElapsed > gameScore) {
    console.log("game stopped due to no click in appendAndDeleteRow as time elapsed!!")
    gamePlaying = false;
    clearInterval(myInterval);
    console.log('call in 311)');
    endGamePopMessage();
    return;
  }

  timeElapsed++;


  // console.log("game  rows every second are inside appendAndDeleteRow: ", gameRows);

  var newRow = generateRow();
  // console.log('added new row is:', newRow);
  // adding new row
  board.splice(0, 0, newRow);

  // deleting new row
  board.pop();
  //playing area - 1. remove last row
  // 2. insert new Row
  removeLastRowFromPlayingArea();
  // console.log('should remove last row');
  insertNewRowInPlayingArea(newRow);

  // check wrong event (white click) and check no event (no click)
  // || gameRowWasEmpty
  if (timeElapsed === 1 || gameRowWasEmpty) {
    gameRowWasEmpty = false;
    gamePlaying = selectAndListenCurrentRow();
  }



  console.log('gamePlaying inside listenEventOnSecondLastRow():', gamePlaying);
  // console.log("forcestop in appendAndDeleteRow... by making gamePlaying false")
  // gamePlaying = false;
  if (gamePlaying == false) {
    console.log('radhika test: are we inside gamePlaying');
    // clearInterval(myInterval);
  }
  // listenEventOnSecondLastRow(gamePlaying,myInterval)
}


//AKASH - keybind functionality
window.addEventListener("keypress", function (event) {
  if (currentRow == null) return;

  if (!controls.has(event.key.toUpperCase())) return;
  const keyPressed = event.key.toUpperCase();

  console.log("hi i am current row:", currentRow)
  console.log("eventkey", keyPressed);

  let spans = currentRow.querySelectorAll('span');

  for (let span of spans) {

    if (span.textContent == keyPressed) {
      if (span.style.backgroundColor == 'black') {
        span.style.backgroundColor = 'grey';
        gameScore++;
        gameRows.shift();

        if (gameRows.length == 0) {
          gameRowWasEmpty = true;
          currentRow = null;
          return;
        }

        const audio = document.querySelector(`audio[data-key="${keyPressed}"]`);

        if(audio){
          audio.currentTime = 0;
          audio.play();
        } 

        console.log("i am gameRows array: ", gameRows);
        currentRow = gameRows[0];
        selectAndListenCurrentRow();

        console.log("I am current row : ", currentRow);
        gameScoreContainer.textContent = gameScore;

        if (myInterval == null) {
          myInterval = setInterval(appendAndDeleteRow, speed, gamePlaying);
          //   var myFunction = function(){
          //     clearInterval(myInterval);
          //     counter *= 10;
          //     interval = setInterval(myFunction, counter);
          // }
          // var myInterval = setInterval(myFunction, speed);
        }


      } else {
        span.style.backgroundColor = 'red';
        clearInterval(myInterval)
        console.log('call in 409');
        endGamePopMessage();
        //game over
      }

      // the keypressed thing has been executed
      return;
    }
  }

  // console.log(span, 'event key ',event.key);
}

);


function clickonStart() {

  currentRow = gameRows[0];

  console.log('currentrow inside clickonstart::', currentRow);

  currentRow.addEventListener('click', function (event) {
    let cell = event.target;

    console.log("cell.textContent == ", cell.textContent);
    const audio = document.querySelector(`audio[data-key="${cell.textContent}"]`);

    if(audio){
      audio.currentTime = 0;
      audio.play()
    ;}

    if (cell.style.backgroundColor == 'black') {
      cell.style.backgroundColor = 'grey';
      gameScore = 1;
      gameScoreContainer.textContent = gameScore;

      gameRows.shift();
      selectAndListenCurrentRow();
      //translating the playing area in Y direction
      // setInterval(transformPlayingArea, 1000);

      myInterval = setInterval(appendAndDeleteRow, speed, gamePlaying);
      // console.log(
      //   'gamePlaying outside listenEventOnSecondLastRow():',
      //   gamePlaying
      // );
    } else {
      cell.style.backgroundColor = 'red';
      console.log('call in 459');
      endGamePopMessage();
      // console.log('call in clickon start()');
      console.log('quit game inside clickonStart() ');
    }
  });

  // window.addEventListener("keydown",function(event){
  //   if(startOnce == false)    return;
  //   if(currentRow == null)    return;
  //   console.log("i am current row inside clickonstart in keydown:",currentRow)
  //   if(!controls.has(event.key.toUpperCase())) return ;
  //   const keyPressed = event.key.toUpperCase();
  //   console.log("eventkey pressed inside clickonstart in keydown:", keyPressed);
  //   let spans = currentRow.querySelectorAll('span');
  //   for(let span of spans){
  //     if(span.textContent == keyPressed ){
  //       if(span.style.backgroundColor == 'black'){
  //         span.style.backgroundColor = 'grey';
  //         gameScore = 1;  
  //         gameScoreContainer.textContent = gameScore;

  //     //translating the playing area in Y direction
  //     // setInterval(transformPlayingArea, 1000);
  //     console.log("caling appendAndDeleteRow inside clickonstart in keydown  ")
  //     // myInterval = setInterval(appendAndDeleteRow, 200, gamePlaying);
  //     appendAndDeleteRow(gamePlaying)
  //     // console.log(
  //     //   'gamePlaying outside listenEventOnSecondLastRow():',
  //     //   gamePlaying
  //     // );
  //       } else {
  //         span.style.backgroundColor = 'red';
  //         // console.log('quit game inside clickonStart() ');

  //         }
  //       }
  //     } 
  //     // console.log(span, 'event key ',event.key);
  //     startOnce = false;
  //   }

  // );



  // secondLastRow.addEventListener('click', currentRowEventListen);
}

// main function
function playGame() {
  makeBoardDisplay();
  clickonStart();

}

playGame();

function generateRow() {
  let row = Array(4).fill('white');
  // console.log("generated row: ",row);
  let blackPosition = Math.trunc(Math.random() * 4);
  // console.log("random black position: ",blackPosition);
  row[blackPosition] = 'black';
  // console.log("row with a random black: ",row);
  return row;
}
// function fillBoard() {
//     //to fill board
//     for (let i=0; i<4;i++){
//         board.push(generateRow())
//     }
// }

function removeAllRowsFromPlayingArea(){
    let rows = playingArea.querySelectorAll('div');
    console.log(rows);
    if(!rows) return;
    for(let row of rows){
      row.remove();
    }
}

function fillBoardWithSimple4Rows(){
  for(let i = 0; i<4; i++){
    let newRowDiv = document.createElement('div');
    newRowDiv.classList.add('rows');
    newRowDiv.innerHTML =
      '<span class="A">A</span><span class="S">S</span><span class="D">D</span><span class="F">F</span>';
    //appends element to the beginning of playingArea
    playingArea.appendChild(newRowDiv);
  }
}

function endGamePopMessage() {

  const gameOverSound = new Audio('sounds/game-over.wav');

  if(gameOverSound){
      gameOverSound.currentTime = 0;
      gameOverSound.play();
  }

  playingArea.innerHTML += '<div class="end-game-pop"></div>';
  let endGamePop = document.querySelector(".end-game-pop");
  endGamePop.style.position = 'absolute';
  endGamePop.style.backgroundColor = 'red';
  endGamePop.style.left = '0';
  endGamePop.style.top = '0';
  endGamePop.style.width = style.getPropertyValue("--pa-width");
  endGamePop.style.height = style.getPropertyValue("--pa-height");
  // <button class="exit-btn">Exit</button>
  endGamePop.innerHTML += `<p class="game-over-message">Game Over!</p><p class="game-over-score">Game Score:` + gameScore + `</p><button class="play-btn">Play Again</button>`;
  
  let playBtn = document.querySelector(".play-btn");
  console.log("playbtnn: ", playBtn);
  playBtn.addEventListener("click", function () {
    // document.location = 'https://var-piano-tiles.netlify.app/'


    //remove all rows from playing area
    // removeAllRowsFromPlayingArea();
    // //gameRows setup
    // fillBoardWithSimple4Rows();

    // //remove popup
    // //call playGame()
    //  highScore = Math.max(gameScore, highScore);
    
    //  playing = true;
    //  gamePlaying = true;
    //  gameScore = 0;
    //  board = [];
    //  myInterval = null;
    //  gameRows = [];
    //  timeElapsed = 0;
    //  gameRowWasEmpty = false;
    //  currentRow = null;
    //  speed = 900;
    
    // //board fill
    // //board display as html
    // //gameRows fill

    // console.log(highScore);


    // playGame();

    
    endGamePop.remove();
    window.location.reload();

  })
}




