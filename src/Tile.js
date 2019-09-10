import React, { Component } from 'react';
import Piece from './Piece';

class Tile extends Component {
  constructor(props) {
    super(props);
    this.redOrBlack = this.redOrBlack.bind(this);
  }

  redOrBlack(idxArr) {
    if (idxArr[0] % 2 === 0) {
      if (idxArr[1] % 2 === 0) {
        return '#EAEDED';
      }
      return '#714C43';
    } else {
      if (idxArr[1] % 2 === 0) {
        return '#714C43';
      }
      return '#EAEDED';
    }
  }


  render() {

    let redOrBlack = this.redOrBlack(this.props.id);
    let playerNum = this.props.playerNum;
    let isLit = this.props.isLit;

    let tileStyle = {
      backgroundColor: redOrBlack,
      opacity: (isLit ? '1' : '0.8'),
      height: '100px',
      width: '100px',
      textAlign: 'center'
    };

    let litTile = (
      <button style={tileStyle} onClick={this.props.chooseMove}> </button>
    );

    let regTile = (
      <div style={tileStyle}>
        {(playerNum) ? <Piece 
          movePiece={this.props.movePiece}
          key={this.props.id}
          id={this.props.id}
          isKing={this.props.isKing}
          playerNum={playerNum} /> : ''}
      </div>
    );

    return(
      <td id={this.props.id}>
        {isLit ? litTile : regTile}
      </td>
    )
  }
}

export default Tile;