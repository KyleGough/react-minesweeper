import React from 'react';
import './App.css';
import { Button } from '@material-ui/core';
import 'materialize-css';
import 'materialize-css/dist/css/materialize.min.css';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

// [TODO].
// FEATURE: Win detection.
// BUG:     Flagged counter error on flood fill.


// App header.
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1 className="header header-title">React - Minesweeper</h1>
        <p className="header header-subtitle">First project using React.</p>
        <small className="header-instructions">Use LEFT CLICK to reveal tiles.</small>
        <small className="header-instructions">Use RIGHT CLICK to flag tiles.</small>
        <p className="header header-link"><a href="https://github.com/KyleGough/react-minesweeper" target="_blank" rel="noopener noreferrer">See this project on Github</a></p>
      </header>
      <Board />
    </div>
  );
}

class Board extends React.Component {
  constructor(props) {
    super(props);

    const p = 0.15;
    const w = 18;
    const h = 18;
    const board = this.newBoard(p, w, h);
    const mines = this.countMines(board, w,h);

    // Reference array.
    this.refBoard = []
    for (let j = 0; j < h; j++) {
      let row = [];
      for (let i = 0; i < w; i++) {
        row[i] = React.createRef();
      }
      this.refBoard[j] = row;
    }

    this.state = {
      width: w,
      height: h,
      board: board,
      mines: mines,
      flags: 0,
      uncovered: 0,
      show: false,
      popGameOver: false,
    }
  }

  // Board Initialisation.
  newBoard(p, w, h) {
    let board = [];
    for (let j = 0; j < h; j++) {
      let row = [];
      for (let i = 0; i < w; i++) {
        row[i] = (Math.random() <= p) ? 1 : 0;
      }
      board[j] = row;
    }
    return board;
  }

  // Counts the number of mines in the board.
  countMines(board, w, h) {
    let count = 0
    for (let i = 0; i < w; i++) {
      for (let j = 0; j < h; j++) {
        count += board[j][i];
      }
    }
    return count;
  }

  // Resets the board. Hides every cell.
  resetBoard() {
    const board = this.newBoard(0.15, this.state.width, this.state.height);
    const mines = this.countMines(board, this.state.width, this.state.height);
    this.setState({board: board, mines: mines, flags: 0, uncovered: 0, show: false});
    for (let i = 0; i < this.state.width; i++) {
      for (let j = 0; j < this.state.height; j++) {
        this.refBoard[j][i].current.hideCell();
      }
    }
  }

  // Reveals the board.
  showBoard() {
    if (!this.state.show) {
      this.setState({show: true, popGameOver: true});
      for (let i = 0; i < this.state.width; i++) {
        for (let j = 0; j < this.state.height; j++) {
          this.refBoard[j][i].current.cellClick(true);
        }
      }      
    }
  }

  // Perform flood-fill at a given cell (x,y).
  floodFill(x, y) {
    let cellList = [];
    let stack = [];
    cellList.push([x,y]);
    stack.push([x,y]);

    // Check if a cell is in a list.
    const inList = (list, tuple) => {
      for (let i = 0; i < list.length; i++) {
        if (tuple[0] === list[i][0] && tuple[1] === list[i][1]) {
          return true;
        }
      }
      return false;
    };

    while (stack.length > 0) {
      let cell = stack.pop();
      x = cell[0];
      y = cell[1];

      let t = (y - 1 >= 0);
      let b = (y + 1 < this.state.height);
      let l = (x - 1 >= 0);
      let r = (x + 1 < this.state.width);   

      // Top.
      if (t && !inList(cellList, [x,y-1])) {
        if (this.refBoard[y-1][x].current.cellClick(true, 1) === 0) {
          stack.push([x,y-1]);
          cellList.push([x,y-1]);
        }
      }
      // Bottom.
      if (b && !inList(cellList, [x,y+1])) {
        if (this.refBoard[y+1][x].current.cellClick(true, 1) === 0) {
          stack.push([x,y+1]);
          cellList.push([x,y+1]);
        }
      }
      // Left.
      if (l && !inList(cellList, [x-1,y])) {
        if (this.refBoard[y][x-1].current.cellClick(true, 1) === 0) {
          stack.push([x-1,y]);
          cellList.push([x-1,y]);
        }
      }
      // Right.
      if (r && !inList(cellList, [x+1,y])) {
        if (this.refBoard[y][x+1].current.cellClick(true, 1) === 0) {
          stack.push([x+1,y]);
          cellList.push([x+1,y]);
        }
      }
      // Top-Left.
      if (t && l && !inList(cellList, [x-1,y-1])) {
        if (this.refBoard[y-1][x-1].current.cellClick(true, 1) === 0) {
          stack.push([x-1,y-1]);
          cellList.push([x-1,y-1]);
        }
      }
      // Top-Right.
      if (t && r && !inList(cellList, [x+1,y-1])) {
        if (this.refBoard[y-1][x+1].current.cellClick(true, 1) === 0) {
          stack.push([x+1,y-1]);
          cellList.push([x+1,y-1]);
        }
      }
      // Bottom-Left.
      if (b && l && !inList(cellList, [x-1,y+1])) {
        if (this.refBoard[y+1][x-1].current.cellClick(true, 1) === 0) {
          stack.push([x-1,y+1]);
          cellList.push([x-1,y+1]);
        }
      }
      // Bottom-Right.
      if (b && r && !inList(cellList, [x+1,y+1])) {
        if (this.refBoard[y+1][x+1].current.cellClick(true, 1) === 0) {
          stack.push([x+1,y+1]);
          cellList.push([x+1,y+1]);
        }
      }

    }
  }

  // Increments uncovered cell count.
  uncoverCell() {
    this.setState(prev => ({uncovered: prev.uncovered + 1}));
  }

  // Increments flag state.
  addFlag() {
    this.setState(prev => ({flags: prev.flags + 1}));
  }

  // Decrements flag state.
  removeFlag() {
    this.setState(prev => ({flags: prev.flags - 1}));
  }

  // Renders a cell.
  renderCell(i, y, x) {
    return (
      <Cell
        ref={this.refBoard[y][x]}
        value={i}
        x={x}
        y={y}
        hidden={true}
        board={this.state.board}
        uncover={this.uncoverCell.bind(this)}
        showBoard={this.showBoard.bind(this)}
        addFlag={this.addFlag.bind(this)}
        removeFlag={this.removeFlag.bind(this)}
        floodFill={this.floodFill.bind(this)}
      />
    );
  }

  // Renders a row of cells.
  renderRow(j) {  
    return (
      <div className="board-row">
        {this.renderCell(this.state.board[j][0], j, 0)}
        {this.renderCell(this.state.board[j][1], j, 1)}
        {this.renderCell(this.state.board[j][2], j, 2)}
        {this.renderCell(this.state.board[j][3], j, 3)}
        {this.renderCell(this.state.board[j][4], j, 4)}
        {this.renderCell(this.state.board[j][5], j, 5)}
        {this.renderCell(this.state.board[j][6], j, 6)}
        {this.renderCell(this.state.board[j][7], j, 7)}
        {this.renderCell(this.state.board[j][8], j, 8)}
        {this.renderCell(this.state.board[j][9], j, 9)}
        {this.renderCell(this.state.board[j][10], j, 10)}
        {this.renderCell(this.state.board[j][11], j, 11)}
        {this.renderCell(this.state.board[j][12], j, 12)}
        {this.renderCell(this.state.board[j][13], j, 13)}
        {this.renderCell(this.state.board[j][14], j, 14)}
        {this.renderCell(this.state.board[j][15], j, 15)}
        {this.renderCell(this.state.board[j][16], j, 16)}
        {this.renderCell(this.state.board[j][17], j, 17)}
      </div>
    )
  }
    
  // Displays the lose game snackbar.
  gameLoseClick() {
    this.setState({popGameOver: true})
  }

  // Closes the lose game snackbar.
  gameLoseClose(_, reason) {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({popGameOver: false})
  };

  // Renders the lose game snackbar.
  renderLoseSnackbar() {
    return (
      <Snackbar
          anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
          open={this.state.popGameOver}
          autoHideDuration={5000}
          onClose={this.gameLoseClose.bind(this)}
          ContentProps={{'aria-describedby': 'message-id'}}
          message={<span id="snackbar-game-lose">GAME OVER!</span>}
          action={[
            <IconButton
              key="close"
              aria-label="close"
              color="inherit"
              onClick={this.gameLoseClose.bind(this)}
            >
              <CloseIcon />
            </IconButton>,
          ]}
        />
    );
  }

  // Renders the board.
  render() {
    return (
      <div>
        <div className="stats">
          <Button
          className="btn-reset"
          variant="outlined"
          color="secondary"
          disableElevation
          onClick={() => this.resetBoard()}>Reset
        </Button>
        <Button
          className="btn-show"
          variant="outlined"
          color="primary"
          disableElevation
          onClick={() => this.showBoard()}>Show
        </Button>
          <span role="img" aria-label="bomb" className="stats-mines">💣 {this.state.mines}</span>
          <span role="img" aria-label="flag" className="stats-flags">🚩 {this.state.flags}</span>
        </div>
        <div className="board">
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
          {this.renderRow(10)}
          {this.renderRow(11)}
          {this.renderRow(12)}
          {this.renderRow(13)}
          {this.renderRow(14)}
          {this.renderRow(15)}
          {this.renderRow(16)}
          {this.renderRow(17)}
        </div>
        {this.renderLoseSnackbar()}
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

  // Hides the cell.
  hideCell() {
    this.setState({value: this.props.value, hidden: true, class: "cell cell-hide"});
  }

  // Reveals the cell.
  cellClick(leftClick, d) {
    // Ignore click event if already uncovered.
    if (!this.state.hidden) { return; }

    // Right-click.
    if (!leftClick) {
      this.setState(prev => {
        if (prev.value === "🚩") {
          prev.value = 0;
          this.props.removeFlag();
        }
        else {
          prev.value = "🚩";
          this.props.addFlag();
        }
        return prev;
      });
      return;
    }
    
    // Mark as not hidden.
    this.setState({hidden: false})
    // Alert board that a cell has been uncovered.
    this.props.uncover();

    // If flagged.
    if (this.state.value === "🚩") {
      this.props.removeFlag();
    }

    // Mine cell.
    if (this.props.board[this.props.y][this.props.x] === 1) {
      this.setState({value: "💣"});
      if (d === 0) {
        this.props.showBoard();
      }
      return;
    }

    // Non-mine cell.
    let adjacentMines = 0;
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        let cellValue;
        try {
          cellValue = this.props.board[this.props.y + j][this.props.x + i] || 0;
        }
        catch (err) {
          cellValue = 0;
        }
        finally {
          adjacentMines += cellValue;
        }
      }
    }

    if (d === 0 && adjacentMines === 0) {
      this.props.floodFill(this.props.x, this.props.y);
    }

    const className = "cell cell-show cell-" + adjacentMines;
    this.setState({value: adjacentMines});
    this.setState({class: className});
    return adjacentMines;
  }

  // Renders the cell.
  render() {
    return (
      <button
        className={this.state.class}
        onClick={() => this.cellClick(true, 0)}
        onContextMenu={(e) => {this.cellClick(false); e.preventDefault()}}
      >
        {this.state.value}
      </button>
    )
  }
}

export default App;
