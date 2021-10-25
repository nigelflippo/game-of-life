class Game {
	constructor() {
		this.canvas = document.getElementById("canvas");
		this.ctx = this.canvas.getContext("2d");
		this.grid;
		this.cellSize = 8;
		this.rows = 100;
		this.columns = 100;
		this.init();
	}

	_isAlive(x, y) {
		if (x < 0 || y < 0 || x >= this.columns || y >= this.rows) {
			return;
		}
		return this.grid[x][y].currState;
	}

	createGrid() {
		this.canvas.height = this.cellSize * this.rows;
		this.canvas.width = this.cellSize * this.columns;

		this.grid = new Array(this.rows);
		for (let r = 0; r < this.rows; r++) {
			this.grid[r] = new Array(this.columns);
			for (let c = 0; c < this.columns; c++) {
				this.grid[r][c] = new Cell(this.ctx, r, c, this.cellSize);
			}
		}
	}

	checkCell() {
		const directions = [
			[1, 0],
			[0, 1],
			[-1, 0],
			[0, -1],
			[1, 1],
			[-1, 1],
			[1, -1],
			[-1, -1]
		];

		for (let x = 0; x < this.rows; x++) {
			for (let y = 0; y < this.columns; y++) {
				const numAlive = directions.reduce((total, direction) => {
					if (this._isAlive(x + direction[0], y + direction[1])) {
						total++;
					}
					return total;
				}, 0);
				this.setNextCellState(this.grid[x][y], numAlive);
			}
		}
		this.updateCellState();
	}

	setNextCellState(gridCell, numAlive) {
		if (numAlive === 2) {
			gridCell.nextState = gridCell.currState;
		} else if (numAlive === 3) {
			gridCell.nextState = true;
		} else {
			gridCell.nextState = false;
		}
	}

	updateCellState() {
		for (let r = 0; r < this.rows; r++) {
			for (let c = 0; c < this.columns; c++) {
				this.grid[r][c].currState = this.grid[r][c].nextState;
			}
		}
	}

	update() {
		this.checkCell();
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		for (let r = 0; r < this.rows; r++) {
			for (let c = 0; c < this.columns; c++) {
				this.grid[r][c].draw();
			}
		}
		requestAnimationFrame(() => this.update());
	}

	init() {
		this.createGrid();
		requestAnimationFrame(() => this.update());
	}
}

class Cell {
	constructor(ctx, x, y, size) {
		this.ctx = ctx;
		this.x = x;
		this.y = y;
		this.size = size;
		this.nextState = undefined;
		this.currState = Math.random() > 0.5;
	}

	draw() {
		this.ctx.fillStyle = this.currState ? "#333" : "#fff";
		this.ctx.beginPath();
		this.ctx.arc(
			this.x * this.size,
			this.y * this.size,
			this.size / 2,
			0,
			2 * Math.PI
		);
		this.ctx.fill();
	}
}

new Game();
