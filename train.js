function bestMove() {
    let bestScore = -Infinity;
    let move;
    let player = currentPlayer;
    isGameActive = false
    for (let i = 0; i < 64; i++) {
        if (gameBoard[i] == '') {
            gameBoard[i] = currentPlayer;
            let score = minimax(i, 0, false, player);
            gameBoard[i] = '';
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }

    isGameActive = true

    handleUserInput(tiles[move], move)
}

function minimax(move, depth, isMaximizing, player, alpha = -Infinity, beta = Infinity) {
    let result = checkVictory(move, gameBoard, player, false);
    if (result) {
        return player == currentPlayer ? 10 : -10;
    }

    if (gameBoard.find((e) => e == '') == undefined || depth > 3) {
        return 0;
    }

    let nextPlayer = player == 'X' ? 'O' : 'X';

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 64; i++) {
            if (gameBoard[i] == '') {
                gameBoard[i] = player;
                let score = minimax(i, depth + 1, false, nextPlayer, alpha, beta);
                gameBoard[i] = '';
                bestScore = Math.max(score, bestScore);
                alpha = Math.max(alpha, score);
                if (beta <= alpha) {
                    break;
                }
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 64; i++) {
            if (gameBoard[i] == '') {
                gameBoard[i] = player;
                let score = minimax(i, depth + 1, true, nextPlayer, alpha, beta);
                gameBoard[i] = '';
                bestScore = Math.min(score, bestScore);
                beta = Math.min(beta, score);
                if (beta <= alpha) {
                    break;
                }
            }
        }
        return bestScore;
    }
}
