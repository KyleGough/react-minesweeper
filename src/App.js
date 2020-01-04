import React from 'react';
//import ReactDOM from 'react-dom';
import './App.css';
import { Button } from '@material-ui/core';
import 'materialize-css';
import 'materialize-css/dist/css/materialize.min.css';

// TODO LIST.
// Custom board sizes.
// Difficulty.
// Flood fill.
// First move.
// End game detection.

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

    const p = 0.3;
    const w = 10;
    const h = 10;
    const board = this.newBoard(p, w, h);
    const mines = this.countMines(board, w,h);

    // Reference array.
    this.refBoard = []
    for (let i = 0; i < w; i++) {
      let row = [];
      for (let j = 0; j < h; j++) {
        row[j] = React.createRef();
      }
      this.refBoard[i] = row;
    }

    this.state = {
      width: w,
      height: h,
      board: board,
      mines: mines,
      uncovered: 0,
    }
  }

  getRefBoard(w, h) {
    let refBoard = []
    for (let i = 0; i < w; i++) {
      let row = [];
      for (let j = 0; j < h; j++) {
        row[j] = React.createRef();
      }
      refBoard[i] = row;
    }
    return refBoard;
  }

  // Board Initialisation.
  newBoard(p, w, h) {
    let board = [];
    for (let i = 0; i < w; i++) {
      let row = [];
      for (let j = 0; j < h; j++) {
        row[j] = (Math.random() <= p) ? 1 : 0;
      }
      board[i] = row;
    }
    return board;
  }

  countMines(board, w, h) {
    let count = 0
    for (let i = 0; i < w; i++) {
      for (let j = 0; j < h; j++) {
        count += board[j][i];
      }
    }
    return count;
  }

  resetBoard() {
    const board = this.newBoard(0.3, this.state.width, this.state.height);
    const mines = this.countMines(board, this.state.width, this.state.height);
    this.setState({board: board, mines: mines, uncovered: 0});
    for (let i = 0; i < this.state.width; i++) {
      for (let j = 0; j < this.state.height; j++) {
        this.refBoard[j][i].current.hideCell();
      }
    }
  }

  uncoverCell() {
    this.setState(prev => ({uncovered: prev.uncovered + 1}));
  }

  renderCell(i, y, x) {
    return <Cell ref={this.refBoard[y][x]} value={i} x={x} y={y} hidden={true} board={this.state.board} uncover={this.uncoverCell.bind(this)}/>
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
        <div className="stats">
          <span className="stats-mines">Mines: {this.state.mines}</span>
          <span className="stats-uncovered">Uncovered: {this.state.uncovered}</span>
        </div>
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
      <Button
        className="btn-reset"
        variant="outlined"
        color="secondary"
        disableElevation
        onClick={() => this.resetBoard()}>Reset</Button>
      </div>
    )
  }
}

class Cell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      class: "cell cell-hide",
      value: this.props.value,
      hidden: true,
    }
  }

  hideCell() {
    this.setState({value: this.props.value, hidden: true, class: "cell cell-hide"});
  }

  cellClick(x,y, leftClick) {
    // Ignore click event if already uncovered.
    if (!this.state.hidden) { return; }

    // Right-click.
    if (!leftClick) {
      console.log(this.state.value);
      this.setState(prev => {
        prev.value = (prev.value === "🚩") ? 0 : "🚩";
        return prev;
      });
      return;
    }
    
    // Mark as not hidden.
    this.setState({hidden: false})
    // Alert board that a cell has been uncovered.
    this.props.uncover();

    // Mine cell.
    if (this.props.board[y][x] === 1) {
      this.setState({value: "💣"});
      return;
    }

    // Non-mine cell.
    let adjacentMines = 0;
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        let cellValue;
        try {
          cellValue = this.props.board[y+j][x+i] || 0;
        }
        catch (err) {
          cellValue = 0;
        }
        finally {
          adjacentMines += cellValue;
        }
      }
    }

    const className = "cell cell-show cell-" + adjacentMines;
    this.setState({value: adjacentMines});
    this.setState({class: className});
  }

  // Cell rendering.
  render() {
    return (
      <button
        className={this.state.class}
        onClick={() => this.cellClick(this.props.x, this.props.y, true)}
        onContextMenu={(e) => {this.cellClick(this.props.x, this.props.y, false); e.preventDefault()}}
      >
        {this.state.value}
      </button>
    )
  }
}

export default App;
