let tiles
let displayTiles
let display
let announcer

window.addEventListener('DOMContentLoaded', () => {
    tiles = Array.from(document.querySelectorAll('.tile'));
    displayTiles = Array.from(document.querySelectorAll('.display-tile'));
    display = document.querySelector('.display');
    announcer = document.querySelector('.announcer');
    resetButton = document.querySelector('#reset');

    resetButton.addEventListener('click', () => reset());

    tiles.forEach((tile, index) => {
        tile.addEventListener('click', () => handleUserInput(tile, index));
    });
});



let tilesToEdge = [];
let movesToTile = [-4, 4, 1, -1, -3, 3, -5, 5, 16, -16, 12, -12, -20, 20, -15, 15, 17, -17, 13, -13, -19, 19, -21, 21, -11, 11];
let boardLength = 4;
let boardQtnd = 4;

let gameBoard = Array(64).fill('')

let isGameActive = true;
let currentPlayer = 'X'

function handleUserInput(tile, index) {
    if (isGameActive) {
        if (tile.innerText == '') {
            tile.innerText = currentPlayer;
            displayTiles[index].innerText = currentPlayer;
            gameBoard[index] = currentPlayer
            checkVitory(index, gameBoard, currentPlayer);
            changePlayer();
        }
    }
}

function checkVitory(index, board, currentPlayer) {
    let won = 0;
    let moves = [];
    console.log(index)
    for (let direction = 0; direction < 26; direction++) {
        if (direction % 2 == 0) {
            won = 0;
            moves = [];
        }
        for (let n = 1; n <= tilesToEdge[index][direction]; n++) {
            moves.push(index + (movesToTile[direction] * n));
            if (board[index + (movesToTile[direction] * n)] == currentPlayer) {
                won++;
            }

            if (won == 3) {
                moves.push(index);
                win(moves);
                return true
            }
        }
    }
    return false
}

function win(moves) {
    moves.forEach((move) => {
        tiles[move].classList.add('red')
        displayTiles[move].classList.add('red')
    });
    isGameActive = false
    display.innerText = 'Player ' + currentPlayer + ' WON!';
}

function changePlayer() {
    if (isGameActive) {
        currentPlayer = currentPlayer == 'X' ? 'O' : 'X';
        display.innerText = 'Player ' + currentPlayer + ' turn';
    }
}


//Calculates how many adjacent tiles there are for each tile for every direction.
for (let board = 0; board < boardQtnd; board++) {
    for (let column = 0; column < boardLength; column++) {
        for (let row = 0; row < boardLength; row++) {
            let up = column;
            let down = boardLength - 1 - column;
            let rigth = boardLength - 1 - row;
            let left = row;

            let forward = boardQtnd - 1 - board;
            let backward = board;

            tilesToEdge.push([
                up,
                down,
                rigth,
                left,
                Math.min(up, rigth),
                Math.min(down, left),
                Math.min(up, left),
                Math.min(down, rigth),
                // z axis
                forward,
                backward,
                Math.min(up, forward),
                Math.min(down, backward),
                Math.min(up, backward),
                Math.min(down, forward),
                Math.min(rigth, backward),
                Math.min(left, forward),
                Math.min(rigth, forward),
                Math.min(left, backward),
                Math.min(up, rigth, forward),
                Math.min(down, left, backward),
                Math.min(up, rigth, backward),
                Math.min(down, left, forward),
                Math.min(up, left, backward),
                Math.min(down, rigth, forward),
                Math.min(down, rigth, backward),
                Math.min(up, left, forward)
            ]);

        }
    }
}

function reset() {
    tiles.forEach((tile) => {
        tile.innerText = '';
        tile.classList.remove('red');
    });
    displayTiles.forEach((tile) => {
        tile.innerText = ' ';
        tile.classList.remove('red');
    });
    currentPlayer = 'X';
    display.innerText = 'Player ' + currentPlayer + ' turn';
    gameBoard = Array(64).fill('')
    isGameActive = true;
}

