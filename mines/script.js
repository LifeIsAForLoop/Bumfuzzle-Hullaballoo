// start button will put a bomb in a random item of the list depending on how many are in the modifier  
let outputMessageEl = document.getElementById("output-message")
let inputModifier = document.getElementById("input-modifier")
let outputMessage = outputMessageEl.innerHTML

let tileList = []
let tileInfo = [[], [], [], [], []];
let imageInfo = [];

let tilesLeft = 0;
let gameStatus = 0;
let allowClicking = 0;
gameSetup();

inputModifier.addEventListener('input', function (e) {
  // Remove any non-numeric characters using a regular expression
  this.value = this.value.replace(/[^0-9]/g, '');
});

// create a for loop that will select a random tile and put a bomb in the amount of times the modifier says to
function renderGame() {
  if (gameStatus != 0) {return};

  let minesAmount = inputModifier.value
  if (minesAmount > 0 && minesAmount <= 24) {
    outputMessage = "Currently Working"
    outputMessageEl.innerHTML = outputMessage;
    generateBombs(tileInfo, minesAmount);
    tilesLeft = 25 - calculateBombsLeft()
    
    allowClicking = 1;
    gameStatus = 1;
  } else {
    outputMessage = "Error: Mines Value Not Accepted";
    outputMessageEl.innerHTML = outputMessage;
  }
}

function calculateBombsLeft(){
  let numOfBombs = 0;
  
  for (let y = 0; y < 5; y++) {
    for (let x = 0; x < 5; x++) {
      if (tileInfo[y][x] == 1) {
        numOfBombs +=1;
      }
    }
  }

  return numOfBombs;
}

/**
 * If state is 0 then their is no bomb on the tile
 * If state is 1 then their is a bomb on the tile
 * If state is 2 then the tile has been click and cannot be clicked again
 * @returns state
 */
function getStateFromI(i) {
  let x = ((i - 1) % 5)
  let y = Math.floor((i - 1) / 5);

  return tileInfo[y][x];
}

function placeImageOnTile(i, source, type) {
  let image = document.createElement('img')
  image.src = source
  image.setAttribute('id', type)
  image.setAttribute("alt", type);
  tileList[i-1].appendChild(image)
  return image;
}

function removeTileImage(i) {
  if (tileList[i-1] == document.getElementById('tileBomb') || tileList[i-1] == document.getElementById('tileGem')) {
    tileList[i-1].removeChild(imageInfo[i-1]);
  }
}

function flipTile(i) {
  let img; 
  let state = getStateFromI(i)

  if(state== 0) {
    img= placeImageOnTile(i, "../vectors/gem.png", "gem")
    tileList[i-1].setAttribute("id", "tileGem")
  } else if(state == 1) {
    img= placeImageOnTile(i, "../vectors/bomb.png", "bomb")
    tileList[i-1].setAttribute("id", "tileBomb")
  }
  
  if (img) {
    imageInfo[i-1] = img; 
  }
}

/**
 * Handles when a tile is clicked on by the user
 * @return null
 */
function onTileClick(i) {
  if (allowClicking != 1) {return};
 
  let x = ((i - 1) % 5)
  let y = Math.floor((i - 1) / 5);

  if (tileInfo[y][x] == 1) {
    lose();
  } else if (tileInfo[y][x] == 0) {
    tilesLeft -= 1;
    flipTile(i)
    tileInfo[y][x] = 2
    if(tilesLeft <=0 ) {
      win()
    }

  } 
}

function generateBombs(arrayToFill, amountOfBombs) {
  for (let y = 0; y < 5; y++) {
    for (let x = 0; x < 5; x++) {
      arrayToFill[y][x] = 0;
    }
  }

  for (i = 0; i < amountOfBombs; i++) {
    let randomX = Math.floor(Math.random() * 5);
    let randomY = Math.floor(Math.random() * 5);
    //console.log(randomX + " " + randomY)
    while (arrayToFill[randomY][randomX] == 1) {
      randomX = Math.floor(Math.random() * 5);
      randomY = Math.floor(Math.random() * 5);
    }

    arrayToFill[randomY][randomX] = 1;
  }
}

function lose() {
  allowClicking = 0;
  
  for(let i = 1; i <= 25; i++) {
    flipTile(i)
  }

  // 5 seconds to reset game
  sleep(3000).then(() => {resetGame();})
}

function win() {
  if (gameStatus != 1) {return};
  allowClicking = 0;

  for(let i = 1; i <= 25; i++) {
    flipTile(i)
  }

  // 5 seconds to reset game
  sleep(2000).then(() => {resetGame();})
}

function resetGame() {
  gameStatus = 0;
  for(let i = 1; i <= 25; i++) {
   removeTileImage(i);
   tileList[i-1].setAttribute("id", '');
  }

  outputMessageEl.innerHTML = "Place your bet here"
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function gameSetup() {
  for (let i = 0; i < 25; i++) {
    let tile = document.createElement('div')
    tile.setAttribute("class", "tile")
    document.getElementById("tile-box").appendChild(tile)
    tileList.push(tile)
  }
  
  for (let i = 0; i < 25; i++) {
    tileList[i].addEventListener("click", () => {
      onTileClick(i + 1);
    })    
  }  
}
