import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import { Grid } from '@material-ui/core';
import 'materialize-css';
import 'materialize-css/dist/css/materialize.min.css';
import { thisExpression } from '@babel/types';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Board />
      </header>
    </div>
  );
}

class Board extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      width: 10,
      height: 10,
      board: []
    }

    this.boardReset();
    this.boardAddMines(0.1);  
  }

  // Board Initialisation.
  boardReset() {
    this.state.board = []
    for (let i = 0; i < this.state.width; i++) {
      let row = []
      for (let j = 0; j < this.state.height; j++) {
        row[j] = 0;
      }
      this.state.board[i] = row;
    }
  }

  // Add mines with probability p.
  boardAddMines(p) {
    for (let i = 0; i < this.state.width; i++) {
      for (let j = 0; j < this.state.height; j++) {
        if (Math.random() <= p) {
          this.state.board[i][j] = 1;
        }        
      }
    }
  }


  renderCell(i, x, y) {
    return <Cell value={i} x={x} y={y}/>
  }

  renderRow(i) {  
    return (
      <div className="board-row">
        {this.renderCell(this.state.board[i][0], i, 0)}
        {this.renderCell(this.state.board[i][1], i, 1)}
        {this.renderCell(this.state.board[i][2], i, 2)}
        {this.renderCell(this.state.board[i][3], i, 3)}
        {this.renderCell(this.state.board[i][4], i, 4)}
        {this.renderCell(this.state.board[i][5], i, 5)}
        {this.renderCell(this.state.board[i][6], i, 6)}
        {this.renderCell(this.state.board[i][7], i, 7)}
        {this.renderCell(this.state.board[i][8], i, 8)}
        {this.renderCell(this.state.board[i][9], i, 9)}
      </div>
    )
  }
    

  render() {
    const status = "React Minesweeper";
    
    return (
      <div>
        <div className="status">{status}</div>
        {this.renderRow(0)}
        {this.renderRow(1)}
        {this.renderRow(2)}
        {this.renderRow(3)}
        {this.renderRow(4)}
        {this.renderRow(5)}
        {this.renderRow(6)}
        {this.renderRow(7)}
        {this.renderRow(8)}
        {this.renderRow(9)}
      </div>
    )
  }
}

class Cell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      class: "cell cell-hide",
    }
  }

  render() {
    return (
      <button
        className={this.state.class}
        onClick={() => this.setState({class: "cell cell-show"})}
      >
        {this.props.value}
      </button>
    )
  }
}

export default App;
