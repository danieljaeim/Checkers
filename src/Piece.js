import React, { Component } from 'react';


class Piece extends Component {

  render() {

    const isKing = (this.props.isKing ? 'true' : 'false');

    let pieceStyle = {
      position: 'relative',
      margin: '13px',
      opacity: '1',
      // backgroundColor: this.props.playerNum === 1 ? 'purple' : 'black',
      width: '75px',
      height: '75px',
      borderRadius: '40px',
      borderWidth: this.props.isKing ? 'thin medium thick 10px' : '',
      borderColor: this.props.isKing ? this.props.playerNum === 1 ? 'aquamarine' : 'coral' : '',
      backgroundImage: this.props.playerNum === 1 ? `url(./bluefedora.gif)` : `url(./redfedora.gif)`,
      backgroundPosition: 'center'

    }

    return(
      <div id={this.props.id} isking={isKing} playernum={this.props.playerNum}>
        <button style={pieceStyle} onClick={this.props.movePiece}></button>
      </div>
    );
  }
}

export default Piece;