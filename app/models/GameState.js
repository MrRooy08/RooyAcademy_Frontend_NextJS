class GameState {
  static WIN_LENGTH = 3;
  constructor(
    board = Array.from({ length: 3 }, () => Array(3).fill("")),
    isPlayerTurn = 1,
    nextPlayer = 0,
    lastMove = null
  ) {
    this._lastMove = lastMove; // Lưu lại nước đi cuối cùng
    this.board = board; // 2D array
    this._isPlayerTurn = isPlayerTurn;
    this._nextPlayer = nextPlayer;
  }

  get getBoard() {
    return this.board;
  }

  /**
   * Đặt bàn cờ mới.
   * @param {Array<Array>} newBoard - Bàn cờ mới (mảng hai chiều).
   */
  set setBoard(newBoard) {
    this.board = newBoard;
  }

  get getPlayerTurn() {
    return this._isPlayerTurn;
  }

  /**
   * Đặt lượt người chơi hiện tại.
   * @param {number} newIsPlayerTurn - Lượt người chơi mới (0 hoặc 1).
   */
  set setPlayerTurn(newIsPlayerTurn) {
    this._isPlayerTurn = newIsPlayerTurn;
  }

  get getNextPlayer() {
    return this._nextPlayer;
  }

  /**
   * Đặt lượt người chơi hiện tại.
   * @param {number} newNextPlayerTurn - Lượt người chơi mới (0 hoặc 1).
   */
  set setNextPlayer(newNextPlayer) {
    this._nextPlayer = newNextPlayer;
  }

  get getLastMove() {
    return this._lastMove;
  }

  /**
   * Đặt bàn cờ mới.
   * @param {Array<Array>} newLastMove - Bàn cờ mới (mảng hai chiều).
   */
  set setLastMove(newLastMove) {
    this._lastMove = newLastMove;
  }

  getPossibleMoves() {
    const moves = []; //declare an array contains a move wasn't used
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        if (this.board[i][j] === "") {
          moves.push([i, j]); // Nếu ô trống, thêm vào danh sách nước đi hợp lệ
        }
      }
    }
    return moves;
  }

  static fromJSON(json) {
    return new GameState(
      json.board,
      json._isPlayerTurn,
      json._nextPlayer,
      json._lastMove
    );
  }

  getChangePlayerTurn(isPlayerTurn) {
    if (isPlayerTurn === 1) {
      console.log("Chuyen sang bot");
      return 0; // Chuyển sang bot
    } else {
      console.log("Chuyen sang nguoi choi");
      return 1;
    }
  }

  //check lai
  applyMove(move) {
    console.log(typeof this.board); // Kiểm tra kiểu dữ liệu của this.board
    console.log("check move", move);
    const newBoard = this.board.map((row) => [...row]);

    if (this.getPlayerTurn === 1) {
      console.log(
        "Nuoc di cua nguoi :",
        move,
        " nguoi choi: ",
        this.getPlayerTurn
      );
    } else {
      console.log("Nuoc di cua AI:", move, " nguoi choi: ", this.getPlayerTurn);
    }
    if (move instanceof Array ) {
      newBoard[move[0]][move[1]] = 1;  
    }
    else {
      newBoard[move.state[0]][move.state[1]] = this.getPlayerTurn;
    }
    console.log("Ban co sau khi di trong gamestate:", newBoard);
    console.log("Nguoi choi hien tai:", this.getPlayerTurn);
    const isPlayerTurn = this.getPlayerTurn;
    const nextPlayer = this.getChangePlayerTurn(this.getPlayerTurn);
    console.log("Nguoi choi tiep theo:", nextPlayer);
    return new GameState(newBoard, isPlayerTurn, nextPlayer, move);
  }

  isTerminal() {
    // nếu getWinner trả về null là chưa có ng thắng thì return false, có ng thắng return true
    // hoặc không còn nước đi nào sẽ trả về true, còn ô trống thì trả về false
    console.log("getWinner:", this.getWinner());
    console.log("getPossibleMoves:", this.getPossibleMoves().length);
    return this.getWinner() !== null || this.getPossibleMoves().length === 0;
  }

  getWinner() {
    const player = this.getPlayerTurn;
    const lastMove = this.getLastMove;
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        if (
          this.checkRowWin(lastMove, player) ||
          this.checkColWin(lastMove, player) ||
          this.checkMainDiagonalWin(lastMove, player) ||
          this.checkAntiDiagonalWin(lastMove, player)
        ) {
          const checkrow = this.checkRowWin(lastMove, player);
          const checkcol = this.checkColWin(lastMove, player);
          const checkdiagonal = this.checkMainDiagonalWin(lastMove, player) || this.checkAntiDiagonalWin(lastMove, player);
          console.log("check row", checkrow);
          console.log("check col", checkcol);
          console.log("check cheo", checkdiagonal);
          console.log("Nguoi choi thang", player);
          return player;
        }
      }
    }
    return null; // No winner yet
  }

  getResult() {
    const winner = this.getWinner();
    if (winner === 1) return 1; // Player 1 wins
    if (winner === 0) return -1; // Player 2 wins
    return 0; // Draw or ongoing game
  }

  checkRowWin(lastMove, player) {
    if (!lastMove || lastMove.length !== 2) return false;
  
    const [row, col] = lastMove;
    const board = this.board;
    let count = 1;
  
    // Kiểm tra bên trái
    for (let i = 1; i < GameState.WIN_LENGTH; i++) {
      const c = col - i;
      if (c < 0) break;
      if (board[row][c] !== player) break;
      count++;
    }
  
    // Kiểm tra bên phải
    for (let i = 1; i < GameState.WIN_LENGTH; i++) {
      const c = col + i;
      if (c >= board[0].length) break;
      if (board[row][c] !== player) break;
      count++;
    }
  
    return count >= GameState.WIN_LENGTH;
  }


  checkColWin(lastMove, player) {
    if (!lastMove || lastMove.length !== 2) return false;
  
    const [row, col] = lastMove;
    const board = this.board;
    let count = 1;
  
    // Kiểm tra bên trái
    for (let i = 1; i < GameState.WIN_LENGTH; i++) {
      const r = row - i;
      if (r < 0) break;
      if (board[r][col] !== player) break;
      count++;
    }
  
    // Kiểm tra bên phải
    for (let i = 1; i < GameState.WIN_LENGTH; i++) {
      const r = row + i;
      if (r >= board.length) break;
      if (board[r][col] !== player) break;
      count++;
    }
  
    return count >= GameState.WIN_LENGTH;
  }

  checkMainDiagonalWin(lastMove, player) {
    if (!lastMove || lastMove.length !== 2) return false;
  
    const [row, col] = lastMove;
    const board = this.board;
    let count = 1;
  
    // Kiểm tra bên trái
    for (let i = 1; i < GameState.WIN_LENGTH; i++) {
      const r = row - i;
      const c = col - i;
      if (r < 0 || c < 0) break;
      if (board[r][c] !== player) break;
      count++;
    }
  
    // Kiểm tra bên phải
    for (let i = 1; i < GameState.WIN_LENGTH; i++) {
      const r = row + i;
      const c = col + i;
      if (r >= board.length || c >= board[0].length) break;
      if (board[r][c] !== player) break;
      count++;
    }
  
    return count >= GameState.WIN_LENGTH;
  }
  checkAntiDiagonalWin(lastMove, player) {
    if (!lastMove || lastMove.length !== 2) return false;
  
    const [row, col] = lastMove;
    const board = this.board;
    let count = 1;
  
    // Kiểm tra bên trái
    for (let i = 1; i < GameState.WIN_LENGTH; i++) {
      const r = row - i;
      const c = col + i;
      if (r < 0 || c >= board[0].length) break;
      if (board[r][c] !== player) break;
      count++;
    }
  
    // Kiểm tra bên phải
    for (let i = 1; i < GameState.WIN_LENGTH; i++) {
      const r = row + i;
      const c = col - i;
      if (r >= board.length || c < 0) break;
      if (board[r][c] !== player) break;
      count++;
    }
  
    return count >= GameState.WIN_LENGTH;
  }
    
    
}

export default GameState;
