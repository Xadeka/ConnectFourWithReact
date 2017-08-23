import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const height = 6;
const width = 7;

function Square(props) {
	let classes = ["square", props.color];
	return (
		<div className={classes.join(" ")} />
	);
}

class ControlSquare extends React.Component {
	constructor() {
		super();
		this.state = {hovered: false};
	}

	onMouseEnter() {
		this.setState({hovered: true});
	}

	onMouseLeave() {
		this.setState({hovered: false});
	}

	render() {
		const hovered = this.state.hovered;
		let classes = ["square", this.props.color];
		if (!hovered) classes.push("hidden");
		return (
			<button className={classes.join(" ")} onClick={this.props.onClick} onMouseEnter={this.onMouseEnter.bind(this)} onMouseLeave={this.onMouseLeave.bind(this)} />
		);
	}
}

class Board extends React.Component {
	renderSquare(i, color) {
		return (
			<Square
				key={i}
				color={color} />
		);
	}

	renderControlSquare(i, color, handleClick) {
		return(
			<ControlSquare
				key={i}
				color={color}
				onClick={handleClick} />
		);
	}

	render() {
		let rows = [];
		// Generate controls
		let controlRow = [];
		for (let i = 0; i < width; i++) {
			controlRow.push(this.renderControlSquare("control-" + i, getCurrentPlayerColor(this.props.redIsNext), this.props.handleSquareClick(i)));
		}
		rows.push(controlRow);

		// Generate board
		for (let i = 0; i < height; i++) {
			let row = [];
			for (let j = 0; j < width; j++) {
				const squareIndex = (width*i)+j;
				row.push(this.renderSquare(squareIndex, this.props.board[squareIndex]));
			}
			rows.push(<div key={"row-" + i} className="row">{row}</div>);
		}

		return (
			<div className="board">{rows}</div>
		);
	}
}

class Game extends React.Component {
	constructor() {
		super();
		this.state = {
			board: Array(height*width).fill(null),
			redIsNext: true,
		};
	}

	// Must use with .bind(this) because we want this to refer to the Game class
	handleSquareClick(pos) {
		return () => {
			// Only exectue on the top row
			if (pos >= width) return;

			const redIsNext = this.state.redIsNext;
			const current = this.state.board;
			console.log(current);
			// Only execute if the square can be played
			if (current[pos]) return;

			// Loop from the bottom to check for available spots in that column
			let positionToPlay = null;
			for (let i = height-1; i >= 0; i--) {
				let posToCheck = (width * i) + pos;
				if (!current[posToCheck]) {
					positionToPlay = posToCheck;
					break;
				}
			}
			if (positionToPlay == null) return;
			current[positionToPlay] = getCurrentPlayerColor(redIsNext);
			this.setState({
				board: current,
				redIsNext: !redIsNext,
			});
		};
	}

	render() {
		const current = this.state.board;
		const redIsNext = this.state.redIsNext;
		return (
			<div className="game">
			<div className="status">Current Player Turn: {this.state.redIsNext ? "Red" : "Blue"}</div>
				<Board board={current} redIsNext={redIsNext} handleSquareClick={this.handleSquareClick.bind(this)} />
			</div>
		);
	}
}

function getCurrentPlayerColor(redIsNext) {
	return redIsNext ? "red" : "blue";
}

ReactDOM.render(<Game />, document.getElementById('root'));