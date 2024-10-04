let grid;
let selectedCell = null;
let score = 0;
let level = 0;
const gridSize = 8; // Size of the grid
const colors = ['red', 'blue', 'green', 'yellow', 'purple'];

// Fetch and render the grid
async function fetchGrid() {
    const response = await fetch('/grid');
    grid = await response.json();
    renderGrid();
}

// Render the grid and display level and score
function renderGrid() {
    const container = document.getElementById('game-container');
    container.innerHTML = '';
    grid.forEach((row, rowIndex) => {
        row.forEach((color, colIndex) => {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.style.backgroundColor = color;
            cell.dataset.row = rowIndex;
            cell.dataset.col = colIndex;
            cell.addEventListener('click', handleCellClick);
            container.appendChild(cell);
        });
    });

    document.getElementById('level').innerText = `Level: ${level + 1}`;
    document.getElementById('score').innerText = `Score: ${score}`;
}

// Handle cell click
function handleCellClick(event) {
    const row = event.target.dataset.row;
    const col = event.target.dataset.col;

    if (selectedCell) {
        // Swap logic
        if (isAdjacent(selectedCell, { row, col })) {
            swapCells(selectedCell, { row, col });
            if (!checkMatches()) {
                // If no matches, swap back
                swapCells(selectedCell, { row, col });
            }
        }
        selectedCell = null;
    } else {
        selectedCell = { row, col };
    }
}

// Check if two cells are adjacent
function isAdjacent(cell1, cell2) {
    const rowDiff = Math.abs(cell1.row - cell2.row);
    const colDiff = Math.abs(cell1.col - cell2.col);
    return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
}

// Swap two cells
function swapCells(cell1, cell2) {
    const temp = grid[cell1.row][cell1.col];
    grid[cell1.row][cell1.col] = grid[cell2.row][cell2.col];
    grid[cell2.row][cell2.col] = temp;
    renderGrid();
}

// Check for matches and remove them
function checkMatches() {
    let hasMatches = false;

    // Horizontal matches
    for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize - 2; c++) {
            if (grid[r][c] && grid[r][c] === grid[r][c + 1] && grid[r][c] === grid[r][c + 2]) {
                let matchCount = 3;
                while (c + matchCount < gridSize && grid[r][c] === grid[r][c + matchCount]) {
                    matchCount++;
                }
                score += matchCount * 10; // Increment score based on match count
                for (let i = 0; i < matchCount; i++) {
                    grid[r][c + i] = null; // Remove matched candies
                }
                hasMatches = true;
            }
        }
    }

    // Vertical matches
    for (let c = 0; c < gridSize; c++) {
        for (let r = 0; r < gridSize - 2; r++) {
            if (grid[r][c] && grid[r][c] === grid[r + 1][c] && grid[r][c] === grid[r + 2][c]) {
                let matchCount = 3;
                while (r + matchCount < gridSize && grid[r][c] === grid[r + matchCount][c]) {
                    matchCount++;
                }
                score += matchCount * 10; // Increment score based on match count
                for (let i = 0; i < matchCount; i++) {
                    grid[r + i][c] = null; // Remove matched candies
                }
                hasMatches = true;
            }
        }
    }

    if (hasMatches) {
        // Refill the grid and render
        refillGrid();
        checkLevelProgression(); // Check if the level is complete
        return true; // Matches were found
    }
    return false; // No matches found
}

// Refill the grid after matches
function refillGrid() {
    for (let r = gridSize - 1; r >= 0; r--) {
        for (let c = 0; c < gridSize; c++) {
            if (grid[r][c] === null) {
                grid[r][c] = colors[Math.floor(Math.random() * colors.length)];
            }
        }
    }
    renderGrid();
}

// Check if level is complete
function checkLevelProgression() {
    if (score >= 300) {
        alert("Level complete! Moving to the next level.");
        nextLevel();
    }
}

// Handle level progression
function nextLevel() {
    if (level < 4) {
        level++;
        // You can change complexity here, for now just fetch the grid
        fetchGrid();
    } else {
        alert("You've completed all levels!");
    }
}

// Initialize the game
fetchGrid();

