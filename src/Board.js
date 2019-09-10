import React, { Component } from 'react';
import Tile from './Tile';
import StateContext from './StateContext';
import uuid from 'uuid';

class Board extends Component {

  constructor(props) {
    super(props);
    this.createBoard = this.createBoard.bind(this);
    this.fillBoard = this.fillBoard.bind(this);
    this.state = {
      board: this.createBoard(),
      currentPlayer: 1,
      currentPiece: { currentPiece: [0, false, false], currentPos: [0, 0] },
      currentPieceKing: false,
      capturing: false,
      One: 12, 
      Two: 12
    }
    this.movePiece = this.movePiece.bind(this);
    this.lightTiles = this.lightTiles.bind(this);
    this.unlightTiles = this.unlightTiles.bind(this);
    this.chooseMove = this.chooseMove.bind(this);
    this.capturePiece = this.capturePiece.bind(this);
    this.checkForKing = this.checkForKing.bind(this);

  }

  //creates new instance of board array
  createBoard() {
    let newBoard = Array(8).fill(0).map((row, i) => this.fillBoard(i))
    console.log('newBoard', newBoard);
    return newBoard;
  }

  //helper function to populate this.state board with 0's and 1's
  fillBoard(rowIdx) {
    // [playerNum, isLit, isKing]
    if (rowIdx <= 2) {
      if (rowIdx % 2 === 0) {
        return Array(8).fill(0).map((tile, i) => (i % 2 === 0 ? [0, false, false] : [1, false, false]))
      }
      return Array(8).fill(0).map((tile, i) => (i % 2 === 0 ? [1, false, false] : [0, false, false]))
    }
    if (rowIdx >= 5) {
      if (rowIdx % 2 !== 0) {
        return Array(8).fill(0).map((tile, i) => (i % 2 === 0 ? [2, false, false] : [0, false, false]))
      }
      return Array(8).fill(0).map((tile, i) => (i % 2 === 0 ? [0, false, false] : [2, false, false]))
    }
    return Array(8).fill(0).map((tile, i) => [0, false, false])
  }

  unlightTiles(board) {
    let boardCopy = [...board].map(row => row.map(tile => [tile[0], false, tile[2]]));
    return boardCopy;
  }

  movePiece(evt) {
    let pieceY = +evt.target.parentNode.id[0];
    let pieceX = +evt.target.parentNode.id[2];
    let playerNum = +evt.target.parentNode.getAttribute('playernum');
    const currentPiece = this.state.board[pieceY][pieceX];
    const currentPos = this.state.currentPiece.currentPos;
    const isCapturing = this.state.capturing;

    if (this.state.One < 0) {
      alert('Player Two Wins')
      return;
    }
    if (this.state.Two < 0) {
      alert('Player Two Wins')
      return;
    }

    //if the piece I'm clicking is not the current player, stop it
    if (playerNum !== this.state.currentPlayer && !isCapturing) {
      console.log('wrong player, cant move this piece')
      return;
    }

    if (this.state.capturing) {
      console.log(currentPos, 'is capturing');
      if (pieceY !== currentPos[0] || pieceX !== currentPos[1]) {
        return;
      }
    }

    let newBoard = this.unlightTiles(this.state.board)
    let { litBoard } = this.lightTiles(newBoard, pieceY, pieceX);
    this.setState(st => ({
      currentPiece: { currentPiece, currentPos: [pieceY, pieceX] },
      board: litBoard
    }), () => console.log('currentpiece', this.state.currentPiece));
  }


  lightTiles(board, y, x) {
    let litBoard = [...board];
    let isKingly = board[y][x][2];
    let canCapture = false;
    let nextPlayer = this.state.currentPlayer === 1 ? 2 : 1;

    if (isKingly) {
      if (y - 1 >= 0 && x - 1 >= 0) {
        if (board[y - 1][x - 1][0] === 0) { //light top left
          litBoard[y - 1][x - 1] = [board[y - 1][x - 1][0], true, isKingly]
        }
        if (board[y - 1][x - 1][0] === nextPlayer) {
          if (y - 2 >= 0 && x - 2 >= 0) {
            if (board[y - 2][x - 2][0] === 0) { //if that space afterwards is empty
              litBoard[y - 2][x - 2] = [board[y - 2][x - 2][0], true, isKingly]
              canCapture = true;
            }
          }
        }
      }

      if (y - 1 >= 0 && x + 1 < board.length) { // if im jumping player1 piece
        if (board[y - 1][x + 1][0] === 0) {
          litBoard[y - 1][x + 1] = [board[y - 1][x + 1][0], true, isKingly]
        }
        if (board[y - 1][x + 1][0] === nextPlayer) {
          if (y - 2 >= 0 && x + 2 < board.length) {
            if (board[y - 2][x + 2][0] === 0) { //if that space afterwards is empty
              litBoard[y - 2][x + 2] = [board[y - 2][x + 2][0], true, isKingly]
              canCapture = true;
            }
          }
        }
      }

      if (y + 1 < board.length && x + 1 < board.length) { // if im jumping player1 piece
        if (board[y + 1][x + 1][0] === 0) {
          litBoard[y + 1][x + 1] = [board[y + 1][x + 1][0], true, isKingly]
        }
        if (board[y + 1][x + 1][0] === nextPlayer) {
          if (y + 2 < board.length && x + 2 < board.length) {
            if (board[y + 2][x + 2][0] === 0) { //if that space afterwards is empty
              litBoard[y + 2][x + 2] = [board[y + 2][x + 2][0], true, isKingly]
              canCapture = true;
            }
          }
        }
      }

      if (y + 1 < board.length && x - 1 >= 0) { // if im jumping player1 piece
        if (board[y + 1][x - 1][0] === 0) {
          litBoard[y + 1][x - 1] = [board[y + 1][x - 1][0], true, isKingly]
        }
        if (board[y + 1][x - 1][0] === nextPlayer) {
          if (y + 2 < board.length && x - 2 >= 0) {
            if (board[y + 2][x - 2][0] === 0) { //if that space afterwards is empty
              litBoard[y + 2][x - 2] = [board[y + 2][x - 2][0], true, isKingly] //light it up!!!
              canCapture = true;
            }
          }
        }
      }
      return { litBoard, canCapture };
    }
    //player2
    else if (board[y][x][0] === 2) { //if player 2

      if (y - 1 >= 0 && x - 1 >= 0) {
        if (board[y - 1][x - 1][0] === 0) { //light top left
          litBoard[y - 1][x - 1] = [board[y - 1][x - 1][0], true, isKingly]
        }
        if (board[y - 1][x - 1][0] === 1) {
          if (y - 2 >= 0 && x - 2 >= 0) {
            if (board[y - 2][x - 2][0] === 0) { //if that space afterwards is empty
              litBoard[y - 2][x - 2] = [board[y - 2][x - 2][0], true, isKingly] //light it up!!!
              canCapture = true;
            }
          }
        }
      }

      if (y - 1 >= 0 && x + 1 < board.length) { // if im jumping player1 piece
        if (board[y - 1][x + 1][0] === 0) {
          litBoard[y - 1][x + 1] = [board[y - 1][x + 1][0], true, isKingly]
        }
        if (board[y - 1][x + 1][0] === 1) {
          if (y - 2 >= 0 && x + 2 < board.length) {
            if (board[y - 2][x + 2][0] === 0) { //if that space afterwards is empty
              litBoard[y - 2][x + 2] = [board[y - 2][x + 2][0], true, isKingly] //light it up!!!
              canCapture = true;
            }
          }
        }
      }
    }

    else if (board[y][x][0] === 1) { //if player 2

      if (y + 1 < board.length && x + 1 < board.length) { // if im jumping player1 piece
        if (board[y + 1][x + 1][0] === 0) {
          litBoard[y + 1][x + 1] = [board[y + 1][x + 1][0], true, isKingly]
        }
        if (board[y + 1][x + 1][0] === 2) {
          if (y + 2 < board.length && x + 2 < board.length) {
            if (board[y + 2][x + 2][0] === 0) { //if that space afterwards is empty
              litBoard[y + 2][x + 2] = [board[y + 2][x + 2][0], true, isKingly] //light it up!!!
              canCapture = true;
            }
          }
        }
      }

      if (y + 1 < board.length && x - 1 >= 0) { // if im jumping player1 piece
        if (board[y + 1][x - 1][0] === 0) {
          litBoard[y + 1][x - 1] = [board[y + 1][x - 1][0], true, isKingly]
        }
        if (board[y + 1][x - 1][0] === 2) {
          if (y + 2 < board.length && x - 2 >= 0) {
            if (board[y + 2][x - 2][0] === 0) { //if that space afterwards is empty
              litBoard[y + 2][x - 2] = [board[y + 2][x - 2][0], true, isKingly] //light it up!!!
              canCapture = true;
            }
          }
        }
      }
    }
    return { litBoard, canCapture };
  }

  chooseMove(evt) {
    //click on the lit tile to choose that move
    let tileY = +evt.target.parentNode.id[0]; //NEW TILE CHOSEN
    let tileX = +evt.target.parentNode.id[2]; //NEW TILE CHOSEN
    let currentPlayer = this.state.currentPlayer;
    let nextPlayer = (currentPlayer === 2 ? 1 : 2)
    let { currentPiece, currentPos } = this.state.currentPiece;
    let oldPieceY = currentPos[0]; //OLD TILE Y WAS
    let oldPieceX = currentPos[1]; //OLD TILE X WAS 

    let { newBoard, didCapture } = this.capturePiece(this.state.board, tileY, tileX, oldPieceY, oldPieceX, currentPlayer, currentPiece);

    if (didCapture && this.lightTiles(this.state.board, tileY, tileX).canCapture) {
      this.setState(st => ({
        board: this.unlightTiles(this.checkForKing(newBoard)),
        capturing: true,
        currentPiece: { currentPiece, currentPos: [tileY, tileX] }
      }))
    } else {
      this.setState(st => ({
        board: this.unlightTiles(this.checkForKing(newBoard)),
        currentPlayer: nextPlayer,
        capturing: false,
        currentPiece: { currentPiece, currentPos: [tileY, tileX] }
      }))
    }
  }


  checkForKing(board) {
    if (board[0].map(tilesArr => tilesArr[0] === 2).includes(true)) {
      for (let i = 1; i < board[0].length; i += 2) {
        if (board[0][i][0] === 2 && board[0][i][2] === false) {
          board[0][i][2] = true;
        }
      }
    }
    if (board[7].map(tilesArr => tilesArr[0] === 1).includes(true)) {
      for (let i = 0; i < board[7].length; i += 2) {
        if (board[7][i][0] === 1 && board[7][i][2] === false) {
          board[7][i][2] = true;
        }
      }
    }
    return board;
  }

  capturePiece(board, tileY, tileX, pieceY, pieceX, currentPlayer, currentPiece) {
    let didCapture = false;
    let newBoard = [...board];
    if (Math.abs(pieceY - tileY) === 2 && Math.abs(pieceX - tileX) === 2) {
      
      let removeX = (pieceX + tileX) / 2;
      let removeY = (pieceY + tileY) / 2;
      newBoard[removeY][removeX] = [0, false, false]
      didCapture = true;
      
      if (currentPlayer === 1) {
        this.setState(st => ({ Two: st.Two - 1 }))
      }
      else if (currentPlayer === 2) {
        this.setState(st => ({ One: st.One - 1 }))
      }
      
    }
    newBoard[tileY][tileX] = currentPiece;
    newBoard[pieceY][pieceX] = [0, false, false];

    return { newBoard, didCapture };
  }

  resetGame() {
    this.setState(st => {
      board: this.createBoard()
    });
  }

  render() {

    return (
      <div>
        <h2>Checkers!</h2>
        <table className="game-board" key='board'>
          <tbody>
            {this.state.board.map((arr, y) =>
              <tr key={uuid()} className="tile">
                {arr.map((tile, x) =>
                  <Tile
                    playerNum={this.state.board[y][x][0] !== 0 ?
                      this.state.board[y][x][0] : false
                        || this.state.board[y][x][0] !== 0 ?
                        this.state.board[y][x][0] : false}
                    id={[y, x]}
                    key={[y, x]}
                    movePiece={this.movePiece}
                    chooseMove={this.chooseMove}
                    isLit={this.state.board[y][x][1]}
                    isKing={this.state.board[y][x][2]}
                  />
                )}
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }
}


export default Board; 