import React from 'react';

class Stats extends React.Component {
  render() {
    return (
      <div className="stats">
        <h1>Sudoku Stats</h1>
	<p>Moves: {this.props.moves}</p>
	<p>Clues: {this.props.clues}</p>
      </div>
    );
  }
}

export default Stats
